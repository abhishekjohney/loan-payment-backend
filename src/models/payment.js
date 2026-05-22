const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

/**
 * Payment Model (MySQL Version)
 * Handles all database operations related to EMI payments.
 */
const Payment = {
  /**
   * Create a new payment record
   * @param {Object} paymentData - Payment details
   * @param {number} paymentData.customerId - The customer's ID
   * @param {string} paymentData.accountNumber - The customer's account number
   * @param {number} paymentData.amount - Payment amount
   * @param {string} paymentData.status - Payment status (SUCCESS, PENDING, FAILED)
   * @returns {Promise<Object>} Created payment record
   */
  async create({ customerId, accountNumber, amount, status = 'SUCCESS' }) {
    // Generate unique reference ID
    const referenceId = `PAY-${Date.now()}-${uuidv4().substring(0, 8)}`;
    
    // MySQL does not support INSERT RETURNING. We insert, capture insertId, and select.
    const result = await db.query(
      `INSERT INTO payments (customer_id, account_number, payment_amount, status, reference_id, payment_date)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [customerId, accountNumber, amount, status, referenceId]
    );
    
    const insertId = result.insertId;

    const rows = await db.query(
      `SELECT 
        id,
        customer_id,
        account_number,
        DATE_FORMAT(payment_date, '%Y-%m-%d %H:%i:%s') AS payment_date,
        payment_amount,
        status,
        reference_id,
        created_at
      FROM payments 
      WHERE id = ?`,
      [insertId]
    );

    return rows[0];
  },

  /**
   * Get all payments for a specific account number
   * @param {string} accountNumber - The customer's account number
   * @returns {Promise<Array>} List of payment records
   */
  async findByAccountNumber(accountNumber) {
    const rows = await db.query(
      `SELECT 
        p.id,
        p.customer_id,
        p.account_number,
        DATE_FORMAT(p.payment_date, '%Y-%m-%d %H:%i:%s') AS payment_date,
        p.payment_amount,
        p.status,
        p.reference_id,
        c.customer_name
      FROM payments p
      JOIN customers c ON p.customer_id = c.id
      WHERE p.account_number = ?
      ORDER BY p.payment_date DESC`,
      [accountNumber]
    );
    return rows;
  },

  /**
   * Get all payments
   * @returns {Promise<Array>} List of all payment records
   */
  async findAll() {
    const rows = await db.query(
      `SELECT 
        p.id,
        p.customer_id,
        p.account_number,
        DATE_FORMAT(p.payment_date, '%Y-%m-%d %H:%i:%s') AS payment_date,
        p.payment_amount,
        p.status,
        p.reference_id,
        c.customer_name
      FROM payments p
      JOIN customers c ON p.customer_id = c.id
      ORDER BY p.payment_date DESC`
    );
    return rows;
  },
};

module.exports = Payment;
