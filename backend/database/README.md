# Database

This directory contains all database-related SQL scripts for the Restaurant Management System.

## SQL Scripts

### `database-setup.sql`
**Purpose:** Main database installation and setup script

**Description:**
- Creates all 10 tables required for the restaurant system
- Includes simplified schema with 93 fields (38% reduction from original)
- Sets up relationships with foreign keys
- Creates indexes for performance optimization
- Includes sample data for testing

**Tables Created:**
1. `users` - User accounts (customers and admins)
2. `menus` - Menu items with 21 fields (simplified)
3. `orders` - Customer orders
4. `order_items` - Individual items in orders
5. `reservations` - Table reservations
6. `payments` - Payment records
7. `payment_slips` - Payment slip details
8. `reviews` - Customer reviews
9. `categories` - Menu categories
10. `tables` - Restaurant table information

**Usage:**
```bash
# MySQL
mysql -u root -p < database-setup.sql

# Or using MySQL Workbench:
# File > Run SQL Script > Select database-setup.sql
```

### `setup-postgresql.sql`
**Purpose:** PostgreSQL-specific database setup

**Description:**
- Alternative database setup for PostgreSQL users
- Contains same schema as MySQL version with PostgreSQL-specific syntax
- Includes PostgreSQL data types and constraints

**Usage:**
```bash
# PostgreSQL
psql -U postgres -d restaurant_db < setup-postgresql.sql

# Or using pgAdmin:
# Tools > Query Tool > Open File > Select setup-postgresql.sql > Execute
```

### `verify-database.sql`
**Purpose:** Database verification and health check

**Description:**
- Checks if all tables are created correctly
- Verifies table structure and constraints
- Counts records in each table
- Validates foreign key relationships
- Tests data integrity

**Usage:**
```bash
# MySQL
mysql -u root -p restaurant_db < verify-database.sql

# PostgreSQL
psql -U postgres -d restaurant_db < verify-database.sql
```

**Expected Output:**
- Table counts for all 10 tables
- Confirmation of indexes
- Validation of foreign keys
- Sample data verification

## Database Configuration

### MySQL (Default)
**Connection Details:**
- Host: `localhost`
- Port: `3306`
- Database: `restaurant_db`
- Username: `root`
- Password: (set in `application.properties`)

**Requirements:**
- MySQL 8.0 or higher
- InnoDB storage engine

### PostgreSQL (Alternative)
**Connection Details:**
- Host: `localhost`
- Port: `5432`
- Database: `restaurant_db`
- Username: `postgres`
- Password: (set in `application-postgresql.properties`)

**Requirements:**
- PostgreSQL 12 or higher

## Database Schema Overview

### Simplified Schema (93 fields across 10 tables)

**Key Simplifications:**
- Removed unnecessary fields from menus (calories, allergens)
- Streamlined user roles to USER and ADMIN only
- Eliminated redundant timestamp fields
- Optimized foreign key relationships

### Important Notes

1. **No Notification Table:** The system does not include a notification table. This was never part of the original design.

2. **Menus Table:** Contains 21 fields (reduced from 24):
   - Removed: `calories`, `allergens`, `rating`, `total_reviews`
   - Kept: Essential menu item information

3. **Users Table:** Contains 9 fields (reduced from 14):
   - Simplified roles: USER, ADMIN (removed STAFF, CUSTOMER, MANAGER)
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
