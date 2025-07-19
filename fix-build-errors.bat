@echo off
echo 🔧 Chronicle Builder - Fix Build Errors
echo ======================================

echo 🧹 Step 1: Cleaning old build files...
if exist "node_modules" (
    echo Removing node_modules...
    rmdir /s /q "node_modules"
)

if exist "dist" (
    echo Removing dist...
    rmdir /s /q "dist"
)

if exist "dist-electron" (
    echo Removing dist-electron...
    rmdir /s /q "dist-electron"
)

if exist "package-lock.json" (
    echo Removing package-lock.json...
    del "package-lock.json"
)

echo ✅ Cleanup complete

echo 📦 Step 2: Clearing npm cache...
npm cache clean --force

echo ✅ Cache cleared

echo 📥 Step 3: Fresh install of dependencies...
npm install

echo ✅ Dependencies installed

echo 🔨 Step 4: Building web application...
npm run build:client

echo ✅ Web app built

echo 🖥️ Step 5: Building Windows installer (attempt 1)...
npx electron-builder --win --x64 --config.compression=store
if %errorlevel% equ 0 (
    echo ✅ Build successful!
    goto success
)

echo ⚠️ First attempt failed, trying alternative method...

echo 🖥️ Step 6: Building with different compression...
npx electron-builder --win --x64 --config.nsis.oneClick=false --config.compression=normal
if %errorlevel% equ 0 (
    echo ✅ Build successful!
    goto success
)

echo ⚠️ Second attempt failed, trying portable version...

echo 🖥️ Step 7: Building portable version...
npx electron-builder --win --x64 --config.win.target=portable
if %errorlevel% equ 0 (
    echo ✅ Portable build successful!
    goto success
)

echo ❌ All build attempts failed
echo 💡 Try the manual fixes below
goto end

:success
echo 🎉 Build completed successfully!
echo 📁 Check dist-electron folder for your installer

:end
echo.
echo 🔧 If build still fails, try these manual fixes:
echo 1. Install Windows Build Tools: npm install -g windows-build-tools
echo 2. Install Python: https://www.python.org/downloads/
echo 3. Install Visual Studio Build Tools
echo 4. Restart computer and try again
echo.
pause
