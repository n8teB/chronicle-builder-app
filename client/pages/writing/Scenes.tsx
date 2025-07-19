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
import {
  PenTool,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Clock,
  Users,
  MapPin,
  Target,
  Trash2,
  Copy,
  Play,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useStory } from "@/contexts/StoryContext";

// Utility function for accurate word counting
const countWords = (text: string): number => {
  if (!text || typeof text !== "string") return 0;
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
};

const mockScenes = [
  {
    id: 1,
    title: "Opening Scene",
    chapter: "Chapter 1",
    location: "Elena's Apartment",
    characters: ["Elena", "Mysterious Letter"],
    wordCount: 456,
    status: "completed",
    lastEdited: "1 hour ago",
    timeOfDay: "Morning",
    summary: "Elena discovers the mysterious letter that changes everything.",
    content: `Elena stared at the envelope that had been slipped under her door sometime during the night. The elegant script of her name across the front was written in a deep purple ink that seemed to shimmer in the morning light.

She had never seen handwriting quite like it - each letter was perfectly formed, almost calligraphic, yet there was something otherworldly about it that made her hands tremble slightly as she reached for it.

The paper felt unusual too, thicker than normal stationery, with a texture that reminded her of parchment. As she carefully opened the seal, a faint scent of lavender and something else - something she couldn't quite identify - wafted up to greet her.`,
  },
  {
    id: 2,
    title: "The Library Entrance",
    chapter: "Chapter 1",
    location: "City Library",
    characters: ["Elena"],
    wordCount: 342,
    status: "completed",
    lastEdited: "2 hours ago",
    timeOfDay: "Late Morning",
    summary: "Elena arrives at the library as instructed by the letter.",
    content: "",
  },
  {
    id: 3,
    title: "Meeting the Librarian",
    chapter: "Chapter 1",
    location: "Library - Main Hall",
    characters: ["Elena", "Marcus (Librarian)"],
    wordCount: 0,
    status: "in-progress",
    lastEdited: "3 days ago",
    timeOfDay: "Noon",
    summary:
      "Elena meets the mysterious librarian who knows more than he lets on.",
    content: "",
  },
  {
    id: 4,
    title: "The Hidden Room",
    chapter: "Chapter 2",
    location: "Library - Secret Room",
    characters: ["Elena", "Marcus"],
    wordCount: 0,
    status: "draft",
    lastEdited: "Never",
    timeOfDay: "Afternoon",
    summary: "",
    content: "",
  },
];

const timeOfDayOptions = [
  "Dawn",
  "Morning",
  "Late Morning",
  "Noon",
  "Afternoon",
  "Evening",
  "Night",
  "Late Night",
];

export default function Scenes() {
  const { currentStory } = useStory();

  // Store scenes per story using story ID as key
  const [storyScenes, setStoryScenes] = useState<
    Record<string, typeof mockScenes>
  >({});

  // Get scenes for current story
  const scenes = currentStory ? storyScenes[currentStory.id] || [] : [];
  const [selectedScene, setSelectedScene] = useState<any>(null);

  // Initialize scenes for current story if not exists
  useEffect(() => {
    if (currentStory && !storyScenes[currentStory.id]) {
      // Initialize with sample scenes for "The Script Reader's Legacy"
      if (currentStory.id === "story-1") {
        setStoryScenes((prev) => ({
          ...prev,
          [currentStory.id]: mockScenes,
        }));
      } else {
        // New stories start with empty scenes
        setStoryScenes((prev) => ({
          ...prev,
          [currentStory.id]: [],
        }));
      }
    }
  }, [currentStory, storyScenes]);

  // Set selected scene when story changes
  useEffect(() => {
    if (currentStory && scenes.length > 0 && !selectedScene) {
      setSelectedScene(scenes[0]);
    } else if (!currentStory) {
      setSelectedScene(null);
    }
  }, [currentStory, scenes, selectedScene]);
  const [sceneTitle, setSceneTitle] = useState(selectedScene?.title || "");
  const [sceneChapter, setSceneChapter] = useState(
    selectedScene?.chapter || "",
  );
  const [sceneLocation, setSceneLocation] = useState(
    selectedScene?.location || "",
  );
  const [sceneCharacters, setSceneCharacters] = useState(
    selectedScene?.characters?.join(", ") || "",
  );
  const [sceneTimeOfDay, setSceneTimeOfDay] = useState(
    selectedScene?.timeOfDay || "",
  );
  const [sceneSummary, setSceneSummary] = useState(
    selectedScene?.summary || "",
  );
  const [sceneStatus, setSceneStatus] = useState(
    selectedScene?.status || "draft",
  );
  const [sceneContent, setSceneContent] = useState(
    selectedScene?.content || "",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [chapterFilter, setChapterFilter] = useState("all");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [characterViewOpen, setCharacterViewOpen] = useState(false);

  // Update form fields when selected scene changes
  useEffect(() => {
    if (selectedScene) {
      setSceneTitle(selectedScene.title);
      setSceneChapter(selectedScene.chapter);
      setSceneLocation(selectedScene.location);
      setSceneCharacters(selectedScene.characters.join(", "));
      setSceneTimeOfDay(selectedScene.timeOfDay);
      setSceneSummary(selectedScene.summary);
      setSceneStatus(selectedScene.status);
      setSceneContent(selectedScene.content);
    } else {
      setSceneTitle("");
      setSceneChapter("");
      setSceneLocation("");
      setSceneCharacters("");
      setSceneTimeOfDay("");
      setSceneSummary("");
      setSceneStatus("draft");
      setSceneContent("");
    }
  }, [selectedScene]);

  // Button handlers
  const handleNewScene = () => {
    console.log("handleNewScene called, currentStory:", currentStory);
    if (!currentStory) {
      console.error("No current story selected");
      alert("Please select a story first to add scenes");
      return;
    }

    const newScene = {
      id: Math.max(...scenes.map((sc) => sc.id), 0) + 1,
      title: `New Scene ${scenes.length + 1}`,
      chapter: "Chapter 1",
      location: "Where does this scene take place?",
      characters: [],
      wordCount: 0,
      status: "draft" as const,
      lastEdited: "Just now",
      timeOfDay: "Morning",
      summary:
        "What happens in this scene? Describe the key events and purpose...",
      content:
        "Write your scene here...\n\n[Setting: Describe the environment and atmosphere]\n\n[Action: What happens in this scene?]\n\n[Dialogue: Include character interactions]\n\n[Outcome: How does this scene advance the story?]",
    };

    const updatedScenes = [...scenes, newScene];
    setStoryScenes((prev) => ({
      ...prev,
      [currentStory.id]: updatedScenes,
    }));
    setSelectedScene(newScene);

    // Focus on the title field after a short delay
    setTimeout(() => {
      const titleInput = document.getElementById("scene-title");
      if (titleInput) {
        titleInput.focus();
        titleInput.select();
      }
    }, 100);
  };

  const handleDeleteScene = (sceneId: number) => {
    if (!currentStory) return;

    const updatedScenes = scenes.filter((sc) => sc.id !== sceneId);
    setStoryScenes((prev) => ({
      ...prev,
      [currentStory.id]: updatedScenes,
    }));

    if (selectedScene?.id === sceneId && updatedScenes.length > 0) {
      setSelectedScene(updatedScenes[0]);
    } else if (selectedScene?.id === sceneId) {
      setSelectedScene(null);
    }
  };

  const handleDuplicateScene = (sceneId: number) => {
    if (!currentStory) return;

    const sceneToDuplicate = scenes.find((sc) => sc.id === sceneId);
    if (sceneToDuplicate) {
      const newScene = {
        ...sceneToDuplicate,
        id: Math.max(...scenes.map((sc) => sc.id), 0) + 1,
        title: `${sceneToDuplicate.title} (Copy)`,
        lastEdited: "Just now",
      };
      const updatedScenes = [...scenes, newScene];
      setStoryScenes((prev) => ({
        ...prev,
        [currentStory.id]: updatedScenes,
      }));
    }
  };

  const handlePreview = () => {
    setPreviewOpen(true);
  };

  const handleCharacterView = () => {
    setCharacterViewOpen(true);
  };

  const handleSave = () => {
    if (!selectedScene || !currentStory) return;

    // Update the scene in the list
    const updatedScenes = scenes.map((scene) =>
      scene.id === selectedScene.id
        ? {
            ...scene,
            title: sceneTitle,
            chapter: sceneChapter,
            location: sceneLocation,
            characters: sceneCharacters
              .split(",")
              .map((c) => c.trim())
              .filter((c) => c),
            timeOfDay: sceneTimeOfDay,
            summary: sceneSummary,
            status: sceneStatus,
            content: sceneContent,
            wordCount: countWords(sceneContent),
            lastEdited: "Just now",
          }
        : scene,
    );
    setStoryScenes((prev) => ({
      ...prev,
      [currentStory.id]: updatedScenes,
    }));
    alert("Scene saved successfully!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // Filter scenes based on search and filters
  const filteredScenes = scenes.filter((scene) => {
    const matchesSearch =
      scene.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scene.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scene.characters.some((char) =>
        char.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesStatus =
      statusFilter === "all" || scene.status === statusFilter;
    const matchesChapter =
      chapterFilter === "all" || scene.chapter === chapterFilter;
    return matchesSearch && matchesStatus && matchesChapter;
  });

  const uniqueChapters = [...new Set(scenes.map((scene) => scene.chapter))];

  // Show no story selected state
  if (!currentStory) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <PenTool className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Story Selected</h3>
          <p className="text-muted-foreground mb-4">
            Please select or create a story to manage scenes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Scenes Sidebar */}
      <div className="w-80 border-r bg-card">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Scenes</h2>
            <Button
              size="sm"
              onClick={(e) => {
                console.log("New Scene button clicked");
                e.preventDefault();
                handleNewScene();
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              New
            </Button>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search scenes..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>

              <Select value={chapterFilter} onValueChange={setChapterFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Chapter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Chapters</SelectItem>
                  {uniqueChapters.map((chapter) => (
                    <SelectItem key={chapter} value={chapter}>
                      {chapter}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredScenes.map((scene) => (
              <Card
                key={scene.id}
                className={`mb-2 cursor-pointer transition-all hover:shadow-md ${
                  selectedScene?.id === scene.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedScene(scene)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-sm leading-tight">
                      {scene.title}
                    </h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateScene(scene.id);
                          }}
                        >
                          <Copy className="h-3 w-3 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteScene(scene.id);
                          }}
                          className="text-destructive"
                        >
                          <Trash2 className="h-3 w-3 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(scene.status)}>
                        {scene.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {scene.wordCount} words
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{scene.location || "No location"}</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>{scene.characters.length} characters</span>
                    </div>
                  </div>

                  {scene.summary && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {scene.summary}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{scene.chapter}</span>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {scene.lastEdited}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {/* Editor Header */}
        <div className="p-4 border-b bg-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <PenTool className="h-5 w-5 text-primary" />
              <div>
                <h1 className="text-xl font-semibold">{sceneTitle}</h1>
                <p className="text-sm text-muted-foreground">
                  {selectedScene
                    ? `Scene ${selectedScene.id}`
                    : "No scene selected"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePreview}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm" onClick={handleCharacterView}>
                <Users className="h-4 w-4 mr-2" />
                Characters
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Target className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Words:</span>
              <span className="font-medium">
                {sceneContent.split(" ").filter((w) => w).length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Location:</span>
              <span className="font-medium">{sceneLocation || "None"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Time:</span>
              <span className="font-medium">{sceneTimeOfDay}</span>
            </div>
            <div className="flex items-center gap-2">
              <Edit className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Status:</span>
              <Badge className={getStatusColor(sceneStatus)}>
                {sceneStatus}
              </Badge>
            </div>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="scene-title">Scene Title</Label>
                  <Input
                    id="scene-title"
                    value={sceneTitle}
                    onChange={(e) => setSceneTitle(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="scene-chapter">Chapter</Label>
                  <Input
                    id="scene-chapter"
                    value={sceneChapter}
                    onChange={(e) => setSceneChapter(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="scene-location">Location</Label>
                  <Input
                    id="scene-location"
                    value={sceneLocation}
                    onChange={(e) => setSceneLocation(e.target.value)}
                    placeholder="Where does this scene take place?"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="scene-time">Time of Day</Label>
                  <Select
                    value={sceneTimeOfDay}
                    onValueChange={setSceneTimeOfDay}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOfDayOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="scene-status">Status</Label>
                  <Select value={sceneStatus} onValueChange={setSceneStatus}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="scene-characters">Characters Present</Label>
                <Input
                  id="scene-characters"
                  value={sceneCharacters}
                  onChange={(e) => setSceneCharacters(e.target.value)}
                  placeholder="Elena, Marcus, etc. (comma separated)"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="scene-summary">Scene Summary</Label>
                <Textarea
                  id="scene-summary"
                  placeholder="Brief summary of what happens in this scene..."
                  value={sceneSummary}
                  onChange={(e) => setSceneSummary(e.target.value)}
                  className="mt-1"
                  rows={2}
                />
              </div>
            </div>

            <Separator className="my-6" />

            <div>
              <Label htmlFor="scene-content" className="text-base font-medium">
                Scene Content
              </Label>
              <Textarea
                id="scene-content"
                value={sceneContent}
                onChange={(e) => setSceneContent(e.target.value)}
                className="mt-2 min-h-96 font-serif text-base leading-relaxed"
                placeholder="Start writing your scene here..."
              />
            </div>

            <div className="mt-6 flex justify-between items-center text-sm text-muted-foreground">
              <span>Auto-save enabled • Last saved just now</span>
              <span>
                {sceneContent.split(" ").filter((w) => w).length} words •{" "}
                {Math.ceil(
                  sceneContent.split(" ").filter((w) => w).length / 250,
                )}{" "}
                min read
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Preview: {sceneTitle}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <strong>Location:</strong> {sceneLocation}
              </div>
              <div>
                <strong>Time:</strong> {sceneTimeOfDay}
              </div>
              <div>
                <strong>Chapter:</strong> {sceneChapter}
              </div>
              <div>
                <strong>Characters:</strong> {sceneCharacters || "None"}
              </div>
            </div>
            <Separator className="my-4" />
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap font-serif leading-relaxed">
                {sceneContent || "No content yet."}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Character View Modal */}
      <Dialog open={characterViewOpen} onOpenChange={setCharacterViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Scene Characters: {sceneTitle}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {sceneCharacters
              .split(",")
              .map((c) => c.trim())
              .filter((c) => c).length > 0 ? (
              <div className="space-y-3">
                {sceneCharacters
                  .split(",")
                  .map((c) => c.trim())
                  .filter((c) => c)
                  .map((character, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{character}</div>
                        <div className="text-sm text-muted-foreground">
                          Present in this scene
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                No characters assigned to this scene yet. Add characters in the
                "Characters Present" field.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
