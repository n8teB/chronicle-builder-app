@echo off
echo Migrating Chronicle Builder to Tauri...

echo Step 1: Installing Rust (if needed)...
where rustc >nul 2>nul
if %errorlevel% neq 0 (
    echo Please install Rust first:
    echo https://rustup.rs/
    echo Then run this script again.
    pause
    exit /b 1
)

echo Step 2: Installing Tauri CLI...
npm install --save-dev @tauri-apps/cli

echo Step 3: Initializing Tauri...
npx tauri init --yes

echo Step 4: Building web app...
npm run build:client

echo Step 5: Building Tauri app...
npm run tauri build

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo           MIGRATION SUCCESSFUL!
    echo ========================================
    echo.
    echo Your Tauri app is ready in: src-tauri/target/release/
    echo Bundle size: ~15MB (vs 150MB+ with Electron!)
    echo.
    echo To run in development: npm run tauri dev
    echo To build for production: npm run tauri build
    echo.
) else (
    echo Migration failed. Check the Tauri documentation.
)

pause
