# Chronicle Builder Desktop App

Chronicle Builder has been converted to a full-featured Electron desktop application with complete file system access.

## ✨ Features

### 🖥️ Desktop Application

- **Native desktop app** for Windows, macOS, and Linux
- **Full file system access** - save stories as actual files
- **Native file dialogs** for open/save operations
- **Auto-save functionality** every 30 seconds
- **Recent files list** for quick access
- **Keyboard shortcuts** (Ctrl+N, Ctrl+O, Ctrl+S, etc.)

### 💾 File Management

- **Save stories as .chronicle files** (JSON format)
- **Auto-save** with visual indicators
- **Recent files** tracking and quick access
- **Export options**: Text, JSON, PDF formats
- **File status indicators** in status bar

### 🎯 Enhanced UI

- **Status bar** showing file status and connection info
- **File menu** with all file operations
- **Keyboard shortcuts** matching desktop conventions
- **Native menus** integrated with OS

## 🚀 Getting Started

### Development Mode

```bash
# Install Electron dependencies
node scripts/install-electron.js

# Start development mode (hot reload)
npm run electron-dev
```

### Build Desktop App

```bash
# Build for current platform
npm run electron-pack

# The built app will be in dist-electron/
```

### Available Scripts

- `npm run electron-dev` - Start development with hot reload
- `npm run electron` - Start Electron (requires dev server running)
- `npm run electron-pack` - Build desktop app for current platform
- `npm run dev` - Start web development server only

## 📁 File Structure

```
chronicle-builder/
├── public/
│   ├── electron.js          # Main Electron process
│   └── preload.js           # Secure API bridge
├── client/
│   ├── services/
│   │   └── fileSystemService.ts  # File operations
│   ├── contexts/
│   │   └── ElectronStoryContext.tsx  # Enhanced story management
│   └── components/
│       ├── StatusBar.tsx    # File status indicator
│       └── FileMenu.tsx     # File operations menu
└── scripts/
    └── install-electron.js  # Dependency installer
```

## 🔧 Architecture

### Main Process (`public/electron.js`)

- Creates and manages application windows
- Handles file system operations securely
- Provides native menus and shortcuts
- Manages auto-save functionality

### Preload Script (`public/preload.js`)

- Secure bridge between main and renderer processes
- Exposes file system APIs safely
- Handles menu event communication

### File System Service (`client/services/fileSystemService.ts`)

- Unified API for file operations
- Handles both Electron and browser environments
- Manages story file format and export options

### Enhanced Story Context (`client/contexts/ElectronStoryContext.tsx`)

- File-aware story management
- Auto-save functionality
- Recent files tracking
- Integration with native file operations

## 📋 File Format

Stories are saved as `.chronicle` files (JSON format) containing:

```json
{
  "id": "story-id",
  "title": "Story Title",
  "description": "Story description",
  "chapters": [...],
  "characters": [...],
  "worldElements": [...],
  "timelineEvents": [...],
  "scenes": [...],
  "storyNotes": [...],
  "metadata": {
    "createdAt": "2024-01-01T00:00:00.000Z",
    "lastEdited": "2024-01-01T00:00:00.000Z",
    "version": "1.0.0"
  }
}
```

## 🔄 Migration from Web Version

The desktop app is fully compatible with existing web data:

1. **Export from web**: Use the export function to download JSON
2. **Import to desktop**: Use File → Open to load the JSON file
3. **Save as .chronicle**: Use File → Save to create desktop file

## 🎨 UI Enhancements

### Status Bar

- **File status**: Shows save state and file path
- **Auto-save indicator**: Shows when auto-save is active
- **Connection status**: Online/offline indicator
- **Platform indicator**: Desktop vs Web mode

### File Menu

- **New Story** (Ctrl+N): Create new story
- **Open Story** (Ctrl+O): Open existing .chronicle file
- **Save Story** (Ctrl+S): Save current story
- **Save As** (Ctrl+Shift+S): Save with new name/location
- **Export options**: Text, JSON, PDF formats
- **Recent Files**: Quick access to recently opened stories

## 🚀 Building for Distribution

### macOS

```bash
npm run electron-pack
# Creates .dmg installer in dist-electron/
```

### Windows

```bash
npm run electron-pack
# Creates .exe installer in dist-electron/
```

### Linux

```bash
npm run electron-pack
# Creates .AppImage in dist-electron/
```

## 🔒 Security

- **Context isolation** enabled for security
- **Node.js integration** disabled in renderer
- **Secure preload script** for API access
- **File system access** only through secure APIs

## 🛠️ Development

### Adding New File Operations

1. Add IPC handler in `public/electron.js`
2. Expose API in `public/preload.js`
3. Add method to `client/services/fileSystemService.ts`
4. Use in React components via context

### Customizing Menus

Edit the menu template in `public/electron.js` to add new menu items and shortcuts.

## 📦 Dependencies

### Electron-specific

- `electron` - Main framework
- `electron-builder` - App packaging
- `concurrently` - Run dev server + electron
- `wait-on` - Wait for dev server startup
- `electron-reload` - Hot reload in development

### Build Tools

- All existing Vite/React dependencies
- Enhanced with Electron-specific configurations

## 🎯 Next Steps

1. **Install dependencies**: `node scripts/install-electron.js`
2. **Start development**: `npm run electron-dev`
3. **Test file operations**: Create, save, open stories
4. **Build for production**: `npm run electron-pack`
5. **Distribute**: Share the built installer

Your Chronicle Builder is now a full desktop application with complete file system access! 🎉
