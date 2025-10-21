# Restaurant System - Start Servers PowerShell Script
# This script starts both the Spring Boot backend and React frontend

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Restaurant Management System Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if MySQL is running
Write-Host "[DATABASE CHECK]" -ForegroundColor Yellow
Write-Host "Checking MySQL status..." -ForegroundColor Yellow
$mysqlCheck = netstat -an | Select-String ":3306"
if ($mysqlCheck) {
    Write-Host "[SUCCESS] MySQL is running on port 3306." -ForegroundColor Green
} else {
    Write-Host "[WARNING] MySQL does not appear to be running on port 3306." -ForegroundColor Red
    Write-Host "Please start MySQL (via XAMPP or other method) before continuing." -ForegroundColor Red
    $continue = Read-Host "Do you want to continue anyway? (y/n)"
    if ($continue -ne "y") {
        Write-Host "Exiting..." -ForegroundColor Red
        exit
    }
}
Write-Host ""

# Check if ports are in use
function Test-PortAvailability {
    param (
        [int]$Port,
        [string]$ServiceName
    )
    
    Write-Host "Checking if port $Port is available for $ServiceName..." -ForegroundColor Yellow
    $portCheck = netstat -an | Select-String ":$Port"
    
    if ($portCheck) {
        Write-Host "[WARNING] Port $Port is already in use." -ForegroundColor Red
        Write-Host "The $ServiceName server might be running already, or another application is using this port." -ForegroundColor Red
        $killProcess = Read-Host "Do you want to kill the process using port $Port? (y/n)"
        
        if ($killProcess -eq "y") {
            try {
                $processes = netstat -ano | Select-String ":$Port"
                foreach ($process in $processes) {
                    $parts = $process -split ' ' | Where-Object { $_ -ne "" }
                    $processId = $parts[-1]
                    if ($processId -match '^\d+$') {
                        Write-Host "Terminating process with PID $processId..." -ForegroundColor Yellow
                        Stop-Process -Id $processId -Force
                        Write-Host "Process terminated." -ForegroundColor Green
                    }
                }
            } catch {
                Write-Host "Error killing process: $_" -ForegroundColor Red
            }
        } else {
            Write-Host "Port $Port is still in use. $ServiceName server may fail to start." -ForegroundColor Yellow
        }
    } else {
        Write-Host "[SUCCESS] Port $Port is available." -ForegroundColor Green
    }
}

Test-PortAvailability -Port 8084 -ServiceName "Backend"
Test-PortAvailability -Port 5174 -ServiceName "Frontend"
Write-Host ""

# Start Backend Server
Write-Host "Starting Backend Server (Spring Boot)..." -ForegroundColor Cyan
Write-Host "Backend will be available at: http://localhost:8084" -ForegroundColor Cyan
Write-Host ""

# Start the backend process
Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd /d C:\SpringBoot\restaurant-system\backend && mvnw.cmd spring-boot:run" -WindowStyle Normal

Write-Host "Waiting for backend to initialize (15 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Start Frontend Server
Write-Host ""
Write-Host "Starting Frontend Server (React/Vite)..." -ForegroundColor Cyan
Write-Host "Frontend will be available at: http://localhost:5174" -ForegroundColor Cyan
Write-Host ""

# Start the frontend process
Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd /d C:\SpringBoot\restaurant-system\frontend && npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Both servers are starting up!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend: http://localhost:8084" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:5174" -ForegroundColor Yellow
Write-Host ""

# Wait 10 seconds then check if servers are running
Write-Host "Waiting 10 seconds to verify server status..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "Checking server status..." -ForegroundColor Yellow
Write-Host ""

# Check Backend
Write-Host "[BACKEND CHECK]" -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri "http://localhost:8084/api/menus" -Method GET -TimeoutSec 5 -ErrorAction Stop | Out-Null
    Write-Host "[SUCCESS] Backend is running" -ForegroundColor Green
} catch {
    Write-Host "[FAILED] Backend is not responding: $_" -ForegroundColor Red
    Write-Host "Check the backend console window for errors." -ForegroundColor Red
}

# Check Frontend
Write-Host ""
Write-Host "[FRONTEND CHECK]" -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri "http://localhost:5174" -Method GET -TimeoutSec 5 -ErrorAction Stop | Out-Null
    Write-Host "[SUCCESS] Frontend is running" -ForegroundColor Green
} catch {
    Write-Host "[FAILED] Frontend is not responding: $_" -ForegroundColor Red
    Write-Host "Check the frontend console window for errors." -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Server Status Check Complete" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to exit this script..." -ForegroundColor Yellow

# Keep the script running
while ($true) {
    Start-Sleep -Seconds 10
    
    # Optional: You can add periodic health checks here
    # This will keep the PowerShell window open until manually closed
}