-- ============================================================================
-- Restaurant Management System - Complete Database Schema
-- ============================================================================
-- Database: restaurant_db
-- Version: 2.0
-- Last Updated: October 23, 2025
-- Description: Complete schema with all tables, indexes, and sample queries
-- ============================================================================

-- Drop database if exists (CAUTION: This will delete all data)
-- DROP DATABASE IF EXISTS restaurant_db;

-- Create database
CREATE DATABASE IF NOT EXISTS restaurant_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE restaurant_db;

-- ============================================================================
-- 1. USERS TABLE
-- ============================================================================
-- Stores user account information including authentication and promo codes
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    role ENUM('USER', 'ADMIN', 'MANAGER', 'KITCHEN', 'DRIVER') NOT NULL DEFAULT 'USER',
    enabled TINYINT(1) DEFAULT 1,
    
    -- Promotional fields
    promo_code VARCHAR(255),
    discount_percent DECIMAL(5,2) DEFAULT 0.00,
    promo_expires DATETIME,
    promo_active TINYINT(1) DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_role (role),
    INDEX idx_promo_code (promo_code),
    INDEX idx_enabled (enabled)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 2. MENUS TABLE
-- ============================================================================
-- Stores menu items with pricing, dietary info, and stock management
CREATE TABLE IF NOT EXISTS menus (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(255) NOT NULL,
    is_available TINYINT(1) DEFAULT 1,
    image_url VARCHAR(255),
    
    -- Preparation details
    preparation_time INT COMMENT 'Time in minutes',
    ingredients TEXT,
    
    -- Dietary information
    is_vegetarian TINYINT(1) DEFAULT 0,
    is_vegan TINYINT(1) DEFAULT 0,
    is_gluten_free TINYINT(1) DEFAULT 0,
    is_spicy TINYINT(1) DEFAULT 0,
    spice_level INT COMMENT '1-5 scale',
    
    -- Stock management
    stock_quantity INT,
    low_stock_threshold INT DEFAULT 10,
    
    -- Promotion fields
    is_featured TINYINT(1) DEFAULT 0,
    discount_percentage DECIMAL(5,2) DEFAULT 0.00,
    discounted_price DECIMAL(10,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_category (category),
    INDEX idx_available (is_available),
    INDEX idx_featured (is_featured),
    INDEX idx_price (price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 3. ORDERS TABLE
-- ============================================================================
-- Stores customer orders with payment and delivery details
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM(
        'PENDING',
        'CONFIRMED',
        'PREPARING',
        'READY_FOR_PICKUP',
        'OUT_FOR_DELIVERY',
        'DELIVERED',
        'CANCELLED',
        'REFUNDED'
    ) NOT NULL DEFAULT 'PENDING',
    
    -- Financial details
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    subtotal DECIMAL(10,2) DEFAULT 0.00,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    delivery_fee DECIMAL(10,2) DEFAULT 0.00,
    
    -- Payment information
    payment_method ENUM(
        'CASH',
        'CREDIT_CARD',
        'DEBIT_CARD',
        'ONLINE',
        'BANK_TRANSFER',
        'DIGITAL_WALLET'
    ),
    payment_status ENUM(
        'PENDING',
        'PROCESSING',
        'COMPLETED',
        'FAILED',
        'CANCELLED',
        'REFUNDED',
        'PARTIALLY_REFUNDED'
    ) DEFAULT 'PENDING',
    
    -- Delivery details
    delivery_address VARCHAR(255),
    delivery_phone VARCHAR(255),
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

-- ============================================================================
-- 4. ORDER_ITEMS TABLE
-- ============================================================================
-- Stores individual items within each order
CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    menu_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    special_requests TEXT,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE RESTRICT,
    INDEX idx_order_id (order_id),
    INDEX idx_menu_id (menu_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 5. ORDER_TRACKING TABLE
-- ============================================================================
-- Tracks order status changes and history
CREATE TABLE IF NOT EXISTS order_tracking (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    updated_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_order_id (order_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 6. RESERVATIONS TABLE
-- ============================================================================
-- Stores table reservations with time slots and customer details
CREATE TABLE IF NOT EXISTS reservations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    
    -- Date and time information
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    reservation_date_time DATETIME NOT NULL,
    time_slot VARCHAR(255) COMMENT 'e.g., 12:00-13:00',
    
    -- Reservation details
    number_of_people INT NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(255) NOT NULL,
    special_requests TEXT,
    
    -- Status and table assignment
    status ENUM(
        'PENDING',
        'CONFIRMED',
        'SEATED',
        'CANCELLED',
        'NO_SHOW',
        'COMPLETED'
    ) NOT NULL DEFAULT 'PENDING',
    table_number INT,
    
    -- Tracking timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    confirmed_at DATETIME,
    cancelled_at DATETIME,
    cancellation_reason VARCHAR(255),
    
    -- Admin features
    reminder_sent TINYINT(1) DEFAULT 0,
    admin_notes TEXT,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_reservation_date (reservation_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 7. PAYMENTS TABLE
-- ============================================================================
-- Stores payment transactions with refund support
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    
    -- Payment method and gateway
    payment_method ENUM(
        'CASH',
        'CREDIT_CARD',
        'DEBIT_CARD',
        'ONLINE',
        'BANK_TRANSFER',
        'DIGITAL_WALLET'
    ) NOT NULL,
    status ENUM(
        'PENDING',
        'PROCESSING',
        'COMPLETED',
        'FAILED',
        'CANCELLED',
        'REFUNDED',
        'PARTIALLY_REFUNDED'
    ) NOT NULL DEFAULT 'PENDING',
    
    -- Transaction details
    transaction_id VARCHAR(255),
    slip_image VARCHAR(255),
    payment_gateway VARCHAR(255),
    gateway_transaction_id VARCHAR(255),
    
    -- Timestamps
    submitted_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    processed_date DATETIME,
    approved_date DATETIME,
    
    -- Failure and refund information
    failure_reason VARCHAR(255),
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

-- ============================================================================
-- 8. PAYMENT_SLIPS TABLE
-- ============================================================================
-- Stores uploaded payment slip images
CREATE TABLE IF NOT EXISTS payment_slips (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    payment_id BIGINT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified TINYINT(1) DEFAULT 0,
    verified_by BIGINT,
    verified_at DATETIME,
    
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_payment_id (payment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 9. DRIVERS TABLE
-- ============================================================================
-- Stores delivery driver information
CREATE TABLE IF NOT EXISTS drivers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    vehicle_type VARCHAR(50),
    vehicle_number VARCHAR(50),
    license_number VARCHAR(50),
    available TINYINT(1) DEFAULT 1,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_deliveries INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_available (available)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 10. DELIVERIES TABLE
-- ============================================================================
-- Tracks delivery assignments and status
CREATE TABLE IF NOT EXISTS deliveries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    driver_id BIGINT,
    pickup_time DATETIME,
    delivery_time DATETIME,
    delivery_status VARCHAR(50) DEFAULT 'PENDING',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE SET NULL,
    INDEX idx_order_id (order_id),
    INDEX idx_driver_id (driver_id),
    INDEX idx_status (delivery_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 11. DELIVERY_DRIVERS TABLE
-- ============================================================================
-- Maps drivers to specific delivery assignments
CREATE TABLE IF NOT EXISTS delivery_drivers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    delivery_id BIGINT NOT NULL,
    driver_id BIGINT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    
    FOREIGN KEY (delivery_id) REFERENCES deliveries(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE,
    INDEX idx_delivery_id (delivery_id),
    INDEX idx_driver_id (driver_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 12. NOTIFICATIONS TABLE
-- ============================================================================
-- Stores user notifications
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'INFO',
    is_read TINYINT(1) DEFAULT 0,
    link VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at DATETIME,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
