import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  FileText,
  Users,
  Globe,
  Clock,
  BookOpen,
  Edit,
  Filter,
  X,
  Bookmark,
  MessageSquare,
  Highlighter,
  GitBranch,
  BookTemplate,
} from "lucide-react";
import { useStory } from "@/contexts/StoryContext";

interface SearchResult {
  id: string;
  type:
    | "character"
    | "worldElement"
    | "note"
    | "scene"
    | "chapter"
    | "research"
    | "comment"
    | "annotation"
    | "version"
    | "template";
  title: string;
  content: string;
  preview: string;
  storyId: string;
  lastEdited: string;
  tags?: string[];
  matchType: "title" | "content" | "tag";
  matchText: string;
}

interface SearchFilters {
  contentType:
    | "all"
    | "character"
    | "worldElement"
    | "note"
    | "scene"
    | "chapter"
    | "research"
    | "comment"
    | "annotation"
    | "version"
    | "template";
  storyFilter: "all" | "current";
  dateRange: "all" | "week" | "month" | "year";
}

export function GlobalSearch() {
  const { currentStory, stories } = useStory();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    contentType: "all",
    storyFilter: "current",
    dateRange: "all",
  });
  const [isSearching, setIsSearching] = useState(false);

  // Mock data - in a real app this would come from your data store
  const getAllContent = () => {
    const allContent: any[] = [];

    // Get all stories content
    stories.forEach((story) => {
      // Characters
      const characters = JSON.parse(
        localStorage.getItem(`chronicle-characters-${story.id}`) || "[]",
      );
      characters.forEach((char: any) => {
        allContent.push({
          id: `char-${char.id}`,
          type: "character",
          title: char.name,
          content: `${char.description} ${char.personality} ${char.backstory}`,
          preview: char.description || "No description",
          storyId: story.id,
          storyTitle: story.title,
          lastEdited: char.lastEdited || "Unknown",
          tags: char.relationships || [],
        });
      });

      // World Elements
      const worldElements = JSON.parse(
        localStorage.getItem(`chronicle-world-${story.id}`) || "[]",
      );
      worldElements.forEach((element: any) => {
        allContent.push({
          id: `world-${element.id}`,
          type: "worldElement",
          title: element.name,
          content: `${element.description} ${element.culture} ${element.history}`,
          preview: element.description || "No description",
          storyId: story.id,
          storyTitle: story.title,
          lastEdited: element.lastEdited || "Unknown",
          tags: element.tags || [],
        });
      });

      // Notes
      const notes = JSON.parse(
        localStorage.getItem(`chronicle-notes-${story.id}`) || "[]",
      );
      notes.forEach((note: any) => {
        allContent.push({
          id: `note-${note.id}`,
          type: "note",
          title: note.title,
          content: note.content,
          preview: note.content?.slice(0, 150) || "No content",
          storyId: story.id,
          storyTitle: story.title,
          lastEdited: note.lastEdited || "Unknown",
          tags: note.tags || [],
        });
      });

      // Scenes
      const scenes = JSON.parse(
        localStorage.getItem(`chronicle-scenes-${story.id}`) || "[]",
      );
      scenes.forEach((scene: any) => {
        allContent.push({
          id: `scene-${scene.id}`,
          type: "scene",
          title: scene.title,
          content: `${scene.summary} ${scene.content}`,
          preview: scene.summary || "No summary",
          storyId: story.id,
          storyTitle: story.title,
          lastEdited: scene.lastEdited || "Unknown",
          tags: scene.characters || [],
        });
      });

      // Chapters
      const chapters = JSON.parse(
        localStorage.getItem(`chronicle-chapters-${story.id}`) || "[]",
      );
      chapters.forEach((chapter: any) => {
        allContent.push({
          id: `chapter-${chapter.id}`,
          type: "chapter",
          title: chapter.title,
          content: chapter.summary || "",
          preview: chapter.summary || "No summary",
          storyId: story.id,
          storyTitle: story.title,
          lastEdited: chapter.lastEdited || "Unknown",
          tags: [],
        });
      });

      // Research Items
      const research = JSON.parse(
        localStorage.getItem(`research-${story.id}`) || "[]",
      );
      research.forEach((item: any) => {
        allContent.push({
          id: `research-${item.id}`,
          type: "research",
          title: item.title,
          content: `${item.content} ${item.notes || ""} ${item.source || ""}`,
          preview: item.content?.slice(0, 150) || "No content",
          storyId: story.id,
          storyTitle: story.title,
          lastEdited: item.dateCreated || "Unknown",
          tags: item.tags || [],
        });
      });

      // Comments
      const comments = JSON.parse(
        localStorage.getItem(`comments-${story.id}`) || "[]",
      );
      comments.forEach((comment: any) => {
        allContent.push({
          id: `comment-${comment.id}`,
          type: "comment",
          title: `Comment on ${comment.targetSection || "content"}`,
          content: comment.content,
          preview: comment.content?.slice(0, 150) || "No content",
          storyId: story.id,
          storyTitle: story.title,
          lastEdited: comment.timestamp || "Unknown",
          tags: comment.tags || [],
        });
      });

      // Annotations
      const annotations = JSON.parse(
        localStorage.getItem(`annotations-${story.id}`) || "[]",
      );
      annotations.forEach((annotation: any) => {
        allContent.push({
          id: `annotation-${annotation.id}`,
          type: "annotation",
          title: `Annotation: "${annotation.text?.slice(0, 30)}..."`,
          content: `${annotation.text} ${annotation.note}`,
          preview:
            annotation.note?.slice(0, 150) ||
            annotation.text?.slice(0, 150) ||
            "No content",
          storyId: story.id,
          storyTitle: story.title,
          lastEdited: annotation.timestamp || "Unknown",
          tags: annotation.tags || [],
        });
      });

      // Story Versions
      const versions = JSON.parse(
        localStorage.getItem(`story-versions-${story.id}`) || "[]",
      );
      versions.forEach((version: any) => {
        allContent.push({
          id: `version-${version.id}`,
          type: "version",
          title: version.name,
          content: `${version.description} ${version.changes?.map((c: any) => c.description).join(" ") || ""}`,
          preview: version.description?.slice(0, 150) || "No description",
          storyId: story.id,
          storyTitle: story.title,
          lastEdited: version.timestamp || "Unknown",
          tags: version.tags || [],
        });
      });
    });

    // Story Templates (global, not story-specific)
    const templates = JSON.parse(
      localStorage.getItem("story-templates") || "[]",
    );
    templates.forEach((template: any) => {
      allContent.push({
        id: `template-${template.id}`,
        type: "template",
        title: template.name,
        content: `${template.description} ${template.content} ${template.prompts?.join(" ") || ""}`,
        preview: template.description?.slice(0, 150) || "No description",
        storyId: "global",
        storyTitle: "Story Templates",
        lastEdited: template.dateCreated || "Unknown",
        tags: template.tags || [],
      });
    });

    return allContent;
  };

  // Perform search
  const performSearch = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }

    setIsSearching(true);
    const allContent = getAllContent();
    const query = searchQuery.toLowerCase();
    const searchResults: SearchResult[] = [];

    allContent.forEach((item) => {
      // Apply filters
      if (filters.contentType !== "all" && item.type !== filters.contentType) {
        return;
      }

      if (
        filters.storyFilter === "current" &&
        currentStory &&
        item.storyId !== currentStory.id
      ) {
        return;
      }

      // Search in title
      if (item.title.toLowerCase().includes(query)) {
        searchResults.push({
          ...item,
          matchType: "title",
          matchText: item.title,
          preview: item.preview.slice(0, 150),
        });
        return;
      }

      // Search in content
      if (item.content && item.content.toLowerCase().includes(query)) {
        const index = item.content.toLowerCase().indexOf(query);
        const start = Math.max(0, index - 50);
        const end = Math.min(item.content.length, index + 100);
        const preview = item.content.slice(start, end);

        searchResults.push({
          ...item,
          matchType: "content",
          matchText: preview,
          preview: preview,
        });
        return;
      }

      // Search in tags
      if (
        item.tags &&
        item.tags.some((tag: string) => tag.toLowerCase().includes(query))
      ) {
        const matchingTag = item.tags.find((tag: string) =>
          tag.toLowerCase().includes(query),
        );

        searchResults.push({
          ...item,
          matchType: "tag",
          matchText: matchingTag || "",
          preview: item.preview.slice(0, 150),
        });
      }
    });

    setTimeout(() => setIsSearching(false), 200);
    return searchResults.slice(0, 50); // Limit results
  }, [searchQuery, filters, currentStory, stories]);

  useEffect(() => {
    setResults(performSearch);
  }, [performSearch]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "character":
        return <Users className="h-4 w-4" />;
      case "worldElement":
        return <Globe className="h-4 w-4" />;
      case "note":
        return <FileText className="h-4 w-4" />;
      case "scene":
        return <Edit className="h-4 w-4" />;
      case "chapter":
        return <BookOpen className="h-4 w-4" />;
      case "research":
        return <Bookmark className="h-4 w-4" />;
      case "comment":
        return <MessageSquare className="h-4 w-4" />;
      case "annotation":
        return <Highlighter className="h-4 w-4" />;
      case "version":
        return <GitBranch className="h-4 w-4" />;
      case "template":
        return <BookTemplate className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "character":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "worldElement":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "note":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "scene":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "chapter":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "research":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300";
      case "comment":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300";
      case "annotation":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300";
      case "version":
        return "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300";
      case "template":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(
      `(${query.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")})`,
      "gi",
    );
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark
          key={index}
          className="bg-yellow-200 dark:bg-yellow-800 px-0.5 rounded"
        >
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  const handleResultClick = (result: SearchResult) => {
    // Navigate to the appropriate page based on result type
    const pageMap = {
      character: "/story/characters",
      worldElement: "/story/world",
      note: "/writing/notes",
      scene: "/writing/scenes",
      chapter: "/writing/chapters",
      research: "/research",
      comment: "/comments",
      annotation: "/comments",
      version: "/versions",
      template: "/templates",
    };

    const targetUrl = pageMap[result.type as keyof typeof pageMap];
    if (targetUrl) {
      window.location.href = targetUrl;
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Search className="h-4 w-4 mr-2" />
          Search All Content
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Global Search</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 flex flex-col">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search across all your stories, characters, notes, and more..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>

          {/* Filters */}
          <div className="flex gap-4 items-center flex-wrap">
            <Select
              value={filters.contentType}
              onValueChange={(value: any) =>
                setFilters({ ...filters, contentType: value })
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="character">Characters</SelectItem>
                <SelectItem value="worldElement">World Elements</SelectItem>
                <SelectItem value="note">Notes</SelectItem>
                <SelectItem value="scene">Scenes</SelectItem>
                <SelectItem value="chapter">Chapters</SelectItem>
                <SelectItem value="research">Research Items</SelectItem>
                <SelectItem value="comment">Comments</SelectItem>
                <SelectItem value="annotation">Annotations</SelectItem>
                <SelectItem value="version">Versions</SelectItem>
                <SelectItem value="template">Templates</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.storyFilter}
              onValueChange={(value: any) =>
                setFilters({ ...filters, storyFilter: value })
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stories</SelectItem>
                <SelectItem value="current">Current Story</SelectItem>
              </SelectContent>
            </Select>

            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>

          {/* Results */}
          <div className="flex-1 min-h-0">
            {searchQuery && (
              <div className="mb-2 text-sm text-muted-foreground">
                {isSearching
                  ? "Searching..."
                  : `${results.length} results found`}
              </div>
            )}

            <ScrollArea className="h-full">
              <div className="space-y-2">
                {searchQuery && results.length === 0 && !isSearching && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No results found for "{searchQuery}"</p>
                  </div>
                )}

                {results.map((result) => (
                  <Card
                    key={result.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleResultClick(result)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">{getTypeIcon(result.type)}</div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium truncate">
                              {highlightMatch(result.title, searchQuery)}
                            </h4>
                            <Badge
                              variant="secondary"
                              className={getTypeColor(result.type)}
                            >
                              {result.type}
                            </Badge>
                          </div>

                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {highlightMatch(result.preview, searchQuery)}
                          </p>

                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{result.storyTitle}</span>
                            <span>•</span>
                            <span>Updated {result.lastEdited}</span>
                            <span>•</span>
                            <span className="capitalize">
                              Match in {result.matchType}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          {!searchQuery && (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Start typing to search across all your content</p>
              <p className="text-sm mt-1">
                Search characters, world elements, notes, scenes, and chapters
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
