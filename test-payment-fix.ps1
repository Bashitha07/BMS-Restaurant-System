# Fixed Payment System Test
Write-Output "=== PAYMENT SYSTEM DEBUG TEST ==="

# Setup user auth and create an order first
try {
    $userData = @{
        username = "paymenttest_$(Get-Random)"
        password = "testpass123"
        email = "test_$(Get-Random)@example.com"
        phone = "071-123-4567"
        role = "USER"
    } | ConvertTo-Json
    
    $userResponse = Invoke-RestMethod -Uri "http://localhost:8084/api/users/register" -Method POST -ContentType "application/json" -Body $userData
    
    if ($userResponse -and $userResponse.id) {
        # Login user
        $loginData = @{
            username = $userResponse.username
            password = "testpass123"
        } | ConvertTo-Json
        
        $loginResponse = Invoke-RestMethod -Uri "http://localhost:8084/api/auth/login" -Method POST -ContentType "application/json" -Body $loginData
        $Token = $loginResponse.token
        $UserId = $userResponse.id
        $Headers = @{
            "Authorization" = "Bearer $Token"
            "Content-Type" = "application/json"
        }
        Write-Output "✅ User setup successful"
    } else {
        Write-Output "❌ User setup failed"
        exit 1
    }
} catch {
    Write-Output "❌ User setup error: $($_.Exception.Message)"
    exit 1
}

# Create an order first (needed for payment)
try {
    # Get a menu item first
    $menus = Invoke-RestMethod -Uri "http://localhost:8084/api/menus" -Method GET
    $TestMenuId = $menus[0].id
    
    $orderData = @{
        userId = $UserId
        items = @(
            @{
                menuId = $TestMenuId
                quantity = 1
                specialInstructions = "Test order for payment"
            }
        )
        paymentMethod = "CASH_ON_DELIVERY"
        deliveryAddress = "123 Test Street, Test City"
        deliveryPhone = "071-123-4567"
        specialInstructions = "Test order"
        orderType = "DELIVERY"
    } | ConvertTo-Json -Depth 3
    
    $orderResponse = Invoke-RestMethod -Uri "http://localhost:8084/api/orders" -Method POST -Headers $Headers -Body $orderData
    $TestOrderId = $orderResponse.id
    Write-Output "✅ Order created with ID: $TestOrderId"
    
} catch {
    Write-Output "❌ Order creation failed: $($_.Exception.Message)"
    exit 1
}

# Test payment creation with proper format
Write-Output ""
Write-Output "Testing Payment Creation..."

try {
    $paymentData = @{
        orderId = $TestOrderId
        amount = 29.99
        paymentMethod = "DEPOSIT_SLIP"
        slipImage = "test-slip-image.jpg"
    } | ConvertTo-Json
    
    Write-Output "Sending payment data:"
    Write-Output $paymentData
    
    $paymentResponse = Invoke-RestMethod -Uri "http://localhost:8084/api/payments" -Method POST -Headers $Headers -Body $paymentData
    Write-Output "✅ Payment created successfully with ID: $($paymentResponse.id)"
    
} catch {
    Write-Output "❌ Payment creation failed:"
    Write-Output "   Status Code: $($_.Exception.Response.StatusCode)"
    Write-Output "   Error: $($_.Exception.Message)"
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Output "   Response Body: $responseBody"
    }
}

Write-Output ""
Write-Output "=== PAYMENT TEST COMPLETE ==="