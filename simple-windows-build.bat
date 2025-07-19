@echo off
echo Simple Windows Build - Bypassing electron-builder...

REM Clean and build
echo Cleaning directories...
if exist dist-electron rmdir /s /q dist-electron
mkdir dist-electron

echo Building client...
npm run build:client

echo.
echo Creating portable Windows app...

REM Create the portable app directory
mkdir "dist-electron\Chronicle-Builder-Windows"

REM Copy the built web app
echo Copying web application...
xcopy "dist\*" "dist-electron\Chronicle-Builder-Windows\app\" /E /I /Y

REM Copy electron files
echo Copying electron files...
copy "public\electron.cjs" "dist-electron\Chronicle-Builder-Windows\"
if exist "public\preload.cjs" copy "public\preload.cjs" "dist-electron\Chronicle-Builder-Windows\"
if exist "public\assets" xcopy "public\assets\*" "dist-electron\Chronicle-Builder-Windows\assets\" /E /I /Y

REM Download and extract electron for Windows
echo Downloading Electron for Windows...
powershell -Command "& {Invoke-WebRequest -Uri 'https://github.com/electron/electron/releases/download/v28.0.0/electron-v28.0.0-win32-x64.zip' -OutFile 'electron-win.zip'}"

echo Extracting Electron...
powershell -Command "& {Expand-Archive -Path 'electron-win.zip' -DestinationPath 'dist-electron\Chronicle-Builder-Windows\' -Force}"

REM Rename electron.exe to Chronicle Builder.exe
echo Renaming executable...
cd "dist-electron\Chronicle-Builder-Windows"
if exist "electron.exe" ren "electron.exe" "Chronicle Builder.exe"
cd ..\..

REM Create a package.json for the app
echo Creating package.json...
echo { > "dist-electron\Chronicle-Builder-Windows\package.json"
echo   "name": "chronicle-builder", >> "dist-electron\Chronicle-Builder-Windows\package.json"
echo   "version": "1.0.0", >> "dist-electron\Chronicle-Builder-Windows\package.json"
echo   "main": "electron.cjs" >> "dist-electron\Chronicle-Builder-Windows\package.json"
echo } >> "dist-electron\Chronicle-Builder-Windows\package.json"

REM Create batch file for easy launching
echo Creating launcher...
echo @echo off > "dist-electron\Chronicle-Builder-Windows\Launch Chronicle Builder.bat"
echo start "" "Chronicle Builder.exe" >> "dist-electron\Chronicle-Builder-Windows\Launch Chronicle Builder.bat"

REM Create zip package
echo Creating zip package...
cd dist-electron
powershell -Command "& {Compress-Archive -Path 'Chronicle-Builder-Windows' -DestinationPath 'Chronicle-Builder-Windows-Portable.zip' -Force}"
cd ..

REM Cleanup
echo Cleaning up...
del electron-win.zip

echo.
echo ===== BUILD COMPLETE =====
echo.
echo Your Windows app is ready!
echo.
echo Location: dist-electron\Chronicle-Builder-Windows\
echo Zip file: dist-electron\Chronicle-Builder-Windows-Portable.zip
echo.
echo To run:
echo 1. Extract the zip file on Windows
echo 2. Run "Chronicle Builder.exe" or "Launch Chronicle Builder.bat"
echo.
echo The app is completely portable and doesn't need installation!
echo.

pause
