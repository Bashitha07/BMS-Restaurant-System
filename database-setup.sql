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
    role ENUM('USER', 'ADMIN') DEFAULT 'USER'
);

-- Create menus table
CREATE TABLE IF NOT EXISTS menus (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50),
    is_available BOOLEAN DEFAULT TRUE
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_date DATETIME NOT NULL,
    status VARCHAR(50) NOT NULL,
    total_amount DOUBLE,
    user_id BIGINT NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'COD',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    order_id BIGINT NOT NULL,
    menu_id BIGINT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE
);

-- Create reservations table
CREATE TABLE IF NOT EXISTS reservations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reservation_date_time DATETIME NOT NULL,
    number_of_people INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create deliveries table
CREATE TABLE IF NOT EXISTS deliveries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    driver_name VARCHAR(100),
    driver_phone VARCHAR(20),
    driver_vehicle VARCHAR(100),
    status VARCHAR(50) NOT NULL,
    assigned_date DATETIME,
    delivered_date DATETIME,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    amount DOUBLE,
    slip_image TEXT,
    status VARCHAR(50) NOT NULL,
    submitted_date DATETIME,
    approved_date DATETIME,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

SELECT * FROM users;
SELECT * FROM menus;
SELECT * FROM orders;
SELECT * FROM order_items;
SELECT * FROM reservations;
SELECT * FROM deliveries;
SELECT * FROM payments;

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

-- Deliveries Table Indexes
CREATE INDEX idx_delivery_order_id ON deliveries(order_id);
CREATE INDEX idx_delivery_status ON deliveries(status);

-- Payments Table Indexes
CREATE INDEX idx_payment_order_id ON payments(order_id);
CREATE INDEX idx_payment_status ON payments(status);

-- Sample data insertion
INSERT INTO users (username, password, email, role, phone) VALUES
('admin', '$2a$10$7QJ6vQ6vQ6vQ6vQ6vQ6vQO7QJ6vQ6vQ6vQ6vQ6vQ6vQ6vQ6vQ6vQ6', 'admin@example.com', 'ADMIN', '123-456-7890'),
('user', '$2a$10$7QJ6vQ6vQ6vQ6vQ6vQ6vQO7QJ6vQ6vQ6vQ6vQ6vQ6vQ6vQ6vQ6vQ6', 'user@example.com', 'USER', '098-765-4321')
ON DUPLICATE KEY UPDATE username = username;

INSERT INTO menus (name, description, price, category, is_available) VALUES
('Margherita Pizza', 'Fresh mozzarella, tomatoes, and basil on thin crust', 27.50, 'Pizza', true),
('Caesar Salad', 'Crisp romaine lettuce with Caesar dressing and croutons', 9.50, 'Salads', true),
('Grilled Chicken Burger', 'Juicy grilled chicken breast with lettuce, tomato, and mayo', 13.50, 'Burgers', true),
('Chocolate Brownie', 'Rich chocolate brownie served with vanilla ice cream', 4.50, 'Desserts', true),
('Spaghetti Carbonara', 'Classic Italian pasta with eggs, cheese, pancetta, and black pepper', 11.50, 'Pasta', true)
ON DUPLICATE KEY UPDATE name = name;

-- Sample order data
INSERT INTO orders (order_date, status, total_amount, user_id, payment_method) VALUES
(NOW(), 'PENDING', 2750.00, 2, 'COD')
ON DUPLICATE KEY UPDATE order_date = order_date;

INSERT INTO order_items (quantity, price, order_id, menu_id) VALUES
(1, 2750.00, 1, 1)
ON DUPLICATE KEY UPDATE quantity = quantity;

-- Sample reservation data
INSERT INTO reservations (reservation_date_time, number_of_people, status, user_id) VALUES
(NOW(), 4, 'CONFIRMED', 2)
ON DUPLICATE KEY UPDATE reservation_date_time = reservation_date_time;

-- Sample delivery data
INSERT INTO deliveries (order_id, driver_name, driver_phone, driver_vehicle, status, assigned_date) VALUES
(1, 'John Doe', '071-123-4567', 'Honda CBR 150', 'ASSIGNED', NOW())
ON DUPLICATE KEY UPDATE order_id = order_id;
