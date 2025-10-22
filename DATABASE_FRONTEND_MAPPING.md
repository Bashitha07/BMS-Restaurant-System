# Database-Frontend Endpoint Mapping Guide

## Overview
This document maps the MySQL database tables to the frontend API endpoints and expected data structures.

---

## 1. USERS Table
**Database Table:** `users`
```sql
DESC users;
- id (BIGINT, PK)
- username (VARCHAR(50), UNIQUE)
- email (VARCHAR(100), UNIQUE)  
- phone (VARCHAR(20))
- password (VARCHAR(255))
- role (ENUM: USER, ADMIN, MANAGER, KITCHEN, DRIVER)
- enabled (BOOLEAN)
- promo_code (VARCHAR(50))
- discount_percent (DECIMAL(5,2))
- promo_expires (DATETIME)
- promo_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Backend DTO:** `UserResponseDTO`
```java
{
  id: Long,
  username: String,
  email: String,
  phone: String,
  role: Role (enum),
  enabled: boolean
}
```

**Frontend Endpoints:**
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/{id}` - Get user by ID
- `PUT /api/admin/users/{id}/role` - Update user role
- `PUT /api/admin/users/{id}/status?enabled={boolean}` - Update user status
- `DELETE /api/admin/users/{id}` - Delete user

**Frontend Expected Fields:**
```javascript
{
  id: number,
  username: string,
  email: string,
  phone: string,
  role: 'USER' | 'ADMIN' | 'MANAGER' | 'KITCHEN' | 'DRIVER',
  enabled: boolean
}
```

---

## 2. MENUS Table
**Database Table:** `menus` (NOT menu_items!)
```sql
DESC menus;
- id (BIGINT, PK)
- name (VARCHAR(100))
- description (TEXT)
- price (DECIMAL(10,2))
- category (VARCHAR(50))
- is_available (BOOLEAN)
- image_url (VARCHAR(255))
- preparation_time (INT)
- ingredients (TEXT)
- is_vegetarian (BOOLEAN)
- is_vegan (BOOLEAN)
- is_gluten_free (BOOLEAN)
- is_spicy (BOOLEAN)
- spice_level (INT)
- stock_quantity (INT)
- low_stock_threshold (INT)
- is_featured (BOOLEAN)
- discount_percentage (DECIMAL(5,2))
- discounted_price (DECIMAL(10,2))
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Frontend Endpoints:**
- `GET /api/menus` - Get all menu items
- `GET /api/menus/{id}` - Get menu by ID
- `GET /api/menus/category/{category}` - Get by category
- `POST /api/admin/menus` - Create menu item
- `PUT /api/admin/menus/{id}` - Update menu item
- `DELETE /api/admin/menus/{id}` - Delete menu item

**Frontend Expected Fields:**
```javascript
{
  id: number,
  name: string,
  description: string,
  price: number,
  category: string,
  isAvailable: boolean,
  imageUrl: string,
  preparationTime: number,
  isVegetarian: boolean,
  isFeatured: boolean
}
```

---

## 3. ORDERS Table
**Database Table:** `orders`
```sql
DESC orders;
- id (BIGINT, PK)
- user_id (BIGINT, FK → users.id)
- order_date (DATETIME)
- status (ENUM: PENDING, CONFIRMED, PREPARING, READY_FOR_PICKUP, OUT_FOR_DELIVERY, DELIVERED, CANCELLED, REFUNDED)
- total_amount (DECIMAL(10,2))
- subtotal (DECIMAL(10,2))
- tax_amount (DECIMAL(10,2))
- delivery_fee (DECIMAL(10,2))
- payment_method (ENUM: CASH, CREDIT_CARD, DEBIT_CARD, ONLINE, BANK_TRANSFER, DIGITAL_WALLET)
- payment_status (ENUM: PENDING, PROCESSING, COMPLETED, FAILED, CANCELLED, REFUNDED, PARTIALLY_REFUNDED)
- delivery_address (TEXT)
- delivery_phone (VARCHAR(20))
- special_instructions (TEXT)
- order_type (ENUM: DELIVERY, PICKUP, DINE_IN)
- estimated_delivery_time (DATETIME)
- actual_delivery_time (DATETIME)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Frontend Endpoints:**
- `GET /api/orders` - Get user's orders
- `GET /api/orders/{id}` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/admin/orders/{id}/status` - Update order status
- `GET /api/admin/orders` - Get all orders (admin)

**Frontend Expected Fields:**
```javascript
{
  id: number,
  userId: number,
  orderDate: string,
  status: string,
  totalAmount: number,
  paymentStatus: string,
  orderType: string,
  deliveryAddress: string,
  items: OrderItem[]
}
```

---

## 4. ORDER_ITEMS Table
**Database Table:** `order_items`
```sql
DESC order_items;
- id (BIGINT, PK)
- order_id (BIGINT, FK → orders.id)
- menu_id (BIGINT, FK → menus.id)  [NOT menu_item_id!]
- quantity (INT)
- unit_price (DECIMAL(10,2))
- total_price (DECIMAL(10,2))
- special_instructions (TEXT)
```

**Frontend Expected Fields:**
```javascript
{
  id: number,
  orderId: number,
  menuId: number,          // Maps to menu_id in DB
  menuName: string,        // Joined from menus table
  quantity: number,
  unitPrice: number,
  totalPrice: number,
  specialInstructions: string
}
```

---

## 5. RESERVATIONS Table
**Database Table:** `reservations`
```sql
DESC reservations;
- id (BIGINT, PK)
- user_id (BIGINT, FK → users.id)
- reservation_date (DATE)
- reservation_time (TIME)
- reservation_date_time (DATETIME)
- time_slot (VARCHAR(50))
- number_of_people (INT)
- customer_name (VARCHAR(100))
- customer_email (VARCHAR(100))
- customer_phone (VARCHAR(20))
- special_requests (TEXT)
- status (ENUM: PENDING, CONFIRMED, SEATED, CANCELLED, NO_SHOW, COMPLETED)
- table_number (INT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- confirmed_at (DATETIME)
- cancelled_at (DATETIME)
- cancellation_reason (TEXT)
- reminder_sent (BOOLEAN)
- admin_notes (TEXT)
```

**Frontend Endpoints:**
- `GET /api/reservations` - Get user reservations
- `POST /api/reservations` - Create reservation
- `GET /api/admin/reservations` - Get all reservations
- `PUT /api/admin/reservations/{id}/status` - Update status
- `DELETE /api/reservations/{id}` - Cancel reservation

**Frontend Expected Fields:**
```javascript
{
  id: number,
  userId: number,
  reservationDate: string,
  reservationTime: string,
  numberOfPeople: number,
  customerName: string,
  customerPhone: string,
  status: string,
  specialRequests: string
}
```

---

## 6. PAYMENTS Table
**Database Table:** `payments`
```sql
DESC payments;
- id (BIGINT, PK)
- order_id (BIGINT, FK → orders.id)
- amount (DECIMAL(10,2))
- payment_method (ENUM: CASH, CREDIT_CARD, DEBIT_CARD, ONLINE, BANK_TRANSFER, DIGITAL_WALLET)
- status (ENUM: PENDING, PROCESSING, COMPLETED, FAILED, CANCELLED, REFUNDED, PARTIALLY_REFUNDED)
- transaction_id (VARCHAR(100))
- slip_image (VARCHAR(255))
- payment_gateway (VARCHAR(50))
- gateway_transaction_id (VARCHAR(100))
- submitted_date (DATETIME)
- processed_date (DATETIME)
- approved_date (DATETIME)
- failure_reason (TEXT)
- refund_amount (DECIMAL(10,2))
- refunded_date (DATETIME)
- refund_reason (VARCHAR(500))
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Frontend Endpoints:**
- `POST /api/payments` - Create payment
- `GET /api/payments/{orderId}` - Get payment by order
- `GET /api/admin/payments` - Get all payments

**Frontend Expected Fields:**
```javascript
{
  id: number,
  orderId: number,
  amount: number,
  paymentMethod: string,
  status: string,
  transactionId: string,
  slipImage: string
}
```

---

## 7. PAYMENT_SLIPS Table
**Database Table:** `payment_slips`
```sql
DESC payment_slips;
- id (BIGINT, PK)
- order_id (BIGINT, FK → orders.id)
- user_id (BIGINT, FK → users.id)
- file_name (VARCHAR(255))
- file_path (VARCHAR(500))
- file_size (BIGINT)
- content_type (VARCHAR(100))
- payment_amount (DECIMAL(10,2))
- payment_date (DATETIME)
- bank_name (VARCHAR(100))
- transaction_reference (VARCHAR(100))
- status (ENUM: PENDING, CONFIRMED, REJECTED, PROCESSING)
- uploaded_at (TIMESTAMP)
- confirmed_at (DATETIME)
- confirmed_by (VARCHAR(50))
- rejection_reason (TEXT)
- admin_notes (TEXT)
```

**Frontend Endpoints:**
- `POST /api/payment-slips` - Upload payment slip
- `GET /api/admin/payment-slips` - Get all slips
- `PUT /api/admin/payment-slips/{id}/confirm` - Confirm slip
- `PUT /api/admin/payment-slips/{id}/reject` - Reject slip

**Frontend Expected Fields:**
```javascript
{
  id: number,
  orderId: number,
  userId: number,
  fileName: string,
  filePath: string,
  paymentAmount: number,
  status: string,
  uploadedAt: string
}
```

---

## 8. DELIVERY_DRIVERS Table
**Database Table:** `delivery_drivers`
```sql
DESC delivery_drivers;
- id (BIGINT, PK)
- name (VARCHAR(100))
- email (VARCHAR(100), UNIQUE)
- username (VARCHAR(50), UNIQUE)
- password (VARCHAR(255))
- phone (VARCHAR(20))
- address (TEXT)
- license_number (VARCHAR(50), UNIQUE)
- vehicle_number (VARCHAR(20), UNIQUE)
- vehicle_type (VARCHAR(50))
- vehicle_model (VARCHAR(50))
- status (ENUM: PENDING, APPROVED, ACTIVE, INACTIVE, SUSPENDED, TERMINATED)
- hire_date (DATETIME)
- birth_date (DATETIME)
- emergency_contact (VARCHAR(100))
- emergency_phone (VARCHAR(20))
- hourly_rate (DECIMAL(10,2))
- commission_rate (DECIMAL(5,2))
- total_deliveries (INT)
- total_earnings (DECIMAL(10,2))
- average_rating (DECIMAL(3,2))
- total_ratings (INT)
- is_active (BOOLEAN)
- last_login (DATETIME)
- current_location_lat (DECIMAL(10,8))
- current_location_lng (DECIMAL(11,8))
- max_delivery_distance (DECIMAL(5,2))
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Frontend Endpoints:**
- `GET /api/admin/drivers` - Get all drivers
- `GET /api/delivery-drivers/pending` - Get pending drivers
- `PUT /api/delivery-drivers/{id}/approve` - Approve driver
- `PUT /api/delivery-drivers/{id}/reject` - Reject driver
- `POST /api/auth/driver/register` - Driver registration

**Frontend Expected Fields:**
```javascript
{
  id: number,
  name: string,
  email: string,
  phone: string,
  licenseNumber: string,
  vehicleNumber: string,
  vehicleType: string,
  status: string,
  totalDeliveries: number,
  averageRating: number
}
```

---

## 9. DRIVERS Table (Simplified)
**Database Table:** `drivers`
```sql
DESC drivers;
- id (BIGINT, PK)
- name (VARCHAR(100))
- phone (VARCHAR(20), UNIQUE)
- email (VARCHAR(100), UNIQUE)
- vehicle_type (VARCHAR(50))
- vehicle_number (VARCHAR(20))
- license_number (VARCHAR(50))
- status (ENUM: PENDING, APPROVED, ACTIVE, INACTIVE, SUSPENDED)
- rating (DECIMAL(3,2))
- total_deliveries (INT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Note:** This is a simplified version. Use `delivery_drivers` table for full driver management.

---

## 10. DELIVERIES Table
**Database Table:** `deliveries`
```sql
DESC deliveries;
- id (BIGINT, PK)
- order_id (BIGINT, FK → orders.id)
- driver_id (BIGINT, FK → drivers.id)
- delivery_address (TEXT)
- delivery_phone (VARCHAR(20))
- delivery_instructions (TEXT)
- status (ENUM: PENDING, ASSIGNED, PICKED_UP, IN_TRANSIT, DELIVERED, FAILED, CANCELLED)
- delivery_fee (DECIMAL(10,2))
- estimated_delivery_time (DATETIME)
- actual_delivery_time (DATETIME)
- pickup_time (DATETIME)
- assigned_date (DATETIME)
- delivered_date (DATETIME)
- delivery_notes (TEXT)
- current_latitude (DECIMAL(10,8))
- current_longitude (DECIMAL(11,8))
- delivery_latitude (DECIMAL(10,8))
- delivery_longitude (DECIMAL(11,8))
- distance_km (DECIMAL(5,2))
- customer_rating (INT)
- customer_feedback (TEXT)
- proof_of_delivery (VARCHAR(255))
- driver_name (VARCHAR(100))
- driver_phone (VARCHAR(20))
- driver_vehicle (VARCHAR(50))
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Frontend Endpoints:**
- `GET /api/deliveries/{orderId}` - Get delivery by order
- `PUT /api/deliveries/{id}/status` - Update delivery status
- `POST /api/deliveries` - Create delivery

**Frontend Expected Fields:**
```javascript
{
  id: number,
  orderId: number,
  driverId: number,
  deliveryAddress: string,
  status: string,
  estimatedDeliveryTime: string,
  actualDeliveryTime: string,
  driverName: string,
  driverPhone: string
}
```

---

## 11. NOTIFICATIONS Table
**Database Table:** `notifications`
```sql
DESC notifications;
- id (BIGINT, PK)
- user_id (BIGINT, FK → users.id)
- title (VARCHAR(200))
- message (TEXT)
- type (ENUM: ORDER_CONFIRMATION, ORDER_STATUS_UPDATE, RESERVATION_CONFIRMATION, RESERVATION_REMINDER, DELIVERY_UPDATE, PAYMENT_CONFIRMATION, SYSTEM_ANNOUNCEMENT, PROMOTIONAL, WARNING, ERROR)
- status (ENUM: UNREAD, READ, DISMISSED)
- created_at (TIMESTAMP)
- read_at (DATETIME)
- reference_id (BIGINT)
- reference_type (VARCHAR(50))
- is_global (BOOLEAN)
```

**Frontend Endpoints:**
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/{id}/read` - Mark as read
- `DELETE /api/notifications/{id}` - Delete notification

**Frontend Expected Fields:**
```javascript
{
  id: number,
  userId: number,
  title: string,
  message: string,
  type: string,
  status: 'UNREAD' | 'READ' | 'DISMISSED',
  createdAt: string
}
```

---

## 12. FEEDBACKS Table
**Database Table:** `feedbacks`
```sql
DESC feedbacks;
- id (BIGINT, PK)
- user_id (BIGINT, FK → users.id)
- menu_id (BIGINT, FK → menus.id)  [NOT menu_item_id!]
- feedback (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Frontend Endpoints:**
- `POST /api/feedbacks` - Submit feedback
- `GET /api/feedbacks/menu/{menuId}` - Get menu feedbacks

**Frontend Expected Fields:**
```javascript
{
  id: number,
  userId: number,
  menuId: number,        // Maps to menu_id in DB
  feedback: string,
  createdAt: string
}
```

---

## 13. REVIEWS Table
**Database Table:** `reviews`
```sql
DESC reviews;
- id (BIGINT, PK)
- user_id (BIGINT, FK → users.id)
- menu_id (BIGINT, FK → menus.id)  [NOT menu_item_id!]
- rating (INT)
- feedback (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Frontend Endpoints:**
- `POST /api/reviews` - Submit review
- `GET /api/reviews/menu/{menuId}` - Get menu reviews

**Frontend Expected Fields:**
```javascript
{
  id: number,
  userId: number,
  menuId: number,        // Maps to menu_id in DB
  rating: number,        // 1-5
  feedback: string,
  createdAt: string
}
```

---

## Key Differences to Watch:

### 🔴 CRITICAL: Field Name Mismatches
1. **Table name:** `menus` NOT `menu_items`
2. **Foreign key:** `menu_id` NOT `menu_item_id` in order_items, feedbacks, reviews
3. **Boolean fields:** Use `is_available`, `is_featured`, `is_active` (with `is_` prefix)
4. **Status fields:** Use proper ENUM values from database
5. **Date fields:** Backend uses LocalDateTime, frontend expects ISO strings

### Field Naming Conventions:
- **Database:** snake_case (e.g., `user_id`, `order_date`, `is_available`)
- **Backend Entity:** camelCase (e.g., `userId`, `orderDate`, `isAvailable`)
- **Frontend:** camelCase (e.g., `userId`, `orderDate`, `isAvailable`)
- **Backend DTO:** camelCase matching frontend expectations

### Important Notes:
1. All foreign keys use the pattern `{table}_id` (e.g., `user_id`, `order_id`, `menu_id`)
2. Timestamps use `created_at` and `updated_at` consistently
3. Status fields use ENUM types - frontend must match exact values
4. Price fields use DECIMAL(10,2) - handle as numbers in frontend
5. Boolean fields return `true/false` from backend, not 1/0

---

## Common Endpoint Patterns:

### User Operations:
- `GET /api/admin/users` → Returns UserResponseDTO[]
- `PUT /api/admin/users/{id}/status?enabled={boolean}` → Returns UserResponseDTO

### Menu Operations:
- `GET /api/menus` → Returns MenuDTO[]
- `POST /api/admin/menus` → Accepts MenuDTO, Returns MenuDTO

### Order Operations:
- `POST /api/orders` → Accepts OrderCreateDTO, Returns OrderDTO
- `GET /api/orders/{id}` → Returns OrderDTO with OrderItemDTO[]

### Payment Operations:
- `POST /api/payments` → Accepts PaymentDTO, Returns PaymentDTO
- `POST /api/payment-slips` → Accepts multipart/form-data with file

---

## Validation Rules:

### Users:
- username: 3-50 chars, unique
- email: valid email format, unique
- password: min 6 chars (hashed in DB)
- phone: optional, max 20 chars
- role: must be valid enum value

### Menus:
- name: required, max 100 chars
- price: required, positive decimal
- category: required, max 50 chars
- preparation_time: optional, in minutes

### Orders:
- user_id: required, must exist in users table
- total_amount: required, positive decimal
- order_type: required enum (DELIVERY, PICKUP, DINE_IN)
- status: required enum (PENDING, CONFIRMED, etc.)

### Reservations:
- reservation_date: required, future date
- number_of_people: required, positive int
- customer_name: required, max 100 chars
- customer_phone: required, max 20 chars

---

## Testing Checklist:

✅ User CRUD operations match database schema
✅ Menu items use `menus` table (not `menu_items`)
✅ Order items reference `menu_id` (not `menu_item_id`)
✅ All status enums match database ENUM values
✅ Foreign keys properly reference parent tables
✅ Boolean fields use correct naming (`is_available`, not `available`)
✅ Date/time fields properly formatted (ISO 8601)
✅ Decimal fields handle precision correctly
✅ File uploads for payment slips work correctly
✅ All endpoints return expected DTO structures

