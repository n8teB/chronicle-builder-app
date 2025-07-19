@echo off
echo Checking Tauri setup...
echo.

echo Checking if Rust is installed:
rustc --version
echo.

echo Checking if Tauri CLI is installed:
npx @tauri-apps/cli --version
echo.

echo If both commands above worked, try:
echo npx @tauri-apps/cli build

pause
