@echo off
echo Starting Chronicle Builder with Tauri (Development Mode)...
echo.

echo Building web app...
npm run build:client

echo.
echo Starting Tauri development server...
echo (This will open Chronicle Builder in a native window with hot reload)
echo.

npm run tauri-dev
