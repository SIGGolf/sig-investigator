# SIG Investigator - GitHub Deployment Helper Script
Write-Host "=== SIG Investigator GitHub Deployment ===" -ForegroundColor Green
Write-Host ""

# Check if Git is installed
try {
    $gitVersion = git --version
    Write-Host "✓ Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Git is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Git first:" -ForegroundColor Yellow
    Write-Host "1. Go to https://git-scm.com/download/win" -ForegroundColor Cyan
    Write-Host "2. Download and install Git" -ForegroundColor Cyan
    Write-Host "3. Restart PowerShell and run this script again" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Or use GitHub Desktop instead:" -ForegroundColor Yellow
    Write-Host "1. Go to https://desktop.github.com/" -ForegroundColor Cyan
    Write-Host "2. Download and install GitHub Desktop" -ForegroundColor Cyan
    Write-Host "3. Use the visual interface to create and publish your repository" -ForegroundColor Cyan
    Read-Host "Press Enter to exit"
    exit
}

Write-Host ""
Write-Host "This script will help you upload your project to GitHub." -ForegroundColor Yellow
Write-Host "Make sure you have:" -ForegroundColor Yellow
Write-Host "1. Created a GitHub repository named 'sig-investigator'" -ForegroundColor Cyan
Write-Host "2. Made it public" -ForegroundColor Cyan
Write-Host "3. Not initialized it with README" -ForegroundColor Cyan
Write-Host ""

$continue = Read-Host "Ready to proceed? (y/n)"
if ($continue -ne "y" -and $continue -ne "Y") {
    Write-Host "Deployment cancelled." -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "Step 1: Initializing Git repository..." -ForegroundColor Green
git init

Write-Host ""
Write-Host "Step 2: Adding all files..." -ForegroundColor Green
git add .

Write-Host ""
Write-Host "Step 3: Creating initial commit..." -ForegroundColor Green
git commit -m "Initial commit - SIG Investigator app"

Write-Host ""
Write-Host "Step 4: Setting up main branch..." -ForegroundColor Green
git branch -M main

Write-Host ""
Write-Host "Step 5: Adding GitHub remote..." -ForegroundColor Green
git remote add origin https://github.com/SIGGolf/sig-investigator.git

Write-Host ""
Write-Host "Step 6: Pushing to GitHub..." -ForegroundColor Green
git push -u origin main

Write-Host ""
Write-Host "=== SUCCESS! ===" -ForegroundColor Green
Write-Host "Your project has been uploaded to GitHub!" -ForegroundColor Green
Write-Host "Repository URL: https://github.com/SIGGolf/sig-investigator" -ForegroundColor Cyan
Write-Host ""
Write-Host "Now you can deploy to Netlify:" -ForegroundColor Yellow
Write-Host "1. Go to your Netlify dashboard" -ForegroundColor Cyan
Write-Host "2. Click 'Add new site' > 'Import an existing project'" -ForegroundColor Cyan
Write-Host "3. Choose 'Deploy with GitHub'" -ForegroundColor Cyan
Write-Host "4. Select your 'sig-investigator' repository" -ForegroundColor Cyan
Write-Host "5. Click 'Deploy site'" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to exit" 