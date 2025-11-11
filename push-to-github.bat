@echo off
echo ========================================
echo   Push to GitHub - ESSU Water Maintenance
echo ========================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed!
    echo Please install Git from https://git-scm.com/
    pause
    exit /b 1
)

echo [1/4] Checking git status...
git status
echo.

echo [2/4] Adding all changes...
git add .
echo.

echo [3/4] Committing changes...
git commit -m "Update for Vercel deployment with Supabase Storage support"
echo.

echo [4/4] Pushing to GitHub...
echo.
echo Please enter your GitHub credentials when prompted.
echo.
git push origin main

if errorlevel 1 (
    echo.
    echo ERROR: Push failed!
    echo.
    echo Possible reasons:
    echo - Not authenticated with GitHub
    echo - Wrong branch name (should be 'main' or 'master')
    echo - No remote repository configured
    echo.
    echo To fix:
    echo 1. Check your branch: git branch
    echo 2. Check remote: git remote -v
    echo 3. If no remote, add it: git remote add origin YOUR_REPO_URL
    echo.
) else (
    echo.
    echo ========================================
    echo   SUCCESS! Changes pushed to GitHub
    echo ========================================
    echo.
    echo Next steps:
    echo 1. Go to https://vercel.com
    echo 2. Import your repository
    echo 3. Deploy!
    echo.
)

pause

