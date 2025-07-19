import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BookOpen,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  FolderOpen,
  Star,
  Clock,
  Users,
  FileText,
  Settings,
  Download,
  Upload,
  Archive,
  ChevronDown,
} from "lucide-react";

export interface Story {
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
  chapters: number;
  characters: number;
  scenes: number;
  worldElements: number;
  timelineEvents: number;
}

const genres = [
  "Fantasy",
  "Science Fiction",
  "Romance",
  "Mystery",
  "Thriller",
  "Horror",
  "Literary Fiction",
  "Young Adult",
  "Children's",
  "Non-Fiction",
  "Biography",
  "Other",
];

const mockStories: Story[] = [
  {
    id: "story-1",
    title: "The Script Reader's Legacy",
    description:
      "A young librarian discovers her ability to read ancient magical scripts and must embrace her destiny to protect magical knowledge from those who would misuse it.",
    genre: "Fantasy",
    targetWordCount: 80000,
    currentWordCount: 15743,
    status: "drafting",
    createdAt: new Date("2024-01-01"),
    lastEdited: new Date(),
    tags: ["magic", "urban-fantasy", "librarian", "ancient-scripts"],
    notes:
      "Main themes: Knowledge vs. power, hidden magical world, coming-of-age",
    isFavorite: true,
    chapters: 8,
    characters: 4,
    scenes: 12,
    worldElements: 4,
    timelineEvents: 8,
  },
  {
    id: "story-2",
    title: "Echoes of Tomorrow",
    description:
      "In a world where memories can be extracted and traded, a memory thief discovers a conspiracy that threatens the fabric of reality itself.",
    genre: "Science Fiction",
    targetWordCount: 90000,
    currentWordCount: 3200,
    status: "planning",
    createdAt: new Date("2024-01-15"),
    lastEdited: new Date("2024-01-20"),
    tags: ["cyberpunk", "memory", "conspiracy", "dystopian"],
    notes: "Exploring themes of identity and the nature of consciousness",
    isFavorite: false,
    chapters: 2,
    characters: 3,
    scenes: 5,
    worldElements: 2,
    timelineEvents: 4,
  },
  {
    id: "story-3",
    title: "The Digital Awakening",
    description:
      "In a world where AI has achieved consciousness, one programmer must decide humanity's fate.",
    genre: "Science Fiction",
    targetWordCount: 95000,
    currentWordCount: 12000,
    status: "planning",
    createdAt: new Date("2024-02-01"),
    lastEdited: new Date("2024-02-15"),
    tags: ["ai", "consciousness", "programmer", "future"],
    notes: "Exploring themes of consciousness and what makes us human",
    isFavorite: false,
    chapters: 3,
    characters: 5,
    scenes: 8,
    worldElements: 3,
    timelineEvents: 6,
  },
  {
    id: "story-4",
    title: "Hearts in Highland Mist",
    description:
      "A romance set in the Scottish Highlands where ancient magic still lingers.",
    genre: "Romance",
    targetWordCount: 60000,
    currentWordCount: 45000,
    status: "revising",
    createdAt: new Date("2023-12-01"),
    lastEdited: new Date("2024-01-20"),
    tags: ["romance", "scotland", "magic", "highlands"],
    notes: "Focus on emotional development and atmospheric setting",
    isFavorite: true,
    chapters: 12,
    characters: 6,
    scenes: 18,
    worldElements: 5,
    timelineEvents: 10,
  },
  {
    id: "story-5",
    title: "The Last Detective",
    description:
      "In a crime-free future, the last human detective investigates the impossible case.",
    genre: "Mystery",
    targetWordCount: 70000,
    currentWordCount: 70000,
    status: "completed",
    createdAt: new Date("2023-08-01"),
    lastEdited: new Date("2023-12-15"),
    tags: ["mystery", "detective", "future", "crime"],
    notes: "First completed novel - ready for publishing",
    isFavorite: false,
    chapters: 18,
    characters: 9,
    scenes: 25,
    worldElements: 7,
    timelineEvents: 15,
  },
  {
    id: "story-6",
    title: "Shadows of Tomorrow",
    description:
      "A thriller about time manipulation and the consequences of changing the past.",
    genre: "Thriller",
    targetWordCount: 85000,
    currentWordCount: 20000,
    status: "drafting",
    createdAt: new Date("2024-01-15"),
    lastEdited: new Date("2024-02-10"),
    tags: ["thriller", "time-travel", "consequences", "suspense"],
    notes: "Complex plot with multiple timelines",
    isFavorite: false,
    chapters: 5,
    characters: 7,
    scenes: 15,
    worldElements: 4,
    timelineEvents: 20,
  },
];

interface StoryManagerProps {
  currentStory: Story | null;
  stories: Story[];
  onStoryChange: (story: Story) => void;
  onStoryCreate: (story: Story) => void;
  onStoryUpdate: (story: Story) => void;
  onStoryDelete: (storyId: string) => void;
}

export function StoryManager({
  currentStory,
  stories,
  onStoryChange,
  onStoryCreate,
  onStoryUpdate,
  onStoryDelete,
}: StoryManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  // New story form state
  const [newStoryForm, setNewStoryForm] = useState({
    title: "",
    description: "",
    genre: "Fantasy",
    targetWordCount: 80000,
    tags: "",
    notes: "",
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "drafting":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "revising":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "planning":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getProgressPercentage = (story: Story) => {
    return Math.min(
      (story.currentWordCount / story.targetWordCount) * 100,
      100,
    );
  };

  const handleCreateStory = () => {
    const newStory: Story = {
      id: `story-${Date.now()}`,
      title: newStoryForm.title,
      description: newStoryForm.description,
      genre: newStoryForm.genre,
      targetWordCount: newStoryForm.targetWordCount,
      currentWordCount: 0,
      status: "planning",
      createdAt: new Date(),
      lastEdited: new Date(),
      tags: newStoryForm.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t),
      notes: newStoryForm.notes,
      isFavorite: false,
      chapters: 0,
      characters: 0,
      scenes: 0,
      worldElements: 0,
      timelineEvents: 0,
    };

    onStoryCreate(newStory);

    // Reset form
    setNewStoryForm({
      title: "",
      description: "",
      genre: "Fantasy",
      targetWordCount: 80000,
      tags: "",
      notes: "",
    });

    setIsCreateOpen(false);
  };

  const handleDeleteStory = (storyId: string) => {
    onStoryDelete(storyId);
  };

  const handleDuplicateStory = (story: Story) => {
    const duplicatedStory: Story = {
      ...story,
      id: `story-${Date.now()}`,
      title: `${story.title} (Copy)`,
      currentWordCount: 0,
      createdAt: new Date(),
      lastEdited: new Date(),
      chapters: 0,
      characters: 0,
      scenes: 0,
      worldElements: 0,
      timelineEvents: 0,
    };

    onStoryCreate(duplicatedStory);
  };

  const handleToggleFavorite = (storyId: string) => {
    const storyToUpdate = stories.find((s) => s.id === storyId);
    if (storyToUpdate) {
      const updatedStory = {
        ...storyToUpdate,
        isFavorite: !storyToUpdate.isFavorite,
      };
      onStoryUpdate(updatedStory);
    }
  };

  const filteredStories = stories.filter((story) => {
    const matchesSearch =
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesStatus =
      statusFilter === "all" || story.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedStories = [...filteredStories].sort((a, b) => {
    // Favorites first, then by last edited
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return b.lastEdited.getTime() - a.lastEdited.getTime();
  });

  return (
    <>
      {/* Story Selector Dropdown */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-2 max-w-64 truncate"
          >
            <BookOpen className="h-4 w-4" />
            <span className="truncate">
              {currentStory?.title || "Select Story"}
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-96 p-0 max-h-[80vh]">
          <div className="p-4 flex flex-col max-h-[80vh]">
            <div className="mb-4 flex-shrink-0">
              <h3 className="font-semibold">Your Stories</h3>
            </div>

            {/* Search and Filter */}
            <div className="space-y-2 mb-4 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search stories..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stories</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="drafting">Drafting</SelectItem>
                  <SelectItem value="revising">Revising</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator className="mb-4 flex-shrink-0" />

            {/* Stories List */}
            <div className="overflow-y-auto max-h-[40vh] min-h-[200px] pr-1">
              <div className="space-y-2">
                {sortedStories.map((story) => (
                  <Card
                    key={story.id}
                    className={`cursor-pointer transition-all hover:shadow-sm ${
                      currentStory?.id === story.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => {
                      onStoryChange(story);
                      setIsOpen(false);
                    }}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {story.isFavorite && (
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            )}
                            <h4 className="font-medium text-sm truncate">
                              {story.title}
                            </h4>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                            {story.description}
                          </p>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger
                            asChild
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                            >
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleFavorite(story.id);
                              }}
                            >
                              <Star className="h-3 w-3 mr-2" />
                              {story.isFavorite
                                ? "Remove from favorites"
                                : "Add to favorites"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDuplicateStory(story);
                              }}
                            >
                              <Copy className="h-3 w-3 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteStory(story.id);
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="h-3 w-3 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getStatusColor(story.status)}>
                          {story.status}
                        </Badge>
                        <Badge variant="secondary">{story.genre}</Badge>
                      </div>

                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Progress:</span>
                          <span>
                            {story.currentWordCount.toLocaleString()} /{" "}
                            {story.targetWordCount.toLocaleString()} words
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1">
                          <div
                            className="bg-primary h-1 rounded-full transition-all"
                            style={{
                              width: `${getProgressPercentage(story)}%`,
                            }}
                          />
                        </div>
                        <div className="flex justify-between">
                          <span>Last edited:</span>
                          <span>{story.lastEdited.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {sortedStories.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No stories found</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={() => setIsCreateOpen(true)}
                    >
                      Create your first story
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Create New Story Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Story</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="story-title">Story Title</Label>
              <Input
                id="story-title"
                value={newStoryForm.title}
                onChange={(e) =>
                  setNewStoryForm({ ...newStoryForm, title: e.target.value })
                }
                placeholder="Enter your story title..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="story-description">Description</Label>
              <Textarea
                id="story-description"
                value={newStoryForm.description}
                onChange={(e) =>
                  setNewStoryForm({
                    ...newStoryForm,
                    description: e.target.value,
                  })
                }
                placeholder="Describe your story in a few sentences..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="story-genre">Genre</Label>
                <Select
                  value={newStoryForm.genre}
                  onValueChange={(value) =>
                    setNewStoryForm({ ...newStoryForm, genre: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="story-word-count">Target Word Count</Label>
                <Input
                  id="story-word-count"
                  type="number"
                  value={newStoryForm.targetWordCount}
                  onChange={(e) =>
                    setNewStoryForm({
                      ...newStoryForm,
                      targetWordCount: parseInt(e.target.value) || 80000,
                    })
                  }
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="story-tags">Tags</Label>
              <Input
                id="story-tags"
                value={newStoryForm.tags}
                onChange={(e) =>
                  setNewStoryForm({ ...newStoryForm, tags: e.target.value })
                }
                placeholder="fantasy, adventure, magic, etc. (comma separated)"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="story-notes">Initial Notes</Label>
              <Textarea
                id="story-notes"
                value={newStoryForm.notes}
                onChange={(e) =>
                  setNewStoryForm({ ...newStoryForm, notes: e.target.value })
                }
                placeholder="Any initial thoughts, themes, or ideas for your story..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateStory}
                disabled={!newStoryForm.title.trim()}
              >
                Create Story
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Hook for managing story state globally
export function useStoryManager() {
  const [stories, setStories] = useState<Story[]>(mockStories);
  const [currentStory, setCurrentStory] = useState<Story | null>(
    mockStories[0] || null,
  );

  const handleStoryChange = (story: Story) => {
    setCurrentStory(story);
    localStorage.setItem("currentStoryId", story.id);
  };

  const handleStoryCreate = (story: Story) => {
    console.log("Creating story:", story.title);
    setStories((prev) => [...prev, story]);
    setCurrentStory(story);
  };

  const handleStoryUpdate = (story: Story) => {
    setStories((prev) => prev.map((s) => (s.id === story.id ? story : s)));
    if (currentStory?.id === story.id) {
      setCurrentStory(story);
    }
  };

  const handleStoryDelete = (storyId: string) => {
    setStories((prev) => {
      const remaining = prev.filter((s) => s.id !== storyId);
      // If we deleted the current story, update current story immediately
      if (currentStory?.id === storyId) {
        setCurrentStory(remaining[0] || null);
      }
      return remaining;
    });
  };

  return {
    currentStory,
    stories,
    handleStoryChange,
    handleStoryCreate,
    handleStoryUpdate,
    handleStoryDelete,
  };
}
