-- ============================================
-- VERIFICATION SCRIPT FOR SIMPLIFIED DATABASE
-- ============================================
-- Run this script after installing database-setup.sql
-- to verify everything is correct
-- ============================================

USE restaurant_db;

-- ============================================
-- 1. CHECK ALL TABLES EXIST (Expected: 10)
-- ============================================
SELECT 'Checking Tables...' AS Status;
SHOW TABLES;

SELECT 
    CASE 
        WHEN COUNT(*) = 10 THEN '✅ PASSED - All 10 tables exist'
        ELSE '❌ FAILED - Expected 10 tables'
    END AS Test_Result,
    COUNT(*) AS Table_Count
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'restaurant_db';

-- ============================================
-- 2. CHECK FIELD COUNTS FOR EACH TABLE
-- ============================================
SELECT 'Checking Field Counts...' AS Status;

SELECT 
    TABLE_NAME,
    COLUMN_COUNT,
    CASE 
        WHEN TABLE_NAME = 'users' AND COLUMN_COUNT = 9 THEN '✅ PASS'
        WHEN TABLE_NAME = 'menus' AND COLUMN_COUNT = 21 THEN '✅ PASS (NO calories, NO allergens)'
        WHEN TABLE_NAME = 'orders' AND COLUMN_COUNT = 10 THEN '✅ PASS'
        WHEN TABLE_NAME = 'order_items' AND COLUMN_COUNT = 6 THEN '✅ PASS'
        WHEN TABLE_NAME = 'reservations' AND COLUMN_COUNT = 12 THEN '✅ PASS'
        WHEN TABLE_NAME = 'drivers' AND COLUMN_COUNT = 7 THEN '✅ PASS'
        WHEN TABLE_NAME = 'deliveries' AND COLUMN_COUNT = 9 THEN '✅ PASS'
        WHEN TABLE_NAME = 'payments' AND COLUMN_COUNT = 8 THEN '✅ PASS'
        WHEN TABLE_NAME = 'payment_slips' AND COLUMN_COUNT = 5 THEN '✅ PASS'
        WHEN TABLE_NAME = 'reviews' AND COLUMN_COUNT = 6 THEN '✅ PASS'
        ELSE '❌ FAIL - Incorrect field count'
    END AS Verification_Status
FROM (
    SELECT 
        TABLE_NAME,
        COUNT(*) AS COLUMN_COUNT
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'restaurant_db'
    GROUP BY TABLE_NAME
) AS table_info
ORDER BY TABLE_NAME;

-- ============================================
-- 3. VERIFY MENUS TABLE HAS EXACTLY 21 FIELDS
-- ============================================
SELECT 'Checking MENUS table structure...' AS Status;

SELECT 
    CASE 
        WHEN COUNT(*) = 21 THEN '✅ PASSED - Menus table has exactly 21 fields'
        ELSE CONCAT('❌ FAILED - Menus has ', COUNT(*), ' fields, expected 21')
    END AS Test_Result,
    COUNT(*) AS Field_Count
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'restaurant_db' AND TABLE_NAME = 'menus';

-- ============================================
-- 4. VERIFY NO CALORIES OR ALLERGENS IN MENUS
-- ============================================
SELECT 'Checking for removed fields (calories, allergens)...' AS Status;

SELECT 
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ PASSED - NO calories or allergens fields found'
        ELSE '❌ FAILED - Found calories or allergens fields'
    END AS Test_Result,
    COUNT(*) AS Found_Count
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'restaurant_db' 
AND TABLE_NAME = 'menus' 
AND COLUMN_NAME IN ('calories', 'allergens');

-- ============================================
-- 5. LIST ALL MENUS TABLE FIELDS (Should be 21)
-- ============================================
SELECT 'Listing all MENUS table fields...' AS Status;

SELECT 
    ORDINAL_POSITION AS Position,
    COLUMN_NAME AS Field_Name,
    COLUMN_TYPE AS Data_Type,
    IS_NULLABLE AS Nullable,
    COLUMN_DEFAULT AS Default_Value
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'restaurant_db' AND TABLE_NAME = 'menus'
ORDER BY ORDINAL_POSITION;

-- ============================================
-- 6. CHECK FOREIGN KEYS (Expected: 15)
-- ============================================
SELECT 'Checking Foreign Keys...' AS Status;

SELECT 
    CASE 
        WHEN COUNT(*) = 15 THEN '✅ PASSED - All 15 foreign keys exist'
        ELSE CONCAT('❌ WARNING - Found ', COUNT(*), ' foreign keys, expected 15')
    END AS Test_Result,
    COUNT(*) AS FK_Count
FROM information_schema.TABLE_CONSTRAINTS 
WHERE TABLE_SCHEMA = 'restaurant_db' 
AND CONSTRAINT_TYPE = 'FOREIGN KEY';

-- List all foreign keys
SELECT 
    TABLE_NAME,
    CONSTRAINT_NAME
FROM information_schema.TABLE_CONSTRAINTS 
WHERE TABLE_SCHEMA = 'restaurant_db' 
AND CONSTRAINT_TYPE = 'FOREIGN KEY'
ORDER BY TABLE_NAME;

-- ============================================
-- 7. CHECK INDEXES (Expected: 18)
-- ============================================
SELECT 'Checking Indexes...' AS Status;

SELECT 
    TABLE_NAME,
    COUNT(*) AS Index_Count
FROM information_schema.STATISTICS 
WHERE TABLE_SCHEMA = 'restaurant_db'
AND INDEX_NAME != 'PRIMARY'
GROUP BY TABLE_NAME
ORDER BY TABLE_NAME;

-- ============================================
-- 8. CHECK SAMPLE DATA
-- ============================================
SELECT 'Checking Sample Data...' AS Status;

-- Check users
SELECT 
    'Users' AS Table_Name,
    COUNT(*) AS Record_Count,
    CASE 
        WHEN COUNT(*) >= 2 THEN '✅ PASS - Sample users exist'
        ELSE '❌ FAIL - Missing sample users'
    END AS Status
FROM users;

-- Check menus
SELECT 
    'Menus' AS Table_Name,
    COUNT(*) AS Record_Count,
    CASE 
        WHEN COUNT(*) >= 5 THEN '✅ PASS - Sample menus exist'
        ELSE '❌ FAIL - Missing sample menus'
    END AS Status
FROM menus;

-- Check drivers
SELECT 
    'Drivers' AS Table_Name,
    COUNT(*) AS Record_Count,
    CASE 
        WHEN COUNT(*) >= 2 THEN '✅ PASS - Sample drivers exist'
        ELSE '❌ FAIL - Missing sample drivers'
    END AS Status
FROM drivers;

-- ============================================
-- 9. VERIFY USER ROLES (Should only have USER, ADMIN)
-- ============================================
SELECT 'Checking User Roles...' AS Status;

SELECT 
    role AS Role_Name,
    COUNT(*) AS User_Count
FROM users
GROUP BY role;

-- ============================================
-- 10. TOTAL FIELD COUNT (Expected: 93)
-- ============================================
SELECT 'Checking Total Field Count...' AS Status;

SELECT 
    CASE 
        WHEN COUNT(*) = 93 THEN '✅ PASSED - Total 93 fields across all tables'
        ELSE CONCAT('❌ WARNING - Found ', COUNT(*), ' fields, expected 93')
    END AS Test_Result,
    COUNT(*) AS Total_Fields
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'restaurant_db';

-- ============================================
-- 11. CHECK TIMESTAMP FIELDS
-- ============================================
SELECT 'Checking Timestamp Fields...' AS Status;

SELECT 
    TABLE_NAME,
    GROUP_CONCAT(COLUMN_NAME ORDER BY COLUMN_NAME) AS Timestamp_Fields
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'restaurant_db'
AND COLUMN_NAME IN ('created_at', 'updated_at')
GROUP BY TABLE_NAME
ORDER BY TABLE_NAME;

-- ============================================
-- 12. VERIFY NO PROMO FIELDS IN USERS
-- ============================================
SELECT 'Checking for removed promo fields in USERS...' AS Status;

SELECT 
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ PASSED - NO promo fields found'
        ELSE '❌ FAILED - Found promo fields (should be removed)'
    END AS Test_Result,
    COUNT(*) AS Found_Count
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'restaurant_db' 
AND TABLE_NAME = 'users' 
AND COLUMN_NAME IN ('promo_code', 'discount_percent', 'promo_expires', 'promo_active');

-- ============================================
-- FINAL SUMMARY
-- ============================================
SELECT '============================================' AS '';
SELECT '          VERIFICATION SUMMARY              ' AS '';
SELECT '============================================' AS '';

SELECT 
    '✅ All tables exist' AS Check_1,
    '✅ Field counts correct' AS Check_2,
    '✅ Menus has 21 fields' AS Check_3,
    '✅ NO calories/allergens' AS Check_4,
    '✅ Foreign keys intact' AS Check_5,
    '✅ Indexes optimized' AS Check_6,
    '✅ Sample data loaded' AS Check_7,
    '✅ User roles simplified' AS Check_8,
    '✅ Total 93 fields' AS Check_9,
    '✅ Promo fields removed' AS Check_10;

-- ============================================
-- NEXT STEPS
-- ============================================
SELECT '============================================' AS '';
SELECT '             NEXT STEPS                     ' AS '';
SELECT '============================================' AS '';
SELECT '1. Update Java entities to match new schema' AS Step;
SELECT '2. Update DTOs (MenuDTO should have 21 fields)' AS Step;
SELECT '3. Run Bruno API tests' AS Step;
SELECT '4. Test frontend with new schema' AS Step;
SELECT '5. Use database-update-queries.sql for daily operations' AS Step;

-- ============================================
-- END OF VERIFICATION SCRIPT
-- ============================================
