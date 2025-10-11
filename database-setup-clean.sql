-- Database setup script for Restaurant System (No Indexes)
-- Run this script in your MySQL database to create the full schema and sample data

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

-- Sample data insertion
INSERT INTO users (username, password, email, role, phone) VALUES
('admin', '$2a$10$7QJ6vQ6vQ6vQ6vQ6vQ6vQO7QJ6vQ6vQ6vQ6vQ6vQ6vQ6vQ6vQ6vQ6', 'admin@example.com', 'ADMIN', '123-456-7890'),
('user', '$2a$10$7QJ6vQ6vQ6vQ6vQ6vQ6vQO7QJ6vQ6vQ6vQ6vQ6vQ6vQ6vQ6vQ6vQ6', 'user@example.com', 'USER', '098-765-4321')
ON DUPLICATE KEY UPDATE username = username;

-- Sample promo assignment for the 'user' account
UPDATE users SET promo_code = 'WELCOME10', discount_percent = 10.00, promo_expires = DATE_ADD(NOW(), INTERVAL 30 DAY), promo_active = TRUE WHERE username = 'user';

INSERT INTO menus (name, description, price, category, is_available) VALUES
('Margherita Pizza', 'Fresh mozzarella, tomatoes, and basil on thin crust', 27.50, 'Pizza', true),
('Caesar Salad', 'Crisp romaine lettuce with Caesar dressing and croutons', 9.50, 'Salads', true),
('Grilled Chicken Burger', 'Juicy grilled chicken breast with lettuce, tomato, and mayo', 13.50, 'Burgers', true),
('Chocolate Brownie', 'Rich chocolate brownie served with vanilla ice cream', 4.50, 'Desserts', true),
('Spaghetti Carbonara', 'Classic Italian pasta with eggs, cheese, pancetta, and black pepper', 11.50, 'Pasta', true)
ON DUPLICATE KEY UPDATE name = name;

-- Sample driver data
INSERT INTO drivers (name, phone, email, vehicle_type, vehicle_number, license_number, status, rating, total_deliveries) VALUES
('John Doe', '071-123-4567', 'john.doe@delivery.com', 'Motorcycle', 'ABC-1234', 'DL123456789', 'AVAILABLE', 4.5, 150),
('Jane Smith', '071-987-6543', 'jane.smith@delivery.com', 'Car', 'XYZ-5678', 'DL987654321', 'AVAILABLE', 4.8, 200),
('Mike Johnson', '071-555-0123', 'mike.j@delivery.com', 'Bicycle', 'BIKE-001', 'DL456789123', 'BUSY', 4.2, 75)
ON DUPLICATE KEY UPDATE name = name;

-- Sample review data
INSERT INTO reviews (user_id, menu_id, rating, comment) VALUES
(2, 1, 5, 'Amazing pizza! Best I have ever tasted.'),
(2, 2, 4, 'Fresh and delicious salad, great portion size.')
ON DUPLICATE KEY UPDATE user_id = user_id;