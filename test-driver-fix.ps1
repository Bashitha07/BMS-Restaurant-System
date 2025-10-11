# Fixed Driver Registration Test
Write-Output "=== DRIVER REGISTRATION DEBUG TEST ==="

# Setup admin auth first
try {
    $adminData = @{
        username = "driveradmin_$(Get-Random)"
        password = "testpass123"
        email = "admin_$(Get-Random)@example.com"
        phone = "071-123-4567"
        role = "ADMIN"
    } | ConvertTo-Json
    
    $adminResponse = Invoke-RestMethod -Uri "http://localhost:8084/api/users/register" -Method POST -ContentType "application/json" -Body $adminData
    
    if ($adminResponse -and $adminResponse.id) {
        # Login admin
        $loginData = @{
            username = $adminResponse.username
            password = "testpass123"
        } | ConvertTo-Json
        
        $loginResponse = Invoke-RestMethod -Uri "http://localhost:8084/api/auth/login" -Method POST -ContentType "application/json" -Body $loginData
        $Token = $loginResponse.token
        $Headers = @{
            "Authorization" = "Bearer $Token"
            "Content-Type" = "application/json"
        }
        Write-Output "✅ Admin setup successful"
    } else {
        Write-Output "❌ Admin setup failed"
        exit 1
    }
} catch {
    Write-Output "❌ Admin setup error: $($_.Exception.Message)"
    exit 1
}

# Test driver registration with proper format
Write-Output ""
Write-Output "Testing Driver Registration..."

try {
    $randomNum = Get-Random
    $driverData = @{
        name = "Test Driver $randomNum"
        username = "driver$randomNum"
        email = "driver$randomNum@example.com"
        password = "driver123"
        phone = "071-$(Get-Random -Minimum 1000000 -Maximum 9999999)"
        address = "123 Driver Street, Driver City"
        licenseNumber = "DL$randomNum"
        vehicleNumber = "TEST$randomNum"
        vehicleType = "Motorcycle"
        vehicleModel = "Honda CBR"
        emergencyContact = "Emergency Contact"
        emergencyPhone = "071-999-8888"
        hourlyRate = 25.50
        commissionRate = 15.0
        notes = "Integration test driver"
    } | ConvertTo-Json
    
    Write-Output "Sending driver registration data:"
    Write-Output $driverData
    
    $driverResponse = Invoke-RestMethod -Uri "http://localhost:8084/api/admin/drivers/register" -Method POST -Headers $Headers -Body $driverData
    Write-Output "✅ Driver registered successfully with ID: $($driverResponse.id)"
    
} catch {
    Write-Output "❌ Driver registration failed:"
    Write-Output "   Status Code: $($_.Exception.Response.StatusCode)"
    Write-Output "   Error: $($_.Exception.Message)"
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Output "   Response Body: $responseBody"
    }
}

Write-Output ""
Write-Output "=== DRIVER REGISTRATION TEST COMPLETE ==="