-- Fix existing database to match the schema
-- Run this script to fix datetime column issues in your existing database

USE restaurant_db;

-- Disable safe updates temporarily
SET SQL_SAFE_UPDATES = 0;

-- ===================================================================
-- FIX PAYMENTS TABLE
-- ===================================================================

-- Check if the payments table has the correct structure
-- If 'payment_date' column exists, fix any invalid dates
UPDATE payments 
SET payment_date = CURRENT_TIMESTAMP 
WHERE payment_date IS NULL 
   OR payment_date = '0000-00-00 00:00:00' 
   OR payment_date < '1000-01-01 00:00:00'
LIMIT 10000;

-- If your payments table has 'created_at', fix it too
UPDATE payments 
SET created_at = CURRENT_TIMESTAMP 
WHERE created_at IS NULL 
   OR created_at = '0000-00-00 00:00:00' 
   OR created_at < '1000-01-01 00:00:00'
LIMIT 10000;

-- If your payments table has 'updated_at', fix it too
UPDATE payments 
SET updated_at = CURRENT_TIMESTAMP 
WHERE updated_at IS NULL 
   OR updated_at = '0000-00-00 00:00:00' 
   OR updated_at < '1000-01-01 00:00:00'
LIMIT 10000;

SELECT '✓ Fixed payments table' as status;

-- ===================================================================
-- FIX RESERVATIONS TABLE
-- ===================================================================

-- Fix reservation_date if it's a DATE column
UPDATE reservations 
SET reservation_date = CURRENT_DATE
WHERE reservation_date IS NULL 
   OR reservation_date = '0000-00-00' 
   OR reservation_date < '1000-01-01'
LIMIT 10000;

-- Fix reservation_time if it exists
UPDATE reservations 
SET reservation_time = CURRENT_TIME
WHERE reservation_time IS NULL 
   OR reservation_time = '00:00:00'
LIMIT 10000;

-- Fix created_at if it exists
UPDATE reservations 
SET created_at = CURRENT_TIMESTAMP 
WHERE created_at IS NULL 
   OR created_at = '0000-00-00 00:00:00' 
   OR created_at < '1000-01-01 00:00:00'
LIMIT 10000;

-- Fix updated_at if it exists
UPDATE reservations 
SET updated_at = CURRENT_TIMESTAMP 
WHERE updated_at IS NULL 
   OR updated_at = '0000-00-00 00:00:00' 
   OR updated_at < '1000-01-01 00:00:00'
LIMIT 10000;

SELECT '✓ Fixed reservations table' as status;

-- ===================================================================
-- FIX ORDERS TABLE
-- ===================================================================

-- Fix order_date if it exists
UPDATE orders 
SET order_date = CURRENT_TIMESTAMP 
WHERE order_date IS NULL 
   OR order_date = '0000-00-00 00:00:00' 
   OR order_date < '1000-01-01 00:00:00'
LIMIT 10000;

-- Fix updated_at if it exists
UPDATE orders 
SET updated_at = CURRENT_TIMESTAMP 
WHERE updated_at IS NULL 
   OR updated_at = '0000-00-00 00:00:00' 
   OR updated_at < '1000-01-01 00:00:00'
LIMIT 10000;

SELECT '✓ Fixed orders table' as status;

-- ===================================================================
-- FIX USERS TABLE
-- ===================================================================

-- Fix created_at if it exists
UPDATE users 
SET created_at = CURRENT_TIMESTAMP 
WHERE created_at IS NULL 
   OR created_at = '0000-00-00 00:00:00' 
   OR created_at < '1000-01-01 00:00:00'
LIMIT 10000;

-- Fix updated_at if it exists
UPDATE users 
SET updated_at = CURRENT_TIMESTAMP 
WHERE updated_at IS NULL 
   OR updated_at = '0000-00-00 00:00:00' 
   OR updated_at < '1000-01-01 00:00:00'
LIMIT 10000;

SELECT '✓ Fixed users table' as status;

-- ===================================================================
-- FIX MENU_ITEMS TABLE
-- ===================================================================

-- Fix created_at if it exists
UPDATE menu_items 
SET created_at = CURRENT_TIMESTAMP 
WHERE created_at IS NULL 
   OR created_at = '0000-00-00 00:00:00' 
   OR created_at < '1000-01-01 00:00:00'
LIMIT 10000;

-- Fix updated_at if it exists
UPDATE menu_items 
SET updated_at = CURRENT_TIMESTAMP 
WHERE updated_at IS NULL 
   OR updated_at = '0000-00-00 00:00:00' 
   OR updated_at < '1000-01-01 00:00:00'
LIMIT 10000;

SELECT '✓ Fixed menu_items table' as status;

-- ===================================================================
-- FIX MENU_CATEGORIES TABLE
-- ===================================================================

-- Fix created_at if it exists
UPDATE menu_categories 
SET created_at = CURRENT_TIMESTAMP 
WHERE created_at IS NULL 
   OR created_at = '0000-00-00 00:00:00' 
   OR created_at < '1000-01-01 00:00:00'
LIMIT 10000;

-- Fix updated_at if it exists
UPDATE menu_categories 
SET updated_at = CURRENT_TIMESTAMP 
WHERE updated_at IS NULL 
   OR updated_at = '0000-00-00 00:00:00' 
   OR updated_at < '1000-01-01 00:00:00'
LIMIT 10000;

SELECT '✓ Fixed menu_categories table' as status;

-- Re-enable safe updates
SET SQL_SAFE_UPDATES = 1;

-- ===================================================================
-- VERIFICATION
-- ===================================================================

SELECT '=====================================' as '';
SELECT 'DATABASE FIX COMPLETED!' as '';
SELECT '=====================================' as '';

SELECT 'Table Statistics:' as '';
SELECT 'users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'payments', COUNT(*) FROM payments
UNION ALL
SELECT 'reservations', COUNT(*) FROM reservations
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'menu_items', COUNT(*) FROM menu_items
UNION ALL
SELECT 'menu_categories', COUNT(*) FROM menu_categories;

SELECT '' as '';
SELECT '✅ All invalid datetime values have been fixed!' as status;
SELECT '✅ You can now restart the Spring Boot backend.' as status;
SELECT '✅ Run: .\\start-backend.bat' as status;
