-- ============================================================================
-- Restaurant Management System - Populating and updating data
-- ============================================================================

USE restaurant_db;

-- USERS TABLE -----------
INSERT INTO users (username, email, phone, password, role, promo_code, discount_percent, promo_active)
VALUES ('john_doe', 'john@example.com', '0771234567', 'hashedpass123', 'USER', 'WELCOME10', 10.00, 1);

INSERT INTO users (username, email, phone, password, role, enabled)
VALUES ('admin_user', 'admin@example.com', '0719876543', 'secureadminpass', 'ADMIN', 1);


-- MENUS TABLE -----------
INSERT INTO menus (name, description, price, category, is_available, is_vegetarian, stock_quantity)
VALUES ('Margherita Pizza', 'Classic cheese and tomato pizza', 1200.00, 'Pizza', 1, 1, 15);

INSERT INTO menus (name, description, price, category, is_available, is_vegan, spice_level, stock_quantity)
VALUES ('Spicy Veggie Burger', 'Vegan burger with chili mayo', 950.00, 'Burger', 1, 1, 3, 10);



-- ORDERS TABLE -----------
INSERT INTO orders (user_id, total_amount, payment_method, payment_status, delivery_address, delivery_phone, order_type)
VALUES (1, 2150.00, 'CASH', 'COMPLETED', '123 Main Street, Colombo', '0771234567', 'DELIVERY');

INSERT INTO orders (user_id, total_amount, payment_method, payment_status, delivery_address, delivery_phone, order_type)
VALUES (2, 950.00, 'ONLINE', 'PENDING', '45 Temple Road, Kandy', '0719876543', 'PICKUP');


-- ORDER_ITEMS TABLE -----------
INSERT INTO order_items (order_id, menu_id, quantity, price, subtotal)
VALUES (1, 1, 2, 1200.00, 2400.00);

INSERT INTO order_items (order_id, menu_id, quantity, price, subtotal)
VALUES (1, 2, 1, 950.00, 950.00);


-- ORDER_TRACKING TABLE -----------
INSERT INTO order_tracking (order_id, status, notes, updated_by)
VALUES (1, 'DELIVERED', 'Delivered successfully', 2);

INSERT INTO order_tracking (order_id, status, notes, updated_by)
VALUES (2, 'CONFIRMED', 'Order confirmed by admin', 2);



-- RESERVATIONS TABLE -----------
INSERT INTO reservations (user_id, reservation_date, reservation_time, reservation_date_time, number_of_people, customer_name, customer_phone, status, table_number)
VALUES (1, CURDATE(), '19:00:00', CONCAT(CURDATE(), ' 19:00:00'), 4, 'John Doe', '0771234567', 'CONFIRMED', 5);

INSERT INTO reservations (user_id, reservation_date, reservation_time, reservation_date_time, number_of_people, customer_name, customer_phone, status)
VALUES (2, CURDATE(), '20:00:00', CONCAT(CURDATE(), ' 20:00:00'), 2, 'Admin User', '0719876543', 'PENDING');


-- PAYMENTS TABLE -----------
INSERT INTO payments (order_id, amount, payment_method, status, transaction_id)
VALUES (1, 2150.00, 'CASH', 'COMPLETED', 'TXN001');

INSERT INTO payments (order_id, amount, payment_method, status, transaction_id)
VALUES (2, 950.00, 'ONLINE', 'PENDING', 'TXN002');


-- PAYMENT_SLIPS TABLE -----------
INSERT INTO payment_slips (payment_id, image_url, verified, verified_by)
VALUES (1, 'slips/txn001.jpg', 1, 2);

INSERT INTO payment_slips (payment_id, image_url)
VALUES (2, 'slips/txn002_pending.jpg');


-- DRIVERS TABLE -----------
INSERT INTO drivers (user_id, name, phone, vehicle_type, vehicle_number, license_number)
VALUES (1, 'Kamal Perera', '0772223344', 'Bike', 'AB-1234', 'LIC998877');

INSERT INTO drivers (user_id, name, phone, vehicle_type, vehicle_number, license_number, available)
VALUES (2, 'Nuwan Silva', '0715556677', 'Car', 'CA-5678', 'LIC112233', 1);


-- DELIVERIES TABLE -----------
INSERT INTO deliveries (order_id, driver_id, pickup_time, delivery_time, delivery_status)
VALUES (1, 1, NOW(), DATE_ADD(NOW(), INTERVAL 30 MINUTE), 'DELIVERED');

INSERT INTO deliveries (order_id, driver_id, pickup_time, delivery_status)
VALUES (2, 2, NOW(), 'IN_TRANSIT');


-- DELIVERY_DRIVERS TABLE -----------
INSERT INTO delivery_drivers (delivery_id, driver_id, notes)
VALUES (1, 1, 'Delivered successfully');

INSERT INTO delivery_drivers (delivery_id, driver_id, notes)
VALUES (2, 2, 'On the way');


-- NOTIFICATIONS TABLE -----------
INSERT INTO notifications (user_id, title, message, type)
VALUES (1, 'Order Delivered', 'Your order #1 has been successfully delivered.', 'INFO');

INSERT INTO notifications (user_id, title, message, type)
VALUES (2, 'Reservation Reminder', 'Your reservation for 8 PM is still pending confirmation.', 'ALERT');


-- FEEDBACKS TABLE -----------
INSERT INTO feedbacks (user_id, order_id, rating, comment, feedback_type)
VALUES (1, 1, 5, 'Excellent service and great taste!', 'SERVICE');

INSERT INTO feedbacks (user_id, order_id, rating, comment, feedback_type)
VALUES (2, 2, 4, 'Food was great but delivery was delayed.', 'DELIVERY');


-- REVIEWS TABLE -----------
INSERT INTO reviews (user_id, menu_id, rating, comment, verified_purchase)
VALUES (1, 1, 5, 'Best pizza I’ve had in months!', 1);

INSERT INTO reviews (user_id, menu_id, rating, comment)
VALUES (2, 2, 4, 'Nice burger, could use more spice.');

SHOW TABLES;
SELECT * FROM users;



-------------------------------- UPDATING QUERIES -------------------------------------

# USERS
UPDATE users
SET discount_percent = 15.00, promo_active = 1
WHERE username = 'john_doe';

# MENUS
UPDATE menus
SET price = 1100.00, discounted_price = 990.00, discount_percentage = 10.00
WHERE name = 'Margherita Pizza';

# ORDERS
UPDATE orders
SET status = 'DELIVERED', payment_status = 'COMPLETED', actual_delivery_time = NOW()
WHERE id = 1;

# ORDER_ITEMS
UPDATE order_items
SET quantity = 3, subtotal = price * 3
WHERE id = 1;

# ORDER_TRACKING
UPDATE order_tracking
SET notes = 'Customer received order on time and gave positive feedback.'
WHERE id = 1;

# RESERVATIONS
UPDATE reservations
SET status = 'COMPLETED', updated_at = NOW()
WHERE id = 1;

# PAYMENTS
UPDATE payments
SET status = 'REFUNDED', refund_amount = 500.00, refunded_date = NOW(), refund_reason = 'Partial refund for delayed delivery'
WHERE id = 2;

# PAYMENT_SLIPS
UPDATE payment_slips
SET verified = 1, verified_at = NOW()
WHERE id = 2;

# DRIVERS
UPDATE drivers
SET available = 0, total_deliveries = total_deliveries + 1, rating = 4.75
WHERE id = 1;

# DELIVERIES
UPDATE deliveries
SET delivery_status = 'DELIVERED', delivery_time = NOW()
WHERE id = 2;

# DELIVERY_DRIVERS
UPDATE delivery_drivers
SET notes = 'Delivery completed and confirmed by customer'
WHERE id = 2;

# NOTIFICATIONS
UPDATE notifications
SET is_read = 1, read_at = NOW()
WHERE id = 1;

# FEEDBACKS
UPDATE feedbacks
SET comment = 'Excellent food and quick delivery!', rating = 5
WHERE id = 2;

# REVIEWS
UPDATE reviews
SET helpful_count = helpful_count + 1
WHERE id = 1;
