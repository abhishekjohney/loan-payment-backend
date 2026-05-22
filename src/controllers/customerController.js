const Customer = require('../models/customer');

/**
 * Customer Controller
 * Handles HTTP request/response logic for customer-related endpoints.
 */
const customerController = {
  /**
   * GET /api/customers
   * Retrieve loan details of all customers
   */
  async getAllCustomers(req, res, next) {
    try {
      const customers = await Customer.findAll();
      res.status(200).json({
        success: true,
        count: customers.length,
        data: customers,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/customers/:account_number
   * Retrieve loan details of a specific customer
   */
  async getCustomerByAccount(req, res, next) {
    try {
      const { account_number } = req.params;
      const customer = await Customer.findByAccountNumber(account_number);

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: `Customer with account number ${account_number} not found`,
        });
      }

      res.status(200).json({
        success: true,
        data: customer,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = customerController;
