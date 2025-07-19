import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Clock,
  FileText,
  Target,
  Trash2,
  Copy,
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

// Function to calculate total story word count from all chapters
const calculateStoryWordCount = (chapters: any[]): number => {
  return chapters.reduce(
    (total, chapter) => total + (chapter.wordCount || 0),
    0,
  );
};

const mockChapters = [
  {
    id: 1,
    title: "The Beginning",
    wordCount: 2847,
    status: "completed",
    lastEdited: "2 hours ago",
    summary:
      "Introduction to the main character and the world they live in. Sets up the conflict.",
  },
  {
    id: 2,
    title: "A Strange Discovery",
    wordCount: 3201,
    status: "completed",
    lastEdited: "1 day ago",
    summary: "The protagonist discovers something that changes everything.",
  },
  {
    id: 3,
    title: "The First Challenge",
    wordCount: 2156,
    status: "in-progress",
    lastEdited: "2 days ago",
    summary: "First major obstacle that tests the protagonist's resolve.",
  },
  {
    id: 4,
    title: "Allies and Enemies",
    wordCount: 0,
    status: "draft",
    lastEdited: "Never",
    summary: "",
  },
];

export default function Chapters() {
  const { currentStory } = useStory();

  // Store chapters per story using story ID as key
  const [storyChapters, setStoryChapters] = useState<
    Record<string, typeof mockChapters>
  >({});

  // Get chapters for current story
  const chapters = currentStory ? storyChapters[currentStory.id] || [] : [];
  const [selectedChapter, setSelectedChapter] = useState<any>(null);
  const [chapterTitle, setChapterTitle] = useState(
    selectedChapter?.title || "",
  );
  const [chapterStatus, setChapterStatus] = useState(
    selectedChapter?.status || "draft",
  );
  const [chapterSummary, setChapterSummary] = useState(
    selectedChapter?.summary || "",
  );
  const [chapterContent, setChapterContent] = useState(
    selectedChapter
      ? `# ${selectedChapter.title}\n\nStart writing your chapter here...`
      : "",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [outlineOpen, setOutlineOpen] = useState(false);

  // Initialize chapters for current story if not exists
  useEffect(() => {
    if (currentStory && !storyChapters[currentStory.id]) {
      // Initialize with sample chapters for "The Script Reader's Legacy"
      if (currentStory.id === "story-1") {
        setStoryChapters((prev) => ({
          ...prev,
          [currentStory.id]: mockChapters,
        }));
      } else {
        // New stories start with empty chapters
        setStoryChapters((prev) => ({
          ...prev,
          [currentStory.id]: [],
        }));
      }
    }
  }, [currentStory, storyChapters]);

  // Set selected chapter when story changes
  useEffect(() => {
    if (currentStory && chapters.length > 0 && !selectedChapter) {
      setSelectedChapter(chapters[0]);
    } else if (!currentStory) {
      setSelectedChapter(null);
    }
  }, [currentStory, chapters, selectedChapter]);

  // Update form fields when selected chapter changes
  useEffect(() => {
    if (selectedChapter) {
      setChapterTitle(selectedChapter.title);
      setChapterStatus(selectedChapter.status);
      setChapterSummary(selectedChapter.summary);
      setChapterContent(
        `# ${selectedChapter.title}\n\n## Chapter Opening\n\nStart writing your chapter here...\n\n[Setting: Establish where and when this chapter takes place]\n\n[Character Focus: Who is the main character in this chapter?]\n\n## Key Events\n\n[Plot Point 1: What happens first?]\n\n[Plot Point 2: What is the main conflict or challenge?]\n\n[Plot Point 3: How does this chapter advance the story?]\n\n## Chapter Ending\n\n[Conclusion: How does this chapter end? What happens next?]\n\n---\n\n*Chapter Notes: Add any additional thoughts or reminders here*`,
      );
    } else {
      setChapterTitle("");
      setChapterStatus("draft");
      setChapterSummary("");
      setChapterContent("");
    }
  }, [selectedChapter]);

  // Button handlers
  const handleNewChapter = () => {
    console.log("handleNewChapter called, currentStory:", currentStory);
    if (!currentStory) {
      console.error("No current story selected");
      alert("Please select a story first to add chapters");
      return;
    }

    const newChapter = {
      id: Math.max(...chapters.map((ch) => ch.id), 0) + 1,
      title: `New Chapter ${chapters.length + 1}`,
      wordCount: 0,
      status: "draft" as const,
      lastEdited: "Just now",
      summary:
        "Briefly describe what happens in this chapter and its purpose in the story...",
    };

    const updatedChapters = [...chapters, newChapter];
    setStoryChapters((prev) => ({
      ...prev,
      [currentStory.id]: updatedChapters,
    }));
    setSelectedChapter(newChapter);

    // Focus on the title field after a short delay
    setTimeout(() => {
      const titleInput = document.getElementById("chapter-title");
      if (titleInput) {
        titleInput.focus();
        titleInput.select();
      }
    }, 100);
  };

  const handlePreview = () => {
    setPreviewOpen(true);
  };

  const handleOutline = () => {
    setOutlineOpen(true);
  };

  // Extract headings from chapter content for outline
  const getOutlineItems = () => {
    const lines = chapterContent.split("\n");
    return lines
      .filter((line) => line.startsWith("#"))
      .map((line, index) => {
        const level = line.match(/^#+/)?.[0].length || 1;
        const text = line.replace(/^#+\s*/, "");
        return { level, text, index };
      });
  };

  const handleSave = () => {
    console.log("handleSave called, currentStory:", currentStory);
    if (!currentStory) {
      console.error("No current story selected");
      alert("Please select a story first to save chapters");
      return;
    }
    // TODO: Implement save functionality
    alert("Chapter saved successfully!");
  };

  const handlePublish = () => {
    console.log("handlePublish called, currentStory:", currentStory);
    if (!currentStory) {
      console.error("No current story selected");
      alert("Please select a story first to publish chapters");
      return;
    }
    // TODO: Implement publish functionality
    alert("Chapter published successfully!");
  };

  const handleDeleteChapter = (chapterId: number) => {
    if (!currentStory) return;

    const updatedChapters = chapters.filter((ch) => ch.id !== chapterId);
    setStoryChapters((prev) => ({
      ...prev,
      [currentStory.id]: updatedChapters,
    }));

    // If we deleted the selected chapter, select the first remaining one
    if (selectedChapter?.id === chapterId && updatedChapters.length > 0) {
      setSelectedChapter(updatedChapters[0]);
    } else if (selectedChapter?.id === chapterId) {
      setSelectedChapter(null);
    }
  };

  const handleDuplicateChapter = (chapterId: number) => {
    if (!currentStory) return;

    const chapterToDuplicate = chapters.find((ch) => ch.id === chapterId);
    if (chapterToDuplicate) {
      const newChapter = {
        ...chapterToDuplicate,
        id: Math.max(...chapters.map((ch) => ch.id), 0) + 1,
        title: `${chapterToDuplicate.title} (Copy)`,
        lastEdited: "Just now",
      };
      const updatedChapters = [...chapters, newChapter];
      setStoryChapters((prev) => ({
        ...prev,
        [currentStory.id]: updatedChapters,
      }));
    }
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

  // Show no story selected state
  if (!currentStory) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Story Selected</h3>
          <p className="text-muted-foreground mb-4">
            Please select or create a story to manage chapters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Chapters Sidebar */}
      <div className="w-80 border-r bg-card">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Chapters</h2>
            <Button size="sm" onClick={handleNewChapter}>
              <Plus className="h-4 w-4 mr-2" />
              New
            </Button>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search chapters..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Chapters</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {chapters.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No chapters yet</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  onClick={handleNewChapter}
                >
                  Create your first chapter
                </Button>
              </div>
            ) : (
              chapters.map((chapter) => (
                <Card
                  key={chapter.id}
                  className={`mb-2 cursor-pointer transition-all hover:shadow-md ${
                    selectedChapter?.id === chapter.id
                      ? "ring-2 ring-primary"
                      : ""
                  }`}
                  onClick={() => setSelectedChapter(chapter)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-sm leading-tight">
                        {chapter.title}
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
                            onClick={() => handleDuplicateChapter(chapter.id)}
                          >
                            <Copy className="h-3 w-3 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteChapter(chapter.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-3 w-3 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getStatusColor(chapter.status)}>
                        {chapter.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {chapter.wordCount} words
                      </span>
                    </div>

                    {chapter.summary && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {chapter.summary}
                      </p>
                    )}

                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {chapter.lastEdited}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {/* Editor Header */}
        <div className="p-4 border-b bg-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-primary" />
              <div>
                <h1 className="text-xl font-semibold">{chapterTitle}</h1>
                <p className="text-sm text-muted-foreground">
                  {selectedChapter
                    ? `Chapter ${selectedChapter.id}`
                    : "No chapter selected"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePreview}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm" onClick={handleOutline}>
                <FileText className="h-4 w-4 mr-2" />
                Outline
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Word Count:</span>
              <span className="font-medium">{countWords(chapterContent)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Last Saved:</span>
              <span className="font-medium">2 min ago</span>
            </div>
            <div className="flex items-center gap-2">
              <Edit className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Status:</span>
              <Badge className={getStatusColor(chapterStatus)}>
                {chapterStatus}
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
                  <Label htmlFor="chapter-title">Chapter Title</Label>
                  <Input
                    id="chapter-title"
                    value={chapterTitle}
                    onChange={(e) => setChapterTitle(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="chapter-status">Status</Label>
                  <Select
                    value={chapterStatus}
                    onValueChange={setChapterStatus}
                  >
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
                <Label htmlFor="chapter-summary">Chapter Summary</Label>
                <Textarea
                  id="chapter-summary"
                  placeholder="Brief summary of what happens in this chapter..."
                  value={chapterSummary}
                  onChange={(e) => setChapterSummary(e.target.value)}
                  className="mt-1"
                  rows={2}
                />
              </div>
            </div>

            <Separator className="my-6" />

            <div>
              <Label
                htmlFor="chapter-content"
                className="text-base font-medium"
              >
                Chapter Content
              </Label>
              <Textarea
                id="chapter-content"
                value={chapterContent}
                onChange={(e) => setChapterContent(e.target.value)}
                className="mt-2 min-h-96 font-serif text-base leading-relaxed"
                placeholder="Start writing your chapter here..."
              />
            </div>

            <div className="mt-6 flex justify-between items-center text-sm text-muted-foreground">
              <span>Auto-save enabled • Last saved 2 minutes ago</span>
              <span>
                {chapterContent.split(" ").length} words •{" "}
                {Math.ceil(chapterContent.split(" ").length / 250)} min read
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Preview: {chapterTitle}</DialogTitle>
          </DialogHeader>
          <div className="prose prose-lg max-w-none mt-4">
            <div className="whitespace-pre-wrap font-serif leading-relaxed">
              {chapterContent}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Outline Modal */}
      <Dialog open={outlineOpen} onOpenChange={setOutlineOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chapter Outline: {chapterTitle}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {getOutlineItems().length > 0 ? (
              <div className="space-y-2">
                {getOutlineItems().map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2"
                    style={{ paddingLeft: `${(item.level - 1) * 16}px` }}
                  >
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    <span className="text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                No headings found. Add headings (starting with #) to your
                chapter content to create an outline.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
