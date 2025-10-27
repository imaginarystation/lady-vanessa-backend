const express = require('express');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

// Create payment intent for an order
router.post('/create-intent', paymentController.createPaymentIntent);

// Confirm a payment
router.post('/confirm', paymentController.confirmPayment);

// Get payment status for an order
router.get('/status/:orderId', paymentController.getPaymentStatus);

// Cancel a payment
router.post('/cancel', paymentController.cancelPayment);

// Refund a payment
router.post('/refund', paymentController.refundPayment);

// Stripe webhook endpoint (raw body parsing handled in app.js)
router.post('/webhook', paymentController.handleWebhook);

module.exports = router;
