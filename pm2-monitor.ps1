# PM2 Real-Time Monitor Script
# This script displays real-time monitoring of PM2-managed services

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Asset Management System - PM2 Monitor" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to project root
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

Write-Host "Launching PM2 real-time monitoring interface..." -ForegroundColor Yellow
Write-Host "(Press 'q' to exit, 'H' for help)" -ForegroundColor Gray
Write-Host ""

pm2 monit
