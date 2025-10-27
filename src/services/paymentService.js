const stripe = (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.trim())
    ? require('stripe')(process.env.STRIPE_SECRET_KEY)
    : null;
const { Order } = require('../models');

class PaymentService {
    /**
     * Ensure Stripe is configured
     * @private
     */
    _ensureStripeConfigured() {
        if (!stripe) {
            throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
        }
    }

    /**
     * Create a payment intent for an order
     * @param {number} orderId - The ID of the order
     * @param {object} paymentData - Payment metadata
     * @returns {object} Payment intent details
     */
    async createPaymentIntent(orderId, paymentData = {}) {
        this._ensureStripeConfigured();
        
        try {
            // Get the order
            const order = await Order.findByPk(orderId);
            if (!order) {
                throw new Error('Order not found');
            }

            // Check if order already has a payment intent
            if (order.paymentIntentId) {
                // Retrieve existing payment intent
                const existingIntent = await stripe.paymentIntents.retrieve(order.paymentIntentId);
                if (existingIntent.status !== 'canceled') {
                    return {
                        paymentIntent: existingIntent,
                        clientSecret: existingIntent.client_secret
                    };
                }
            }

            // Create payment intent
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(parseFloat(order.totalPrice) * 100), // Convert to cents
                currency: paymentData.currency || 'usd',
                metadata: {
                    orderId: order.id.toString(),
                    userId: order.userId.toString(),
                    ...paymentData.metadata
                },
                description: `Payment for Order #${order.id}`,
            });

            // Update order with payment intent ID
            await order.update({
                paymentIntentId: paymentIntent.id,
                paymentStatus: 'pending'
            });

            return {
                paymentIntent,
                clientSecret: paymentIntent.client_secret
            };
        } catch (error) {
            throw new Error('Error creating payment intent: ' + error.message);
        }
    }

    /**
     * Confirm a payment intent
     * @param {string} paymentIntentId - The payment intent ID
     * @param {string} paymentMethodId - The payment method ID (optional)
     * @returns {object} Confirmed payment intent
     */
    async confirmPayment(paymentIntentId, paymentMethodId = null) {
        this._ensureStripeConfigured();
        
        try {
            const params = {};
            if (paymentMethodId) {
                params.payment_method = paymentMethodId;
            }

            const paymentIntent = await stripe.paymentIntents.confirm(
                paymentIntentId,
                params
            );

            // Update order payment status
            const order = await Order.findOne({
                where: { paymentIntentId }
            });

            if (order) {
                await order.update({
                    paymentStatus: paymentIntent.status,
                    paymentMethod: paymentIntent.payment_method
                });
            }

            return paymentIntent;
        } catch (error) {
            throw new Error('Error confirming payment: ' + error.message);
        }
    }

    /**
     * Get payment status for an order
     * @param {number} orderId - The order ID
     * @returns {object} Payment status details
     */
    async getPaymentStatus(orderId) {
        this._ensureStripeConfigured();
        
        try {
            const order = await Order.findByPk(orderId);
            if (!order) {
                throw new Error('Order not found');
            }

            if (!order.paymentIntentId) {
                return {
                    status: 'no_payment',
                    message: 'No payment initiated for this order'
                };
            }

            // Get payment intent from Stripe
            const paymentIntent = await stripe.paymentIntents.retrieve(order.paymentIntentId);

            // Update local order status if needed
            if (order.paymentStatus !== paymentIntent.status) {
                await order.update({
                    paymentStatus: paymentIntent.status
                });
            }

            return {
                orderId: order.id,
                paymentIntentId: paymentIntent.id,
                status: paymentIntent.status,
                amount: paymentIntent.amount / 100,
                currency: paymentIntent.currency,
                paymentMethod: paymentIntent.payment_method
            };
        } catch (error) {
            throw new Error('Error fetching payment status: ' + error.message);
        }
    }

    /**
     * Cancel a payment intent
     * @param {number} orderId - The order ID
     * @returns {object} Cancelled payment intent
     */
    async cancelPayment(orderId) {
        this._ensureStripeConfigured();
        
        try {
            const order = await Order.findByPk(orderId);
            if (!order) {
                throw new Error('Order not found');
            }

            if (!order.paymentIntentId) {
                throw new Error('No payment intent found for this order');
            }

            const paymentIntent = await stripe.paymentIntents.cancel(order.paymentIntentId);

            // Update order
            await order.update({
                paymentStatus: 'canceled'
            });

            return paymentIntent;
        } catch (error) {
            throw new Error('Error canceling payment: ' + error.message);
        }
    }

    /**
     * Process webhook events from Stripe
     * @param {object} event - The Stripe webhook event object containing type and data
     * @param {string} event.type - The type of event (e.g., 'payment_intent.succeeded')
     * @param {object} event.data - The event data object
     * @param {object} event.data.object - The Stripe object (e.g., payment intent)
     * @returns {Promise<object>} Processing result with processed status, orderId, and eventType
     * @throws {Error} If there's an error processing the webhook
     */
    async handleWebhook(event) {
        try {
            const paymentIntent = event.data.object;

            // Find the order
            const order = await Order.findOne({
                where: { paymentIntentId: paymentIntent.id }
            });

            if (!order) {
                console.warn(`Order not found for payment intent: ${paymentIntent.id}`);
                return { processed: false, message: 'Order not found' };
            }

            // Update order based on event type
            switch (event.type) {
                case 'payment_intent.succeeded':
                    await order.update({
                        paymentStatus: 'succeeded',
                        status: 'Processing',
                        paymentMethod: paymentIntent.payment_method
                    });
                    break;

                case 'payment_intent.payment_failed':
                    await order.update({
                        paymentStatus: 'failed'
                    });
                    break;

                case 'payment_intent.canceled':
                    await order.update({
                        paymentStatus: 'canceled'
                    });
                    break;

                case 'payment_intent.processing':
                    await order.update({
                        paymentStatus: 'processing'
                    });
                    break;

                default:
                    console.log(`Unhandled event type: ${event.type}`);
            }

            return {
                processed: true,
                orderId: order.id,
                eventType: event.type
            };
        } catch (error) {
            throw new Error('Error handling webhook: ' + error.message);
        }
    }

    /**
     * Verify webhook signature
     * @param {string} payload - The raw request body
     * @param {string} signature - The Stripe signature header
     * @returns {object} The verified event
     */
    constructWebhookEvent(payload, signature) {
        this._ensureStripeConfigured();
        
        try {
            const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
            if (!webhookSecret) {
                throw new Error('Webhook secret not configured');
            }

            return stripe.webhooks.constructEvent(
                payload,
                signature,
                webhookSecret
            );
        } catch (error) {
            throw new Error('Webhook signature verification failed: ' + error.message);
        }
    }

    /**
     * Refund a payment
     * @param {number} orderId - The order ID
     * @param {number} amount - Amount to refund (optional, defaults to full amount)
     * @returns {object} Refund details
     */
    async refundPayment(orderId, amount = null) {
        this._ensureStripeConfigured();
        
        try {
            const order = await Order.findByPk(orderId);
            if (!order) {
                throw new Error('Order not found');
            }

            if (!order.paymentIntentId) {
                throw new Error('No payment intent found for this order');
            }

            const refundParams = {
                payment_intent: order.paymentIntentId
            };

            if (amount) {
                refundParams.amount = Math.round(parseFloat(amount) * 100); // Convert to cents
            }

            const refund = await stripe.refunds.create(refundParams);

            // Update order status
            await order.update({
                paymentStatus: 'refunded',
                status: 'Refunded'
            });

            return refund;
        } catch (error) {
            throw new Error('Error processing refund: ' + error.message);
        }
    }
}

module.exports = new PaymentService();
