import { createContext, useContext, ReactNode } from "react";
import { Story } from "@/components/StoryManager";

interface StoryContextType {
  currentStory: Story | null;
  stories: Story[];
  updateStory: (story: Story) => void;
  createStory: (story: Story) => void;
  deleteStory: (storyId: string) => void;
  changeStory: (story: Story) => void;
}

const StoryContext = createContext<StoryContextType | undefined>(undefined);

interface StoryProviderProps {
  children: ReactNode;
  currentStory: Story | null;
  stories: Story[];
  onStoryUpdate: (story: Story) => void;
  onStoryCreate: (story: Story) => void;
  onStoryDelete: (storyId: string) => void;
  onStoryChange: (story: Story) => void;
}

export function StoryProvider({
  children,
  currentStory,
  stories,
  onStoryUpdate,
  onStoryCreate,
  onStoryDelete,
  onStoryChange,
}: StoryProviderProps) {
  const updateStory = (story: Story) => {
    onStoryUpdate(story);
  };

  const createStory = (story: Story) => {
    onStoryCreate(story);
  };

  const deleteStory = (storyId: string) => {
    onStoryDelete(storyId);
  };

  const changeStory = (story: Story) => {
    onStoryChange(story);
  };

  return (
    <StoryContext.Provider
      value={{
        currentStory,
        stories,
        updateStory,
        createStory,
        deleteStory,
        changeStory,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
}

export function useStory() {
  const context = useContext(StoryContext);
  if (context === undefined) {
    throw new Error("useStory must be used within a StoryProvider");
  }
  return context;
}
