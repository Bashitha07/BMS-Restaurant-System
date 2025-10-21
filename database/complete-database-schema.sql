-- ===============================================
-- Restaurant Management System Database Schema
-- Version: 1.0
-- Date: October 20, 2025
-- Database: MySQL 8.0+
-- ===============================================

-- Drop database if exists (CAUTION: This will delete all data!)
DROP DATABASE IF EXISTS restaurant_db;

-- Create database
CREATE DATABASE restaurant_db 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

-- Use the database
USE restaurant_db;

-- ===============================================
-- TABLE 1: USERS
-- ===============================================
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role ENUM('USER', 'ADMIN', 'MANAGER', 'KITCHEN', 'DRIVER') NOT NULL DEFAULT 'USER',
    enabled BOOLEAN DEFAULT TRUE,
    
    -- Promotion fields
    promo_code VARCHAR(50),
    discount_percent DECIMAL(5,2) DEFAULT 0.00,
    promo_expires DATETIME,
    promo_active BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- TABLE 2: MENUS
-- ===============================================
CREATE TABLE menus (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(255),
    preparation_time INT COMMENT 'in minutes',
    
    -- Ingredients and dietary info
    ingredients TEXT,
    is_vegetarian BOOLEAN DEFAULT FALSE,
    is_vegan BOOLEAN DEFAULT FALSE,
    is_gluten_free BOOLEAN DEFAULT FALSE,
    is_spicy BOOLEAN DEFAULT FALSE,
    spice_level INT COMMENT '1-5 scale',
    
    -- Stock management
    stock_quantity INT,
    low_stock_threshold INT DEFAULT 10,
    
    -- Special features
    is_featured BOOLEAN DEFAULT FALSE,
    discount_percentage DECIMAL(5,2) DEFAULT 0.00,
    discounted_price DECIMAL(10,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_category (category),
    INDEX idx_available (is_available),
    INDEX idx_featured (is_featured),
    INDEX idx_price (price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- TABLE 3: ORDERS
-- ===============================================
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status ENUM('PENDING', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    
    -- Pricing
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    subtotal DECIMAL(10,2) DEFAULT 0.00,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    delivery_fee DECIMAL(10,2) DEFAULT 0.00,
    
    -- Payment
    payment_method ENUM('CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'ONLINE', 'BANK_TRANSFER', 'DIGITAL_WALLET'),
    payment_status ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED', 'PARTIALLY_REFUNDED') DEFAULT 'PENDING',
    
    -- Delivery info
    delivery_address TEXT,
    delivery_phone VARCHAR(20),
    special_instructions TEXT,
    order_type ENUM('DELIVERY', 'PICKUP', 'DINE_IN') NOT NULL DEFAULT 'DELIVERY',
    
    -- Timing
    estimated_delivery_time DATETIME,
    actual_delivery_time DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_order_date (order_date),
    INDEX idx_payment_status (payment_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- TABLE 4: ORDER_ITEMS
-- ===============================================
CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    menu_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    special_instructions TEXT,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE RESTRICT,
    INDEX idx_order_id (order_id),
    INDEX idx_menu_id (menu_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- TABLE 5: RESERVATIONS
-- ===============================================
CREATE TABLE reservations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    
    -- Date and time
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    reservation_date_time DATETIME NOT NULL,
    time_slot VARCHAR(50) COMMENT 'e.g., 12:00-13:00',
    
    -- Guest info
    number_of_people INT NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100),
    customer_phone VARCHAR(20) NOT NULL,
    special_requests TEXT,
    
    -- Status and table
    status ENUM('PENDING', 'CONFIRMED', 'SEATED', 'CANCELLED', 'NO_SHOW', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    table_number INT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    confirmed_at DATETIME,
    cancelled_at DATETIME,
    
    -- Admin info
    cancellation_reason TEXT,
    reminder_sent BOOLEAN DEFAULT FALSE,
    admin_notes TEXT,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_reservation_date (reservation_date),
    INDEX idx_status (status),
    INDEX idx_datetime (reservation_date_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- TABLE 6: PAYMENTS
-- ===============================================
CREATE TABLE payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'ONLINE', 'BANK_TRANSFER', 'DIGITAL_WALLET') NOT NULL,
    status ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED', 'PARTIALLY_REFUNDED') NOT NULL DEFAULT 'PENDING',
    
    -- Transaction details
    transaction_id VARCHAR(100),
    slip_image VARCHAR(255),
    payment_gateway VARCHAR(50) COMMENT 'e.g., STRIPE, PAYPAL, BANK_TRANSFER',
    gateway_transaction_id VARCHAR(100),
    
    -- Dates
    submitted_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    processed_date DATETIME,
    approved_date DATETIME,
    
    -- Refund info
    failure_reason TEXT,
    refund_amount DECIMAL(10,2),
    refunded_date DATETIME,
    refund_reason VARCHAR(500),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_status (status),
    INDEX idx_transaction_id (transaction_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- TABLE 7: PAYMENT_SLIPS
-- ===============================================
CREATE TABLE payment_slips (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    
    -- File info
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    content_type VARCHAR(100),
    
    -- Payment details
    payment_amount DECIMAL(10,2) NOT NULL,
    payment_date DATETIME,
    bank_name VARCHAR(100),
    transaction_reference VARCHAR(100),
    
    -- Status
    status ENUM('PENDING', 'CONFIRMED', 'REJECTED', 'PROCESSING') NOT NULL DEFAULT 'PENDING',
    
    -- Admin review
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at DATETIME,
    confirmed_by VARCHAR(50) COMMENT 'Admin username who confirmed',
    rejection_reason TEXT,
    admin_notes TEXT,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- TABLE 8: DELIVERY_DRIVERS
-- ===============================================
CREATE TABLE delivery_drivers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    
    -- License and vehicle
    license_number VARCHAR(50) NOT NULL UNIQUE,
    vehicle_number VARCHAR(20) NOT NULL UNIQUE,
    vehicle_type VARCHAR(50) NOT NULL COMMENT 'MOTORCYCLE, CAR, BICYCLE, SCOOTER',
    vehicle_model VARCHAR(50),
    
    -- Status and employment
    status ENUM('PENDING', 'APPROVED', 'ACTIVE', 'INACTIVE', 'SUSPENDED', 'TERMINATED') NOT NULL DEFAULT 'PENDING',
    hire_date DATETIME NOT NULL,
    birth_date DATETIME,
    
    -- Emergency contact
    emergency_contact VARCHAR(100),
    emergency_phone VARCHAR(20),
    
    -- Compensation
    hourly_rate DECIMAL(10,2),
    commission_rate DECIMAL(5,2) COMMENT 'Percentage commission per delivery',
    
    -- Performance metrics
    total_deliveries INT NOT NULL DEFAULT 0,
    total_earnings DECIMAL(10,2) DEFAULT 0.00,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_ratings INT NOT NULL DEFAULT 0,
    
    -- Activity
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login DATETIME,
    
    -- Location
    current_location_lat DECIMAL(10,8),
    current_location_lng DECIMAL(11,8),
    max_delivery_distance DECIMAL(5,2) COMMENT 'in kilometers',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_status (status),
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- TABLE 9: DRIVERS (Simplified version)
-- ===============================================
CREATE TABLE drivers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE,
    vehicle_type VARCHAR(50),
    vehicle_number VARCHAR(20),
    license_number VARCHAR(50),
    status ENUM('PENDING', 'APPROVED', 'ACTIVE', 'INACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'PENDING',
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_deliveries INT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_status (status),
    INDEX idx_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- TABLE 10: DELIVERIES
-- ===============================================
CREATE TABLE deliveries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    driver_id BIGINT,
    
    -- Delivery address
    delivery_address TEXT NOT NULL,
    delivery_phone VARCHAR(20),
    delivery_instructions TEXT,
    
    -- Status
    status ENUM('PENDING', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'FAILED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    
    -- Pricing
    delivery_fee DECIMAL(10,2),
    
    -- Timing
    estimated_delivery_time DATETIME,
    actual_delivery_time DATETIME,
    pickup_time DATETIME,
    assigned_date DATETIME,
    delivered_date DATETIME,
    
    -- Notes
    delivery_notes TEXT,
    
    -- Location tracking
    current_latitude DECIMAL(10,8),
    current_longitude DECIMAL(11,8),
    delivery_latitude DECIMAL(10,8),
    delivery_longitude DECIMAL(11,8),
    distance_km DECIMAL(5,2),
    
    -- Customer feedback
    customer_rating INT COMMENT '1-5 stars',
    customer_feedback TEXT,
    proof_of_delivery VARCHAR(255) COMMENT 'Image URL or signature',
    
    -- Legacy fields for backward compatibility
    driver_name VARCHAR(100),
    driver_phone VARCHAR(20),
    driver_vehicle VARCHAR(50),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE SET NULL,
    INDEX idx_order_id (order_id),
    INDEX idx_driver_id (driver_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- TABLE 11: ORDER_TRACKING
-- ===============================================
CREATE TABLE order_tracking (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed BOOLEAN DEFAULT FALSE,
    actor VARCHAR(100) COMMENT 'Who performed this action',
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- TABLE 12: NOTIFICATIONS
-- ===============================================
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    title VARCHAR(200) NOT NULL,
    message TEXT,
    type ENUM('ORDER_CONFIRMATION', 'ORDER_STATUS_UPDATE', 'RESERVATION_CONFIRMATION', 'RESERVATION_REMINDER', 'DELIVERY_UPDATE', 'PAYMENT_CONFIRMATION', 'SYSTEM_ANNOUNCEMENT', 'PROMOTIONAL', 'WARNING', 'ERROR') NOT NULL,
    status ENUM('UNREAD', 'READ', 'DISMISSED') NOT NULL DEFAULT 'UNREAD',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at DATETIME,
    
    -- Reference to related entity
    reference_id BIGINT COMMENT 'ID of related entity (order, reservation, etc.)',
    reference_type VARCHAR(50) COMMENT 'ORDER, RESERVATION, DELIVERY, etc.',
    
    is_global BOOLEAN DEFAULT FALSE COMMENT 'For system-wide announcements',
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_type (type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- TABLE 13: FEEDBACKS
-- ===============================================
CREATE TABLE feedbacks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    menu_id BIGINT NOT NULL,
    feedback TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_menu_id (menu_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- TABLE 14: REVIEWS
-- ===============================================
CREATE TABLE reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    menu_id BIGINT NOT NULL,
    rating INT NOT NULL COMMENT '1-5 stars',
    feedback TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_menu_id (menu_id),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- SAMPLE DATA INSERTION
-- ===============================================

-- Insert admin user (password: admin123)
-- BCrypt hash for 'admin123'
INSERT INTO users (username, email, phone, password, role, enabled) VALUES
('admin', 'admin@restaurant.com', '+1234567890', '$2a$10$xKHSwKGfXqZxEJeGW5HEtuGzDqRnWUXD0vbH1K5PkQ4YKh8Brs.Zy', 'ADMIN', TRUE);

-- Insert test users
INSERT INTO users (username, email, phone, password, role, enabled) VALUES
('john_customer', 'john@example.com', '+1234567891', '$2a$10$xKHSwKGfXqZxEJeGW5HEtuGzDqRnWUXD0vbH1K5PkQ4YKh8Brs.Zy', 'USER', TRUE),
('sarah_manager', 'sarah@restaurant.com', '+1234567892', '$2a$10$xKHSwKGfXqZxEJeGW5HEtuGzDqRnWUXD0vbH1K5PkQ4YKh8Brs.Zy', 'MANAGER', TRUE),
('chef_mike', 'mike@restaurant.com', '+1234567893', '$2a$10$xKHSwKGfXqZxEJeGW5HEtuGzDqRnWUXD0vbH1K5PkQ4YKh8Brs.Zy', 'KITCHEN', TRUE);

-- Insert sample menu items
INSERT INTO menus (name, description, price, category, is_available, preparation_time, is_vegetarian) VALUES
-- Appetizers
('Spring Rolls', 'Crispy vegetable spring rolls with sweet chili sauce', 6.99, 'APPETIZER', TRUE, 10, TRUE),
('Chicken Wings', 'Spicy buffalo chicken wings with blue cheese dip', 9.99, 'APPETIZER', TRUE, 15, FALSE),
('Garlic Bread', 'Toasted bread with garlic butter and herbs', 4.99, 'APPETIZER', TRUE, 8, TRUE),

-- Main Course
('Chicken Biryani', 'Aromatic basmati rice with tender chicken and spices', 12.99, 'MAIN_COURSE', TRUE, 30, FALSE),
('Vegetable Pasta', 'Penne pasta with fresh vegetables in tomato sauce', 10.99, 'MAIN_COURSE', TRUE, 20, TRUE),
('Grilled Salmon', 'Fresh salmon fillet with lemon butter sauce', 18.99, 'MAIN_COURSE', TRUE, 25, FALSE),
('Beef Burger', 'Juicy beef patty with cheese, lettuce, and tomato', 11.99, 'MAIN_COURSE', TRUE, 15, FALSE),
('Margherita Pizza', 'Classic pizza with tomato sauce, mozzarella, and basil', 13.99, 'MAIN_COURSE', TRUE, 18, TRUE),

-- Desserts
('Chocolate Lava Cake', 'Warm chocolate cake with molten center', 7.99, 'DESSERT', TRUE, 12, TRUE),
('Tiramisu', 'Classic Italian dessert with coffee and mascarpone', 6.99, 'DESSERT', TRUE, 10, TRUE),
('Ice Cream Sundae', 'Vanilla ice cream with chocolate sauce and nuts', 5.99, 'DESSERT', TRUE, 5, TRUE),

-- Beverages
('Fresh Orange Juice', 'Freshly squeezed orange juice', 4.99, 'BEVERAGE', TRUE, 5, TRUE),
('Coffee', 'Hot brewed coffee', 2.99, 'BEVERAGE', TRUE, 5, TRUE),
('Soft Drink', 'Coca-Cola, Sprite, or Fanta', 2.49, 'BEVERAGE', TRUE, 2, TRUE),
('Iced Tea', 'Refreshing iced tea with lemon', 3.49, 'BEVERAGE', TRUE, 5, TRUE);

-- Insert sample driver applications
INSERT INTO delivery_drivers (name, email, username, password, phone, address, license_number, vehicle_number, vehicle_type, status, hire_date) VALUES
('John Driver', 'john.driver@example.com', 'johndriver', '$2a$10$xKHSwKGfXqZxEJeGW5HEtuGzDqRnWUXD0vbH1K5PkQ4YKh8Brs.Zy', '+1234567894', '123 Main St', 'DL12345', 'AB123CD', 'MOTORCYCLE', 'PENDING', NOW()),
('Sarah Rider', 'sarah.rider@example.com', 'sarahrider', '$2a$10$xKHSwKGfXqZxEJeGW5HEtuGzDqRnWUXD0vbH1K5PkQ4YKh8Brs.Zy', '+1234567895', '456 Oak Ave', 'DL67890', 'EF456GH', 'SCOOTER', 'PENDING', NOW()),
('Ahmed Khan', 'ahmed.khan@example.com', 'ahmedkhan', '$2a$10$xKHSwKGfXqZxEJeGW5HEtuGzDqRnWUXD0vbH1K5PkQ4YKh8Brs.Zy', '+1234567896', '789 Pine Rd', 'DL11223', 'IJ789KL', 'CAR', 'PENDING', NOW());

-- Insert into drivers table as well
INSERT INTO drivers (name, phone, email, vehicle_type, vehicle_number, license_number, status) VALUES
('John Driver', '+1234567894', 'john.driver@example.com', 'MOTORCYCLE', 'AB123CD', 'DL12345', 'PENDING'),
('Sarah Rider', '+1234567895', 'sarah.rider@example.com', 'SCOOTER', 'EF456GH', 'DL67890', 'PENDING'),
('Ahmed Khan', '+1234567896', 'ahmed.khan@example.com', 'CAR', 'IJ789KL', 'DL11223', 'PENDING');

-- ===============================================
-- VERIFICATION QUERIES
-- ===============================================

-- Count tables (should be 14)
SELECT COUNT(*) AS table_count 
FROM information_schema.tables 
WHERE table_schema = 'restaurant_db';

-- Check sample data
SELECT 'Users' AS table_name, COUNT(*) AS count FROM users
UNION ALL
SELECT 'Menus', COUNT(*) FROM menus
UNION ALL
SELECT 'Drivers', COUNT(*) FROM delivery_drivers
UNION ALL
SELECT 'Driver (simple)', COUNT(*) FROM drivers;

-- Display admin user
SELECT id, username, email, role, enabled FROM users WHERE role = 'ADMIN';

-- Display menu items by category
SELECT category, COUNT(*) as item_count, 
       MIN(price) as min_price, 
       MAX(price) as max_price,
       AVG(price) as avg_price
FROM menus
GROUP BY category;

-- ===============================================
-- END OF SCRIPT
-- ===============================================
