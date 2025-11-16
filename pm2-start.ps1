# PM2 Auto-Restart Startup Script for Asset Management System
# This script initializes PM2 services and configures system startup

param(
    [switch]$SystemStartup = $false
)

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Asset Management System - PM2 Startup" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Check if PM2 is installed globally
try {
    $pm2Version = pm2 -v
    Write-Host "✓ PM2 is installed (v$pm2Version)" -ForegroundColor Green
} catch {
    Write-Host "✗ PM2 is not installed globally" -ForegroundColor Red
    Write-Host "Install it with: npm install -g pm2" -ForegroundColor Yellow
    exit 1
}

# Navigate to project root
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot
Write-Host "Working directory: $projectRoot" -ForegroundColor Gray
Write-Host ""

# Stop any running PM2 services first
Write-Host "Stopping any existing PM2 services..." -ForegroundColor Yellow
pm2 stop ecosystem.config.js 2>$null | Out-Null

# Start PM2 services from ecosystem config
Write-Host "Starting PM2 services from ecosystem.config.js..." -ForegroundColor Yellow
pm2 start ecosystem.config.js --update-env

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ PM2 services started successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to start PM2 services" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Save PM2 process list
Write-Host "Saving PM2 process list..." -ForegroundColor Yellow
pm2 save

# If SystemStartup flag, set up startup hook
if ($SystemStartup) {
    Write-Host "Setting up PM2 to start on system boot..." -ForegroundColor Yellow
    pm2 startup
    Write-Host "Note: You may need to run the generated startup command as Administrator" -ForegroundColor Gray
}

Write-Host ""

# Display PM2 status
Write-Host "Current PM2 Status:" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan
pm2 status

Write-Host ""

# Display logs
Write-Host "Recent Logs (last 5 lines per app):" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
pm2 logs --lines 5 --nostream

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "PM2 Startup Complete!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Useful Commands:" -ForegroundColor Yellow
Write-Host "  pm2 status              - View all running processes" -ForegroundColor Gray
Write-Host "  pm2 logs                - View real-time logs" -ForegroundColor Gray
Write-Host "  pm2 logs asset-backend  - View backend logs only" -ForegroundColor Gray
Write-Host "  pm2 restart all         - Restart all services" -ForegroundColor Gray
Write-Host "  pm2 stop all            - Stop all services" -ForegroundColor Gray
Write-Host "  pm2 delete all          - Delete all services from PM2" -ForegroundColor Gray
Write-Host "  pm2 monit               - View real-time monitoring" -ForegroundColor Gray
Write-Host ""
