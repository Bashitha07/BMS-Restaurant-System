-- ============================================
-- Restaurant System - Complete Sample Data (Fixed)
-- All Tables (Except menus, users, orders - already populated)
-- ============================================

USE restaurant_db;

-- ============================================
-- 1. DELIVERY_DRIVERS TABLE
-- ============================================
INSERT INTO delivery_drivers (
    name, email, username, password, phone, address,
    license_number, vehicle_number, vehicle_type, vehicle_model,
    status, hire_date, hourly_rate, commission_rate,
    total_deliveries, total_earnings, average_rating, total_ratings,
    is_active, current_location_lat, current_location_lng,
    max_delivery_distance, created_at, updated_at
) VALUES
('James Wilson', 'james.wilson@delivery.com', 'james_driver',
 '$2a$10$samplehash1', '+1-555-0101', '123 Delivery Lane, City',
 'DL-2020-001', 'MC-ABC-123', 'MOTORCYCLE', 'Honda CBR 250R',
 'AVAILABLE', NOW(), 15.00, 10.00,
 145, 2175.00, 4.75, 120,
 TRUE, 40.7128, -74.0060,
 15.00, NOW(), NOW()),
 
('Maria Garcia', 'maria.garcia@delivery.com', 'maria_driver',
 '$2a$10$samplehash2', '+1-555-0201', '456 Speed Road, City',
 'DL-2021-002', 'CAR-XYZ-456', 'CAR', 'Toyota Corolla 2022',
 'BUSY', NOW(), 18.00, 12.00,
 98, 1764.00, 4.85, 85,
 TRUE, 40.7580, -73.9855,
 25.00, NOW(), NOW()),
 
('Alex Chen', 'alex.chen@delivery.com', 'alex_driver',
 '$2a$10$samplehash3', '+1-555-0301', '789 Green Street, City',
 'DL-2022-003', 'BIKE-ECO-789', 'BICYCLE', 'Trek FX 3 Disc',
 'AVAILABLE', NOW(), 12.00, 8.00,
 67, 804.00, 4.90, 55,
 TRUE, 40.7489, -73.9680,
 5.00, NOW(), NOW());

-- ============================================
-- 2. DRIVERS TABLE (Legacy)
-- ============================================
INSERT INTO drivers (
    name, phone, email, vehicle_type, vehicle_number,
    license_number, status, rating, total_deliveries,
    created_at, updated_at
) VALUES
('Robert Martinez', '+1-555-0401', 'robert.m@delivery.com', 
 'MOTORCYCLE', 'MC-DEF-111', 'DL-2023-004', 
 'AVAILABLE', 4.65, 52, NOW(), NOW()),
 
('Emily Johnson', '+1-555-0501', 'emily.j@delivery.com',
 'CAR', 'CAR-GHI-222', 'DL-2023-005',
 'APPROVED', 4.80, 78, NOW(), NOW()),
 
('David Kim', '+1-555-0601', 'david.k@delivery.com',
 'MOTORCYCLE', 'MC-JKL-333', 'DL-2023-006',
 'OFFLINE', 4.55, 34, NOW(), NOW());

-- ============================================
-- 3. NOTIFICATIONS TABLE
-- ============================================
INSERT INTO notifications (
    title, message, type, status, user_id,
    reference_id, reference_type, is_global, created_at, read_at
) VALUES
('Welcome to Our Restaurant System',
 'Thank you for choosing our restaurant! Enjoy exclusive offers and fast service.',
 'SYSTEM_ANNOUNCEMENT', 'UNREAD', NULL,
 NULL, NULL, TRUE, NOW(), NULL),
 
('Order Confirmed',
 'Your order #1 has been confirmed and is being prepared.',
 'ORDER_CONFIRMATION', 'READ', 2,
 1, 'ORDER', FALSE, DATE_SUB(NOW(), INTERVAL 2 HOUR), DATE_SUB(NOW(), INTERVAL 1 HOUR)),
 
('Order Out for Delivery',
 'Your order #1 is on the way! Expected delivery in 20 minutes.',
 'DELIVERY_UPDATE', 'READ', 2,
 1, 'ORDER', FALSE, DATE_SUB(NOW(), INTERVAL 30 MINUTE), DATE_SUB(NOW(), INTERVAL 25 MINUTE)),
 
('Reservation Confirmed',
 'Your table for 4 people on 2025-10-25 at 7:00 PM has been confirmed.',
 'RESERVATION_CONFIRMATION', 'UNREAD', 2,
 1, 'RESERVATION', FALSE, NOW(), NULL),
 
('Special Weekend Offer!',
 'Get 20% off on all desserts this weekend. Use code: SWEET20',
 'PROMOTIONAL', 'UNREAD', NULL,
 NULL, NULL, TRUE, NOW(), NULL),
 
('Payment Received',
 'Your payment of $45.50 for Order #1 has been confirmed.',
 'PAYMENT_CONFIRMATION', 'READ', 2,
 1, 'PAYMENT', FALSE, DATE_SUB(NOW(), INTERVAL 3 HOUR), DATE_SUB(NOW(), INTERVAL 2 HOUR));

-- ============================================
-- 4. ORDER_ITEMS TABLE
-- ============================================
INSERT INTO order_items (
    quantity, unit_price, total_price, special_instructions,
    order_id, menu_id
) VALUES
(2, 6.99, 13.98, 'Extra spicy sauce', 1, 1),
(1, 9.99, 9.99, 'Well done', 1, 2),
(1, 8.99, 8.99, 'Dressing on the side', 1, 5),
(3, 11.99, 35.97, NULL, 2, 6),
(2, 14.99, 29.98, 'Extra cheese', 2, 7),
(1, 32.50, 32.50, 'No onions', 3, 8),
(2, 6.99, 13.98, NULL, 4, 1),
(1, 11.77, 11.77, NULL, 4, 4),
(2, 24.99, 49.98, 'Medium rare', 5, 9),
(1, 18.99, 18.99, NULL, 5, 10);

-- ============================================
-- 5. ORDER_TRACKING TABLE
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
 NOW(), TRUE, 'james_driver');

-- ============================================
-- 6. PAYMENTS TABLE
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
 DATE_SUB(NOW(), INTERVAL 5 HOUR), DATE_SUB(NOW(), INTERVAL 295 MINUTE));

-- ============================================
-- 7. PAYMENT_SLIPS TABLE
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
 'CONFIRMED', DATE_SUB(NOW(), INTERVAL 90 MINUTE),
 DATE_SUB(NOW(), INTERVAL 30 MINUTE), 'admin',
 'Payment verified and confirmed.',
 'City National Bank', 'BNK-TXN-20251020-78956'),
 
(3, 2, 'payment_slip_20251020_002.jpg',
 '/uploads/slips/payment_slip_20251020_002.jpg', 189432,
 'image/jpeg', 32.50, DATE_SUB(NOW(), INTERVAL 1 HOUR),
 'PENDING', DATE_SUB(NOW(), INTERVAL 45 MINUTE),
 NULL, NULL, NULL,
 'First Bank', 'BNK-TXN-20251020-45123');

-- ============================================
-- 8. RESERVATIONS TABLE
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
 TRUE, 'Provided birthday cake. Great experience.', 2);

-- ============================================
-- 9. REVIEWS TABLE
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
 DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY));

-- ============================================
-- 10. FEEDBACKS TABLE
-- ============================================
INSERT INTO feedbacks (
    user_id, menu_id, feedback, created_at, updated_at
) VALUES
(2, 6, 'The burger was cooked to perfection! Juicy and flavorful.',
 DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),
 
(3, 7, 'Great pizza! Thin crust and fresh toppings. Delivery was fast too.',
 DATE_SUB(NOW(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY)),
 
(2, 8, 'Pasta was good but portion size could be bigger.',
 DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY));

-- ============================================
-- 11. DELIVERIES TABLE
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
 'Maria Garcia', '+1-555-0201', 'Toyota Corolla (CAR-XYZ-456)');

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
SELECT '=== DELIVERY DRIVERS ===' AS info;
SELECT COUNT(*) AS total_delivery_drivers FROM delivery_drivers;

SELECT '=== DRIVERS ===' AS info;
SELECT COUNT(*) AS total_drivers FROM drivers;

SELECT '=== NOTIFICATIONS ===' AS info;
SELECT COUNT(*) AS total_notifications FROM notifications;

SELECT '=== ORDER ITEMS ===' AS info;
SELECT COUNT(*) AS total_order_items FROM order_items;

SELECT '=== ORDER TRACKING ===' AS info;
SELECT COUNT(*) AS total_tracking_records FROM order_tracking;

SELECT '=== PAYMENTS ===' AS info;
SELECT COUNT(*) AS total_payments FROM payments;

SELECT '=== PAYMENT SLIPS ===' AS info;
SELECT COUNT(*) AS total_payment_slips FROM payment_slips;

SELECT '=== RESERVATIONS ===' AS info;
SELECT COUNT(*) AS total_reservations FROM reservations;

SELECT '=== REVIEWS ===' AS info;
SELECT COUNT(*) AS total_reviews FROM reviews;

SELECT '=== FEEDBACKS ===' AS info;
SELECT COUNT(*) AS total_feedbacks FROM feedbacks;

SELECT '=== DELIVERIES ===' AS info;
SELECT COUNT(*) AS total_deliveries FROM deliveries;

SELECT '=== SUMMARY ===' AS info;
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
    (SELECT COUNT(*) FROM deliveries) AS deliveries;
