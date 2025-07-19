import { useState, useEffect, useRef } from "react";
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
  Clock,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Target,
  Trash2,
  Copy,
  Calendar,
  User,
  Star,
  Crown,
  Sword,
  Heart,
  BookOpen,
  MapPin,
  Zap,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Download,
  Upload,
  Settings,
  X,
} from "lucide-react";

interface TimelineEvent {
  id: number;
  title: string;
  date: string;
  category: string;
  type: "event" | "milestone" | "birth" | "death" | "other";
  description: string;
  characters: string[];
  location: string;
  importance: "low" | "medium" | "high" | "critical";
  duration?: string;
  consequences: string;
  relatedEvents: number[];
  tags: string[];
  notes: string;
  isEstimated: boolean;
  createdAt: Date;
  lastEdited: string;
}

interface Character {
  name: string;
  birthDate: string;
  deathDate?: string;
}

const mockEvents: TimelineEvent[] = [
  {
    id: 1,
    title: "Elena's Birth",
    date: "1996-03-15",
    category: "Personal",
    type: "birth",
    description:
      "Elena Voss is born in the small town of Millbrook. Her magical heritage remains hidden.",
    characters: ["Elena"],
    location: "Millbrook General Hospital",
    importance: "high",
    consequences:
      "Beginning of Elena's journey, sets up her connection to magical bloodline.",
    relatedEvents: [2, 3],
    tags: ["birth", "main-character", "beginning"],
    notes:
      "Born during a rare lunar eclipse - significant in magical tradition.",
    isEstimated: false,
    createdAt: new Date(),
    lastEdited: "2 days ago",
  },
  {
    id: 2,
    title: "Grandmother's Stories Begin",
    date: "2001-07-20",
    category: "Personal",
    type: "event",
    description:
      "Elena's grandmother starts telling her stories about 'the old ways' and magic.",
    characters: ["Elena", "Grandmother"],
    location: "Grandmother's house",
    importance: "medium",
    consequences: "Plants seeds of magical awareness in Elena's mind.",
    relatedEvents: [1, 3],
    tags: ["childhood", "magic", "family"],
    notes:
      "These stories are actually historical accounts disguised as fairy tales.",
    isEstimated: true,
    createdAt: new Date(),
    lastEdited: "2 days ago",
  },
  {
    id: 3,
    title: "First Magical Incident",
    date: "2003-10-31",
    category: "Magical",
    type: "milestone",
    description:
      "Elena, age 7, sees dancing lights in the forest that adults dismiss as fireflies.",
    characters: ["Elena"],
    location: "Millbrook Forest",
    importance: "medium",
    consequences: "First sign of Elena's magical sensitivity.",
    relatedEvents: [1, 2, 4],
    tags: ["magic", "childhood", "first-sign"],
    notes: "Halloween night - when the veil between worlds is thinnest.",
    isEstimated: false,
    createdAt: new Date(),
    lastEdited: "2 days ago",
  },
  {
    id: 4,
    title: "Discovery of Ancient Book",
    date: "2008-06-12",
    category: "Magical",
    type: "event",
    description:
      "Elena finds an old book in grandmother's attic written in symbols she can understand.",
    characters: ["Elena"],
    location: "Grandmother's attic",
    importance: "high",
    consequences: "Confirms Elena's ability to read ancient scripts.",
    relatedEvents: [3, 5],
    tags: ["magic", "discovery", "scripts"],
    notes: "The book is a primer on basic magical theory.",
    isEstimated: false,
    createdAt: new Date(),
    lastEdited: "2 days ago",
  },
  {
    id: 5,
    title: "Grandmother's Death",
    date: "2012-09-03",
    category: "Personal",
    type: "death",
    description:
      "Elena's grandmother passes away, leaving Elena feeling disconnected from magic.",
    characters: ["Elena", "Grandmother"],
    location: "Millbrook Hospital",
    importance: "critical",
    consequences:
      "Elena suppresses her magical awareness and moves to the city.",
    relatedEvents: [4, 6],
    tags: ["death", "family", "turning-point"],
    notes:
      "Grandmother's final words: 'The books will find you when you're ready.'",
    isEstimated: false,
    createdAt: new Date(),
    lastEdited: "2 days ago",
  },
  {
    id: 6,
    title: "Elena Moves to New Haven City",
    date: "2012-10-15",
    category: "Personal",
    type: "milestone",
    description:
      "Elena moves to New Haven City to attend university and start a new life.",
    characters: ["Elena"],
    location: "New Haven City",
    importance: "high",
    consequences:
      "Elena enters the hidden magical community's territory unknowingly.",
    relatedEvents: [5, 7],
    tags: ["move", "new-beginning", "city"],
    notes: "Unknowingly moves to a major magical hub.",
    isEstimated: false,
    createdAt: new Date(),
    lastEdited: "2 days ago",
  },
  {
    id: 7,
    title: "Elena Becomes Librarian",
    date: "2018-05-20",
    category: "Career",
    type: "milestone",
    description:
      "Elena graduates with library science degree and starts working at various libraries.",
    characters: ["Elena"],
    location: "New Haven University",
    importance: "medium",
    consequences: "Sets up Elena's eventual encounter with the Grand Library.",
    relatedEvents: [6, 8],
    tags: ["career", "education", "libraries"],
    notes: "Specializes in historical document preservation.",
    isEstimated: false,
    createdAt: new Date(),
    lastEdited: "2 days ago",
  },
  {
    id: 8,
    title: "The Mysterious Letter Arrives",
    date: "2024-01-15",
    category: "Magical",
    type: "event",
    description:
      "Elena receives the letter that will change everything - story begins.",
    characters: ["Elena"],
    location: "Elena's apartment",
    importance: "critical",
    consequences: "Catalyst event that begins the main story.",
    relatedEvents: [7],
    tags: ["letter", "beginning", "catalyst"],
    notes: "Written in ancient script that Elena can somehow read.",
    isEstimated: false,
    createdAt: new Date(),
    lastEdited: "1 hour ago",
  },
];

const mockCharacters: Character[] = [
  { name: "Elena", birthDate: "1996-03-15" },
  { name: "Grandmother", birthDate: "1932-11-20", deathDate: "2012-09-03" },
  { name: "Marcus", birthDate: "1979-07-08" },
  { name: "Sarah", birthDate: "1997-01-10" },
];

const eventCategories = [
  "Personal",
  "Magical",
  "Career",
  "Political",
  "Historical",
  "Cultural",
  "Romantic",
  "Adventure",
  "Other",
];

const eventTypes = ["event", "milestone", "birth", "death", "other"];
const importanceLevels = ["low", "medium", "high", "critical"];

export default function Timeline() {
  const { currentStory } = useStory();
  const [events, setEvents] = useState<TimelineEvent[]>(mockEvents);
  const [characters, setCharacters] = useState<Character[]>(mockCharacters);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(
    null,
  );
  const [newEventOpen, setNewEventOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [importanceFilter, setImportanceFilter] = useState("all");
  const [selectedCharacter, setSelectedCharacter] = useState("all");
  const [timelineView, setTimelineView] = useState<
    "linear" | "grouped" | "character"
  >("linear");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showCharacterAges, setShowCharacterAges] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Form state for new/edit event
  const [eventForm, setEventForm] = useState({
    title: "",
    date: "",
    category: "Personal",
    type: "event" as TimelineEvent["type"],
    description: "",
    characters: "",
    location: "",
    importance: "medium" as TimelineEvent["importance"],
    duration: "",
    consequences: "",
    tags: "",
    notes: "",
    isEstimated: false,
  });

  // Calculate character age at given date
  const calculateAge = (birthDate: string, targetDate: string): number => {
    const birth = new Date(birthDate);
    const target = new Date(targetDate);
    let age = target.getFullYear() - birth.getFullYear();
    const monthDiff = target.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && target.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Filter events based on current filters
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || event.category === categoryFilter;
    const matchesImportance =
      importanceFilter === "all" || event.importance === importanceFilter;
    const matchesCharacter =
      selectedCharacter === "all" ||
      event.characters.includes(selectedCharacter);

    return (
      matchesSearch && matchesCategory && matchesImportance && matchesCharacter
    );
  });

  // Sort events by date
  const sortedEvents = [...filteredEvents].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  // Group events by year for grouped view
  const groupedEvents = sortedEvents.reduce(
    (acc, event) => {
      const year = new Date(event.date).getFullYear();
      if (!acc[year]) acc[year] = [];
      acc[year].push(event);
      return acc;
    },
    {} as Record<number, TimelineEvent[]>,
  );

  // Get timeline span
  const getTimelineSpan = () => {
    if (sortedEvents.length === 0)
      return { start: currentYear, end: currentYear };
    const dates = sortedEvents.map((e) => new Date(e.date).getFullYear());
    return { start: Math.min(...dates), end: Math.max(...dates) };
  };

  const { start: timelineStart, end: timelineEnd } = getTimelineSpan();

  // Event handlers
  const handleNewEvent = () => {
    console.log("handleNewEvent called, currentStory:", currentStory);
    if (!currentStory) {
      console.error("No current story selected");
      alert("Please select a story first to add timeline events");
      return;
    }

    setEventForm({
      title: "",
      date: "",
      category: "Personal",
      type: "event",
      description: "",
      characters: "",
      location: "",
      importance: "medium",
      duration: "",
      consequences: "",
      tags: "",
      notes: "",
      isEstimated: false,
    });
    setSelectedEvent(null);
    setNewEventOpen(true);
  };

  const handleEditEvent = (event: TimelineEvent) => {
    setEventForm({
      title: event.title,
      date: event.date,
      category: event.category,
      type: event.type,
      description: event.description,
      characters: event.characters.join(", "),
      location: event.location,
      importance: event.importance,
      duration: event.duration || "",
      consequences: event.consequences,
      tags: event.tags.join(", "),
      notes: event.notes,
      isEstimated: event.isEstimated,
    });
    setSelectedEvent(event);
    setNewEventOpen(true);
  };

  const handleSaveEvent = () => {
    console.log("handleSaveEvent called, currentStory:", currentStory);
    if (!currentStory) {
      console.error("No current story selected");
      alert("Please select a story first to save timeline events");
      return;
    }

    const eventData = {
      ...eventForm,
      characters: eventForm.characters
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c),
      tags: eventForm.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t),
      relatedEvents: [],
      lastEdited: "Just now",
      createdAt: new Date(),
    };

    if (selectedEvent) {
      // Update existing event
      setEvents(
        events.map((e) =>
          e.id === selectedEvent?.id ? { ...selectedEvent, ...eventData } : e,
        ),
      );
    } else {
      // Create new event
      const newEvent: TimelineEvent = {
        id: Math.max(...events.map((e) => e.id)) + 1,
        ...eventData,
        relatedEvents: [],
        lastEdited: "Just now",
        createdAt: new Date(),
      };
      setEvents([...events, newEvent]);
    }

    setNewEventOpen(false);
  };

  const handleDeleteEvent = (eventId: number) => {
    setEvents(events.filter((e) => e.id !== eventId));
  };

  const handleDuplicateEvent = (event: TimelineEvent) => {
    const newEvent: TimelineEvent = {
      ...event,
      id: Math.max(...events.map((e) => e.id)) + 1,
      title: `${event.title} (Copy)`,
      lastEdited: "Just now",
      createdAt: new Date(),
    };
    setEvents([...events, newEvent]);
  };

  const handlePreview = () => {
    setPreviewOpen(true);
  };

  const handleSettings = () => {
    setSettingsOpen(true);
  };

  const handleExportTimeline = () => {
    const timelineData = {
      story: currentStory?.title || "Untitled Story",
      events: sortedEvents,
      characters: characters,
      metadata: {
        totalEvents: events.length,
        timelineSpan: `${timelineStart} - ${timelineEnd}`,
        exportDate: new Date().toISOString(),
        viewMode: timelineView,
      },
    };

    const dataStr = JSON.stringify(timelineData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentStory?.title || "timeline"}-timeline.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const handleImportEvents = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,.csv";

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;

          if (file.name.endsWith(".json")) {
            const data = JSON.parse(content);
            if (data.events && Array.isArray(data.events)) {
              const importedEvents = data.events.map(
                (event: any, index: number) => ({
                  ...event,
                  id: Math.max(...events.map((e) => e.id), 0) + index + 1,
                  createdAt: new Date(),
                  lastEdited: "Imported",
                }),
              );
              setEvents([...events, ...importedEvents]);
              alert(`Successfully imported ${importedEvents.length} events!`);
            }
          } else if (file.name.endsWith(".csv")) {
            // Basic CSV parsing for events
            const lines = content.split("\n");
            const importedEvents = lines
              .slice(1)
              .filter((line) => line.trim())
              .map((line, index) => {
                const values = line.split(",");
                return {
                  id: Math.max(...events.map((e) => e.id), 0) + index + 1,
                  title: values[0] || "Imported Event",
                  date: values[1] || new Date().toISOString().split("T")[0],
                  category: values[2] || "Other",
                  type: (values[3] as any) || "event",
                  description: values[4] || "",
                  characters: values[5] ? values[5].split(";") : [],
                  location: values[6] || "",
                  importance: (values[7] as any) || "medium",
                  consequences: values[8] || "",
                  relatedEvents: [],
                  tags: values[9] ? values[9].split(";") : [],
                  notes: values[10] || "",
                  isEstimated: values[11] === "true",
                  createdAt: new Date(),
                  lastEdited: "Imported",
                };
              });
            setEvents([...events, ...importedEvents]);
            alert(
              `Successfully imported ${importedEvents.length} events from CSV!`,
            );
          }
        } catch (error) {
          console.error("Import error:", error);
          alert("Failed to import events. Please check the file format.");
        }
      };

      reader.readAsText(file);
    };

    input.click();
  };

  const handleTimelineAnalysis = () => {
    const analysis = {
      totalEvents: events.length,
      timelineSpan: timelineEnd - timelineStart + 1,
      eventsByImportance: {
        critical: events.filter((e) => e.importance === "critical").length,
        high: events.filter((e) => e.importance === "high").length,
        medium: events.filter((e) => e.importance === "medium").length,
        low: events.filter((e) => e.importance === "low").length,
      },
      eventsByCategory: eventCategories.reduce(
        (acc, cat) => {
          acc[cat] = events.filter((e) => e.category === cat).length;
          return acc;
        },
        {} as Record<string, number>,
      ),
      characterAppearances: characters.reduce(
        (acc, char) => {
          acc[char.name] = events.filter((e) =>
            e.characters.includes(char.name),
          ).length;
          return acc;
        },
        {} as Record<string, number>,
      ),
      averageEventsPerYear:
        events.length / Math.max(timelineEnd - timelineStart + 1, 1),
      mostActiveYear: (() => {
        const yearCounts = events.reduce(
          (acc, event) => {
            const year = new Date(event.date).getFullYear();
            acc[year] = (acc[year] || 0) + 1;
            return acc;
          },
          {} as Record<number, number>,
        );
        const maxCount = Math.max(...Object.values(yearCounts));
        const mostActiveYear = Object.keys(yearCounts).find(
          (year) => yearCounts[parseInt(year)] === maxCount,
        );
        return { year: mostActiveYear, eventCount: maxCount };
      })(),
    };

    // Create analysis report
    const report = `# Timeline Analysis Report\n\n## Overview\n- Total Events: ${analysis.totalEvents}\n- Timeline Span: ${analysis.timelineSpan} years (${timelineStart} - ${timelineEnd})\n- Average Events per Year: ${analysis.averageEventsPerYear.toFixed(1)}\n- Most Active Year: ${analysis.mostActiveYear.year} (${analysis.mostActiveYear.eventCount} events)\n\n## Events by Importance\n${Object.entries(
      analysis.eventsByImportance,
    )
      .map(
        ([importance, count]) =>
          `- ${importance.charAt(0).toUpperCase() + importance.slice(1)}: ${count}`,
      )
      .join("\n")}\n\n## Events by Category\n${Object.entries(
      analysis.eventsByCategory,
    )
      .filter(([, count]) => count > 0)
      .map(([category, count]) => `- ${category}: ${count}`)
      .join("\n")}\n\n## Character Appearances\n${Object.entries(
      analysis.characterAppearances,
    )
      .filter(([, count]) => count > 0)
      .map(([character, count]) => `- ${character}: ${count} events`)
      .join("\n")}`;

    // Download analysis report
    const blob = new Blob([report], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentStory?.title || "timeline"}-analysis.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "medium":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "low":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "birth":
        return <Star className="h-3 w-3" />;
      case "death":
        return <X className="h-3 w-3" />;
      case "milestone":
        return <Crown className="h-3 w-3" />;
      case "event":
        return <Clock className="h-3 w-3" />;
      default:
        return <Circle className="h-3 w-3" />;
    }
  };

  const renderTimelineEvent = (event: TimelineEvent, index: number) => {
    const eventDate = new Date(event.date);
    const year = eventDate.getFullYear();

    return (
      <div key={event.id} className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

        {/* Event marker */}
        <div className="relative flex items-start gap-4 pb-6">
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-full border-2 z-10 ${
              event.importance === "critical"
                ? "bg-red-500 border-red-600"
                : event.importance === "high"
                  ? "bg-orange-500 border-orange-600"
                  : event.importance === "medium"
                    ? "bg-blue-500 border-blue-600"
                    : "bg-gray-500 border-gray-600"
            }`}
          >
            <div className="text-white">{getTypeIcon(event.type)}</div>
          </div>

          <Card
            className="flex-1 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleEditEvent(event)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm leading-tight mb-1">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Calendar className="h-3 w-3" />
                    <span>{eventDate.toLocaleDateString()}</span>
                    {event.isEstimated && (
                      <Badge variant="outline" className="text-xs">
                        Estimated
                      </Badge>
                    )}
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditEvent(event);
                      }}
                    >
                      <Edit className="h-3 w-3 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicateEvent(event);
                      }}
                    >
                      <Copy className="h-3 w-3 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEvent(event.id);
                      }}
                      className="text-destructive"
                    >
                      <Trash2 className="h-3 w-3 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {event.description}
              </p>

              <div className="flex items-center gap-2 mb-2">
                <Badge className={getImportanceColor(event.importance)}>
                  {event.importance}
                </Badge>
                <Badge variant="secondary">{event.category}</Badge>
              </div>

              {event.location && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                  <MapPin className="h-3 w-3" />
                  <span>{event.location}</span>
                </div>
              )}

              {event.characters.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                  <User className="h-3 w-3" />
                  <span>{event.characters.join(", ")}</span>
                  {showCharacterAges &&
                    event.characters.map((charName) => {
                      const character = characters.find(
                        (c) => c.name === charName,
                      );
                      if (character) {
                        const age = calculateAge(
                          character.birthDate,
                          event.date,
                        );
                        return (
                          <span
                            key={charName}
                            className="ml-2 text-xs bg-muted px-1 rounded"
                          >
                            {charName}: {age}y
                          </span>
                        );
                      }
                      return null;
                    })}
                </div>
              )}

              {event.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {event.tags.slice(0, 3).map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {event.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{event.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderGroupedTimeline = () => {
    const years = Object.keys(groupedEvents).map(Number).sort();

    return (
      <div className="space-y-8">
        {years.map((year) => (
          <div key={year}>
            <div className="sticky top-0 bg-background/95 backdrop-blur z-20 py-2 mb-4">
              <h2 className="text-2xl font-bold text-primary">{year}</h2>
              <Separator className="mt-2" />
            </div>
            <div className="space-y-1">
              {groupedEvents[year].map((event, index) =>
                renderTimelineEvent(event, index),
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderCharacterTimeline = () => {
    const characterEvents: Record<string, TimelineEvent[]> = {};

    sortedEvents.forEach((event) => {
      event.characters.forEach((character) => {
        if (!characterEvents[character]) characterEvents[character] = [];
        characterEvents[character].push(event);
      });
    });

    return (
      <div className="space-y-8">
        {Object.entries(characterEvents).map(([character, events]) => (
          <div key={character}>
            <div className="sticky top-0 bg-background/95 backdrop-blur z-20 py-2 mb-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold text-primary">{character}</h2>
                {characters.find((c) => c.name === character) && (
                  <span className="text-sm text-muted-foreground">
                    Born:{" "}
                    {new Date(
                      characters.find((c) => c.name === character)!.birthDate,
                    ).toLocaleDateString()}
                  </span>
                )}
              </div>
              <Separator className="mt-2" />
            </div>
            <div className="space-y-1">
              {events.map((event, index) => renderTimelineEvent(event, index))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Show no story selected state
  if (!currentStory) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Story Selected</h3>
          <p className="text-muted-foreground mb-4">
            Please select or create a story to manage timeline events.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-80 border-r bg-card">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Timeline</h2>
            <Button size="sm" onClick={handleNewEvent}>
              <Plus className="h-4 w-4 mr-2" />
              New Event
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
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
                  {eventCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={importanceFilter}
                onValueChange={setImportanceFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Importance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Select
              value={selectedCharacter}
              onValueChange={setSelectedCharacter}
            >
              <SelectTrigger>
                <User className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Character" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Characters</SelectItem>
                {characters.map((character) => (
                  <SelectItem key={character.name} value={character.name}>
                    {character.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Timeline Controls */}
          <Separator className="my-4" />

          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium">View Mode</Label>
              <Select
                value={timelineView}
                onValueChange={(value: any) => setTimelineView(value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linear">Linear Timeline</SelectItem>
                  <SelectItem value="grouped">Grouped by Year</SelectItem>
                  <SelectItem value="character">By Character</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Show Character Ages</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCharacterAges(!showCharacterAges)}
              >
                {showCharacterAges ? "Hide" : "Show"}
              </Button>
            </div>
          </div>

          {/* Stats */}
          <Separator className="my-4" />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Events:</span>
              <span className="font-medium">{events.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Filtered:</span>
              <span className="font-medium">{filteredEvents.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Timeline Span:</span>
              <span className="font-medium">
                {timelineEnd - timelineStart + 1} years
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Characters:</span>
              <span className="font-medium">{characters.length}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4">
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={handleExportTimeline}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Timeline
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={handleImportEvents}
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Events
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={handleTimelineAnalysis}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Timeline Analysis
            </Button>
          </div>
        </div>
      </div>

      {/* Main Timeline View */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b bg-card">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Story Timeline</h1>
              <p className="text-sm text-muted-foreground">
                {timelineView === "linear" && "Linear chronological view"}
                {timelineView === "grouped" && "Events grouped by year"}
                {timelineView === "character" &&
                  "Events organized by character"}
                • {filteredEvents.length} events
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePreview}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm" onClick={handleSettings}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Timeline Content */}
        <ScrollArea className="flex-1">
          <div ref={timelineRef} className="p-6 max-w-4xl mx-auto">
            {sortedEvents.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No events found</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first timeline event to get started.
                </p>
                <Button onClick={handleNewEvent}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </div>
            ) : (
              <>
                {timelineView === "linear" && (
                  <div className="space-y-1">
                    {sortedEvents.map((event, index) =>
                      renderTimelineEvent(event, index),
                    )}
                  </div>
                )}
                {timelineView === "grouped" && renderGroupedTimeline()}
                {timelineView === "character" && renderCharacterTimeline()}
              </>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Event Dialog */}
      <Dialog open={newEventOpen} onOpenChange={setNewEventOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedEvent ? "Edit Event" : "Create New Event"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="event-title">Event Title</Label>
                <Input
                  id="event-title"
                  value={eventForm.title}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, title: e.target.value })
                  }
                  placeholder="Enter event title..."
                />
              </div>
              <div>
                <Label htmlFor="event-date">Date</Label>
                <Input
                  id="event-date"
                  type="date"
                  value={eventForm.date}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, date: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="event-category">Category</Label>
                <Select
                  value={eventForm.category}
                  onValueChange={(value) =>
                    setEventForm({ ...eventForm, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {eventCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="event-type">Type</Label>
                <Select
                  value={eventForm.type}
                  onValueChange={(value: any) =>
                    setEventForm({ ...eventForm, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="event-importance">Importance</Label>
                <Select
                  value={eventForm.importance}
                  onValueChange={(value: any) =>
                    setEventForm({ ...eventForm, importance: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {importanceLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="event-description">Description</Label>
              <Textarea
                id="event-description"
                value={eventForm.description}
                onChange={(e) =>
                  setEventForm({ ...eventForm, description: e.target.value })
                }
                placeholder="Describe what happens in this event..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="event-location">Location</Label>
                <Input
                  id="event-location"
                  value={eventForm.location}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, location: e.target.value })
                  }
                  placeholder="Where does this event take place?"
                />
              </div>
              <div>
                <Label htmlFor="event-characters">Characters Present</Label>
                <Input
                  id="event-characters"
                  value={eventForm.characters}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, characters: e.target.value })
                  }
                  placeholder="Elena, Marcus, etc. (comma separated)"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="event-consequences">Consequences</Label>
              <Textarea
                id="event-consequences"
                value={eventForm.consequences}
                onChange={(e) =>
                  setEventForm({ ...eventForm, consequences: e.target.value })
                }
                placeholder="What are the results or consequences of this event?"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="event-tags">Tags</Label>
              <Input
                id="event-tags"
                value={eventForm.tags}
                onChange={(e) =>
                  setEventForm({ ...eventForm, tags: e.target.value })
                }
                placeholder="magic, important, turning-point, etc. (comma separated)"
              />
            </div>

            <div>
              <Label htmlFor="event-notes">Additional Notes</Label>
              <Textarea
                id="event-notes"
                value={eventForm.notes}
                onChange={(e) =>
                  setEventForm({ ...eventForm, notes: e.target.value })
                }
                placeholder="Any additional notes or context..."
                rows={2}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="event-estimated"
                checked={eventForm.isEstimated}
                onChange={(e) =>
                  setEventForm({ ...eventForm, isEstimated: e.target.checked })
                }
              />
              <Label htmlFor="event-estimated">This is an estimated date</Label>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setNewEventOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEvent}>
                {selectedEvent ? "Update Event" : "Create Event"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Timeline Preview</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="space-y-4">
              <div className="text-center bg-muted p-4 rounded-lg">
                <h2 className="text-xl font-bold mb-2">
                  {currentStory?.title} Timeline
                </h2>
                <p className="text-sm text-muted-foreground">
                  {filteredEvents.length} events spanning{" "}
                  {timelineEnd - timelineStart + 1} years ({timelineStart} -{" "}
                  {timelineEnd})
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded">
                  <div className="font-bold text-red-600">
                    {events.filter((e) => e.importance === "critical").length}
                  </div>
                  <div className="text-muted-foreground">Critical Events</div>
                </div>
                <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded">
                  <div className="font-bold text-orange-600">
                    {events.filter((e) => e.importance === "high").length}
                  </div>
                  <div className="text-muted-foreground">High Importance</div>
                </div>
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <div className="font-bold text-blue-600">
                    {events.filter((e) => e.importance === "medium").length}
                  </div>
                  <div className="text-muted-foreground">Medium Importance</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-900/20 rounded">
                  <div className="font-bold text-gray-600">
                    {events.filter((e) => e.importance === "low").length}
                  </div>
                  <div className="text-muted-foreground">Low Importance</div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Recent Events:</h3>
                {sortedEvents.slice(-5).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-2 p-2 border rounded"
                  >
                    <Badge
                      className={getImportanceColor(event.importance)}
                      variant="secondary"
                    >
                      {event.importance}
                    </Badge>
                    <span className="font-medium">{event.title}</span>
                    <span className="text-sm text-muted-foreground">
                      ({new Date(event.date).toLocaleDateString()})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Timeline Settings</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label>Timeline View</Label>
              <Select
                value={timelineView}
                onValueChange={(value: any) => setTimelineView(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linear">Linear Timeline</SelectItem>
                  <SelectItem value="grouped">Grouped by Year</SelectItem>
                  <SelectItem value="character">By Character</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label>Show Character Ages</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCharacterAges(!showCharacterAges)}
              >
                {showCharacterAges ? "Hide" : "Show"}
              </Button>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Quick Actions</Label>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={handleExportTimeline}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Timeline as PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={handleImportEvents}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import Events from CSV
                </Button>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setSettingsOpen(false)}>Done</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper component for undefined Circle
const Circle = ({ className }: { className?: string }) => (
  <div
    className={`rounded-full border ${className}`}
    style={{ width: "0.75rem", height: "0.75rem" }}
  />
);
