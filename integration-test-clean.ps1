# Simple Integration Test - Test core functions step by step
Write-Output "=== RESTAURANT SYSTEM INTEGRATION TEST ==="
Write-Output ""

$TestsPassed = 0
$TestsFailed = 0

function Test-Result {
    param($TestName, $Success, $Message = "")
    
    if ($Success) {
        Write-Output "PASS: $TestName"
        if ($Message) { Write-Output "   -> $Message" }
        $script:TestsPassed++
    } else {
        Write-Output "FAIL: $TestName"
        if ($Message) { Write-Output "   -> $Message" }
        $script:TestsFailed++
    }
}

# Test 1: Menu API (Public - No auth needed)
Write-Output "1. Testing Menu API..."
try {
    $menus = Invoke-RestMethod -Uri "http://localhost:8084/api/menus" -Method GET
    if ($menus -and $menus.Count -gt 0) {
        Test-Result "Menu API" $true "Retrieved $($menus.Count) menu items"
    } else {
        Test-Result "Menu API" $false "No menu items found"
    }
} catch {
    Test-Result "Menu API" $false "Error: $($_.Exception.Message)"
}

# Test 2: User Registration and Login
Write-Output ""
Write-Output "2. Testing User Registration and Login..."

# First test registration
$testUsername = "integrationtest_$(Get-Random)"
$testPassword = "testpass123"
try {
    $userData = @{
        username = $testUsername
        password = $testPassword
        email = "test_$(Get-Random)@example.com"
        phone = "071-123-4567"
        role = "USER"
    } | ConvertTo-Json
    
    $userResponse = Invoke-RestMethod -Uri "http://localhost:8084/api/users/register" -Method POST -ContentType "application/json" -Body $userData
    
    if ($userResponse -and $userResponse.id) {
        Test-Result "User Registration" $true "User registered with ID: $($userResponse.id)"
        $UserId = $userResponse.id
        
        # Now test login to get token
        $loginData = @{
            username = $testUsername
            password = $testPassword
        } | ConvertTo-Json
        
        $loginResponse = Invoke-RestMethod -Uri "http://localhost:8084/api/auth/login" -Method POST -ContentType "application/json" -Body $loginData
        
        if ($loginResponse -and $loginResponse.token) {
            Test-Result "User Login" $true "Login successful, token received"
            $UserToken = $loginResponse.token
        } else {
            Test-Result "User Login" $false "Login failed or no token received"
        }
    } else {
        Test-Result "User Registration" $false "Registration failed or no user ID"
    }
} catch {
    Test-Result "User Registration/Login" $false "Error: $($_.Exception.Message)"
}

# Test 3: Order Creation (if user registration worked)
Write-Output ""
Write-Output "3. Testing Order Creation..."
if ($UserToken -and $UserId -and $menus) {
    try {
        $orderData = @{
            userId = $UserId
            items = @(
                @{
                    menuId = $menus[0].id
                    quantity = 2
                    specialInstructions = "Integration test order"
                }
            )
            paymentMethod = "CASH_ON_DELIVERY"
            deliveryAddress = "123 Test Street, Test City"
            deliveryPhone = "071-123-4567"
            specialInstructions = "Test order"
            orderType = "DELIVERY"
        } | ConvertTo-Json -Depth 3
        
        $headers = @{
            "Authorization" = "Bearer $UserToken"
            "Content-Type" = "application/json"
        }
        
        $orderResponse = Invoke-RestMethod -Uri "http://localhost:8084/api/orders" -Method POST -Headers $headers -Body $orderData
        
        if ($orderResponse -and $orderResponse.id) {
            Test-Result "Order Creation" $true "Order created with ID: $($orderResponse.id)"
            $OrderId = $orderResponse.id
        } else {
            Test-Result "Order Creation" $false "Failed to create order"
        }
    } catch {
        Test-Result "Order Creation" $false "Error: $($_.Exception.Message)"
    }
} else {
    Test-Result "Order Creation" $false "Prerequisites not met (no user token or menu items)"
}

# Test 4: Reservation Creation
Write-Output ""
Write-Output "4. Testing Reservation Creation..."
if ($UserToken -and $UserId) {
    try {
        $tomorrow = (Get-Date).AddDays(1).ToString("yyyy-MM-dd")
        $reservationData = @{
            reservationDate = $tomorrow
            reservationTime = "19:00:00"
            reservationDateTime = "${tomorrow}T19:00:00"
            timeSlot = "19:00-20:00"
            numberOfPeople = 4
            status = "PENDING"
            customerName = "Test Customer"
            customerEmail = "test@example.com"
            customerPhone = "071-123-4567"
            specialRequests = "Integration test"
            userId = $UserId
        } | ConvertTo-Json
        
        $reservationResponse = Invoke-RestMethod -Uri "http://localhost:8084/api/reservations" -Method POST -Headers $headers -Body $reservationData
        
        if ($reservationResponse -and $reservationResponse.id) {
            Test-Result "Reservation Creation" $true "Reservation created with ID: $($reservationResponse.id)"
        } else {
            Test-Result "Reservation Creation" $false "Failed to create reservation"
        }
    } catch {
        Test-Result "Reservation Creation" $false "Error: $($_.Exception.Message)"
    }
} else {
    Test-Result "Reservation Creation" $false "No user token available"
}

# Test 5: Database Verification
Write-Output ""
Write-Output "5. Testing Database Integration..."
try {
    # Check if data exists in database
    $dbCheck = mysql -u root -h localhost -P 3306 -e "USE restaurant_db; SELECT COUNT(*) FROM users; SELECT COUNT(*) FROM menus; SELECT COUNT(*) FROM orders;" -B 2>$null
    
    if ($dbCheck) {
        Test-Result "Database Integration" $true "Database connection and data verification successful"
    } else {
        Test-Result "Database Integration" $false "Database check failed"
    }
} catch {
    Test-Result "Database Integration" $false "Error: $($_.Exception.Message)"
}

# Test 6: Server Status Check
Write-Output ""
Write-Output "6. Testing Server Status..."

# Check if backend is running
$backendRunning = netstat -an | findstr ":8084" | Measure-Object | Select-Object -ExpandProperty Count
if ($backendRunning -gt 0) {
    Test-Result "Backend Server" $true "Backend server running on port 8084"
} else {
    Test-Result "Backend Server" $false "Backend server not running on port 8084"
}

# Check if frontend is running
$frontendRunning = netstat -an | findstr ":517" | Measure-Object | Select-Object -ExpandProperty Count
if ($frontendRunning -gt 0) {
    Test-Result "Frontend Server" $true "Frontend server running"
} else {
    Test-Result "Frontend Server" $false "Frontend server not running"
}

# Final Results
Write-Output ""
Write-Output "=== TEST RESULTS ==="
Write-Output "Passed: $TestsPassed"
Write-Output "Failed: $TestsFailed"
Write-Output "Total: $($TestsPassed + $TestsFailed)"

$successRate = if (($TestsPassed + $TestsFailed) -gt 0) {
    [math]::Round(($TestsPassed / ($TestsPassed + $TestsFailed)) * 100, 2)
} else { 0 }

Write-Output "Success Rate: $successRate%"
Write-Output ""

if ($TestsFailed -eq 0) {
    Write-Output "ALL TESTS PASSED! System is fully integrated."
} elseif ($successRate -ge 75) {
    Write-Output "System is mostly working. Minor issues to address."
} else {
    Write-Output "System has integration issues that need attention."
}