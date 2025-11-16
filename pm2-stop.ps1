

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Asset Management System - PM2 Stop" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""


$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

Write-Host "Stopping all PM2 services..." -ForegroundColor Yellow
pm2 stop all

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ All services stopped successfully" -ForegroundColor Green
} else {
    Write-Host "⚠ Some services may not have stopped cleanly" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Current PM2 Status:" -ForegroundColor Cyan
pm2 status

Write-Host ""
Write-Host "Services stopped. Processes remain in PM2 and can be restarted with: pm2 start all" -ForegroundColor Gray
