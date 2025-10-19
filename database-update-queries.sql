-- ============================================
-- SIMPLIFIED DATABASE - QUICK UPDATE REFERENCE
-- ============================================
-- Common UPDATE operations for daily database management
-- All tables maintained, unnecessary fields removed
-- ============================================

USE restaurant_db;

-- ============================================
-- 1. USERS TABLE UPDATES
-- ============================================

-- Change user to admin
UPDATE users 
SET role = 'ADMIN', updated_at = NOW() 
WHERE username = 'testuser';

-- Disable user account
UPDATE users 
SET enabled = FALSE, updated_at = NOW() 
WHERE id = 5;

-- Enable user account
UPDATE users 
SET enabled = TRUE, updated_at = NOW() 
WHERE id = 5;

-- Update user email
UPDATE users 
SET email = 'newemail@restaurant.com', updated_at = NOW() 
WHERE id = 3;

-- Update user phone
UPDATE users 
SET phone = '0771234567', updated_at = NOW() 
WHERE id = 3;

-- ============================================
-- 2. MENUS TABLE UPDATES (21 Fields)
-- ============================================

-- Update menu price
UPDATE menus 
SET price = 950.00, updated_at = NOW() 
WHERE id = 1;

-- Make menu unavailable
UPDATE menus 
SET is_available = FALSE, updated_at = NOW() 
WHERE id = 2;

-- Make menu available
UPDATE menus 
SET is_available = TRUE, updated_at = NOW() 
WHERE id = 2;

-- Update menu description
UPDATE menus 
SET description = 'New delicious description', updated_at = NOW() 
WHERE id = 1;

-- Add discount to menu
UPDATE menus 
SET discount_percentage = 15.00, 
    discounted_price = price * 0.85,
    updated_at = NOW()
WHERE id = 1;

-- Remove discount
UPDATE menus 
SET discount_percentage = 0.00, 
    discounted_price = 0.00,
    updated_at = NOW()
WHERE id = 1;

-- Mark menu as featured
UPDATE menus 
SET is_featured = TRUE, updated_at = NOW() 
WHERE id = 1;

-- Update stock quantity
UPDATE menus 
SET stock_quantity = 50, updated_at = NOW() 
WHERE id = 1;

-- Update preparation time
UPDATE menus 
SET preparation_time = 30, updated_at = NOW() 
WHERE id = 1;

-- Update dietary flags
UPDATE menus 
SET is_vegetarian = TRUE, 
    is_vegan = FALSE,
    is_gluten_free = TRUE,
    updated_at = NOW()
WHERE id = 1;

-- Update spice level
UPDATE menus 
SET is_spicy = TRUE, 
    spice_level = 3,
    updated_at = NOW()
WHERE id = 1;

-- Bulk update category
UPDATE menus 
SET category = 'APPETIZER', updated_at = NOW() 
WHERE category = 'STARTER';

-- ============================================
-- 3. ORDERS TABLE UPDATES
-- ============================================

-- Update order status to CONFIRMED
UPDATE orders 
SET status = 'CONFIRMED', updated_at = NOW() 
WHERE id = 1;

-- Update order status to PREPARING
UPDATE orders 
SET status = 'PREPARING', updated_at = NOW() 
WHERE id = 1;

-- Update order status to READY
UPDATE orders 
SET status = 'READY', updated_at = NOW() 
WHERE id = 1;

-- Update order status to DELIVERED
UPDATE orders 
SET status = 'DELIVERED', updated_at = NOW() 
WHERE id = 1;

-- Cancel order
UPDATE orders 
SET status = 'CANCELLED', updated_at = NOW() 
WHERE id = 1;

-- Update delivery address
UPDATE orders 
SET delivery_address = '456 New Street, Colombo 5', updated_at = NOW() 
WHERE id = 1;

-- Update delivery phone
UPDATE orders 
SET delivery_phone = '0771234567', updated_at = NOW() 
WHERE id = 1;

-- Update total amount (recalculation)
UPDATE orders 
SET total_amount = (
    SELECT SUM(total_price) 
    FROM order_items 
    WHERE order_id = orders.id
),
updated_at = NOW()
WHERE id = 1;

-- ============================================
-- 4. ORDER_ITEMS TABLE UPDATES
-- ============================================

-- Update item quantity
UPDATE order_items 
SET quantity = 3,
    total_price = quantity * unit_price
WHERE id = 1;

-- Update unit price (if menu price changed)
UPDATE order_items oi
JOIN menus m ON oi.menu_id = m.id
SET oi.unit_price = m.price,
    oi.total_price = oi.quantity * m.price
WHERE oi.id = 1;

-- ============================================
-- 5. RESERVATIONS TABLE UPDATES
-- ============================================

-- Confirm reservation
UPDATE reservations 
SET status = 'CONFIRMED', updated_at = NOW() 
WHERE id = 1;

-- Cancel reservation
UPDATE reservations 
SET status = 'CANCELLED', updated_at = NOW() 
WHERE id = 1;

-- Update number of people
UPDATE reservations 
SET number_of_people = 6, updated_at = NOW() 
WHERE id = 1;

-- Update reservation date/time
UPDATE reservations 
SET reservation_date = '2025-10-25',
    reservation_time = '19:00:00',
    updated_at = NOW()
WHERE id = 1;

-- Update customer phone
UPDATE reservations 
SET customer_phone = '0771234567', updated_at = NOW() 
WHERE id = 1;

-- Update special requests
UPDATE reservations 
SET special_requests = 'Birthday celebration, need cake', updated_at = NOW() 
WHERE id = 1;

-- ============================================
-- 6. DRIVERS TABLE UPDATES
-- ============================================

-- Change driver status to AVAILABLE
UPDATE drivers 
SET status = 'AVAILABLE', updated_at = NOW() 
WHERE id = 1;

-- Change driver status to BUSY
UPDATE drivers 
SET status = 'BUSY', updated_at = NOW() 
WHERE id = 1;

-- Change driver status to OFFLINE
UPDATE drivers 
SET status = 'OFFLINE', updated_at = NOW() 
WHERE id = 1;

-- Update driver phone
UPDATE drivers 
SET phone = '0771234567', updated_at = NOW() 
WHERE id = 1;

-- Update driver email
UPDATE drivers 
SET email = 'newdriver@restaurant.com', updated_at = NOW() 
WHERE id = 1;

-- Update vehicle number
UPDATE drivers 
SET vehicle_number = 'ABC-5678', updated_at = NOW() 
WHERE id = 1;

-- ============================================
-- 7. DELIVERIES TABLE UPDATES
-- ============================================

-- Assign driver to delivery
UPDATE deliveries 
SET driver_id = 1, 
    status = 'ASSIGNED',
    updated_at = NOW()
WHERE id = 1;

-- Update delivery status to PICKED_UP
UPDATE deliveries 
SET status = 'PICKED_UP', updated_at = NOW() 
WHERE id = 1;

-- Update delivery status to IN_TRANSIT
UPDATE deliveries 
SET status = 'IN_TRANSIT', updated_at = NOW() 
WHERE id = 1;

-- Update delivery status to DELIVERED
UPDATE deliveries 
SET status = 'DELIVERED',
    actual_delivery_time = NOW(),
    updated_at = NOW()
WHERE id = 1;

-- Update estimated delivery time
UPDATE deliveries 
SET estimated_delivery_time = DATE_ADD(NOW(), INTERVAL 30 MINUTE),
    updated_at = NOW()
WHERE id = 1;

-- ============================================
-- 8. PAYMENTS TABLE UPDATES
-- ============================================

-- Update payment status to PENDING
UPDATE payments 
SET status = 'PENDING', updated_at = NOW() 
WHERE id = 1;

-- Update payment status to COMPLETED
UPDATE payments 
SET status = 'COMPLETED', updated_at = NOW() 
WHERE id = 1;

-- Update payment status to FAILED
UPDATE payments 
SET status = 'FAILED', updated_at = NOW() 
WHERE id = 1;

-- Add transaction ID
UPDATE payments 
SET transaction_id = 'TXN123456789', updated_at = NOW() 
WHERE id = 1;

-- Update payment method
UPDATE payments 
SET payment_method = 'CARD', updated_at = NOW() 
WHERE id = 1;

-- ============================================
-- 9. REVIEWS TABLE UPDATES
-- ============================================

-- Update review rating
UPDATE reviews 
SET rating = 5 
WHERE id = 1;

-- Update review comment
UPDATE reviews 
SET comment = 'Excellent food and service!' 
WHERE id = 1;

-- ============================================
-- BULK UPDATE EXAMPLES
-- ============================================

-- Mark all pending orders as confirmed
UPDATE orders 
SET status = 'CONFIRMED', updated_at = NOW() 
WHERE status = 'PENDING';

-- Make all out-of-stock menus unavailable
UPDATE menus 
SET is_available = FALSE, updated_at = NOW() 
WHERE stock_quantity < low_stock_threshold;

-- Apply 10% discount to all desserts
UPDATE menus 
SET discount_percentage = 10.00,
    discounted_price = price * 0.90,
    updated_at = NOW()
WHERE category = 'DESSERT';

-- Set all offline drivers to available
UPDATE drivers 
SET status = 'AVAILABLE', updated_at = NOW() 
WHERE status = 'OFFLINE';

-- Confirm all pending reservations for today
UPDATE reservations 
SET status = 'CONFIRMED', updated_at = NOW() 
WHERE status = 'PENDING' 
AND reservation_date = CURDATE();

-- ============================================
-- CONDITIONAL UPDATES
-- ============================================

-- Update order status based on delivery status
UPDATE orders o
JOIN deliveries d ON o.id = d.order_id
SET o.status = 'DELIVERED', o.updated_at = NOW()
WHERE d.status = 'DELIVERED';

-- Update menu availability based on stock
UPDATE menus 
SET is_available = CASE 
    WHEN stock_quantity > low_stock_threshold THEN TRUE 
    ELSE FALSE 
END,
updated_at = NOW();

-- Recalculate order totals from order items
UPDATE orders o
SET o.total_amount = (
    SELECT COALESCE(SUM(oi.total_price), 0)
    FROM order_items oi
    WHERE oi.order_id = o.id
),
o.updated_at = NOW();

-- ============================================
-- VERIFICATION QUERIES (Run after updates)
-- ============================================

-- Verify menu updates
SELECT id, name, price, is_available, discount_percentage, discounted_price 
FROM menus 
ORDER BY updated_at DESC 
LIMIT 5;

-- Verify order updates
SELECT id, status, total_amount, updated_at 
FROM orders 
ORDER BY updated_at DESC 
LIMIT 5;

-- Verify reservation updates
SELECT id, customer_name, status, reservation_date, reservation_time 
FROM reservations 
ORDER BY updated_at DESC 
LIMIT 5;

-- Verify payment updates
SELECT id, amount, status, payment_method, updated_at 
FROM payments 
ORDER BY updated_at DESC 
LIMIT 5;

-- Check all table record counts
SELECT 
    'users' AS table_name, COUNT(*) AS count FROM users
UNION ALL SELECT 'menus', COUNT(*) FROM menus
UNION ALL SELECT 'orders', COUNT(*) FROM orders
UNION ALL SELECT 'order_items', COUNT(*) FROM order_items
UNION ALL SELECT 'reservations', COUNT(*) FROM reservations
UNION ALL SELECT 'drivers', COUNT(*) FROM drivers
UNION ALL SELECT 'deliveries', COUNT(*) FROM deliveries
UNION ALL SELECT 'payments', COUNT(*) FROM payments
UNION ALL SELECT 'payment_slips', COUNT(*) FROM payment_slips
UNION ALL SELECT 'reviews', COUNT(*) FROM reviews;

-- ============================================
-- END OF QUICK UPDATE REFERENCE
-- ============================================
-- All 10 tables maintained with simplified fields
-- Easy to update, easy to maintain
-- ============================================
