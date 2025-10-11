# Fixed Reservation System Test
Write-Output "=== RESERVATION SYSTEM DEBUG TEST ==="

# Setup user auth first
try {
    $userData = @{
        username = "reservationtest_$(Get-Random)"
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

# Test reservation creation with proper format
Write-Output ""
Write-Output "Testing Reservation Creation..."

try {
    # Create proper reservationDateTime from date and time
    $reservationDate = "2024-12-20"
    $reservationTime = "19:00:00"
    $reservationDateTime = "${reservationDate}T${reservationTime}"
    
    $reservationData = @{
        reservationDateTime = $reservationDateTime
        timeSlot = "19:00"
        numberOfPeople = 4
        status = "PENDING"
        customerName = "Test Customer"
        customerEmail = "test@example.com"
        customerPhone = "071-123-4567"
        specialRequests = "Integration test reservation"
    } | ConvertTo-Json
    
    Write-Output "Sending reservation data:"
    Write-Output $reservationData
    
    $reservationResponse = Invoke-RestMethod -Uri "http://localhost:8084/api/reservations" -Method POST -Headers $Headers -Body $reservationData
    Write-Output "✅ Reservation created successfully with ID: $($reservationResponse.id)"
    
} catch {
    Write-Output "❌ Reservation creation failed:"
    Write-Output "   Status Code: $($_.Exception.Response.StatusCode)"
    Write-Output "   Error: $($_.Exception.Message)"
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Output "   Response Body: $responseBody"
    }
}

Write-Output ""
Write-Output "=== RESERVATION TEST COMPLETE ==="