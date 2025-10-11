$ErrorActionPreference = 'Stop'
$ErrorActionPreference = 'Stop'

$base = 'http://localhost:8084'
$creds = @{ username = 'admin'; password = 'admin123' } | ConvertTo-Json

try {
  $login = Invoke-RestMethod -Uri "$base/api/auth/login" -Method Post -ContentType 'application/json' -Body $creds
  Write-Output "LOGIN OK: $($login.username)"
  $token = $login.token
} catch {
  Write-Output "LOGIN FAILED: $_"
  exit 1
}

$headers = @{ Authorization = "Bearer $($token)" }
$endpoints = @('/api/admin/users','/api/admin/menu','/api/admin/drivers','/api/admin/reservations','/api/admin/payment-slips')

foreach ($e in $endpoints) {
  Write-Output ("`n==== GET " + $e + " ====")
  try {
    $res = Invoke-RestMethod -Uri ($base + $e) -Method Get -Headers $headers
    $res | ConvertTo-Json -Depth 5 | Write-Output
  } catch {
    Write-Output ('ERROR calling ' + $e + ': ' + $_.Exception.Message)
  }
}

# try create menu
Write-Output "`n==== CREATE MENU ===="
$menu = @{ name = 'Smoke Test Item'; description = 'Automated smoke test'; price = 4.99; category = 'Test'; isAvailable = $true } | ConvertTo-Json
try { $created = Invoke-RestMethod -Uri ($base + '/api/admin/menu') -Method Post -Headers $headers -ContentType 'application/json' -Body $menu; $created | ConvertTo-Json -Depth 5 | Write-Output } catch { Write-Output "CREATE MENU FAILED: $_" }

# try register driver
Write-Output "`n==== REGISTER DRIVER ===="
$driver = @{ name='Smoke Driver'; username=('smoke'+(Get-Random -Maximum 99999)); email=('smoke'+(Get-Random -Maximum 99999) + '@example.com'); password='pass123'; phone='0770000000'; address='Test'; licenseNumber='LIC123'; vehicleNumber='V123'; vehicleType='BIKE' } | ConvertTo-Json
try { $drv = Invoke-RestMethod -Uri ($base + '/api/admin/drivers/register') -Method Post -Headers $headers -ContentType 'application/json' -Body $driver; $drv | ConvertTo-Json -Depth 5 | Write-Output } catch { Write-Output "REGISTER DRIVER FAILED: $_" }

Write-Output "`nSMOKE TEST COMPLETE"