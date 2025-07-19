@echo off
echo 🚀 Chronicle Builder - Windows Build Script
echo ==========================================

echo 📦 Installing dependencies...
call npm install

echo 🔨 Building web application...
call npm run build:client

echo 🖥️ Building Windows executable...
call npm run electron-pack

echo ✅ Build complete!
echo 📁 Your executable is in: dist-electron\
echo 🎉 Ready to distribute!

pause
