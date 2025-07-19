const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electronAPI", {
  // File system operations
  showSaveDialog: (options) => ipcRenderer.invoke("show-save-dialog", options),
  showOpenDialog: (options) => ipcRenderer.invoke("show-open-dialog", options),
  writeFile: (filePath, data) =>
    ipcRenderer.invoke("write-file", filePath, data),
  readFile: (filePath) => ipcRenderer.invoke("read-file", filePath),
  checkFileExists: (filePath) =>
    ipcRenderer.invoke("check-file-exists", filePath),

  // Path utilities
  getUserDataPath: () => ipcRenderer.invoke("get-user-data-path"),
  getDocumentsPath: () => ipcRenderer.invoke("get-documents-path"),

  // Auto-save
  startAutoSave: (interval) => ipcRenderer.invoke("start-auto-save", interval),
  stopAutoSave: () => ipcRenderer.invoke("stop-auto-save"),

  // Menu event listeners
  onMenuNewStory: (callback) => ipcRenderer.on("menu-new-story", callback),
  onMenuOpenStory: (callback) => ipcRenderer.on("menu-open-story", callback),
  onMenuSaveStory: (callback) => ipcRenderer.on("menu-save-story", callback),
  onMenuSaveStoryAs: (callback) =>
    ipcRenderer.on("menu-save-story-as", callback),
  onMenuExportTimeline: (callback) =>
    ipcRenderer.on("menu-export-timeline", callback),
  onMenuExportDraft: (callback) =>
    ipcRenderer.on("menu-export-draft", callback),
  onAutoSaveTrigger: (callback) =>
    ipcRenderer.on("auto-save-trigger", callback),

  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),

  // Platform detection
  platform: process.platform,

  // Version info
  getAppVersion: () => ipcRenderer.invoke("get-app-version"),
});

// Expose a limited set of Node.js APIs for development
if (process.env.NODE_ENV === "development") {
  contextBridge.exposeInMainWorld("nodeAPI", {
    process: {
      env: process.env,
      platform: process.platform,
    },
  });
}
