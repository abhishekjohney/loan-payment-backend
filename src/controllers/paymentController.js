const Customer = require('../models/customer');
const Payment = require('../models/payment');

/**
 * Payment Controller
 * Handles HTTP request/response logic for payment-related endpoints.
 */
const paymentController = {
  /**
   * POST /api/payments
   * Allow customers to make a payment for their personal loan
   * Body: { account_number: string, amount: number }
   */
  async makePayment(req, res, next) {
    try {
      const { account_number, amount } = req.body;

      // Validate required fields
      if (!account_number || !amount) {
        return res.status(400).json({
          success: false,
          message: 'account_number and amount are required',
        });
      }

      // Validate amount is a positive number
      const paymentAmount = parseFloat(amount);
      if (isNaN(paymentAmount) || paymentAmount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Payment amount must be a positive number',
        });
      }

      // Check if customer exists
      const customer = await Customer.findByAccountNumber(account_number);
      if (!customer) {
        return res.status(404).json({
          success: false,
          message: `Customer with account number ${account_number} not found`,
        });
      }

      // Check if payment amount exceeds outstanding balance
      if (paymentAmount > parseFloat(customer.outstanding_balance)) {
        return res.status(400).json({
          success: false,
          message: `Payment amount (₹${paymentAmount}) exceeds outstanding balance (₹${customer.outstanding_balance})`,
        });
      }

      // Create payment record
      const payment = await Payment.create({
        customerId: customer.id,
        accountNumber: account_number,
        amount: paymentAmount,
        status: 'SUCCESS',
      });

      // Update outstanding balance for the customer
      const updatedCustomer = await Customer.updateOutstandingBalance(account_number, paymentAmount);

      res.status(201).json({
        success: true,
        message: 'Payment processed successfully',
        data: {
          payment: payment,
          updatedLoanDetails: updatedCustomer,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/payments/:account_number
   * Retrieve payment history for a specific account
   */
  async getPaymentHistory(req, res, next) {
    try {
      const { account_number } = req.params;

      // Check if customer exists
      const customer = await Customer.findByAccountNumber(account_number);
      if (!customer) {
        return res.status(404).json({
          success: false,
          message: `Customer with account number ${account_number} not found`,
        });
      }

      const payments = await Payment.findByAccountNumber(account_number);

      res.status(200).json({
        success: true,
        count: payments.length,
        customer: {
          account_number: customer.account_number,
          customer_name: customer.customer_name,
          emi_due: customer.emi_due,
          outstanding_balance: customer.outstanding_balance,
        },
        data: payments,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/payments
   * Retrieve all payments
   */
  async getAllPayments(req, res, next) {
    try {
      const payments = await Payment.findAll();
      res.status(200).json({
        success: true,
        count: payments.length,
        data: payments,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = paymentController;
