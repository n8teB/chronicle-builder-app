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
import { ImageGallery, ImageItem } from "@/components/ImageGallery";
import { RelationshipMap } from "@/components/RelationshipMap";
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Clock,
  Heart,
  Star,
  Target,
  Trash2,
  Copy,
  User,
  MapPin,
  Calendar,
  Briefcase,
  Zap,
  TrendingUp,
  BookOpen,
  MessageSquare,
  Upload,
  Image,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useStory } from "@/contexts/StoryContext";

const mockCharacters = [
  {
    id: 1,
    name: "Elena Voss",
    role: "Protagonist",
    age: 28,
    occupation: "Librarian",
    location: "New Haven City",
    status: "main",
    description:
      "A curious librarian who discovers her magical heritage through an ancient letter. Intelligent and intuitive, but often doubts herself.",
    appearance:
      "Average height, dark brown hair usually in a messy bun, green eyes that seem to notice everything. Wears practical clothes - cardigans, jeans, comfortable shoes.",
    personality:
      "Introverted but brave when needed, highly curious, loves books and quiet spaces. Has strong intuition but often ignores it. Tends to overthink situations.",
    backstory: `Elena grew up in a small town where her grandmother filled her head with stories of magic and "the old ways." After her grandmother's death when Elena was 16, she moved to the city and became a librarian, trying to live a normal life.

She's always felt different but couldn't explain why. Strange things happen around her occasionally - books falling off shelves to reveal exactly what she needs, intuitive knowledge about people, dreams that sometimes come true.

Recently moved to her own apartment after years of roommates, craving independence but feeling lonely. The mysterious letter arrives just when she's questioning whether there's more to life.`,
    goals:
      "To understand her true heritage and the magical abilities she's discovering. To find her place in the world and protect those she cares about.",
    fears:
      "That she's going crazy, that she'll lose control of her powers, that she'll endanger people she loves.",
    relationships: [
      "Marcus (mentor)",
      "Sarah (best friend)",
      "The Order (mysterious connection)",
    ],
    arc: "From self-doubting librarian to confident magic wielder who embraces her destiny.",
    motivation:
      "A deep need to understand who she really is and where she belongs.",
    conflict:
      "Internal struggle between wanting a normal life and accepting her magical destiny.",
    notes:
      "Consider giving her a small magical artifact from her grandmother as a plot device. Maybe a pendant that reacts to magical energy?",
    scenes: ["Opening scene", "Library discovery", "First magic lesson"],
    image: null,
    images: [] as ImageItem[],
    lastEdited: "2 hours ago",
  },
  {
    id: 2,
    name: "Marcus Thorne",
    role: "Mentor",
    age: 45,
    occupation: "Head Librarian / Guardian",
    location: "New Haven City Library",
    status: "major",
    description:
      "The mysterious head librarian who knows far more about magic than he initially reveals. Guardian of ancient knowledge and Elena's guide.",
    appearance:
      "Tall and lean with graying hair and kind but penetrating blue eyes. Always wears subtle, high-quality clothing. Has several small scars on his hands from magical accidents.",
    personality:
      "Patient and wise, but can be frustratingly cryptic. Protective of those under his care. Has a dry sense of humor and vast knowledge of magical history.",
    backstory: `Marcus discovered his magical abilities in his teens and was recruited by the Order of Script Keepers at 20. He's spent 25 years protecting magical knowledge and waiting for the next Script Reader to emerge.

He lost his mentor during a magical conflict 10 years ago, making him cautious about training new magic users. The library is both his cover and his base of operations - it contains hidden magical texts and serves as a safe house for magic users.

He's been watching Elena from afar for months, waiting for the right moment to approach her. The letter that starts the story was his idea, though he didn't send it directly.`,
    goals:
      "To guide Elena safely into the magical world and prepare her for the challenges ahead. To protect the magical knowledge in his care.",
    fears:
      "That he'll fail Elena like he feels he failed his previous student. That the magical world will be exposed before it's ready.",
    relationships: [
      "Elena (student)",
      "The Order (member)",
      "Sarah (watches from afar)",
    ],
    arc: "From mysterious mentor to trusted ally who learns to open up and trust again.",
    motivation:
      "Duty to preserve magical knowledge and protect those with the gift.",
    conflict:
      "Balancing Elena's safety with the need to prepare her for danger.",
    notes:
      "Give him a subtle magical item - maybe reading glasses that can reveal hidden text or detect magical auras.",
    scenes: ["Library meeting", "Magic lessons", "Revealing the truth"],
    image: null,
    images: [] as ImageItem[],
    lastEdited: "1 day ago",
  },
  {
    id: 3,
    name: "Sarah Chen",
    role: "Best Friend",
    age: 27,
    occupation: "Software Developer",
    location: "New Haven City",
    status: "supporting",
    description:
      "Elena's tech-savvy best friend who provides grounding in the mundane world while gradually becoming aware of the magical one.",
    appearance:
      "Petite with long black hair often in a ponytail, dark brown eyes behind stylish glasses. Dresses in casual but trendy clothes - graphic tees, jeans, sneakers.",
    personality:
      "Practical and logical, but loyal and supportive. Quick-witted with a good sense of humor. Slightly skeptical of anything that can't be explained by science, but open-minded when it comes to Elena.",
    backstory: `Sarah and Elena met in college and bonded over their love of books and late-night study sessions. Sarah went into tech while Elena chose library science, but they remained close friends.

Sarah is the person Elena calls when she needs to talk through problems or just needs normalcy. She's successful in her career and dating a nice guy, representing the "normal" life Elena sometimes thinks she wants.

As Elena's magical journey begins, Sarah becomes an anchor to the regular world, but also faces the challenge of accepting that magic is real.`,
    goals:
      "To support Elena through whatever she's going through, even if she doesn't understand it. To maintain their friendship despite the growing secrets.",
    fears:
      "That Elena is having a breakdown, that she's losing her best friend to something she can't understand or be part of.",
    relationships: [
      "Elena (best friend)",
      "David (boyfriend)",
      "Marcus (suspicious of)",
    ],
    arc: "From skeptical observer to reluctant ally who helps bridge the magical and mundane worlds.",
    motivation: "Loyalty to Elena and a desire to protect their friendship.",
    conflict:
      "Struggling to accept the reality of magic while watching her best friend change.",
    notes:
      "Could she have a small magical sensitivity that manifests later? Maybe she becomes the 'tech support' for the magical world.",
    scenes: [
      "Coffee shop conversations",
      "Witnessing magic",
      "Accepting the truth",
    ],
    image: null,
    images: [] as ImageItem[],
    lastEdited: "3 days ago",
  },
  {
    id: 4,
    name: "The Adversary",
    role: "Antagonist",
    age: "Unknown",
    occupation: "Shadow Organization Leader",
    location: "Hidden",
    status: "major",
    description:
      "A mysterious figure who seeks to control or destroy magical knowledge for their own purposes. Represents the corruption of magical power.",
    appearance:
      "Rarely seen directly. When glimpsed, appears as a tall figure in dark clothing with an aura that makes details hard to discern. May use illusions to hide true appearance.",
    personality:
      "Intelligent and manipulative, patient but ruthless when crossed. Believes that magical power should be controlled by those strong enough to take it.",
    backstory: `Once a member of the Order of Script Keepers, but was expelled for attempting to use forbidden magic for personal gain. Has spent years building a network of followers and acquiring magical artifacts.

Believes that magic should be used to control and improve the mundane world, rather than hidden from it. Sees Elena as either a powerful ally to recruit or a threat to eliminate.

Has been working to destabilize the Order and claim their knowledge for years. The timing of Elena's awakening may be connected to their plans.`,
    goals:
      "To gain control of the most powerful magical knowledge and use it to reshape the world according to their vision.",
    fears:
      "That they'll be stopped before achieving their goals, that their past failures will be repeated.",
    relationships: [
      "The Order (enemy)",
      "Marcus (former colleague)",
      "Elena (target)",
    ],
    arc: "From shadowy threat to direct confrontation, revealing the personal cost of their choices.",
    motivation:
      "A twisted belief that they're saving the world by controlling it.",
    conflict: "The corruption of good intentions into authoritarian control.",
    notes:
      "Keep mysterious for most of the story. Reveal personal connection to Marcus or Elena's family later?",
    scenes: ["Shadowy appearances", "Indirect threats", "Final confrontation"],
    image: null,
    images: [] as ImageItem[],
    lastEdited: "5 days ago",
  },
];

const characterRoles = [
  "Protagonist",
  "Antagonist",
  "Mentor",
  "Love Interest",
  "Best Friend",
  "Ally",
  "Enemy",
  "Supporting",
  "Minor",
  "Other",
];

const characterStatuses = ["main", "major", "supporting", "minor"];

export default function Characters() {
  const { currentStory } = useStory();

  // Store characters per story using story ID as key
  const [storyCharacters, setStoryCharacters] = useState<
    Record<string, typeof mockCharacters>
  >({});

  // Get characters for current story
  const characters = currentStory ? storyCharacters[currentStory.id] || [] : [];
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);

  // Initialize characters for current story if not exists
  useEffect(() => {
    if (currentStory && !storyCharacters[currentStory.id]) {
      // Initialize with sample characters for "The Script Reader's Legacy"
      if (currentStory.id === "story-1") {
        setStoryCharacters((prev) => ({
          ...prev,
          [currentStory.id]: mockCharacters,
        }));
      } else {
        // New stories start with empty characters
        setStoryCharacters((prev) => ({
          ...prev,
          [currentStory.id]: [],
        }));
      }
    }
  }, [currentStory, storyCharacters]);

  // Set selected character when story changes
  useEffect(() => {
    if (currentStory && characters.length > 0 && !selectedCharacter) {
      setSelectedCharacter(characters[0]);
    } else if (!currentStory) {
      setSelectedCharacter(null);
    }
  }, [currentStory, characters, selectedCharacter]);
  const [characterName, setCharacterName] = useState(
    selectedCharacter?.name || "",
  );
  const [characterRole, setCharacterRole] = useState(
    selectedCharacter?.role || "Supporting",
  );
  const [characterAge, setCharacterAge] = useState(
    selectedCharacter?.age?.toString() || "25",
  );
  const [characterOccupation, setCharacterOccupation] = useState(
    selectedCharacter?.occupation || "",
  );
  const [characterLocation, setCharacterLocation] = useState(
    selectedCharacter?.location || "",
  );
  const [characterStatus, setCharacterStatus] = useState(
    selectedCharacter?.status || "minor",
  );
  const [characterDescription, setCharacterDescription] = useState(
    selectedCharacter?.description || "",
  );
  const [characterAppearance, setCharacterAppearance] = useState(
    selectedCharacter?.appearance || "",
  );
  const [characterPersonality, setCharacterPersonality] = useState(
    selectedCharacter?.personality || "",
  );
  const [characterBackstory, setCharacterBackstory] = useState(
    selectedCharacter?.backstory || "",
  );
  const [characterGoals, setCharacterGoals] = useState(
    selectedCharacter?.goals || "",
  );
  const [characterFears, setCharacterFears] = useState(
    selectedCharacter?.fears || "",
  );
  const [characterRelationships, setCharacterRelationships] = useState(
    selectedCharacter?.relationships?.join(", ") || "",
  );
  const [characterArc, setCharacterArc] = useState(
    selectedCharacter?.arc || "",
  );
  const [characterMotivation, setCharacterMotivation] = useState(
    selectedCharacter?.motivation || "",
  );
  const [characterConflict, setCharacterConflict] = useState(
    selectedCharacter?.conflict || "",
  );
  const [characterNotes, setCharacterNotes] = useState(
    selectedCharacter?.notes || "",
  );
  const [characterScenes, setCharacterScenes] = useState(
    selectedCharacter?.scenes?.join(", ") || "",
  );
  const [characterImage, setCharacterImage] = useState(
    selectedCharacter?.image || null,
  );
  const [characterImages, setCharacterImages] = useState<ImageItem[]>(
    selectedCharacter?.images || [],
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [relationshipsViewOpen, setRelationshipsViewOpen] = useState(false);

  // Update form fields when selected character changes
  useEffect(() => {
    if (selectedCharacter) {
      setCharacterName(selectedCharacter.name);
      setCharacterRole(selectedCharacter.role);
      setCharacterAge(selectedCharacter.age.toString());
      setCharacterOccupation(selectedCharacter.occupation);
      setCharacterLocation(selectedCharacter.location);
      setCharacterStatus(selectedCharacter.status);
      setCharacterDescription(selectedCharacter.description);
      setCharacterAppearance(selectedCharacter.appearance);
      setCharacterPersonality(selectedCharacter.personality);
      setCharacterBackstory(selectedCharacter.backstory);
      setCharacterGoals(selectedCharacter.goals);
      setCharacterFears(selectedCharacter.fears);
      setCharacterRelationships(selectedCharacter.relationships.join(", "));
      setCharacterArc(selectedCharacter.arc);
      setCharacterMotivation(selectedCharacter.motivation);
      setCharacterConflict(selectedCharacter.conflict);
      setCharacterNotes(selectedCharacter.notes);
      setCharacterScenes(selectedCharacter.scenes.join(", "));
      setCharacterImage(selectedCharacter.image);
      setCharacterImages(selectedCharacter.images || []);
    } else {
      setCharacterName("");
      setCharacterRole("Supporting");
      setCharacterAge("25");
      setCharacterOccupation("");
      setCharacterLocation("");
      setCharacterStatus("minor");
      setCharacterDescription("");
      setCharacterAppearance("");
      setCharacterPersonality("");
      setCharacterBackstory("");
      setCharacterGoals("");
      setCharacterFears("");
      setCharacterRelationships("");
      setCharacterArc("");
      setCharacterMotivation("");
      setCharacterConflict("");
      setCharacterNotes("");
      setCharacterScenes("");
      setCharacterImage(null);
      setCharacterImages([]);
    }
  }, [selectedCharacter]);

  // Button handlers
  const handleNewCharacter = () => {
    console.log("handleNewCharacter called, currentStory:", currentStory);
    if (!currentStory) {
      console.error("No current story selected");
      alert("Please select a story first to add characters");
      return;
    }

    const newCharacter = {
      id: Math.max(...characters.map((c) => c.id), 0) + 1,
      name: `New Character ${characters.length + 1}`,
      role: "Supporting",
      age: 25,
      occupation: "What do they do for work?",
      location: "Where are they from?",
      status: "minor",
      description:
        "Describe this character's basic traits and role in the story...",
      appearance: "What do they look like?",
      personality: "What is their personality like?",
      backstory: "What is their background?",
      goals: "What do they want to achieve?",
      fears: "What are they afraid of?",
      relationships: [],
      arc: "How do they change throughout the story?",
      motivation: "What drives them?",
      conflict: "What challenges do they face?",
      notes: "Additional notes about this character...",
      scenes: [],
      image: null,
      images: [] as ImageItem[],
      lastEdited: "Just now",
    };

    const updatedCharacters = [...characters, newCharacter];
    setStoryCharacters((prev) => ({
      ...prev,
      [currentStory.id]: updatedCharacters,
    }));
    setSelectedCharacter(newCharacter);

    // Focus on the name field after a short delay
    setTimeout(() => {
      const nameInput = document.getElementById("character-name");
      if (nameInput) {
        nameInput.focus();
        nameInput.select();
      }
    }, 100);
  };

  const handleDeleteCharacter = (characterId: number) => {
    if (!currentStory) return;

    const updatedCharacters = characters.filter((c) => c.id !== characterId);
    setStoryCharacters((prev) => ({
      ...prev,
      [currentStory.id]: updatedCharacters,
    }));

    if (selectedCharacter?.id === characterId && updatedCharacters.length > 0) {
      setSelectedCharacter(updatedCharacters[0]);
    } else if (selectedCharacter?.id === characterId) {
      setSelectedCharacter(null);
    }
  };

  const handleDuplicateCharacter = (characterId: number) => {
    const characterToDuplicate = characters.find((c) => c.id === characterId);
    if (characterToDuplicate) {
      const newCharacter = {
        ...characterToDuplicate,
        id: Math.max(...characters.map((c) => c.id)) + 1,
        name: `${characterToDuplicate.name} (Copy)`,
        lastEdited: "Just now",
      };
      const updatedCharacters = [...characters, newCharacter];
      setStoryCharacters((prev) => ({
        ...prev,
        [currentStory.id]: updatedCharacters,
      }));
    }
  };

  const handlePreview = () => {
    setPreviewOpen(true);
  };

  const handleRelationshipsView = () => {
    setRelationshipsViewOpen(true);
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setCharacterImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setCharacterImage(null);
  };

  const handleSave = () => {
    if (!selectedCharacter || !currentStory) return;

    const updatedCharacters = characters.map((character) =>
      character.id === selectedCharacter.id
        ? {
            ...character,
            name: characterName,
            role: characterRole,
            age: parseInt(characterAge) || 0,
            occupation: characterOccupation,
            location: characterLocation,
            status: characterStatus,
            description: characterDescription,
            appearance: characterAppearance,
            personality: characterPersonality,
            backstory: characterBackstory,
            goals: characterGoals,
            fears: characterFears,
            relationships: characterRelationships
              .split(",")
              .map((r) => r.trim())
              .filter((r) => r),
            arc: characterArc,
            motivation: characterMotivation,
            conflict: characterConflict,
            notes: characterNotes,
            scenes: characterScenes
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s),
            image: characterImage,
            images: characterImages,
            lastEdited: "Just now",
          }
        : character,
    );
    setStoryCharacters((prev) => ({
      ...prev,
      [currentStory.id]: updatedCharacters,
    }));
    // Remove alert as requested
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "main":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "major":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "supporting":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "minor":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "protagonist":
        return <Star className="h-3 w-3" />;
      case "antagonist":
        return <Zap className="h-3 w-3" />;
      case "mentor":
        return <BookOpen className="h-3 w-3" />;
      case "love interest":
        return <Heart className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  // Filter characters based on search and filters
  const filteredCharacters = characters.filter((character) => {
    const matchesSearch =
      character.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      character.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      character.occupation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || character.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || character.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Show no story selected state
  if (!currentStory) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Story Selected</h3>
          <p className="text-muted-foreground mb-4">
            Please select or create a story to manage characters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Characters Sidebar */}
      <div className="w-80 border-r bg-card">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Characters</h2>
            <Button
              size="sm"
              onClick={(e) => {
                console.log("New Character button clicked");
                e.preventDefault();
                handleNewCharacter();
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
                placeholder="Search characters..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {characterRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="main">Main</SelectItem>
                  <SelectItem value="major">Major</SelectItem>
                  <SelectItem value="supporting">Supporting</SelectItem>
                  <SelectItem value="minor">Minor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredCharacters.map((character) => (
              <Card
                key={character.id}
                className={`mb-2 cursor-pointer transition-all hover:shadow-md ${
                  selectedCharacter?.id === character.id
                    ? "ring-2 ring-primary"
                    : ""
                }`}
                onClick={() => setSelectedCharacter(character)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-3 flex-1">
                      {character.image ? (
                        <img
                          src={character.image}
                          alt={character.name}
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary flex-shrink-0">
                          {getRoleIcon(character.role)}
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium text-sm leading-tight">
                          {character.name}
                        </h3>
                      </div>
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
                            handleDuplicateCharacter(character.id);
                          }}
                        >
                          <Copy className="h-3 w-3 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCharacter(character.id);
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
                      <Badge className={getStatusColor(character.status)}>
                        {character.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {character.role}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Briefcase className="h-3 w-3" />
                      <span>{character.occupation || "No occupation"}</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{character.location || "No location"}</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {character.description}
                  </p>

                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {character.lastEdited}
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
              <Users className="h-5 w-5 text-primary" />
              <div>
                <h1 className="text-xl font-semibold">{characterName}</h1>
                <p className="text-sm text-muted-foreground">
                  {selectedCharacter
                    ? `${characterRole} • Character ${selectedCharacter.id}`
                    : "No character selected"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePreview}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRelationshipsView}
              >
                <Users className="h-4 w-4 mr-2" />
                Relationships
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Target className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Age:</span>
              <span className="font-medium">{characterAge}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Role:</span>
              <span className="font-medium">{characterRole}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Location:</span>
              <span className="font-medium">{characterLocation || "None"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Edit className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Status:</span>
              <Badge className={getStatusColor(characterStatus)}>
                {characterStatus}
              </Badge>
            </div>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="development">Development</TabsTrigger>
                <TabsTrigger value="relationships">Relationships</TabsTrigger>
                <TabsTrigger value="notes">Notes & Scenes</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-6">
                {/* Character Image Gallery */}
                <ImageGallery
                  images={characterImages}
                  onImagesChange={setCharacterImages}
                  maxImages={5}
                  title="Character Images"
                  description="Upload reference images, portraits, and concept art for this character"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="character-name">Character Name</Label>
                    <Input
                      id="character-name"
                      value={characterName}
                      onChange={(e) => setCharacterName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="character-role">Role</Label>
                    <Select
                      value={characterRole}
                      onValueChange={setCharacterRole}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {characterRoles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="character-age">Age</Label>
                    <Input
                      id="character-age"
                      type="number"
                      value={characterAge}
                      onChange={(e) => setCharacterAge(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="character-occupation">Occupation</Label>
                    <Input
                      id="character-occupation"
                      value={characterOccupation}
                      onChange={(e) => setCharacterOccupation(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="character-location">Location</Label>
                    <Input
                      id="character-location"
                      value={characterLocation}
                      onChange={(e) => setCharacterLocation(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="character-status">Character Status</Label>
                  <Select
                    value={characterStatus}
                    onValueChange={setCharacterStatus}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main">Main Character</SelectItem>
                      <SelectItem value="major">Major Character</SelectItem>
                      <SelectItem value="supporting">
                        Supporting Character
                      </SelectItem>
                      <SelectItem value="minor">Minor Character</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="character-description">Description</Label>
                  <Textarea
                    id="character-description"
                    value={characterDescription}
                    onChange={(e) => setCharacterDescription(e.target.value)}
                    placeholder="Brief description of the character..."
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="character-appearance">
                    Physical Appearance
                  </Label>
                  <Textarea
                    id="character-appearance"
                    value={characterAppearance}
                    onChange={(e) => setCharacterAppearance(e.target.value)}
                    placeholder="Describe how the character looks..."
                    className="mt-1"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="character-personality">Personality</Label>
                  <Textarea
                    id="character-personality"
                    value={characterPersonality}
                    onChange={(e) => setCharacterPersonality(e.target.value)}
                    placeholder="Describe the character's personality traits..."
                    className="mt-1"
                    rows={4}
                  />
                </div>
              </TabsContent>

              <TabsContent value="development" className="space-y-4 mt-6">
                <div>
                  <Label htmlFor="character-backstory">Backstory</Label>
                  <Textarea
                    id="character-backstory"
                    value={characterBackstory}
                    onChange={(e) => setCharacterBackstory(e.target.value)}
                    placeholder="Character's history and background..."
                    className="mt-1"
                    rows={6}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="character-goals">Goals & Desires</Label>
                    <Textarea
                      id="character-goals"
                      value={characterGoals}
                      onChange={(e) => setCharacterGoals(e.target.value)}
                      placeholder="What does the character want?"
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="character-fears">Fears & Weaknesses</Label>
                    <Textarea
                      id="character-fears"
                      value={characterFears}
                      onChange={(e) => setCharacterFears(e.target.value)}
                      placeholder="What does the character fear?"
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="character-motivation">Core Motivation</Label>
                  <Textarea
                    id="character-motivation"
                    value={characterMotivation}
                    onChange={(e) => setCharacterMotivation(e.target.value)}
                    placeholder="What drives this character?"
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="character-conflict">Internal Conflict</Label>
                  <Textarea
                    id="character-conflict"
                    value={characterConflict}
                    onChange={(e) => setCharacterConflict(e.target.value)}
                    placeholder="What internal struggles does the character face?"
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="character-arc">Character Arc</Label>
                  <Textarea
                    id="character-arc"
                    value={characterArc}
                    onChange={(e) => setCharacterArc(e.target.value)}
                    placeholder="How does the character change throughout the story?"
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </TabsContent>

              <TabsContent value="relationships" className="space-y-4 mt-6">
                <div>
                  <Label htmlFor="character-relationships">Relationships</Label>
                  <Textarea
                    id="character-relationships"
                    value={characterRelationships}
                    onChange={(e) => setCharacterRelationships(e.target.value)}
                    placeholder="List key relationships (comma separated): Marcus (mentor), Sarah (best friend)..."
                    className="mt-1"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <RelationshipMap
                    currentCharacter={{
                      id: selectedCharacter?.id?.toString() || "current",
                      name: characterName,
                      role: characterRole,
                      status: characterStatus,
                    }}
                    characters={(characters || []).map((char) => ({
                      id: char.id.toString(),
                      name: char.name,
                      role: char.role,
                      status: char.status,
                    }))}
                  />
                </div>
              </TabsContent>

              <TabsContent value="notes" className="space-y-4 mt-6">
                <div>
                  <Label htmlFor="character-scenes">Appears in Scenes</Label>
                  <Input
                    id="character-scenes"
                    value={characterScenes}
                    onChange={(e) => setCharacterScenes(e.target.value)}
                    placeholder="Opening scene, Library discovery, etc. (comma separated)"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="character-notes">Character Notes</Label>
                  <Textarea
                    id="character-notes"
                    value={characterNotes}
                    onChange={(e) => setCharacterNotes(e.target.value)}
                    placeholder="Additional notes, ideas, or reminders about this character..."
                    className="mt-1"
                    rows={8}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Scene Appearances
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {characterScenes
                        .split(",")
                        .map((s) => s.trim())
                        .filter((s) => s).length > 0 ? (
                        <div className="space-y-1">
                          {characterScenes
                            .split(",")
                            .map((s) => s.trim())
                            .filter((s) => s)
                            .map((scene, index) => (
                              <div
                                key={index}
                                className="text-sm flex items-center gap-2"
                              >
                                <div className="w-2 h-2 rounded-full bg-accent" />
                                {scene}
                              </div>
                            ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No scenes assigned yet.
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Quick Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Relationships:
                        </span>
                        <span>
                          {
                            characterRelationships
                              .split(",")
                              .map((r) => r.trim())
                              .filter((r) => r).length
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Scene Count:
                        </span>
                        <span>
                          {
                            characterScenes
                              .split(",")
                              .map((s) => s.trim())
                              .filter((s) => s).length
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Notes Length:
                        </span>
                        <span>
                          {characterNotes.split(" ").filter((w) => w).length}{" "}
                          words
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex justify-between items-center text-sm text-muted-foreground">
              <span>Auto-save enabled • Last saved just now</span>
              <span>
                Last edited {selectedCharacter?.lastEdited || "Never"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Character Profile: {characterName}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="flex items-start gap-4 mb-4">
              {characterImage && (
                <img
                  src={characterImage}
                  alt={characterName}
                  className="w-24 h-24 rounded-lg object-cover border"
                />
              )}
              <div className="flex-1 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Role:</strong> {characterRole}
                </div>
                <div>
                  <strong>Age:</strong> {characterAge}
                </div>
                <div>
                  <strong>Occupation:</strong> {characterOccupation}
                </div>
                <div>
                  <strong>Location:</strong> {characterLocation}
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-sm">{characterDescription}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Appearance</h3>
              <p className="text-sm whitespace-pre-wrap">
                {characterAppearance}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Personality</h3>
              <p className="text-sm whitespace-pre-wrap">
                {characterPersonality}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Backstory</h3>
              <p className="text-sm whitespace-pre-wrap">
                {characterBackstory}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-1">Goals</h4>
                <p className="text-sm">{characterGoals}</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Fears</h4>
                <p className="text-sm">{characterFears}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Relationships View Modal */}
      <Dialog
        open={relationshipsViewOpen}
        onOpenChange={setRelationshipsViewOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Character Relationships: {characterName}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {characterRelationships
              .split(",")
              .map((r) => r.trim())
              .filter((r) => r).length > 0 ? (
              <div className="space-y-3">
                {characterRelationships
                  .split(",")
                  .map((r) => r.trim())
                  .filter((r) => r)
                  .map((relationship, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{relationship}</div>
                        <div className="text-sm text-muted-foreground">
                          Connected to {characterName}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                No relationships defined yet. Add relationships in the character
                form to see them here.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
