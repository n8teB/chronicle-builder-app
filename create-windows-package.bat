@echo off
setlocal enabledelayedexpansion

echo 📦 Chronicle Builder - Windows Package Creator
echo ============================================

REM Check if PowerShell is available for compression
powershell -command "Get-Command Compress-Archive" >nul 2>&1
if %errorlevel% equ 0 (
    set "HAS_POWERSHELL=1"
) else (
    set "HAS_POWERSHELL=0"
)

echo 📁 Creating distribution packages...

REM Create distribution directory
if not exist "distribution" mkdir distribution

REM Package 1: Simple folder copy
echo 🔄 Creating portable folder package...
if exist "distribution\Chronicle-Builder-Portable" rmdir /s /q "distribution\Chronicle-Builder-Portable"
mkdir "distribution\Chronicle-Builder-Portable"
xcopy "dist-electron\win-unpacked\*" "distribution\Chronicle-Builder-Portable\" /E /I /H /Y

REM Create run script
echo @echo off > "distribution\Chronicle-Builder-Portable\Run Chronicle Builder.bat"
echo echo Starting Chronicle Builder... >> "distribution\Chronicle-Builder-Portable\Run Chronicle Builder.bat"
echo start "" "Chronicle Builder.exe" >> "distribution\Chronicle-Builder-Portable\Run Chronicle Builder.bat"

REM Create README
echo Chronicle Builder - Portable Version > "distribution\Chronicle-Builder-Portable\README.txt"
echo ====================================== >> "distribution\Chronicle-Builder-Portable\README.txt"
echo. >> "distribution\Chronicle-Builder-Portable\README.txt"
echo Double-click "Chronicle Builder.exe" to start the application. >> "distribution\Chronicle-Builder-Portable\README.txt"
echo. >> "distribution\Chronicle-Builder-Portable\README.txt"
echo Alternative: Double-click "Run Chronicle Builder.bat" >> "distribution\Chronicle-Builder-Portable\README.txt"
echo. >> "distribution\Chronicle-Builder-Portable\README.txt"
echo No installation required! >> "distribution\Chronicle-Builder-Portable\README.txt"
echo This is a portable version - copy the entire folder to any location. >> "distribution\Chronicle-Builder-Portable\README.txt"
echo. >> "distribution\Chronicle-Builder-Portable\README.txt"
echo System Requirements: >> "distribution\Chronicle-Builder-Portable\README.txt"
echo - Windows 10 or later >> "distribution\Chronicle-Builder-Portable\README.txt"
echo - 4GB RAM minimum >> "distribution\Chronicle-Builder-Portable\README.txt"
echo - 200MB free disk space >> "distribution\Chronicle-Builder-Portable\README.txt"

echo ✅ Portable folder created: distribution\Chronicle-Builder-Portable\

REM Package 2: ZIP file (if PowerShell available)
if "%HAS_POWERSHELL%"=="1" (
    echo 🗜️ Creating ZIP package...
    powershell -command "Compress-Archive -Path 'distribution\Chronicle-Builder-Portable\*' -DestinationPath 'distribution\Chronicle-Builder-v1.0.0-Windows.zip' -Force"
    echo ✅ ZIP package created: distribution\Chronicle-Builder-v1.0.0-Windows.zip
) else (
    echo ⚠️ PowerShell not available - ZIP creation skipped
    echo 💡 You can manually zip the Chronicle-Builder-Portable folder
)

REM Package 3: Self-extracting archive instructions
echo 📄 Creating self-extracting archive instructions...
echo Creating Self-Extracting Archive > "distribution\Create-Self-Extracting-Archive.txt"
echo ================================= >> "distribution\Create-Self-Extracting-Archive.txt"
echo. >> "distribution\Create-Self-Extracting-Archive.txt"
echo To create a self-extracting .exe installer: >> "distribution\Create-Self-Extracting-Archive.txt"
echo. >> "distribution\Create-Self-Extracting-Archive.txt"
echo Option 1 - Using WinRAR: >> "distribution\Create-Self-Extracting-Archive.txt"
echo 1. Install WinRAR from winrar.com >> "distribution\Create-Self-Extracting-Archive.txt"
echo 2. Right-click Chronicle-Builder-Portable folder >> "distribution\Create-Self-Extracting-Archive.txt"
echo 3. Select "Add to archive..." >> "distribution\Create-Self-Extracting-Archive.txt"
echo 4. Check "Create SFX archive" >> "distribution\Create-Self-Extracting-Archive.txt"
echo 5. Set name to "Chronicle-Builder-Setup.exe" >> "distribution\Create-Self-Extracting-Archive.txt"
echo 6. Click OK >> "distribution\Create-Self-Extracting-Archive.txt"
echo. >> "distribution\Create-Self-Extracting-Archive.txt"
echo Option 2 - Using 7-Zip: >> "distribution\Create-Self-Extracting-Archive.txt"
echo 1. Install 7-Zip from 7-zip.org >> "distribution\Create-Self-Extracting-Archive.txt"
echo 2. Right-click Chronicle-Builder-Portable folder >> "distribution\Create-Self-Extracting-Archive.txt"
echo 3. Select "7-Zip" ^> "Add to archive..." >> "distribution\Create-Self-Extracting-Archive.txt"
echo 4. Change "Archive format" to "7z" >> "distribution\Create-Self-Extracting-Archive.txt"
echo 5. Check "Create SFX archive" >> "distribution\Create-Self-Extracting-Archive.txt"
echo 6. Set archive name to "Chronicle-Builder-Setup.exe" >> "distribution\Create-Self-Extracting-Archive.txt"
echo 7. Click OK >> "distribution\Create-Self-Extracting-Archive.txt"

echo.
echo 🎉 Windows distribution packages created!
echo.
echo 📁 Available packages in "distribution" folder:
echo   ✅ Chronicle-Builder-Portable\          (Ready-to-run folder)
if "%HAS_POWERSHELL%"=="1" (
    echo   ✅ Chronicle-Builder-v1.0.0-Windows.zip  (ZIP download)
)
echo   📄 Create-Self-Extracting-Archive.txt  (Instructions for .exe installer)
echo.
echo 🚀 Distribution options:
echo   📱 Portable: Copy folder to any Windows PC and run
echo   💾 ZIP: Upload to cloud storage for download
echo   🔧 Self-extracting: Follow instructions to create .exe installer
echo.
echo 💡 The portable version works immediately - no installation needed!

pause
