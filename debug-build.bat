@echo off
echo Chronicle Builder Build Diagnostics...

echo.
echo === SYSTEM INFO ===
node --version
npm --version
echo.

echo === CHECKING ELECTRON-BUILDER ===
npm list electron-builder
echo.

echo === CHECKING FILES ===
if exist "public\electron.cjs" (
    echo ✓ electron.cjs found
) else (
    echo ✗ electron.cjs missing
)

if exist "dist" (
    echo ✓ dist folder found
) else (
    echo ✗ dist folder missing
)

echo.
echo === TRYING DIFFERENT BUILD METHODS ===

echo Method 1: Basic rebuild...
npm run build:client
if %errorlevel% neq 0 (
    echo ✗ Client build failed
    goto :method2
)
echo ✓ Client build successful

:method2
echo.
echo Method 2: Force rebuild electron-builder...
npm rebuild electron-builder
npx electron-builder --win --publish=never
if %errorlevel% neq 0 (
    echo ✗ Standard build failed
    goto :method3
)
echo ✓ Standard build successful
goto :success

:method3
echo.
echo Method 3: Using older electron-builder syntax...
npx electron-builder build --win --x64
if %errorlevel% neq 0 (
    echo ✗ Legacy build failed
    goto :method4
)
echo ✓ Legacy build successful
goto :success

:method4
echo.
echo Method 4: Manual webpack build...
npx webpack --mode production
npx electron-builder --win
if %errorlevel% neq 0 (
    echo ✗ Manual build failed
    goto :failure
)
echo ✓ Manual build successful
goto :success

:success
echo.
echo === BUILD SUCCESSFUL ===
echo Check dist-electron folder for your executable
goto :end

:failure
echo.
echo === ALL METHODS FAILED ===
echo Try the portable zip method instead
echo.

:end
pause
