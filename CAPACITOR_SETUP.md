# Capacitor Setup for Chronicle Builder

## Why Capacitor?

- ✅ **Mobile + Desktop** - iOS, Android, Web, Desktop
- ✅ **Ionic team** - well maintained
- ✅ **Native APIs** - camera, file system, etc.
- ✅ **Keep React** - no code changes needed

## Quick Setup

### 1. Install Capacitor

```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/electron
```

### 2. Initialize

```bash
npx cap init "Chronicle Builder" "com.chroniclebuilder.app"
npx cap add electron
```

### 3. Configure capacitor.config.ts

```typescript
import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.chroniclebuilder.app",
  appName: "Chronicle Builder",
  webDir: "dist",
  bundledWebRuntime: false,
  electron: {
    hiddenInsets: true,
    windowOptions: {
      width: 1200,
      height: 800,
      minWidth: 800,
      minHeight: 600,
      titleBarStyle: "default",
    },
  },
};

export default config;
```

### 4. Build Commands

```bash
# Build web app first
npm run build:client

# Copy to native
npx cap copy electron

# Run in development
npx cap run electron

# Build for production
npx cap build electron
```

## Benefits

- **Future-proof** - can add mobile later
- **Native feel** - proper window management
- **Plugin ecosystem** - rich functionality
- **Ionic support** - enterprise backing
