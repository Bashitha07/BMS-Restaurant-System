# ========================================
# Admin Image Upload Helper Script (PowerShell)
# ========================================
# Usage: .\upload-image.ps1 -ImagePath "C:\path\to\image.jpg" -Category "food"
# Categories: food, desserts, beverages

param(
    [Parameter(Mandatory=$true)]
    [string]$ImagePath,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("food", "desserts", "beverages")]
    [string]$Category = "food",
    
    [Parameter(Mandatory=$false)]
    [int]$MenuItemId = 0
)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Restaurant System - Image Upload" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if file exists
if (-not (Test-Path $ImagePath)) {
    Write-Host "ERROR: File not found: $ImagePath" -ForegroundColor Red
    exit 1
}

$fileInfo = Get-Item $ImagePath
Write-Host "Image Path: $ImagePath" -ForegroundColor Green
Write-Host "File Size: $([Math]::Round($fileInfo.Length / 1MB, 2)) MB" -ForegroundColor Green
Write-Host "Category: $Category" -ForegroundColor Green
Write-Host ""

# Check file size
if ($fileInfo.Length -gt 5MB) {
    Write-Host "ERROR: File size exceeds 5MB limit" -ForegroundColor Red
    exit 1
}

# Step 1: Login as admin
Write-Host "Step 1: Logging in as admin..." -ForegroundColor Yellow
try {
    $loginBody = @{
        username = "admin"
        password = "admin123"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8084/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody

    $token = $loginResponse.token
    Write-Host "✓ Login successful!" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "✗ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Make sure the backend is running on port 8084" -ForegroundColor Yellow
    exit 1
}

# Step 2: Upload image
Write-Host "Step 2: Uploading image..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }

    $form = @{
        file = Get-Item -Path $ImagePath
        category = $Category
    }

    $uploadResponse = Invoke-RestMethod -Uri "http://localhost:8084/api/admin/menu/upload-image" `
        -Method POST `
        -Headers $headers `
        -Form $form

    Write-Host "✓ Upload successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Upload Details:" -ForegroundColor Cyan
    Write-Host "  Image URL: $($uploadResponse.imageUrl)" -ForegroundColor White
    Write-Host "  Filename:  $($uploadResponse.filename)" -ForegroundColor White
    Write-Host "  Category:  $($uploadResponse.category)" -ForegroundColor White
    Write-Host ""

    # Step 3: Optionally update menu item
    if ($MenuItemId -gt 0) {
        Write-Host "Step 3: Updating menu item #$MenuItemId..." -ForegroundColor Yellow
        
        $updateBody = @{
            imageUrl = $uploadResponse.imageUrl
        } | ConvertTo-Json

        $updateResponse = Invoke-RestMethod -Uri "http://localhost:8084/api/admin/menu/$MenuItemId" `
            -Method PUT `
            -Headers $headers `
            -ContentType "application/json" `
            -Body $updateBody

        Write-Host "✓ Menu item updated successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Updated Menu Item:" -ForegroundColor Cyan
        Write-Host "  ID: $($updateResponse.id)" -ForegroundColor White
        Write-Host "  Name: $($updateResponse.name)" -ForegroundColor White
        Write-Host "  Image URL: $($updateResponse.imageUrl)" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host "Next Step:" -ForegroundColor Yellow
        Write-Host "To update a menu item with this image, use:" -ForegroundColor White
        Write-Host "  .\upload-image.ps1 -ImagePath '$ImagePath' -Category $Category -MenuItemId [ID]" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Or manually update via API:" -ForegroundColor White
        Write-Host "  PUT /api/admin/menu/{id}" -ForegroundColor Gray
        Write-Host "  Body: { `"imageUrl`": `"$($uploadResponse.imageUrl)`" }" -ForegroundColor Gray
        Write-Host ""
    }

} catch {
    Write-Host "✗ Upload failed: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Server response: $responseBody" -ForegroundColor Red
    }
    exit 1
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Process completed successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
