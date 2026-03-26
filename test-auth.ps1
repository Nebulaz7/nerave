$base = 'http://localhost:5000'
$time = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$clientEmail = "client_$time@test.com"
$contractorEmail = "contractor_$time@test.com"
$pw = 'Passw0rd!'

Write-Host "Registering CLIENT..." -ForegroundColor Cyan
$regClient = curl.exe -s -X POST "$base/auth/register" -H "Content-Type: application/json" -d @"
{
  "email": "$clientEmail",
  "businessName": "Client Co",
  "password": "$pw",
  "role": "CLIENT"
}
"@
$clientObj = $regClient | ConvertFrom-Json
$clientId = $clientObj.userId
Write-Host "✓ CLIENT registered: $clientId"

Write-Host "Registering CONTRACTOR..." -ForegroundColor Cyan
$regContractor = curl.exe -s -X POST "$base/auth/register" -H "Content-Type: application/json" -d @"
{
  "email": "$contractorEmail",
  "businessName": "Contractor Co",
  "password": "$pw",
  "role": "CONTRACTOR"
}
"@
$contractorObj = $regContractor | ConvertFrom-Json
$contractorId = $contractorObj.userId
Write-Host "✓ CONTRACTOR registered: $contractorId"

Write-Host "Login CLIENT..." -ForegroundColor Cyan
$loginClient = curl.exe -s -X POST "$base/auth/login" -H "Content-Type: application/json" -d @"
{
  "email": "$clientEmail",
  "password": "$pw"
}
"@
$clientLogin = $loginClient | ConvertFrom-Json
$clientToken = $clientLogin.accessToken
Write-Host "✓ CLIENT token obtained"

Write-Host "Login CONTRACTOR..." -ForegroundColor Cyan
$loginContractor = curl.exe -s -X POST "$base/auth/login" -H "Content-Type: application/json" -d @"
{
  "email": "$contractorEmail",
  "password": "$pw"
}
"@
$contractorLogin = $loginContractor | ConvertFrom-Json
$contractorToken = $contractorLogin.accessToken
Write-Host "✓ CONTRACTOR token obtained"

Write-Host "`n======================================" -ForegroundColor Yellow
Write-Host "CREDENTIALS FOR THUNDER CLIENT" -ForegroundColor Yellow
Write-Host "======================================" -ForegroundColor Yellow
Write-Host "CLIENT_ID: $clientId"
Write-Host "CLIENT_TOKEN: $clientToken"
Write-Host ""
Write-Host "CONTRACTOR_ID: $contractorId"
Write-Host "CONTRACTOR_TOKEN: $contractorToken"
Write-Host "======================================" -ForegroundColor Yellow

# Save to file for reference
@{
  clientId = $clientId
  clientToken = $clientToken
  contractorId = $contractorId
  contractorToken = $contractorToken
} | ConvertTo-Json | Out-File "C:\Users\PC\Documents\nerave\test-credentials.json"
Write-Host "✓ Credentials saved to test-credentials.json"
