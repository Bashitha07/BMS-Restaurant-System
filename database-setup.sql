-- Database setup script for Restaurant System
-- Run this script in your MySQL database to create the full schema, indexes, and sample data

CREATE DATABASE IF NOT EXISTS restaurant_db;
USE restaurant_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    -- Promotion fields for registered users
    promo_code VARCHAR(50),
    discount_percent DECIMAL(5,2) DEFAULT 0.00,
    promo_expires DATETIME,
    promo_active BOOLEAN DEFAULT FALSE,
    enabled BOOLEAN DEFAULT TRUE
);

-- Create menus table
CREATE TABLE IF NOT EXISTS menus (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(255),
    preparation_time INT,
    calories INT,
    ingredients TEXT,
    allergens VARCHAR(255),
    is_vegetarian BIT DEFAULT FALSE,
    is_vegan BIT DEFAULT FALSE,
    is_gluten_free BIT DEFAULT FALSE,
    is_spicy BIT DEFAULT FALSE,
    spice_level INT,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    stock_quantity INT,
    low_stock_threshold INT DEFAULT 10,
    is_featured BIT DEFAULT FALSE,
    discount_percentage DECIMAL(5,2) DEFAULT 0.00,
    discounted_price DECIMAL(10,2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_date DATETIME NOT NULL,
    status VARCHAR(50) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) DEFAULT 0.00,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    delivery_fee DECIMAL(10,2) DEFAULT 0.00,
    payment_method ENUM('DEPOSIT_SLIP','CASH_ON_DELIVERY') DEFAULT 'CASH_ON_DELIVERY',
    delivery_address TEXT,
    delivery_phone VARCHAR(255),
    special_instructions TEXT,
    order_type ENUM('DELIVERY','PICKUP','DINE_IN') NOT NULL DEFAULT 'DELIVERY',
    estimated_delivery_time DATETIME,
    actual_delivery_time DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    special_instructions VARCHAR(255),
    order_id BIGINT NOT NULL,
    menu_id BIGINT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE
);

-- Create reservations table
CREATE TABLE IF NOT EXISTS reservations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reservation_date DATE NOT NULL,
    reservation_time TIME(6) NOT NULL,
    reservation_date_time DATETIME NOT NULL,
    time_slot VARCHAR(255),
    number_of_people INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(255) NOT NULL,
    special_requests TEXT,
    table_number INT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    confirmed_at DATETIME,
    cancelled_at DATETIME,
    cancellation_reason VARCHAR(255),
    reminder_sent BIT DEFAULT FALSE,
    admin_notes TEXT,
    user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create drivers table
CREATE TABLE IF NOT EXISTS drivers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE,
    vehicle_type VARCHAR(50),
    vehicle_number VARCHAR(20),
    license_number VARCHAR(50),
    status ENUM('AVAILABLE', 'BUSY', 'OFFLINE') DEFAULT 'AVAILABLE',
    rating DECIMAL(3, 2) DEFAULT 0.00,
    total_deliveries INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create deliveries table
CREATE TABLE IF NOT EXISTS deliveries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    driver_id BIGINT,
    delivery_address TEXT NOT NULL,
    delivery_phone VARCHAR(255),
    delivery_instructions TEXT,
    status VARCHAR(50) NOT NULL,
    delivery_fee DECIMAL(10,2),
    estimated_delivery_time DATETIME,
    actual_delivery_time DATETIME,
    pickup_time DATETIME,
    assigned_date DATETIME,
    delivered_date DATETIME,
    delivery_notes TEXT,
    current_latitude DECIMAL(10,8),
    current_longitude DECIMAL(11,8),
    delivery_latitude DECIMAL(10,8),
    delivery_longitude DECIMAL(11,8),
    distance_km DECIMAL(5,2),
    customer_rating INT,
    customer_feedback TEXT,
    proof_of_delivery VARCHAR(255),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    driver_name VARCHAR(255),
    driver_phone VARCHAR(255),
    driver_vehicle VARCHAR(255),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE SET NULL
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(255),
    slip_image VARCHAR(255),
    payment_gateway VARCHAR(255),
    gateway_transaction_id VARCHAR(255),
    submitted_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    processed_date DATETIME,
    approved_date DATETIME,
    failure_reason VARCHAR(255),
    refund_amount DECIMAL(10,2),
    refunded_date DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    menu_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE
);

SELECT * FROM users;
SELECT * FROM menus;
SELECT * FROM orders;
SELECT * FROM order_items;
SELECT * FROM reservations;
SELECT * FROM drivers;
SELECT * FROM deliveries;
SELECT * FROM payments;
SELECT * FROM reviews;

-- Corrected Index Creation for MySQL (Remove IF NOT EXISTS)

-- Users Table Indexes
CREATE INDEX idx_username ON users(username);
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_user_role ON users(role);

-- Menus Table Indexes
CREATE INDEX idx_menu_category ON menus(category);
CREATE INDEX idx_menu_available ON menus(is_available);
CREATE INDEX idx_menu_price ON menus(price);

-- Orders Table Indexes
CREATE INDEX idx_order_user_id ON orders(user_id);
CREATE INDEX idx_order_status ON orders(status);
CREATE INDEX idx_order_date ON orders(order_date);

-- Order_Items Table Indexes
CREATE INDEX idx_order_item_order_id ON order_items(order_id);

-- Reservations Table Indexes
CREATE INDEX idx_reservation_user_id ON reservations(user_id);

-- Drivers Table Indexes
CREATE INDEX idx_driver_phone ON drivers(phone);
CREATE INDEX idx_driver_email ON drivers(email);
CREATE INDEX idx_driver_status ON drivers(status);
CREATE INDEX idx_driver_rating ON drivers(rating);

-- Deliveries Table Indexes
CREATE INDEX idx_delivery_order_id ON deliveries(order_id);
CREATE INDEX idx_delivery_driver_id ON deliveries(driver_id);
CREATE INDEX idx_delivery_status ON deliveries(status);
CREATE INDEX idx_delivery_assigned_date ON deliveries(assigned_date);

-- Payments Table Indexes
CREATE INDEX idx_payment_order_id ON payments(order_id);
CREATE INDEX idx_payment_status ON payments(status);

-- Reviews Table Indexes
CREATE INDEX idx_review_user_id ON reviews(user_id);
CREATE INDEX idx_review_menu_id ON reviews(menu_id);
CREATE INDEX idx_review_rating ON reviews(rating);
CREATE INDEX idx_review_created_at ON reviews(created_at);

-- Sample data insertion
INSERT INTO users (username, password, email, role, phone) VALUES
('admin', '$2a$10$7QJ6vQ6vQ6vQ6vQ6vQ6vQO7QJ6vQ6vQ6vQ6vQ6vQ6vQ6vQ6vQ6vQ6', 'admin@example.com', 'ADMIN', '123-456-7890'),
('user', '$2a$10$7QJ6vQ6vQ6vQ6vQ6vQ6vQO7QJ6vQ6vQ6vQ6vQ6vQ6vQ6vQ6vQ6vQ6', 'user@example.com', 'USER', '098-765-4321')
ON DUPLICATE KEY UPDATE username = username;

-- ALTER statements for existing databases to add promotion columns if they don't exist
-- (Run these separately against an existing database)
ALTER TABLE users ADD COLUMN IF NOT EXISTS promo_code VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS discount_percent DECIMAL(5,2) DEFAULT 0.00;
ALTER TABLE users ADD COLUMN IF NOT EXISTS promo_expires DATETIME;
ALTER TABLE users ADD COLUMN IF NOT EXISTS promo_active BOOLEAN DEFAULT FALSE;

-- Sample promo assignment for the 'user' account
UPDATE users SET promo_code = 'WELCOME10', discount_percent = 10.00, promo_expires = DATE_ADD(NOW(), INTERVAL 30 DAY), promo_active = TRUE WHERE username = 'user';

INSERT INTO menus (name, description, price, category, is_available) VALUES
('Margherita Pizza', 'Fresh mozzarella, tomatoes, and basil on thin crust', 27.50, 'Pizza', true),
('Caesar Salad', 'Crisp romaine lettuce with Caesar dressing and croutons', 9.50, 'Salads', true),
('Grilled Chicken Burger', 'Juicy grilled chicken breast with lettuce, tomato, and mayo', 13.50, 'Burgers', true),
('Chocolate Brownie', 'Rich chocolate brownie served with vanilla ice cream', 4.50, 'Desserts', true),
('Spaghetti Carbonara', 'Classic Italian pasta with eggs, cheese, pancetta, and black pepper', 11.50, 'Pasta', true)
ON DUPLICATE KEY UPDATE name = name;

-- Sample order data
INSERT INTO orders (order_date, status, total_amount, subtotal, tax_amount, delivery_fee, payment_method, delivery_address, delivery_phone, special_instructions, order_type, estimated_delivery_time, actual_delivery_time, created_at, user_id) VALUES
(NOW(), 'PENDING', 2750.00, 2500.00, 200.00, 50.00, 'COD', '123 Main Street, City Center', '071-123-4567', 'Extra cheese please', 'DELIVERY', DATE_ADD(NOW(), INTERVAL 30 MINUTE), NULL, NOW(), 2)
ON DUPLICATE KEY UPDATE order_date = order_date;

INSERT INTO order_items (quantity, unit_price, total_price, order_id, menu_id) VALUES
(1, 2750.00, 2750.00, 1, 1)
ON DUPLICATE KEY UPDATE quantity = quantity;

-- Sample reservation data
INSERT INTO reservations (reservation_date, reservation_time, reservation_date_time, time_slot, number_of_people, status, customer_name, customer_email, customer_phone, special_requests, table_number, created_at, user_id) VALUES
(CURDATE(), '19:00:00', NOW(), '18:00-19:00', 4, 'CONFIRMED', 'John Doe', 'john.doe@example.com', '071-123-4567', 'Window seat preferred', 5, NOW(), 2)
ON DUPLICATE KEY UPDATE reservation_date_time = reservation_date_time;

-- Sample driver data
INSERT INTO drivers (name, phone, email, vehicle_type, vehicle_number, license_number, status, rating, total_deliveries) VALUES
('John Doe', '071-123-4567', 'john.doe@delivery.com', 'Motorcycle', 'ABC-1234', 'DL123456789', 'AVAILABLE', 4.5, 150),
('Jane Smith', '071-987-6543', 'jane.smith@delivery.com', 'Car', 'XYZ-5678', 'DL987654321', 'AVAILABLE', 4.8, 200),
('Mike Johnson', '071-555-0123', 'mike.j@delivery.com', 'Bicycle', 'BIKE-001', 'DL456789123', 'BUSY', 4.2, 75)
ON DUPLICATE KEY UPDATE name = name;

-- Sample delivery data
INSERT INTO deliveries (order_id, driver_id, status, assigned_date, delivery_address) VALUES
(1, 1, 'ASSIGNED', NOW(), '123 Main Street, City Center')
ON DUPLICATE KEY UPDATE order_id = order_id;

-- Sample review data
INSERT INTO reviews (user_id, menu_id, rating, comment) VALUES
(2, 1, 5, 'Amazing pizza! Best I have ever tasted.'),
(2, 2, 4, 'Fresh and delicious salad, great portion size.')
ON DUPLICATE KEY UPDATE user_id = user_id;

-- Sample SQL Queries

-- 1. Get all users
SELECT * FROM users;

-- 2. Get all available menu items
SELECT * FROM menus WHERE is_available = TRUE;

-- 3. Get orders with user details
SELECT o.id, o.order_date, o.status, o.total_amount, u.username, u.email
FROM orders o
JOIN users u ON o.user_id = u.id;

-- 4. Get order items with menu details
SELECT oi.id, oi.quantity, oi.unit_price, oi.total_price, m.name AS menu_name, m.category
FROM order_items oi
JOIN menus m ON oi.menu_id = m.id;

-- 5. Get average rating for each menu
SELECT m.name, AVG(r.rating) AS average_rating, COUNT(r.id) AS review_count
FROM menus m
LEFT JOIN reviews r ON m.id = r.menu_id
GROUP BY m.id, m.name;

-- 6. Get total orders per user
SELECT u.username, COUNT(o.id) AS total_orders
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.username;

-- 7. Get available drivers
SELECT * FROM drivers WHERE status = 'AVAILABLE';

-- 8. Get deliveries with driver and order details
SELECT d.id, d.status, d.delivery_address, dr.name AS driver_name, o.total_amount
FROM deliveries d
JOIN drivers dr ON d.driver_id = dr.id
JOIN orders o ON d.order_id = o.id;

-- 9. Get total sales per menu category
SELECT m.category, SUM(oi.quantity * oi.unit_price) AS total_sales
FROM menus m
JOIN order_items oi ON m.id = oi.menu_id
GROUP BY m.category;

-- 10. Get reservations with user details
SELECT r.id, r.reservation_date_time, r.number_of_people, r.status, u.username
FROM reservations r
JOIN users u ON r.user_id = u.id;

-- 11. Get payments with order details
SELECT p.id, p.amount, p.status, p.submitted_date, o.order_date, u.username
FROM payments p
JOIN orders o ON p.order_id = o.id
JOIN users u ON o.user_id = u.id;

-- 12. Get reviews with user and menu names
SELECT r.rating, r.comment, r.created_at, u.username, m.name AS menu_name
FROM reviews r
JOIN users u ON r.user_id = u.id
JOIN menus m ON r.menu_id = m.id;
