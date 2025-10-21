-- ============================================
-- Restaurant System - Populate Empty Tables Only
-- ============================================

USE restaurant_db;

-- ============================================
-- 1. ORDER_TRACKING TABLE (Currently: 0 records)
-- ============================================
INSERT INTO order_tracking (
    order_id, status, title, description, timestamp, completed, actor
) VALUES
(1, 'PENDING', 'Order Placed',
 'Your order has been received and is awaiting confirmation.',
 DATE_SUB(NOW(), INTERVAL 180 MINUTE), TRUE, 'System'),
 
(1, 'CONFIRMED', 'Order Confirmed',
 'Your order has been confirmed by the restaurant.',
 DATE_SUB(NOW(), INTERVAL 170 MINUTE), TRUE, 'admin'),
 
(1, 'PREPARING', 'Preparing Your Food',
 'Our chefs are preparing your delicious meal.',
 DATE_SUB(NOW(), INTERVAL 150 MINUTE), TRUE, 'chef_mike'),
 
(1, 'READY_FOR_PICKUP', 'Order Ready',
 'Your order is ready and waiting for pickup by delivery driver.',
 DATE_SUB(NOW(), INTERVAL 60 MINUTE), TRUE, 'chef_mike'),
 
(1, 'OUT_FOR_DELIVERY', 'Out for Delivery',
 'Your order is on the way! Driver: James Wilson',
 DATE_SUB(NOW(), INTERVAL 30 MINUTE), TRUE, 'james_driver'),
 
(1, 'DELIVERED', 'Delivered Successfully',
 'Your order has been delivered. Enjoy your meal!',
 NOW(), TRUE, 'james_driver'),

-- Order 2 tracking
(2, 'PENDING', 'Order Placed',
 'Your order has been received.',
 DATE_SUB(NOW(), INTERVAL 60 MINUTE), TRUE, 'System'),
 
(2, 'CONFIRMED', 'Order Confirmed',
 'Your order is being prepared.',
 DATE_SUB(NOW(), INTERVAL 50 MINUTE), TRUE, 'admin'),
 
(2, 'OUT_FOR_DELIVERY', 'Out for Delivery',
 'Driver Maria Garcia is on the way!',
 DATE_SUB(NOW(), INTERVAL 15 MINUTE), FALSE, 'maria_driver');

-- ============================================
-- 2. PAYMENTS TABLE (Currently: 0 records)
-- ============================================
INSERT INTO payments (
    order_id, amount, payment_method, status,
    transaction_id, slip_image, payment_gateway,
    gateway_transaction_id, submitted_date, processed_date,
    approved_date, created_at, updated_at
) VALUES
(1, 45.50, 'CARD', 'COMPLETED',
 'TXN-2025-001', NULL, 'STRIPE',
 'ch_3Q5xYZ1234567890', DATE_SUB(NOW(), INTERVAL 3 HOUR),
 DATE_SUB(NOW(), INTERVAL 179 MINUTE), DATE_SUB(NOW(), INTERVAL 179 MINUTE),
 DATE_SUB(NOW(), INTERVAL 3 HOUR), DATE_SUB(NOW(), INTERVAL 179 MINUTE)),
 
(2, 78.25, 'BANK_TRANSFER', 'PENDING',
 'TXN-2025-002', '/uploads/slips/slip_001.jpg', 'BANK_TRANSFER',
 NULL, DATE_SUB(NOW(), INTERVAL 1 HOUR),
 NULL, NULL,
 DATE_SUB(NOW(), INTERVAL 1 HOUR), NOW()),
 
(3, 32.50, 'CASH', 'COMPLETED',
 'TXN-2025-003', NULL, NULL,
 NULL, DATE_SUB(NOW(), INTERVAL 5 HOUR),
 DATE_SUB(NOW(), INTERVAL 295 MINUTE), DATE_SUB(NOW(), INTERVAL 295 MINUTE),
 DATE_SUB(NOW(), INTERVAL 5 HOUR), DATE_SUB(NOW(), INTERVAL 295 MINUTE)),

(4, 25.75, 'CREDIT_CARD', 'PENDING',
 'TXN-2025-004', NULL, 'STRIPE',
 NULL, DATE_SUB(NOW(), INTERVAL 10 MINUTE),
 NULL, NULL,
 DATE_SUB(NOW(), INTERVAL 10 MINUTE), NOW()),

(5, 89.90, 'CREDIT_CARD', 'COMPLETED',
 'TXN-2025-005', NULL, 'STRIPE',
 'ch_3Q5abc9876543210', DATE_SUB(NOW(), INTERVAL 26 HOUR),
 DATE_SUB(NOW(), INTERVAL 1550 MINUTE), DATE_SUB(NOW(), INTERVAL 1550 MINUTE),
 DATE_SUB(NOW(), INTERVAL 26 HOUR), DATE_SUB(NOW(), INTERVAL 1550 MINUTE));

-- ============================================
-- 3. PAYMENT_SLIPS TABLE (Currently: 0 records)
-- ============================================
INSERT INTO payment_slips (
    order_id, user_id, file_name, file_path, file_size,
    content_type, payment_amount, payment_date, status,
    uploaded_at, confirmed_at, confirmed_by,
    admin_notes, bank_name, transaction_reference
) VALUES
(2, 2, 'payment_slip_20251020_001.jpg',
 '/uploads/slips/payment_slip_20251020_001.jpg', 245678,
 'image/jpeg', 78.25, DATE_SUB(NOW(), INTERVAL 2 HOUR),
 'PENDING', DATE_SUB(NOW(), INTERVAL 90 MINUTE),
 NULL, NULL,
 'Awaiting admin verification.',
 'City National Bank', 'BNK-TXN-20251020-78956'),
 
(3, 3, 'payment_slip_20251020_002.jpg',
 '/uploads/slips/payment_slip_20251020_002.jpg', 189432,
 'image/jpeg', 32.50, DATE_SUB(NOW(), INTERVAL 5 HOUR),
 'CONFIRMED', DATE_SUB(NOW(), INTERVAL 290 MINUTE),
 DATE_SUB(NOW(), INTERVAL 285 MINUTE), 'admin',
 'Payment verified and confirmed. All good.',
 'First Bank', 'BNK-TXN-20251020-45123'),

(5, 3, 'payment_slip_20251019_001.jpg',
 '/uploads/slips/payment_slip_20251019_001.jpg', 312456,
 'image/jpeg', 89.90, DATE_SUB(NOW(), INTERVAL 26 HOUR),
 'CONFIRMED', DATE_SUB(NOW(), INTERVAL 1560 MINUTE),
 DATE_SUB(NOW(), INTERVAL 1550 MINUTE), 'admin',
 'Verified yesterday payment.',
 'City National Bank', 'BNK-TXN-20251019-12345');

-- ============================================
-- 4. RESERVATIONS TABLE (Currently: 0 records)
-- ============================================
INSERT INTO reservations (
    reservation_date, reservation_time, reservation_date_time,
    time_slot, number_of_people, status, customer_name,
    customer_email, customer_phone, special_requests,
    table_number, created_at, updated_at, confirmed_at,
    reminder_sent, admin_notes, user_id
) VALUES
('2025-10-25', '19:00:00', '2025-10-25 19:00:00',
 '19:00-20:30', 4, 'CONFIRMED',
 'John Customer', 'john.customer@email.com', '+1-555-1001',
 'Window seat preferred. Celebrating anniversary.',
 12, DATE_SUB(NOW(), INTERVAL 2 DAY), NOW(),
 DATE_SUB(NOW(), INTERVAL 47 HOUR),
 FALSE, 'VIP customer - provide complimentary dessert', 2),
 
(CURDATE(), '12:30:00', CONCAT(CURDATE(), ' 12:30:00'),
 '12:30-14:00', 2, 'PENDING',
 'Sarah Manager', 'sarah.manager@email.com', '+1-555-1002',
 'Business lunch. Quiet area preferred.',
 NULL, DATE_SUB(NOW(), INTERVAL 3 HOUR), NOW(),
 NULL, FALSE, NULL, 3),
 
(DATE_SUB(CURDATE(), INTERVAL 1 DAY), '18:00:00',
 DATE_SUB(NOW(), INTERVAL 26 HOUR),
 '18:00-19:30', 6, 'COMPLETED',
 'John Customer', 'john.customer@email.com', '+1-555-1001',
 'Birthday celebration. Need high chair for toddler.',
 8, DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 1565 MINUTE),
 DATE_SUB(NOW(), INTERVAL 71 HOUR),
 TRUE, 'Provided birthday cake. Great experience.', 2),

('2025-10-28', '20:00:00', '2025-10-28 20:00:00',
 '20:00-21:30', 8, 'PENDING',
 'Mike Chef', 'mike.chef@email.com', '+1-555-1003',
 'Corporate dinner. Need private section.',
 NULL, NOW(), NOW(),
 NULL, FALSE, NULL, 4),

('2025-10-27', '13:00:00', '2025-10-27 13:00:00',
 '13:00-14:30', 3, 'CONFIRMED',
 'John Customer', 'john.customer@email.com', '+1-555-1001',
 'Family lunch. Kids menu needed.',
 5, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW(),
 DATE_SUB(NOW(), INTERVAL 20 HOUR),
 FALSE, 'Regular customer - table 5 preferred', 2);

-- ============================================
-- 5. REVIEWS TABLE (Currently: 0 records)
-- ============================================
INSERT INTO reviews (
    user_id, menu_id, feedback, created_at, updated_at
) VALUES
(2, 1, 'Amazing spring rolls! Perfectly crispy and the sauce is incredible. Will definitely order again!',
 DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
 
(2, 2, 'Best chicken wings in town! The spicy flavor is just right, not too hot.',
 DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
 
(3, 3, 'Good garlic bread, could use more garlic butter though.',
 DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
 
(2, 4, 'Delicious! The cheese is perfectly melted and stretchy.',
 DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
 
(3, 5, 'Fresh and crispy. The homemade dressing is excellent.',
 DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),

(2, 6, 'Great burger! Cooked perfectly medium-rare.',
 DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),

(3, 7, 'Love this pizza! Best in the area.',
 DATE_SUB(NOW(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY)),

(4, 8, 'Pasta was delicious but could be larger portion.',
 DATE_SUB(NOW(), INTERVAL 1 WEEK), DATE_SUB(NOW(), INTERVAL 1 WEEK));

-- ============================================
-- 6. FEEDBACKS TABLE (Currently: 0 records)
-- ============================================
INSERT INTO feedbacks (
    user_id, menu_id, feedback, created_at, updated_at
) VALUES
(2, 9, 'The steak was cooked to perfection! Highly recommend.',
 DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
 
(3, 10, 'Salmon was fresh and flavorful. Will order again!',
 DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
 
(2, 11, 'Tacos were amazing! Just the right amount of spice.',
 DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),

(4, 12, 'Burrito was huge and delicious. Great value!',
 DATE_SUB(NOW(), INTERVAL 1 WEEK), DATE_SUB(NOW(), INTERVAL 1 WEEK)),

(3, 13, 'Soup was warm and comforting. Perfect for a cold day.',
 DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY));

-- ============================================
-- 7. DELIVERIES TABLE (Currently: 0 records)
-- ============================================
INSERT INTO deliveries (
    order_id, driver_id, delivery_address, delivery_phone,
    delivery_instructions, status, delivery_fee,
    estimated_delivery_time, actual_delivery_time, pickup_time,
    assigned_date, delivered_date, delivery_notes,
    current_latitude, current_longitude, delivery_latitude, delivery_longitude,
    distance_km, customer_rating, customer_feedback,
    proof_of_delivery, created_at, updated_at,
    driver_name, driver_phone, driver_vehicle
) VALUES
(1, 1, '789 Oak Avenue, Apt 4B, City, State 12345',
 '+1-555-1001', 'Ring doorbell twice. Leave at door if no answer.',
 'DELIVERED', 5.99,
 DATE_SUB(NOW(), INTERVAL 30 MINUTE), NOW(),
 DATE_SUB(NOW(), INTERVAL 45 MINUTE), DATE_SUB(NOW(), INTERVAL 1 HOUR),
 NOW(), 'Customer was very friendly. No issues.',
 40.7589, -73.9851, 40.7614, -73.9776,
 2.30, 5, 'Excellent service! Food arrived hot and driver was professional.',
 '/uploads/delivery/proof_001.jpg', DATE_SUB(NOW(), INTERVAL 3 HOUR), NOW(),
 'James Wilson', '+1-555-0101', 'Honda CBR 250R (MC-ABC-123)'),
 
(2, 2, '456 Elm Street, Unit 12, City, State 12345',
 '+1-555-1002', 'Call on arrival. Building has security.',
 'OUT_FOR_DELIVERY', 7.50,
 DATE_ADD(NOW(), INTERVAL 15 MINUTE), NULL,
 DATE_SUB(NOW(), INTERVAL 10 MINUTE), DATE_SUB(NOW(), INTERVAL 20 MINUTE),
 NULL, NULL,
 40.7580, -73.9855, 40.7489, -73.9680,
 4.50, NULL, NULL,
 NULL, DATE_SUB(NOW(), INTERVAL 1 HOUR), NOW(),
 'Maria Garcia', '+1-555-0201', 'Toyota Corolla (CAR-XYZ-456)'),

(5, 1, 'Restaurant - Dine In',
 '+1-555-1001', 'Completed dine-in order from yesterday.',
 'DELIVERED', 0.00,
 NULL, DATE_SUB(NOW(), INTERVAL 1470 MINUTE),
 NULL, DATE_SUB(NOW(), INTERVAL 26 HOUR),
 DATE_SUB(NOW(), INTERVAL 1470 MINUTE), 'Served in-house. Table 5. Great service.',
 NULL, NULL, NULL, NULL,
 0.00, 5, 'Wonderful dining experience! Everything was perfect.',
 NULL, DATE_SUB(NOW(), INTERVAL 26 HOUR), DATE_SUB(NOW(), INTERVAL 1470 MINUTE),
 'N/A', 'N/A', 'Dine-In Service');

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
SELECT '=== ORDER TRACKING ===' AS info;
SELECT COUNT(*) AS total FROM order_tracking;

SELECT '=== PAYMENTS ===' AS info;
SELECT COUNT(*) AS total FROM payments;

SELECT '=== PAYMENT SLIPS ===' AS info;
SELECT COUNT(*) AS total FROM payment_slips;

SELECT '=== RESERVATIONS ===' AS info;
SELECT COUNT(*) AS total FROM reservations;

SELECT '=== REVIEWS ===' AS info;
SELECT COUNT(*) AS total FROM reviews;

SELECT '=== FEEDBACKS ===' AS info;
SELECT COUNT(*) AS total FROM feedbacks;

SELECT '=== DELIVERIES ===' AS info;
SELECT COUNT(*) AS total FROM deliveries;

SELECT '=== ALL TABLES SUMMARY ===' AS info;
SELECT 
    (SELECT COUNT(*) FROM delivery_drivers) AS delivery_drivers,
    (SELECT COUNT(*) FROM drivers) AS drivers,
    (SELECT COUNT(*) FROM notifications) AS notifications,
    (SELECT COUNT(*) FROM order_items) AS order_items,
    (SELECT COUNT(*) FROM order_tracking) AS order_tracking,
    (SELECT COUNT(*) FROM payments) AS payments,
    (SELECT COUNT(*) FROM payment_slips) AS payment_slips,
    (SELECT COUNT(*) FROM reservations) AS reservations,
    (SELECT COUNT(*) FROM reviews) AS reviews,
    (SELECT COUNT(*) FROM feedbacks) AS feedbacks,
    (SELECT COUNT(*) FROM deliveries) AS deliveries,
    (SELECT COUNT(*) FROM menus) AS menus,
    (SELECT COUNT(*) FROM users) AS users,
    (SELECT COUNT(*) FROM orders) AS orders;
