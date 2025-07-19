# Chronicle Builder - Build Instructions

## Successfully Built ✅

Chronicle Builder has been successfully built! The Linux version is available at:

- `dist-electron/Chronicle Builder-1.0.0.AppImage` (Linux executable)

## Cross-Platform Building

### Current Limitations

You're currently on a Linux system, which can build:

- ✅ Linux: AppImage (built successfully)
- ❌ Windows: .exe (requires Windows or Wine)
- ❌ macOS: .dmg (requires macOS)

### To Build Windows .exe:

#### Option 1: Use GitHub Actions (Recommended)

Create a GitHub repository and use GitHub Actions to build for all platforms automatically.

#### Option 2: Build on Windows Machine

1. Copy the project to a Windows machine
2. Run:
   ```bash
   npm install
   npm run electron-pack
   ```
3. The .exe will be created in `dist-electron/`

#### Option 3: Use Wine on Linux (Advanced)

```bash
# Install Wine
sudo apt update
sudo apt install wine

# Then build
npm run electron-pack -- --win
```

### To Build macOS .dmg:

Must be built on macOS with:

```bash
npm install
npm run electron-pack
```

## Available Files

Current build output in `dist-electron/`:

- `Chronicle Builder-1.0.0.AppImage` - Linux executable (110MB)
- `linux-unpacked/` - Unpacked Linux app folder
- `win-unpacked/` - Unpacked Windows app folder (without installer)

## Distribution

### Linux Users:

1. Download `Chronicle Builder-1.0.0.AppImage`
2. Make it executable: `chmod +x "Chronicle Builder-1.0.0.AppImage"`
3. Run: `./Chronicle\ Builder-1.0.0.AppImage`

### Windows Users:

To create a Windows installer, you'll need to build on Windows or use cross-compilation tools.

## Build Commands Reference

```bash
# Install dependencies
npm install

# Build for current platform
npm run electron-pack

# Build for specific platform (when possible)
npx electron-builder --linux    # Linux AppImage
npx electron-builder --win      # Windows (requires Windows/Wine)
npx electron-builder --mac      # macOS (requires macOS)

# Development mode
npm run electron-dev
```

## File Structure

```
dist-electron/
├── Chronicle Builder-1.0.0.AppImage    # Linux executable
├── linux-unpacked/                     # Linux app folder
├── win-unpacked/                       # Windows app folder
└── builder-debug.yml                   # Build info
```

## Next Steps

1. **For immediate use**: Use the Linux AppImage if you're on Linux
2. **For Windows users**: Build on a Windows machine or use CI/CD
3. **For distribution**: Use GitHub Actions for automatic multi-platform builds
