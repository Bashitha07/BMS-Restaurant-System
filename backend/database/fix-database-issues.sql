-- Fix invalid datetime values in database
-- Run this script to resolve startup errors

USE restaurant_db;

-- First, let's see what columns exist in the tables
DESCRIBE payments;
DESCRIBE reservations;

-- Try to fix payments table - checking multiple possible column names
-- Comment out the ones that don't apply to your schema

-- Option 1: If column is 'submitted_date'
UPDATE payments 
SET submitted_date = CURRENT_TIMESTAMP 
WHERE submitted_date = '0000-00-00 00:00:00' 
   OR submitted_date IS NULL
LIMIT 1000;

-- Option 2: If column is 'payment_date' (uncomment if needed)
-- UPDATE payments 
-- SET payment_date = CURRENT_TIMESTAMP 
-- WHERE payment_date = '0000-00-00 00:00:00' 
--    OR payment_date IS NULL;

-- Option 3: If column is 'created_at' (uncomment if needed)
-- UPDATE payments 
-- SET created_at = CURRENT_TIMESTAMP 
-- WHERE created_at = '0000-00-00 00:00:00' 
--    OR created_at IS NULL;


-- Try to fix reservations table - checking multiple possible column names

-- Option 1: If column is 'reservation_date_time'
UPDATE reservations 
SET reservation_date_time = CURRENT_TIMESTAMP 
WHERE reservation_date_time = '0000-00-00 00:00:00' 
   OR reservation_date_time IS NULL
LIMIT 1000;

-- Option 2: If column is 'reservation_date' (uncomment if needed)
-- UPDATE reservations 
-- SET reservation_date = CURRENT_DATE
-- WHERE reservation_date = '0000-00-00' 
--    OR reservation_date IS NULL;

-- Verify the fixes
SELECT 'Checking payments table...' as status;
SELECT COUNT(*) as total_payments FROM payments;

SELECT 'Checking reservations table...' as status;
SELECT COUNT(*) as total_reservations FROM reservations;

SELECT 'Database fix script completed!' as status;
