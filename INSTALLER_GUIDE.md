# Chronicle Builder - Windows Installer Creation Guide

## 🎯 **Create Professional Windows Installer (.exe)**

This guide helps you create a professional Windows installer that users can download and run like any commercial software.

## 🚀 **Quick Start (On Windows)**

### **Step 1: Run the Installer Builder**

```cmd
# Double-click this file:
build-windows-installer.bat

# Or run manually in Command Prompt:
npm install
npm run build:client
npx electron-builder --win --x64
```

### **Step 2: Get Your Installer**

- **Output**: `dist-electron\Chronicle Builder-1.0.0-Setup.exe`
- **Size**: ~150MB (compressed installer)
- **Type**: Professional NSIS installer

## 📦 **What the Installer Does**

### **For Users:**

1. **Download** `Chronicle Builder-1.0.0-Setup.exe`
2. **Run** the installer (may show Windows security warning - normal)
3. **Follow** installation wizard:
   - Choose installation directory
   - Select shortcuts to create
   - Install the application
4. **Launch** from Desktop or Start Menu

### **Installation Features:**

- ✅ **Professional installer wizard**
- ✅ **Custom installation directory**
- ✅ **Desktop shortcut creation**
- ✅ **Start Menu shortcuts**
- ✅ **File associations** (.chronicle files open with app)
- ✅ **Uninstaller** (appears in Control Panel)
- ✅ **Progress bar and status**
- ✅ **Windows-standard behavior**

## 🔧 **Configuration Details**

### **Installer Settings:**

```json
{
  "nsis": {
    "oneClick": false, // User can choose options
    "allowToChangeInstallationDirectory": true,
    "createDesktopShortcut": true,
    "createStartMenuShortcut": true,
    "shortcutName": "Chronicle Builder"
  }
}
```

### **File Associations:**

- **Extension**: `.chronicle`
- **Description**: "Chronicle Builder Story File"
- **Behavior**: Double-clicking .chronicle files opens Chronicle Builder

### **Installation Locations:**

- **Default**: `C:\Program Files\Chronicle Builder\`
- **Shortcuts**: Desktop, Start Menu
- **Uninstaller**: Control Panel → Programs

## 🛠️ **Troubleshooting**

### **Build Fails on Windows:**

#### **Error: "Python not found"**

```cmd
# Install Python (required for some native modules)
# Download from: https://www.python.org/downloads/
# During installation, check "Add Python to PATH"
```

#### **Error: "Visual Studio Build Tools missing"**

```cmd
# Install Windows Build Tools
npm install -g windows-build-tools

# Alternative: Install Visual Studio Community
# https://visualstudio.microsoft.com/downloads/
# Select "C++ build tools" during installation
```

#### **Error: "node-gyp failures"**

```cmd
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### **Security Warnings:**

#### **"Windows protected your PC"**

- **Cause**: Unsigned executable (no code signing certificate)
- **Solution**: Click "More info" → "Run anyway"
- **For distribution**: Consider code signing certificate ($200-400/year)

#### **Antivirus False Positives**

- **Cause**: Electron apps sometimes trigger antivirus
- **Solution**: Temporary disable antivirus during build
- **For distribution**: Submit to antivirus vendors for whitelisting

## 📋 **Distribution Guide**

### **Upload Options:**

1. **GitHub Releases** (if repository set up)

   - Professional presentation
   - Automatic download statistics
   - Version management

2. **Cloud Storage**

   - Google Drive, OneDrive, Dropbox
   - Easy sharing with download links
   - No technical setup required

3. **File Hosting Services**
   - MediaFire, WeTransfer, SendSpace
   - Direct download links
   - Good for larger files

### **User Instructions:**

Include these with your installer:

```
Chronicle Builder Installation Instructions
==========================================

1. Download: Chronicle Builder-1.0.0-Setup.exe
2. Run: Double-click the installer file
3. Install: Follow the installation wizard
4. Launch: Use Desktop shortcut or Start Menu

System Requirements:
- Windows 10 or later
- 4GB RAM minimum
- 200MB free disk space

Note: Windows may show a security warning.
Click "More info" then "Run anyway" to proceed.
Chronicle Builder is completely safe.
```

## 🎯 **Advanced Customization**

### **Custom Installer Icon:**

The installer uses your app icon automatically from `public/assets/icon.png`.

### **Custom Welcome Message:**

Edit `build/installer.nsh` to customize:

```nsis
!macro customInit
  MessageBox MB_YESNO "Custom welcome message here!" IDYES continue IDNO abort
  abort:
    Quit
  continue:
!macroend
```

### **Additional Shortcuts:**

Modify `customCreateShortcuts` in `build/installer.nsh`:

```nsis
CreateShortCut "$DESKTOP\My Custom Shortcut.lnk" "$INSTDIR\Chronicle Builder.exe"
```

## 🚀 **Alternative: Online Installer Builder**

If local building fails, use GitHub Actions:

1. **Push code** to GitHub repository
2. **Create release tag**: `git tag v1.0.0 && git push origin v1.0.0`
3. **Download installer** from GitHub Actions artifacts
4. **Professional cross-platform builds** automatically

## 🎉 **You're Ready!**

Once you run `build-windows-installer.bat` successfully:

- ✅ **Professional installer created**
- ✅ **Ready for distribution**
- ✅ **Windows-standard installation experience**
- ✅ **Proper uninstallation support**

Your Chronicle Builder installer will provide users with a professional, familiar installation experience just like any commercial software! 🚀

## 📞 **Support**

If you encounter issues:

1. Check the troubleshooting section above
2. Ensure you're running on Windows (required for installer creation)
3. Verify all prerequisites are installed
4. Consider using GitHub Actions for automated builds

Happy distributing! 🎯
