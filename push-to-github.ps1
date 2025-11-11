# Push to GitHub Script for ESSU Water Maintenance
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Push to GitHub - ESSU Water Maintenance" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
try {
    $null = git --version 2>&1
} catch {
    Write-Host "ERROR: Git is not installed!" -ForegroundColor Red
    Write-Host "Please install Git from https://git-scm.com/" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[1/4] Checking git status..." -ForegroundColor Yellow
git status
Write-Host ""

Write-Host "[2/4] Adding all changes..." -ForegroundColor Yellow
git add .
Write-Host ""

Write-Host "[3/4] Committing changes..." -ForegroundColor Yellow
git commit -m "Update for Vercel deployment with Supabase Storage support"
Write-Host ""

Write-Host "[4/4] Pushing to GitHub..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Please enter your GitHub credentials when prompted." -ForegroundColor Cyan
Write-Host ""

$branch = git branch --show-current
if ($null -eq $branch) {
    $branch = "main"
}

git push origin $branch

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: Push failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible reasons:" -ForegroundColor Yellow
    Write-Host "- Not authenticated with GitHub"
    Write-Host "- Wrong branch name"
    Write-Host "- No remote repository configured"
    Write-Host ""
    Write-Host "To fix:" -ForegroundColor Cyan
    Write-Host "1. Check your branch: git branch"
    Write-Host "2. Check remote: git remote -v"
    Write-Host "3. If no remote, add it: git remote add origin YOUR_REPO_URL"
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  SUCCESS! Changes pushed to GitHub" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Go to https://vercel.com"
    Write-Host "2. Import your repository"
    Write-Host "3. Deploy!"
    Write-Host ""
}

Read-Host "Press Enter to exit"

