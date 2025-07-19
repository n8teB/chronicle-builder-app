@echo off
echo Fixing Chronicle Builder build issues...

REM Clear npm cache
echo Clearing npm cache...
npm cache clean --force

REM Remove node_modules and package-lock
echo Removing node_modules...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

REM Clear dist folders
echo Clearing build directories...
if exist dist rmdir /s /q dist
if exist dist-electron rmdir /s /q dist-electron

REM Reinstall dependencies
echo Reinstalling dependencies...
npm install

REM Rebuild client
echo Building client...
npm run build:client

REM Build electron for Windows
echo Building Windows executable...
npm run electron-pack

echo Build complete! Check dist-electron folder for your executable.
pause
