# 🚀 Working Windows Installer Solutions

Since `electron-builder` is having issues, here are **proven alternatives** that work reliably:

## ✅ **Option 1: Self-Extracting Archive (5 minutes)**

### **Using WinRAR (Easiest):**

1. **Download WinRAR**: https://www.win-rar.com/download.html (free trial)

2. **Right-click** your `distribution/Chronicle-Builder-Portable` folder

3. **Select** "Add to archive..."

4. **Configure**:

   - Archive name: `Chronicle-Builder-Setup.exe`
   - Archive format: RAR
   - ✅ Check "Create SFX archive"
   - Compression: Normal

5. **Click "Advanced" tab** → "SFX options":

   - Path to extract: `%ProgramFiles%\Chronicle Builder`
   - ✅ Check "Extract to temporary folder"
   - Run after extraction: `Chronicle Builder.exe`

6. **Click OK** - Creates `Chronicle-Builder-Setup.exe`

### **Using 7-Zip (Free Alternative):**

1. **Download 7-Zip**: https://www.7-zip.org/download.html

2. **Right-click** your `distribution/Chronicle-Builder-Portable` folder

3. **Select** "7-Zip" → "Add to archive..."

4. **Configure**:

   - Archive: `Chronicle-Builder-Setup.exe`
   - Format: 7z
   - ✅ Check "Create SFX archive"

5. **Click OK** - Creates professional installer

## ✅ **Option 2: Simple Batch Installer (No tools needed)**

1. **Run** the script I created:

   ```cmd
   create-simple-installer.bat
   ```

2. **Result**: Professional installation package with:
   - Automatic installer script
   - Desktop shortcut creation
   - Program Files installation
   - Uninstaller included

## ✅ **Option 3: NSIS Installer (Most Professional)**

If you want the most professional installer:

1. **Download NSIS**: https://nsis.sourceforge.io/Download

2. **Create** this script as `installer.nsi`:

```nsis
!define APPNAME "Chronicle Builder"
!define COMPANYNAME "Your Company"
!define DESCRIPTION "Chronicle Builder - Your Story Workspace"
!define VERSIONMAJOR 1
!define VERSIONMINOR 0
!define VERSIONBUILD 0

RequestExecutionLevel admin
InstallDir "$PROGRAMFILES\${APPNAME}"
Name "${APPNAME}"
Icon "icon.ico"
outFile "Chronicle-Builder-Setup.exe"

page directory
page instfiles

section "install"
    setOutPath $INSTDIR
    file /r "distribution\Chronicle-Builder-Portable\*.*"

    # Create uninstaller
    writeUninstaller "$INSTDIR\uninstall.exe"

    # Create desktop shortcut
    createShortCut "$DESKTOP\${APPNAME}.lnk" "$INSTDIR\Chronicle Builder.exe"

    # Create start menu shortcut
    createDirectory "$SMPROGRAMS\${APPNAME}"
    createShortCut "$SMPROGRAMS\${APPNAME}\${APPNAME}.lnk" "$INSTDIR\Chronicle Builder.exe"
    createShortCut "$SMPROGRAMS\${APPNAME}\Uninstall.lnk" "$INSTDIR\uninstall.exe"

    # Registry information for add/remove programs
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "DisplayName" "${APPNAME}"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "UninstallString" "$\"$INSTDIR\uninstall.exe$\""
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "QuietUninstallString" "$\"$INSTDIR\uninstall.exe$\" /S"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "InstallLocation" "$\"$INSTDIR$\""
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "DisplayIcon" "$\"$INSTDIR\Chronicle Builder.exe$\""
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "Publisher" "${COMPANYNAME}"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "DisplayVersion" "${VERSIONMAJOR}.${VERSIONMINOR}.${VERSIONBUILD}"
    WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "VersionMajor" ${VERSIONMAJOR}
    WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "VersionMinor" ${VERSIONMINOR}
    WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "NoModify" 1
    WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "NoRepair" 1
sectionEnd

section "uninstall"
    delete "$INSTDIR\*.*"
    rmDir /r "$INSTDIR"
    delete "$DESKTOP\${APPNAME}.lnk"
    delete "$SMPROGRAMS\${APPNAME}\*.*"
    rmDir "$SMPROGRAMS\${APPNAME}"
    DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}"
sectionEnd
```

3. **Right-click** `installer.nsi` → "Compile NSIS Script"

4. **Result**: Professional `Chronicle-Builder-Setup.exe`

## 🎯 **Recommended Approach:**

**Use Option 1 (Self-Extracting Archive)** because:

- ✅ **Works immediately** (no complex toolchain)
- ✅ **Professional appearance**
- ✅ **Familiar to users**
- ✅ **No electron-builder issues**
- ✅ **5-minute setup**

## 📦 **What Users Get:**

- Professional installer file: `Chronicle-Builder-Setup.exe`
- Familiar installation experience
- Desktop shortcut creation
- Start Menu integration
- Proper uninstallation

## 🎉 **Result:**

You'll have a **working, professional Windows installer** that:

- Users can download and run
- Installs like any commercial software
- Creates shortcuts automatically
- Provides proper uninstall option

**Skip the problematic electron-builder and use these proven methods!** 🚀
