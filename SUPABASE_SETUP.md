# Supabase Setup Guide for Restaurant System

## Overview
Your restaurant system has been successfully migrated from H2/MySQL to Supabase PostgreSQL. This provides you with a cloud-hosted PostgreSQL database with additional features like real-time subscriptions, built-in authentication, and a web-based management interface.

## Changes Made
✅ **Updated Dependencies**: Replaced H2/MySQL with PostgreSQL driver  
✅ **Updated Main Configuration**: Modified `application.properties` for PostgreSQL  
✅ **Updated Test Configuration**: Modified test properties files  
✅ **Removed H2 Settings**: Cleaned up H2 console and security configurations  
✅ **Removed Data Directory**: Deleted local H2 database files  

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/log in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `restaurant-system` (or your preferred name)
   - Database password: **Save this password - you'll need it!**
   - Region: Choose closest to your location
5. Click "Create new project"
6. Wait for the project to be created (takes 1-2 minutes)

## 2. Get Your Database Credentials

Once your project is ready:

1. Go to **Settings** → **Database**
2. Copy the following information:
   - **Host**: `db.XXXXXXXXXXXXXX.supabase.co`
   - **Database name**: `postgres`
   - **Port**: `5432`
   - **User**: `postgres`
   - **Password**: The password you set when creating the project

## 3. Configure Your Application

**Important**: You need to update **THREE** configuration files with your Supabase credentials:

### Main Application Configuration
1. Open `src/main/resources/application.properties`
2. Replace the placeholder values:

```properties
spring.datasource.url=jdbc:postgresql://db.YOUR_PROJECT_REF.supabase.co:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=YOUR_ACTUAL_PASSWORD
```

### Test Configuration Files
Update both test configuration files with the same credentials:

1. `src/test/resources/application.properties`
2. `src/test/resources/application-test.properties`

Replace the placeholders in both files:
```properties
spring.datasource.url=jdbc:postgresql://db.YOUR_PROJECT_REF.supabase.co:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=YOUR_ACTUAL_PASSWORD
```

## 4. Create Database Schema (Optional)

Your Spring Boot application will automatically create tables due to `spring.jpa.hibernate.ddl-auto=update`.

If you want to manually create the schema:
1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Run the SQL commands from `database-setup.sql`

## 5. Environment Variables (Recommended for Production)

For security, consider using environment variables:

### Option 1: System Environment Variables
Set these in your system:
```
SUPABASE_DB_URL=jdbc:postgresql://db.YOUR_PROJECT_REF.supabase.co:5432/postgres
SUPABASE_DB_USERNAME=postgres
SUPABASE_DB_PASSWORD=your_password_here
```

Then update `application.properties`:
```properties
spring.datasource.url=${SUPABASE_DB_URL}
spring.datasource.username=${SUPABASE_DB_USERNAME}
spring.datasource.password=${SUPABASE_DB_PASSWORD}
```

### Option 2: IDE Configuration
In your IDE (VS Code, IntelliJ, etc.), set environment variables in your run configuration.

## 6. Test the Connection

1. **First**: Update your credentials in all three properties files
2. **Clean and rebuild**:
   ```powershell
   mvn clean compile
   ```
3. **Start your application**:
   ```powershell
   mvn spring-boot:run
   ```
4. **Check the logs** for successful database connection
5. **Test your API endpoints** at `http://localhost:8084`

## 7. Supabase Dashboard Features

With Supabase, you get additional features:
- **Table Editor**: Visual interface to view and edit data
- **SQL Editor**: Run custom SQL queries  
- **API Documentation**: Auto-generated REST API
- **Authentication**: Built-in user management (if needed)
- **Real-time**: WebSocket subscriptions for live updates
- **Storage**: File uploads and management
- **Database Backups**: Automatic daily backups

## 8. Troubleshooting

### Connection Issues
- ❌ **"Cannot load driver class: com.mysql.cj.jdbc.Driver"**
  - This means you didn't update all configuration files
  - Update: `application.properties`, `application-test.properties`, and test `application.properties`

- ❌ **Connection timeout or refused**
  - Verify your credentials are correct
  - Check if your IP is allowed (Supabase allows all IPs by default)
  - Ensure your internet connection is stable

### SSL Issues
If you encounter SSL problems, add `?sslmode=require` to your JDBC URL:
```properties
spring.datasource.url=jdbc:postgresql://db.YOUR_PROJECT_REF.supabase.co:5432/postgres?sslmode=require
```

### Pool Configuration (Production)
For production, consider connection pool settings:
```properties
spring.datasource.hikari.maximum-pool-size=5
spring.datasource.hikari.minimum-idle=2
spring.datasource.hikari.connection-timeout=20000
spring.datasource.hikari.idle-timeout=300000
```

## Next Steps

1. ✅ **Update credentials** in all three properties files
2. ✅ **Test compilation**: `mvn clean compile`
3. ✅ **Start application**: `mvn spring-boot:run`  
4. ✅ **Test endpoints**: Visit `http://localhost:8084/api/menus`
5. ✅ **Use Supabase Dashboard** to monitor and manage your data
6. ✅ **Set up environment variables** for production security

## Files Modified
- ✅ `pom.xml` - Updated dependencies
- ✅ `src/main/resources/application.properties` - Main config
- ✅ `src/test/resources/application.properties` - Test config  
- ✅ `src/test/resources/application-test.properties` - Test config
- ✅ `SecurityConfig.java` - Removed H2 console permissions
- ✅ Removed `data/` directory