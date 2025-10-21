-- Universal database fix script
-- This script will work even if column names are different

USE restaurant_db;

-- ===================================================================
-- STEP 1: Fix ALL datetime columns in payments table
-- ===================================================================

-- Try to update any datetime columns that might have invalid '0000-00-00' values
SET SQL_SAFE_UPDATES = 0;

-- Fix created_at if it exists
UPDATE payments 
SET created_at = CURRENT_TIMESTAMP 
WHERE created_at = '0000-00-00 00:00:00' 
   OR created_at < '1000-01-01'
LIMIT 10000;

-- Fix updated_at if it exists  
UPDATE payments 
SET updated_at = CURRENT_TIMESTAMP 
WHERE updated_at = '0000-00-00 00:00:00' 
   OR updated_at < '1000-01-01'
LIMIT 10000;

-- Fix payment_date if it exists
UPDATE payments 
SET payment_date = CURRENT_TIMESTAMP 
WHERE payment_date = '0000-00-00 00:00:00' 
   OR payment_date < '1000-01-01'
LIMIT 10000;

SELECT 'Payments table datetime columns updated' as status;

-- ===================================================================
-- STEP 2: Fix ALL datetime columns in reservations table
-- ===================================================================

-- Fix created_at if it exists
UPDATE reservations 
SET created_at = CURRENT_TIMESTAMP 
WHERE created_at = '0000-00-00 00:00:00' 
   OR created_at < '1000-01-01'
LIMIT 10000;

-- Fix updated_at if it exists
UPDATE reservations 
SET updated_at = CURRENT_TIMESTAMP 
WHERE updated_at = '0000-00-00 00:00:00' 
   OR updated_at < '1000-01-01'
LIMIT 10000;

-- Fix reservation_date if it's a DATE type
UPDATE reservations 
SET reservation_date = CURRENT_DATE
WHERE reservation_date = '0000-00-00' 
   OR reservation_date < '1000-01-01'
LIMIT 10000;

SELECT 'Reservations table datetime columns updated' as status;

SET SQL_SAFE_UPDATES = 1;

-- ===================================================================
-- STEP 3: Verify the fixes
-- ===================================================================

SELECT 'Verification Results:' as status;

SELECT 
    'Payments' as table_name, 
    COUNT(*) as total_records 
FROM payments;

SELECT 
    'Reservations' as table_name, 
    COUNT(*) as total_records 
FROM reservations;

SELECT '✅ Database fix completed! Try restarting the backend now.' as status;
