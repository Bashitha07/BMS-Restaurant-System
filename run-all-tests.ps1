# Complete System Test Runner
# Tests both Bruno API endpoints and Frontend integration

Write-Host "🧪 COMPLETE SYSTEM TEST SUITE" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "📋 Checking Prerequisites..." -ForegroundColor Yellow

# Check if backend is running
try {
    $backendCheck = Invoke-WebRequest -Uri "http://localhost:8084/api/menu" -UseBasicParsing -Method Options -TimeoutSec 2 -ErrorAction SilentlyContinue
    Write-Host "✅ Backend is running on port 8084" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend is NOT running!" -ForegroundColor Red
    Write-Host "   Start with: mvn spring-boot:run" -ForegroundColor Gray
    exit 1
}

# Check if frontend is running
try {
    $frontendCheck = Invoke-WebRequest -Uri "http://localhost:5176" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
    Write-Host "✅ Frontend is running on port 5176" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Frontend is NOT running" -ForegroundColor Yellow
    Write-Host "   Start with: cd frontend && npm run dev" -ForegroundColor Gray
}

Write-Host ""
Write-Host "════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🎯 Test Phase 1: Bruno API Tests" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "Bruno API tests are located in:" -ForegroundColor Yellow
Write-Host "  📁 C:\SpringBoot\restaurant-system\bruno-api-tests" -ForegroundColor Gray
Write-Host ""
Write-Host "To run Bruno tests:" -ForegroundColor Yellow
Write-Host "  1. Open VS Code" -ForegroundColor Gray
Write-Host "  2. Bruno extension is already installed" -ForegroundColor Gray
Write-Host "  3. Click on Bruno icon in Activity Bar (left side)" -ForegroundColor Gray
Write-Host "  4. Open collection: bruno-api-tests folder" -ForegroundColor Gray
Write-Host "  5. Run '00-START-HERE.bru' first" -ForegroundColor Gray
Write-Host "  6. Then run each folder sequentially" -ForegroundColor Gray
Write-Host ""

Write-Host "════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🎯 Test Phase 2: Frontend API Integration" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "Running Node.js API integration tests..." -ForegroundColor Yellow
Write-Host ""

# Run Node.js tests
cd C:\SpringBoot\restaurant-system\frontend\tests
node api-integration.test.js

Write-Host ""
Write-Host "════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🎯 Test Phase 3: Browser Manual Tests" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "Manual Browser Tests Checklist:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  1. Open browser: http://localhost:5176" -ForegroundColor Gray
Write-Host "  2. Login as admin / admin123" -ForegroundColor Gray
Write-Host "  3. Navigate to Menu Management" -ForegroundColor Gray
Write-Host "     ✅ Create menu item (no calories/allergens fields)" -ForegroundColor Gray
Write-Host "     ✅ Update menu item" -ForegroundColor Gray
Write-Host "     ✅ Delete menu item" -ForegroundColor Gray
Write-Host ""
Write-Host "  4. Navigate to User Management" -ForegroundColor Gray
Write-Host "     ✅ View all users" -ForegroundColor Gray
Write-Host "     ✅ Change user role" -ForegroundColor Gray
Write-Host "     ✅ Enable/disable user" -ForegroundColor Gray
Write-Host ""
Write-Host "  5. Test Admin Visibility" -ForegroundColor Gray
Write-Host "     ✅ Open incognito window" -ForegroundColor Gray
Write-Host "     ✅ Register as new user" -ForegroundColor Gray
Write-Host "     ✅ Place order as user" -ForegroundColor Gray
Write-Host "     ✅ Create reservation as user" -ForegroundColor Gray
Write-Host "     ✅ Switch back to admin tab" -ForegroundColor Gray
Write-Host "     ✅ Verify admin sees user's order" -ForegroundColor Gray
Write-Host "     ✅ Verify admin sees user's reservation" -ForegroundColor Gray
Write-Host ""

Write-Host "════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🎯 Test Phase 4: Database Verification" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "Run these SQL queries to verify:" -ForegroundColor Yellow
Write-Host ""
Write-Host "-- Check menu schema (should have 21 fields)" -ForegroundColor Cyan
Write-Host "DESCRIBE menus;" -ForegroundColor Gray
Write-Host ""
Write-Host "-- Verify NO calories or allergens columns" -ForegroundColor Cyan
Write-Host "SHOW COLUMNS FROM menus WHERE Field IN ('calories', 'allergens');" -ForegroundColor Gray
Write-Host "-- Should return 0 rows" -ForegroundColor Gray
Write-Host ""
Write-Host "-- Check all users" -ForegroundColor Cyan
Write-Host "SELECT id, username, role, enabled FROM users;" -ForegroundColor Gray
Write-Host ""
Write-Host "-- Check recent orders" -ForegroundColor Cyan
Write-Host "SELECT o.id, o.status, o.total_amount, u.username" -ForegroundColor Gray
Write-Host "FROM orders o JOIN users u ON o.user_id = u.id" -ForegroundColor Gray
Write-Host "ORDER BY o.id DESC LIMIT 5;" -ForegroundColor Gray
Write-Host ""
Write-Host "-- Check recent reservations" -ForegroundColor Cyan
Write-Host "SELECT id, customer_name, reservation_date, status FROM reservations" -ForegroundColor Gray
Write-Host "ORDER BY id DESC LIMIT 5;" -ForegroundColor Gray
Write-Host ""

Write-Host "════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ TEST SUITE COMPLETE" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Review test results above" -ForegroundColor Gray
Write-Host "  2. Run Bruno tests in VS Code" -ForegroundColor Gray
Write-Host "  3. Perform manual browser tests" -ForegroundColor Gray
Write-Host "  4. Verify database changes" -ForegroundColor Gray
Write-Host ""
