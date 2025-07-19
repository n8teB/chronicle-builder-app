@echo off
echo Quick Icon Fix for Tauri...

echo Step 1: Creating icons directory...
mkdir "src-tauri\icons" 2>nul

echo Step 2: Checking for existing icon...
if exist "public\assets\icon.png" (
    echo Found existing icon, copying...
    copy "public\assets\icon.png" "src-tauri\icons\icon.png" >nul
    echo Step 3: Generating all icon formats with Tauri...
    npx @tauri-apps/cli icon "src-tauri\icons\icon.png"
) else (
    echo No existing icon found. Creating simple default...
    echo Step 3: Downloading default icon...
    powershell -Command "Invoke-WebRequest -Uri 'https://via.placeholder.com/512x512/4F46E5/FFFFFF/png?text=CB' -OutFile 'src-tauri\icons\icon.png'"
    echo Step 4: Generating all icon formats...
    npx @tauri-apps/cli icon "src-tauri\icons\icon.png"
)

if %errorlevel% equ 0 (
    echo ✅ Icons generated successfully!
    echo Now try: npx @tauri-apps/cli build
) else (
    echo ❌ Icon generation failed
    echo Manual fix: Put any 512x512 PNG file in src-tauri\icons\icon.png
    echo Then run: npx @tauri-apps/cli icon src-tauri\icons\icon.png
)

pause
