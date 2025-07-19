@echo off
echo Setting up Tauri for Chronicle Builder...
echo.

echo [1/6] Checking Rust installation...
where rustc >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo ❌ Rust not found!
    echo.
    echo Please install Rust first:
    echo 1. Go to: https://rustup.rs/
    echo 2. Download and run the installer
    echo 3. Restart your terminal
    echo 4. Run this script again
    echo.
    pause
    exit /b 1
) else (
    rustc --version
    echo ✓ Rust is installed
)

echo.
echo [2/6] Installing Tauri CLI...
npm install --save-dev @tauri-apps/cli
if %errorlevel% neq 0 (
    echo ❌ Failed to install Tauri CLI
    pause
    exit /b 1
)
echo ✓ Tauri CLI installed

echo.
echo [3/6] Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed

echo.
echo [4/6] Copying icon for Tauri...
if exist "public\assets\icon.png" (
    copy "public\assets\icon.png" "src-tauri\icons\icon.png" >nul
    echo ✓ Icon copied
) else (
    echo ⚠ No icon found, using default
)

echo.
echo [5/6] Building web application...
npm run build:client
if %errorlevel% neq 0 (
    echo ❌ Failed to build web app
    pause
    exit /b 1
)
echo ✓ Web app built

echo.
echo [6/6] Building Tauri application...
npm run tauri build
if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo          🎉 TAURI BUILD SUCCESS!
    echo ========================================
    echo.
    echo Your Chronicle Builder executable is ready!
    echo.
    echo 📁 Location: src-tauri\target\release\
    echo 📦 Installer: src-tauri\target\release\bundle\
    echo.
    echo File size: ~15-20MB (vs 150MB+ with Electron!)
    echo.
    echo Commands:
    echo • Development: npm run tauri-dev
    echo • Production:  npm run tauri-build
    echo.
    echo Your app now has:
    echo ✓ Native performance
    echo ✓ Smaller file size
    echo ✓ Better security
    echo ✓ Same React code
    echo.
) else (
    echo.
    echo ❌ Tauri build failed
    echo.
    echo Try these troubleshooting steps:
    echo 1. Make sure Rust is properly installed
    echo 2. Run: rustup update
    echo 3. Try: npm run tauri-dev (for development)
    echo.
)

pause
