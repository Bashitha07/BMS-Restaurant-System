-- ============================================
-- Restaurant System - Sample Orders
-- Creating orders first for foreign key dependencies
-- ============================================

USE restaurant_db;

-- ============================================
-- SAMPLE ORDERS
-- ============================================
-- Note: Using existing user IDs (2=john_customer, 3=sarah_manager, 4=chef_mike)
-- and menu items (1-60)

INSERT INTO orders (
    user_id, order_type, status, total_amount, subtotal, tax_amount, delivery_fee,
    payment_method, payment_status, delivery_address, delivery_phone,
    special_instructions, order_date, estimated_delivery_time, actual_delivery_time
) VALUES
-- Order 1: Completed delivery order
(
    2, 'DELIVERY', 'DELIVERED', 45.50, 39.51, 3.95, 5.99,
    'CREDIT_CARD', 'COMPLETED',
    '789 Oak Avenue, Apt 4B, City, State 12345',
    '+1-555-1001', 'Ring doorbell twice. Leave at door if no answer.',
    DATE_SUB(NOW(), INTERVAL 3 HOUR),
    DATE_SUB(NOW(), INTERVAL 135 MINUTE), NOW()
),
-- Order 2: In-progress delivery order
(
    2, 'DELIVERY', 'OUT_FOR_DELIVERY', 78.25, 65.26, 5.49, 7.50,
    'BANK_TRANSFER', 'PENDING',
    '456 Elm Street, Unit 12, City, State 12345',
    '+1-555-1002', 'Call on arrival. Building has security.',
    DATE_SUB(NOW(), INTERVAL 1 HOUR),
    DATE_ADD(NOW(), INTERVAL 15 MINUTE), NULL
),
-- Order 3: Preparing dine-in order
(
    3, 'DINE_IN', 'PREPARING', 32.50, 30.00, 2.50, 0.00,
    'CASH', 'PENDING',
    NULL, NULL, 'No onions in salad please.',
    DATE_SUB(NOW(), INTERVAL 30 MINUTE),
    NULL, NULL
),
-- Order 4: Pending pickup order
(
    2, 'PICKUP', 'PENDING', 25.75, 23.75, 2.00, 0.00,
    'CREDIT_CARD', 'PENDING',
    NULL, '+1-555-1001', 'Extra napkins please.',
    DATE_SUB(NOW(), INTERVAL 10 MINUTE),
    NULL, NULL
),
-- Order 5: Completed dine-in order from yesterday
(
    3, 'DINE_IN', 'DELIVERED', 89.90, 83.00, 6.90, 0.00,
    'CREDIT_CARD', 'COMPLETED',
    NULL, NULL, NULL,
    DATE_SUB(NOW(), INTERVAL 26 HOUR),
    NULL, DATE_SUB(NOW(), INTERVAL 1470 MINUTE)
);

-- Verification
SELECT '=== ORDERS CREATED ===' AS '';
SELECT id, user_id, order_type, status, total_amount, 
       DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') AS created
FROM orders
ORDER BY id;
