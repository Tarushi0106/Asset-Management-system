
param(
    [string]$App = 'all'
)

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Asset Management System - PM2 Restart" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""


$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot


Write-Host "Restarting PM2 service: $App..." -ForegroundColor Yellow
pm2 restart $App

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Service(s) restarted successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to restart service(s)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Current PM2 Status:" -ForegroundColor Cyan
pm2 status

Write-Host ""
Write-Host "Logs:" -ForegroundColor Cyan
pm2 logs --lines 10 --nostream
