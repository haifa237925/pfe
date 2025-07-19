const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Create payment intent
router.post('/create-payment-intent', authenticateToken, paymentController.createPaymentIntent);

// Complete purchase
router.post('/complete', authenticateToken, paymentController.completePurchase);

// Get payment history
router.get('/history', authenticateToken, paymentController.getPaymentHistory);

module.exports = router;