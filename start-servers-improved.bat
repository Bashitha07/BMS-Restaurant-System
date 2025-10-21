@echo off
echo ========================================
echo Restaurant Management System Startup
echo ========================================
echo.

REM Check if MySQL is running
echo [DATABASE CHECK]
echo Checking MySQL status...
netstat -an | findstr ":3306" > nul
if %errorlevel% equ 0 (
  echo [SUCCESS] MySQL is running on port 3306.
) else (
  echo [WARNING] MySQL does not appear to be running on port 3306.
  echo Please start MySQL (via XAMPP or other method) before continuing.
  echo.
  choice /C YN /M "Do you want to continue anyway?"
  if errorlevel 2 exit
)
echo.

REM Check if port 8084 is available for backend
echo Checking if port 8084 is available...
netstat -an | findstr ":8084" > nul
if %errorlevel% equ 0 (
  echo [WARNING] Port 8084 is already in use.
  echo The backend server might be running already, or another application is using this port.
  echo.
  choice /C YN /M "Do you want to kill the process using port 8084 and continue?"
  if errorlevel 2 goto CHECK_FRONTEND_PORT
  for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8084"') do (
    if not "%%a"=="" (
      echo Terminating process %%a...
      taskkill /F /PID %%a
    )
  )
)

:CHECK_FRONTEND_PORT
REM Check if port 5174 is available for frontend
echo Checking if port 5174 is available...
netstat -an | findstr ":5174" > nul
if %errorlevel% equ 0 (
  echo [WARNING] Port 5174 is already in use.
  echo The frontend server might be running already, or another application is using this port.
  echo.
  choice /C YN /M "Do you want to kill the process using port 5174 and continue?"
  if errorlevel 2 goto START_SERVERS
  for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5174"') do (
    if not "%%a"=="" (
      echo Terminating process %%a...
      taskkill /F /PID %%a
    )
  )
)

:START_SERVERS
echo.
echo Starting Backend Server (Spring Boot)...
echo Backend will be available at: http://localhost:8084
echo.

start cmd /k "cd /d C:\SpringBoot\restaurant-system && echo Starting Spring Boot Backend... && mvnw.cmd spring-boot:run"

echo Waiting for backend to initialize (15 seconds)...
timeout /t 15 /nobreak > nul

echo.
echo Starting Frontend Server (React/Vite)...
echo Frontend will be available at: http://localhost:5174
echo.

start cmd /k "cd /d C:\SpringBoot\restaurant-system\frontend && echo Starting React Frontend... && npm run dev"

echo.
echo ========================================
echo Both servers are starting up!
echo ========================================
echo.
echo Backend: http://localhost:8084
echo Frontend: http://localhost:5174
echo.

REM Check if servers are running after 10 seconds
echo Waiting 10 seconds to verify server status...
timeout /t 10 /nobreak > nul

echo.
echo Checking server status...
echo.

REM Check if backend is running
echo [BACKEND CHECK]
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:8084/api/menus' -Method GET -TimeoutSec 5 -ErrorAction SilentlyContinue; Write-Host '[SUCCESS] Backend is running' -ForegroundColor Green; } catch { Write-Host '[FAILED] Backend is not responding. Check the backend console for errors.' -ForegroundColor Red }"

REM Check if frontend is running
echo.
echo [FRONTEND CHECK]
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5174' -Method GET -TimeoutSec 5 -ErrorAction SilentlyContinue; Write-Host '[SUCCESS] Frontend is running' -ForegroundColor Green; } catch { Write-Host '[FAILED] Frontend is not responding. Check the frontend console for errors.' -ForegroundColor Red }"
echo.

echo ========================================
echo Server Status Check Complete
echo ========================================
echo.
echo Press any key to exit this window...
pause > nul