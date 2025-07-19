@echo off
echo 🚀 Chronicle Builder - Simple Installer Creator
echo =============================================

echo 📁 Using existing executable to create installer...

REM Check if we have the portable version
if exist "distribution\Chronicle-Builder-Portable\Chronicle Builder.exe" (
    echo ✅ Found existing portable version
    set "SOURCE_DIR=distribution\Chronicle-Builder-Portable"
) else if exist "dist-electron\win-unpacked\Chronicle Builder.exe" (
    echo ✅ Found dist-electron version
    set "SOURCE_DIR=dist-electron\win-unpacked"
) else (
    echo ❌ No existing executable found
    echo 💡 Please run the project first to generate the executable
    pause
    exit /b 1
)

echo 🔄 Creating installer package...

REM Create installer directory
if not exist "installer-package" mkdir "installer-package"
if exist "installer-package\Chronicle-Builder" rmdir /s /q "installer-package\Chronicle-Builder"
mkdir "installer-package\Chronicle-Builder"

echo 📦 Copying application files...
xcopy "%SOURCE_DIR%\*" "installer-package\Chronicle-Builder\" /E /I /H /Y

echo 📝 Creating installer script...
echo @echo off > "installer-package\Install Chronicle Builder.bat"
echo echo Chronicle Builder Installer >> "installer-package\Install Chronicle Builder.bat"
echo echo ========================== >> "installer-package\Install Chronicle Builder.bat"
echo echo. >> "installer-package\Install Chronicle Builder.bat"
echo echo Installing Chronicle Builder to Program Files... >> "installer-package\Install Chronicle Builder.bat"
echo echo. >> "installer-package\Install Chronicle Builder.bat"
echo set "INSTALL_DIR=%%ProgramFiles%%\Chronicle Builder" >> "installer-package\Install Chronicle Builder.bat"
echo if not exist "%%INSTALL_DIR%%" mkdir "%%INSTALL_DIR%%" >> "installer-package\Install Chronicle Builder.bat"
echo xcopy "Chronicle-Builder\*" "%%INSTALL_DIR%%\" /E /I /H /Y >> "installer-package\Install Chronicle Builder.bat"
echo echo ✅ Installation complete! >> "installer-package\Install Chronicle Builder.bat"
echo echo. >> "installer-package\Install Chronicle Builder.bat"
echo echo Creating desktop shortcut... >> "installer-package\Install Chronicle Builder.bat"
echo powershell -command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%%USERPROFILE%%\Desktop\Chronicle Builder.lnk'); $Shortcut.TargetPath = '%%INSTALL_DIR%%\Chronicle Builder.exe'; $Shortcut.Save()" >> "installer-package\Install Chronicle Builder.bat"
echo echo ✅ Desktop shortcut created! >> "installer-package\Install Chronicle Builder.bat"
echo echo. >> "installer-package\Install Chronicle Builder.bat"
echo echo Chronicle Builder has been installed successfully! >> "installer-package\Install Chronicle Builder.bat"
echo echo You can now run it from the desktop shortcut. >> "installer-package\Install Chronicle Builder.bat"
echo pause >> "installer-package\Install Chronicle Builder.bat"

echo 📝 Creating uninstaller...
echo @echo off > "installer-package\Uninstall Chronicle Builder.bat"
echo echo Chronicle Builder Uninstaller >> "installer-package\Uninstall Chronicle Builder.bat"
echo echo ============================= >> "installer-package\Uninstall Chronicle Builder.bat"
echo echo. >> "installer-package\Uninstall Chronicle Builder.bat"
echo set /p "confirm=Are you sure you want to uninstall Chronicle Builder? (Y/N): " >> "installer-package\Uninstall Chronicle Builder.bat"
echo if /i "%%confirm%%" neq "Y" exit /b >> "installer-package\Uninstall Chronicle Builder.bat"
echo echo. >> "installer-package\Uninstall Chronicle Builder.bat"
echo echo Removing Chronicle Builder... >> "installer-package\Uninstall Chronicle Builder.bat"
echo if exist "%%ProgramFiles%%\Chronicle Builder" rmdir /s /q "%%ProgramFiles%%\Chronicle Builder" >> "installer-package\Uninstall Chronicle Builder.bat"
echo if exist "%%USERPROFILE%%\Desktop\Chronicle Builder.lnk" del "%%USERPROFILE%%\Desktop\Chronicle Builder.lnk" >> "installer-package\Uninstall Chronicle Builder.bat"
echo echo ✅ Chronicle Builder has been uninstalled! >> "installer-package\Uninstall Chronicle Builder.bat"
echo pause >> "installer-package\Uninstall Chronicle Builder.bat"

echo 📄 Creating installation instructions...
echo Chronicle Builder Installation Package > "installer-package\README.txt"
echo ==================================== >> "installer-package\README.txt"
echo. >> "installer-package\README.txt"
echo INSTALLATION INSTRUCTIONS: >> "installer-package\README.txt"
echo. >> "installer-package\README.txt"
echo 1. Right-click "Install Chronicle Builder.bat" >> "installer-package\README.txt"
echo 2. Select "Run as administrator" >> "installer-package\README.txt"
echo 3. Follow the installation prompts >> "installer-package\README.txt"
echo 4. Chronicle Builder will be installed to Program Files >> "installer-package\README.txt"
echo 5. A desktop shortcut will be created >> "installer-package\README.txt"
echo. >> "installer-package\README.txt"
echo MANUAL INSTALLATION (Alternative): >> "installer-package\README.txt"
echo. >> "installer-package\README.txt"
echo 1. Copy the "Chronicle-Builder" folder to any location >> "installer-package\README.txt"
echo 2. Double-click "Chronicle Builder.exe" to run >> "installer-package\README.txt"
echo 3. No installation required for manual method >> "installer-package\README.txt"
echo. >> "installer-package\README.txt"
echo UNINSTALLATION: >> "installer-package\README.txt"
echo. >> "installer-package\README.txt"
echo Run "Uninstall Chronicle Builder.bat" as administrator >> "installer-package\README.txt"
echo. >> "installer-package\README.txt"
echo SYSTEM REQUIREMENTS: >> "installer-package\README.txt"
echo - Windows 10 or later >> "installer-package\README.txt"
echo - 4GB RAM minimum >> "installer-package\README.txt"
echo - 200MB free disk space >> "installer-package\README.txt"

echo ✅ Simple installer package created!
echo.
echo 📁 Package location: installer-package\
echo.
echo 📦 Package contents:
echo   ✅ Chronicle-Builder\ (Complete application)
echo   ✅ Install Chronicle Builder.bat (Installer script)
echo   ✅ Uninstall Chronicle Builder.bat (Uninstaller)
echo   ✅ README.txt (Installation instructions)
echo.
echo 🚀 Distribution options:
echo   📱 ZIP the entire "installer-package" folder
echo   💾 Upload to cloud storage
echo   📧 Share with users
echo.
echo 💡 Users can:
echo   - Run installer for full installation
echo   - Or use Chronicle-Builder folder directly (portable)
echo.
echo 🎉 Your installation package is ready!

pause
