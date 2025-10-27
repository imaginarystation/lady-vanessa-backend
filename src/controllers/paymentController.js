const PaymentService = require('../services/paymentService');

class PaymentController {
    /**
     * Create a payment intent for an order
     * POST /api/payments/create-intent
     * Body: { orderId, currency?, metadata? }
     */
    async createPaymentIntent(req, res) {
        try {
            const { orderId, currency, metadata } = req.body;

            if (!orderId) {
                return res.status(400).json({
                    success: false,
                    message: 'Order ID is required'
                });
            }

            const paymentData = {
                currency: currency || 'usd',
                metadata: metadata || {}
            };

            const result = await PaymentService.createPaymentIntent(orderId, paymentData);

            res.status(200).json({
                success: true,
                message: 'Payment intent created successfully',
                data: {
                    clientSecret: result.clientSecret,
                    paymentIntentId: result.paymentIntent.id,
                    amount: result.paymentIntent.amount / 100,
                    currency: result.paymentIntent.currency
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating payment intent',
                error: error.message
            });
        }
    }

    /**
     * Confirm a payment
     * POST /api/payments/confirm
     * Body: { paymentIntentId, paymentMethodId? }
     */
    async confirmPayment(req, res) {
        try {
            const { paymentIntentId, paymentMethodId } = req.body;

            if (!paymentIntentId) {
                return res.status(400).json({
                    success: false,
                    message: 'Payment intent ID is required'
                });
            }

            const paymentIntent = await PaymentService.confirmPayment(
                paymentIntentId,
                paymentMethodId
            );

            res.status(200).json({
                success: true,
                message: 'Payment confirmed',
                data: {
                    id: paymentIntent.id,
                    status: paymentIntent.status,
                    amount: paymentIntent.amount / 100,
                    currency: paymentIntent.currency
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error confirming payment',
                error: error.message
            });
        }
    }

    /**
     * Get payment status for an order
     * GET /api/payments/status/:orderId
     */
    async getPaymentStatus(req, res) {
        try {
            const { orderId } = req.params;

            const status = await PaymentService.getPaymentStatus(orderId);

            res.status(200).json({
                success: true,
                data: status
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching payment status',
                error: error.message
            });
        }
    }

    /**
     * Cancel a payment
     * POST /api/payments/cancel
     * Body: { orderId }
     */
    async cancelPayment(req, res) {
        try {
            const { orderId } = req.body;

            if (!orderId) {
                return res.status(400).json({
                    success: false,
                    message: 'Order ID is required'
                });
            }

            const paymentIntent = await PaymentService.cancelPayment(orderId);

            res.status(200).json({
                success: true,
                message: 'Payment canceled successfully',
                data: {
                    id: paymentIntent.id,
                    status: paymentIntent.status
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error canceling payment',
                error: error.message
            });
        }
    }

    /**
     * Handle Stripe webhook events
     * POST /api/payments/webhook
     */
    async handleWebhook(req, res) {
        try {
            const signature = req.headers['stripe-signature'];

            if (!signature) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing stripe-signature header'
                });
            }

            // For webhooks, req.body is already raw buffer from express.raw()
            const payload = req.body;

            // Verify and construct the event
            const event = PaymentService.constructWebhookEvent(
                payload,
                signature
            );

            // Process the event
            const result = await PaymentService.handleWebhook(event);

            res.status(200).json({
                success: true,
                message: 'Webhook processed',
                data: result
            });
        } catch (error) {
            console.error('Webhook error:', error.message);
            res.status(400).json({
                success: false,
                message: 'Webhook error',
                error: error.message
            });
        }
    }

    /**
     * Refund a payment
     * POST /api/payments/refund
     * Body: { orderId, amount? }
     */
    async refundPayment(req, res) {
        try {
            const { orderId, amount } = req.body;

            if (!orderId) {
                return res.status(400).json({
                    success: false,
                    message: 'Order ID is required'
                });
            }

            const refund = await PaymentService.refundPayment(orderId, amount);

            res.status(200).json({
                success: true,
                message: 'Payment refunded successfully',
                data: {
                    id: refund.id,
                    status: refund.status,
                    amount: refund.amount / 100,
                    currency: refund.currency
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error processing refund',
                error: error.message
            });
        }
    }
}

module.exports = new PaymentController();
