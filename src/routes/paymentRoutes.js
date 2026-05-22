const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

/**
 * Payment Routes
 * 
 * GET  /api/payments                   - Get all payments
 * POST /api/payments                   - Make a new payment
 * GET  /api/payments/:account_number   - Get payment history for an account
 */

router.get('/', paymentController.getAllPayments);
router.post('/', paymentController.makePayment);
router.get('/:account_number', paymentController.getPaymentHistory);

module.exports = router;
