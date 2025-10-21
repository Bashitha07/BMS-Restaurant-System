-- ===============================================
-- Restaurant Management System Database Setup
-- Version: 2.0 (Corrected to match JPA Entities)
-- Date: October 20, 2025
-- ===============================================

-- Drop and recreate database for clean setup
DROP DATABASE IF EXISTS restaurant_db;
CREATE DATABASE restaurant_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE restaurant_db;

-- ===============================================
-- TABLE 1: USERS (matches User.java entity)
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
-- TABLE 2: MENUS (matches Menu.java entity - NOT menu_items)
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
    INDEX idx_featured (is_featured)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- TABLE 3: ORDERS (matches Order.java entity)
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
    INDEX idx_order_date (order_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- TABLE 4: ORDER_ITEMS (matches OrderItem.java entity)
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
-- TABLE 5: RESERVATIONS (matches Reservation.java entity)
-- ===============================================
CREATE TABLE reservations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    
    -- Date and time
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    reservation_date_time DATETIME NOT NULL,
    time_slot VARCHAR(50),
    
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
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- TABLE 6: PAYMENTS (matches Payment.java entity)
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
    payment_gateway VARCHAR(50),
    gateway_transaction_id VARCHAR(100),
    
    -- Dates (nullable for backward compatibility)
    submitted_date DATETIME DEFAULT CURRENT_TIMESTAMP,
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
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- TABLE 7: PAYMENT_SLIPS (matches PaymentSlip.java entity)
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
    confirmed_by VARCHAR(50),
    rejection_reason TEXT,
    admin_notes TEXT,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- TABLE 8: DELIVERY_DRIVERS (matches DeliveryDriver.java entity)
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
    vehicle_type VARCHAR(50) NOT NULL,
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
    commission_rate DECIMAL(5,2),
    
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
    max_delivery_distance DECIMAL(5,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_status (status),
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- TABLE 9: DRIVERS (simplified version)
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
    
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- TABLE 10: DELIVERIES (matches Delivery.java entity)
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
    customer_rating INT,
    customer_feedback TEXT,
    proof_of_delivery VARCHAR(255),
    
    -- Legacy fields
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
-- TABLE 11: ORDER_TRACKING (matches OrderTracking.java entity)
-- ===============================================
CREATE TABLE order_tracking (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed BOOLEAN DEFAULT FALSE,
    actor VARCHAR(100),
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- TABLE 12: NOTIFICATIONS (matches Notification.java entity)
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
    reference_id BIGINT,
    reference_type VARCHAR(50),
    
    is_global BOOLEAN DEFAULT FALSE,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- TABLE 13: FEEDBACKS (matches Feedback.java entity)
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
-- TABLE 14: REVIEWS (matches Review.java entity)
-- ===============================================
CREATE TABLE reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    menu_id BIGINT NOT NULL,
    rating INT NOT NULL,
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
INSERT INTO menus (name, description, price, category, is_available, preparation_time, is_vegetarian, is_featured) VALUES
-- Appetizers
('Spring Rolls', 'Crispy vegetable spring rolls with sweet chili sauce', 6.99, 'APPETIZER', TRUE, 10, TRUE, FALSE),
('Chicken Wings', 'Spicy buffalo chicken wings with blue cheese dip', 9.99, 'APPETIZER', TRUE, 15, FALSE, TRUE),
('Garlic Bread', 'Toasted bread with garlic butter and herbs', 4.99, 'APPETIZER', TRUE, 8, TRUE, FALSE),
('Mozzarella Sticks', 'Crispy fried mozzarella with marinara sauce', 7.99, 'APPETIZER', TRUE, 12, TRUE, FALSE),

-- Main Course
('Grilled Chicken Burger', 'Juicy grilled chicken with lettuce, tomato, and mayo', 12.99, 'MAIN_COURSE', TRUE, 20, FALSE, TRUE),
('Chicken Biryani', 'Aromatic basmati rice with tender chicken and spices', 14.99, 'MAIN_COURSE', TRUE, 30, FALSE, TRUE),
('Vegetable Pasta', 'Penne pasta with fresh vegetables in tomato sauce', 10.99, 'MAIN_COURSE', TRUE, 20, TRUE, FALSE),
('Grilled Salmon', 'Fresh salmon fillet with lemon butter sauce', 18.99, 'MAIN_COURSE', TRUE, 25, FALSE, TRUE),
('Beef Burger', 'Juicy beef patty with cheese, lettuce, and tomato', 11.99, 'MAIN_COURSE', TRUE, 15, FALSE, FALSE),
('Margherita Pizza', 'Classic pizza with tomato sauce, mozzarella, and basil', 13.99, 'MAIN_COURSE', TRUE, 18, TRUE, FALSE),
('Classic Caesar Salad', 'Fresh romaine lettuce with Caesar dressing and croutons', 9.99, 'MAIN_COURSE', TRUE, 10, TRUE, FALSE),

-- Desserts
('Chocolate Lava Cake', 'Warm chocolate cake with molten center', 7.99, 'DESSERT', TRUE, 12, TRUE, TRUE),
('Chocolate Brownie', 'Rich chocolate brownie with vanilla ice cream', 6.99, 'DESSERT', TRUE, 10, TRUE, FALSE),
('Tiramisu', 'Classic Italian dessert with coffee and mascarpone', 8.99, 'DESSERT', TRUE, 10, TRUE, FALSE),
('Ice Cream Sundae', 'Vanilla ice cream with chocolate sauce and nuts', 5.99, 'DESSERT', TRUE, 5, TRUE, FALSE),
('Cheesecake', 'New York style cheesecake with strawberry topping', 7.99, 'DESSERT', TRUE, 8, TRUE, FALSE),

-- Beverages
('Fresh Orange Juice', 'Freshly squeezed orange juice', 4.99, 'BEVERAGE', TRUE, 5, TRUE, FALSE),
('Coffee', 'Hot brewed coffee', 2.99, 'BEVERAGE', TRUE, 5, TRUE, FALSE),
('Soft Drink', 'Coca-Cola, Sprite, or Fanta', 2.49, 'BEVERAGE', TRUE, 2, TRUE, FALSE),
('Iced Tea', 'Refreshing iced tea with lemon', 3.49, 'BEVERAGE', TRUE, 5, TRUE, FALSE),
('Smoothie', 'Fruit smoothie (strawberry, mango, or mixed berry)', 5.99, 'BEVERAGE', TRUE, 7, TRUE, FALSE);

-- Insert sample driver applications
INSERT INTO delivery_drivers (name, email, username, password, phone, address, license_number, vehicle_number, vehicle_type, status, hire_date) VALUES
('John Driver', 'john.driver@example.com', 'johndriver', '$2a$10$xKHSwKGfXqZxEJeGW5HEtuGzDqRnWUXD0vbH1K5PkQ4YKh8Brs.Zy', '+1234567894', '123 Main St', 'DL12345', 'AB123CD', 'MOTORCYCLE', 'PENDING', NOW()),
('Sarah Rider', 'sarah.rider@example.com', 'sarahrider', '$2a$10$xKHSwKGfXqZxEJeGW5HEtuGzDqRnWUXD0vbH1K5PkQ4YKh8Brs.Zy', '+1234567895', '456 Oak Ave', 'DL67890', 'EF456GH', 'SCOOTER', 'PENDING', NOW()),
('Ahmed Khan', 'ahmed.khan@example.com', 'ahmedkhan', '$2a$10$xKHSwKGfXqZxEJeGW5HEtuGzDqRnWUXD0vbH1K5PkQ4YKh8Brs.Zy', '+1234567896', '789 Pine Rd', 'DL11223', 'IJ789KL', 'CAR', 'APPROVED', NOW());

-- Insert into drivers table
INSERT INTO drivers (name, phone, email, vehicle_type, vehicle_number, license_number, status, rating) VALUES
('John Driver', '+1234567894', 'john.driver@example.com', 'MOTORCYCLE', 'AB123CD', 'DL12345', 'PENDING', 0.00),
('Sarah Rider', '+1234567895', 'sarah.rider@example.com', 'SCOOTER', 'EF456GH', 'DL67890', 'PENDING', 0.00),
('Ahmed Khan', '+1234567896', 'ahmed.khan@example.com', 'CAR', 'IJ789KL', 'DL11223', 'APPROVED', 4.75);

-- ===============================================
-- VERIFICATION QUERIES
-- ===============================================

-- Verify all tables created
SELECT 
    TABLE_NAME,
    TABLE_ROWS,
    AUTO_INCREMENT,
    CREATE_TIME
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'restaurant_db'
ORDER BY TABLE_NAME;

-- Verify sample data
SELECT 'Users' AS table_name, COUNT(*) AS count FROM users
UNION ALL
SELECT 'Menus', COUNT(*) FROM menus
UNION ALL
SELECT 'Drivers', COUNT(*) FROM delivery_drivers
UNION ALL
SELECT 'Drivers (simple)', COUNT(*) FROM drivers;

-- Display admin credentials
SELECT id, username, email, role FROM users WHERE role = 'ADMIN';

-- Display menu summary
SELECT 
    category,
    COUNT(*) as item_count,
    MIN(price) as min_price,
    MAX(price) as max_price,
    AVG(price) as avg_price,
    SUM(CASE WHEN is_featured = TRUE THEN 1 ELSE 0 END) as featured_count
FROM menus
GROUP BY category
ORDER BY category;

-- ===============================================
-- END OF SCRIPT
-- ===============================================
