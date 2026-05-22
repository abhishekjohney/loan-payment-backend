const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

/**
 * Customer Routes
 * 
 * GET  /api/customers                  - Get all customers with loan details
 * GET  /api/customers/:account_number  - Get a specific customer's loan details
 */

router.get('/', customerController.getAllCustomers);
router.get('/:account_number', customerController.getCustomerByAccount);

module.exports = router;
