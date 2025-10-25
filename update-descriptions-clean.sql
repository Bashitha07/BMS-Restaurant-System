-- Update all table and column descriptions/comments for restaurant_db
-- Also ensure order_date uses CURRENT_TIMESTAMP
-- Run with: Get-Content "c:\SpringBoot\restaurant-system\update-descriptions-clean.sql" | mysql -u root restaurant_db

USE restaurant_db;

-- ============================================
-- TABLE COMMENTS
-- ============================================
ALTER TABLE users COMMENT = 'Stores all user accounts including customers, admins, and drivers with authentication details';
ALTER TABLE menus COMMENT = 'Restaurant menu items with pricing, categories, and availability';
ALTER TABLE orders COMMENT = 'Customer orders with delivery details, payment info, and order status tracking';
ALTER TABLE order_items COMMENT = 'Individual items within each order with quantities and customizations';
ALTER TABLE payments COMMENT = 'Payment records for orders including verification and slip uploads';
ALTER TABLE reservations COMMENT = 'Table reservations with customer details and time slots';
ALTER TABLE feedbacks COMMENT = 'Customer feedback and suggestions for service improvement';
ALTER TABLE reviews COMMENT = 'Customer reviews and ratings for menu items';
ALTER TABLE drivers COMMENT = 'Delivery driver profiles with vehicle and availability information';
ALTER TABLE deliveries COMMENT = 'Delivery assignments linking orders to drivers with tracking';
ALTER TABLE delivery_drivers COMMENT = 'Additional driver-specific information and metrics';
ALTER TABLE notifications COMMENT = 'System notifications for users about orders, reservations, and updates';
ALTER TABLE order_tracking COMMENT = 'Order status change history for tracking and auditing';
ALTER TABLE payment_slips COMMENT = 'Uploaded payment deposit slips for verification';

-- ============================================
-- ORDERS TABLE - Ensure order_date uses CURRENT_TIMESTAMP
-- ============================================
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

SELECT COLUMN_NAME, COLUMN_TYPE, COLUMN_DEFAULT, COLUMN_COMMENT 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'restaurant_db' 
AND TABLE_NAME = 'orders' 
AND COLUMN_NAME = 'order_date';
