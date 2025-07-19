# Building Windows .exe for Chronicle Builder

## 🚨 Current Issue

You're trying to build a Windows .exe on a Linux system, which requires cross-compilation tools. Here are your options:

## ✅ **Solution 1: Use GitHub Actions (Recommended)**

Create automatic builds for all platforms using GitHub Actions:

### Step 1: Create GitHub Repository

```bash
git init
git add .
git commit -m "Initial commit"
gh repo create chronicle-builder --public
git push -u origin main
```

### Step 2: Create GitHub Actions Workflow

Create `.github/workflows/build.yml`:

```yaml
name: Build Desktop Apps

on:
  push:
    tags:
      - "v*"
  workflow_dispatch:

jobs:
  build:
    runs-on: ${{ matrix.os }}

    strategy:
      matrix:
        os: [windows-latest, macos-latest, ubuntu-latest]

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm install

      - name: Build app
        run: npm run electron-pack

      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: ${{ matrix.os }}-build
          path: dist-electron/
```

### Step 3: Trigger Build

- Push a tag: `git tag v1.0.0 && git push origin v1.0.0`
- Or manually trigger in GitHub Actions tab
- Download .exe from the artifacts

## ✅ **Solution 2: Build on Windows Machine**

### Option A: Windows Computer

1. Copy project to Windows machine
2. Run:
   ```cmd
   npm install
   npm run electron-pack
   ```
3. Find .exe in `dist-electron/`

### Option B: Windows VM

1. Install VirtualBox/VMware
2. Create Windows 10/11 VM
3. Install Node.js in VM
4. Copy project and build

### Option C: Cloud Windows Instance

1. Use AWS/Azure Windows instance
2. Install Node.js and Git
3. Clone project and build

## ✅ **Solution 3: Docker with Wine (Advanced)**

Create `Dockerfile.windows`:

```dockerfile
FROM electronuserland/builder:wine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run electron-pack -- --win
```

Build:

```bash
docker build -f Dockerfile.windows -t chronicle-builder-win .
docker run --rm -v $(pwd)/dist-electron:/app/dist-electron chronicle-builder-win
```

## ✅ **Solution 4: Use Electron Forge (Alternative)**

Switch to Electron Forge which has better cross-compilation:

```bash
npm install --save-dev @electron-forge/cli
npx electron-forge import
npm run make
```

## 📦 **Current Available Files**

Right now you have:

- ✅ **Linux AppImage**: `dist-electron/Chronicle Builder-1.0.0.AppImage` (works on Linux)
- ✅ **Windows folder**: `dist-electron/win-unpacked/` (needs manual zip)

### Quick Windows Distribution:

1. **Zip the Windows folder**:

   ```bash
   cd dist-electron
   zip -r "Chronicle-Builder-Windows.zip" win-unpacked/
   ```

2. **Manual Windows Installation**:
   - Extract zip on Windows
   - Run `Chronicle Builder.exe` from the folder
   - No installer needed!

## 🎯 **Recommended Approach**

For regular releases, use **GitHub Actions** (Solution 1):

1. **One-time setup**: Create the workflow file
2. **Automatic builds**: Push tags to trigger builds
3. **All platforms**: Windows .exe, macOS .dmg, Linux .AppImage
4. **Professional**: Proper CI/CD pipeline

For quick testing, use the **manual zip** approach above.

## 📋 **Next Steps**

1. Choose your preferred solution
2. Follow the steps for that solution
3. Test the .exe on Windows
4. Set up regular build process

Would you like me to implement the GitHub Actions solution for automatic builds?
