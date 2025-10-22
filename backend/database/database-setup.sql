-- Restaurant Management System Database Setup
-- This script creates the database and necessary tables

-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS restaurant_db;

-- Use the restaurant database
USE restaurant_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL DEFAULT ' ',
    phone VARCHAR(20),
    address TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE users MODIFY full_name VARCHAR(100) NOT NULL DEFAULT ' ';

-- Menu Categories Table
CREATE TABLE IF NOT EXISTS menu_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category_id BIGINT,
    image VARCHAR(255),
    preparation_time INT,
    calories INT,
    available BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES menu_categories(id)
);

-- Reservations Table
CREATE TABLE IF NOT EXISTS reservations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    party_size INT NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    payment_status VARCHAR(20) DEFAULT 'UNPAID',
    order_type VARCHAR(20) NOT NULL,
    delivery_address TEXT,
    contact_phone VARCHAR(20),
    special_instructions TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS menus (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100) NOT NULL,
description TEXT,
category VARCHAR(50) NOT NULL,
price DECIMAL(10, 2) NOT NULL,
is_available BOOLEAN DEFAULT TRUE,
image_url VARCHAR(255),
ingredients TEXT,
preparation_time INT DEFAULT 0,
discount_percentage DECIMAL(5,2) DEFAULT 0.00,
discounted_price DECIMAL(10,2) DEFAULT 0.00,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    menu_item_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transaction_id VARCHAR(100),
    status VARCHAR(20) NOT NULL,
    receipt_url VARCHAR(255),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Payment Slips Table
CREATE TABLE IF NOT EXISTS payment_slips (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    slip_url VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Menus Table
CREATE TABLE IF NOT EXISTS menus (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Reviews Table (if not present)
CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    menu_id BIGINT NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (menu_id) REFERENCES menus(id)
);

-- Initial admin user (password: admin123)
INSERT INTO users (username, password, email, full_name, role)
VALUES ('admin', '$2a$10$6UVHQoHhpoHVVLAtXdYw.eYZ1/Vh4BTUt5CwHzz6oqW3kCXS8s7Zu', 'admin@restaurant.com', 'Admin User', 'ADMIN')
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), username = VALUES(username);

-- Initial menu categories
INSERT INTO menu_categories (name, description) VALUES 
('Food', 'Main dishes and appetizers') ON DUPLICATE KEY UPDATE name = VALUES(name),
('Beverages', 'Drinks and refreshments') ON DUPLICATE KEY UPDATE name = VALUES(name),
('Desserts', 'Sweet treats and desserts') ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Sample menu items
INSERT INTO menu_items (name, description, price, category_id, available) VALUES
('Grilled Chicken Burger', 'Juicy grilled chicken with lettuce, tomato, and mayo', 12.99, 1, true),
('Classic Caesar Salad', 'Fresh romaine lettuce with Caesar dressing, croutons, and parmesan', 9.99, 1, true),
('Chocolate Brownie', 'Rich chocolate brownie with vanilla ice cream', 6.99, 3, true),
('Fresh Orange Juice', 'Freshly squeezed orange juice', 4.99, 2, true);

-- Set up permissions
GRANT ALL PRIVILEGES ON restaurant_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;