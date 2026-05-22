-- =====================================================
-- Payment Collection App - Database Schema (MySQL)
-- =====================================================

-- Drop tables if they exist (for fresh setup)
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS customers;

-- ─── Customers Table ─────────────────────────────────
-- Stores personal loan details for each customer
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_number VARCHAR(20) NOT NULL UNIQUE,
    customer_name VARCHAR(100) NOT NULL,
    issue_date DATE NOT NULL,
    interest_rate DECIMAL(5, 2) NOT NULL,
    tenure INT NOT NULL,                          -- Tenure in months
    loan_amount DECIMAL(12, 2) NOT NULL,
    emi_due DECIMAL(10, 2) NOT NULL,
    outstanding_balance DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_customers_account (account_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── Payments Table ──────────────────────────────────
-- Tracks all EMI payments made by customers
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    account_number VARCHAR(20) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'SUCCESS',
    reference_id VARCHAR(50) UNIQUE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (account_number) REFERENCES customers(account_number) ON DELETE CASCADE,
    INDEX idx_payments_account (account_number),
    INDEX idx_payments_date (payment_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── Seed Data: Sample Customers ─────────────────────
INSERT INTO customers (account_number, customer_name, issue_date, interest_rate, tenure, loan_amount, emi_due, outstanding_balance) VALUES
('ACC-1001', 'Rahul Sharma',   '2024-01-15', 10.50, 24, 500000.00, 23265.00, 412265.00),
('ACC-1002', 'Priya Menon',    '2024-03-22', 9.75,  36, 750000.00, 24025.00, 625200.00),
('ACC-1003', 'Amit Patel',     '2023-11-10', 11.00, 48, 1000000.00, 25855.00, 760000.00),
('ACC-1004', 'Sneha Nair',     '2024-06-05', 10.00, 12, 200000.00, 17585.00, 174000.00),
('ACC-1005', 'Vikram Reddy',   '2024-02-18', 9.50,  60, 1500000.00, 31487.00, 1200000.00),
('ACC-1006', 'Anjali Gupta',   '2023-09-01', 10.25, 36, 800000.00, 25935.00, 640000.00),
('ACC-1007', 'Rohan Desai',    '2024-04-12', 11.50, 24, 350000.00, 16425.00, 280000.00),
('ACC-1008', 'Meera Krishnan', '2024-07-20', 9.00,  48, 600000.00, 14922.00, 480000.00);

-- ─── Seed Data: Sample Payments ──────────────────────
INSERT INTO payments (customer_id, account_number, payment_date, payment_amount, status, reference_id) VALUES
(1, 'ACC-1001', '2024-02-15 10:30:00', 23265.00, 'SUCCESS', 'PAY-2024021500001'),
(1, 'ACC-1001', '2024-03-15 11:45:00', 23265.00, 'SUCCESS', 'PAY-2024031500002'),
(2, 'ACC-1002', '2024-04-22 09:15:00', 24025.00, 'SUCCESS', 'PAY-2024042200003'),
(3, 'ACC-1003', '2023-12-10 14:00:00', 25855.00, 'SUCCESS', 'PAY-2023121000004'),
(3, 'ACC-1003', '2024-01-10 10:20:00', 25855.00, 'SUCCESS', 'PAY-2024011000005'),
(4, 'ACC-1004', '2024-07-05 16:30:00', 17585.00, 'SUCCESS', 'PAY-2024070500006'),
(5, 'ACC-1005', '2024-03-18 08:45:00', 31487.00, 'SUCCESS', 'PAY-2024031800007');
