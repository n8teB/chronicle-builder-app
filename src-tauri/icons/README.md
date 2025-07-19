# Tauri Icons

This directory contains the icons for the Tauri application.

For now, we'll use the existing icon from public/assets/icon.png

To generate proper icons for all platforms, run:

```bash
npm install -g @tauri-apps/cli
tauri icon path/to/your/icon.png
```

This will generate all required icon formats:

- 32x32.png
- 128x128.png
- 128x128@2x.png
- icon.icns (macOS)
- icon.ico (Windows)

For now, we'll copy the existing icon to work with Tauri.
