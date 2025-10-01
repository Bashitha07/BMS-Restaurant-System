# Restaurant System Integration Test Suite
# PowerShell script to test frontend-backend integration

Write-Host "🧪 Restaurant System Integration Test Suite" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

$testsPassed = 0
$testsFailed = 0

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET",
        [string]$Body = "",
        [hashtable]$Headers = @{}
    )

    Write-Host "Testing $Name..." -NoNewline

    try {
        $params = @{
            Uri = $Url
            Method = $Method
            ContentType = "application/json"
        }

        if ($Body) {
            $params.Body = $Body
        }

        if ($Headers.Count -gt 0) {
            $params.Headers = $Headers
        }

        $response = Invoke-WebRequest @params

        if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 300) {
            Write-Host " ✅ PASSED ($($response.StatusCode))" -ForegroundColor Green
            $script:testsPassed++
            return $response
        } else {
            Write-Host " ❌ FAILED ($($response.StatusCode) $($response.StatusDescription))" -ForegroundColor Red
            $script:testsFailed++
            return $null
        }
    } catch {
        Write-Host " ❌ FAILED ($($_.Exception.Message))" -ForegroundColor Red
        $script:testsFailed++
        return $null
    }
}

Write-Host "1. Testing Backend API Endpoints" -ForegroundColor Yellow
Write-Host ""

# Test health check (if available)
Test-Endpoint -Name "Health Check" -Url "http://localhost:8083/api/health"

# Test public endpoints
Test-Endpoint -Name "Get Menus" -Url "http://localhost:8083/api/menus"

Write-Host ""
Write-Host "2. Testing Authentication Endpoints" -ForegroundColor Yellow
Write-Host ""

# Test login (this will fail without credentials, but should return proper error)
Test-Endpoint -Name "Login Endpoint" -Url "http://localhost:8083/api/auth/login" -Method "POST" -Body '{"username":"test","password":"test"}'

# Test registration
Test-Endpoint -Name "Registration Endpoint" -Url "http://localhost:8083/api/users/register" -Method "POST" -Body '{"username":"testuser","email":"test@example.com","password":"password123"}'

Write-Host ""
Write-Host "3. Testing Protected Endpoints (should return 401 without auth)" -ForegroundColor Yellow
Write-Host ""

# Test protected endpoints (these will fail without auth, but should return 401)
Test-Endpoint -Name "Get Orders (Protected)" -Url "http://localhost:8083/api/orders"
Test-Endpoint -Name "Get Payments (Protected)" -Url "http://localhost:8083/api/payments"
Test-Endpoint -Name "Get Reservations (Protected)" -Url "http://localhost:8083/api/reservations"

Write-Host ""
Write-Host "4. Testing Admin Endpoints" -ForegroundColor Yellow
Write-Host ""

# Test admin endpoints (should return 401 or 403)
Test-Endpoint -Name "Admin Orders" -Url "http://localhost:8083/api/admin/orders"
Test-Endpoint -Name "Admin Payments" -Url "http://localhost:8083/api/admin/payments"
Test-Endpoint -Name "Admin Users" -Url "http://localhost:8083/api/admin/users"

Write-Host ""
Write-Host "5. Testing Frontend Accessibility" -ForegroundColor Yellow
Write-Host ""

# Test if frontend is accessible
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 10
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "✅ Frontend Server - PASSED (accessible)" -ForegroundColor Green
        $testsPassed++
    } else {
        Write-Host "❌ Frontend Server - FAILED ($($frontendResponse.StatusCode))" -ForegroundColor Red
        $testsFailed++
    }
} catch {
    Write-Host "❌ Frontend Server - FAILED ($($_.Exception.Message))" -ForegroundColor Red
    $testsFailed++
}

# Test specific frontend pages
$frontendPages = @("/", "/login", "/register", "/menu", "/cart", "/checkout")

foreach ($page in $frontendPages) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5173$page" -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Frontend Page $page - PASSED" -ForegroundColor Green
            $testsPassed++
        } else {
            Write-Host "❌ Frontend Page $page - FAILED ($($response.StatusCode))" -ForegroundColor Red
            $testsFailed++
        }
    } catch {
        Write-Host "❌ Frontend Page $page - FAILED ($($_.Exception.Message))" -ForegroundColor Red
        $testsFailed++
    }
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Test Results: $testsPassed passed, $testsFailed failed" -ForegroundColor $(if ($testsFailed -eq 0) { "Green" } else { "Red" })
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

if ($testsFailed -eq 0) {
    Write-Host "🎉 All tests passed! Frontend-backend integration is working correctly." -ForegroundColor Green
} else {
    Write-Host "⚠️  Some tests failed. Please check the backend and frontend servers are running properly." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Troubleshooting tips:" -ForegroundColor Yellow
    Write-Host "- Ensure Spring Boot backend is running on port 8083" -ForegroundColor White
    Write-Host "- Ensure React frontend is running on port 5173" -ForegroundColor White
    Write-Host "- Check application.properties for correct database configuration" -ForegroundColor White
    Write-Host "- Verify JWT authentication is properly configured" -ForegroundColor White
}

Write-Host ""
Write-Host "📝 Manual Testing Checklist:" -ForegroundColor Cyan
Write-Host "1. Open browser to http://localhost:5173" -ForegroundColor White
Write-Host "2. Try user registration and login" -ForegroundColor White
Write-Host "3. Add items to cart and proceed to checkout" -ForegroundColor White
Write-Host "4. Place an order and verify it appears in order history" -ForegroundColor White
Write-Host "5. Login as admin and check order/payment management" -ForegroundColor White
Write-Host "6. Test reservation system" -ForegroundColor White
Write-Host "7. Verify payment processing (deposit slip upload)" -ForegroundColor White
