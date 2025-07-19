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
  FileText,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Clock,
  Tag,
  BookOpen,
  Users,
  Target,
  Trash2,
  Copy,
  Star,
  StarIcon,
  Pin,
  Link,
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

const mockNotes = [
  {
    id: 1,
    title: "Character Backstory - Elena",
    content: `# Elena's Past

## Childhood
Elena grew up in a small town where strange things were often dismissed as imagination. Her grandmother always told her stories about "the old ways" and magic that once existed in the world.

## Key Memories
- Age 7: Saw lights dancing in the forest that her parents said were fireflies
- Age 12: Found an old book in grandmother's attic written in symbols she somehow understood
- Age 16: Grandmother passed away, leaving Elena feeling disconnected from the magical stories

## Present Day
Now works as a librarian (ironic given the story), lives alone in a city apartment, feels like something is missing from her life but can't put her finger on what.

## Personality Traits
- Curious and intellectual
- Slightly introverted but brave when needed
- Has always felt different but tries to fit in
- Strong intuition that she often ignores`,
    tags: ["character", "backstory", "Elena", "main-character"],
    category: "Character Development",
    linkedTo: ["Chapter 1", "Chapter 2"],
    priority: "high",
    isPinned: true,
    isFavorite: true,
    wordCount: 156,
    createdAt: "2024-01-15",
    lastEdited: "2 hours ago",
  },
  {
    id: 2,
    title: "Magic System Rules",
    content: `# Magic System Overview

## Basic Principles
1. Magic is tied to written language and symbols
2. The older the script, the more powerful the magic
3. Only certain people can read and channel the ancient scripts
4. Overuse causes physical and mental exhaustion

## Limitations
- Requires physical written medium (paper, stone, etc.)
- Stronger magic needs rare materials (special inks, parchments)
- User must understand the meaning, not just copy symbols
- Some spells have permanent consequences

## Power Levels
- Novice: Simple effects (light, heat, basic illusions)
- Adept: Complex effects (transformation, healing, communication)
- Master: Reality-altering effects (time manipulation, dimensional travel)

## Risks
- Misreading can cause spell backfire
- Ancient texts may contain curses or traps
- Power can be addictive
- Some knowledge comes with a price`,
    tags: ["worldbuilding", "magic-system", "rules", "important"],
    category: "World Building",
    linkedTo: ["Characters", "Chapter 3"],
    priority: "high",
    isPinned: true,
    isFavorite: false,
    wordCount: 189,
    createdAt: "2024-01-14",
    lastEdited: "1 day ago",
  },
  {
    id: 3,
    title: "Plot Twist Ideas",
    content: `# Potential Plot Twists

## The Librarian
- Marcus isn't just a librarian - he's a guardian of ancient knowledge
- He's been waiting specifically for Elena
- The library itself is a magical nexus

## Elena's Heritage
- Her grandmother was part of an ancient order
- Elena's ability to read the scripts is hereditary
- She's the last in a bloodline of "Script Readers"

## The Letter
- Not sent by who she thinks
- Contains a binding spell that's already taking effect
- Multiple people received similar letters - Elena isn't the only one

## Modern Magic
- Magic never disappeared, it just went underground
- Technology and magic coexist in secret
- Some corporations are fronts for magical organizations

## Time Element
- Events are repeating from centuries ago
- Elena has lived this before in past lives
- The choice she makes determines the fate of magic in the world`,
    tags: ["plot", "twists", "ideas", "brainstorming"],
    category: "Plot Development",
    linkedTo: [],
    priority: "medium",
    isPinned: false,
    isFavorite: true,
    wordCount: 167,
    createdAt: "2024-01-13",
    lastEdited: "3 days ago",
  },
  {
    id: 4,
    title: "Research - Ancient Scripts",
    content: `# Research Notes on Ancient Writing Systems

## Real Historical Scripts
- Cuneiform (oldest known writing)
- Egyptian Hieroglyphs
- Linear A (still undeciphered)
- Rongorongo (Easter Island script)
- Voynich Manuscript

## Fictional Elements to Incorporate
- Scripts that change meaning based on reader's intent
- Symbols that only appear under certain conditions
- Writing that ages and evolves over time
- Multi-dimensional text (meaning changes with perspective)

## Visual Ideas
- Flowing, organic letters that look almost alive
- Geometric patterns that form words
- Scripts that incorporate color as part of meaning
- Text that seems to shimmer or move slightly

## Sources to Research Further
- Celtic ogham script
- Alchemical symbols
- Astronomical charts and symbols
- Mathematical notation systems`,
    tags: ["research", "scripts", "writing-systems", "worldbuilding"],
    category: "Research",
    linkedTo: ["Magic System"],
    priority: "low",
    isPinned: false,
    isFavorite: false,
    wordCount: 134,
    createdAt: "2024-01-12",
    lastEdited: "5 days ago",
  },
  {
    id: 5,
    title: "Quick Idea - Dream Sequence",
    content: `Elena keeps having the same dream where she's standing in a vast library with books floating around her, all open to pages covered in glowing script. In the dream, she can read everything perfectly, but when she wakes up, she can only remember fragments.

The dream always ends with a voice calling her name from the shadows between the shelves.

Maybe this could be the opening of Chapter 2? Or a recurring element throughout the story?`,
    tags: ["dreams", "scene-idea", "quick-note"],
    category: "Scene Ideas",
    linkedTo: [],
    priority: "medium",
    isPinned: false,
    isFavorite: false,
    wordCount: 78,
    createdAt: "2024-01-16",
    lastEdited: "1 hour ago",
  },
];

const categories = [
  "Character Development",
  "Plot Development",
  "World Building",
  "Scene Ideas",
  "Research",
  "Dialogue",
  "Themes",
  "Other",
];

const priorities = ["low", "medium", "high"];

export default function Notes() {
  const { currentStory } = useStory();

  // Store notes per story using story ID as key
  const [storyNotes, setStoryNotes] = useState<
    Record<string, typeof mockNotes>
  >({});

  // Get notes for current story
  const notes = currentStory ? storyNotes[currentStory.id] || [] : [];
  const [selectedNote, setSelectedNote] = useState<any>(null);

  // Initialize notes for current story if not exists
  useEffect(() => {
    if (currentStory && !storyNotes[currentStory.id]) {
      // Initialize with sample notes for "The Script Reader's Legacy"
      if (currentStory.id === "story-1") {
        setStoryNotes((prev) => ({
          ...prev,
          [currentStory.id]: mockNotes,
        }));
      } else {
        // New stories start with empty notes
        setStoryNotes((prev) => ({
          ...prev,
          [currentStory.id]: [],
        }));
      }
    }
  }, [currentStory, storyNotes]);

  // Set selected note when story changes
  useEffect(() => {
    if (currentStory && notes.length > 0 && !selectedNote) {
      setSelectedNote(notes[0]);
    } else if (!currentStory) {
      setSelectedNote(null);
    }
  }, [currentStory, notes, selectedNote]);
  const [noteTitle, setNoteTitle] = useState(selectedNote?.title || "");
  const [noteContent, setNoteContent] = useState(selectedNote?.content || "");
  const [noteTags, setNoteTags] = useState(
    selectedNote?.tags?.join(", ") || "",
  );
  const [noteCategory, setNoteCategory] = useState(
    selectedNote?.category || "Other",
  );
  const [notePriority, setNotePriority] = useState(
    selectedNote?.priority || "medium",
  );
  const [noteLinkedTo, setNoteLinkedTo] = useState(
    selectedNote?.linkedTo?.join(", ") || "",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [tagsViewOpen, setTagsViewOpen] = useState(false);

  // Update form fields when selected note changes
  useEffect(() => {
    if (selectedNote) {
      setNoteTitle(selectedNote.title);
      setNoteContent(selectedNote.content);
      setNoteTags(selectedNote.tags?.join(", ") || "");
      setNoteCategory(selectedNote.category);
      setNotePriority(selectedNote.priority);
      setNoteLinkedTo(selectedNote.linkedTo?.join(", ") || "");
    } else {
      setNoteTitle("");
      setNoteContent("");
      setNoteTags("");
      setNoteCategory("Other");
      setNotePriority("medium");
      setNoteLinkedTo("");
    }
  }, [selectedNote]);

  // Button handlers
  const handleNewNote = () => {
    console.log("handleNewNote called, currentStory:", currentStory);
    if (!currentStory) {
      console.error("No current story selected");
      alert("Please select a story first to add notes");
      return;
    }

    const newNote = {
      id: Math.max(...notes.map((n) => n.id), 0) + 1,
      title: `New Note ${notes.length + 1}`,
      content:
        "Start writing your note here...\n\nThis is a great place to jot down ideas, plot points, research, or anything else related to your story.",
      tags: [],
      category: "Other",
      linkedTo: [],
      priority: "medium" as const,
      isPinned: false,
      isFavorite: false,
      wordCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
      lastEdited: "Just now",
    };

    const updatedNotes = [...notes, newNote];
    setStoryNotes((prev) => ({
      ...prev,
      [currentStory.id]: updatedNotes,
    }));
    setSelectedNote(newNote);

    // Focus on the title field after a short delay
    setTimeout(() => {
      const titleInput = document.getElementById("note-title");
      if (titleInput) {
        titleInput.focus();
        titleInput.select();
      }
    }, 100);
  };

  const handleDeleteNote = (noteId: number) => {
    if (!currentStory) return;

    const updatedNotes = notes.filter((n) => n.id !== noteId);
    setStoryNotes((prev) => ({
      ...prev,
      [currentStory.id]: updatedNotes,
    }));

    if (selectedNote?.id === noteId && updatedNotes.length > 0) {
      setSelectedNote(updatedNotes[0]);
    } else if (selectedNote?.id === noteId) {
      setSelectedNote(null);
    }
  };

  const handleDuplicateNote = (noteId: number) => {
    if (!currentStory) return;

    const noteToDuplicate = notes.find((n) => n.id === noteId);
    if (noteToDuplicate) {
      const newNote = {
        ...noteToDuplicate,
        id: Math.max(...notes.map((n) => n.id)) + 1,
        title: `${noteToDuplicate.title} (Copy)`,
        lastEdited: "Just now",
      };
      const updatedNotes = [...notes, newNote];
      setStoryNotes((prev) => ({
        ...prev,
        [currentStory.id]: updatedNotes,
      }));
    }
  };

  const handleToggleFavorite = (noteId: number) => {
    if (!currentStory) return;

    const updatedNotes = notes.map((note) =>
      note.id === noteId ? { ...note, isFavorite: !note.isFavorite } : note,
    );
    setStoryNotes((prev) => ({
      ...prev,
      [currentStory.id]: updatedNotes,
    }));
    if (selectedNote?.id === noteId) {
      setSelectedNote({
        ...selectedNote,
        isFavorite: !selectedNote.isFavorite,
      });
    }
  };

  const handleTogglePin = (noteId: number) => {
    if (!currentStory) return;

    const updatedNotes = notes.map((note) =>
      note.id === noteId ? { ...note, isPinned: !note.isPinned } : note,
    );
    setStoryNotes((prev) => ({
      ...prev,
      [currentStory.id]: updatedNotes,
    }));
    if (selectedNote?.id === noteId) {
      setSelectedNote({ ...selectedNote, isPinned: !selectedNote.isPinned });
    }
  };

  const handlePreview = () => {
    setPreviewOpen(true);
  };

  const handleTagsView = () => {
    setTagsViewOpen(true);
  };

  const handleSave = () => {
    if (!selectedNote || !currentStory) return;

    const updatedNotes = notes.map((note) =>
      note.id === selectedNote.id
        ? {
            ...note,
            title: noteTitle,
            content: noteContent,
            tags: noteTags
              .split(",")
              .map((t) => t.trim())
              .filter((t) => t),
            category: noteCategory,
            priority: notePriority,
            linkedTo: noteLinkedTo
              .split(",")
              .map((l) => l.trim())
              .filter((l) => l),
            wordCount: countWords(noteContent),
            lastEdited: "Just now",
          }
        : note,
    );
    setStoryNotes((prev) => ({
      ...prev,
      [currentStory.id]: updatedNotes,
    }));
    alert("Note saved successfully!");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // Filter notes based on search and filters
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesCategory =
      categoryFilter === "all" || note.category === categoryFilter;
    const matchesPriority =
      priorityFilter === "all" || note.priority === priorityFilter;
    const matchesFavorites = !showFavoritesOnly || note.isFavorite;
    const matchesPinned = !showPinnedOnly || note.isPinned;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPriority &&
      matchesFavorites &&
      matchesPinned
    );
  });

  // Sort notes: pinned first, then by last edited
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0; // Keep original order for same pin status
  });

  // Get all unique tags for the tags view
  const allTags = [...new Set(notes.flatMap((note) => note.tags))].sort();

  // Show no story selected state
  if (!currentStory) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Story Selected</h3>
          <p className="text-muted-foreground mb-4">
            Please select or create a story to manage notes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Notes Sidebar */}
      <div className="w-80 border-r bg-card">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Notes</h2>
            <Button
              size="sm"
              onClick={(e) => {
                console.log("New Note button clicked");
                e.preventDefault();
                handleNewNote();
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
                placeholder="Search notes..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
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

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                variant={showFavoritesOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className="flex-1"
              >
                <Star className="h-3 w-3 mr-1" />
                Favorites
              </Button>
              <Button
                variant={showPinnedOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowPinnedOnly(!showPinnedOnly)}
                className="flex-1"
              >
                <Pin className="h-3 w-3 mr-1" />
                Pinned
              </Button>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {sortedNotes.map((note) => (
              <Card
                key={note.id}
                className={`mb-2 cursor-pointer transition-all hover:shadow-md ${
                  selectedNote?.id === note.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedNote(note)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-2 flex-1">
                      <div className="flex flex-col gap-1">
                        {note.isPinned && (
                          <Pin className="h-3 w-3 text-primary" />
                        )}
                        {note.isFavorite && (
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                      <h3 className="font-medium text-sm leading-tight flex-1">
                        {note.title}
                      </h3>
                    </div>
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
                            handleToggleFavorite(note.id);
                          }}
                        >
                          <Star className="h-3 w-3 mr-2" />
                          {note.isFavorite ? "Remove from" : "Add to"} Favorites
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTogglePin(note.id);
                          }}
                        >
                          <Pin className="h-3 w-3 mr-2" />
                          {note.isPinned ? "Unpin" : "Pin"} Note
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateNote(note.id);
                          }}
                        >
                          <Copy className="h-3 w-3 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNote(note.id);
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
                      <Badge className={getPriorityColor(note.priority)}>
                        {note.priority}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {note.wordCount} words
                      </span>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {note.category}
                    </div>

                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {note.tags.slice(0, 3).map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs px-1 py-0"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {note.tags.length > 3 && (
                          <Badge
                            variant="secondary"
                            className="text-xs px-1 py-0"
                          >
                            +{note.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {note.content.replace(/^#+\s*/gm, "").substring(0, 100)}...
                  </p>

                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {note.lastEdited}
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
              <FileText className="h-5 w-5 text-accent-foreground" />
              <div>
                <h1 className="text-xl font-semibold">{noteTitle}</h1>
                <p className="text-sm text-muted-foreground">
                  {selectedNote
                    ? `Note ${selectedNote.id}`
                    : "No note selected"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePreview}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm" onClick={handleTagsView}>
                <Tag className="h-4 w-4 mr-2" />
                Tags
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
                {noteContent.split(" ").filter((w) => w).length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Tags:</span>
              <span className="font-medium">
                {selectedNote?.tags?.length || 0}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Category:</span>
              <span className="font-medium">{noteCategory}</span>
            </div>
            <div className="flex items-center gap-2">
              <Edit className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Priority:</span>
              <Badge className={getPriorityColor(notePriority)}>
                {notePriority}
              </Badge>
            </div>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4 mb-6">
              <div>
                <Label htmlFor="note-title">Note Title</Label>
                <Input
                  id="note-title"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="note-category">Category</Label>
                  <Select value={noteCategory} onValueChange={setNoteCategory}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
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
                  <Label htmlFor="note-priority">Priority</Label>
                  <Select value={notePriority} onValueChange={setNotePriority}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="note-linked">Linked To</Label>
                  <Input
                    id="note-linked"
                    value={noteLinkedTo}
                    onChange={(e) => setNoteLinkedTo(e.target.value)}
                    placeholder="Chapter 1, Elena, etc."
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="note-tags">Tags</Label>
                <Input
                  id="note-tags"
                  value={noteTags}
                  onChange={(e) => setNoteTags(e.target.value)}
                  placeholder="character, plot, worldbuilding, etc. (comma separated)"
                  className="mt-1"
                />
              </div>
            </div>

            <Separator className="my-6" />

            <div>
              <Label htmlFor="note-content" className="text-base font-medium">
                Note Content
              </Label>
              <Textarea
                id="note-content"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="mt-2 min-h-96 font-serif text-base leading-relaxed"
                placeholder="Start writing your note here... You can use # for headings, ## for subheadings, etc."
              />
            </div>

            <div className="mt-6 flex justify-between items-center text-sm text-muted-foreground">
              <span>Auto-save enabled • Last saved just now</span>
              <span>
                {noteContent.split(" ").filter((w) => w).length} words • Created{" "}
                {selectedNote?.createdAt || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Preview: {noteTitle}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <strong>Category:</strong> {noteCategory}
              </div>
              <div>
                <strong>Priority:</strong>{" "}
                <Badge className={getPriorityColor(notePriority)}>
                  {notePriority}
                </Badge>
              </div>
              <div>
                <strong>Tags:</strong> {noteTags || "None"}
              </div>
              <div>
                <strong>Linked To:</strong> {noteLinkedTo || "None"}
              </div>
            </div>
            <Separator className="my-4" />
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap font-serif leading-relaxed">
                {noteContent || "No content yet."}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tags View Modal */}
      <Dialog open={tagsViewOpen} onOpenChange={setTagsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>All Tags</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {allTags.length > 0 ? (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => {
                    const tagCount = notes.filter((note) =>
                      note.tags.includes(tag),
                    ).length;
                    return (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer hover:bg-secondary/80"
                        onClick={() => {
                          setSearchQuery(tag);
                          setTagsViewOpen(false);
                        }}
                      >
                        {tag} ({tagCount})
                      </Badge>
                    );
                  })}
                </div>
                <p className="text-sm text-muted-foreground">
                  Click on a tag to search for notes with that tag.
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                No tags found. Add tags to your notes to organize them better.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
