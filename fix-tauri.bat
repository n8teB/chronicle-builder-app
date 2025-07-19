@echo off
echo Fixing Tauri setup for Chronicle Builder...
echo.

echo [1/5] Checking if Rust is installed...
where rustc >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo ❌ Rust is required for Tauri!
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
    echo ✓ Rust is installed
    rustc --version
)

echo.
echo [2/5] Cleaning npm cache...
npm cache clean --force

echo.
echo [3/5] Installing Tauri CLI properly...
npm uninstall @tauri-apps/cli
npm install --save-dev @tauri-apps/cli@latest

echo.
echo [4/5] Verifying Tauri CLI installation...
npx tauri --version
if %errorlevel% neq 0 (
    echo ❌ Tauri CLI installation failed
    echo Trying alternative installation...
    npm install -g @tauri-apps/cli
    npx tauri --version
)

echo.
echo [5/5] Testing Tauri commands...
echo Testing: npm run tauri
npm run tauri --version

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo        ✅ TAURI SETUP SUCCESSFUL!
    echo ========================================
    echo.
    echo You can now run:
    echo • npm run tauri-dev    (development)
    echo • npm run tauri-build  (production)
    echo.
) else (
    echo.
    echo ❌ Still having issues. Let's try manual commands:
    echo.
    echo Try these instead:
    echo • npx @tauri-apps/cli dev
    echo • npx @tauri-apps/cli build
    echo.
)

pause
