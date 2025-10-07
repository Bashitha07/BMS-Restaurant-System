@echo off
echo ========================================
echo Restaurant Management System Startup
echo ========================================
echo.

echo Starting Backend Server (Spring Boot)...
echo Backend will be available at: http://localhost:8084
echo.

start cmd /k "cd /d C:\SpringBoot\restaurant-system && echo Starting Spring Boot Backend... && mvn spring-boot:run"

echo Waiting 10 seconds for backend to initialize...
timeout /t 10 /nobreak > nul

echo.
echo Starting Frontend Server (React)...
echo Frontend will be available at: http://localhost:3000
echo.

start cmd /k "cd /d C:\SpringBoot\restaurant-system\frontend && echo Starting React Frontend... && npm run dev"

echo.
echo ========================================
echo Both servers are starting up!
echo ========================================
echo.
echo Backend: http://localhost:8084
echo Frontend: http://localhost:3000
echo H2 Console: http://localhost:8084/h2-console
echo.
echo Press any key to exit this window...
pause > nul