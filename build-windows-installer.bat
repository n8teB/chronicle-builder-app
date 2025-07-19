@echo off
setlocal enabledelayedexpansion

echo 🚀 Chronicle Builder - Windows Installer Builder
echo ===============================================

echo 📋 Checking prerequisites...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found! Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found

REM Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm not found! Please install npm
    pause
    exit /b 1
)

echo ✅ npm found

echo 📦 Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed

echo 🔨 Building web application...
call npm run build:client
if %errorlevel% neq 0 (
    echo ❌ Failed to build web application
    pause
    exit /b 1
)

echo ✅ Web application built

echo 🖥️ Building Windows installer...
echo This will create a professional .exe installer file...

REM Build the Windows installer
call npx electron-builder --win --x64
if %errorlevel% neq 0 (
    echo ❌ Failed to build Windows installer
    echo 💡 This might be due to missing build tools
    echo 📖 See troubleshooting section in INSTALLER_GUIDE.md
    pause
    exit /b 1
)

echo ✅ Windows installer built successfully!

echo 📁 Checking output files...
if exist "dist-electron\Chronicle Builder-1.0.0-Setup.exe" (
    echo ✅ Installer created: dist-electron\Chronicle Builder-1.0.0-Setup.exe
    
    REM Get file size
    for %%I in ("dist-electron\Chronicle Builder-1.0.0-Setup.exe") do (
        set "filesize=%%~zI"
        set /a "filesize_mb=!filesize! / 1024 / 1024"
        echo 📊 File size: !filesize_mb! MB
    )
) else (
    echo ❌ Installer file not found
    echo 📁 Checking dist-electron contents:
    dir "dist-electron" /b
)

echo.
echo 🎉 Build process completed!
echo.
echo 📁 Output location: dist-electron\Chronicle Builder-1.0.0-Setup.exe
echo 🚀 This is a professional Windows installer that users can download and run
echo 💻 The installer will:
echo    - Install Chronicle Builder to Program Files
echo    - Create desktop and Start Menu shortcuts
echo    - Register .chronicle file association
echo    - Add uninstaller to Control Panel
echo.
echo 📋 To distribute:
echo    1. Upload Chronicle Builder-1.0.0-Setup.exe to cloud storage
echo    2. Share download link with users
echo    3. Users run the installer like any professional software
echo.
echo 🔧 Installer features:
echo    ✅ Professional installation wizard
echo    ✅ Custom installation directory option
echo    ✅ Desktop shortcut creation
echo    ✅ Start Menu integration
echo    ✅ File association (.chronicle files)
echo    ✅ Proper uninstaller
echo    ✅ Windows-standard behavior
echo.

pause
