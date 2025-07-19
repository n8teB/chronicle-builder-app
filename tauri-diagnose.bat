@echo off
echo Diagnosing Tauri setup...
echo.

echo [1] Checking Rust installation:
rustc --version
if %errorlevel% neq 0 (
    echo ❌ Rust not found! Install from: https://rustup.rs/
    goto :end
)
echo.

echo [2] Checking Tauri CLI:
npx @tauri-apps/cli --version
if %errorlevel% neq 0 (
    echo ❌ Tauri CLI not working
    goto :end
)
echo.

echo [3] Checking if dist folder exists:
if exist "dist" (
    echo ✓ Dist folder found
) else (
    echo ❌ Dist folder missing - run: npm run build:client
    goto :end
)
echo.

echo [4] Checking Tauri config:
npx @tauri-apps/cli info
echo.

echo [5] All checks passed! You can try building now:
echo npx @tauri-apps/cli build

:end
pause
