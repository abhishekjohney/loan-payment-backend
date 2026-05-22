const { body, param, validationResult } = require('express-validator');

/**
 * Validation Middleware
 * Provides reusable validation chains for request data.
 */

// Validate payment request body
const validatePayment = [
  body('account_number')
    .notEmpty()
    .withMessage('Account number is required')
    .isString()
    .withMessage('Account number must be a string')
    .trim(),
  body('amount')
    .notEmpty()
    .withMessage('Payment amount is required')
    .isFloat({ min: 0.01 })
    .withMessage('Payment amount must be a positive number'),
];

// Validate account number parameter
const validateAccountNumber = [
  param('account_number')
    .notEmpty()
    .withMessage('Account number is required')
    .isString()
    .withMessage('Account number must be a string')
    .trim(),
];

/**
 * Middleware to check validation results
 * Returns 400 with error details if validation fails
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

module.exports = {
  validatePayment,
  validateAccountNumber,
  handleValidationErrors,
};
