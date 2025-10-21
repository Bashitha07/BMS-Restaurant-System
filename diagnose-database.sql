-- Diagnostic script to find actual column names in your database
-- Run this FIRST to see what columns exist

USE restaurant_db;

-- Show all columns in payments table
SELECT 'PAYMENTS TABLE COLUMNS:' as info;
SHOW COLUMNS FROM payments;

-- Show all columns in reservations table
SELECT 'RESERVATIONS TABLE COLUMNS:' as info;
SHOW COLUMNS FROM reservations;

-- Check for any records with problematic dates in payments
SELECT 'CHECKING PAYMENTS FOR INVALID DATES:' as info;
SELECT * FROM payments LIMIT 5;

-- Check for any records with problematic dates in reservations
SELECT 'CHECKING RESERVATIONS FOR INVALID DATES:' as info;
SELECT * FROM reservations LIMIT 5;

-- Show table creation statements
SELECT 'PAYMENTS TABLE STRUCTURE:' as info;
SHOW CREATE TABLE payments;

SELECT 'RESERVATIONS TABLE STRUCTURE:' as info;
SHOW CREATE TABLE reservations;
