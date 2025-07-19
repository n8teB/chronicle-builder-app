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
import { ImageGallery, ImageItem } from "@/components/ImageGallery";
import { WorldConnectionMap } from "@/components/WorldConnectionMap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Globe,
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
  MapPin,
  Mountain,
  Building,
  Trees,
  Castle,
  Home,
  Landmark,
  Ship,
  Plane,
  Users,
  Crown,
  BookOpen,
  Scroll,
  Coins,
  Sword,
  Shield,
  Image,
  X,
  Star,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useStory } from "@/contexts/StoryContext";

const mockWorldElements = [
  {
    id: 1,
    name: "New Haven City",
    type: "location",
    category: "City",
    description:
      "A modern metropolitan city where ancient magic quietly coexists with technology. Home to the Grand Library and various magical safe houses.",
    image: null,
    images: [] as ImageItem[],
    details: {
      population: "2.3 million",
      government: "Democratic Mayor-Council",
      climate: "Temperate oceanic",
      geography: "Coastal city built on seven hills",
      economy: "Technology, education, tourism",
      landmarks: "Grand Library, University District, Old Harbor",
    } as Record<string, string>,
    culture: `New Haven maintains a carefully balanced duality - on the surface, it's a thriving modern city with tech companies, universities, and cultural attractions. Beneath this facade, a hidden magical community operates through secret networks.

Most residents are unaware of the magical undercurrent. Those in the know follow an unspoken code of secrecy. The magical community includes academics, librarians, artists, and various professionals who use their mundane careers as cover.

Architecture blends modern steel and glass with preserved historical buildings that often hide magical spaces. The city's seven hills each have their own character and hidden magical significance.`,
    history: `Founded in 1847 as a trading port, New Haven grew rapidly during the industrial revolution. Unknown to most historians, the city was deliberately established as a safe haven for magic users fleeing persecution in Europe.

The Grand Library was built in 1885, ostensibly as a public institution but actually as the headquarters for the Order of Script Keepers. The university followed in 1901, creating an intellectual atmosphere that provided perfect cover for magical research.

During both World Wars, New Haven served as a sanctuary for magical refugees. The 1960s brought a new generation of magic users who integrated more thoroughly with mundane society, leading to the current system of hidden coexistence.`,
    rules: `1. The Veil Protocol: Magic must never be revealed to unaware mundanes
2. No magical interference in major world events
3. Magical disputes must be resolved through the Council
4. Ancient sites and artifacts are protected by treaty
5. New magic users must be properly trained and integrated`,
    connections: ["Grand Library", "The Order", "Marcus Thorne", "Elena"],
    tags: ["main", "modern", "magical", "urban"],
    lastEdited: "1 hour ago",
  },
  {
    id: 2,
    name: "The Grand Library",
    type: "location",
    category: "Institution",
    description:
      "An imposing Gothic structure that serves as both a public library and the secret headquarters of the Order of Script Keepers.",
    image: null,
    images: [] as ImageItem[],
    details: {
      established: "1885",
      architect: "Helena Ravencroft (magical architect)",
      floors: "7 visible, 3 hidden",
      collection: "2.1 million books (500,000 magical)",
      staff: "67 (23 magical)",
      visitors: "15,000 daily (12 magical researchers)",
    } as Record<string, string>,
    culture: `The Grand Library operates on two levels - the public face serves the community with standard library services, while the hidden levels house one of the world's most important magical archives.

Public areas maintain traditional library atmosphere with reading rooms, computer stations, and community programs. Staff members are split between mundane librarians and magical archivists, with subtle signs helping magical visitors identify the initiated.

The deeper levels contain climate-controlled vaults, ritual chambers, and meeting rooms for the Order. Ancient wards protect the building, making it one of the safest places for magical activity in the city.`,
    history: `Built with both mundane and magical funds, the library was designed by Helena Ravencroft, a brilliant architect who embedded magical protections into the very structure. The Gothic exterior conceals a building that exists in multiple dimensions.

During its construction, several magical artifacts were built into the foundation, creating permanent protective wards. The library survived the Great Fire of 1906 without damage, confirming the effectiveness of these protections.

Over the decades, it has served as a meeting place for magical communities, a safe house during times of persecution, and a center for magical education. Many significant magical events in the city's history have originated from within its walls.`,
    rules: `1. Silence must be maintained in all reading areas
2. Magical books require special permission to access
3. No magical experimentation in public areas
4. Protective wards must not be tampered with
5. Confidentiality regarding magical patrons is absolute`,
    connections: ["New Haven City", "Marcus Thorne", "The Order", "Elena"],
    tags: ["magical", "important", "secret", "knowledge"],
    lastEdited: "2 hours ago",
  },
  {
    id: 3,
    name: "The Order of Script Keepers",
    type: "organization",
    category: "Secret Society",
    description:
      "An ancient organization dedicated to preserving magical knowledge and protecting those who can read the old scripts.",
    image: null,
    images: [] as ImageItem[],
    details: {
      founded: "312 CE",
      members: "~2,000 worldwide",
      chapters: "47 cities globally",
      leader: "The High Keeper (identity secret)",
      structure: "Council of Seven, Regional Keepers, Local Guardians",
      headquarters: "Various (Grand Library is North American HQ)",
    } as Record<string, string>,
    culture: `The Order operates on principles of knowledge preservation, discretion, and mutual protection. Members come from all walks of life but share the ability to read and work with ancient magical scripts.

Hierarchy is based on knowledge and service rather than birth or wealth. The Order values scholarly pursuit, ethical use of power, and protection of the innocent. Members often lead double lives, using mundane careers as cover for their true calling.

Initiation involves demonstrating script-reading ability and swearing binding oaths of secrecy and service. The Order provides training, resources, and protection to members while expecting loyalty and adherence to their code.`,
    history: `Founded in 312 CE by seven scholars who saved ancient texts from the burning of the Library of Alexandria, the Order has operated continuously for over 1,700 years.

Throughout history, they've preserved magical knowledge through the fall of Rome, the Dark Ages, the Inquisition, and two World Wars. They adapted to each era while maintaining their core mission.

The Order played crucial roles in establishing magical safe havens, creating networks of protection for persecuted magic users, and maintaining the balance between magical and mundane worlds. They've been instrumental in preventing magical knowledge from falling into the wrong hands.`,
    rules: `1. Preserve and protect all authentic magical knowledge
2. Maintain absolute secrecy from the uninitiated
3. Provide aid and training to new Script Readers
4. Never use the ancient arts for personal gain or harm
5. Defend the Order and its members with your life if necessary`,
    connections: ["Grand Library", "Marcus Thorne", "Ancient Scripts", "Elena"],
    tags: ["organization", "ancient", "secret", "magical"],
    lastEdited: "3 days ago",
  },
  {
    id: 4,
    name: "Ancient Magical Scripts",
    type: "system",
    category: "Magic System",
    description:
      "The foundation of all magic in this world - ancient writing systems that channel power through written symbols and understood meaning.",
    image: null,
    images: [] as ImageItem[],
    details: {
      origins: "Pre-civilization, possibly otherworldly",
      varieties: "12 major script families, 300+ dialects",
      users: "~5,000 globally (varying skill levels)",
      power_source:
        "Unknown - theories include collective unconscious, dimensional energy",
      limitations: "Requires understanding, not just copying",
      materials: "Special inks, papers, stones for advanced work",
    } as Record<string, string>,
    culture: `Script Reading is both an art and a science, requiring deep understanding of language, symbolism, and meaning. Practitioners spend years studying not just the symbols but the cultures and contexts that created them.

The magical community has developed elaborate theories about how the scripts work, from Jung's collective unconscious to quantum mechanics. Most agree that mere copying without understanding produces no effect - the magic requires genuine comprehension.

Different script families have different specialties: some excel at transformation, others at communication or protection. Master practitioners often specialize in one or two families rather than attempting to learn all.`,
    history: `The scripts predate recorded human civilization, appearing in archaeological sites worldwide with no clear origin point. Some theorists believe they were taught to humans by another species; others think they evolved naturally as language developed.

Throughout history, the scripts have surfaced during pivotal moments - the Library of Alexandria contained significant collections, medieval monasteries preserved fragments, and Renaissance scholars rediscovered lost techniques.

The industrial revolution nearly led to their complete suppression as scientific materialism took hold. The Order of Script Keepers' greatest achievement was preserving this knowledge through the modern era.`,
    rules: `1. Scripts only work when their meaning is truly understood
2. Stronger effects require rarer materials and deeper knowledge
3. Overuse causes physical and mental exhaustion
4. Some ancient texts contain dangerous or corrupting knowledge
5. The scripts appear to have their own agenda or consciousness`,
    connections: ["The Order", "Elena", "Marcus", "Grand Library"],
    tags: ["fundamental", "mysterious", "powerful", "ancient"],
    lastEdited: "1 week ago",
  },
];

const worldElementTypes = [
  "location",
  "organization",
  "system",
  "culture",
  "history",
  "other",
];
const worldElementCategories = {
  location: [
    "City",
    "Building",
    "Natural Area",
    "Institution",
    "Landmark",
    "Region",
  ],
  organization: [
    "Government",
    "Secret Society",
    "Corporation",
    "Guild",
    "Family",
    "Military",
  ],
  system: [
    "Magic System",
    "Technology",
    "Social System",
    "Economic System",
    "Political System",
  ],
  culture: [
    "Ethnic Group",
    "Subculture",
    "Tradition",
    "Religion",
    "Art Form",
    "Language",
  ],
  history: ["Event", "Era", "War", "Discovery", "Crisis", "Legend"],
  other: ["Artifact", "Concept", "Mystery", "Phenomenon", "Resource", "Custom"],
};

export default function WorldBuilding() {
  const { currentStory } = useStory();

  // Store world elements per story using story ID as key
  const [storyWorldElements, setStoryWorldElements] = useState<
    Record<string, typeof mockWorldElements>
  >({});

  // Get world elements for current story
  const worldElements = currentStory
    ? storyWorldElements[currentStory.id] || []
    : [];
  const [selectedElement, setSelectedElement] = useState<any>(null);

  // Initialize world elements for current story if not exists
  useEffect(() => {
    if (currentStory && !storyWorldElements[currentStory.id]) {
      // Initialize with sample world elements for "The Script Reader's Legacy"
      if (currentStory.id === "story-1") {
        setStoryWorldElements((prev) => ({
          ...prev,
          [currentStory.id]: mockWorldElements,
        }));
      } else {
        // New stories start with empty world elements
        setStoryWorldElements((prev) => ({
          ...prev,
          [currentStory.id]: [],
        }));
      }
    }
  }, [currentStory, storyWorldElements]);

  // Set selected element when story changes
  useEffect(() => {
    if (currentStory && worldElements.length > 0 && !selectedElement) {
      setSelectedElement(worldElements[0]);
    } else if (!currentStory) {
      setSelectedElement(null);
    }
  }, [currentStory, worldElements, selectedElement]);
  const [elementName, setElementName] = useState(selectedElement?.name || "");
  const [elementType, setElementType] = useState(
    selectedElement?.type || "location",
  );
  const [elementCategory, setElementCategory] = useState(
    selectedElement?.category || "City",
  );
  const [elementDescription, setElementDescription] = useState(
    selectedElement?.description || "",
  );
  const [elementCulture, setElementCulture] = useState(
    selectedElement?.culture || "",
  );
  const [elementHistory, setElementHistory] = useState(
    selectedElement?.history || "",
  );
  const [elementRules, setElementRules] = useState(
    selectedElement?.rules || "",
  );
  const [elementConnections, setElementConnections] = useState(
    selectedElement?.connections?.join(", ") || "",
  );
  const [elementTags, setElementTags] = useState(
    selectedElement?.tags?.join(", ") || "",
  );
  const [elementImage, setElementImage] = useState(
    selectedElement?.image || null,
  );
  const [elementImages, setElementImages] = useState<ImageItem[]>(
    selectedElement?.images || [],
  );
  const [elementDetails, setElementDetails] = useState(
    selectedElement?.details
      ? Object.entries(selectedElement.details)
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n")
      : "",
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [connectionsViewOpen, setConnectionsViewOpen] = useState(false);

  // Update form fields when selected element changes
  useEffect(() => {
    if (selectedElement) {
      setElementName(selectedElement.name);
      setElementType(selectedElement.type);
      setElementCategory(selectedElement.category);
      setElementDescription(selectedElement.description);
      setElementCulture(selectedElement.culture);
      setElementHistory(selectedElement.history);
      setElementRules(selectedElement.rules);
      setElementConnections(selectedElement.connections?.join(", ") || "");
      setElementTags(selectedElement.tags?.join(", ") || "");
      setElementImage(selectedElement.image);
      setElementImages(selectedElement.images || []);
      setElementDetails(
        Object.entries(selectedElement.details || {})
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n"),
      );
    } else {
      setElementName("");
      setElementType("location");
      setElementCategory("City");
      setElementDescription("");
      setElementCulture("");
      setElementHistory("");
      setElementRules("");
      setElementConnections("");
      setElementTags("");
      setElementImage(null);
      setElementImages([]);
      setElementDetails("");
    }
  }, [selectedElement]);

  // Image handlers
  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setElementImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setElementImage(null);
  };

  // Button handlers
  const handleNewElement = () => {
    console.log("handleNewElement called, currentStory:", currentStory);
    if (!currentStory) {
      console.error("No current story selected");
      alert("Please select a story first to add world elements");
      return;
    }

    const newElement = {
      id: Math.max(...worldElements.map((e) => e.id), 0) + 1,
      name: `New World Element ${worldElements.length + 1}`,
      type: "location",
      category: "City",
      description: "Describe this world element...",
      image: null,
      images: [] as ImageItem[],
      details: {} as Record<string, string>,
      culture: "What is the culture like here?",
      history: "What is the history of this place?",
      rules: "Are there any special rules or laws?",
      connections: [],
      tags: [],
      lastEdited: "Just now",
    };

    const updatedWorldElements = [...worldElements, newElement];
    setStoryWorldElements((prev) => ({
      ...prev,
      [currentStory.id]: updatedWorldElements,
    }));
    setSelectedElement(newElement);

    // Focus on the name field after a short delay to allow React to update
    setTimeout(() => {
      const nameInput = document.getElementById("element-name");
      if (nameInput) {
        nameInput.focus();
        nameInput.select();
      }
    }, 100);
  };

  const handleDeleteElement = (elementId: number) => {
    if (!currentStory) return;

    const updatedElements = worldElements.filter((e) => e.id !== elementId);
    setStoryWorldElements((prev) => ({
      ...prev,
      [currentStory.id]: updatedElements,
    }));

    if (selectedElement?.id === elementId && updatedElements.length > 0) {
      setSelectedElement(updatedElements[0]);
    } else if (selectedElement?.id === elementId) {
      setSelectedElement(null);
    }
  };

  const handleDuplicateElement = (elementId: number) => {
    if (!currentStory) return;

    const elementToDuplicate = worldElements.find((e) => e.id === elementId);
    if (elementToDuplicate) {
      const newElement = {
        ...elementToDuplicate,
        id: Math.max(...worldElements.map((e) => e.id)) + 1,
        name: `${elementToDuplicate.name} (Copy)`,
        lastEdited: "Just now",
      };
      const updatedWorldElements = [...worldElements, newElement];
      setStoryWorldElements((prev) => ({
        ...prev,
        [currentStory.id]: updatedWorldElements,
      }));
    }
  };

  const handlePreview = () => {
    setPreviewOpen(true);
  };

  const handleConnectionsView = () => {
    setConnectionsViewOpen(true);
  };

  const handleSave = () => {
    // Parse details from string format
    const detailsObj: Record<string, string> = {};
    elementDetails.split("\n").forEach((line) => {
      const [key, ...valueParts] = line.split(":");
      if (key && valueParts.length > 0) {
        detailsObj[key.trim()] = valueParts.join(":").trim();
      }
    });

    if (!selectedElement || !currentStory) return;

    const updatedElements = worldElements.map((element) =>
      element.id === selectedElement.id
        ? {
            ...element,
            name: elementName,
            type: elementType,
            category: elementCategory,
            description: elementDescription,
            culture: elementCulture,
            history: elementHistory,
            rules: elementRules,
            connections: elementConnections
              .split(",")
              .map((c) => c.trim())
              .filter((c) => c),
            tags: elementTags
              .split(",")
              .map((t) => t.trim())
              .filter((t) => t),
            image: elementImage,
            images: elementImages,
            details: detailsObj,
            lastEdited: "Just now",
          }
        : element,
    );
    setStoryWorldElements((prev) => ({
      ...prev,
      [currentStory.id]: updatedElements,
    }));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "location":
        return <MapPin className="h-3 w-3" />;
      case "organization":
        return <Users className="h-3 w-3" />;
      case "system":
        return <Target className="h-3 w-3" />;
      case "culture":
        return <Crown className="h-3 w-3" />;
      case "history":
        return <Scroll className="h-3 w-3" />;
      default:
        return <Globe className="h-3 w-3" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "city":
        return <Building className="h-3 w-3" />;
      case "natural area":
        return <Trees className="h-3 w-3" />;
      case "institution":
        return <Landmark className="h-3 w-3" />;
      case "secret society":
        return <Eye className="h-3 w-3" />;
      case "magic system":
        return <Star className="h-3 w-3" />;
      default:
        return <Globe className="h-3 w-3" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "location":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "organization":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "system":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "culture":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "history":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // Filter elements based on search and filters
  const filteredElements = worldElements.filter((element) => {
    const matchesSearch =
      element.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      element.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      element.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesType = typeFilter === "all" || element.type === typeFilter;
    const matchesCategory =
      categoryFilter === "all" || element.category === categoryFilter;
    return matchesSearch && matchesType && matchesCategory;
  });

  // Get available categories for current type filter
  const availableCategories =
    typeFilter === "all"
      ? Object.values(worldElementCategories).flat()
      : worldElementCategories[
          typeFilter as keyof typeof worldElementCategories
        ] || [];

  // Show no story selected state
  if (!currentStory) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Story Selected</h3>
          <p className="text-muted-foreground mb-4">
            Please select or create a story to manage world building.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* World Elements Sidebar */}
      <div className="w-80 border-r bg-card">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">World Elements</h2>
            <Button
              size="sm"
              onClick={(e) => {
                console.log("New World Element button clicked");
                e.preventDefault();
                handleNewElement();
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
                placeholder="Search world elements..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {worldElementTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {availableCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredElements.map((element) => (
              <Card
                key={element.id}
                className={`mb-2 cursor-pointer transition-all hover:shadow-md ${
                  selectedElement?.id === element.id
                    ? "ring-2 ring-primary"
                    : ""
                }`}
                onClick={() => setSelectedElement(element)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-3 flex-1">
                      {element.image ? (
                        <img
                          src={element.image}
                          alt={element.name}
                          className="w-10 h-10 rounded object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-10 h-10 rounded bg-primary/10 text-primary flex-shrink-0">
                          {getTypeIcon(element.type)}
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium text-sm leading-tight">
                          {element.name}
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
                            handleDuplicateElement(element.id);
                          }}
                        >
                          <Copy className="h-3 w-3 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteElement(element.id);
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
                      <Badge className={getTypeColor(element.type)}>
                        {element.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {element.category}
                      </span>
                    </div>

                    {element.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {element.tags.slice(0, 3).map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs px-1 py-0"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {element.tags.length > 3 && (
                          <Badge
                            variant="secondary"
                            className="text-xs px-1 py-0"
                          >
                            +{element.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {element.description}
                  </p>

                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {element.lastEdited}
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
              <Globe className="h-5 w-5 text-primary" />
              <div>
                <h1 className="text-xl font-semibold">{elementName}</h1>
                <p className="text-sm text-muted-foreground">
                  {selectedElement
                    ? `${elementType.charAt(0).toUpperCase() + elementType.slice(1)} • ${elementCategory}`
                    : "No world element selected"}
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
                onClick={handleConnectionsView}
              >
                <Users className="h-4 w-4 mr-2" />
                Connections
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Target className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium">{elementType}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Category:</span>
              <span className="font-medium">{elementCategory}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Connections:</span>
              <span className="font-medium">
                {selectedElement?.connections?.length || 0}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Edit className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Tags:</span>
              <span className="font-medium">
                {selectedElement?.tags?.length || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 p-6 pb-24">
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="culture">Culture & History</TabsTrigger>
                <TabsTrigger value="connections">Connections</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-6">
                {/* Image Gallery */}
                <ImageGallery
                  images={elementImages}
                  onImagesChange={setElementImages}
                  maxImages={5}
                  title="World Element Images"
                  description="Upload maps, photos, or illustrations to visualize this world element"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="element-name">Name</Label>
                    <Input
                      id="element-name"
                      value={elementName}
                      onChange={(e) => setElementName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="element-type">Type</Label>
                    <Select value={elementType} onValueChange={setElementType}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {worldElementTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="element-category">Category</Label>
                  <Select
                    value={elementCategory}
                    onValueChange={setElementCategory}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(
                        worldElementCategories[
                          elementType as keyof typeof worldElementCategories
                        ] || []
                      ).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="element-description">Description</Label>
                  <Textarea
                    id="element-description"
                    value={elementDescription}
                    onChange={(e) => setElementDescription(e.target.value)}
                    placeholder="Brief description of this world element..."
                    className="mt-1"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="element-tags">Tags</Label>
                  <Input
                    id="element-tags"
                    value={elementTags}
                    onChange={(e) => setElementTags(e.target.value)}
                    placeholder="magical, important, secret, ancient, etc. (comma separated)"
                    className="mt-1"
                  />
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4 mt-6">
                <div>
                  <Label htmlFor="element-details">Details & Statistics</Label>
                  <Textarea
                    id="element-details"
                    value={elementDetails}
                    onChange={(e) => setElementDetails(e.target.value)}
                    placeholder={`Add key details, one per line:
population: 2.3 million
established: 1885
government: Democratic
climate: Temperate`}
                    className="mt-1 font-mono text-sm"
                    rows={10}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Format: key: value (one per line)
                  </p>
                </div>

                <div>
                  <Label htmlFor="element-rules">Rules & Laws</Label>
                  <Textarea
                    id="element-rules"
                    value={elementRules}
                    onChange={(e) => setElementRules(e.target.value)}
                    placeholder="Important rules, laws, or principles that govern this world element..."
                    className="mt-1"
                    rows={6}
                  />
                </div>
              </TabsContent>

              <TabsContent value="culture" className="space-y-4 mt-6">
                <div>
                  <Label htmlFor="element-culture">Culture & Society</Label>
                  <Textarea
                    id="element-culture"
                    value={elementCulture}
                    onChange={(e) => setElementCulture(e.target.value)}
                    placeholder="Describe the culture, social structure, customs, and way of life..."
                    className="mt-1"
                    rows={8}
                  />
                </div>

                <div>
                  <Label htmlFor="element-history">History & Background</Label>
                  <Textarea
                    id="element-history"
                    value={elementHistory}
                    onChange={(e) => setElementHistory(e.target.value)}
                    placeholder="Describe the historical background, important events, and how it came to be..."
                    className="mt-1"
                    rows={8}
                  />
                </div>
              </TabsContent>

              <TabsContent value="connections" className="space-y-4 mt-6">
                <div>
                  <Label htmlFor="element-connections">
                    Connected Elements
                  </Label>
                  <Textarea
                    id="element-connections"
                    value={elementConnections}
                    onChange={(e) => setElementConnections(e.target.value)}
                    placeholder="List connected characters, locations, organizations, etc. (comma separated)"
                    className="mt-1"
                    rows={4}
                  />
                </div>

                <WorldConnectionMap
                  currentElement={{
                    id: selectedElement?.id?.toString() || "current",
                    name: elementName,
                    type: elementType,
                    category: elementCategory,
                  }}
                  allElements={worldElements.map((element) => ({
                    id: element.id.toString(),
                    name: element.name,
                    type: element.type,
                    category: element.category,
                  }))}
                  connections={elementConnections
                    .split(",")
                    .map((c) => c.trim())
                    .filter((c) => c)}
                />
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex justify-between items-center text-sm text-muted-foreground">
              <span>Auto-save enabled • Last saved just now</span>
              <span>Last edited {selectedElement?.lastEdited || "Never"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>World Element: {elementName}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="flex items-start gap-4 mb-4">
              {elementImage && (
                <img
                  src={elementImage}
                  alt={elementName}
                  className="w-32 h-32 rounded-lg object-cover border"
                />
              )}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className={getTypeColor(elementType)}>
                    {elementType}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {elementCategory}
                  </span>
                </div>
                <p className="text-sm">{elementDescription}</p>
                {elementTags && (
                  <div className="flex flex-wrap gap-1">
                    {elementTags
                      .split(",")
                      .map((t) => t.trim())
                      .filter((t) => t)
                      .map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {elementDetails && (
              <div>
                <h3 className="font-semibold mb-2">Details</h3>
                <div className="text-sm space-y-1">
                  {elementDetails.split("\n").map((line, index) => {
                    const [key, ...valueParts] = line.split(":");
                    if (key && valueParts.length > 0) {
                      return (
                        <div key={index} className="grid grid-cols-3 gap-2">
                          <span className="font-medium">{key.trim()}:</span>
                          <span className="col-span-2">
                            {valueParts.join(":").trim()}
                          </span>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            )}

            {elementCulture && (
              <div>
                <h3 className="font-semibold mb-2">Culture & Society</h3>
                <p className="text-sm whitespace-pre-wrap">{elementCulture}</p>
              </div>
            )}

            {elementHistory && (
              <div>
                <h3 className="font-semibold mb-2">History</h3>
                <p className="text-sm whitespace-pre-wrap">{elementHistory}</p>
              </div>
            )}

            {elementRules && (
              <div>
                <h3 className="font-semibold mb-2">Rules & Laws</h3>
                <p className="text-sm whitespace-pre-wrap">{elementRules}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Connections View Modal */}
      <Dialog open={connectionsViewOpen} onOpenChange={setConnectionsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Connections: {elementName}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {elementConnections
              .split(",")
              .map((c) => c.trim())
              .filter((c) => c).length > 0 ? (
              <div className="space-y-3">
                {elementConnections
                  .split(",")
                  .map((c) => c.trim())
                  .filter((c) => c)
                  .map((connection, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{connection}</div>
                        <div className="text-sm text-muted-foreground">
                          Connected to {elementName}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                No connections defined yet. Add connections in the world element
                form to see them here.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
