# Quick Start Guide - VS Code + Live Server

## Automatic Server Start

The backend server will **automatically start** when you open the project in VS Code!

## How to Use with Live Server

### Step 1: Open Project in VS Code
1. Open VS Code
2. File → Open Folder
3. Select the project folder

### Step 2: Server Auto-Starts
- The backend server will automatically start when you open the folder
- Check the Terminal panel to see the server running
- You should see: `🚀 Server running on http://localhost:3000`

### Step 3: Start Live Server
1. **Install Live Server Extension** (if not installed):
   - Press `Ctrl+Shift+X` to open Extensions
   - Search for "Live Server" by Ritwick Dey
   - Click Install

2. **Start Live Server**:
   - Right-click on `frontend/index.html`
   - Select "Open with Live Server"
   - Or click the "Go Live" button in the status bar (bottom right)

### Step 4: Use the Application
- Frontend will open in your browser (usually `http://127.0.0.1:5500`)
- Backend is running on `http://localhost:3000`
- Everything should work now! 🎉

## Manual Server Start (if auto-start doesn't work)

If the server doesn't start automatically:

1. **Using VS Code Tasks:**
   - Press `Ctrl+Shift+P`
   - Type "Tasks: Run Task"
   - Select "Start Backend Server"

2. **Using Terminal:**
   - Open Terminal (`Ctrl+``)
   - Run: `npm start`

3. **Using Debug:**
   - Press `F5`
   - Select "Start Backend Server"

## Troubleshooting

### Server not starting automatically?
- Check if Node.js is installed: `node --version`
- Check if dependencies are installed: `cd backend && npm install`
- Check the Output panel for errors

### Port 3000 already in use?
- Close other applications using port 3000
- Or change the port in `backend/.env`: `PORT=3001`

### Live Server not working?
- Make sure the backend server is running first
- Check browser console (F12) for errors
- Verify the API URL in `frontend/config.js`

## Tips

- **Keep both servers running**: Backend (port 3000) and Live Server (port 5500)
- **Auto-reload**: Live Server will auto-reload when you save files
- **Backend changes**: Restart the backend server after making backend changes
- **Check terminal**: Always check the terminal for server status and errors

