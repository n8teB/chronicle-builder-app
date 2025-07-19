// Type definitions for Electron API
declare global {
  interface Window {
    electronAPI?: {
      showSaveDialog: (options: any) => Promise<any>;
      showOpenDialog: (options: any) => Promise<any>;
      writeFile: (filePath: string, data: string) => Promise<any>;
      readFile: (filePath: string) => Promise<any>;
      checkFileExists: (filePath: string) => Promise<boolean>;
      getUserDataPath: () => Promise<string>;
      getDocumentsPath: () => Promise<string>;
      startAutoSave: (interval?: number) => Promise<void>;
      stopAutoSave: () => Promise<void>;
      onMenuNewStory: (callback: () => void) => void;
      onMenuOpenStory: (callback: () => void) => void;
      onMenuSaveStory: (callback: () => void) => void;
      onMenuSaveStoryAs: (callback: () => void) => void;
      onMenuExportTimeline: (callback: () => void) => void;
      onMenuExportDraft: (callback: () => void) => void;
      onAutoSaveTrigger: (callback: () => void) => void;
      removeAllListeners: (channel: string) => void;
      platform: string;
    };
  }
}

export interface StoryFile {
  id: string;
  title: string;
  description: string;
  genre: string;
  targetWordCount: number;
  currentWordCount: number;
  status: "planning" | "drafting" | "revising" | "completed" | "archived";
  createdAt: Date;
  lastEdited: Date;
  tags: string[];
  notes: string;
  isFavorite: boolean;
  chapters: any[];
  characters: any[];
  worldElements: any[];
  timelineEvents: any[];
  scenes: any[];
  storyNotes: any[];
  filePath?: string;
}

export class FileSystemService {
  private isElectron: boolean;
  private currentFilePath: string | null = null;
  private autoSaveEnabled: boolean = false;

  constructor() {
    this.isElectron = typeof window !== "undefined" && !!window.electronAPI;

    if (this.isElectron) {
      this.setupMenuListeners();
      this.enableAutoSave();
    }
  }

  // Check if running in Electron
  isElectronEnvironment(): boolean {
    return this.isElectron;
  }

  // Setup menu event listeners
  private setupMenuListeners(): void {
    if (!this.isElectron) return;

    window.electronAPI!.onMenuNewStory(() => {
      this.handleMenuNewStory();
    });

    window.electronAPI!.onMenuOpenStory(() => {
      this.handleMenuOpenStory();
    });

    window.electronAPI!.onMenuSaveStory(() => {
      this.handleMenuSaveStory();
    });

    window.electronAPI!.onMenuSaveStoryAs(() => {
      this.handleMenuSaveStoryAs();
    });

    window.electronAPI!.onAutoSaveTrigger(() => {
      this.handleAutoSave();
    });
  }

  // Enable auto-save
  async enableAutoSave(interval: number = 30000): Promise<void> {
    if (!this.isElectron) return;

    try {
      await window.electronAPI!.startAutoSave(interval);
      this.autoSaveEnabled = true;
    } catch (error) {
      console.error("Failed to enable auto-save:", error);
    }
  }

  // Disable auto-save
  async disableAutoSave(): Promise<void> {
    if (!this.isElectron) return;

    try {
      await window.electronAPI!.stopAutoSave();
      this.autoSaveEnabled = false;
    } catch (error) {
      console.error("Failed to disable auto-save:", error);
    }
  }

  // Save story to file
  async saveStory(story: StoryFile, filePath?: string): Promise<string | null> {
    if (!this.isElectron) {
      // Fallback to browser download
      this.downloadStoryFile(story);
      return null;
    }

    try {
      let targetPath = filePath || this.currentFilePath;

      if (!targetPath) {
        const result = await window.electronAPI!.showSaveDialog({
          title: "Save Story",
          defaultPath: `${story.title}.chronicle`,
          filters: [
            { name: "Chronicle Builder Files", extensions: ["chronicle"] },
            { name: "JSON Files", extensions: ["json"] },
            { name: "All Files", extensions: ["*"] },
          ],
        });

        if (result.canceled) {
          return null;
        }

        targetPath = result.filePath;
      }

      const storyData = JSON.stringify(story, null, 2);
      const writeResult = await window.electronAPI!.writeFile(
        targetPath,
        storyData,
      );

      if (writeResult.success) {
        this.currentFilePath = targetPath;
        return targetPath;
      } else {
        throw new Error(writeResult.error);
      }
    } catch (error) {
      console.error("Failed to save story:", error);
      throw error;
    }
  }

  // Open story from file
  async openStory(): Promise<StoryFile | null> {
    if (!this.isElectron) {
      // Fallback to browser file input
      return this.uploadStoryFile();
    }

    try {
      const result = await window.electronAPI!.showOpenDialog({
        title: "Open Story",
        filters: [
          { name: "Chronicle Builder Files", extensions: ["chronicle"] },
          { name: "JSON Files", extensions: ["json"] },
          { name: "All Files", extensions: ["*"] },
        ],
        properties: ["openFile"],
      });

      if (result.canceled || !result.filePaths.length) {
        return null;
      }

      const filePath = result.filePaths[0];
      const readResult = await window.electronAPI!.readFile(filePath);

      if (readResult.success) {
        const story = JSON.parse(readResult.data) as StoryFile;
        story.filePath = filePath;
        this.currentFilePath = filePath;
        return story;
      } else {
        throw new Error(readResult.error);
      }
    } catch (error) {
      console.error("Failed to open story:", error);
      throw error;
    }
  }

  // Get recent files list
  async getRecentFiles(): Promise<string[]> {
    if (!this.isElectron) return [];

    try {
      const userDataPath = await window.electronAPI!.getUserDataPath();
      const recentFilesPath = `${userDataPath}/recent-files.json`;

      const exists = await window.electronAPI!.checkFileExists(recentFilesPath);
      if (!exists) return [];

      const readResult = await window.electronAPI!.readFile(recentFilesPath);
      if (readResult.success) {
        return JSON.parse(readResult.data);
      }
      return [];
    } catch (error) {
      console.error("Failed to get recent files:", error);
      return [];
    }
  }

  // Add file to recent files list
  async addToRecentFiles(filePath: string): Promise<void> {
    if (!this.isElectron) return;

    try {
      const userDataPath = await window.electronAPI!.getUserDataPath();
      const recentFilesPath = `${userDataPath}/recent-files.json`;

      const recentFiles = await this.getRecentFiles();
      const updatedFiles = [
        filePath,
        ...recentFiles.filter((f) => f !== filePath),
      ].slice(0, 10);

      await window.electronAPI!.writeFile(
        recentFilesPath,
        JSON.stringify(updatedFiles, null, 2),
      );
    } catch (error) {
      console.error("Failed to add to recent files:", error);
    }
  }

  // Export story as different formats
  async exportStory(
    story: StoryFile,
    format: "txt" | "json" | "pdf",
  ): Promise<void> {
    if (!this.isElectron) {
      // Fallback to browser download
      this.downloadStoryExport(story, format);
      return;
    }

    try {
      const extensions = {
        txt: ["txt"],
        json: ["json"],
        pdf: ["pdf"],
      };

      const result = await window.electronAPI!.showSaveDialog({
        title: `Export Story as ${format.toUpperCase()}`,
        defaultPath: `${story.title}-export.${format}`,
        filters: [
          {
            name: `${format.toUpperCase()} Files`,
            extensions: extensions[format],
          },
          { name: "All Files", extensions: ["*"] },
        ],
      });

      if (result.canceled) return;

      let exportData: string;

      switch (format) {
        case "txt":
          exportData = this.generateTextExport(story);
          break;
        case "json":
          exportData = JSON.stringify(story, null, 2);
          break;
        case "pdf":
          // For now, export as formatted text. PDF generation would require additional libraries
          exportData = this.generateFormattedTextExport(story);
          break;
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }

      const writeResult = await window.electronAPI!.writeFile(
        result.filePath,
        exportData,
      );

      if (!writeResult.success) {
        throw new Error(writeResult.error);
      }
    } catch (error) {
      console.error(`Failed to export story as ${format}:`, error);
      throw error;
    }
  }

  // Browser fallback methods
  private downloadStoryFile(story: StoryFile): void {
    const storyData = JSON.stringify(story, null, 2);
    const blob = new Blob([storyData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${story.title}.chronicle`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  private uploadStoryFile(): Promise<StoryFile | null> {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".chronicle,.json";

      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) {
          resolve(null);
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const story = JSON.parse(
              event.target?.result as string,
            ) as StoryFile;
            resolve(story);
          } catch (error) {
            console.error("Failed to parse story file:", error);
            resolve(null);
          }
        };

        reader.readAsText(file);
      };

      input.click();
    });
  }

  private downloadStoryExport(story: StoryFile, format: string): void {
    let exportData: string;
    let mimeType: string;

    switch (format) {
      case "txt":
        exportData = this.generateTextExport(story);
        mimeType = "text/plain";
        break;
      case "json":
        exportData = JSON.stringify(story, null, 2);
        mimeType = "application/json";
        break;
      default:
        exportData = this.generateTextExport(story);
        mimeType = "text/plain";
    }

    const blob = new Blob([exportData], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${story.title}-export.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  private generateTextExport(story: StoryFile): string {
    return `${story.title}\n\n${story.description}\n\nGenre: ${story.genre}\nStatus: ${story.status}\nWord Count: ${story.currentWordCount}/${story.targetWordCount}\n\n${story.notes}`;
  }

  private generateFormattedTextExport(story: StoryFile): string {
    return `# ${story.title}\n\n## Story Information\n- Genre: ${story.genre}\n- Status: ${story.status}\n- Word Count: ${story.currentWordCount}/${story.targetWordCount}\n- Created: ${new Date(story.createdAt).toLocaleDateString()}\n- Last Edited: ${new Date(story.lastEdited).toLocaleDateString()}\n\n## Description\n${story.description}\n\n## Notes\n${story.notes}\n\n## Characters\n${story.characters.map((char) => `- ${char.name}: ${char.role}`).join("\n")}\n\n## Chapters\n${story.chapters.map((chapter, index) => `### Chapter ${index + 1}: ${chapter.title}\n${chapter.content || "No content yet."}`).join("\n\n")}`;
  }

  // Menu event handlers (to be connected to React components)
  private handleMenuNewStory(): void {
    // Dispatch custom event that React components can listen to
    window.dispatchEvent(new CustomEvent("electron-menu-new-story"));
  }

  private handleMenuOpenStory(): void {
    window.dispatchEvent(new CustomEvent("electron-menu-open-story"));
  }

  private handleMenuSaveStory(): void {
    window.dispatchEvent(new CustomEvent("electron-menu-save-story"));
  }

  private handleMenuSaveStoryAs(): void {
    window.dispatchEvent(new CustomEvent("electron-menu-save-story-as"));
  }

  private handleAutoSave(): void {
    window.dispatchEvent(new CustomEvent("electron-auto-save"));
  }

  // Get current file path
  getCurrentFilePath(): string | null {
    return this.currentFilePath;
  }

  // Set current file path
  setCurrentFilePath(path: string | null): void {
    this.currentFilePath = path;
  }
}

// Create singleton instance
export const fileSystemService = new FileSystemService();
