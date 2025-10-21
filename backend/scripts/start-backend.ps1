# Restaurant System Startup Script
# This starts the backend server

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Restaurant System - Backend Server" -ForegroundColor Cyan  
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/3] Cleaning previous build..." -ForegroundColor Yellow
mvn clean | Out-Null

Write-Host "[2/3] Compiling project..." -ForegroundColor Yellow  
Write-Host ""

Write-Host "[3/3] Starting Spring Boot server..." -ForegroundColor Green
Write-Host ""
Write-Host "Backend will be available at: http://localhost:8084" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

# Start the server
mvn spring-boot:run
