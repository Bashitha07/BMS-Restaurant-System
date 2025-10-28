-- ============================================
-- Restaurant Management System - Database Setup
-- ============================================
-- Complete database schema for restaurant management system
-- Supports multi-role user system, order processing, delivery tracking,
-- reservations, payments, notifications, and review system
-- Total: 15 comprehensive tables
-- Last Updated: December 2024
-- ============================================

CREATE DATABASE IF NOT EXISTS restaurant_db;
USE restaurant_db;
-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(50) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL,
email VARCHAR(100) NOT NULL UNIQUE,
phone VARCHAR(20),
role ENUM('USER', 'ADMIN', 'MANAGER', 'KITCHEN', 'DRIVER') DEFAULT 'USER',
enabled BOOLEAN DEFAULT TRUE,
-- Promotional fields
promo_code VARCHAR(20),
discount_percent DECIMAL(5,2) DEFAULT 0.00,
promo_expires DATETIME,
promo_active BOOLEAN DEFAULT FALSE,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- ============================================
-- 2. DRIVERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS drivers (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
user_id BIGINT NOT NULL,
name VARCHAR(100) NOT NULL,
phone VARCHAR(20) NOT NULL,
license_number VARCHAR(50) NOT NULL,
vehicle_number VARCHAR(50) NOT NULL,
vehicle_type VARCHAR(50),
vehicle_model VARCHAR(100),
available BOOLEAN DEFAULT TRUE,
rating DECIMAL(3,2) DEFAULT 0.00,
total_deliveries INT DEFAULT 0,
status ENUM('AVAILABLE', 'BUSY', 'OFFLINE') DEFAULT 'AVAILABLE',
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
UNIQUE KEY unique_user_id (user_id),
UNIQUE KEY unique_phone (phone),
UNIQUE KEY unique_license (license_number),
UNIQUE KEY unique_vehicle (vehicle_number),
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- ============================================
-- 3. MENUS TABLE (Simplified - 21 Fields Total)
-- NO calories field, NO allergens field
-- ============================================
CREATE TABLE IF NOT EXISTS menus (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100) NOT NULL,
description TEXT,
category VARCHAR(50) NOT NULL,
price DECIMAL(10, 2) NOT NULL,
is_available BOOLEAN DEFAULT TRUE,
image_url VARCHAR(255),
preparation_time INT DEFAULT 0,
is_vegetarian BOOLEAN DEFAULT FALSE,
is_vegan BOOLEAN DEFAULT FALSE,
is_gluten_free BOOLEAN DEFAULT FALSE,
is_spicy BOOLEAN DEFAULT FALSE,
spice_level INT DEFAULT 0,
is_featured BOOLEAN DEFAULT FALSE,
stock_quantity INT DEFAULT 100,
low_stock_threshold INT DEFAULT 10,
ingredients TEXT,
discount_percentage DECIMAL(5,2) DEFAULT 0.00,
discounted_price DECIMAL(10,2) DEFAULT 0.00,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- ============================================
-- 4. ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
user_id BIGINT NOT NULL,
driver_id BIGINT,
order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
status ENUM('PENDING', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'REFUNDED') DEFAULT 'PENDING',
total_amount DECIMAL(10,2) NOT NULL,
subtotal DECIMAL(10,2) DEFAULT 0.00,
tax_amount DECIMAL(10,2) DEFAULT 0.00,
delivery_fee DECIMAL(10,2) DEFAULT 0.00,
payment_method ENUM('DEPOSIT_SLIP', 'CASH_ON_DELIVERY'),
payment_status ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED', 'PARTIALLY_REFUNDED') DEFAULT 'PENDING',
order_type ENUM('DELIVERY', 'PICKUP', 'DINE_IN') DEFAULT 'DELIVERY',
delivery_address TEXT,
delivery_phone VARCHAR(20),
special_instructions TEXT,
estimated_delivery_time DATETIME,
actual_delivery_time DATETIME,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE SET NULL
);
-- ============================================
-- 5. ORDER_ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
order_id BIGINT NOT NULL,
menu_id BIGINT NOT NULL,
quantity INT NOT NULL,
unit_price DECIMAL(10, 2) NOT NULL,
total_price DECIMAL(10, 2) NOT NULL,
special_instructions TEXT,
FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE
);
-- ============================================
-- 6. RESERVATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS reservations (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
user_id BIGINT NOT NULL,
customer_name VARCHAR(100) NOT NULL,
customer_phone VARCHAR(20) NOT NULL,
customer_email VARCHAR(100),
reservation_date DATE NOT NULL,
reservation_time TIME NOT NULL,
reservation_date_time DATETIME NOT NULL,
time_slot VARCHAR(50),
number_of_people INT NOT NULL,
status ENUM('PENDING', 'CONFIRMED', 'SEATED', 'CANCELLED', 'NO_SHOW', 'COMPLETED') DEFAULT 'PENDING',
special_requests TEXT,
table_number INT,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
confirmed_at DATETIME,
cancelled_at DATETIME,
cancellation_reason VARCHAR(255),
reminder_sent BOOLEAN DEFAULT FALSE,
admin_notes TEXT,
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- ============================================
-- 7. DELIVERIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS deliveries (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
order_id BIGINT NOT NULL,
driver_id BIGINT,
delivery_address TEXT NOT NULL,
delivery_phone VARCHAR(20),
delivery_instructions TEXT,
status ENUM('PENDING', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'FAILED', 'CANCELLED') DEFAULT 'PENDING',
delivery_fee DECIMAL(10,2),
estimated_delivery_time DATETIME,
actual_delivery_time DATETIME,
pickup_time DATETIME,
assigned_date DATETIME,
delivered_date DATETIME,
delivery_notes TEXT,
driver_name VARCHAR(100),
driver_phone VARCHAR(20),
driver_vehicle VARCHAR(100),
current_latitude DECIMAL(10,8),
current_longitude DECIMAL(11,8),
delivery_latitude DECIMAL(10,8),
delivery_longitude DECIMAL(11,8),
distance_km DECIMAL(5,2),
customer_rating INT CHECK (customer_rating >= 1 AND customer_rating <= 5),
customer_feedback TEXT,
proof_of_delivery VARCHAR(255),
cash_collected DECIMAL(10,2),
cash_collection_confirmed BOOLEAN DEFAULT FALSE,
cash_collection_time DATETIME,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE SET NULL
);
-- ============================================
-- 8. PAYMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
order_id BIGINT NOT NULL,
amount DECIMAL(10,2) NOT NULL,
payment_method ENUM('DEPOSIT_SLIP', 'CASH_ON_DELIVERY') NOT NULL,
status ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED', 'PARTIALLY_REFUNDED') DEFAULT 'PENDING',
transaction_id VARCHAR(255),
slip_image VARCHAR(255),
payment_gateway VARCHAR(255),
gateway_transaction_id VARCHAR(255),
submitted_date DATETIME DEFAULT CURRENT_TIMESTAMP,
processed_date DATETIME,
approved_date DATETIME,
failure_reason VARCHAR(255),
refund_amount DECIMAL(10,2),
refunded_date DATETIME,
refund_reason VARCHAR(500),
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
-- ============================================
-- 9. PAYMENT SLIPS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS payment_slips (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
order_id BIGINT NOT NULL,
user_id BIGINT,
file_name VARCHAR(255) NOT NULL DEFAULT 'payment_slip.jpg',
file_path VARCHAR(500) NOT NULL DEFAULT '/uploads/',
file_size BIGINT,
content_type VARCHAR(100),
payment_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
payment_date DATETIME,
uploaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
confirmed_at DATETIME,
confirmed_by VARCHAR(100),
slip_image VARCHAR(255) NOT NULL,
status ENUM('PENDING', 'APPROVED', 'REJECTED', 'CONFIRMED', 'PROCESSING') DEFAULT 'PENDING',
submitted_date DATETIME DEFAULT CURRENT_TIMESTAMP,
reviewed_date DATETIME,
reviewed_by BIGINT,
rejection_reason VARCHAR(500),
admin_notes VARCHAR(500),
bank_name VARCHAR(100),
transaction_reference VARCHAR(255),
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
FOREIGN KEY (reviewed_by) REFERENCES users(id)
);

-- ============================================
-- 10. REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
user_id BIGINT NOT NULL,
menu_id BIGINT NOT NULL,
rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
comment TEXT,
helpful_count INT DEFAULT 0,
reported BOOLEAN DEFAULT FALSE,
report_reason VARCHAR(500),
approved BOOLEAN DEFAULT TRUE,
reviewed_by BIGINT,
reviewed_at DATETIME,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE,
FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
);
-- ============================================
-- 11. NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
user_id BIGINT,
title VARCHAR(255) NOT NULL,
message TEXT,
type ENUM('ORDER_CONFIRMATION', 'ORDER_STATUS_UPDATE', 'RESERVATION_CONFIRMATION', 'RESERVATION_REMINDER', 'DELIVERY_UPDATE', 'PAYMENT_CONFIRMATION', 'SYSTEM_ANNOUNCEMENT', 'PROMOTIONAL', 'WARNING', 'ERROR') NOT NULL,
status ENUM('UNREAD', 'READ', 'DISMISSED') DEFAULT 'UNREAD',
reference_id BIGINT,
reference_type VARCHAR(50),
is_global BOOLEAN DEFAULT FALSE,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
read_at DATETIME,
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- ============================================
-- 12. ORDER TRACKING TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS order_tracking (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
order_id BIGINT NOT NULL,
status VARCHAR(50) NOT NULL,
title VARCHAR(255) NOT NULL,
description TEXT,
timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
completed BOOLEAN DEFAULT FALSE,
actor VARCHAR(255),
FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
-- ============================================
-- 13. SYSTEM SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS system_settings (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
setting_key VARCHAR(255) UNIQUE NOT NULL,
setting_value VARCHAR(500) NOT NULL,
description VARCHAR(500),
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- 14. FEEDBACKS TABLE
-- Note: This table is kept separate from reviews, assuming it captures unstructured feedback (e.g., suggestions or complaints) without a rating, while reviews focus on rated opinions.
-- ============================================
CREATE TABLE IF NOT EXISTS feedbacks (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
user_id BIGINT NOT NULL,
menu_id BIGINT NOT NULL,
feedback TEXT NOT NULL,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE
);
-- ============================================
-- 15. DELIVERY DRIVERS TABLE (Junction table)
-- Note: Retained for potential many-to-many driver assignments per delivery (e.g., team deliveries). Added unique constraint to prevent duplicate assignments.
-- ============================================
CREATE TABLE IF NOT EXISTS delivery_drivers (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
delivery_id BIGINT NOT NULL,
driver_id BIGINT NOT NULL,
assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
notes TEXT,
UNIQUE KEY unique_assignment (delivery_id, driver_id),
FOREIGN KEY (delivery_id) REFERENCES deliveries(id) ON DELETE CASCADE,
FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
-- Users Table Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_promo_code ON users(promo_code);
-- Menus Table Indexes
CREATE INDEX idx_menus_category ON menus(category);
CREATE INDEX idx_menus_available ON menus(is_available);
CREATE INDEX idx_menus_featured ON menus(is_featured);
-- Orders Table Indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_driver_id ON orders(driver_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_orders_type ON orders(order_type);
-- Order Items Table Indexes
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_menu_id ON order_items(menu_id);
-- Reservations Table Indexes
CREATE INDEX idx_reservations_user_id ON reservations(user_id);
CREATE INDEX idx_reservations_date ON reservations(reservation_date);
CREATE INDEX idx_reservations_datetime ON reservations(reservation_date_time);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_table ON reservations(table_number);
-- Drivers Table Indexes
CREATE INDEX idx_drivers_user_id ON drivers(user_id);
CREATE INDEX idx_drivers_phone ON drivers(phone);
CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_drivers_available ON drivers(available);
CREATE INDEX idx_drivers_license ON drivers(license_number);
-- Deliveries Table Indexes
CREATE INDEX idx_deliveries_order_id ON deliveries(order_id);
CREATE INDEX idx_deliveries_driver_id ON deliveries(driver_id);
CREATE INDEX idx_deliveries_status ON deliveries(status);
CREATE INDEX idx_deliveries_estimated_time ON deliveries(estimated_delivery_time);
-- Payments Table Indexes
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_method ON payments(payment_method);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);
-- Payment Slips Table Indexes
CREATE INDEX idx_payment_slips_order_id ON payment_slips(order_id);
CREATE INDEX idx_payment_slips_status ON payment_slips(status);
CREATE INDEX idx_payment_slips_reviewed_by ON payment_slips(reviewed_by);
-- Reviews Table Indexes
CREATE INDEX idx_reviews_menu_id ON reviews(menu_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_approved ON reviews(approved);
-- Notifications Table Indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_is_global ON notifications(is_global);
CREATE INDEX idx_notifications_reference ON notifications(reference_type, reference_id);
-- Order Tracking Table Indexes
CREATE INDEX idx_order_tracking_order_id ON order_tracking(order_id);
CREATE INDEX idx_order_tracking_status ON order_tracking(status);
CREATE INDEX idx_order_tracking_timestamp ON order_tracking(timestamp);
-- System Settings Table Indexes
CREATE INDEX idx_system_settings_key ON system_settings(setting_key);
-- Feedbacks Table Indexes
CREATE INDEX idx_feedbacks_user_id ON feedbacks(user_id);
CREATE INDEX idx_feedbacks_menu_id ON feedbacks(menu_id);
-- Delivery Drivers Table Indexes
CREATE INDEX idx_delivery_drivers_delivery_id ON delivery_drivers(delivery_id);
CREATE INDEX idx_delivery_drivers_driver_id ON delivery_drivers(driver_id);
-- ============================================
-- SAMPLE DATA
-- ============================================
-- Insert Admin and Test Users
INSERT INTO users (username, password, email, role, phone, enabled) VALUES
('admin', '$2a$10$7QJ6vQ6vQ6vQ6vQ6vQ6vQO7QJ6vQ6vQ6vQ6vQ6vQ6vQ6vQ6vQ6vQ6', 'admin@restaurant.com', 'ADMIN', '0771234567', TRUE),
('kitchen', '$2a$10$7QJ6vQ6vQ6vQ6vQ6vQ6vQO7QJ6vQ6vQ6vQ6vQ6vQ6vQ6vQ6vQ6vQ6', 'kitchen@restaurant.com', 'KITCHEN', '0772345678', TRUE),
('manager', '$2a$10$7QJ6vQ6vQ6vQ6vQ6vQ6vQO7QJ6vQ6vQ6vQ6vQ6vQ6vQ6vQ6vQ6vQ6', 'manager@restaurant.com', 'MANAGER', '0773456789', TRUE),
('driver1', '$2a$10$7QJ6vQ6vQ6vQ6vQ6vQ6vQO7QJ6vQ6vQ6vQ6vQ6vQ6vQ6vQ6vQ6vQ6', 'driver1@restaurant.com', 'DRIVER', '0774567890', TRUE),
('testuser', '$2a$10$7QJ6vQ6vQ6vQ6vQ6vQ6vQO7QJ6vQ6vQ6vQ6vQ6vQ6vQ6vQ6vQ6vQ6', 'test@restaurant.com', 'USER', '0777654321', TRUE)
ON DUPLICATE KEY UPDATE username = username;
-- Insert Sample Menu Items
INSERT INTO menus (name, description, category, price, is_available, preparation_time, is_vegetarian, ingredients) VALUES
('Margherita Pizza', 'Classic pizza with tomato sauce, mozzarella, and basil', 'MAIN_COURSE', 850.00, TRUE, 25, TRUE, 'Dough, Tomato Sauce, Mozzarella, Basil'),
('Chicken Burger', 'Grilled chicken burger with lettuce and mayo', 'MAIN_COURSE', 650.00, TRUE, 20, FALSE, 'Chicken Breast, Bun, Lettuce, Mayo'),
('Caesar Salad', 'Fresh romaine lettuce with Caesar dressing', 'APPETIZER', 450.00, TRUE, 10, TRUE, 'Romaine Lettuce, Parmesan, Croutons, Caesar Dressing'),
('Chocolate Cake', 'Rich chocolate layer cake', 'DESSERT', 350.00, TRUE, 5, TRUE, 'Chocolate, Flour, Eggs, Sugar'),
('Fresh Orange Juice', 'Freshly squeezed orange juice', 'BEVERAGE', 250.00, TRUE, 5, TRUE, 'Fresh Oranges')
ON DUPLICATE KEY UPDATE name = name;
-- Insert Sample Drivers
INSERT INTO drivers (user_id, name, phone, license_number, vehicle_number, vehicle_type, vehicle_model, status, available) VALUES
(4, 'John Driver', '0774567890', 'DL123456', 'ABC-1234', 'MOTORCYCLE', 'Honda Wave 125', 'AVAILABLE', TRUE)
ON DUPLICATE KEY UPDATE name = name;
-- Insert Sample Order with full details
INSERT INTO orders (user_id, driver_id, order_date, status, total_amount, subtotal, tax_amount, delivery_fee, payment_method, payment_status, order_type, delivery_address, delivery_phone) VALUES
(5, NULL, NOW(), 'PENDING', 902.00, 850.00, 51.00, 1.00, 'CASH_ON_DELIVERY', 'PENDING', 'DELIVERY', '123 Main Street, Colombo', '0777654321')
ON DUPLICATE KEY UPDATE order_date = order_date;
-- Insert Sample Order Items
INSERT INTO order_items (order_id, menu_id, quantity, unit_price, total_price) VALUES
(1, 1, 1, 850.00, 850.00)
ON DUPLICATE KEY UPDATE quantity = quantity;
-- Insert Sample Reservation with full details
INSERT INTO reservations (user_id, customer_name, customer_phone, customer_email, reservation_date, reservation_time, reservation_date_time, number_of_people, time_slot, status, table_number) VALUES
(5, 'John Doe', '0777654321', 'test@restaurant.com', CURDATE(), '19:00:00', CONCAT(CURDATE(), ' 19:00:00'), 4, 'DINNER', 'PENDING', 'T05')
ON DUPLICATE KEY UPDATE customer_name = customer_name;
-- Insert Sample Delivery
INSERT INTO deliveries (order_id, driver_id, delivery_address, delivery_phone, status, assigned_date) VALUES
(1, 1, '123 Main Street, Colombo', '0777654321', 'ASSIGNED', NOW())
ON DUPLICATE KEY UPDATE order_id = order_id;
-- Insert Sample Reviews
INSERT INTO reviews (user_id, menu_id, rating, comment, approved) VALUES
(5, 1, 5, 'Amazing pizza! Best I have ever tasted.', TRUE),
(5, 2, 4, 'Great burger, would recommend!', TRUE)
ON DUPLICATE KEY UPDATE user_id = user_id;
-- Insert Sample System Settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('delivery_fee', '1.00', 'Standard delivery fee in LKR'),
('tax_rate', '0.06', 'Tax rate (6%)'),
('min_order_amount', '500.00', 'Minimum order amount for delivery'),
('promo_code_discount', '10.00', 'Default promotional discount percentage')
ON DUPLICATE KEY UPDATE setting_key = setting_key;
-- ============================================
-- USEFUL QUERIES FOR DATA VERIFICATION
-- ============================================
-- View all users with roles
-- SELECT id, username, email, role, enabled FROM users;
-- View all available menus
-- SELECT id, name, category, price, is_available FROM menus WHERE is_available = TRUE;
-- View all orders with customer info
-- SELECT o.id, o.order_date, o.status, o.payment_status, o.total_amount, u.username
-- FROM orders o JOIN users u ON o.user_id = u.id;
-- View order details with items
-- SELECT o.id AS order_id, m.name AS menu_item, oi.quantity, oi.unit_price, oi.total_price
-- FROM orders o
-- JOIN order_items oi ON o.id = oi.order_id
-- JOIN menus m ON oi.menu_id = m.id;
-- View all reservations
-- SELECT r.id, r.customer_name, r.reservation_date_time, r.number_of_people, r.status, r.table_number
-- FROM reservations r;
-- View drivers with availability
-- SELECT d.id, d.name, d.phone, d.vehicle_number, d.available, d.status, u.username
-- FROM drivers d LEFT JOIN users u ON d.user_id = u.id;
-- View deliveries with driver and order info
-- SELECT de.id, o.id AS order_id, dr.name AS driver_name, de.status, de.delivery_address
-- FROM deliveries de
-- JOIN orders o ON de.order_id = o.id
-- LEFT JOIN drivers dr ON de.driver_id = dr.id;
-- View payments with order info
-- SELECT p.id, p.amount, p.payment_method, p.status, o.id AS order_id
-- FROM payments p JOIN orders o ON p.order_id = o.id;
-- View reviews with menu and user info
-- SELECT r.rating, r.comment, r.approved, m.name AS menu_name, u.username
-- FROM reviews r
-- JOIN menus m ON r.menu_id = m.id
-- JOIN users u ON r.user_id = u.id;
-- View notifications by user
-- SELECT n.title, n.message, n.type, n.status, n.created_at, u.username
-- FROM notifications n
-- LEFT JOIN users u ON n.user_id = u.id
-- ORDER BY n.created_at DESC;
-- View order tracking history
-- SELECT ot.order_id, ot.status, ot.title, ot.description, ot.timestamp, ot.actor
-- FROM order_tracking ot
-- ORDER BY ot.order_id, ot.timestamp;
-- Count records in all tables
-- SELECT
--     (SELECT COUNT() FROM users) AS users,
--     (SELECT COUNT() FROM menus) AS menus,
--     (SELECT COUNT() FROM orders) AS orders,
--     (SELECT COUNT() FROM order_items) AS order_items,
--     (SELECT COUNT() FROM reservations) AS reservations,
--     (SELECT COUNT() FROM drivers) AS drivers,
--     (SELECT COUNT() FROM deliveries) AS deliveries,
--     (SELECT COUNT() FROM payments) AS payments,
--     (SELECT COUNT() FROM payment_slips) AS payment_slips,
--     (SELECT COUNT() FROM reviews) AS reviews,
--     (SELECT COUNT() FROM notifications) AS notifications,
--     (SELECT COUNT() FROM order_tracking) AS order_tracking,
--     (SELECT COUNT() FROM system_settings) AS system_settings,
--     (SELECT COUNT() FROM feedbacks) AS feedbacks,
--     (SELECT COUNT(*) FROM delivery_drivers) AS delivery_drivers;
-- ============================================
-- DATABASE SETUP COMPLETE
-- ============================================
-- Restaurant Management System Database
-- Total: 15 tables with comprehensive features
-- Core Tables (10):
--   1. users - User management with 5 roles + promo system
--   2. menus - Menu items with 21 fields
--   3. orders - Order management with 24 fields
--   4. order_items - Order line items
--   5. reservations - Table reservations with booking system
--   6. drivers - Driver management with vehicle details
--   7. deliveries - Delivery tracking with GPS & feedback
--   8. payments - Payment processing
--   9. payment_slips - Payment slip uploads
--  10. reviews - Customer reviews with moderation
-- Supporting Tables (5):
--  11. notifications - User notifications
--  12. order_tracking - Order status history
--  13. system_settings - Configuration storage
--  14. feedbacks - Customer feedback
--  15. delivery_drivers - Delivery-driver assignments
-- Features:
-- - Multi-role user system (USER, ADMIN, MANAGER, KITCHEN, DRIVER)
-- - Promotional code system
-- - Comprehensive delivery tracking
-- - Payment processing & slip verification
-- - Review & feedback system
-- - Real-time notifications
-- - Order tracking history
-- - System configuration
-- ============================================