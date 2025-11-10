@echo off
title ESSU Water Maintenance - Backend Server
color 0A
echo ========================================
echo   ESSU Water Maintenance - Backend Server
echo ========================================
echo.
echo Starting backend server on http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo Keep this window open while using the application
echo.
echo ========================================
echo.

cd /d "%~dp0backend"
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting server...
echo.
npm start

pause

