@echo off
REM ============================================
REM Admin Image Upload Helper Script
REM ============================================
echo.
echo ========================================
echo    Restaurant System - Image Upload
echo ========================================
echo.

REM Check if image path is provided
if "%~1"=="" (
    echo Usage: upload-image.bat [path-to-image] [category]
    echo.
    echo Example: upload-image.bat "C:\Pictures\burger.jpg" food
    echo.
    echo Categories: food, desserts, beverages
    echo.
    pause
    exit /b 1
)

set IMAGE_PATH=%~1
set CATEGORY=%~2

if "%CATEGORY%"=="" set CATEGORY=food

echo Image Path: %IMAGE_PATH%
echo Category: %CATEGORY%
echo.

REM Check if file exists
if not exist "%IMAGE_PATH%" (
    echo ERROR: File not found: %IMAGE_PATH%
    pause
    exit /b 1
)

echo Logging in as admin...
powershell -Command "$login = Invoke-RestMethod -Uri 'http://localhost:8084/api/auth/login' -Method POST -ContentType 'application/json' -Body '{\"username\":\"admin\",\"password\":\"admin123\"}'; $token = $login.token; Write-Host 'Login successful! Token obtained.'; $headers = @{ 'Authorization' = \"Bearer $token\" }; Write-Host 'Uploading image...'; $result = Invoke-RestMethod -Uri 'http://localhost:8084/api/admin/menu/upload-image' -Method POST -Headers $headers -Form @{ file = Get-Item '%IMAGE_PATH%'; category = '%CATEGORY%' }; Write-Host ''; Write-Host 'Upload successful!'; Write-Host 'Image URL: ' $result.imageUrl; Write-Host 'Filename: ' $result.filename; Write-Host 'Category: ' $result.category"

echo.
echo ========================================
echo.
echo Image uploaded successfully!
echo.
echo Next step: Update your menu item with the returned imageUrl
echo Use: PUT /api/admin/menu/{menuItemId}
echo.
pause
