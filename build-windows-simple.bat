@echo off
echo Building Chronicle Builder for Windows (Simple Method)...

REM Build the client first
echo Step 1: Building client...
npm run build:client

REM Use electron-builder with specific Windows target
echo Step 2: Building Windows executable...
npx electron-builder --win --x64

REM Alternative: Build portable version
echo Step 3: Creating portable version...
npx electron-builder --win --x64 --config.nsis.oneClick=false --config.portable=true

echo Build complete!
echo Check dist-electron folder for:
echo - Chronicle Builder-1.0.0-Setup.exe (installer)
echo - Chronicle Builder 1.0.0.exe (portable)

pause
