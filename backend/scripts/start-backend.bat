@echo off
REM ============================================
REM Start Restaurant System Backend
REM ============================================
echo.
echo ========================================
echo Starting Restaurant System Backend
echo ========================================
echo.
echo Port: 8084
echo Database: restaurant_db (localhost:3306)
echo.
echo Please wait for startup to complete...
echo Look for: "Started RestaurantSystemApplication"
echo.
echo ========================================
echo.

cd /d "%~dp0"
echo Compiling and starting backend...
echo.
call mvnw.cmd clean package -DskipTests
echo.
echo Starting JAR file...
java -jar target\restaurant-system-0.0.1-SNAPSHOT.jar

