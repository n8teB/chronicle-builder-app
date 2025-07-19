@echo off
echo Chronicle Builder - Final Working Solution
echo =====================================

REM Check what we have
echo Checking existing build files...

if exist "dist-electron\win-unpacked" (
    echo ✓ Found existing Windows build!
    goto :package_existing
)

if exist "dist" (
    echo ✓ Found web build, creating simple package...
    goto :create_simple
)

echo No existing build found. Building web app first...
npm run build:client
goto :create_simple

:package_existing
echo.
echo Packaging existing Windows build...
cd dist-electron

REM Copy and rename
if exist "Chronicle-Builder-Final" rmdir /s /q "Chronicle-Builder-Final"
xcopy "win-unpacked\*" "Chronicle-Builder-Final\" /E /I /Y

REM Add launcher
echo @echo off > "Chronicle-Builder-Final\Launch.bat"
echo start "" "Chronicle Builder.exe" >> "Chronicle-Builder-Final\Launch.bat"

REM Create zip
powershell -Command "Compress-Archive -Path 'Chronicle-Builder-Final' -DestinationPath 'Chronicle-Builder-READY.zip' -Force"

echo.
echo ✓ READY! Your Windows app: dist-electron\Chronicle-Builder-READY.zip
cd ..
goto :done

:create_simple
echo.
echo Creating simple portable version...

REM Create web-based version
mkdir "Chronicle-Builder-Web" 2>nul
xcopy "dist\*" "Chronicle-Builder-Web\" /E /I /Y

REM Create simple HTML launcher
echo ^<!DOCTYPE html^> > "Chronicle-Builder-Web\launch.html"
echo ^<html^>^<head^>^<title^>Chronicle Builder^</title^>^</head^> >> "Chronicle-Builder-Web\launch.html"
echo ^<body style="margin:0"^> >> "Chronicle-Builder-Web\launch.html"
echo ^<iframe src="index.html" style="width:100%%;height:100vh;border:none"^>^</iframe^> >> "Chronicle-Builder-Web\launch.html"
echo ^</body^>^</html^> >> "Chronicle-Builder-Web\launch.html"

REM Create batch launcher
echo @echo off > "Chronicle-Builder-Web\Start Chronicle Builder.bat"
echo echo Starting Chronicle Builder... >> "Chronicle-Builder-Web\Start Chronicle Builder.bat"
echo start "" "launch.html" >> "Chronicle-Builder-Web\Start Chronicle Builder.bat"

REM Create zip
powershell -Command "Compress-Archive -Path 'Chronicle-Builder-Web' -DestinationPath 'Chronicle-Builder-Web-READY.zip' -Force"

echo.
echo ✓ READY! Web version: Chronicle-Builder-Web-READY.zip

:done
echo.
echo ========================================
echo              SUCCESS!
echo ========================================
echo.
echo Your app is ready to distribute!
echo.
echo Instructions for users:
echo 1. Extract the zip file
echo 2. Run the .bat file or .exe file
echo 3. Chronicle Builder will start!
echo.
pause
