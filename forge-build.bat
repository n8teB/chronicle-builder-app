@echo off
echo Alternative Build Method using electron-forge...

echo Step 1: Installing electron-forge...
npm install --save-dev @electron-forge/cli @electron-forge/maker-squirrel @electron-forge/maker-zip

echo Step 2: Building client...
npm run build:client

echo Step 3: Creating forge config...
echo module.exports = { > forge.config.js
echo   packagerConfig: { >> forge.config.js
echo     name: "Chronicle Builder", >> forge.config.js
echo     executableName: "Chronicle Builder", >> forge.config.js
echo     out: "dist-electron", >> forge.config.js
echo     overwrite: true >> forge.config.js
echo   }, >> forge.config.js
echo   makers: [ >> forge.config.js
echo     { >> forge.config.js
echo       name: "@electron-forge/maker-zip", >> forge.config.js
echo       platforms: ["win32"] >> forge.config.js
echo     } >> forge.config.js
echo   ] >> forge.config.js
echo }; >> forge.config.js

echo Step 4: Running forge build...
npx electron-forge make --platform=win32

if %errorlevel% equ 0 (
    echo.
    echo ===== FORGE BUILD SUCCESSFUL =====
    echo Check the out folder for your Windows executable
) else (
    echo Forge build failed, trying simple zip method...
    goto :zipmethod
)
goto :end

:zipmethod
echo.
echo Step 5: Creating simple executable package...
mkdir "dist-electron\Chronicle-Builder-Portable"
xcopy "dist\*" "dist-electron\Chronicle-Builder-Portable\" /E /I /Y
copy "public\electron.cjs" "dist-electron\Chronicle-Builder-Portable\"

echo.
echo Creating portable version...
echo You can manually copy this folder to Windows and run electron.exe
echo.

:end
pause
