@echo off
echo Packaging your existing Windows build...

echo Checking for existing build...
if exist "dist-electron\win-unpacked" (
    echo ✓ Found existing Windows build!
    
    echo Creating distributable package...
    cd dist-electron
    
    REM Rename folder for clarity
    if exist "Chronicle-Builder-Windows" rmdir /s /q "Chronicle-Builder-Windows"
    ren "win-unpacked" "Chronicle-Builder-Windows"
    
    REM Create launcher
    echo @echo off > "Chronicle-Builder-Windows\Start Chronicle Builder.bat"
    echo start "" "Chronicle Builder.exe" >> "Chronicle-Builder-Windows\Start Chronicle Builder.bat"
    
    REM Create README
    echo Chronicle Builder - Windows Version > "Chronicle-Builder-Windows\README.txt"
    echo. >> "Chronicle-Builder-Windows\README.txt"
    echo To run: Double-click "Chronicle Builder.exe" >> "Chronicle-Builder-Windows\README.txt"
    echo No installation required! >> "Chronicle-Builder-Windows\README.txt"
    
    REM Create zip
    powershell -Command "Compress-Archive -Path 'Chronicle-Builder-Windows' -DestinationPath 'Chronicle-Builder-Windows-Ready.zip' -Force"
    
    cd ..
    
    echo.
    echo ========================================
    echo           SUCCESS!
    echo ========================================
    echo.
    echo Your Windows executable is ready:
    echo 📁 dist-electron\Chronicle-Builder-Windows\
    echo 📦 dist-electron\Chronicle-Builder-Windows-Ready.zip
    echo.
    echo The app is ready to distribute!
    
) else (
    echo ✗ No existing build found
    echo Run the guaranteed-build.bat script instead
)

pause
