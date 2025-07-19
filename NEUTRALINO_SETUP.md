# Neutralinojs Setup for Chronicle Builder

## Why Neutralinojs?

- ✅ **Ultra-light** - 5-10MB executables
- ✅ **No runtime** - uses system browser engine
- ✅ **Simple setup** - minimal configuration
- ✅ **Keep existing code** - works with React

## Quick Setup

### 1. Install Neutralinojs

```bash
npm install -g @neutralinojs/neu
```

### 2. Initialize Project

```bash
neu create chronicle-builder-neu
cd chronicle-builder-neu
```

### 3. Copy Your App

```bash
# Copy your built React app to resources folder
cp -r ../dist/* resources/
```

### 4. Configure neutralino.config.json

```json
{
  "applicationId": "com.chroniclebuilder.app",
  "port": 0,
  "defaultMode": "window",
  "window": {
    "title": "Chronicle Builder",
    "width": 1200,
    "height": 800,
    "minWidth": 800,
    "minHeight": 600
  },
  "resourcesPath": "/resources/",
  "url": "/",
  "modes": {
    "window": {
      "title": "Chronicle Builder",
      "width": 1200,
      "height": 800
    }
  }
}
```

### 5. Build Commands

```bash
# Development
neu run

# Build for distribution
neu build
```

## Benefits

- **Smallest size** - ~8MB total
- **Fast startup** - no runtime overhead
- **Simple deployment** - single executable
- **Cross-platform** - Windows, Mac, Linux
