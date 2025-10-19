-- ============================================
-- SIMPLIFIED Database Setup for Restaurant System
-- ============================================
-- This script keeps all tables but removes unnecessary attributes
-- for easier data management and updates
-- ============================================

CREATE DATABASE IF NOT EXISTS restaurant_db;
USE restaurant_db;

-- ============================================
-- 1. USERS TABLE (Simplified)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    enabled BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- 2. MENUS TABLE (Simplified - 21 Fields Total)
-- ============================================
CREATE TABLE IF NOT EXISTS menus (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(255),
    preparation_time INT DEFAULT 0,
    is_vegetarian BOOLEAN DEFAULT FALSE,
    is_vegan BOOLEAN DEFAULT FALSE,
    is_gluten_free BOOLEAN DEFAULT FALSE,
    is_spicy BOOLEAN DEFAULT FALSE,
    spice_level INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    stock_quantity INT DEFAULT 100,
    low_stock_threshold INT DEFAULT 10,
    ingredients TEXT,
    discount_percentage DECIMAL(5,2) DEFAULT 0.00,
    discounted_price DECIMAL(10,2) DEFAULT 0.00,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- 3. ORDERS TABLE (Simplified)
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'PENDING',
    total_amount DECIMAL(10,2) NOT NULL,
    delivery_address TEXT,
    delivery_phone VARCHAR(20),
    special_instructions TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- 4. ORDER_ITEMS TABLE (Simplified)
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    menu_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE
);

-- ============================================
-- 5. RESERVATIONS TABLE (Simplified)
-- ============================================
CREATE TABLE IF NOT EXISTS reservations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(100),
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    number_of_people INT NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    special_requests TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- 6. DRIVERS TABLE (Simplified)
-- ============================================
CREATE TABLE IF NOT EXISTS drivers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE,
    vehicle_number VARCHAR(20),
    status VARCHAR(20) DEFAULT 'AVAILABLE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- 7. DELIVERIES TABLE (Simplified)
-- ============================================
CREATE TABLE IF NOT EXISTS deliveries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    driver_id BIGINT,
    delivery_address TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    estimated_delivery_time DATETIME,
    actual_delivery_time DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE SET NULL
);

-- ============================================
-- 8. PAYMENTS TABLE (Simplified)
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    transaction_id VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- ============================================
-- 9. PAYMENT_SLIPS TABLE (Simplified)
-- ============================================
CREATE TABLE IF NOT EXISTS payment_slips (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- ============================================
-- 10. REVIEWS TABLE (Simplified)
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    menu_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Menus
CREATE INDEX idx_menus_category ON menus(category);
CREATE INDEX idx_menus_available ON menus(is_available);

-- Orders
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_date ON orders(order_date);

-- Order Items
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_menu_id ON order_items(menu_id);

-- Reservations
CREATE INDEX idx_reservations_user_id ON reservations(user_id);
CREATE INDEX idx_reservations_date ON reservations(reservation_date);
CREATE INDEX idx_reservations_status ON reservations(status);

-- Deliveries
CREATE INDEX idx_deliveries_order_id ON deliveries(order_id);
CREATE INDEX idx_deliveries_driver_id ON deliveries(driver_id);
CREATE INDEX idx_deliveries_status ON deliveries(status);

-- Payments
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Reviews
CREATE INDEX idx_reviews_menu_id ON reviews(menu_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);

-- ============================================
-- SAMPLE DATA
-- ============================================

-- Insert Admin and Test Users
INSERT INTO users (username, password, email, role, phone) VALUES
('admin', '$2a$10$7QJ6vQ6vQ6vQ6vQ6vQ6vQO7QJ6vQ6vQ6vQ6vQ6vQ6vQ6vQ6vQ6vQ6', 'admin@restaurant.com', 'ADMIN', '0771234567'),
('testuser', '$2a$10$7QJ6vQ6vQ6vQ6vQ6vQ6vQO7QJ6vQ6vQ6vQ6vQ6vQ6vQ6vQ6vQ6vQ6', 'test@restaurant.com', 'USER', '0777654321')
ON DUPLICATE KEY UPDATE username = username;

-- Insert Sample Menu Items
INSERT INTO menus (name, description, category, price, is_available, preparation_time, is_vegetarian, ingredients) VALUES
('Margherita Pizza', 'Classic pizza with tomato sauce, mozzarella, and basil', 'MAIN_COURSE', 850.00, TRUE, 25, TRUE, 'Dough, Tomato Sauce, Mozzarella, Basil'),
('Chicken Burger', 'Grilled chicken burger with lettuce and mayo', 'MAIN_COURSE', 650.00, TRUE, 20, FALSE, 'Chicken Breast, Bun, Lettuce, Mayo'),
('Caesar Salad', 'Fresh romaine lettuce with Caesar dressing', 'APPETIZER', 450.00, TRUE, 10, TRUE, 'Romaine Lettuce, Parmesan, Croutons, Caesar Dressing'),
('Chocolate Cake', 'Rich chocolate layer cake', 'DESSERT', 350.00, TRUE, 5, TRUE, 'Chocolate, Flour, Eggs, Sugar'),
('Fresh Orange Juice', 'Freshly squeezed orange juice', 'BEVERAGE', 250.00, TRUE, 5, TRUE, 'Fresh Oranges')
ON DUPLICATE KEY UPDATE name = name;

-- ============================================
-- USEFUL QUERIES FOR DATA MANAGEMENT
-- ============================================

-- View all users
-- SELECT id, username, email, role, enabled FROM users;

-- View all available menus
-- SELECT id, name, category, price, is_available FROM menus WHERE is_available = TRUE;

-- View all orders with customer info
-- SELECT o.id, o.order_date, o.status, o.total_amount, u.username, u.email 
-- FROM orders o JOIN users u ON o.user_id = u.id;

-- View order details with items
-- SELECT o.id AS order_id, m.name AS menu_item, oi.quantity, oi.unit_price, oi.total_price
-- FROM orders o
-- JOIN order_items oi ON o.id = oi.order_id
-- JOIN menus m ON oi.menu_id = m.id;

-- View all reservations
-- SELECT r.id, r.customer_name, r.reservation_date, r.reservation_time, r.number_of_people, r.status, u.username
-- FROM reservations r JOIN users u ON r.user_id = u.id;

-- View payments with order info
-- SELECT p.id, p.amount, p.payment_method, p.status, o.id AS order_id, u.username
-- FROM payments p
-- JOIN orders o ON p.order_id = o.id
-- JOIN users u ON o.user_id = u.id;

-- View reviews with menu and user info
-- SELECT r.rating, r.comment, m.name AS menu_name, u.username
-- FROM reviews r
-- JOIN menus m ON r.menu_id = m.id
-- JOIN users u ON r.user_id = u.id;

-- ============================================
-- SIMPLIFIED UPDATE EXAMPLES
-- ============================================

-- Update menu availability
-- UPDATE menus SET is_available = FALSE WHERE id = 1;

-- Update order status
-- UPDATE orders SET status = 'CONFIRMED' WHERE id = 1;

-- Update reservation status
-- UPDATE reservations SET status = 'CONFIRMED' WHERE id = 1;

-- Update user role
-- UPDATE users SET role = 'ADMIN' WHERE id = 2;

-- Update payment status
-- UPDATE payments SET status = 'COMPLETED' WHERE id = 1;

-- ============================================
-- DATA CLEANUP (Use with caution!)
-- ============================================

-- Delete all test data (Keep structure)
-- DELETE FROM reviews;
-- DELETE FROM payment_slips;
-- DELETE FROM payments;
-- DELETE FROM deliveries;
-- DELETE FROM order_items;
-- DELETE FROM orders;
-- DELETE FROM reservations;
-- DELETE FROM menus;
-- DELETE FROM drivers;
-- DELETE FROM users WHERE role != 'ADMIN';

-- ============================================
-- TABLE SUMMARY
-- ============================================
-- 1. users: 9 fields (Basic user authentication and profile)
-- 2. menus: 21 fields (Complete menu information - NO calories, NO allergens)
-- 3. orders: 10 fields (Order tracking)
-- 4. order_items: 6 fields (Items in each order)
-- 5. reservations: 12 fields (Table reservations)
-- 6. drivers: 7 fields (Delivery drivers)
-- 7. deliveries: 9 fields (Delivery tracking)
-- 8. payments: 8 fields (Payment processing)
-- 9. payment_slips: 5 fields (Upload proof of payment)
-- 10. reviews: 6 fields (Customer reviews)
-- ============================================
