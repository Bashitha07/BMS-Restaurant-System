-- ========================================-- ============================================================================

-- Restaurant Management System Database-- Restaurant Management System - Complete Database Schema

-- Course: Database Management Systems-- ============================================================================

-- Project: BMS Kingdom of Taste-- Database: restaurant_db

-- ========================================-- Version: 2.0

-- Last Updated: October 23, 2025

-- Drop existing database and create fresh-- Description: Complete schema with all tables, indexes, and sample queries

DROP DATABASE IF EXISTS restaurant_db;-- ============================================================================

CREATE DATABASE restaurant_db;

USE restaurant_db;-- Drop database if exists (CAUTION: This will delete all data)

-- DROP DATABASE IF EXISTS restaurant_db;

-- ========================================

-- TABLE: users-- Create database

-- Purpose: Store all user accounts (customers, admins, drivers)CREATE DATABASE IF NOT EXISTS restaurant_db 

-- ========================================CHARACTER SET utf8mb4 

CREATE TABLE users (COLLATE utf8mb4_unicode_ci;

    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    username VARCHAR(50) NOT NULL UNIQUE,USE restaurant_db;

    email VARCHAR(255) NOT NULL UNIQUE,

    phone VARCHAR(255),-- ============================================================================

    password VARCHAR(255) NOT NULL,-- 1. USERS TABLE

    role ENUM('USER', 'ADMIN', 'MANAGER', 'KITCHEN', 'DRIVER') NOT NULL DEFAULT 'USER',-- ============================================================================

    enabled BOOLEAN NOT NULL DEFAULT TRUE,-- Stores user account information including authentication and promo codes

    promo_code VARCHAR(255),CREATE TABLE IF NOT EXISTS users (

    discount_percent DECIMAL(5,2) DEFAULT 0.00,    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    promo_expires DATETIME,    username VARCHAR(50) NOT NULL UNIQUE,

    promo_active BOOLEAN DEFAULT FALSE,    email VARCHAR(255) NOT NULL UNIQUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,    phone VARCHAR(255),

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,    password VARCHAR(255) NOT NULL,

    INDEX idx_username (username),    role ENUM('USER', 'ADMIN', 'MANAGER', 'KITCHEN', 'DRIVER') NOT NULL DEFAULT 'USER',

    INDEX idx_email (email),    enabled TINYINT(1) DEFAULT 1,

    INDEX idx_role (role)    

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='User authentication and profile data';    -- Promotional fields

    promo_code VARCHAR(255),

-- ========================================    discount_percent DECIMAL(5,2) DEFAULT 0.00,

-- TABLE: menus    promo_expires DATETIME,

-- Purpose: Restaurant menu items with pricing    promo_active TINYINT(1) DEFAULT 0,

-- ========================================    

CREATE TABLE menus (    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    id BIGINT AUTO_INCREMENT PRIMARY KEY,    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    name VARCHAR(255) NOT NULL,    

    description TEXT,    INDEX idx_role (role),

    price DECIMAL(10,2) NOT NULL,    INDEX idx_promo_code (promo_code),

    category VARCHAR(100),    INDEX idx_enabled (enabled)

    image_url VARCHAR(500),) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    available BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,-- ============================================================================

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,-- 2. MENUS TABLE

    INDEX idx_category (category),-- ============================================================================

    INDEX idx_available (available)-- Stores menu items with pricing, dietary info, and stock management

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Menu items catalog';CREATE TABLE IF NOT EXISTS menus (

    id BIGINT AUTO_INCREMENT PRIMARY KEY,

-- ========================================    name VARCHAR(100) NOT NULL,

-- TABLE: orders    description TEXT,

-- Purpose: Customer orders with delivery info    price DECIMAL(10,2) NOT NULL,

-- ========================================    category VARCHAR(255) NOT NULL,

CREATE TABLE orders (    is_available TINYINT(1) DEFAULT 1,

    id BIGINT AUTO_INCREMENT PRIMARY KEY,    image_url VARCHAR(255),

    user_id BIGINT NOT NULL,    

    total_amount DECIMAL(10,2) NOT NULL,    -- Preparation details

    status ENUM('PENDING', 'PROCESSING', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED') DEFAULT 'PENDING',    preparation_time INT COMMENT 'Time in minutes',

    payment_method ENUM('COD', 'CARD', 'BANK_TRANSFER') NOT NULL,    ingredients TEXT,

    payment_status ENUM('PENDING', 'PAID', 'FAILED') DEFAULT 'PENDING',    

    order_type ENUM('DINE_IN', 'TAKEAWAY', 'DELIVERY') NOT NULL,    -- Dietary information

    delivery_address TEXT,    is_vegetarian TINYINT(1) DEFAULT 0,

    customer_notes TEXT,    is_vegan TINYINT(1) DEFAULT 0,

    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,    is_gluten_free TINYINT(1) DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,    is_spicy TINYINT(1) DEFAULT 0,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,    spice_level INT COMMENT '1-5 scale',

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,    

    INDEX idx_user_id (user_id),    -- Stock management

    INDEX idx_status (status),    stock_quantity INT,

    INDEX idx_order_date (order_date)    low_stock_threshold INT DEFAULT 10,

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Customer orders';    

    -- Promotion fields

-- ========================================    is_featured TINYINT(1) DEFAULT 0,

-- TABLE: order_items    discount_percentage DECIMAL(5,2) DEFAULT 0.00,

-- Purpose: Individual items in each order    discounted_price DECIMAL(10,2),

-- ========================================    

CREATE TABLE order_items (    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    id BIGINT AUTO_INCREMENT PRIMARY KEY,    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    order_id BIGINT NOT NULL,    

    menu_id BIGINT NOT NULL,    INDEX idx_category (category),

    quantity INT NOT NULL,    INDEX idx_available (is_available),

    price DECIMAL(10,2) NOT NULL,    INDEX idx_featured (is_featured),

    subtotal DECIMAL(10,2) NOT NULL,    INDEX idx_price (price)

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,

    FOREIGN KEY (menu_id) REFERENCES menus(id),-- ============================================================================

    INDEX idx_order_id (order_id),-- 3. ORDERS TABLE

    INDEX idx_menu_id (menu_id)-- ============================================================================

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Order line items';-- Stores customer orders with payment and delivery details

CREATE TABLE IF NOT EXISTS orders (

-- ========================================    id BIGINT AUTO_INCREMENT PRIMARY KEY,

-- TABLE: drivers    user_id BIGINT NOT NULL,

-- Purpose: Delivery driver profiles and vehicle info    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,

-- ========================================    status ENUM(

CREATE TABLE drivers (        'PENDING',

    id BIGINT AUTO_INCREMENT PRIMARY KEY,        'CONFIRMED',

    user_id BIGINT NOT NULL UNIQUE,        'PREPARING',

    name VARCHAR(255) NOT NULL,        'READY_FOR_PICKUP',

    phone VARCHAR(20),        'OUT_FOR_DELIVERY',

    license_number VARCHAR(50),        'DELIVERED',

    vehicle_number VARCHAR(50),        'CANCELLED',

    vehicle_type VARCHAR(100),        'REFUNDED'

    available BOOLEAN DEFAULT TRUE,    ) NOT NULL DEFAULT 'PENDING',

    rating DECIMAL(3,2) DEFAULT 0.00,    

    total_deliveries INT DEFAULT 0,    -- Financial details

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,    subtotal DECIMAL(10,2) DEFAULT 0.00,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,    tax_amount DECIMAL(10,2) DEFAULT 0.00,

    INDEX idx_user_id (user_id),    delivery_fee DECIMAL(10,2) DEFAULT 0.00,

    INDEX idx_available (available)    

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Driver profiles with vehicle details';    -- Payment information

    payment_method ENUM(

-- ========================================        'CASH',

-- TABLE: deliveries        'CREDIT_CARD',

-- Purpose: Track order deliveries and driver assignment        'DEBIT_CARD',

-- ========================================        'ONLINE',

CREATE TABLE deliveries (        'BANK_TRANSFER',

    id BIGINT AUTO_INCREMENT PRIMARY KEY,        'DIGITAL_WALLET'

    order_id BIGINT NOT NULL UNIQUE,    ),

    driver_id BIGINT,    payment_status ENUM(

    pickup_address TEXT,        'PENDING',

    delivery_address TEXT NOT NULL,        'PROCESSING',

    status ENUM('PENDING', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED') DEFAULT 'PENDING',        'COMPLETED',

    estimated_delivery_time DATETIME,        'FAILED',

    actual_delivery_time DATETIME,        'CANCELLED',

    delivery_notes TEXT,        'REFUNDED',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,        'PARTIALLY_REFUNDED'

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,    ) DEFAULT 'PENDING',

    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,    

    FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE SET NULL,    -- Delivery details

    INDEX idx_order_id (order_id),    delivery_address VARCHAR(255),

    INDEX idx_driver_id (driver_id),    delivery_phone VARCHAR(255),

    INDEX idx_status (status)    special_instructions TEXT,

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Delivery tracking';    order_type ENUM('DELIVERY', 'PICKUP', 'DINE_IN') NOT NULL DEFAULT 'DELIVERY',

    

-- ========================================    -- Timing

-- TABLE: reservations    estimated_delivery_time DATETIME,

-- Purpose: Table reservations for dine-in customers    actual_delivery_time DATETIME,

-- ========================================    

CREATE TABLE reservations (    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    id BIGINT AUTO_INCREMENT PRIMARY KEY,    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    user_id BIGINT NOT NULL,    

    guest_name VARCHAR(255) NOT NULL,    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

    guest_phone VARCHAR(20) NOT NULL,    INDEX idx_user_id (user_id),

    guest_email VARCHAR(255),    INDEX idx_status (status),

    reservation_date DATE NOT NULL,    INDEX idx_order_date (order_date),

    reservation_time TIME NOT NULL,    INDEX idx_payment_status (payment_status)

    number_of_guests INT NOT NULL,) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    special_requests TEXT,

    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') DEFAULT 'PENDING',-- ============================================================================

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,-- 4. ORDER_ITEMS TABLE

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,-- ============================================================================

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,-- Stores individual items within each order

    INDEX idx_user_id (user_id),CREATE TABLE IF NOT EXISTS order_items (

    INDEX idx_reservation_date (reservation_date),    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    INDEX idx_status (status)    order_id BIGINT NOT NULL,

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Table reservation bookings';    menu_id BIGINT NOT NULL,

    quantity INT NOT NULL DEFAULT 1,

-- ========================================    price DECIMAL(10,2) NOT NULL,

-- TABLE: payment_slips    subtotal DECIMAL(10,2) NOT NULL,

-- Purpose: Bank deposit slip uploads for payment verification    special_requests TEXT,

-- ========================================    

CREATE TABLE payment_slips (    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,

    id BIGINT AUTO_INCREMENT PRIMARY KEY,    FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE RESTRICT,

    order_id BIGINT NOT NULL,    INDEX idx_order_id (order_id),

    user_id BIGINT NOT NULL,    INDEX idx_menu_id (menu_id)

    slip_image_url VARCHAR(500) NOT NULL,) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    amount DECIMAL(10,2) NOT NULL,

    reference_number VARCHAR(100),-- ============================================================================

    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',-- 5. ORDER_TRACKING TABLE

    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,-- ============================================================================

    reviewed_at DATETIME,-- Tracks order status changes and history

    reviewed_by BIGINT,CREATE TABLE IF NOT EXISTS order_tracking (

    notes TEXT,    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,    order_id BIGINT NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,    status VARCHAR(50) NOT NULL,

    INDEX idx_order_id (order_id),    notes TEXT,

    INDEX idx_status (status)    updated_by BIGINT,

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Payment slip verification';    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    

-- ========================================    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,

-- TABLE: notifications    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,

-- Purpose: User notifications for order updates    INDEX idx_order_id (order_id),

-- ========================================    INDEX idx_status (status)

CREATE TABLE notifications () ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT NOT NULL,-- ============================================================================

    title VARCHAR(255) NOT NULL,-- 6. RESERVATIONS TABLE

    message TEXT NOT NULL,-- ============================================================================

    type VARCHAR(50),-- Stores table reservations with time slots and customer details

    is_read BOOLEAN DEFAULT FALSE,CREATE TABLE IF NOT EXISTS reservations (

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,    user_id BIGINT NOT NULL,

    INDEX idx_user_id (user_id),    

    INDEX idx_is_read (is_read)    -- Date and time information

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='User notification system';    reservation_date DATE NOT NULL,

    reservation_time TIME NOT NULL,

-- ========================================    reservation_date_time DATETIME NOT NULL,

-- TABLE: order_tracking    time_slot VARCHAR(255) COMMENT 'e.g., 12:00-13:00',

-- Purpose: Order status change history    

-- ========================================    -- Reservation details

CREATE TABLE order_tracking (    number_of_people INT NOT NULL,

    id BIGINT AUTO_INCREMENT PRIMARY KEY,    customer_name VARCHAR(255) NOT NULL,

    order_id BIGINT NOT NULL,    customer_email VARCHAR(255),

    status VARCHAR(50) NOT NULL,    customer_phone VARCHAR(255) NOT NULL,

    notes TEXT,    special_requests TEXT,

    updated_by VARCHAR(100),    

    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,    -- Status and table assignment

    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,    status ENUM(

    INDEX idx_order_id (order_id)        'PENDING',

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Order status history';        'CONFIRMED',

        'SEATED',

-- ========================================        'CANCELLED',

-- TABLE: system_settings        'NO_SHOW',

-- Purpose: Application configuration settings        'COMPLETED'

-- ========================================    ) NOT NULL DEFAULT 'PENDING',

CREATE TABLE system_settings (    table_number INT,

    id BIGINT AUTO_INCREMENT PRIMARY KEY,    

    setting_key VARCHAR(100) NOT NULL UNIQUE,    -- Tracking timestamps

    setting_value TEXT,    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    description TEXT,    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,    confirmed_at DATETIME,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP    cancelled_at DATETIME,

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='System configuration';    cancellation_reason VARCHAR(255),

    

-- ========================================    -- Admin features

-- TABLE: feedbacks    reminder_sent TINYINT(1) DEFAULT 0,

-- Purpose: Customer feedback and complaints    admin_notes TEXT,

-- ========================================    

CREATE TABLE feedbacks (    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

    id BIGINT AUTO_INCREMENT PRIMARY KEY,    INDEX idx_user_id (user_id),

    user_id BIGINT NOT NULL,    INDEX idx_reservation_date (reservation_date),

    order_id BIGINT,    INDEX idx_status (status)

    rating INT CHECK (rating BETWEEN 1 AND 5),) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    comment TEXT,

    feedback_type VARCHAR(50),-- ============================================================================

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,-- 7. PAYMENTS TABLE

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,-- ============================================================================

    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,-- Stores payment transactions with refund support

    INDEX idx_user_id (user_id)CREATE TABLE IF NOT EXISTS payments (

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Customer feedback';    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    order_id BIGINT NOT NULL,

-- ========================================    amount DECIMAL(10,2) NOT NULL,

-- TABLE: reviews    

-- Purpose: Menu item and service reviews    -- Payment method and gateway

-- ========================================    payment_method ENUM(

CREATE TABLE reviews (        'CASH',

    id BIGINT AUTO_INCREMENT PRIMARY KEY,        'CREDIT_CARD',

    user_id BIGINT NOT NULL,        'DEBIT_CARD',

    menu_id BIGINT,        'ONLINE',

    rating INT CHECK (rating BETWEEN 1 AND 5),        'BANK_TRANSFER',

    review_text TEXT,        'DIGITAL_WALLET'

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,    ) NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,    status ENUM(

    FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE,        'PENDING',

    INDEX idx_user_id (user_id),        'PROCESSING',

    INDEX idx_menu_id (menu_id)        'COMPLETED',

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Menu and service reviews';        'FAILED',

        'CANCELLED',

-- ========================================        'REFUNDED',

-- TABLE: payments        'PARTIALLY_REFUNDED'

-- Purpose: Detailed payment transaction records    ) NOT NULL DEFAULT 'PENDING',

-- ========================================    

CREATE TABLE payments (    -- Transaction details

    id BIGINT AUTO_INCREMENT PRIMARY KEY,    transaction_id VARCHAR(255),

    order_id BIGINT NOT NULL,    slip_image VARCHAR(255),

    amount DECIMAL(10,2) NOT NULL,    payment_gateway VARCHAR(255),

    payment_method VARCHAR(50) NOT NULL,    gateway_transaction_id VARCHAR(255),

    transaction_id VARCHAR(255),    

    status VARCHAR(50) DEFAULT 'PENDING',    -- Timestamps

    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,    submitted_date DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,    processed_date DATETIME,

    INDEX idx_order_id (order_id)    approved_date DATETIME,

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Payment transactions';    

    -- Failure and refund information

-- ========================================    failure_reason VARCHAR(255),

-- SAMPLE DATA INSERTION    refund_amount DECIMAL(10,2),

-- ========================================    refunded_date DATETIME,

    refund_reason VARCHAR(500),

-- Insert sample users (password: password123)    

INSERT INTO users (username, email, phone, password, role, enabled) VALUES    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

('admin', 'admin@restaurant.com', '+94112171944', '$2a$10$YMgXPSJB7.xJtQ8K9X5kLOqJ9YZQJxRXkj9Z9LBqNWKlCQJXJ3J3K', 'ADMIN', TRUE),    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

('john.doe', 'john@example.com', '+94771234567', '$2a$10$YMgXPSJB7.xJtQ8K9X5kLOqJ9YZQJxRXkj9Z9LBqNWKlCQJXJ3J3K', 'USER', TRUE),    

('jane.smith', 'jane@example.com', '+94771234568', '$2a$10$YMgXPSJB7.xJtQ8K9X5kLOqJ9YZQJxRXkj9Z9LBqNWKlCQJXJ3J3K', 'USER', TRUE),    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,

('driver1', 'driver1@restaurant.com', '0771234567', '$2a$10$YMgXPSJB7.xJtQ8K9X5kLOqJ9YZQJxRXkj9Z9LBqNWKlCQJXJ3J3K', 'DRIVER', TRUE),    INDEX idx_order_id (order_id),

('driver2', 'driver2@restaurant.com', '0771234568', '$2a$10$YMgXPSJB7.xJtQ8K9X5kLOqJ9YZQJxRXkj9Z9LBqNWKlCQJXJ3J3K', 'DRIVER', TRUE),    INDEX idx_status (status),

('driver3', 'driver3@restaurant.com', '0771234569', '$2a$10$YMgXPSJB7.xJtQ8K9X5kLOqJ9YZQJxRXkj9Z9LBqNWKlCQJXJ3J3K', 'DRIVER', TRUE),    INDEX idx_transaction_id (transaction_id)

('john.driver', 'john.driver@restaurant.com', '+1234567894', '$2a$10$YMgXPSJB7.xJtQ8K9X5kLOqJ9YZQJxRXkj9Z9LBqNWKlCQJXJ3J3K', 'DRIVER', TRUE),) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

('sarah.rider', 'sarah.rider@restaurant.com', '+1234567895', '$2a$10$YMgXPSJB7.xJtQ8K9X5kLOqJ9YZQJxRXkj9Z9LBqNWKlCQJXJ3J3K', 'DRIVER', TRUE),

('ahmed.khan', 'ahmed.khan@restaurant.com', '+1234567896', '$2a$10$YMgXPSJB7.xJtQ8K9X5kLOqJ9YZQJxRXkj9Z9LBqNWKlCQJXJ3J3K', 'DRIVER', TRUE),-- ============================================================================

('qwerty.ytrewq', 'qwerty.ytrewq@restaurant.com', '0123456789', '$2a$10$YMgXPSJB7.xJtQ8K9X5kLOqJ9YZQJxRXkj9Z9LBqNWKlCQJXJ3J3K', 'DRIVER', TRUE),-- 8. PAYMENT_SLIPS TABLE

('DrivTest', 'drivertest@example.com', '0123456789', '$2a$10$YMgXPSJB7.xJtQ8K9X5kLOqJ9YZQJxRXkj9Z9LBqNWKlCQJXJ3J3K', 'DRIVER', TRUE);-- ============================================================================

-- Stores uploaded payment slip images

-- Insert menu itemsCREATE TABLE IF NOT EXISTS payment_slips (

INSERT INTO menus (name, description, price, category, image_url, available) VALUES    id BIGINT AUTO_INCREMENT PRIMARY KEY,

('Margherita Pizza', 'Classic pizza with tomato sauce, mozzarella, and basil', 850.00, 'Main Course', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500', TRUE),    payment_id BIGINT NOT NULL,

('Chicken Biryani', 'Aromatic basmati rice with tender chicken and spices', 650.00, 'Main Course', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500', TRUE),    image_url VARCHAR(255) NOT NULL,

('Beef Burger', 'Juicy beef patty with lettuce, tomato, and special sauce', 750.00, 'Main Course', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500', TRUE),    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

('Caesar Salad', 'Fresh romaine lettuce with Caesar dressing and croutons', 450.00, 'Appetizers', 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500', TRUE),    verified TINYINT(1) DEFAULT 0,

('Garlic Bread', 'Toasted bread with garlic butter and herbs', 250.00, 'Appetizers', 'https://images.unsplash.com/photo-1573140401552-388e3c4e4fd9?w=500', TRUE),    verified_by BIGINT,

('Chocolate Lava Cake', 'Warm chocolate cake with a molten center', 400.00, 'Desserts', 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500', TRUE),    verified_at DATETIME,

('Ice Cream Sundae', 'Vanilla ice cream with chocolate sauce and nuts', 350.00, 'Desserts', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500', TRUE),    

('Mango Smoothie', 'Fresh mango blended with yogurt and honey', 300.00, 'Beverages', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500', TRUE),    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE,

('Iced Coffee', 'Chilled coffee with milk and ice', 250.00, 'Beverages', 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=500', TRUE),    FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL,

('Fresh Orange Juice', 'Freshly squeezed orange juice', 280.00, 'Beverages', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500', TRUE),    INDEX idx_payment_id (payment_id)

('Pasta Carbonara', 'Creamy pasta with bacon and parmesan', 700.00, 'Main Course', 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500', TRUE),) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

('Grilled Chicken', 'Tender grilled chicken breast with vegetables', 800.00, 'Main Course', 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500', TRUE),

('Fish and Chips', 'Crispy battered fish with french fries', 900.00, 'Main Course', 'https://images.unsplash.com/photo-1579208575657-c595a05383b7?w=500', TRUE),-- ============================================================================

('Vegetable Spring Rolls', 'Crispy spring rolls with mixed vegetables', 350.00, 'Appetizers', 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=500', TRUE),-- 9. DRIVERS TABLE

('Tiramisu', 'Classic Italian dessert with coffee and mascarpone', 450.00, 'Desserts', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500', TRUE);-- ============================================================================

-- Stores delivery driver information

-- Insert driver profilesCREATE TABLE IF NOT EXISTS drivers (

INSERT INTO drivers (user_id, name, phone, license_number, vehicle_number, vehicle_type, available, rating, total_deliveries) VALUES    id BIGINT AUTO_INCREMENT PRIMARY KEY,

(4, 'driver1', '0771234567', 'B1234567', 'CAA-1234', 'Motorcycle', TRUE, 4.50, 45),    user_id BIGINT NOT NULL,

(5, 'driver2', '0771234568', 'DL-9876543', 'BAA-5678', 'Motorcycle', TRUE, 4.70, 52),    name VARCHAR(255) NOT NULL,

(6, 'driver3', '0771234569', 'A7654321', 'CAB-9012', 'Motorcycle', TRUE, 4.30, 38),    phone VARCHAR(20) NOT NULL,

(7, 'john.driver', '+1234567894', 'C2468135', 'KL-45-AB-6789', 'Motorcycle', TRUE, 4.80, 67),    email VARCHAR(255),

(8, 'sarah.rider', '+1234567895', 'DL-5551234', 'WP-ABC-1234', 'Motorcycle', TRUE, 4.90, 73),    vehicle_type VARCHAR(50),

(9, 'ahmed.khan', '+1234567896', 'B9988776', 'CP-XYZ-5678', 'Motorcycle', TRUE, 4.60, 55),    vehicle_number VARCHAR(50),

(10, 'qwerty.ytrewq', '0123456789', 'A1122334', 'NC-DEF-9012', 'Motorcycle', TRUE, 4.40, 41),    license_number VARCHAR(50),

(11, 'DrivTest', '0123456789', 'bnm234567875', 'KL-5678', 'Motorcycle', TRUE, 0.00, 0);    available TINYINT(1) DEFAULT 1,

    rating DECIMAL(3,2) DEFAULT 0.00,

-- Insert sample orders    total_deliveries INT DEFAULT 0,

INSERT INTO orders (user_id, total_amount, status, payment_method, payment_status, order_type, delivery_address, order_date) VALUES    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

(2, 1500.00, 'DELIVERED', 'COD', 'PAID', 'DELIVERY', '123 Main St, Colombo', '2025-10-20 12:30:00'),    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

(3, 950.00, 'DELIVERED', 'CARD', 'PAID', 'DELIVERY', '456 Park Ave, Kandy', '2025-10-21 18:45:00'),    

(2, 1200.00, 'OUT_FOR_DELIVERY', 'COD', 'PENDING', 'DELIVERY', '123 Main St, Colombo', '2025-10-26 19:30:00'),    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

(3, 850.00, 'PREPARING', 'BANK_TRANSFER', 'PAID', 'DELIVERY', '456 Park Ave, Kandy', '2025-10-26 20:15:00'),    INDEX idx_user_id (user_id),

(2, 700.00, 'PENDING', 'COD', 'PENDING', 'DELIVERY', '123 Main St, Colombo', '2025-10-26 21:00:00');    INDEX idx_available (available)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert order items

INSERT INTO order_items (order_id, menu_id, quantity, price, subtotal) VALUES-- ============================================================================

(1, 1, 1, 850.00, 850.00),-- 10. DELIVERIES TABLE

(1, 2, 1, 650.00, 650.00),-- ============================================================================

(2, 3, 1, 750.00, 750.00),-- Tracks delivery assignments and status

(2, 5, 1, 200.00, 200.00),CREATE TABLE IF NOT EXISTS deliveries (

(3, 1, 1, 850.00, 850.00),    id BIGINT AUTO_INCREMENT PRIMARY KEY,

(3, 6, 1, 350.00, 350.00),    order_id BIGINT NOT NULL,

(4, 2, 1, 650.00, 650.00),    driver_id BIGINT,

(4, 5, 1, 200.00, 200.00),    pickup_time DATETIME,

(5, 11, 1, 700.00, 700.00);    delivery_time DATETIME,

    delivery_status VARCHAR(50) DEFAULT 'PENDING',

-- Insert deliveries    notes TEXT,

INSERT INTO deliveries (order_id, driver_id, pickup_address, delivery_address, status, estimated_delivery_time) VALUES    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

(1, 4, 'BMS Kingdom of Taste, 187/1/B Hokandara', '123 Main St, Colombo', 'DELIVERED', '2025-10-20 13:00:00'),    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

(2, 5, 'BMS Kingdom of Taste, 187/1/B Hokandara', '456 Park Ave, Kandy', 'DELIVERED', '2025-10-21 19:15:00'),    

(3, 7, 'BMS Kingdom of Taste, 187/1/B Hokandara', '123 Main St, Colombo', 'PICKED_UP', '2025-10-26 20:00:00'),    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,

(4, 8, 'BMS Kingdom of Taste, 187/1/B Hokandara', '456 Park Ave, Kandy', 'ASSIGNED', '2025-10-26 20:45:00'),    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE SET NULL,

(5, NULL, 'BMS Kingdom of Taste, 187/1/B Hokandara', '123 Main St, Colombo', 'PENDING', '2025-10-26 21:30:00');    INDEX idx_order_id (order_id),

    INDEX idx_driver_id (driver_id),

-- Insert reservations    INDEX idx_status (delivery_status)

INSERT INTO reservations (user_id, guest_name, guest_phone, guest_email, reservation_date, reservation_time, number_of_guests, status) VALUES) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

(2, 'John Doe', '+94771234567', 'john@example.com', '2025-10-28', '19:00:00', 4, 'CONFIRMED'),

(3, 'Jane Smith', '+94771234568', 'jane@example.com', '2025-10-29', '20:00:00', 2, 'CONFIRMED'),-- ============================================================================

(2, 'John Doe', '+94771234567', 'john@example.com', '2025-10-30', '18:30:00', 6, 'PENDING');-- 11. DELIVERY_DRIVERS TABLE

-- ============================================================================

-- Insert payment slips-- Maps drivers to specific delivery assignments

INSERT INTO payment_slips (order_id, user_id, slip_image_url, amount, reference_number, status) VALUESCREATE TABLE IF NOT EXISTS delivery_drivers (

(4, 3, '/uploads/payment-slips/slip-2025-10-26-001.jpg', 850.00, 'REF20251026001', 'APPROVED');    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    delivery_id BIGINT NOT NULL,

-- Insert notifications    driver_id BIGINT NOT NULL,

INSERT INTO notifications (user_id, title, message, type, is_read) VALUES    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

(2, 'Order Confirmed', 'Your order #1 has been confirmed', 'ORDER', TRUE),    notes TEXT,

(2, 'Order Out for Delivery', 'Your order #3 is out for delivery', 'DELIVERY', FALSE),    

(3, 'Order Confirmed', 'Your order #2 has been confirmed', 'ORDER', TRUE),    FOREIGN KEY (delivery_id) REFERENCES deliveries(id) ON DELETE CASCADE,

(3, 'Payment Approved', 'Your payment slip has been approved', 'PAYMENT', FALSE);    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE,

    INDEX idx_delivery_id (delivery_id),

-- Insert order tracking    INDEX idx_driver_id (driver_id)

INSERT INTO order_tracking (order_id, status, notes, updated_by) VALUES) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

(1, 'PENDING', 'Order received', 'system'),

(1, 'PROCESSING', 'Payment confirmed', 'admin'),-- ============================================================================

(1, 'PREPARING', 'Kitchen started preparation', 'kitchen'),-- 12. NOTIFICATIONS TABLE

(1, 'OUT_FOR_DELIVERY', 'Assigned to driver', 'admin'),-- ============================================================================

(1, 'DELIVERED', 'Order delivered successfully', 'driver1'),-- Stores user notifications

(3, 'PENDING', 'Order received', 'system'),CREATE TABLE IF NOT EXISTS notifications (

(3, 'PROCESSING', 'Payment confirmed', 'admin'),    id BIGINT AUTO_INCREMENT PRIMARY KEY,

(3, 'OUT_FOR_DELIVERY', 'Assigned to driver', 'admin');    user_id BIGINT NOT NULL,

    title VARCHAR(255) NOT NULL,

-- Insert system settings    message TEXT NOT NULL,

INSERT INTO system_settings (setting_key, setting_value, description) VALUES    type VARCHAR(50) DEFAULT 'INFO',

('restaurant_name', 'BMS Kingdom of Taste', 'Restaurant display name'),    is_read TINYINT(1) DEFAULT 0,

('contact_phone', '+94 11 217 1944', 'Restaurant contact number'),    link VARCHAR(255),

('contact_email', 'info@bmskingdomoftaste.com', 'Restaurant email'),    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

('address', 'No 187/1/B, Hokandara 10230', 'Restaurant address'),    read_at DATETIME,

('delivery_charge', '150.00', 'Standard delivery charge'),    

('min_order_amount', '500.00', 'Minimum order amount for delivery');    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

    INDEX idx_user_id (user_id),

-- ========================================    INDEX idx_is_read (is_read),

-- END OF SCRIPT    INDEX idx_created_at (created_at)

-- ========================================) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================================
-- 13. FEEDBACKS TABLE
-- ============================================================================
-- Stores customer feedback and suggestions
CREATE TABLE IF NOT EXISTS feedbacks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    order_id BIGINT,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    feedback_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_order_id (order_id),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 14. REVIEWS TABLE
-- ============================================================================
-- Stores product/service reviews
CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    menu_id BIGINT,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    verified_purchase TINYINT(1) DEFAULT 0,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_menu_id (menu_id),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- USEFUL QUERIES
-- ============================================================================

-- Query 1: Get all available menu items with discounts
-- SELECT id, name, price, discount_percentage, discounted_price, category
-- FROM menus
-- WHERE is_available = 1
-- ORDER BY is_featured DESC, category, name;

-- Query 2: Get user's order history with totals
-- SELECT o.id, o.order_date, o.status, o.total_amount, o.payment_status
-- FROM orders o
-- WHERE o.user_id = ?
-- ORDER BY o.order_date DESC;

-- Query 3: Get pending reservations for today
-- SELECT r.id, r.reservation_time, r.customer_name, r.number_of_people, r.table_number
-- FROM reservations r
-- WHERE r.reservation_date = CURDATE()
-- AND r.status = 'PENDING'
-- ORDER BY r.reservation_time;

-- Query 4: Get low stock menu items
-- SELECT id, name, stock_quantity, low_stock_threshold
-- FROM menus
-- WHERE stock_quantity <= low_stock_threshold
-- AND is_available = 1
-- ORDER BY stock_quantity ASC;

-- Query 5: Get today's sales summary
-- SELECT 
--     COUNT(*) as total_orders,
--     SUM(total_amount) as total_revenue,
--     AVG(total_amount) as average_order_value,
--     SUM(CASE WHEN status = 'DELIVERED' THEN 1 ELSE 0 END) as completed_orders
-- FROM orders
-- WHERE DATE(order_date) = CURDATE();

-- Query 6: Get most popular menu items
-- SELECT m.id, m.name, m.category, COUNT(oi.id) as order_count
-- FROM menus m
-- JOIN order_items oi ON m.id = oi.menu_id
-- JOIN orders o ON oi.order_id = o.id
-- WHERE o.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
-- GROUP BY m.id, m.name, m.category
-- ORDER BY order_count DESC
-- LIMIT 10;

-- Query 7: Get active drivers with current delivery count
-- SELECT d.id, d.name, d.phone, d.rating, 
--        COUNT(DISTINCT del.id) as active_deliveries
-- FROM drivers d
-- LEFT JOIN deliveries del ON d.id = del.driver_id 
--     AND del.delivery_status IN ('PENDING', 'IN_TRANSIT')
-- WHERE d.available = 1
-- GROUP BY d.id, d.name, d.phone, d.rating
-- ORDER BY active_deliveries ASC;

-- Query 8: Get payment statistics
-- SELECT 
--     payment_method,
--     COUNT(*) as transaction_count,
--     SUM(amount) as total_amount,
--     SUM(CASE WHEN status = 'COMPLETED' THEN amount ELSE 0 END) as completed_amount
-- FROM payments
-- WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
-- GROUP BY payment_method;

-- Query 9: Get reservation statistics by time slot
-- SELECT 
--     time_slot,
--     COUNT(*) as total_reservations,
--     SUM(CASE WHEN status = 'CONFIRMED' THEN 1 ELSE 0 END) as confirmed,
--     SUM(CASE WHEN status = 'CANCELLED' THEN 1 ELSE 0 END) as cancelled
-- FROM reservations
-- WHERE reservation_date BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND CURDATE()
-- GROUP BY time_slot
-- ORDER BY time_slot;

-- Query 10: Get user activity with promo code usage
-- SELECT u.id, u.username, u.email, u.promo_code, u.discount_percent,
--        COUNT(DISTINCT o.id) as total_orders,
--        SUM(o.total_amount) as total_spent
-- FROM users u
-- LEFT JOIN orders o ON u.id = o.user_id
-- WHERE u.promo_active = 1
-- GROUP BY u.id, u.username, u.email, u.promo_code, u.discount_percent
-- ORDER BY total_spent DESC;

-- ============================================================================
-- MAINTENANCE QUERIES
-- ============================================================================

-- Check database size
-- SELECT 
--     table_name AS 'Table',
--     ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
-- FROM information_schema.TABLES
-- WHERE table_schema = 'restaurant_db'
-- ORDER BY (data_length + index_length) DESC;

-- Check table row counts
-- SELECT table_name, table_rows
-- FROM information_schema.tables
-- WHERE table_schema = 'restaurant_db'
-- ORDER BY table_rows DESC;

-- Find orphaned records (orders without users - should not exist with FK)
-- SELECT o.id, o.user_id, o.order_date
-- FROM orders o
-- LEFT JOIN users u ON o.user_id = u.id
-- WHERE u.id IS NULL;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
