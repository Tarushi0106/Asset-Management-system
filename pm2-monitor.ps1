

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Asset Management System - PM2 Monitor" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""


$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

Write-Host "Launching PM2 real-time monitoring interface..." -ForegroundColor Yellow
Write-Host "(Press 'q' to exit, 'H' for help)" -ForegroundColor Gray
Write-Host ""

pm2 monit
