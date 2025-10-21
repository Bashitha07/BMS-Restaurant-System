@echo off
echo ========================================
echo Restaurant Management System Startup
echo ========================================
echo.
echo [DATABASE CHECK]
echo Make sure XAMPP MySQL is running!
echo MySQL Password: rootpass
echo Database: restaurant_db
echo.
pause

echo Starting Backend Server (Spring Boot)...
echo Backend will be available at: http://localhost:8084
echo.

start cmd /k "cd /d C:\SpringBoot\restaurant-system && echo Starting Spring Boot Backend... && mvn spring-boot:run"

echo Waiting 15 seconds for backend to initialize...
timeout /t 15 /nobreak > nul

echo.
echo Starting Frontend Server (React)...
echo Frontend will be available at: http://localhost:5173
echo.

start cmd /k "cd /d C:\SpringBoot\restaurant-system\frontend && echo Starting React Frontend... && npm run dev"

echo.
echo ========================================
echo Both servers are starting up!
echo ========================================
echo.
echo Backend: http://localhost:8084
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit this window...
pause > nul