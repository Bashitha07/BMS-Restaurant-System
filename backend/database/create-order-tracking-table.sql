-- Create the missing order_tracking table

USE restaurant_db;

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
    
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (delivery_id) REFERENCES deliveries(delivery_id) ON DELETE SET NULL,
    
    INDEX idx_order_id (order_id),
    INDEX idx_delivery_id (delivery_id),
    INDEX idx_status (current_status)
);

SELECT 'Order tracking table created successfully!' AS status;
