# 📊 Database Simplification Guide

## Overview
This guide helps you migrate from the complex database schema to a simplified version that keeps all 10 tables but removes unnecessary attributes for easier data management.

---

## 🎯 What Changed?

### ✅ KEPT (All 10 Tables)
1. **users** - User accounts and authentication
2. **menus** - Menu items (21 fields - NO calories, NO allergens)
3. **orders** - Customer orders
4. **order_items** - Items in each order
5. **reservations** - Table reservations
6. **drivers** - Delivery drivers
7. **deliveries** - Delivery tracking
8. **payments** - Payment records
9. **payment_slips** - Payment proof uploads
10. **reviews** - Customer reviews

### ❌ REMOVED ATTRIBUTES

#### **USERS Table** (Removed 5 fields):
- ❌ `promo_code` - Unnecessary for basic operations
- ❌ `discount_percent` - Can be handled at order level
- ❌ `promo_expires` - Promotional complexity
- ❌ `promo_active` - Promotional complexity
- ❌ Removed roles: `DRIVER`, `KITCHEN`, `MANAGER` (kept only `USER`, `ADMIN`)

#### **MENUS Table** (Removed 3 fields):
- ❌ `rating` - Calculated from reviews table
- ❌ `total_reviews` - Calculated from reviews table
- ❌ **NO calories field** (as per requirements)
- ❌ **NO allergens field** (as per requirements)

#### **ORDERS Table** (Removed 7 fields):
- ❌ `subtotal` - Calculated field
- ❌ `tax_amount` - Can be calculated
- ❌ `delivery_fee` - Simplified pricing
- ❌ `payment_method` - Moved to payments table
- ❌ `order_type` - Simplified to delivery/pickup
- ❌ `estimated_delivery_time` - Moved to deliveries
- ❌ `actual_delivery_time` - Moved to deliveries

#### **ORDER_ITEMS Table** (Removed 1 field):
- ❌ `special_instructions` - Moved to order level

#### **RESERVATIONS Table** (Removed 9 fields):
- ❌ `reservation_date_time` - Redundant (combine date + time)
- ❌ `time_slot` - Simplified
- ❌ `table_number` - Manual assignment
- ❌ `confirmed_at` - Track via status
- ❌ `cancelled_at` - Track via status
- ❌ `cancellation_reason` - Simplified
- ❌ `reminder_sent` - External system
- ❌ `admin_notes` - Simplified

#### **DRIVERS Table** (Removed 6 fields):
- ❌ `vehicle_type` - Simplified
- ❌ `license_number` - Not essential
- ❌ `rating` - Can be calculated
- ❌ `total_deliveries` - Can be calculated
- ❌ Status changed from ENUM to VARCHAR (simpler)

#### **DELIVERIES Table** (Removed 14 fields):
- ❌ `delivery_phone` - Use order phone
- ❌ `delivery_instructions` - Use order instructions
- ❌ `delivery_fee` - Simplified
- ❌ `pickup_time` - Simplified tracking
- ❌ `assigned_date` - Use created_at
- ❌ `delivered_date` - Use actual_delivery_time
- ❌ `delivery_notes` - Simplified
- ❌ `current_latitude` - GPS tracking removed
- ❌ `current_longitude` - GPS tracking removed
- ❌ `delivery_latitude` - GPS tracking removed
- ❌ `delivery_longitude` - GPS tracking removed
- ❌ `distance_km` - GPS tracking removed
- ❌ `customer_rating` - Use reviews table
- ❌ `customer_feedback` - Use reviews table
- ❌ `proof_of_delivery` - Simplified
- ❌ `driver_name`, `driver_phone`, `driver_vehicle` - Use driver table JOIN

#### **PAYMENTS Table** (Removed 7 fields):
- ❌ `payment_gateway` - Simplified payment flow
- ❌ `gateway_transaction_id` - Simplified
- ❌ `submitted_date` - Use created_at
- ❌ `processed_date` - Track via status
- ❌ `approved_date` - Track via status
- ❌ `failure_reason` - Simplified
- ❌ `refund_amount` - Simplified
- ❌ `refunded_date` - Simplified

#### **PAYMENT_SLIPS Table** (Removed 4 fields):
- ❌ `uploaded_by` - Assumed to be order user
- ❌ `content_type` - File handling simplified
- ❌ `file_size` - File handling simplified
- ❌ `notes` - Simplified

#### **REVIEWS Table** (Removed 1 field):
- ❌ `updated_at` - Reviews are immutable

---

## 🚀 Migration Steps

### **Option 1: Fresh Install (Recommended for New Setup)**

```powershell
# 1. Backup existing database (if any)
mysqldump -u root -p restaurant_db > backup_restaurant_db.sql

# 2. Drop old database
mysql -u root -p -e "DROP DATABASE IF EXISTS restaurant_db;"

# 3. Run simplified setup
mysql -u root -p < database-setup-simplified.sql

# 4. Verify
mysql -u root -p restaurant_db -e "SHOW TABLES;"
```

### **Option 2: Migrate Existing Data**

```sql
-- 1. Create backup
CREATE DATABASE restaurant_db_backup AS SELECT * FROM restaurant_db;

-- 2. Rename old database
RENAME DATABASE restaurant_db TO restaurant_db_old;

-- 3. Create new simplified database
-- Run database-setup-simplified.sql

-- 4. Migrate data from old to new

-- Migrate Users (keeping only relevant fields)
INSERT INTO restaurant_db.users (id, username, password, email, phone, role, enabled)
SELECT id, username, password, email, phone, 
       CASE 
           WHEN role IN ('DRIVER', 'KITCHEN', 'MANAGER') THEN 'USER'
           ELSE role 
       END as role,
       enabled
FROM restaurant_db_old.users;

-- Migrate Menus (21 fields only, NO calories, NO allergens)
INSERT INTO restaurant_db.menus (
    id, name, description, category, price, is_available, image_url, 
    preparation_time, is_vegetarian, is_vegan, is_gluten_free, is_spicy, 
    spice_level, is_featured, stock_quantity, low_stock_threshold, 
    ingredients, discount_percentage, discounted_price, created_at, updated_at
)
SELECT 
    id, name, description, category, price, is_available, image_url,
    preparation_time, is_vegetarian, is_vegan, is_gluten_free, is_spicy,
    spice_level, is_featured, stock_quantity, low_stock_threshold,
    ingredients, discount_percentage, discounted_price, created_at, updated_at
FROM restaurant_db_old.menus;

-- Migrate Orders
INSERT INTO restaurant_db.orders (
    id, user_id, order_date, status, total_amount, 
    delivery_address, delivery_phone, special_instructions, created_at
)
SELECT 
    id, user_id, order_date, status, total_amount,
    delivery_address, delivery_phone, special_instructions, created_at
FROM restaurant_db_old.orders;

-- Migrate Order Items
INSERT INTO restaurant_db.order_items (id, order_id, menu_id, quantity, unit_price, total_price)
SELECT id, order_id, menu_id, quantity, unit_price, total_price
FROM restaurant_db_old.order_items;

-- Migrate Reservations
INSERT INTO restaurant_db.reservations (
    id, user_id, customer_name, customer_phone, customer_email,
    reservation_date, reservation_time, number_of_people, status, 
    special_requests, created_at
)
SELECT 
    id, user_id, customer_name, customer_phone, customer_email,
    reservation_date, reservation_time, number_of_people, status,
    special_requests, created_at
FROM restaurant_db_old.reservations;

-- Migrate Drivers
INSERT INTO restaurant_db.drivers (id, name, phone, email, vehicle_number, status, created_at)
SELECT id, name, phone, email, vehicle_number, status, created_at
FROM restaurant_db_old.drivers;

-- Migrate Deliveries
INSERT INTO restaurant_db.deliveries (
    id, order_id, driver_id, delivery_address, status,
    estimated_delivery_time, actual_delivery_time, created_at
)
SELECT 
    id, order_id, driver_id, delivery_address, status,
    estimated_delivery_time, actual_delivery_time, created_at
FROM restaurant_db_old.deliveries;

-- Migrate Payments
INSERT INTO restaurant_db.payments (
    id, order_id, amount, payment_method, status, transaction_id, created_at
)
SELECT 
    id, order_id, amount, payment_method, status, transaction_id, created_at
FROM restaurant_db_old.payments;

-- Migrate Payment Slips
INSERT INTO restaurant_db.payment_slips (id, order_id, file_name, file_path, uploaded_at)
SELECT id, order_id, file_name, file_path, uploaded_at
FROM restaurant_db_old.payment_slips;

-- Migrate Reviews
INSERT INTO restaurant_db.reviews (id, user_id, menu_id, rating, comment, created_at)
SELECT id, user_id, menu_id, rating, comment, created_at
FROM restaurant_db_old.reviews;

-- 5. Verify data migration
SELECT 'users' AS table_name, COUNT(*) AS count FROM restaurant_db.users
UNION ALL
SELECT 'menus', COUNT(*) FROM restaurant_db.menus
UNION ALL
SELECT 'orders', COUNT(*) FROM restaurant_db.orders
UNION ALL
SELECT 'order_items', COUNT(*) FROM restaurant_db.order_items
UNION ALL
SELECT 'reservations', COUNT(*) FROM restaurant_db.reservations
UNION ALL
SELECT 'drivers', COUNT(*) FROM restaurant_db.drivers
UNION ALL
SELECT 'deliveries', COUNT(*) FROM restaurant_db.deliveries
UNION ALL
SELECT 'payments', COUNT(*) FROM restaurant_db.payments
UNION ALL
SELECT 'payment_slips', COUNT(*) FROM restaurant_db.payment_slips
UNION ALL
SELECT 'reviews', COUNT(*) FROM restaurant_db.reviews;

-- 6. Once verified, drop old database
-- DROP DATABASE restaurant_db_old;
```

---

## ✅ Verification Queries

```sql
-- 1. Check menus table has exactly 21 columns (NO calories, NO allergens)
SELECT COUNT(*) AS column_count 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'restaurant_db' AND TABLE_NAME = 'menus';
-- Expected: 21

-- 2. Verify NO calories or allergens columns exist
SELECT COLUMN_NAME 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'restaurant_db' 
AND TABLE_NAME = 'menus' 
AND COLUMN_NAME IN ('calories', 'allergens');
-- Expected: 0 rows

-- 3. Check all tables exist
SHOW TABLES;
-- Expected: 10 tables

-- 4. View table structures
DESCRIBE users;
DESCRIBE menus;
DESCRIBE orders;
DESCRIBE order_items;
DESCRIBE reservations;
DESCRIBE drivers;
DESCRIBE deliveries;
DESCRIBE payments;
DESCRIBE payment_slips;
DESCRIBE reviews;

-- 5. Count records in each table
SELECT 
    (SELECT COUNT(*) FROM users) AS users,
    (SELECT COUNT(*) FROM menus) AS menus,
    (SELECT COUNT(*) FROM orders) AS orders,
    (SELECT COUNT(*) FROM order_items) AS order_items,
    (SELECT COUNT(*) FROM reservations) AS reservations,
    (SELECT COUNT(*) FROM drivers) AS drivers,
    (SELECT COUNT(*) FROM deliveries) AS deliveries,
    (SELECT COUNT(*) FROM payments) AS payments,
    (SELECT COUNT(*) FROM payment_slips) AS payment_slips,
    (SELECT COUNT(*) FROM reviews) AS reviews;
```

---

## 📝 Simple Update Examples

### **Update Menu**
```sql
-- Update menu price
UPDATE menus SET price = 950.00, updated_at = NOW() WHERE id = 1;

-- Toggle menu availability
UPDATE menus SET is_available = FALSE WHERE id = 1;

-- Update menu discount
UPDATE menus 
SET discount_percentage = 15.00, 
    discounted_price = price * 0.85,
    updated_at = NOW()
WHERE id = 1;
```

### **Update Order**
```sql
-- Update order status
UPDATE orders SET status = 'CONFIRMED', updated_at = NOW() WHERE id = 1;

-- Update delivery address
UPDATE orders SET delivery_address = '456 New Street' WHERE id = 1;
```

### **Update Reservation**
```sql
-- Confirm reservation
UPDATE reservations SET status = 'CONFIRMED', updated_at = NOW() WHERE id = 1;

-- Cancel reservation
UPDATE reservations SET status = 'CANCELLED', updated_at = NOW() WHERE id = 1;
```

### **Update User**
```sql
-- Change user role to admin
UPDATE users SET role = 'ADMIN', updated_at = NOW() WHERE id = 2;

-- Disable user account
UPDATE users SET enabled = FALSE, updated_at = NOW() WHERE id = 3;
```

### **Update Payment**
```sql
-- Mark payment as completed
UPDATE payments SET status = 'COMPLETED', updated_at = NOW() WHERE id = 1;
```

---

## 🎯 Benefits of Simplified Schema

### **1. Easier Updates**
- ✅ Fewer fields to manage
- ✅ Clear field purpose
- ✅ Less NULL values
- ✅ Faster UPDATE queries

### **2. Better Performance**
- ✅ Smaller table sizes
- ✅ Faster JOINs
- ✅ Reduced index overhead
- ✅ Quicker backups

### **3. Cleaner Data Model**
- ✅ No redundant fields
- ✅ Calculated fields removed
- ✅ Clear relationships
- ✅ Easier to understand

### **4. Simplified Maintenance**
- ✅ Less migration complexity
- ✅ Easier schema updates
- ✅ Cleaner SQL queries
- ✅ Better documentation

---

## 📊 Field Count Summary

| Table | Old Fields | New Fields | Removed |
|-------|-----------|-----------|---------|
| users | 14 | 9 | 5 |
| menus | 24 | 21 | 3 |
| orders | 17 | 10 | 7 |
| order_items | 7 | 6 | 1 |
| reservations | 21 | 12 | 9 |
| drivers | 13 | 7 | 6 |
| deliveries | 23 | 9 | 14 |
| payments | 15 | 8 | 7 |
| payment_slips | 9 | 5 | 4 |
| reviews | 7 | 6 | 1 |
| **TOTAL** | **150** | **93** | **57** |

**Reduction: 38% fewer fields for easier management!**

---

## 🔒 Important Notes

1. **Backup First**: Always backup your database before migration
2. **Test Queries**: Test all UPDATE queries in a development environment first
3. **Verify Data**: Run verification queries after migration
4. **Update Application**: Update Java entities to match simplified schema
5. **Re-run Tests**: Execute Bruno API tests to verify compatibility

---

## ✅ Next Steps After Migration

1. ✅ **Update Java Entities** - Match entity classes to new schema
2. ✅ **Update DTOs** - Ensure DTOs have correct fields
3. ✅ **Run Bruno Tests** - Verify all API endpoints work
4. ✅ **Test Frontend** - Verify UI works with new schema
5. ✅ **Monitor Performance** - Check query performance improvements

---

**Created:** October 19, 2025  
**Database:** MySQL 8.0+  
**Compatible With:** Spring Boot 3.5.6, JPA/Hibernate
