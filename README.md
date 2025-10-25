# Restaurant Management System

A full-stack restaurant management system built with Spring Boot and React.

## 🚀 Quick Start

### Prerequisites
- **Java 24** (or JDK 17+)
- **MySQL 8.0+** 
- **Node.js 18+** and npm
- **Maven 3.9+**

### Installation

1. **Clone Repository**
   ```bash
   git clone https://github.com/Bashitha07/BMS-Restaurant-System.git
   cd BMS-Restaurant-System
   ```

2. **Setup Database**
   
   **Quick Setup (Recommended)**
   ```bash
   # Windows (PowerShell)
   Get-Content database-setup.sql | mysql -u root
   
   # Linux/Mac
   mysql -u root < database-setup.sql
   ```
   
   **Manual Setup**
   ```bash
   # Login to MySQL
   mysql -u root -p
   
   # Create database
   CREATE DATABASE IF NOT EXISTS restaurant_db 
   CHARACTER SET utf8mb4 
   COLLATE utf8mb4_unicode_ci;
   
   USE restaurant_db;
   
   # Import schema
   source database-setup.sql;
   ```
   
   **Verify Database Setup:**
   ```sql
   -- Check all tables exist (should show 14 tables)
   SHOW TABLES;
   
   -- Verify sample data loaded
   SELECT COUNT(*) FROM menus;   -- Should have menu items
   SELECT COUNT(*) FROM users;   -- Should have admin user
   ```

3. **Configure Backend**
   ```properties
   # Edit backend/src/main/resources/application.properties
   spring.datasource.url=jdbc:mysql://localhost:3306/restaurant_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=
   
   # Database validation (recommended for production)
   spring.jpa.hibernate.ddl-auto=validate
   
   # Use 'update' only for development (auto-creates missing columns)
   # spring.jpa.hibernate.ddl-auto=update
   ```
   
   **Important:** Set `ddl-auto=validate` after initial setup to prevent unwanted schema changes.

4. **Start Backend**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

5. **Start Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

6. **Access Application**
   - Frontend: http://localhost:5174
   - Backend API: http://localhost:8084
   - Default Login: `admin` / `admin123`

---

## 🎯 Technology Stack

- **Backend:** Spring Boot 3.5.6, Java 24, Spring Security, JWT
- **Frontend:** React 18, Vite, Tailwind CSS
- **Database:** MySQL 8.0 (14 tables)
- **Build Tools:** Maven 3.9.11, npm

---

## 📊 Database Schema

### Database Overview
- **Name:** `restaurant_db`
- **Charset:** utf8mb4_unicode_ci
- **Tables:** 14
- **Engine:** InnoDB

### Core Tables

#### 1. **users** - User Authentication & Profiles
**Columns:**
- `id` (PK), `username` (UNIQUE), `email` (UNIQUE), `phone`
- `password` (hashed), `role` (ENUM), `enabled`
- **Promo Fields:** `promo_code`, `discount_percent`, `promo_expires`, `promo_active`
- Timestamps: `created_at`, `updated_at`

**Roles:** USER, ADMIN, MANAGER, KITCHEN, DRIVER

#### 2. **menus** - Menu Items & Inventory
**Columns:**
- `id` (PK), `name`, `description`, `price`, `category`
- `is_available`, `image_url`, `preparation_time`
- **Dietary Info:** `is_vegetarian`, `is_vegan`, `is_gluten_free`, `is_spicy`, `spice_level`
- **Inventory:** `stock_quantity`, `low_stock_threshold`
- **Promotions:** `is_featured`, `discount_percentage`, `discounted_price`
- `ingredients` (TEXT)

#### 3. **orders** - Customer Orders
**Columns:**
- `id` (PK), `user_id` (FK), `order_date`
- **Status:** ENUM (PENDING, CONFIRMED, PREPARING, READY_FOR_PICKUP, OUT_FOR_DELIVERY, DELIVERED, CANCELLED, REFUNDED)
- **Financial:** `total_amount`, `subtotal`, `tax_amount`, `delivery_fee`
- **Payment:** `payment_method` (ENUM), `payment_status` (ENUM)
- **Delivery:** `delivery_address`, `delivery_phone`, `special_instructions`
- **Type:** `order_type` (DELIVERY, PICKUP, DINE_IN)
- **Timing:** `estimated_delivery_time`, `actual_delivery_time`

#### 4. **order_items** - Order Line Items
**Columns:**
- `id` (PK), `order_id` (FK), `menu_id` (FK)
- `quantity`, `unit_price`, `total_price`
- `special_instructions`

#### 5. **order_tracking** - Order Status History
**Columns:**
- `id` (PK), `order_id` (FK)
- `status`, `title`, `description`
- `timestamp`, `completed`, `actor`

#### 6. **reservations** - Table Bookings
**Columns:**
- `id` (PK), `user_id` (FK)
- `reservation_date`, `reservation_time`, `reservation_date_time`
- `time_slot`, `number_of_people`
- **Status:** ENUM (PENDING, CONFIRMED, SEATED, CANCELLED, NO_SHOW, COMPLETED)
- `customer_name`, `customer_email`, `customer_phone`
- `special_requests`, `table_number`
- `confirmed_at`, `cancelled_at`, `cancellation_reason`
- `reminder_sent`, `admin_notes`

#### 7. **payments** - Payment Transactions
**Columns:**
- `id` (PK), `order_id` (FK), `amount`
- `payment_method` (ENUM), `status` (ENUM)
- `transaction_id`, `slip_image`, `payment_gateway`
- `submitted_date`, `processed_date`, `approved_date`
- **Refunds:** `refund_amount`, `refunded_date`, `refund_reason`
- `failure_reason`

#### 8. **payment_slips** - Payment Proof Uploads
**Columns:**
- `id` (PK), `order_id` (FK), `user_id` (FK)
- **File Info:** `file_name`, `file_path`, `file_size`, `content_type`
- `payment_amount`, `payment_date`
- **Status:** ENUM (PENDING, CONFIRMED, REJECTED, PROCESSING)
- `uploaded_at`, `confirmed_at`, `confirmed_by`
- `rejection_reason`, `admin_notes`
- `bank_name`, `transaction_reference`

#### 9. **drivers** - Delivery Drivers
**Columns:**
- `id` (PK), `name`, `phone` (UNIQUE), `email` (UNIQUE)
- `vehicle_type`, `vehicle_number`, `license_number`
- **Status:** ENUM (PENDING, APPROVED, REJECTED, AVAILABLE, BUSY, OFFLINE)
- `rating`, `total_deliveries`, `earnings`

#### 10. **deliveries** - Delivery Tracking
**Columns:**
- `id` (PK), `order_id` (FK - ONE-TO-ONE), `driver_id` (FK)
- `delivery_address`, `delivery_phone`, `delivery_instructions`
- **Status:** ENUM (PENDING, ASSIGNED, PICKED_UP, IN_TRANSIT, DELIVERED, FAILED, CANCELLED)
- `delivery_fee`, `distance_km`
- `estimated_delivery_time`, `actual_delivery_time`, `pickup_time`
- `proof_of_delivery`, `delivery_notes`
- GPS tracking fields

#### 11. **delivery_drivers** - Driver Assignments (Join Table)
**Columns:**
- `id` (PK), `delivery_id` (FK), `driver_id` (FK)
- `assigned_at`, `notes`

#### 12. **notifications** - User Notifications
**Columns:**
- `id` (PK), `user_id` (FK - nullable for global)
- `title`, `message`
- **Type:** ENUM (ORDER_CONFIRMATION, ORDER_STATUS_UPDATE, RESERVATION_CONFIRMATION, etc.)
- **Status:** ENUM (UNREAD, READ, DISMISSED)
- `reference_id`, `reference_type`, `is_global`
- `created_at`, `read_at`

#### 13. **feedbacks** - Customer Feedback
**Columns:**
- `id` (PK), `user_id` (FK), `menu_id` (FK)
- `feedback` (TEXT)
- `created_at`, `updated_at`

#### 14. **reviews** - Menu Reviews
**Columns:**
- `id` (PK), `user_id` (FK), `menu_id` (FK)
- `rating` (1-5), `feedback` (TEXT)
- `created_at`, `updated_at`

### Database Relationships

```
users (1) ─── (*) orders
users (1) ─── (*) reservations
users (1) ─── (*) notifications
users (1) ─── (*) feedbacks/reviews
users (1) ─── (*) payment_slips

orders (1) ─── (*) order_items
orders (1) ─── (*) order_tracking
orders (1) ─── (*) payments
orders (1) ─── (1) delivery
orders (1) ─── (*) payment_slips

menus (1) ─── (*) order_items
menus (1) ─── (*) feedbacks/reviews

drivers (1) ─── (*) deliveries
deliveries (1) ─── (1) orders
```

### Schema Migration & Updates

**Latest Version:** 2.0 (October 25, 2025)

**Recent Changes:**
- Added promo code support to users
- Added dietary filters and inventory to menus
- Enhanced order payment tracking
- Restructured payment_slips table
- Added comprehensive delivery tracking
- Improved notification system

**Migration Documentation:**
- `DATABASE_ANALYSIS.md` - Detailed table analysis
- `DATABASE_MIGRATION.sql` - Migration script
- `DATABASE_STRUCTURE_SUMMARY.md` - Quick reference
- `MIGRATION_EXECUTION_GUIDE.md` - Step-by-step guide
- `DATABASE_ERD.md` - Visual diagrams

**To migrate from older version:**
```bash
# 1. Backup current database
mysqldump -u root restaurant_db > backup.sql

# 2. Apply migration
Get-Content DATABASE_MIGRATION.sql | mysql -u root restaurant_db

# 3. Verify changes
mysql -u root restaurant_db -e "SHOW TABLES; DESCRIBE orders;"
```

---

## 📋 Key Features

- User authentication with JWT
- Role-based access control (USER, ADMIN, MANAGER, KITCHEN, DRIVER)
- Menu management with categories and inventory
- Order processing with status tracking
- Table reservations
- Payment processing with slip upload
- Delivery tracking with driver assignment
- Real-time notifications

---

## � Documentation

### Database Documentation
- **`DATABASE_ANALYSIS.md`** - Comprehensive table-by-table analysis
- **`DATABASE_MIGRATION.sql`** - SQL migration script
- **`DATABASE_STRUCTURE_SUMMARY.md`** - Quick reference guide
- **`MIGRATION_EXECUTION_GUIDE.md`** - Step-by-step migration tutorial
- **`DATABASE_ERD.md`** - Entity relationship diagrams
- **`DATABASE_COMPARISON_TABLE.md`** - Field-by-field comparison
- **`README_DATABASE_DOCS.md`** - Documentation index
- **`verify-database.sql`** - Database verification script

### API Testing
- **Bruno API Collection:** `backend/bruno-api-tests/`
- Test all endpoints with pre-configured requests
- Includes authentication, CRUD operations, file uploads

---

## 📦 Project Structure

```
restaurant-system/
├── backend/                    # Spring Boot application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/          # Java source code
│   │   │   │   └── com/bms/restaurant_system/
│   │   │   │       ├── controller/    # REST controllers
│   │   │   │       ├── service/       # Business logic
│   │   │   │       ├── entity/        # JPA entities
│   │   │   │       ├── repository/    # Data access
│   │   │   │       ├── config/        # Configuration
│   │   │   │       └── security/      # Security & JWT
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── static/images/     # Uploaded files
│   │   └── test/              # Unit tests
│   ├── database/
│   │   └── RESTAURANT_DB_COMPLETE.sql
│   ├── bruno-api-tests/       # API test collection
│   ├── pom.xml                # Maven dependencies
│   └── mvnw.cmd               # Maven wrapper
│
├── frontend/                   # React application
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── contexts/          # React contexts
│   │   ├── utils/             # Utilities
│   │   └── assets/
│   │       └── images/        # Menu & payment images
│   ├── public/                # Static files
│   ├── package.json           # npm dependencies
│   └── vite.config.js         # Vite configuration
│
├── DATABASE_*.md              # Database documentation
├── verify-database.sql        # DB verification script
└── README.md                  # This file
```

---

## �🔧 Configuration

### Backend (`application.properties`)
```properties
server.port=8084
spring.datasource.url=jdbc:mysql://localhost:3306/restaurant_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=validate

# File upload
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# JWT
jwt.secret=your-secret-key-minimum-256-bits
jwt.expiration=3600000
```

### Frontend Environment Variables
```javascript
// src/services/api.js
const API_BASE_URL = 'http://localhost:8084';
```

---

## 🐛 Troubleshooting

### Database Issues

**Error: "Unknown column in 'field list'"**
```bash
# Your database schema is outdated. Run migration:
mysqldump -u root restaurant_db > backup.sql
Get-Content DATABASE_MIGRATION.sql | mysql -u root restaurant_db

# Or verify current schema:
Get-Content verify-database.sql | mysql -u root restaurant_db
```

**Error: "Schema-validation: missing column"**
```bash
# Check which columns are missing:
mysql -u root restaurant_db -e "DESCRIBE orders;"
mysql -u root restaurant_db -e "DESCRIBE menus;"
mysql -u root restaurant_db -e "DESCRIBE payment_slips;"

# Ensure ddl-auto is set correctly:
# For production: spring.jpa.hibernate.ddl-auto=validate
# For development: spring.jpa.hibernate.ddl-auto=update
```

**Database connection failed:**
```bash
# Verify MySQL is running
mysql -u root -e "SHOW DATABASES;"

# Check connection string in application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/restaurant_db?createDatabaseIfNotExist=true
```

**Fresh database setup:**
```bash
# Drop and recreate (⚠️ WARNING: This deletes all data!)
mysql -u root -e "DROP DATABASE IF EXISTS restaurant_db;"
mysql -u root -e "CREATE DATABASE restaurant_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
Get-Content backend/database/RESTAURANT_DB_COMPLETE.sql | mysql -u root restaurant_db
```

### Application Issues

**Port already in use:**
```bash
# Windows
netstat -ano | findstr :8084
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8084
kill -9 <PID>
```

**Backend won't start:**
```bash
# Clean build
cd backend
mvn clean install -DskipTests
mvn spring-boot:run

# Check logs
tail -f backend/logs/application.log
```

**Frontend dependencies:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**CORS errors:**
```javascript
// Verify API base URL in frontend/src/services/api.js
const API_BASE_URL = 'http://localhost:8084';

// Check backend CORS configuration in application.properties
```

### Verification Commands

**Check database schema:**
```bash
# Run verification script
Get-Content verify-database.sql | mysql -u root restaurant_db

# Should show:
# - 14 tables
# - 0 orphaned records
# - All required columns present
```

**Test API endpoints:**
```bash
# Health check
curl http://localhost:8084/actuator/health

# Login test
curl -X POST http://localhost:8084/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Check table row counts:**
```sql
USE restaurant_db;
SELECT TABLE_NAME, TABLE_ROWS 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'restaurant_db';
```

---

## � Project Structure

```
restaurant-system/
├── README.md                    # This file - project documentation
├── database-setup.sql           # Complete database schema with sample data
├── backend/                     # Spring Boot application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/           # Java source code
│   │   │   └── resources/      # Configuration files
│   │   └── test/               # Unit tests
│   ├── pom.xml                 # Maven dependencies
│   └── bruno-api-tests/        # API testing collection
└── frontend/                    # React application
    ├── src/
    │   ├── pages/              # Page components
    │   ├── components/         # Reusable components
    │   ├── contexts/           # React contexts
    │   ├── services/           # API services
    │   └── utils/              # Utility functions
    ├── package.json            # npm dependencies
    └── vite.config.js          # Vite configuration
```

---

## 📄 License

Educational purposes only.

---

## 👥 Contributors

Bashitha07 - Project Owner

---

**Version:** 2.0.0  
**Last Updated:** October 25, 2025
