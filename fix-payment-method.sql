-- Fix payment_method column in orders table to match backend enum values
-- Run this with: mysql -u root restaurant_db < fix-payment-method.sql

USE restaurant_db;

ALTER TABLE orders 
MODIFY COLUMN payment_method ENUM('DEPOSIT_SLIP', 'CASH_ON_DELIVERY') NULL;

-- Verify the change
DESCRIBE orders;
