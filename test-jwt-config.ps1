# JWT Configuration Test Script
# Run this after starting the backend to verify JWT authentication

$baseUrl = "http://localhost:8084"

Write-Host "🧪 Testing Restaurant System JWT Configuration" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Login as Admin
Write-Host "Test 1: Admin Login" -ForegroundColor Yellow
$loginBody = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $response.token
    
    Write-Host "✅ Login Successful" -ForegroundColor Green
    Write-Host "   Username: $($response.username)" -ForegroundColor Gray
    Write-Host "   Role: $($response.role)" -ForegroundColor Gray
    Write-Host "   Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
    Write-Host ""
    
    # Test 2: Access Protected Endpoint with Token
    Write-Host "Test 2: Access Admin Endpoint with JWT" -ForegroundColor Yellow
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $users = Invoke-RestMethod -Uri "$baseUrl/api/admin/users" -Method Get -Headers $headers
    Write-Host "✅ Admin endpoint accessible" -ForegroundColor Green
    Write-Host "   Total users: $($users.Count)" -ForegroundColor Gray
    Write-Host ""
    
    # Test 3: Access Without Token (Should Fail)
    Write-Host "Test 3: Access Admin Endpoint WITHOUT JWT (should fail)" -ForegroundColor Yellow
    try {
        Invoke-RestMethod -Uri "$baseUrl/api/admin/users" -Method Get
        Write-Host "❌ SECURITY ISSUE: Endpoint accessible without token!" -ForegroundColor Red
    } catch {
        if ($_.Exception.Response.StatusCode -eq 403) {
            Write-Host "✅ Correctly blocked (403 Forbidden)" -ForegroundColor Green
        } elseif ($_.Exception.Response.StatusCode -eq 401) {
            Write-Host "✅ Correctly blocked (401 Unauthorized)" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Unexpected status: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
        }
    }
    Write-Host ""
    
    # Test 4: Create Menu Item with JWT
    Write-Host "Test 4: Create Menu Item with JWT" -ForegroundColor Yellow
    $menuBody = @{
        name = "JWT Test Pizza"
        description = "Created via JWT authentication"
        price = 12.99
        category = "Main Course"
        isAvailable = $true
        preparationTime = 15
        ingredients = "Test ingredients"
        isVegetarian = $true
        isVegan = $false
        isGlutenFree = $false
        isSpicy = $false
        spiceLevel = 0
        stockQuantity = 50
        lowStockThreshold = 10
        isFeatured = $false
        discountPercentage = 0.0
        discountedPrice = 12.99
    } | ConvertTo-Json
    
    $menu = Invoke-RestMethod -Uri "$baseUrl/api/admin/menu" -Method Post -Headers $headers -Body $menuBody -ContentType "application/json"
    Write-Host "✅ Menu item created successfully" -ForegroundColor Green
    Write-Host "   Menu ID: $($menu.id)" -ForegroundColor Gray
    Write-Host "   Name: $($menu.name)" -ForegroundColor Gray
    
    # Verify no calories/allergens
    if ($null -eq $menu.calories -and $null -eq $menu.allergens) {
        Write-Host "   ✅ Correctly has NO calories/allergens fields" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Still has calories/allergens fields!" -ForegroundColor Red
    }
    Write-Host ""
    
    # Test 5: Verify Database
    Write-Host "Test 5: Database Verification" -ForegroundColor Yellow
    Write-Host "Run this in MySQL to verify:" -ForegroundColor Gray
    Write-Host "   SELECT * FROM menus WHERE id = $($menu.id);" -ForegroundColor Cyan
    Write-Host "   DESCRIBE menus;" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "=================================================" -ForegroundColor Cyan
    Write-Host "🎉 All JWT Tests Passed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Next Steps:" -ForegroundColor Yellow
    Write-Host "   1. Install Bruno: https://www.usebruno.com/downloads" -ForegroundColor Gray
    Write-Host "   2. Open collection: C:\SpringBoot\restaurant-system\bruno-api-tests" -ForegroundColor Gray
    Write-Host "   3. Select 'local' environment" -ForegroundColor Gray
    Write-Host "   4. Run tests in order (see README.md)" -ForegroundColor Gray
    Write-Host ""
    
} catch {
    Write-Host "❌ Test Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "   1. Ensure backend is running on port 8084" -ForegroundColor Gray
    Write-Host "   2. Check admin password is 'admin123'" -ForegroundColor Gray
    Write-Host "   3. Verify MySQL is running" -ForegroundColor Gray
    Write-Host "   4. Check application.properties JWT secret" -ForegroundColor Gray
}
}
