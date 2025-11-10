# How to Start the Backend Server

## Quick Start Options

### Option 1: Double-click the batch file (Easiest)
1. **Double-click** `start-server.bat` in the project root folder
2. The server will start automatically on `http://localhost:3000`
3. Keep the window open while using the application

### Option 2: Use PowerShell script
1. **Right-click** on `start-server.ps1`
2. Select **"Run with PowerShell"**
3. The server will start automatically

### Option 3: Use npm command
1. Open terminal/PowerShell in the project root
2. Run: `npm start`
   - Or for development mode: `npm run dev`

### Option 4: Manual start
1. Open terminal/PowerShell
2. Navigate to backend folder:
   ```powershell
   cd backend
   ```
3. Start the server:
   ```powershell
   npm start
   ```

## Notes

- The server must be running for the frontend to work properly
- Keep the server window open while using the application
- The server runs on `http://localhost:3000`
- Press `Ctrl+C` to stop the server

## Troubleshooting

If you get errors:
1. Make sure Node.js is installed
2. Run `npm install` in the backend folder first
3. Check if port 3000 is already in use

