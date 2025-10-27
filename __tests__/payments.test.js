// Set test environment variables FIRST
process.env.STRIPE_SECRET_KEY = 'sk_test_fake_key_for_testing';
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_webhook_secret';

// Mock Stripe BEFORE any imports
jest.mock('stripe', () => {
    const mockPaymentIntents = {
        create: jest.fn(),
        retrieve: jest.fn(),
        confirm: jest.fn(),
        cancel: jest.fn(),
    };
    const mockRefunds = {
        create: jest.fn(),
    };
    const mockWebhooks = {
        constructEvent: jest.fn(),
    };

    const stripeMock = jest.fn(() => ({
        paymentIntents: mockPaymentIntents,
        refunds: mockRefunds,
        webhooks: mockWebhooks,
    }));

    return stripeMock;
});

require('./setup');
const request = require('supertest');
const app = require('../src/app');
const Order = require('../src/models/Order');
const User = require('../src/models/User');
const sequelize = require('../src/config/dbConfig');

const stripe = require('stripe')();

describe('Payment Endpoints', () => {
    let testUser;
    let testOrder;

    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    beforeEach(async () => {
        // Clear database
        await Order.destroy({ where: {}, truncate: true });
        await User.destroy({ where: {}, truncate: true });

        // Create test user
        testUser = await User.create({
            name: 'Test User',
            email: 'testuser@example.com',
            password: 'hashedpassword'
        });

        // Create test order
        testOrder = await Order.create({
            userId: testUser.id,
            totalPrice: 99.99,
            status: 'Pending'
        });

        // Reset all mocks
        jest.clearAllMocks();
    });

    describe('POST /api/payments/create-intent', () => {
        it('should create a payment intent for an order', async () => {
            const mockPaymentIntent = {
                id: 'pi_test123',
                amount: 9999,
                currency: 'usd',
                client_secret: 'pi_test123_secret',
                status: 'requires_payment_method'
            };

            stripe.paymentIntents.create.mockResolvedValue(mockPaymentIntent);

            const response = await request(app)
                .post('/api/payments/create-intent')
                .send({
                    orderId: testOrder.id,
                    currency: 'usd'
                })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('clientSecret');
            expect(response.body.data).toHaveProperty('paymentIntentId', 'pi_test123');
            expect(response.body.data.amount).toBe(99.99);

            // Verify order was updated
            const updatedOrder = await Order.findByPk(testOrder.id);
            expect(updatedOrder.paymentIntentId).toBe('pi_test123');
            expect(updatedOrder.paymentStatus).toBe('pending');
        });

        it('should return existing payment intent if already created', async () => {
            const existingPaymentIntent = {
                id: 'pi_existing123',
                amount: 9999,
                currency: 'usd',
                client_secret: 'pi_existing123_secret',
                status: 'requires_payment_method'
            };

            // Update order with existing payment intent
            await testOrder.update({
                paymentIntentId: 'pi_existing123',
                paymentStatus: 'pending'
            });

            stripe.paymentIntents.retrieve.mockResolvedValue(existingPaymentIntent);

            const response = await request(app)
                .post('/api/payments/create-intent')
                .send({
                    orderId: testOrder.id
                })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.paymentIntentId).toBe('pi_existing123');
            expect(stripe.paymentIntents.create).not.toHaveBeenCalled();
        });

        it('should return error if order not found', async () => {
            const response = await request(app)
                .post('/api/payments/create-intent')
                .send({
                    orderId: 99999
                })
                .expect(500);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('Error creating payment intent');
        });

        it('should return error if orderId is missing', async () => {
            const response = await request(app)
                .post('/api/payments/create-intent')
                .send({})
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Order ID is required');
        });
    });

    describe('POST /api/payments/confirm', () => {
        it('should confirm a payment', async () => {
            const mockConfirmedIntent = {
                id: 'pi_test123',
                amount: 9999,
                currency: 'usd',
                status: 'succeeded',
                payment_method: 'pm_test456'
            };

            await testOrder.update({
                paymentIntentId: 'pi_test123',
                paymentStatus: 'pending'
            });

            stripe.paymentIntents.confirm.mockResolvedValue(mockConfirmedIntent);

            const response = await request(app)
                .post('/api/payments/confirm')
                .send({
                    paymentIntentId: 'pi_test123',
                    paymentMethodId: 'pm_test456'
                })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.status).toBe('succeeded');

            // Verify order was updated
            const updatedOrder = await Order.findByPk(testOrder.id);
            expect(updatedOrder.paymentStatus).toBe('succeeded');
            expect(updatedOrder.paymentMethod).toBe('pm_test456');
        });

        it('should return error if paymentIntentId is missing', async () => {
            const response = await request(app)
                .post('/api/payments/confirm')
                .send({})
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Payment intent ID is required');
        });
    });

    describe('GET /api/payments/status/:orderId', () => {
        it('should get payment status for an order', async () => {
            const mockPaymentIntent = {
                id: 'pi_test123',
                amount: 9999,
                currency: 'usd',
                status: 'succeeded',
                payment_method: 'pm_test456'
            };

            await testOrder.update({
                paymentIntentId: 'pi_test123',
                paymentStatus: 'pending'
            });

            stripe.paymentIntents.retrieve.mockResolvedValue(mockPaymentIntent);

            const response = await request(app)
                .get(`/api/payments/status/${testOrder.id}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('orderId', testOrder.id);
            expect(response.body.data).toHaveProperty('status', 'succeeded');
            expect(response.body.data).toHaveProperty('amount', 99.99);
        });

        it('should return no_payment status if no payment initiated', async () => {
            const response = await request(app)
                .get(`/api/payments/status/${testOrder.id}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.status).toBe('no_payment');
        });
    });

    describe('POST /api/payments/cancel', () => {
        it('should cancel a payment', async () => {
            const mockCanceledIntent = {
                id: 'pi_test123',
                amount: 9999,
                currency: 'usd',
                status: 'canceled'
            };

            await testOrder.update({
                paymentIntentId: 'pi_test123',
                paymentStatus: 'pending'
            });

            stripe.paymentIntents.cancel.mockResolvedValue(mockCanceledIntent);

            const response = await request(app)
                .post('/api/payments/cancel')
                .send({
                    orderId: testOrder.id
                })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.status).toBe('canceled');

            // Verify order was updated
            const updatedOrder = await Order.findByPk(testOrder.id);
            expect(updatedOrder.paymentStatus).toBe('canceled');
        });

        it('should return error if orderId is missing', async () => {
            const response = await request(app)
                .post('/api/payments/cancel')
                .send({})
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Order ID is required');
        });
    });

    describe('POST /api/payments/refund', () => {
        it('should refund a payment', async () => {
            const mockRefund = {
                id: 'ref_test123',
                amount: 9999,
                currency: 'usd',
                status: 'succeeded'
            };

            await testOrder.update({
                paymentIntentId: 'pi_test123',
                paymentStatus: 'succeeded'
            });

            stripe.refunds.create.mockResolvedValue(mockRefund);

            const response = await request(app)
                .post('/api/payments/refund')
                .send({
                    orderId: testOrder.id
                })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.status).toBe('succeeded');

            // Verify order was updated
            const updatedOrder = await Order.findByPk(testOrder.id);
            expect(updatedOrder.paymentStatus).toBe('refunded');
            expect(updatedOrder.status).toBe('Refunded');
        });

        it('should refund partial amount', async () => {
            const mockRefund = {
                id: 'ref_test123',
                amount: 5000,
                currency: 'usd',
                status: 'succeeded'
            };

            await testOrder.update({
                paymentIntentId: 'pi_test123',
                paymentStatus: 'succeeded'
            });

            stripe.refunds.create.mockResolvedValue(mockRefund);

            const response = await request(app)
                .post('/api/payments/refund')
                .send({
                    orderId: testOrder.id,
                    amount: 50.00
                })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(stripe.refunds.create).toHaveBeenCalledWith({
                payment_intent: 'pi_test123',
                amount: 5000
            });
        });

        it('should return error if orderId is missing', async () => {
            const response = await request(app)
                .post('/api/payments/refund')
                .send({})
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Order ID is required');
        });
    });

    describe('POST /api/payments/webhook', () => {
        it('should return error if stripe-signature header is missing', async () => {
            const response = await request(app)
                .post('/api/payments/webhook')
                .send({})
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Missing stripe-signature header');
        });

        // Note: Full webhook integration testing requires actual Stripe webhook events
        // These are typically tested with Stripe CLI or in integration/E2E tests
        // The webhook handler logic is tested via PaymentService unit tests
    });
});
