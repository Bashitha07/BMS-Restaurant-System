# Database Documentation - Restaurant System

This document describes the database schema, ER relationships, sample population scripts, and useful queries for the Restaurant System application. The SQL schema is provided in `database-setup.sql`.

## High-level ER/EER overview

- users (1) --- (N) orders
- users (1) --- (N) reservations
- users (1) --- (N) reviews
- users (1) --- (N) payment_slips (uploaded_by)
- orders (1) --- (N) order_items
- orders (1) --- (N) payments
- orders (1) --- (N) deliveries
- orders (1) --- (N) payment_slips
- menus (1) --- (N) order_items
- menus (1) --- (N) reviews

Notes:
- The `payment_slips` table is introduced to store uploaded images (deposit slips). This separates file metadata from `payments`.
- `users.role` contains application roles: USER, ADMIN, DRIVER, KITCHEN, MANAGER.

## Table-by-table

### users
- id: BIGINT PK
- username: VARCHAR(50) UNIQUE
- password: VARCHAR(255)
- email: VARCHAR(100) UNIQUE
- phone: VARCHAR(20)
- role: ENUM('USER','ADMIN','DRIVER','KITCHEN','MANAGER')
- promo_code, discount_percent, promo_expires, promo_active
- enabled: BOOLEAN

Purpose: Authentication and application roles. Keep passwords hashed.

Example insert:
INSERT INTO users (username, password, email, role, phone) VALUES
('admin', '<bcrypt-hash>', 'admin@example.com', 'ADMIN', '123-456-7890');

### menus
- id: BIGINT PK
- name, description, price, category
- is_available BOOLEAN
- image_url VARCHAR(255) - stores path under resources/static/images/menu/
- preparation_time INT, calories, ingredients, allergens
- boolean flags: is_vegetarian, is_vegan, is_gluten_free, is_spicy
- spice_level INT
- rating DECIMAL(3,2), total_reviews INT
- stock_quantity INT, low_stock_threshold INT
- is_featured BOOLEAN
- discount_percentage DECIMAL(5,2), discounted_price DECIMAL(10,2)
- created_at, updated_at

Example insert:
INSERT INTO menus (name, description, price, category, is_available) VALUES
('Margherita Pizza', 'Fresh mozzarella, tomatoes, and basil on thin crust', 27.50, 'Pizza', TRUE);

### orders
- id: BIGINT PK
- order_date DATETIME
- status VARCHAR(50)
- total_amount, subtotal, tax_amount, delivery_fee
- payment_method VARCHAR(50)
- delivery_address, delivery_phone
- special_instructions, order_type ENUM('DELIVERY','PICKUP','DINE_IN')
- estimated_delivery_time, actual_delivery_time
- created_at, updated_at
- user_id FK -> users(id)

### order_items
- id: BIGINT PK
- quantity, unit_price, total_price, special_instructions
- order_id FK -> orders(id), menu_id FK -> menus(id)

### reservations
- id: BIGINT PK
- reservation_date, reservation_time, reservation_date_time
- time_slot, number_of_people, status
- customer_name, customer_email, customer_phone
- special_requests, table_number
- created_at, updated_at, confirmed_at, cancelled_at
- reminder_sent BOOLEAN
- admin_notes
- user_id FK -> users(id)

### drivers
- id: BIGINT PK
- name, phone UNIQUE, email UNIQUE
- vehicle_type, vehicle_number, license_number
- status ENUM('AVAILABLE','BUSY','OFFLINE')
- rating DECIMAL(3,2), total_deliveries INT
- created_at, updated_at

### deliveries
- id: BIGINT PK
- order_id FK -> orders(id), driver_id FK -> drivers(id)
- delivery_address, delivery_phone, delivery_instructions
- status, delivery_fee
- estimated_delivery_time, actual_delivery_time, pickup_time
- assigned_date, delivered_date
- lat/long fields
- proof_of_delivery VARCHAR(255)
- customer_rating, customer_feedback
- created_at, updated_at

### payments
- id: BIGINT PK
- order_id FK -> orders(id)
- amount DECIMAL(10,2)
- payment_method VARCHAR(50)
- status VARCHAR(50)
- transaction_id, payment_gateway, gateway_transaction_id
- submitted_date, processed_date, approved_date
- failure_reason, refund_amount, refunded_date
- created_at, updated_at

### payment_slips
- id: BIGINT PK
- order_id FK -> orders(id)
- file_name: stored filename
- file_path: relative/absolute path to resource (e.g., /static/images/payment-slips/2025-10/payment_order_1_20251019_uuid.jpg)
- uploaded_by FK -> users(id)
- uploaded_at DATETIME
- content_type, file_size, notes

Example insert (simulate uploaded file):
INSERT INTO payment_slips (order_id, file_name, file_path, uploaded_by, content_type, file_size) VALUES
(1, 'payment_order_1_20251019_1234abcd.jpg', '/static/images/payment-slips/2025-10/payment_order_1_20251019_1234abcd.jpg', 2, 'image/jpeg', 34567);

### reviews
- id: BIGINT PK
- user_id FK -> users(id)
- menu_id FK -> menus(id)
- rating INT CHECK (1..5)
- comment TEXT
- created_at, updated_at

Example insert:
INSERT INTO reviews (user_id, menu_id, rating, comment) VALUES (2, 1, 5, 'Amazing pizza!');

## Useful queries
- All available menu items:
SELECT * FROM menus WHERE is_available = TRUE;

- Orders with user details:
SELECT o.id, o.order_date, o.status, o.total_amount, u.username, u.email
FROM orders o JOIN users u ON o.user_id = u.id;

- Payment slips for an order:
SELECT * FROM payment_slips WHERE order_id = ? ORDER BY uploaded_at DESC;

- Average rating per menu:
SELECT m.name, AVG(r.rating) AS average_rating, COUNT(r.id) AS review_count
FROM menus m LEFT JOIN reviews r ON m.id = r.menu_id GROUP BY m.id, m.name;

## Notes and recommendations
- File storage: The application stores uploaded images under `src/main/resources/static/images/` with subfolders `menu/` and `payment-slips/YYYY-MM/`. The database stores the relative file path in `payment_slips.file_path` or `menus.image_url`.
- Indexing: Keep indexes on frequent filter columns (users.username, users.email, menus.category, orders.user_id, payments.order_id).
- Backups: Regularly back up media assets (images) alongside DB backups, or use external object storage for larger deployments.

## Change log
- 2025-10-19: Added `payment_slips` table and updated `users.role` enum. Converted BIT columns in `menus` to BOOLEAN to match JPA mappings.

