# SIG Investigator Installation Script for Windows
Write-Host "SIG Investigator - Installation Script" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js not found. Installing..." -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "Or run: winget install OpenJS.NodeJS" -ForegroundColor Yellow
    exit 1
}

# Check if npm is available
Write-Host "Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "npm not found. Please reinstall Node.js." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "Dependencies installed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "To start the development server, run:" -ForegroundColor Cyan
    Write-Host "npm run dev" -ForegroundColor White
    Write-Host ""
    Write-Host "Then open http://localhost:3000 in your browser" -ForegroundColor Cyan
} else {
    Write-Host "Failed to install dependencies. Please check the error messages above." -ForegroundColor Red
    exit 1
} 