@echo off
echo Direct Windows Build - Bypassing electron-builder completely
echo.

REM Build the web app first
echo Building web application...
npm run build:client

REM Install electron-prebuilt-compile as alternative
echo Installing alternative build tool...
npm install --save-dev electron-prebuilt-compile

REM Create simple build
echo Creating Windows executable...
mkdir dist-windows 2>nul

REM Use npx with electron directly
echo Using electron directly...
npx electron . --version

REM Alternative: Use electron-packager
echo Installing electron-packager...
npm install -g electron-packager

echo Packaging application...
electron-packager . "Chronicle Builder" --platform=win32 --arch=x64 --out=dist-windows --overwrite

if exist "dist-windows" (
    echo.
    echo SUCCESS! Your Windows app is in: dist-windows
    echo.
    dir dist-windows
) else (
    echo Build failed. Let's try manual method...
    
    REM Manual method
    mkdir "dist-manual\Chronicle-Builder"
    xcopy "dist\*" "dist-manual\Chronicle-Builder\app\" /E /I /Y
    copy "public\electron.cjs" "dist-manual\Chronicle-Builder\"
    
    echo.
    echo Manual build created in: dist-manual\Chronicle-Builder
    echo Copy this folder to Windows and run with: node electron.cjs
)

pause
