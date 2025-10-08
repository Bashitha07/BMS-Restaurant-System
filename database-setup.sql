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
    status VARCHAR(50) NOT NULL,
    assigned_date DATETIME,
    picked_up_date DATETIME,
    delivered_date DATETIME,
    delivery_address TEXT,
    delivery_notes TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE SET NULL
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
