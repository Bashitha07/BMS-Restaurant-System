-- Update all table and column descriptions/comments for restaurant_db
-- Also ensure order_date uses CURRENT_TIMESTAMP
-- Run with: Get-Content "c:\SpringBoot\restaurant-system\update-table-descriptions.sql" | mysql -u root restaurant_db

USE restaurant_db;

-- ============================================
-- 1. USERS TABLE
-- ============================================
ALTER TABLE users COMMENT = 'Stores all user accounts including customers, admins, and drivers with authentication details';
ALTER TABLE users MODIFY COLUMN id BIGINT AUTO_INCREMENT COMMENT 'Unique user identifier';
ALTER TABLE users MODIFY COLUMN username VARCHAR(50) NOT NULL UNIQUE COMMENT 'Unique username for login';
ALTER TABLE users MODIFY COLUMN password VARCHAR(255) NOT NULL COMMENT 'BCrypt hashed password';
ALTER TABLE users MODIFY COLUMN email VARCHAR(100) NOT NULL UNIQUE COMMENT 'User email address';
ALTER TABLE users MODIFY COLUMN full_name VARCHAR(100) COMMENT 'Full name of the user';
ALTER TABLE users MODIFY COLUMN phone VARCHAR(20) COMMENT 'Contact phone number';
ALTER TABLE users MODIFY COLUMN address TEXT COMMENT 'Physical address';
ALTER TABLE users MODIFY COLUMN role ENUM('USER','ADMIN','DRIVER') NOT NULL DEFAULT 'USER' COMMENT 'User role for access control';
ALTER TABLE users MODIFY COLUMN is_active BOOLEAN DEFAULT TRUE COMMENT 'Account active status';
ALTER TABLE users MODIFY COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Account creation timestamp';
ALTER TABLE users MODIFY COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp';

-- ============================================
-- 2. MENUS TABLE
-- ============================================
ALTER TABLE menus COMMENT = 'Restaurant menu items with pricing, categories, and availability';
ALTER TABLE menus MODIFY COLUMN id BIGINT AUTO_INCREMENT COMMENT 'Unique menu item identifier';
ALTER TABLE menus MODIFY COLUMN name VARCHAR(100) NOT NULL COMMENT 'Name of the dish/item';
ALTER TABLE menus MODIFY COLUMN description TEXT COMMENT 'Detailed description of the item';
ALTER TABLE menus MODIFY COLUMN price DECIMAL(10,2) NOT NULL COMMENT 'Item price in currency';
ALTER TABLE menus MODIFY COLUMN category VARCHAR(50) COMMENT 'Food category (e.g., Pizza, Burgers, Desserts)';
ALTER TABLE menus MODIFY COLUMN image_url VARCHAR(255) COMMENT 'URL or path to item image';
ALTER TABLE menus MODIFY COLUMN is_available BOOLEAN DEFAULT TRUE COMMENT 'Availability status';
ALTER TABLE menus MODIFY COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Item creation timestamp';
ALTER TABLE menus MODIFY COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp';

-- ============================================
-- 3. ORDERS TABLE (Ensure order_date uses CURRENT_TIMESTAMP)
-- ============================================
ALTER TABLE orders COMMENT = 'Customer orders with delivery details, payment info, and order status tracking';
ALTER TABLE orders MODIFY COLUMN id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Unique order identifier';
ALTER TABLE orders MODIFY COLUMN user_id BIGINT NOT NULL COMMENT 'Foreign key to users table';
ALTER TABLE orders MODIFY COLUMN order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Order placement timestamp (uses current time automatically)';
ALTER TABLE orders MODIFY COLUMN status ENUM('PENDING','CONFIRMED','PREPARING','READY_FOR_PICKUP','OUT_FOR_DELIVERY','DELIVERED','CANCELLED','REFUNDED') NOT NULL DEFAULT 'PENDING' COMMENT 'Current order status';
ALTER TABLE orders MODIFY COLUMN total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT 'Total order amount including tax and fees';
ALTER TABLE orders MODIFY COLUMN subtotal DECIMAL(10,2) DEFAULT 0.00 COMMENT 'Subtotal before tax and fees';
ALTER TABLE orders MODIFY COLUMN tax_amount DECIMAL(10,2) DEFAULT 0.00 COMMENT 'Tax amount';
ALTER TABLE orders MODIFY COLUMN delivery_fee DECIMAL(10,2) DEFAULT 0.00 COMMENT 'Delivery charge';
ALTER TABLE orders MODIFY COLUMN payment_method ENUM('DEPOSIT_SLIP','CASH_ON_DELIVERY') NULL COMMENT 'Payment method chosen by customer';
ALTER TABLE orders MODIFY COLUMN payment_status ENUM('PENDING','PROCESSING','COMPLETED','FAILED','CANCELLED','REFUNDED','PARTIALLY_REFUNDED') DEFAULT 'PENDING' COMMENT 'Payment processing status';
ALTER TABLE orders MODIFY COLUMN delivery_address VARCHAR(255) COMMENT 'Delivery destination address';
ALTER TABLE orders MODIFY COLUMN delivery_phone VARCHAR(255) COMMENT 'Contact phone for delivery';
ALTER TABLE orders MODIFY COLUMN special_instructions TEXT COMMENT 'Customer notes and special requests';
ALTER TABLE orders MODIFY COLUMN order_type ENUM('DELIVERY','PICKUP','DINE_IN') NOT NULL DEFAULT 'DELIVERY' COMMENT 'Type of order';
ALTER TABLE orders MODIFY COLUMN estimated_delivery_time DATETIME COMMENT 'Estimated delivery/pickup time';
ALTER TABLE orders MODIFY COLUMN actual_delivery_time DATETIME COMMENT 'Actual delivery/completion time';
ALTER TABLE orders MODIFY COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation timestamp';
ALTER TABLE orders MODIFY COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp';

-- ============================================
-- 4. ORDER_ITEMS TABLE
-- ============================================
ALTER TABLE order_items COMMENT = 'Individual items within each order with quantities and customizations';
ALTER TABLE order_items MODIFY COLUMN id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Unique order item identifier';
ALTER TABLE order_items MODIFY COLUMN order_id BIGINT NOT NULL COMMENT 'Foreign key to orders table';
ALTER TABLE order_items MODIFY COLUMN menu_id BIGINT NOT NULL COMMENT 'Foreign key to menus table';
ALTER TABLE order_items MODIFY COLUMN quantity INT NOT NULL DEFAULT 1 COMMENT 'Number of items ordered';
ALTER TABLE order_items MODIFY COLUMN price DECIMAL(10,2) NOT NULL COMMENT 'Price per unit at time of order';
ALTER TABLE order_items MODIFY COLUMN special_instructions TEXT COMMENT 'Item-specific customization requests';
ALTER TABLE order_items MODIFY COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation timestamp';

-- ============================================
-- 5. PAYMENTS TABLE
-- ============================================
ALTER TABLE payments COMMENT = 'Payment records for orders including verification and slip uploads';
ALTER TABLE payments MODIFY COLUMN id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Unique payment identifier';
ALTER TABLE payments MODIFY COLUMN order_id BIGINT NOT NULL COMMENT 'Foreign key to orders table';
ALTER TABLE payments MODIFY COLUMN payment_method ENUM('DEPOSIT_SLIP','CASH_ON_DELIVERY') NOT NULL COMMENT 'Payment method used';
ALTER TABLE payments MODIFY COLUMN amount DECIMAL(10,2) NOT NULL COMMENT 'Payment amount';
ALTER TABLE payments MODIFY COLUMN status ENUM('PENDING','VERIFIED','REJECTED','COMPLETED','FAILED') NOT NULL DEFAULT 'PENDING' COMMENT 'Payment verification status';
ALTER TABLE payments MODIFY COLUMN deposit_slip_image VARCHAR(255) COMMENT 'Path to uploaded deposit slip image';
ALTER TABLE payments MODIFY COLUMN verified_by BIGINT COMMENT 'Admin user ID who verified the payment';
ALTER TABLE payments MODIFY COLUMN verified_at DATETIME COMMENT 'Timestamp of payment verification';
ALTER TABLE payments MODIFY COLUMN failure_reason VARCHAR(255) COMMENT 'Reason for payment rejection/failure';
ALTER TABLE payments MODIFY COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Payment record creation timestamp';
ALTER TABLE payments MODIFY COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp';

-- ============================================
-- 6. RESERVATIONS TABLE
-- ============================================
ALTER TABLE reservations COMMENT = 'Table reservations with customer details and time slots';
ALTER TABLE reservations MODIFY COLUMN id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Unique reservation identifier';
ALTER TABLE reservations MODIFY COLUMN user_id BIGINT NOT NULL COMMENT 'Foreign key to users table';
ALTER TABLE reservations MODIFY COLUMN reservation_date DATE NOT NULL COMMENT 'Date of reservation';
ALTER TABLE reservations MODIFY COLUMN reservation_time TIME NOT NULL COMMENT 'Time of reservation';
ALTER TABLE reservations MODIFY COLUMN number_of_guests INT NOT NULL COMMENT 'Number of people';
ALTER TABLE reservations MODIFY COLUMN special_requests TEXT COMMENT 'Special requirements or notes';
ALTER TABLE reservations MODIFY COLUMN status ENUM('PENDING','CONFIRMED','CANCELLED','COMPLETED') NOT NULL DEFAULT 'PENDING' COMMENT 'Reservation status';
ALTER TABLE reservations MODIFY COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Reservation creation timestamp';
ALTER TABLE reservations MODIFY COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp';

-- ============================================
-- 7. FEEDBACKS TABLE
-- ============================================
ALTER TABLE feedbacks COMMENT = 'Customer feedback and suggestions for service improvement';
ALTER TABLE feedbacks MODIFY COLUMN id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Unique feedback identifier';
ALTER TABLE feedbacks MODIFY COLUMN user_id BIGINT NOT NULL COMMENT 'Foreign key to users table';
ALTER TABLE feedbacks MODIFY COLUMN subject VARCHAR(200) COMMENT 'Feedback subject/title';
ALTER TABLE feedbacks MODIFY COLUMN message TEXT NOT NULL COMMENT 'Feedback content';
ALTER TABLE feedbacks MODIFY COLUMN rating INT COMMENT 'Rating score (if applicable)';
ALTER TABLE feedbacks MODIFY COLUMN status ENUM('NEW','IN_REVIEW','RESOLVED','CLOSED') DEFAULT 'NEW' COMMENT 'Feedback processing status';
ALTER TABLE feedbacks MODIFY COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Feedback submission timestamp';

-- ============================================
-- 8. REVIEWS TABLE
-- ============================================
ALTER TABLE reviews COMMENT = 'Customer reviews and ratings for menu items';
ALTER TABLE reviews MODIFY COLUMN id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Unique review identifier';
ALTER TABLE reviews MODIFY COLUMN user_id BIGINT NOT NULL COMMENT 'Foreign key to users table';
ALTER TABLE reviews MODIFY COLUMN menu_id BIGINT NOT NULL COMMENT 'Foreign key to menus table';
ALTER TABLE reviews MODIFY COLUMN rating INT NOT NULL COMMENT 'Rating score (1-5)';
ALTER TABLE reviews MODIFY COLUMN comment TEXT COMMENT 'Review text';
ALTER TABLE reviews MODIFY COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Review submission timestamp';

-- ============================================
-- 9. DRIVERS TABLE
-- ============================================
ALTER TABLE drivers COMMENT = 'Delivery driver profiles with vehicle and availability information';
ALTER TABLE drivers MODIFY COLUMN id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Unique driver identifier';
ALTER TABLE drivers MODIFY COLUMN user_id BIGINT NOT NULL COMMENT 'Foreign key to users table';
ALTER TABLE drivers MODIFY COLUMN license_number VARCHAR(50) COMMENT 'Driver license number';
ALTER TABLE drivers MODIFY COLUMN vehicle_type VARCHAR(50) COMMENT 'Type of delivery vehicle';
ALTER TABLE drivers MODIFY COLUMN vehicle_number VARCHAR(50) COMMENT 'Vehicle registration number';
ALTER TABLE drivers MODIFY COLUMN is_available BOOLEAN DEFAULT TRUE COMMENT 'Current availability status';
ALTER TABLE drivers MODIFY COLUMN rating DECIMAL(3,2) DEFAULT 5.00 COMMENT 'Average driver rating';
ALTER TABLE drivers MODIFY COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Driver profile creation timestamp';
ALTER TABLE drivers MODIFY COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp';

-- ============================================
-- 10. DELIVERIES TABLE
-- ============================================
ALTER TABLE deliveries COMMENT = 'Delivery assignments linking orders to drivers with tracking';
ALTER TABLE deliveries MODIFY COLUMN id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Unique delivery identifier';
ALTER TABLE deliveries MODIFY COLUMN order_id BIGINT NOT NULL COMMENT 'Foreign key to orders table';
ALTER TABLE deliveries MODIFY COLUMN driver_id BIGINT COMMENT 'Foreign key to drivers table';
ALTER TABLE deliveries MODIFY COLUMN pickup_time DATETIME COMMENT 'When driver picked up the order';
ALTER TABLE deliveries MODIFY COLUMN delivery_time DATETIME COMMENT 'When order was delivered';
ALTER TABLE deliveries MODIFY COLUMN status ENUM('PENDING','ASSIGNED','PICKED_UP','IN_TRANSIT','DELIVERED','CANCELLED') NOT NULL DEFAULT 'PENDING' COMMENT 'Delivery status';
ALTER TABLE deliveries MODIFY COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Delivery record creation timestamp';
ALTER TABLE deliveries MODIFY COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp';

-- ============================================
-- 11. DELIVERY_DRIVERS TABLE
-- ============================================
ALTER TABLE delivery_drivers COMMENT = 'Additional driver-specific information and metrics';

-- ============================================
-- 12. NOTIFICATIONS TABLE
-- ============================================
ALTER TABLE notifications COMMENT = 'System notifications for users about orders, reservations, and updates';
ALTER TABLE notifications MODIFY COLUMN id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Unique notification identifier';
ALTER TABLE notifications MODIFY COLUMN user_id BIGINT NOT NULL COMMENT 'Foreign key to users table';
ALTER TABLE notifications MODIFY COLUMN title VARCHAR(255) NOT NULL COMMENT 'Notification title';
ALTER TABLE notifications MODIFY COLUMN message TEXT NOT NULL COMMENT 'Notification content';
ALTER TABLE notifications MODIFY COLUMN type ENUM('ORDER','RESERVATION','DELIVERY','PAYMENT','SYSTEM') NOT NULL COMMENT 'Notification category';
ALTER TABLE notifications MODIFY COLUMN is_read BOOLEAN DEFAULT FALSE COMMENT 'Read status';
ALTER TABLE notifications MODIFY COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Notification creation timestamp';

-- ============================================
-- 13. ORDER_TRACKING TABLE
-- ============================================
ALTER TABLE order_tracking COMMENT = 'Order status change history for tracking and auditing';
ALTER TABLE order_tracking MODIFY COLUMN id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Unique tracking entry identifier';
ALTER TABLE order_tracking MODIFY COLUMN order_id BIGINT NOT NULL COMMENT 'Foreign key to orders table';
ALTER TABLE order_tracking MODIFY COLUMN status VARCHAR(50) NOT NULL COMMENT 'Status at this tracking point';
ALTER TABLE order_tracking MODIFY COLUMN notes TEXT COMMENT 'Additional notes about status change';
ALTER TABLE order_tracking MODIFY COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Status change timestamp';

-- ============================================
-- 14. PAYMENT_SLIPS TABLE
-- ============================================
ALTER TABLE payment_slips COMMENT = 'Uploaded payment deposit slips for verification';

-- ============================================
-- Verify Changes
-- ============================================
SELECT 
    TABLE_NAME,
    TABLE_COMMENT
FROM 
    information_schema.TABLES
WHERE 
    TABLE_SCHEMA = 'restaurant_db'
ORDER BY 
    TABLE_NAME;

SHOW FULL COLUMNS FROM orders WHERE Field = 'order_date';
