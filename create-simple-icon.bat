@echo off
echo Creating simple icon for Tauri...

REM Create icons directory
mkdir "src-tauri\icons" 2>nul

REM Create a simple 32x32 pixel icon file using PowerShell
powershell -Command "Add-Type -AssemblyName System.Drawing; $bmp = New-Object System.Drawing.Bitmap(32, 32); $graphics = [System.Drawing.Graphics]::FromImage($bmp); $graphics.FillRectangle([System.Drawing.Brushes]::Blue, 0, 0, 32, 32); $graphics.FillRectangle([System.Drawing.Brushes]::White, 8, 8, 16, 16); $bmp.Save('src-tauri\icons\icon.png', [System.Drawing.Imaging.ImageFormat]::Png); $graphics.Dispose(); $bmp.Dispose()"

echo ✓ Created basic icon
echo Now run: npx @tauri-apps/cli icon src-tauri/icons/icon.png

pause
