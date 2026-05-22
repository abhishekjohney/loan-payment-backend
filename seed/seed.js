/**
 * Database Seed Script
 * Populates the database with sample customer and payment data
 * Run with: npm run seed
 */

const db = require('../src/config/db');

const seedData = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // Clear existing data
    console.log('Clearing existing data...');
    await db.query('TRUNCATE TABLE payments');
    await db.query('TRUNCATE TABLE customers');

    // Insert sample customers
    console.log('Inserting sample customers...');
    const customers = [
      {
        account_number: 'ACC-1001',
        customer_name: 'Rahul Sharma',
        issue_date: '2024-01-15',
        interest_rate: 10.5,
        tenure: 24,
        loan_amount: 500000.0,
        emi_due: 23265.0,
        outstanding_balance: 412265.0,
      },
      {
        account_number: 'ACC-1002',
        customer_name: 'Priya Menon',
        issue_date: '2024-03-22',
        interest_rate: 9.75,
        tenure: 36,
        loan_amount: 750000.0,
        emi_due: 24025.0,
        outstanding_balance: 625200.0,
      },
      {
        account_number: 'ACC-1003',
        customer_name: 'Amit Patel',
        issue_date: '2023-11-10',
        interest_rate: 11.0,
        tenure: 48,
        loan_amount: 1000000.0,
        emi_due: 25855.0,
        outstanding_balance: 760000.0,
      },
      {
        account_number: 'ACC-1004',
        customer_name: 'Sneha Nair',
        issue_date: '2024-06-05',
        interest_rate: 10.0,
        tenure: 12,
        loan_amount: 200000.0,
        emi_due: 17585.0,
        outstanding_balance: 174000.0,
      },
      {
        account_number: 'ACC-1005',
        customer_name: 'Vikram Reddy',
        issue_date: '2024-02-18',
        interest_rate: 9.5,
        tenure: 60,
        loan_amount: 1500000.0,
        emi_due: 31487.0,
        outstanding_balance: 1200000.0,
      },
      {
        account_number: 'ACC-1006',
        customer_name: 'Anjali Gupta',
        issue_date: '2023-09-01',
        interest_rate: 10.25,
        tenure: 36,
        loan_amount: 800000.0,
        emi_due: 25935.0,
        outstanding_balance: 640000.0,
      },
      {
        account_number: 'ACC-1007',
        customer_name: 'Rohan Desai',
        issue_date: '2024-04-12',
        interest_rate: 11.5,
        tenure: 24,
        loan_amount: 350000.0,
        emi_due: 16425.0,
        outstanding_balance: 280000.0,
      },
      {
        account_number: 'ACC-1008',
        customer_name: 'Meera Krishnan',
        issue_date: '2024-07-20',
        interest_rate: 9.0,
        tenure: 48,
        loan_amount: 600000.0,
        emi_due: 14922.0,
        outstanding_balance: 480000.0,
      },
    ];

    for (const customer of customers) {
      await db.query(
        `INSERT INTO customers (account_number, customer_name, issue_date, interest_rate, tenure, loan_amount, emi_due, outstanding_balance)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          customer.account_number,
          customer.customer_name,
          customer.issue_date,
          customer.interest_rate,
          customer.tenure,
          customer.loan_amount,
          customer.emi_due,
          customer.outstanding_balance,
        ]
      );
    }

    console.log(`✓ Inserted ${customers.length} customers`);

    // Insert sample payments
    console.log('Inserting sample payments...');
    const payments = [
      {
        customer_id: 1,
        account_number: 'ACC-1001',
        payment_date: '2024-02-15 10:30:00',
        payment_amount: 23265.0,
        status: 'SUCCESS',
        reference_id: 'PAY-2024021500001',
      },
      {
        customer_id: 1,
        account_number: 'ACC-1001',
        payment_date: '2024-03-15 11:45:00',
        payment_amount: 23265.0,
        status: 'SUCCESS',
        reference_id: 'PAY-2024031500002',
      },
      {
        customer_id: 2,
        account_number: 'ACC-1002',
        payment_date: '2024-04-22 09:15:00',
        payment_amount: 24025.0,
        status: 'SUCCESS',
        reference_id: 'PAY-2024042200003',
      },
      {
        customer_id: 3,
        account_number: 'ACC-1003',
        payment_date: '2023-12-10 14:00:00',
        payment_amount: 25855.0,
        status: 'SUCCESS',
        reference_id: 'PAY-2023121000004',
      },
      {
        customer_id: 3,
        account_number: 'ACC-1003',
        payment_date: '2024-01-10 10:20:00',
        payment_amount: 25855.0,
        status: 'SUCCESS',
        reference_id: 'PAY-2024011000005',
      },
      {
        customer_id: 4,
        account_number: 'ACC-1004',
        payment_date: '2024-07-05 16:30:00',
        payment_amount: 17585.0,
        status: 'SUCCESS',
        reference_id: 'PAY-2024070500006',
      },
      {
        customer_id: 5,
        account_number: 'ACC-1005',
        payment_date: '2024-03-18 08:45:00',
        payment_amount: 31487.0,
        status: 'SUCCESS',
        reference_id: 'PAY-2024031800007',
      },
    ];

    for (const payment of payments) {
      await db.query(
        `INSERT INTO payments (customer_id, account_number, payment_date, payment_amount, status, reference_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          payment.customer_id,
          payment.account_number,
          payment.payment_date,
          payment.payment_amount,
          payment.status,
          payment.reference_id,
        ]
      );
    }

    console.log(`✓ Inserted ${payments.length} payments`);

    console.log('✅ Database seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed
seedData();
