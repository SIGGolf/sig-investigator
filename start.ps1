# SIG Investigator - Start Development Server
Write-Host "SIG Investigator - Starting Development Server" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Dependencies not installed. Installing now..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install dependencies. Please run 'npm install' manually." -ForegroundColor Red
        exit 1
    }
}

# Start development server
Write-Host "Starting development server..." -ForegroundColor Yellow
Write-Host "The application will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

npm run dev 