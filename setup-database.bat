@echo off
REM ============================================
REM Restaurant System - MySQL Database Setup
REM ============================================
echo.
echo ========================================
echo Restaurant System Database Setup
echo ========================================
echo.

REM Check if MySQL is accessible
echo [1/3] Checking MySQL connection...
mysql -u root -e "SELECT 'MySQL is running!' as Status;" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Cannot connect to MySQL server!
    echo.
    echo Please ensure:
    echo 1. MySQL is installed and running
    echo 2. MySQL is accessible at localhost:3306
    echo 3. Root user has no password (or update this script)
    echo.
    pause
    exit /b 1
)
echo ✓ MySQL connection successful
echo.

REM Execute database setup
echo [2/3] Creating database and tables...
mysql -u root < "database\database-setup.sql"
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to execute database-setup.sql
    pause
    exit /b 1
)
echo ✓ Database and tables created successfully
echo.

REM Verify database setup
echo [3/3] Verifying database setup...
mysql -u root -e "USE restaurant_db; SHOW TABLES;"
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to verify database
    pause
    exit /b 1
)
echo.
echo ✓ Database setup verification complete
echo.

echo ========================================
echo Database Setup Complete! ✓
echo ========================================
echo.
echo Database Name: restaurant_db
echo Tables Created: 10 tables
echo Sample Data: Loaded
echo.
echo You can now start the Spring Boot application!
echo.
pause
