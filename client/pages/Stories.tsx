import { useState } from "react";
import { useStory } from "@/contexts/StoryContext";
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
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Clock,
  Target,
  Trash2,
  Copy,
  Star,
  Calendar,
  TrendingUp,
  FileText,
  Users,
  Globe,
  BarChart3,
  Settings,
  Download,
  Upload,
  Archive,
  Folder,
  Grid3X3,
  List,
} from "lucide-react";
import { Story } from "@/components/StoryManager";

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
    title: "Hearts in the Highlands",
    description:
      "A modern romance set in the Scottish Highlands where a city journalist falls for a mysterious local who guards ancient secrets.",
    genre: "Romance",
    targetWordCount: 60000,
    currentWordCount: 45000,
    status: "revising",
    createdAt: new Date("2023-11-01"),
    lastEdited: new Date("2024-01-10"),
    tags: ["romance", "scotland", "journalist", "secrets"],
    notes: "Focus on character development and beautiful setting descriptions",
    isFavorite: true,
    chapters: 15,
    characters: 8,
    scenes: 28,
    worldElements: 6,
    timelineEvents: 12,
  },
  {
    id: "story-4",
    title: "The Last Detective",
    description:
      "In a world where crime has been virtually eliminated by AI, the last human detective must solve a case that could bring down the entire system.",
    genre: "Mystery",
    targetWordCount: 70000,
    currentWordCount: 70000,
    status: "completed",
    createdAt: new Date("2023-06-01"),
    lastEdited: new Date("2023-12-15"),
    tags: ["mystery", "ai", "detective", "future"],
    notes: "First completed novel! Ready for publishing",
    isFavorite: false,
    chapters: 20,
    characters: 12,
    scenes: 35,
    worldElements: 8,
    timelineEvents: 25,
  },
];

export default function Stories() {
  const { stories, createStory, updateStory, deleteStory } = useStory();
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [genreFilter, setGenreFilter] = useState("all");
  const [favoritesFilter, setFavoritesFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("lastEdited");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [storyForm, setStoryForm] = useState({
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

  const filteredStories = stories.filter((story) => {
    const matchesSearch =
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesStatus =
      statusFilter === "all" || story.status === statusFilter;
    const matchesGenre = genreFilter === "all" || story.genre === genreFilter;
    const matchesFavorites =
      favoritesFilter === "all" ||
      (favoritesFilter === "favorites" && story.isFavorite) ||
      (favoritesFilter === "non-favorites" && !story.isFavorite);
    return matchesSearch && matchesStatus && matchesGenre && matchesFavorites;
  });

  const sortedStories = [...filteredStories].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title);
      case "progress":
        return getProgressPercentage(b) - getProgressPercentage(a);
      case "wordCount":
        return b.currentWordCount - a.currentWordCount;
      case "created":
        return b.createdAt.getTime() - a.createdAt.getTime();
      case "lastEdited":
      default:
        return b.lastEdited.getTime() - a.lastEdited.getTime();
    }
  });

  const handleCreateStory = () => {
    const newStory: Story = {
      id: `story-${Date.now()}`,
      title: storyForm.title,
      description: storyForm.description,
      genre: storyForm.genre,
      targetWordCount: storyForm.targetWordCount,
      currentWordCount: 0,
      status: "planning",
      createdAt: new Date(),
      lastEdited: new Date(),
      tags: storyForm.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t),
      notes: storyForm.notes,
      isFavorite: false,
      chapters: 0,
      characters: 0,
      scenes: 0,
      worldElements: 0,
      timelineEvents: 0,
    };

    createStory(newStory);
    setCreateDialogOpen(false);
    setStoryForm({
      title: "",
      description: "",
      genre: "Fantasy",
      targetWordCount: 80000,
      tags: "",
      notes: "",
    });
  };

  const handleEditStory = (story: Story) => {
    setSelectedStory(story);
    setStoryForm({
      title: story.title,
      description: story.description,
      genre: story.genre,
      targetWordCount: story.targetWordCount,
      tags: story.tags.join(", "),
      notes: story.notes,
    });
    setEditDialogOpen(true);
  };

  const handleUpdateStory = () => {
    if (!selectedStory) return;

    const updatedStory: Story = {
      ...selectedStory,
      title: storyForm.title,
      description: storyForm.description,
      genre: storyForm.genre,
      targetWordCount: storyForm.targetWordCount,
      tags: storyForm.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t),
      notes: storyForm.notes,
      lastEdited: new Date(),
    };

    updateStory(updatedStory);
    setEditDialogOpen(false);
    setSelectedStory(null);
  };

  const handleDeleteStory = (storyId: string) => {
    deleteStory(storyId);
  };

  const handleToggleFavorite = (storyId: string) => {
    const storyToUpdate = stories.find((s) => s.id === storyId);
    if (storyToUpdate) {
      updateStory({ ...storyToUpdate, isFavorite: !storyToUpdate.isFavorite });
    }
  };

  const handleDuplicateStory = (story: Story) => {
    const duplicatedStory: Story = {
      ...story,
      id: `story-${Date.now()}`,
      title: `${story.title} (Copy)`,
      currentWordCount: 0,
      createdAt: new Date(),
      lastEdited: new Date(),
    };

    createStory(duplicatedStory);
  };

  const uniqueGenres = [...new Set(stories.map((s) => s.genre))];

  const statsData = {
    totalStories: stories.length,
    totalWords: stories.reduce((sum, s) => sum + s.currentWordCount, 0),
    completedStories: stories.filter((s) => s.status === "completed").length,
    averageProgress:
      stories.length > 0
        ? stories.reduce((sum, s) => sum + getProgressPercentage(s), 0) /
          stories.length
        : 0,
  };

  const renderStoryCard = (story: Story) => (
    <Card
      key={story.id}
      className="transition-all hover:shadow-md cursor-pointer"
      onClick={() => handleEditStory(story)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {story.isFavorite && (
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              )}
              <h3 className="font-semibold text-lg truncate">{story.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {story.description}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditStory(story);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleFavorite(story.id);
                }}
              >
                <Star className="h-4 w-4 mr-2" />
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
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteStory(story.id);
                }}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(story.status)}>
              {story.status}
            </Badge>
            <Badge variant="secondary">{story.genre}</Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress:</span>
              <span>
                {story.currentWordCount.toLocaleString()} /{" "}
                {story.targetWordCount.toLocaleString()} words
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${getProgressPercentage(story)}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Chapters:</span>
              <span>{story.chapters}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Characters:</span>
              <span>{story.characters}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Scenes:</span>
              <span>{story.scenes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Timeline:</span>
              <span>{story.timelineEvents}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Created: {story.createdAt.toLocaleDateString()}</span>
            <span>Edited: {story.lastEdited.toLocaleDateString()}</span>
          </div>

          {story.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {story.tags.slice(0, 3).map((tag, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {story.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{story.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Stories</h1>
          <p className="text-muted-foreground">
            Manage and organize all your writing projects
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Story
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stories</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.totalStories}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Words</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsData.totalWords.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsData.completedStories}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(statsData.averageProgress)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
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
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="drafting">Drafting</SelectItem>
              <SelectItem value="revising">Revising</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          <Select value={genreFilter} onValueChange={setGenreFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              {uniqueGenres.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={favoritesFilter} onValueChange={setFavoritesFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Favorites" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stories</SelectItem>
              <SelectItem value="favorites">Favorites Only</SelectItem>
              <SelectItem value="non-favorites">Non-Favorites</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lastEdited">Last Edited</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="progress">Progress</SelectItem>
              <SelectItem value="wordCount">Word Count</SelectItem>
              <SelectItem value="created">Created Date</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stories Grid/List */}
      {sortedStories.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No stories found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ||
            statusFilter !== "all" ||
            genreFilter !== "all" ||
            favoritesFilter !== "all"
              ? "Try adjusting your filters to see more stories."
              : "Create your first story to get started on your writing journey."}
          </p>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Story
          </Button>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              : "space-y-4"
          }
        >
          {sortedStories.map((story) => renderStoryCard(story))}
        </div>
      )}

      {/* Create/Edit Story Dialog */}
      <Dialog
        open={createDialogOpen || editDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setCreateDialogOpen(false);
            setEditDialogOpen(false);
            setSelectedStory(null);
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedStory ? "Edit Story" : "Create New Story"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="story-title">Story Title</Label>
              <Input
                id="story-title"
                value={storyForm.title}
                onChange={(e) =>
                  setStoryForm({ ...storyForm, title: e.target.value })
                }
                placeholder="Enter your story title..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="story-description">Description</Label>
              <Textarea
                id="story-description"
                value={storyForm.description}
                onChange={(e) =>
                  setStoryForm({ ...storyForm, description: e.target.value })
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
                  value={storyForm.genre}
                  onValueChange={(value) =>
                    setStoryForm({ ...storyForm, genre: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fantasy">Fantasy</SelectItem>
                    <SelectItem value="Science Fiction">
                      Science Fiction
                    </SelectItem>
                    <SelectItem value="Romance">Romance</SelectItem>
                    <SelectItem value="Mystery">Mystery</SelectItem>
                    <SelectItem value="Thriller">Thriller</SelectItem>
                    <SelectItem value="Horror">Horror</SelectItem>
                    <SelectItem value="Literary Fiction">
                      Literary Fiction
                    </SelectItem>
                    <SelectItem value="Young Adult">Young Adult</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="story-word-count">Target Word Count</Label>
                <Input
                  id="story-word-count"
                  type="number"
                  value={storyForm.targetWordCount}
                  onChange={(e) =>
                    setStoryForm({
                      ...storyForm,
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
                value={storyForm.tags}
                onChange={(e) =>
                  setStoryForm({ ...storyForm, tags: e.target.value })
                }
                placeholder="fantasy, adventure, magic, etc. (comma separated)"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="story-notes">Notes</Label>
              <Textarea
                id="story-notes"
                value={storyForm.notes}
                onChange={(e) =>
                  setStoryForm({ ...storyForm, notes: e.target.value })
                }
                placeholder="Any initial thoughts, themes, or ideas for your story..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setCreateDialogOpen(false);
                  setEditDialogOpen(false);
                  setSelectedStory(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={selectedStory ? handleUpdateStory : handleCreateStory}
                disabled={!storyForm.title.trim()}
              >
                {selectedStory ? "Update Story" : "Create Story"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
