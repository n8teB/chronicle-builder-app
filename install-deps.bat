@echo off
echo Installing Chronicle Builder dependencies...
echo.

echo [1/4] Cleaning npm cache...
npm cache clean --force

echo.
echo [2/4] Removing old node_modules...
if exist node_modules rmdir /s /q node_modules

echo.
echo [3/4] Removing package-lock.json...
if exist package-lock.json del package-lock.json

echo.
echo [4/4] Installing dependencies...
npm install

if %errorlevel% equ 0 (
    echo.
    echo ✅ Dependencies installed successfully!
    echo.
    echo You can now try:
    echo • npm run build:client
    echo • npm run dev
    echo.
) else (
    echo.
    echo ❌ Installation failed
    echo Try running: npm install --legacy-peer-deps
    echo.
)

pause
