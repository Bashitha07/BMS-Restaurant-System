# Restaurant Database Schema# Database



## OverviewThis directory contains all database-related SQL scripts for the Restaurant Management System.

This directory contains the complete database schema for the Restaurant Management System.

## SQL Scripts

## Files

### `database-setup.sql`

### RESTAURANT_DB_COMPLETE.sql**Purpose:** Main database installation and setup script

**Complete database schema with all tables, indexes, and useful queries.**

**Description:**

This is the **ONLY** SQL file you need. It includes:- Creates all 10 tables required for the restaurant system

- Includes simplified schema with 93 fields (38% reduction from original)

- ✅ Complete schema for 14 tables- Sets up relationships with foreign keys

- ✅ All foreign keys and indexes- Creates indexes for performance optimization

- ✅ Comprehensive comments and documentation- Includes sample data for testing

- ✅ 10+ useful pre-written queries

- ✅ Maintenance and diagnostic queries**Tables Created:**

1. `users` - User accounts (customers and admins)

## Database Structure2. `menus` - Menu items with 21 fields (simplified)

3. `orders` - Customer orders

### Core Tables (14)4. `order_items` - Individual items in orders

1. **users** - User accounts with promo codes5. `reservations` - Table reservations

2. **menus** - Menu items with dietary info and stock management6. `payments` - Payment records

3. **orders** - Customer orders with payment details7. `payment_slips` - Payment slip details

4. **order_items** - Individual items in orders8. `reviews` - Customer reviews

5. **order_tracking** - Order status history9. `categories` - Menu categories

6. **reservations** - Table reservations with time slots10. `tables` - Restaurant table information

7. **payments** - Payment transactions with refunds

8. **payment_slips** - Payment proof uploads**Usage:**

9. **drivers** - Delivery driver information```bash

10. **deliveries** - Delivery tracking# MySQL

11. **delivery_drivers** - Driver-delivery assignmentsmysql -u root -p < database-setup.sql

12. **notifications** - User notifications

13. **feedbacks** - Customer feedback# Or using MySQL Workbench:

14. **reviews** - Product/service reviews# File > Run SQL Script > Select database-setup.sql

```

## Setup Instructions

### `setup-postgresql.sql`

### First Time Setup**Purpose:** PostgreSQL-specific database setup

```bash

# Login to MySQL (no password)**Description:**

mysql -u root- Alternative database setup for PostgreSQL users

- Contains same schema as MySQL version with PostgreSQL-specific syntax

# Run the complete schema- Includes PostgreSQL data types and constraints

mysql -u root < RESTAURANT_DB_COMPLETE.sql

```**Usage:**

```bash

### Verify Installation# PostgreSQL

```bashpsql -U postgres -d restaurant_db < setup-postgresql.sql

mysql -u root restaurant_db -e "SHOW TABLES;"

```# Or using pgAdmin:

# Tools > Query Tool > Open File > Select setup-postgresql.sql > Execute

You should see 14 tables.```



### Check Data### `verify-database.sql`

```bash**Purpose:** Database verification and health check

mysql -u root restaurant_db -e "SELECT COUNT(*) FROM users;"

mysql -u root restaurant_db -e "SELECT COUNT(*) FROM menus;"**Description:**

```- Checks if all tables are created correctly

- Verifies table structure and constraints

## Configuration- Counts records in each table

- Validates foreign key relationships

### Backend Connection- Tests data integrity

Update `backend/src/main/resources/application.properties`:

**Usage:**

```properties```bash

spring.datasource.url=jdbc:mysql://localhost:3306/restaurant_db# MySQL

spring.datasource.username=rootmysql -u root -p restaurant_db < verify-database.sql

spring.datasource.password=

spring.jpa.hibernate.ddl-auto=none# PostgreSQL

```psql -U postgres -d restaurant_db < verify-database.sql

```

**Note:** `ddl-auto=none` prevents Hibernate from modifying the schema.

**Expected Output:**

## Useful Queries- Table counts for all 10 tables

- Confirmation of indexes

All queries are included in the SQL file with examples for:- Validation of foreign keys

- Sample data verification

- 📊 Sales summaries

- 📈 Popular menu items## Database Configuration

- 🚚 Driver availability

- 💰 Payment statistics### MySQL (Default)

- 📅 Reservation analytics**Connection Details:**

- 📦 Low stock alerts- Host: `localhost`

- 👤 User activity tracking- Port: `3306`

- Database: `restaurant_db`

## Maintenance- Username: `root`

- Password: (set in `application.properties`)

### Backup Database

```bash**Requirements:**

mysqldump -u root restaurant_db > backup_$(date +%Y%m%d).sql- MySQL 8.0 or higher

```- InnoDB storage engine



### Restore Database### PostgreSQL (Alternative)

```bash**Connection Details:**

mysql -u root restaurant_db < backup_YYYYMMDD.sql- Host: `localhost`

```- Port: `5432`

- Database: `restaurant_db`

### Check Database Size- Username: `postgres`

```sql- Password: (set in `application-postgresql.properties`)

SELECT 

    table_name AS 'Table',**Requirements:**

    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'- PostgreSQL 12 or higher

FROM information_schema.TABLES

WHERE table_schema = 'restaurant_db'## Database Schema Overview

ORDER BY (data_length + index_length) DESC;

```### Simplified Schema (93 fields across 10 tables)



## Schema Version**Key Simplifications:**

- Removed unnecessary fields from menus (calories, allergens)

- **Version**: 2.0- Streamlined user roles to USER and ADMIN only

- **Last Updated**: October 23, 2025- Eliminated redundant timestamp fields

- **Changes**: - Optimized foreign key relationships

  - Consolidated all SQL files into one

  - Added comprehensive indexes### Important Notes

  - Added delivery driver notes field

  - Updated all ENUMs to match backend1. **No Notification Table:** The system does not include a notification table. This was never part of the original design.

  - Added useful queries section

2. **Menus Table:** Contains 21 fields (reduced from 24):

## Support   - Removed: `calories`, `allergens`, `rating`, `total_reviews`

   - Kept: Essential menu item information

For issues or questions, refer to the main project README or check:

- Backend entities in `backend/src/main/java/com/bms/restaurant_system/entity/`3. **Users Table:** Contains 9 fields (reduced from 14):

- API documentation in `backend/API_DOCUMENTATION.md`   - Simplified roles: USER, ADMIN (removed STAFF, CUSTOMER, MANAGER)

   - Streamlined authentication fields

## Backup and Restore

### Create Backup
```bash
# MySQL
mysqldump -u root -p restaurant_db > backup_$(date +%Y%m%d).sql

# PostgreSQL
pg_dump -U postgres restaurant_db > backup_$(date +%Y%m%d).sql
```

### Restore Backup
```bash
# MySQL
mysql -u root -p restaurant_db < backup_20251019.sql

# PostgreSQL
psql -U postgres -d restaurant_db < backup_20251019.sql
```

## Migrations

When updating the database schema:
1. Create a new migration SQL file: `migration_YYYYMMDD_description.sql`
2. Document changes in the migration file header
3. Test migration on a copy of production data
4. Update this README with migration instructions
5. Update `verify-database.sql` to check new schema

## Troubleshooting

### "Table already exists" error
```sql
-- Drop all tables (CAUTION: Deletes all data!)
DROP DATABASE IF EXISTS restaurant_db;
CREATE DATABASE restaurant_db;
USE restaurant_db;
-- Then run database-setup.sql
```

### Connection refused
- Check if MySQL/PostgreSQL service is running
- Verify port is not blocked by firewall
- Confirm credentials in application.properties

### Foreign key constraint fails
- Ensure parent tables are created before child tables
- Check that referenced IDs exist in parent tables
- Verify foreign key relationships in schema

## Resources

- [MySQL Documentation](https://dev.mysql.com/doc/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Database Design Best Practices](https://www.vertabelo.com/blog/database-design-best-practices/)
