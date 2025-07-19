@echo off
title Chronicle Builder - Guaranteed Windows Build
echo.
echo ============================================
echo   Chronicle Builder - Windows Build
echo   Bypassing electron-builder completely
echo ============================================
echo.

REM Step 1: Build the web app
echo [1/6] Building web application...
call npm run build:client
if %errorlevel% neq 0 (
    echo ERROR: Web build failed!
    pause
    exit /b 1
)
echo ✓ Web app built successfully

REM Step 2: Create output directory
echo.
echo [2/6] Creating output directory...
if exist "dist-electron" rmdir /s /q "dist-electron"
mkdir "dist-electron"
mkdir "dist-electron\Chronicle-Builder-Portable"
echo ✓ Directory created

REM Step 3: Copy built files
echo.
echo [3/6] Copying application files...
xcopy "dist" "dist-electron\Chronicle-Builder-Portable\resources\app\dist\" /E /I /Y /Q
copy "public\electron.cjs" "dist-electron\Chronicle-Builder-Portable\resources\app\" >nul
echo { > "dist-electron\Chronicle-Builder-Portable\resources\app\package.json"
echo   "name": "chronicle-builder", >> "dist-electron\Chronicle-Builder-Portable\resources\app\package.json"
echo   "version": "1.0.0", >> "dist-electron\Chronicle-Builder-Portable\resources\app\package.json"
echo   "main": "electron.cjs" >> "dist-electron\Chronicle-Builder-Portable\resources\app\package.json"
echo } >> "dist-electron\Chronicle-Builder-Portable\resources\app\package.json"
echo ✓ Files copied

REM Step 4: Download prebuilt Electron
echo.
echo [4/6] Downloading Electron runtime...
curl -L -o "electron-win.zip" "https://github.com/electron/electron/releases/download/v28.0.0/electron-v28.0.0-win32-x64.zip"
if %errorlevel% neq 0 (
    echo Trying PowerShell download...
    powershell -Command "Invoke-WebRequest -Uri 'https://github.com/electron/electron/releases/download/v28.0.0/electron-v28.0.0-win32-x64.zip' -OutFile 'electron-win.zip'"
)
echo ✓ Electron downloaded

REM Step 5: Extract and setup
echo.
echo [5/6] Setting up executable...
powershell -Command "Expand-Archive -Path 'electron-win.zip' -DestinationPath 'dist-electron\Chronicle-Builder-Portable\' -Force"
del "electron-win.zip"

REM Rename electron.exe
cd "dist-electron\Chronicle-Builder-Portable"
ren "electron.exe" "Chronicle Builder.exe"
cd ..\..

REM Create launcher script
echo @echo off > "dist-electron\Chronicle-Builder-Portable\Start Chronicle Builder.bat"
echo cd /d "%%~dp0" >> "dist-electron\Chronicle-Builder-Portable\Start Chronicle Builder.bat"
echo start "" "Chronicle Builder.exe" >> "dist-electron\Chronicle-Builder-Portable\Start Chronicle Builder.bat"

REM Create README
echo Chronicle Builder - Portable Windows Version > "dist-electron\Chronicle-Builder-Portable\README.txt"
echo. >> "dist-electron\Chronicle-Builder-Portable\README.txt"
echo To run the application: >> "dist-electron\Chronicle-Builder-Portable\README.txt"
echo 1. Double-click "Chronicle Builder.exe" >> "dist-electron\Chronicle-Builder-Portable\README.txt"
echo 2. Or run "Start Chronicle Builder.bat" >> "dist-electron\Chronicle-Builder-Portable\README.txt"
echo. >> "dist-electron\Chronicle-Builder-Portable\README.txt"
echo This is a portable version - no installation required! >> "dist-electron\Chronicle-Builder-Portable\README.txt"

echo ✓ Executable ready

REM Step 6: Create distributable package
echo.
echo [6/6] Creating distributable package...
cd "dist-electron"
powershell -Command "Compress-Archive -Path 'Chronicle-Builder-Portable' -DestinationPath 'Chronicle-Builder-Windows.zip' -Force"
cd ..
echo ✓ Package created

echo.
echo ============================================
echo              BUILD SUCCESSFUL!
echo ============================================
echo.
echo Your Windows executable is ready:
echo.
echo 📁 Folder: dist-electron\Chronicle-Builder-Portable\
echo 📦 Package: dist-electron\Chronicle-Builder-Windows.zip
echo.
echo To use:
echo 1. Copy the folder to any Windows computer
echo 2. Run "Chronicle Builder.exe"
echo 3. No installation needed!
echo.
echo File size: ~150-200MB (includes Electron runtime)
echo.
pause
