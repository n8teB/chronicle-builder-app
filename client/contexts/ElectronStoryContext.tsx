import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Story } from "@/components/StoryManager";
import { fileSystemService, StoryFile } from "@/services/fileSystemService";

interface ElectronStoryContextType {
  currentStory: Story | null;
  stories: Story[];
  isLoading: boolean;
  isDirty: boolean;
  currentFilePath: string | null;
  recentFiles: string[];

  // File operations
  saveStory: (story?: Story) => Promise<void>;
  saveStoryAs: () => Promise<void>;
  openStory: () => Promise<void>;
  newStory: () => void;
  exportStory: (format: "txt" | "json" | "pdf") => Promise<void>;

  // Story management
  updateStory: (story: Story) => void;
  createStory: (story: Story) => void;
  deleteStory: (storyId: string) => void;
  changeStory: (story: Story) => void;

  // File system status
  isElectronEnvironment: boolean;
  autoSaveEnabled: boolean;
}

const ElectronStoryContext = createContext<
  ElectronStoryContextType | undefined
>(undefined);

interface ElectronStoryProviderProps {
  children: ReactNode;
}

export function ElectronStoryProvider({
  children,
}: ElectronStoryProviderProps) {
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);
  const [recentFiles, setRecentFiles] = useState<string[]>([]);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);

  const isElectronEnvironment = fileSystemService.isElectronEnvironment();

  // Load recent files on startup
  useEffect(() => {
    if (isElectronEnvironment) {
      loadRecentFiles();
      setAutoSaveEnabled(true);
    }
  }, [isElectronEnvironment]);

  // Setup Electron menu listeners
  useEffect(() => {
    if (!isElectronEnvironment) return;

    const handleMenuNewStory = () => newStory();
    const handleMenuOpenStory = () => openStory();
    const handleMenuSaveStory = () => saveStory();
    const handleMenuSaveStoryAs = () => saveStoryAs();
    const handleAutoSave = () => {
      if (currentStory && isDirty) {
        saveStory(currentStory);
      }
    };

    window.addEventListener("electron-menu-new-story", handleMenuNewStory);
    window.addEventListener("electron-menu-open-story", handleMenuOpenStory);
    window.addEventListener("electron-menu-save-story", handleMenuSaveStory);
    window.addEventListener(
      "electron-menu-save-story-as",
      handleMenuSaveStoryAs,
    );
    window.addEventListener("electron-auto-save", handleAutoSave);

    return () => {
      window.removeEventListener("electron-menu-new-story", handleMenuNewStory);
      window.removeEventListener(
        "electron-menu-open-story",
        handleMenuOpenStory,
      );
      window.removeEventListener(
        "electron-menu-save-story",
        handleMenuSaveStory,
      );
      window.removeEventListener(
        "electron-menu-save-story-as",
        handleMenuSaveStoryAs,
      );
      window.removeEventListener("electron-auto-save", handleAutoSave);
    };
  }, [currentStory, isDirty]);

  const loadRecentFiles = async () => {
    try {
      const files = await fileSystemService.getRecentFiles();
      setRecentFiles(files);
    } catch (error) {
      console.error("Failed to load recent files:", error);
    }
  };

  const convertStoryToStoryFile = useCallback(
    (story: Story): StoryFile => {
      return {
        id: story.id,
        title: story.title,
        description: story.description,
        genre: story.genre,
        targetWordCount: story.targetWordCount,
        currentWordCount: story.currentWordCount,
        status: story.status,
        createdAt: story.createdAt,
        lastEdited: story.lastEdited,
        tags: story.tags,
        notes: story.notes,
        isFavorite: story.isFavorite,
        chapters: story.chapters || [],
        characters: story.characters || [],
        worldElements: story.worldElements || [],
        timelineEvents: story.timelineEvents || [],
        scenes: story.scenes || [],
        storyNotes: story.storyNotes || [],
        filePath: currentFilePath,
      };
    },
    [currentFilePath],
  );

  const convertStoryFileToStory = useCallback((storyFile: StoryFile): Story => {
    return {
      id: storyFile.id,
      title: storyFile.title,
      description: storyFile.description,
      genre: storyFile.genre,
      targetWordCount: storyFile.targetWordCount,
      currentWordCount: storyFile.currentWordCount,
      status: storyFile.status,
      createdAt: storyFile.createdAt,
      lastEdited: storyFile.lastEdited,
      tags: storyFile.tags,
      notes: storyFile.notes,
      isFavorite: storyFile.isFavorite,
      chapters: storyFile.chapters?.length || 0,
      characters: storyFile.characters?.length || 0,
      scenes: storyFile.scenes?.length || 0,
      worldElements: storyFile.worldElements?.length || 0,
      timelineEvents: storyFile.timelineEvents?.length || 0,
    };
  }, []);

  const saveStory = async (story?: Story) => {
    if (!currentStory && !story) return;

    const storyToSave = story || currentStory!;
    setIsLoading(true);

    try {
      const storyFile = convertStoryToStoryFile(storyToSave);
      const filePath = await fileSystemService.saveStory(
        storyFile,
        currentFilePath,
      );

      if (filePath) {
        setCurrentFilePath(filePath);
        fileSystemService.setCurrentFilePath(filePath);
        await fileSystemService.addToRecentFiles(filePath);
        await loadRecentFiles();
        setIsDirty(false);
      }
    } catch (error) {
      console.error("Failed to save story:", error);
      // You could show a toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  const saveStoryAs = async () => {
    if (!currentStory) return;

    setIsLoading(true);

    try {
      const storyFile = convertStoryToStoryFile(currentStory);
      const filePath = await fileSystemService.saveStory(storyFile);

      if (filePath) {
        setCurrentFilePath(filePath);
        fileSystemService.setCurrentFilePath(filePath);
        await fileSystemService.addToRecentFiles(filePath);
        await loadRecentFiles();
        setIsDirty(false);
      }
    } catch (error) {
      console.error("Failed to save story as:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openStory = async () => {
    setIsLoading(true);

    try {
      const storyFile = await fileSystemService.openStory();

      if (storyFile) {
        const story = convertStoryFileToStory(storyFile);
        setCurrentStory(story);
        setStories([story]); // For now, just set as single story
        setCurrentFilePath(storyFile.filePath || null);
        fileSystemService.setCurrentFilePath(storyFile.filePath || null);

        if (storyFile.filePath) {
          await fileSystemService.addToRecentFiles(storyFile.filePath);
          await loadRecentFiles();
        }

        setIsDirty(false);
      }
    } catch (error) {
      console.error("Failed to open story:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const newStory = () => {
    // Check if current story has unsaved changes
    if (isDirty) {
      const confirmed = window.confirm(
        "You have unsaved changes. Do you want to create a new story without saving?",
      );
      if (!confirmed) return;
    }

    const newStoryData: Story = {
      id: `story-${Date.now()}`,
      title: "New Story",
      description: "",
      genre: "Fiction",
      targetWordCount: 80000,
      currentWordCount: 0,
      status: "planning",
      createdAt: new Date(),
      lastEdited: new Date(),
      tags: [],
      notes: "",
      isFavorite: false,
      chapters: 0,
      characters: 0,
      scenes: 0,
      worldElements: 0,
      timelineEvents: 0,
    };

    setCurrentStory(newStoryData);
    setStories([newStoryData]);
    setCurrentFilePath(null);
    fileSystemService.setCurrentFilePath(null);
    setIsDirty(true);
  };

  const exportStory = async (format: "txt" | "json" | "pdf") => {
    if (!currentStory) return;

    setIsLoading(true);

    try {
      const storyFile = convertStoryToStoryFile(currentStory);
      await fileSystemService.exportStory(storyFile, format);
    } catch (error) {
      console.error(`Failed to export story as ${format}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStory = (story: Story) => {
    setCurrentStory(story);
    setStories((prev) => prev.map((s) => (s.id === story.id ? story : s)));
    setIsDirty(true);
  };

  const createStory = (story: Story) => {
    setStories((prev) => [...prev, story]);
    setCurrentStory(story);
    setIsDirty(true);
  };

  const deleteStory = (storyId: string) => {
    setStories((prev) => prev.filter((s) => s.id !== storyId));
    if (currentStory?.id === storyId) {
      setCurrentStory(null);
      setCurrentFilePath(null);
      fileSystemService.setCurrentFilePath(null);
    }
    setIsDirty(true);
  };

  const changeStory = (story: Story) => {
    setCurrentStory(story);
    setIsDirty(false);
  };

  return (
    <ElectronStoryContext.Provider
      value={{
        currentStory,
        stories,
        isLoading,
        isDirty,
        currentFilePath,
        recentFiles,

        // File operations
        saveStory,
        saveStoryAs,
        openStory,
        newStory,
        exportStory,

        // Story management
        updateStory,
        createStory,
        deleteStory,
        changeStory,

        // File system status
        isElectronEnvironment,
        autoSaveEnabled,
      }}
    >
      {children}
    </ElectronStoryContext.Provider>
  );
}

export function useElectronStory() {
  const context = useContext(ElectronStoryContext);
  if (context === undefined) {
    throw new Error(
      "useElectronStory must be used within an ElectronStoryProvider",
    );
  }
  return context;
}
