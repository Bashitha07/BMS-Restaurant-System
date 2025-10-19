# Restaurant System - Frontend Startup Script

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Restaurant System - Frontend Server" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

Set-Location frontend

Write-Host "Starting Vite development server..." -ForegroundColor Green
Write-Host ""
Write-Host "Frontend will be available at: http://localhost:5173" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

# Start the server
npm run dev
