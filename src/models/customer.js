const db = require('../config/db');

/**
 * Customer Model (MySQL Version)
 * Handles all database operations related to customers and their loan details.
 */
const Customer = {
  /**
   * Get all customers with their loan details
   * @returns {Promise<Array>} List of all customers
   */
  async findAll() {
    const rows = await db.query(
      `SELECT 
        id,
        account_number,
        customer_name,
        DATE_FORMAT(issue_date, '%Y-%m-%d') AS issue_date,
        interest_rate,
        tenure,
        loan_amount,
        emi_due,
        outstanding_balance,
        created_at
      FROM customers 
      ORDER BY created_at DESC`
    );
    return rows;
  },

  /**
   * Find a customer by account number
   * @param {string} accountNumber - The customer's account number
   * @returns {Promise<Object|null>} Customer object or null
   */
  async findByAccountNumber(accountNumber) {
    const rows = await db.query(
      `SELECT 
        id,
        account_number,
        customer_name,
        DATE_FORMAT(issue_date, '%Y-%m-%d') AS issue_date,
        interest_rate,
        tenure,
        loan_amount,
        emi_due,
        outstanding_balance,
        created_at
      FROM customers 
      WHERE account_number = ?`,
      [accountNumber]
    );
    return rows[0] || null;
  },

  /**
   * Update outstanding balance for a customer after payment
   * @param {string} accountNumber - The customer's account number
   * @param {number} amount - The payment amount to deduct from outstanding balance
   * @returns {Promise<Object>} Updated customer object
   */
  async updateOutstandingBalance(accountNumber, amount) {
    // MySQL does not support UPDATE RETURNING. Perform UPDATE then SELECT.
    await db.query(
      `UPDATE customers 
       SET outstanding_balance = outstanding_balance - ? 
       WHERE account_number = ?`,
      [amount, accountNumber]
    );
    return await this.findByAccountNumber(accountNumber);
  },
};

module.exports = Customer;
