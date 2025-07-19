# Tauri Setup for Chronicle Builder

## Why Tauri?

- ✅ **10x smaller** executables (~10-20MB vs 150MB+)
- ✅ **Better performance** - uses system webview
- ✅ **Better security** - no Node.js in renderer
- ✅ **Same web tech** - keep your React app as-is
- ✅ **Easy migration** from Electron

## Quick Setup

### 1. Install Rust

```bash
# Windows (run in PowerShell)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Restart terminal, then verify
rustc --version
```

### 2. Install Tauri CLI

```bash
npm install --save-dev @tauri-apps/cli
```

### 3. Initialize Tauri

```bash
npx tauri init
```

**Answer the prompts:**

- App name: `Chronicle Builder`
- Window title: `Chronicle Builder`
- Web assets path: `dist`
- Dev server URL: `http://localhost:5173`
- Frontend dev command: `npm run dev`
- Frontend build command: `npm run build:client`

### 4. Update package.json

```json
{
  "scripts": {
    "tauri": "tauri",
    "tauri-dev": "tauri dev",
    "tauri-build": "tauri build"
  }
}
```

### 5. Build Commands

```bash
# Development (hot reload)
npm run tauri-dev

# Production build
npm run tauri-build
```

## Benefits for Chronicle Builder

- **Tiny executables** - 15MB vs 150MB
- **Native performance** - faster than Electron
- **Same codebase** - no React changes needed
- **Better security** - sandboxed by default
- **Cross-platform** - Windows, Mac, Linux

## Migration Steps

1. Keep all your React code exactly the same
2. Replace electron.cjs with Tauri config
3. Update build scripts
4. Test and deploy

Your entire UI and functionality stays identical!
