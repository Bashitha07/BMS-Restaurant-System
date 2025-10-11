# Comprehensive Frontend-Backend Integration Test
# This script tests all major functions to ensure frontend integrates correctly with backend and database

Write-Output "============================================="
Write-Output "  RESTAURANT SYSTEM INTEGRATION TEST SUITE"
Write-Output "============================================="
Write-Output ""

# Global variables for test tracking
$TestsPassed = 0
$TestsFailed = 0
$UserToken = ""
$AdminToken = ""
$TestUserId = ""
$TestOrderId = ""
$TestReservationId = ""
$TestDriverId = ""

function Test-Result {
    param($TestName, $Success, $Message = "")
    
    if ($Success) {
        Write-Output "✅ PASS: $TestName"
        if ($Message) { Write-Output "   → $Message" }
        $script:TestsPassed++
    } else {
        Write-Output "❌ FAIL: $TestName"
        if ($Message) { Write-Output "   → $Message" }
        $script:TestsFailed++
    }
}

function Invoke-SafeRestMethod {
    param($Uri, $Method = "GET", $Headers = @{}, $Body = $null)
    
    try {
        if ($Body) {
            return Invoke-RestMethod -Uri $Uri -Method $Method -Headers $Headers -Body $Body
        } else {
            return Invoke-RestMethod -Uri $Uri -Method $Method -Headers $Headers
        }
    } catch {
        return $null
    }
}

# =============================================================================
# 1. AUTHENTICATION TESTS
# =============================================================================
Write-Output "🔐 Testing Authentication Functions..."
Write-Output ""

# Test 1.1: User Registration
Write-Output "1.1 Testing User Registration..."
$registerData = @{
    username = "testuser_$(Get-Random)"
    password = "testpass123"
    email = "testuser$(Get-Random)@test.com"
    phone = "071-123-4567"
} | ConvertTo-Json

$registerResponse = Invoke-SafeRestMethod -Uri "http://localhost:8084/api/auth/register" -Method POST -Headers @{"Content-Type" = "application/json"} -Body $registerData

if ($registerResponse -and $registerResponse.token) {
    Test-Result "User Registration" $true "User registered with ID: $($registerResponse.user.id)"
    $TestUserId = $registerResponse.user.id
    $UserToken = $registerResponse.token
} else {
    Test-Result "User Registration" $false "Failed to register user or get token"
}

# Test 1.2: User Login (if registration failed, try existing user)
Write-Output ""
Write-Output "1.2 Testing User Login..."
if (-not $UserToken) {
    # Try with a test user - first create one in database
    try {
        $createUserSQL = "INSERT INTO users (username, password, email, role) VALUES ('testuser123', '`$2a`$10`$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'testuser123@test.com', 'USER') ON DUPLICATE KEY UPDATE username=username;"
        mysql -u root -h localhost -P 3306 -e "USE restaurant_db; $createUserSQL" 2>$null
        
        $loginData = @{
            username = "testuser123"
            password = "password"
        } | ConvertTo-Json
        
        $loginResponse = Invoke-SafeRestMethod -Uri "http://localhost:8084/api/auth/login" -Method POST -Headers @{"Content-Type" = "application/json"} -Body $loginData
        
        if ($loginResponse -and $loginResponse.token) {
            Test-Result "User Login" $true "User logged in successfully"
            $UserToken = $loginResponse.token
            $TestUserId = $loginResponse.user.id
        } else {
            Test-Result "User Login" $false "Failed to login user"
        }
    } catch {
        Test-Result "User Login" $false "Error during login test: $($_.Exception.Message)"
    }
}

# Test 1.3: Admin Login
Write-Output ""
Write-Output "1.3 Testing Admin Login..."
try {
    # Create admin user if not exists
    $createAdminSQL = "INSERT INTO users (username, password, email, role) VALUES ('testadmin', '`$2a`$10`$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'testadmin@test.com', 'ADMIN') ON DUPLICATE KEY UPDATE username=username;"
    mysql -u root -h localhost -P 3306 -e "USE restaurant_db; $createAdminSQL" 2>$null
    
    $adminLoginData = @{
        username = "testadmin"
        password = "password"
    } | ConvertTo-Json
    
    $adminLoginResponse = Invoke-SafeRestMethod -Uri "http://localhost:8084/api/auth/login" -Method POST -Headers @{"Content-Type" = "application/json"} -Body $adminLoginData
    
    if ($adminLoginResponse -and $adminLoginResponse.token) {
        Test-Result "Admin Login" $true "Admin logged in successfully"
        $AdminToken = $adminLoginResponse.token
    } else {
        Test-Result "Admin Login" $false "Failed to login admin"
    }
} catch {
    Test-Result "Admin Login" $false "Error during admin login test: $($_.Exception.Message)"
}

# =============================================================================
# 2. MENU MANAGEMENT TESTS
# =============================================================================
Write-Output ""
Write-Output "🍽️ Testing Menu Management Functions..."
Write-Output ""

# Test 2.1: Fetch All Menus (Public)
Write-Output "2.1 Testing Fetch All Menus..."
$menusResponse = Invoke-SafeRestMethod -Uri "http://localhost:8084/api/menus" -Method GET

if ($menusResponse -and $menusResponse.Count -gt 0) {
    Test-Result "Fetch All Menus" $true "Retrieved $($menusResponse.Count) menu items"
    $TestMenuId = $menusResponse[0].id
} else {
    Test-Result "Fetch All Menus" $false "No menu items retrieved"
}

# Test 2.2: Create Menu Item (Admin)
Write-Output ""
Write-Output "2.2 Testing Create Menu Item..."
if ($AdminToken) {
    $newMenuItem = @{
        name = "Test Menu Item $(Get-Random)"
        description = "Test description for integration testing"
        price = 15.99
        category = "Test"
        isAvailable = $true
    } | ConvertTo-Json
    
    $adminHeaders = @{
        "Authorization" = "Bearer $AdminToken"
        "Content-Type" = "application/json"
    }
    
    $createMenuResponse = Invoke-SafeRestMethod -Uri "http://localhost:8084/api/admin/menus" -Method POST -Headers $adminHeaders -Body $newMenuItem
    
    if ($createMenuResponse -and $createMenuResponse.id) {
        Test-Result "Create Menu Item" $true "Menu item created with ID: $($createMenuResponse.id)"
        $TestMenuId = $createMenuResponse.id
    } else {
        Test-Result "Create Menu Item" $false "Failed to create menu item"
    }
} else {
    Test-Result "Create Menu Item" $false "No admin token available"
}

# Test 2.3: Update Menu Item (Admin)
Write-Output ""
Write-Output "2.3 Testing Update Menu Item..."
if ($AdminToken -and $TestMenuId) {
    $updateMenuItem = @{
        name = "Updated Test Menu Item"
        description = "Updated description"
        price = 19.99
        category = "Test"
        isAvailable = $false
    } | ConvertTo-Json
    
    $updateMenuResponse = Invoke-SafeRestMethod -Uri "http://localhost:8084/api/admin/menus/$TestMenuId" -Method PUT -Headers $adminHeaders -Body $updateMenuItem
    
    if ($updateMenuResponse) {
        Test-Result "Update Menu Item" $true "Menu item updated successfully"
    } else {
        Test-Result "Update Menu Item" $false "Failed to update menu item"
    }
} else {
    Test-Result "Update Menu Item" $false "No admin token or test menu ID available"
}

# =============================================================================
# 3. ORDER MANAGEMENT TESTS
# =============================================================================
Write-Output ""
Write-Output "📦 Testing Order Management Functions..."
Write-Output ""

# Test 3.1: Create Order (User)
Write-Output "3.1 Testing Create Order..."
if ($UserToken -and $TestUserId) {
    # Get a menu item for the order
    $menuItem = $menusResponse | Select-Object -First 1
    
    $orderData = @{
        userId = $TestUserId
        items = @(
            @{
                menuId = $menuItem.id
                quantity = 2
                specialInstructions = "Test order integration"
            }
        )
        paymentMethod = "CASH_ON_DELIVERY"
        deliveryAddress = "123 Test Street, Test City, 12345"
        deliveryPhone = "071-123-4567"
        specialInstructions = "Integration test order"
        orderType = "DELIVERY"
    } | ConvertTo-Json -Depth 3
    
    $userHeaders = @{
        "Authorization" = "Bearer $UserToken"
        "Content-Type" = "application/json"
    }
    
    $createOrderResponse = Invoke-SafeRestMethod -Uri "http://localhost:8084/api/orders" -Method POST -Headers $userHeaders -Body $orderData
    
    if ($createOrderResponse -and $createOrderResponse.id) {
        Test-Result "Create Order" $true "Order created with ID: $($createOrderResponse.id)"
        $TestOrderId = $createOrderResponse.id
    } else {
        Test-Result "Create Order" $false "Failed to create order"
    }
} else {
    Test-Result "Create Order" $false "No user token or user ID available"
}

# Test 3.2: Fetch Orders (Admin)
Write-Output ""
Write-Output "3.2 Testing Fetch All Orders (Admin)..."
if ($AdminToken) {
    $ordersResponse = Invoke-SafeRestMethod -Uri "http://localhost:8084/api/orders" -Method GET -Headers $adminHeaders
    
    if ($ordersResponse -and $ordersResponse.Count -ge 0) {
        Test-Result "Fetch All Orders" $true "Retrieved $($ordersResponse.Count) orders"
    } else {
        Test-Result "Fetch All Orders" $false "Failed to fetch orders"
    }
} else {
    Test-Result "Fetch All Orders" $false "No admin token available"
}

# Test 3.3: Update Order Status (Admin)
Write-Output ""
Write-Output "3.3 Testing Update Order Status..."
if ($AdminToken -and $TestOrderId) {
    $updateStatusData = @{
        status = "CONFIRMED"
    } | ConvertTo-Json
    
    $updateOrderResponse = Invoke-SafeRestMethod -Uri "http://localhost:8084/api/orders/$TestOrderId" -Method PUT -Headers $adminHeaders -Body $updateStatusData
    
    if ($updateOrderResponse) {
        Test-Result "Update Order Status" $true "Order status updated successfully"
    } else {
        Test-Result "Update Order Status" $false "Failed to update order status"
    }
} else {
    Test-Result "Update Order Status" $false "No admin token or test order ID available"
}

# =============================================================================
# 4. RESERVATION SYSTEM TESTS
# =============================================================================
Write-Output ""
Write-Output "📅 Testing Reservation System Functions..."
Write-Output ""

# Test 4.1: Create Reservation
Write-Output "4.1 Testing Create Reservation..."
if ($UserToken -and $TestUserId) {
    $tomorrowDate = (Get-Date).AddDays(1).ToString("yyyy-MM-dd")
    $reservationTime = "19:00:00"
    
    $reservationData = @{
        userId = $TestUserId
        reservationDate = $tomorrowDate
        reservationTime = $reservationTime
        reservationDateTime = "${tomorrowDate}T${reservationTime}"
        timeSlot = "19:00-20:00"
        numberOfPeople = 4
        status = "PENDING"
        customerName = "Test Customer"
        customerEmail = "test@example.com"
        customerPhone = "071-123-4567"
        specialRequests = "Integration test reservation"
    } | ConvertTo-Json
    
    $createReservationResponse = Invoke-SafeRestMethod -Uri "http://localhost:8084/api/reservations" -Method POST -Headers $userHeaders -Body $reservationData
    
    if ($createReservationResponse -and $createReservationResponse.id) {
        Test-Result "Create Reservation" $true "Reservation created with ID: $($createReservationResponse.id)"
        $TestReservationId = $createReservationResponse.id
    } else {
        Test-Result "Create Reservation" $false "Failed to create reservation"
    }
} else {
    Test-Result "Create Reservation" $false "No user token or user ID available"
}

# Test 4.2: Fetch Reservations (Admin)
Write-Output ""
Write-Output "4.2 Testing Fetch All Reservations..."
if ($AdminToken) {
    $reservationsResponse = Invoke-SafeRestMethod -Uri "http://localhost:8084/api/admin/reservations" -Method GET -Headers $adminHeaders
    
    if ($reservationsResponse -and $reservationsResponse.Count -ge 0) {
        Test-Result "Fetch All Reservations" $true "Retrieved $($reservationsResponse.Count) reservations"
    } else {
        Test-Result "Fetch All Reservations" $false "Failed to fetch reservations"
    }
} else {
    Test-Result "Fetch All Reservations" $false "No admin token available"
}

# =============================================================================
# 5. DRIVER MANAGEMENT TESTS
# =============================================================================
Write-Output ""
Write-Output "🚗 Testing Driver Management Functions..."
Write-Output ""

# Test 5.1: Create Driver (Admin)
Write-Output "5.1 Testing Create Driver..."
if ($AdminToken) {
    $driverData = @{
        name = "Test Driver $(Get-Random)"
        phone = "071-$(Get-Random -Minimum 1000000 -Maximum 9999999)"
        email = "testdriver$(Get-Random)@example.com"
        vehicleType = "Motorcycle"
        vehicleNumber = "TEST-$(Get-Random -Minimum 1000 -Maximum 9999)"
        licenseNumber = "DL$(Get-Random)"
        status = "AVAILABLE"
    } | ConvertTo-Json
    
    $createDriverResponse = Invoke-SafeRestMethod -Uri "http://localhost:8084/api/admin/drivers" -Method POST -Headers $adminHeaders -Body $driverData
    
    if ($createDriverResponse -and $createDriverResponse.id) {
        Test-Result "Create Driver" $true "Driver created with ID: $($createDriverResponse.id)"
        $TestDriverId = $createDriverResponse.id
    } else {
        Test-Result "Create Driver" $false "Failed to create driver"
    }
} else {
    Test-Result "Create Driver" $false "No admin token available"
}

# Test 5.2: Fetch Drivers (Admin)
Write-Output ""
Write-Output "5.2 Testing Fetch All Drivers..."
if ($AdminToken) {
    $driversResponse = Invoke-SafeRestMethod -Uri "http://localhost:8084/api/admin/drivers" -Method GET -Headers $adminHeaders
    
    if ($driversResponse -and $driversResponse.Count -ge 0) {
        Test-Result "Fetch All Drivers" $true "Retrieved $($driversResponse.Count) drivers"
    } else {
        Test-Result "Fetch All Drivers" $false "Failed to fetch drivers"
    }
} else {
    Test-Result "Fetch All Drivers" $false "No admin token available"
}

# =============================================================================
# 6. DATABASE VERIFICATION TESTS
# =============================================================================
Write-Output ""
Write-Output "🗄️ Testing Database Integration..."
Write-Output ""

# Test 6.1: Verify Data in Database
Write-Output "6.1 Testing Database Data Verification..."
try {
    # Check if created order exists in database
    if ($TestOrderId) {
        $dbOrderCheck = mysql -u root -h localhost -P 3306 -e "USE restaurant_db; SELECT COUNT(*) as count FROM orders WHERE id = $TestOrderId;" -B -N 2>$null
        if ($dbOrderCheck -and $dbOrderCheck -gt 0) {
            Test-Result "Database Order Verification" $true "Order found in database"
        } else {
            Test-Result "Database Order Verification" $false "Order not found in database"
        }
    }
    
    # Check if created user exists in database
    if ($TestUserId) {
        $dbUserCheck = mysql -u root -h localhost -P 3306 -e "USE restaurant_db; SELECT COUNT(*) as count FROM users WHERE id = $TestUserId;" -B -N 2>$null
        if ($dbUserCheck -and $dbUserCheck -gt 0) {
            Test-Result "Database User Verification" $true "User found in database"
        } else {
            Test-Result "Database User Verification" $false "User not found in database"
        }
    }
    
    # Check menu items count
    $dbMenuCount = mysql -u root -h localhost -P 3306 -e "USE restaurant_db; SELECT COUNT(*) as count FROM menus;" -B -N 2>$null
    if ($dbMenuCount -and $dbMenuCount -gt 0) {
        Test-Result "Database Menu Verification" $true "Found $dbMenuCount menu items in database"
    } else {
        Test-Result "Database Menu Verification" $false "No menu items found in database"
    }
    
} catch {
    Test-Result "Database Verification" $false "Error checking database: $($_.Exception.Message)"
}

# =============================================================================
# FINAL RESULTS
# =============================================================================
Write-Output ""
Write-Output "============================================="
Write-Output "           TEST RESULTS SUMMARY"
Write-Output "============================================="
Write-Output ""
Write-Output "✅ Tests Passed: $TestsPassed"
Write-Output "❌ Tests Failed: $TestsFailed"
Write-Output "📊 Total Tests:  $($TestsPassed + $TestsFailed)"
Write-Output ""

$SuccessRate = if (($TestsPassed + $TestsFailed) -gt 0) { 
    [math]::Round(($TestsPassed / ($TestsPassed + $TestsFailed)) * 100, 2) 
} else { 0 }

Write-Output "🎯 Success Rate: $SuccessRate%"
Write-Output ""

if ($TestsFailed -eq 0) {
    Write-Output "🎉 ALL TESTS PASSED! Frontend-Backend integration is working correctly."
} elseif ($SuccessRate -ge 80) {
    Write-Output "✅ Most tests passed. System is mostly functional with minor issues."
} elseif ($SuccessRate -ge 60) {
    Write-Output "⚠️  Some tests failed. System has integration issues that need attention."
} else {
    Write-Output "❌ Many tests failed. System has significant integration problems."
}

Write-Output ""
Write-Output "============================================="