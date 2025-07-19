@echo off
echo Generating basic icons for Tauri...

REM Create icons directory if it doesn't exist
mkdir "src-tauri\icons" 2>nul

REM Create placeholder icon files (Tauri will use defaults if these don't exist)
echo Creating placeholder icons...

REM Copy existing icon if available
if exist "public\assets\icon.png" (
    copy "public\assets\icon.png" "src-tauri\icons\icon.png" >nul
    echo ✓ Copied existing icon
) else (
    echo ⚠ No icon found - Tauri will use defaults
)

echo ✓ Icons setup complete
