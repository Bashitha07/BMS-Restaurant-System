# Simple Restaurant System Integration Test
Write-Host "🧪 Testing Restaurant System Integration" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

$testsPassed = 0
$testsFailed = 0

function Test-Url {
    param([string]$Name, [string]$Url)
    Write-Host "Testing $Name..." -NoNewline
    try {
        $response = Invoke-WebRequest -Uri $Url -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host " ✅ PASSED" -ForegroundColor Green
            $script:testsPassed++
        } else {
            Write-Host " ❌ FAILED ($($response.StatusCode))" -ForegroundColor Red
            $script:testsFailed++
        }
    } catch {
        Write-Host " ❌ FAILED" -ForegroundColor Red
        $script:testsFailed++
    }
}

Write-Host ""
Write-Host "Testing Backend API (Spring Boot on port 8083):" -ForegroundColor Yellow
Test-Url -Name "Backend Health" -Url "http://localhost:8083/api/menus"

Write-Host ""
Write-Host "Testing Frontend (React on port 5173):" -ForegroundColor Yellow
Test-Url -Name "Frontend Home" -Url "http://localhost:5173/"
Test-Url -Name "Frontend Login" -Url "http://localhost:5173/login"
Test-Url -Name "Frontend Menu" -Url "http://localhost:5173/menu"

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Results: $testsPassed passed, $testsFailed failed" -ForegroundColor $(if ($testsFailed -eq 0) { "Green" } else { "Red" })
Write-Host "==========================================" -ForegroundColor Cyan

if ($testsFailed -eq 0) {
    Write-Host "🎉 Integration test PASSED! Both backend and frontend are running." -ForegroundColor Green
} else {
    Write-Host "⚠️  Integration test FAILED. Check if servers are running:" -ForegroundColor Yellow
    Write-Host "  - Backend: mvn spring-boot:run (port 8083)" -ForegroundColor White
    Write-Host "  - Frontend: cd frontend && npm run dev (port 5173)" -ForegroundColor White
}

Write-Host ""
Write-Host "📋 Next Steps for Manual Testing:" -ForegroundColor Cyan
Write-Host "1. Open http://localhost:5173 in browser" -ForegroundColor White
Write-Host "2. Register a new user account" -ForegroundColor White
Write-Host "3. Login and browse menu items" -ForegroundColor White
Write-Host "4. Add items to cart and checkout" -ForegroundColor White
Write-Host "5. Check order history page" -ForegroundColor White
