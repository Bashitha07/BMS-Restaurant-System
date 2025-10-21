-- =====================================================
-- COMPLETE DATABASE FIX FOR RESTAURANT SYSTEM
-- Run this script to fix ALL database issues
-- =====================================================

USE restaurant_db;

-- =====================================================
-- 1. FIX DATETIME VALIDATION ERRORS
-- =====================================================

-- Fix payments table
UPDATE payments 
SET payment_date = CURRENT_TIMESTAMP 
WHERE payment_date IS NULL 
   OR payment_date = '0000-00-00 00:00:00';

UPDATE payments 
SET created_at = CURRENT_TIMESTAMP 
WHERE created_at IS NULL 
   OR created_at = '0000-00-00 00:00:00';

UPDATE payments 
SET updated_at = CURRENT_TIMESTAMP 
WHERE updated_at IS NULL 
   OR updated_at = '0000-00-00 00:00:00';

-- Fix reservations table
UPDATE reservations 
SET reservation_date = CURDATE() 
WHERE reservation_date IS NULL 
   OR reservation_date = '0000-00-00';

UPDATE reservations 
SET reservation_time = '12:00:00' 
WHERE reservation_time IS NULL 
   OR reservation_time = '00:00:00';

UPDATE reservations 
SET created_at = CURRENT_TIMESTAMP 
WHERE created_at IS NULL 
   OR created_at = '0000-00-00 00:00:00';

UPDATE reservations 
SET updated_at = CURRENT_TIMESTAMP 
WHERE updated_at IS NULL 
   OR updated_at = '0000-00-00 00:00:00';

-- Fix orders table
UPDATE orders 
SET order_date = CURRENT_TIMESTAMP 
WHERE order_date IS NULL 
   OR order_date = '0000-00-00 00:00:00';

UPDATE orders 
SET updated_at = CURRENT_TIMESTAMP 
WHERE updated_at IS NULL 
   OR updated_at = '0000-00-00 00:00:00';

-- Fix users table
UPDATE users 
SET created_at = CURRENT_TIMESTAMP 
WHERE created_at IS NULL 
   OR created_at = '0000-00-00 00:00:00';

UPDATE users 
SET updated_at = CURRENT_TIMESTAMP 
WHERE updated_at IS NULL 
   OR updated_at = '0000-00-00 00:00:00';

-- Fix menu_items table
UPDATE menu_items 
SET created_at = CURRENT_TIMESTAMP 
WHERE created_at IS NULL 
   OR created_at = '0000-00-00 00:00:00';

UPDATE menu_items 
SET updated_at = CURRENT_TIMESTAMP 
WHERE updated_at IS NULL 
   OR updated_at = '0000-00-00 00:00:00';

-- Fix menu_categories table
UPDATE menu_categories 
SET created_at = CURRENT_TIMESTAMP 
WHERE created_at IS NULL 
   OR created_at = '0000-00-00 00:00:00';

UPDATE menu_categories 
SET updated_at = CURRENT_TIMESTAMP 
WHERE updated_at IS NULL 
   OR updated_at = '0000-00-00 00:00:00';

-- Fix order_items table
UPDATE order_items 
SET created_at = CURRENT_TIMESTAMP 
WHERE created_at IS NULL 
   OR created_at = '0000-00-00 00:00:00';

-- =====================================================
-- 2. CREATE MISSING TABLES
-- =====================================================

-- Delivery Drivers Table
CREATE TABLE IF NOT EXISTS delivery_drivers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    license_number VARCHAR(50) NOT NULL UNIQUE,
    vehicle_number VARCHAR(50) NOT NULL UNIQUE,
    vehicle_type VARCHAR(50) NOT NULL,
    vehicle_model VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    hire_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    birth_date DATE,
    emergency_contact VARCHAR(100),
    emergency_phone VARCHAR(20),
    hourly_rate DECIMAL(10, 2) DEFAULT 0.00,
    commission_rate DECIMAL(5, 2) DEFAULT 0.00,
    total_deliveries INT DEFAULT 0,
    total_earnings DECIMAL(10, 2) DEFAULT 0.00,
    average_rating DECIMAL(3, 2) DEFAULT 0.00,
    total_ratings INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    current_location_lat DECIMAL(10, 8),
    current_location_lng DECIMAL(11, 8),
    max_delivery_distance DECIMAL(5, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_status (status),
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_is_active (is_active)
);

-- Deliveries Table
CREATE TABLE IF NOT EXISTS deliveries (
    delivery_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    driver_id BIGINT,
    pickup_location VARCHAR(255),
    delivery_location VARCHAR(255) NOT NULL,
    delivery_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    estimated_delivery_time TIMESTAMP NULL,
    actual_delivery_time TIMESTAMP NULL,
    delivery_fee DECIMAL(10, 2) DEFAULT 0.00,
    delivery_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES delivery_drivers(id) ON DELETE SET NULL,
    
    INDEX idx_order_id (order_id),
    INDEX idx_driver_id (driver_id),
    INDEX idx_status (delivery_status)
);

-- Order Tracking Table
CREATE TABLE IF NOT EXISTS order_tracking (
    tracking_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    delivery_id BIGINT,
    current_status VARCHAR(50) NOT NULL,
    location_latitude DECIMAL(10, 8),
    location_longitude DECIMAL(11, 8),
    estimated_delivery_time TIMESTAMP NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (delivery_id) REFERENCES deliveries(delivery_id) ON DELETE SET NULL,
    
    INDEX idx_order_id (order_id),
    INDEX idx_delivery_id (delivery_id),
    INDEX idx_status (current_status)
);

-- Payment Slips Table (for bank transfer confirmations)
CREATE TABLE IF NOT EXISTS payment_slips (
    slip_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    slip_image_url VARCHAR(500) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    bank_name VARCHAR(100),
    transaction_reference VARCHAR(100),
    uploaded_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verification_status VARCHAR(20) DEFAULT 'PENDING',
    verified_by BIGINT,
    verified_date TIMESTAMP NULL,
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_order_id (order_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (verification_status)
);

-- =====================================================
-- 3. ADD SAMPLE PENDING DRIVER APPLICATIONS
-- =====================================================

INSERT INTO delivery_drivers (
    name, email, username, password, phone, address,
    license_number, vehicle_number, vehicle_type, vehicle_model,
    status, hire_date, birth_date, emergency_contact, emergency_phone,
    hourly_rate, commission_rate
) VALUES 
(
    'John Driver',
    'john.driver@example.com',
    'john_driver',
    '$2a$10$6UVHQoHhpoHVVLAtXdYw.eYZ1/Vh4BTUt5CwHzz6oqW3kCXS8s7Zu', -- password123
    '+94771234567',
    '123 Main Street, Colombo 03',
    'DL-2024-001234',
    'ABC-1234',
    'MOTORCYCLE',
    'Honda Wave 125',
    'PENDING',
    CURRENT_TIMESTAMP,
    '1995-05-15',
    'Mary Driver',
    '+94771234568',
    500.00,
    10.00
),
(
    'Sarah Rider',
    'sarah.rider@example.com',
    'sarah_rider',
    '$2a$10$6UVHQoHhpoHVVLAtXdYw.eYZ1/Vh4BTUt5CwHzz6oqW3kCXS8s7Zu', -- password123
    '+94772345678',
    '456 Park Avenue, Kandy',
    'DL-2024-002345',
    'XYZ-5678',
    'SCOOTER',
    'Vespa LX 150',
    'PENDING',
    CURRENT_TIMESTAMP,
    '1998-08-22',
    'Tom Rider',
    '+94772345679',
    450.00,
    12.00
),
(
    'Ahmed Khan',
    'ahmed.khan@example.com',
    'ahmed_khan',
    '$2a$10$6UVHQoHhpoHVVLAtXdYw.eYZ1/Vh4BTUt5CwHzz6oqW3kCXS8s7Zu', -- password123
    '+94773456789',
    '789 Beach Road, Galle',
    'DL-2024-003456',
    'LMN-9012',
    'CAR',
    'Toyota Aqua 2020',
    'PENDING',
    CURRENT_TIMESTAMP,
    '1992-12-10',
    'Fatima Khan',
    '+94773456790',
    600.00,
    8.00
)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- =====================================================
-- 4. VERIFY DATABASE STRUCTURE
-- =====================================================

SELECT 'Database fix completed!' AS Status;

-- Show table counts
SELECT 
    (SELECT COUNT(*) FROM users) AS total_users,
    (SELECT COUNT(*) FROM delivery_drivers) AS total_drivers,
    (SELECT COUNT(*) FROM delivery_drivers WHERE status = 'PENDING') AS pending_drivers,
    (SELECT COUNT(*) FROM menu_items) AS total_menu_items,
    (SELECT COUNT(*) FROM orders) AS total_orders,
    (SELECT COUNT(*) FROM reservations) AS total_reservations,
    (SELECT COUNT(*) FROM payments) AS total_payments;

-- List all tables
SHOW TABLES;

-- =====================================================
-- DONE!
-- =====================================================
