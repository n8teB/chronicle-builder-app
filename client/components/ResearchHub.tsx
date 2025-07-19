import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Bookmark,
  Image,
  Link as LinkIcon,
  FileText,
  Tag,
  Plus,
  Edit,
  Trash2,
  Star,
  Heart,
  Eye,
  Download,
  Upload,
  Globe,
  Camera,
  Palette,
  Book,
  MapPin,
  Users,
  Clock,
  MoreVertical,
  Grid,
  List,
  Filter,
  Copy,
  ExternalLink,
  PaintBucket,
  X,
} from "lucide-react";
import { useStory } from "@/contexts/StoryContext";

interface ResearchItem {
  id: string;
  type: "clip" | "note" | "image" | "link" | "quote";
  title: string;
  content: string;
  url?: string;
  imageUrl?: string;
  tags: string[];
  category: string;
  isFavorite: boolean;
  dateCreated: Date;
  lastModified: Date;
  wordCount?: number;
  source?: string;
  notes?: string;
}

interface InspirationBoard {
  id: string;
  name: string;
  description: string;
  items: string[]; // ResearchItem IDs
  images: string[]; // Image URLs or base64 data
  color: string;
  dateCreated: Date;
  isPublic: boolean;
  tags: string[];
}

interface MoodCollection {
  id: string;
  name: string;
  description: string;
  images: string[];
  colorPalette: string[];
  theme: string;
  dateCreated: Date;
  items: string[]; // ResearchItem IDs
}

export function ResearchHub() {
  const { currentStory } = useStory();
  const [researchItems, setResearchItems] = useState<ResearchItem[]>([]);
  const [inspirationBoards, setInspirationBoards] = useState<
    InspirationBoard[]
  >([]);
  const [moodCollections, setMoodCollections] = useState<MoodCollection[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<InspirationBoard | null>(
    null,
  );
  const [selectedMood, setSelectedMood] = useState<MoodCollection | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [newItemDialog, setNewItemDialog] = useState(false);
  const [newBoardDialog, setNewBoardDialog] = useState(false);
  const [newMoodDialog, setNewMoodDialog] = useState(false);
  const [imageUploadDialog, setImageUploadDialog] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<"board" | "mood" | null>(
    null,
  );
  const [newItemData, setNewItemData] = useState({
    type: "clip" as ResearchItem["type"],
    title: "",
    content: "",
    url: "",
    category: "",
    tags: [] as string[],
    source: "",
  });

  const categories = [
    "Character Research",
    "Setting & World",
    "Plot Ideas",
    "Historical Context",
    "Technical Details",
    "Inspiration",
    "Reference Material",
    "Writing Craft",
  ];

  const itemTypeIcons = {
    clip: Globe,
    note: FileText,
    image: Image,
    link: LinkIcon,
    quote: Book,
  };

  useEffect(() => {
    loadResearchData();
  }, [currentStory]);

  const loadResearchData = () => {
    if (!currentStory) return;

    const items = localStorage.getItem(`research-${currentStory.id}`);
    if (items) {
      setResearchItems(
        JSON.parse(items).map((item: any) => ({
          ...item,
          dateCreated: new Date(item.dateCreated),
          lastModified: new Date(item.lastModified),
        })),
      );
    }

    const boards = localStorage.getItem(
      `inspiration-boards-${currentStory.id}`,
    );
    if (boards) {
      setInspirationBoards(
        JSON.parse(boards).map((board: any) => ({
          ...board,
          dateCreated: new Date(board.dateCreated),
        })),
      );
    }

    const moods = localStorage.getItem(`mood-collections-${currentStory.id}`);
    if (moods) {
      setMoodCollections(
        JSON.parse(moods).map((mood: any) => ({
          ...mood,
          dateCreated: new Date(mood.dateCreated),
        })),
      );
    }
  };

  const saveResearchData = () => {
    if (!currentStory) return;
    localStorage.setItem(
      `research-${currentStory.id}`,
      JSON.stringify(researchItems),
    );
    localStorage.setItem(
      `inspiration-boards-${currentStory.id}`,
      JSON.stringify(inspirationBoards),
    );
    localStorage.setItem(
      `mood-collections-${currentStory.id}`,
      JSON.stringify(moodCollections),
    );
  };

  const createResearchItem = () => {
    if (!newItemData.title.trim()) return;

    const newItem: ResearchItem = {
      id: `research-${Date.now()}`,
      type: newItemData.type,
      title: newItemData.title,
      content: newItemData.content,
      url: newItemData.url,
      tags: newItemData.tags,
      category: newItemData.category,
      isFavorite: false,
      dateCreated: new Date(),
      lastModified: new Date(),
      source: newItemData.source,
      wordCount:
        newItemData.content.split(" ").filter(Boolean).length || undefined,
    };

    const updatedItems = [...researchItems, newItem];
    setResearchItems(updatedItems);
    setNewItemDialog(false);
    setNewItemData({
      type: "clip",
      title: "",
      content: "",
      url: "",
      category: "",
      tags: [],
      source: "",
    });
    saveResearchData();
  };

  const createInspirationBoard = (name: string, description: string) => {
    const newBoard: InspirationBoard = {
      id: `board-${Date.now()}`,
      name,
      description,
      items: [],
      images: [],
      color: "#3b82f6",
      dateCreated: new Date(),
      isPublic: false,
      tags: [],
    };

    const updatedBoards = [...inspirationBoards, newBoard];
    setInspirationBoards(updatedBoards);
    setNewBoardDialog(false);
    saveResearchData();
  };

  const createMoodCollection = (
    name: string,
    description: string,
    theme: string,
  ) => {
    const newMood: MoodCollection = {
      id: `mood-${Date.now()}`,
      name,
      description,
      images: [],
      colorPalette: ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b"],
      theme,
      dateCreated: new Date(),
      items: [],
    };

    const updatedMoods = [...moodCollections, newMood];
    setMoodCollections(updatedMoods);
    setNewMoodDialog(false);
    saveResearchData();
  };

  const toggleFavorite = (itemId: string) => {
    const updatedItems = researchItems.map((item) =>
      item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item,
    );
    setResearchItems(updatedItems);
    saveResearchData();
  };

  const deleteItem = (itemId: string) => {
    const updatedItems = researchItems.filter((item) => item.id !== itemId);
    setResearchItems(updatedItems);
    saveResearchData();
  };

  const deleteInspirationBoard = (boardId: string) => {
    const updatedBoards = inspirationBoards.filter(
      (board) => board.id !== boardId,
    );
    setInspirationBoards(updatedBoards);
    saveResearchData();
  };

  const deleteMoodCollection = (moodId: string) => {
    const updatedMoods = moodCollections.filter((mood) => mood.id !== moodId);
    setMoodCollections(updatedMoods);
    saveResearchData();
  };

  const addToBoard = (itemId: string, boardId: string) => {
    const updatedBoards = inspirationBoards.map((board) =>
      board.id === boardId
        ? { ...board, items: [...board.items, itemId] }
        : board,
    );
    setInspirationBoards(updatedBoards);
    saveResearchData();
  };

  const handleImageUpload = async (
    files: FileList,
    targetId: string,
    targetType: "board" | "mood",
  ) => {
    const imagePromises = Array.from(files).map((file) => {
      return new Promise<string>((resolve, reject) => {
        if (!file.type.startsWith("image/")) {
          reject(new Error("File must be an image"));
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    try {
      const imageDataUrls = await Promise.all(imagePromises);

      if (targetType === "board") {
        const updatedBoards = inspirationBoards.map((board) =>
          board.id === targetId
            ? { ...board, images: [...board.images, ...imageDataUrls] }
            : board,
        );
        setInspirationBoards(updatedBoards);
      } else if (targetType === "mood") {
        const updatedMoods = moodCollections.map((mood) =>
          mood.id === targetId
            ? { ...mood, images: [...mood.images, ...imageDataUrls] }
            : mood,
        );
        setMoodCollections(updatedMoods);
      }

      saveResearchData();
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  const removeImageFromBoard = (boardId: string, imageIndex: number) => {
    const updatedBoards = inspirationBoards.map((board) =>
      board.id === boardId
        ? {
            ...board,
            images: board.images.filter((_, index) => index !== imageIndex),
          }
        : board,
    );
    setInspirationBoards(updatedBoards);
    saveResearchData();
  };

  const removeImageFromMood = (moodId: string, imageIndex: number) => {
    const updatedMoods = moodCollections.map((mood) =>
      mood.id === moodId
        ? {
            ...mood,
            images: mood.images.filter((_, index) => index !== imageIndex),
          }
        : mood,
    );
    setMoodCollections(updatedMoods);
    saveResearchData();
  };

  const openImageUpload = (targetId: string, targetType: "board" | "mood") => {
    if (targetType === "board") {
      setSelectedBoard(
        inspirationBoards.find((b) => b.id === targetId) || null,
      );
    } else {
      setSelectedMood(moodCollections.find((m) => m.id === targetId) || null);
    }
    setUploadTarget(targetType);
    setImageUploadDialog(true);
  };

  const filteredItems = researchItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;

    const matchesTags =
      filterTags.length === 0 ||
      filterTags.some((tag) => item.tags.includes(tag));

    return matchesSearch && matchesCategory && matchesTags;
  });

  const allTags = Array.from(
    new Set(researchItems.flatMap((item) => item.tags)),
  );

  if (!currentStory) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>Select a story to manage research</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Research Hub</h2>
          <p className="text-muted-foreground">
            Collect, organize, and find inspiration for your story
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={newItemDialog} onOpenChange={setNewItemDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Research
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Research Item</DialogTitle>
                <DialogDescription>
                  Clip from web, add notes, or save inspiration
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Type</Label>
                  <Select
                    value={newItemData.type}
                    onValueChange={(value: ResearchItem["type"]) =>
                      setNewItemData((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clip">Web Clip</SelectItem>
                      <SelectItem value="note">Note</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="link">Link</SelectItem>
                      <SelectItem value="quote">Quote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter title..."
                    value={newItemData.title}
                    onChange={(e) =>
                      setNewItemData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Enter content, notes, or description..."
                    rows={4}
                    value={newItemData.content}
                    onChange={(e) =>
                      setNewItemData((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                  />
                </div>
                {(newItemData.type === "clip" ||
                  newItemData.type === "link" ||
                  newItemData.type === "image") && (
                  <div>
                    <Label htmlFor="url">URL</Label>
                    <Input
                      id="url"
                      placeholder="https://..."
                      value={newItemData.url}
                      onChange={(e) =>
                        setNewItemData((prev) => ({
                          ...prev,
                          url: e.target.value,
                        }))
                      }
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newItemData.category}
                    onValueChange={(value) =>
                      setNewItemData((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    placeholder="research, character, inspiration"
                    onChange={(e) =>
                      setNewItemData((prev) => ({
                        ...prev,
                        tags: e.target.value
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter(Boolean),
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="source">Source</Label>
                  <Input
                    id="source"
                    placeholder="Website, book, article, etc."
                    value={newItemData.source}
                    onChange={(e) =>
                      setNewItemData((prev) => ({
                        ...prev,
                        source: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setNewItemDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={createResearchItem}
                  disabled={!newItemData.title.trim()}
                >
                  Add Research
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="research" className="space-y-4">
        <TabsList>
          <TabsTrigger value="research">
            <Search className="h-4 w-4 mr-2" />
            Research
          </TabsTrigger>
          <TabsTrigger value="boards">
            <Grid className="h-4 w-4 mr-2" />
            Inspiration Boards
          </TabsTrigger>
          <TabsTrigger value="moods">
            <Palette className="h-4 w-4 mr-2" />
            Mood Collections
          </TabsTrigger>
        </TabsList>

        <TabsContent value="research" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex gap-2 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search research..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
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

          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No research items found</p>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-4"
              }
            >
              {filteredItems.map((item) => {
                const IconComponent = itemTypeIcons[item.type];
                return (
                  <Card
                    key={item.id}
                    className={viewMode === "list" ? "flex" : ""}
                  >
                    <CardHeader className={viewMode === "list" ? "flex-1" : ""}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4" />
                          <CardTitle className="text-sm">
                            {item.title}
                          </CardTitle>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFavorite(item.id)}
                          >
                            <Heart
                              className={`h-4 w-4 ${
                                item.isFavorite
                                  ? "fill-red-500 text-red-500"
                                  : ""
                              }`}
                            />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  navigator.clipboard.writeText(item.content)
                                }
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Copy Content
                              </DropdownMenuItem>
                              {item.url && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    window.open(item.url, "_blank")
                                  }
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Open Link
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => deleteItem(item.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      {item.category && (
                        <CardDescription>{item.category}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent
                      className={viewMode === "list" ? "flex-1" : ""}
                    >
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                        {item.content}
                      </p>
                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {item.tags.slice(0, 3).map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {item.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{item.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        {item.dateCreated.toLocaleDateString()}
                        {item.source && ` • ${item.source}`}
                        {item.wordCount && ` • ${item.wordCount} words`}
                      </div>
                    </CardContent>
                    {inspirationBoards.length > 0 && (
                      <CardFooter className="pt-0">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              <Grid className="h-4 w-4 mr-2" />
                              Add to Board
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {inspirationBoards.map((board) => (
                              <DropdownMenuItem
                                key={board.id}
                                onClick={() => addToBoard(item.id, board.id)}
                              >
                                {board.name}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardFooter>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="boards" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Inspiration Boards</h3>
            <Dialog open={newBoardDialog} onOpenChange={setNewBoardDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Board
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Inspiration Board</DialogTitle>
                  <DialogDescription>
                    Organize your research into themed collections
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="board-name">Board Name</Label>
                    <Input
                      id="board-name"
                      placeholder="e.g., Character Inspiration, World Building"
                    />
                  </div>
                  <div>
                    <Label htmlFor="board-description">Description</Label>
                    <Textarea
                      id="board-description"
                      placeholder="Describe the purpose of this board..."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setNewBoardDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      const name = (
                        document.getElementById(
                          "board-name",
                        ) as HTMLInputElement
                      )?.value;
                      const description = (
                        document.getElementById(
                          "board-description",
                        ) as HTMLTextAreaElement
                      )?.value;
                      if (name) createInspirationBoard(name, description);
                    }}
                  >
                    Create Board
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inspirationBoards.map((board) => (
              <Card key={board.id} className="hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: board.color }}
                      />
                      {board.name}
                    </CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => openImageUpload(board.id, "board")}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Add Images
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteInspirationBoard(board.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Board
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription>{board.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {board.images && board.images.length > 0 && (
                    <div className="mb-4">
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        {board.images.slice(0, 4).map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Board image ${index + 1}`}
                              className="w-full h-16 object-cover rounded"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() =>
                                removeImageFromBoard(board.id, index)
                              }
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      {board.images.length > 4 && (
                        <div className="text-xs text-muted-foreground">
                          +{board.images.length - 4} more images
                        </div>
                      )}
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground">
                    {board.items.length} items • {board.images?.length || 0}{" "}
                    images
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Created {board.dateCreated.toLocaleDateString()}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => openImageUpload(board.id, "board")}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Add Images
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="moods" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Mood Collections</h3>
            <Dialog open={newMoodDialog} onOpenChange={setNewMoodDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Collection
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Mood Collection</DialogTitle>
                  <DialogDescription>
                    Capture the visual and emotional tone of your story
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="mood-name">Collection Name</Label>
                    <Input
                      id="mood-name"
                      placeholder="e.g., Dark Academia, Cyberpunk City"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mood-description">Description</Label>
                    <Textarea
                      id="mood-description"
                      placeholder="Describe the mood and atmosphere..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="mood-theme">Theme</Label>
                    <Input
                      id="mood-theme"
                      placeholder="e.g., mysterious, futuristic, romantic"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setNewMoodDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      const name = (
                        document.getElementById("mood-name") as HTMLInputElement
                      )?.value;
                      const description = (
                        document.getElementById(
                          "mood-description",
                        ) as HTMLTextAreaElement
                      )?.value;
                      const theme = (
                        document.getElementById(
                          "mood-theme",
                        ) as HTMLInputElement
                      )?.value;
                      if (name) createMoodCollection(name, description, theme);
                    }}
                  >
                    Create Collection
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {moodCollections.map((mood) => (
              <Card key={mood.id} className="hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <PaintBucket className="h-4 w-4" />
                      {mood.name}
                    </CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => openImageUpload(mood.id, "mood")}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Add Images
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteMoodCollection(mood.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Collection
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription>{mood.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {mood.images && mood.images.length > 0 && (
                    <div className="mb-4">
                      <div className="grid grid-cols-3 gap-1 mb-2">
                        {mood.images.slice(0, 6).map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Mood image ${index + 1}`}
                              className="w-full h-12 object-cover rounded"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-0.5 right-0.5 h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() =>
                                removeImageFromMood(mood.id, index)
                              }
                            >
                              <X className="h-2 w-2" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      {mood.images.length > 6 && (
                        <div className="text-xs text-muted-foreground">
                          +{mood.images.length - 6} more images
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex gap-1 mb-3">
                    {mood.colorPalette.slice(0, 5).map((color, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Theme: {mood.theme}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {mood.items.length} items • {mood.images?.length || 0}{" "}
                    images • Created {mood.dateCreated.toLocaleDateString()}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => openImageUpload(mood.id, "mood")}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Add Images
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Image Upload Dialog */}
      <Dialog open={imageUploadDialog} onOpenChange={setImageUploadDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Upload Images</DialogTitle>
            <DialogDescription>
              Add images to{" "}
              {uploadTarget === "board"
                ? "inspiration board"
                : "mood collection"}
              :{" "}
              {uploadTarget === "board"
                ? selectedBoard?.name
                : selectedMood?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="image-upload">Select Images</Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  if (
                    e.target.files &&
                    uploadTarget &&
                    (selectedBoard || selectedMood)
                  ) {
                    const targetId =
                      uploadTarget === "board"
                        ? selectedBoard?.id
                        : selectedMood?.id;
                    if (targetId) {
                      handleImageUpload(e.target.files, targetId, uploadTarget);
                      setImageUploadDialog(false);
                    }
                  }
                }}
                className="cursor-pointer"
              />
              <div className="text-xs text-muted-foreground mt-1">
                You can select multiple images at once. Supported formats: JPG,
                PNG, GIF, WebP
              </div>
            </div>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                Drag and drop images here, or click to browse
              </p>
              <Input
                type="file"
                accept="image/*"
                multiple
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => {
                  if (
                    e.target.files &&
                    uploadTarget &&
                    (selectedBoard || selectedMood)
                  ) {
                    const targetId =
                      uploadTarget === "board"
                        ? selectedBoard?.id
                        : selectedMood?.id;
                    if (targetId) {
                      handleImageUpload(e.target.files, targetId, uploadTarget);
                      setImageUploadDialog(false);
                    }
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setImageUploadDialog(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
