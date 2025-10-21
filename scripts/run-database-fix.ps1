# =====================================================
# Run Database Fix Script
# =====================================================

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Restaurant System - Database Fix" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "📋 This script will fix the following issues:" -ForegroundColor Yellow
Write-Host "   1. Invalid datetime values (0000-00-00 00:00:00)" -ForegroundColor White
Write-Host "   2. Create missing tables:" -ForegroundColor White
Write-Host "      - delivery_drivers" -ForegroundColor Gray
Write-Host "      - deliveries" -ForegroundColor Gray
Write-Host "      - order_tracking" -ForegroundColor Gray
Write-Host "      - payment_slips" -ForegroundColor Gray
Write-Host "   3. Add 3 sample pending driver applications`n" -ForegroundColor White

Write-Host "📂 SQL Script: complete-database-fix.sql`n" -ForegroundColor Yellow

Write-Host "🔧 OPTION 1: Run via MySQL Command Line" -ForegroundColor Green
Write-Host "Copy and paste this command:" -ForegroundColor White
Write-Host "mysql -u root -p restaurant_db < complete-database-fix.sql`n" -ForegroundColor Cyan

Write-Host "🔧 OPTION 2: Run via MySQL Workbench" -ForegroundColor Green
Write-Host "1. Open MySQL Workbench" -ForegroundColor White
Write-Host "2. Connect to localhost:3306" -ForegroundColor White
Write-Host "3. Open file: complete-database-fix.sql" -ForegroundColor White
Write-Host "4. Click Execute (⚡ icon)`n" -ForegroundColor White

Write-Host "Expected Output:" -ForegroundColor Yellow
Write-Host "   Database fix completed!" -ForegroundColor Gray
Write-Host "   Total Users: X" -ForegroundColor Gray
Write-Host "   Pending Drivers: 3`n" -ForegroundColor Gray

Write-Host "Press any key AFTER running the SQL script..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host "`n✅ Database fix applied!" -ForegroundColor Green
Write-Host "Next step: Restart the backend`n" -ForegroundColor Yellow
