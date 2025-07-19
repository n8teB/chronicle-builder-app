@echo off
echo Manual Windows Build for Chronicle Builder...

REM Step 1: Clean everything
echo Cleaning build directories...
if exist dist rmdir /s /q dist
if exist dist-electron rmdir /s /q dist-electron
mkdir dist-electron

REM Step 2: Build client
echo Building client...
npm run build:client

REM Step 3: Use electron-packager instead of electron-builder
echo Installing electron-packager...
npm install --save-dev electron-packager

REM Step 4: Package with electron-packager
echo Packaging with electron-packager...
npx electron-packager . "Chronicle Builder" --platform=win32 --arch=x64 --out=dist-electron --overwrite --ignore="node_modules/(electron-builder|@electron)"

REM Step 5: Create portable zip
echo Creating portable package...
cd dist-electron
if exist "Chronicle Builder-win32-x64" (
    echo Renaming folder...
    ren "Chronicle Builder-win32-x64" "Chronicle-Builder-Windows"
    
    echo Creating zip file...
    powershell Compress-Archive -Path "Chronicle-Builder-Windows" -DestinationPath "Chronicle-Builder-Windows-Portable.zip"
    
    echo.
    echo ===== BUILD COMPLETE =====
    echo.
    echo Your Windows app is ready in: dist-electron\Chronicle-Builder-Windows\
    echo Portable zip: dist-electron\Chronicle-Builder-Windows-Portable.zip
    echo.
    echo To run: Extract the zip and run "Chronicle Builder.exe"
) else (
    echo Build failed - no output folder found
)

cd ..
pause
