import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookTemplate,
  Lightbulb,
  Wand2,
  Heart,
  Skull,
  Zap,
  Globe,
  Crown,
  Sword,
  Rocket,
  Brain,
  Coffee,
  Shuffle,
  Plus,
  Download,
  Star,
} from "lucide-react";
import { useStory } from "@/contexts/StoryContext";

interface StoryTemplate {
  id: string;
  title: string;
  genre: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedLength: string;
  tags: string[];
  outline: string[];
  characters: Array<{
    name: string;
    role: string;
    description: string;
  }>;
  plotPoints: string[];
  themes: string[];
  conflicts: string[];
  settings: string[];
}

interface WritingPrompt {
  id: string;
  type: "character" | "plot" | "setting" | "dialogue" | "scenario";
  category: string;
  prompt: string;
  tags: string[];
  difficulty: "easy" | "medium" | "hard";
  genre: string[];
}

const storyTemplates: StoryTemplate[] = [
  {
    id: "mystery-cozy",
    title: "Cozy Mystery",
    genre: "Mystery",
    description:
      "A gentle mystery set in a small town with an amateur detective.",
    difficulty: "beginner",
    estimatedLength: "50,000-70,000 words",
    tags: ["mystery", "cozy", "small-town", "amateur-detective"],
    outline: [
      "Chapter 1: Introduction to the setting and protagonist",
      "Chapter 2: The mysterious incident occurs",
      "Chapter 3: Initial investigation and red herrings",
      "Chapter 4: Digging deeper, discovering secrets",
      "Chapter 5: False solution and new evidence",
      "Chapter 6: The real culprit revealed",
      "Chapter 7: Resolution and aftermath",
    ],
    characters: [
      {
        name: "Amateur Detective",
        role: "Protagonist",
        description:
          "Local resident with keen observation skills and natural curiosity",
      },
      {
        name: "The Victim",
        role: "Catalyst",
        description: "Someone connected to local secrets and multiple suspects",
      },
      {
        name: "Local Authority Figure",
        role: "Supporting",
        description: "Police officer or official who reluctantly accepts help",
      },
      {
        name: "The Red Herring",
        role: "Suspect",
        description: "Obvious suspect with motive but ultimately innocent",
      },
      {
        name: "The Real Culprit",
        role: "Antagonist",
        description: "Unexpected perpetrator with hidden connections",
      },
    ],
    plotPoints: [
      "Establish the charming setting and community",
      "Introduce the protagonist's daily life",
      "Discovery of the central mystery",
      "First investigation attempts",
      "Uncovering local secrets and gossip",
      "Following false leads",
      "Moment of revelation",
      "Confrontation with the culprit",
      "Resolution and community healing",
    ],
    themes: [
      "Justice",
      "Community",
      "Truth vs. Appearance",
      "Small-town dynamics",
    ],
    conflicts: [
      "Amateur vs. Professional investigation",
      "Uncovering uncomfortable truths",
      "Personal safety vs. curiosity",
    ],
    settings: [
      "Small town or village",
      "Local businesses",
      "Community gathering places",
      "Residential neighborhoods",
    ],
  },
  {
    id: "romance-enemies-to-lovers",
    title: "Enemies to Lovers Romance",
    genre: "Romance",
    description: "Two people who start as adversaries gradually fall in love.",
    difficulty: "intermediate",
    estimatedLength: "60,000-80,000 words",
    tags: ["romance", "enemies-to-lovers", "tension", "character-development"],
    outline: [
      "Chapter 1: Meet the protagonists in conflict",
      "Chapter 2: Forced proximity or collaboration",
      "Chapter 3: Initial friction and misunderstandings",
      "Chapter 4: Glimpses of the other's true nature",
      "Chapter 5: Growing attraction and internal conflict",
      "Chapter 6: The turning point - vulnerability shown",
      "Chapter 7: Obstacles and misunderstandings",
      "Chapter 8: Confession and resolution",
    ],
    characters: [
      {
        name: "Protagonist A",
        role: "Love Interest",
        description: "Strong-willed character with hidden vulnerabilities",
      },
      {
        name: "Protagonist B",
        role: "Love Interest",
        description: "Equally strong character with opposing goals or methods",
      },
      {
        name: "The Catalyst",
        role: "Supporting",
        description: "Person or situation that forces them together",
      },
      {
        name: "The Confidant",
        role: "Supporting",
        description: "Friend who provides advice and perspective",
      },
    ],
    plotPoints: [
      "Establish the conflict between protagonists",
      "Show their opposing worlds or goals",
      "Create forced proximity",
      "First crack in the enemy facade",
      "Growing respect and understanding",
      "Sexual/romantic tension builds",
      "Moment of vulnerability",
      "External obstacle threatens relationship",
      "Grand gesture or confession",
      "Happy ending with growth",
    ],
    themes: [
      "Love conquers all",
      "Growth through challenge",
      "Seeing beyond first impressions",
    ],
    conflicts: [
      "Professional vs. Personal",
      "Past hurts vs. Present possibilities",
      "Pride vs. Vulnerability",
    ],
    settings: [
      "Workplace or professional environment",
      "Small town where escape is impossible",
      "Competition or contest setting",
    ],
  },
  {
    id: "scifi-first-contact",
    title: "First Contact Science Fiction",
    genre: "Science Fiction",
    description: "Humanity's first encounter with alien intelligence.",
    difficulty: "advanced",
    estimatedLength: "80,000-100,000 words",
    tags: ["sci-fi", "first-contact", "aliens", "exploration", "diplomacy"],
    outline: [
      "Act I: Discovery of alien presence",
      "Act II: Initial contact attempts",
      "Act III: Communication breakthroughs",
      "Act IV: Cultural exchange and conflicts",
      "Act V: Crisis and resolution",
    ],
    characters: [
      {
        name: "Lead Scientist/Diplomat",
        role: "Protagonist",
        description:
          "Expert in xenobiology or communications leading first contact",
      },
      {
        name: "Military Commander",
        role: "Antagonist/Ally",
        description: "Represents security concerns and potential conflict",
      },
      {
        name: "Alien Ambassador",
        role: "Deuteragonist",
        description: "Representative of alien species with own agenda",
      },
      {
        name: "Political Leader",
        role: "Supporting",
        description: "Human authority figure managing political implications",
      },
    ],
    plotPoints: [
      "Detection of alien signal or presence",
      "Assembly of first contact team",
      "Initial contact attempts",
      "Communication breakthrough",
      "Cultural misunderstandings",
      "Political complications on both sides",
      "Crisis that threatens relations",
      "Resolution through understanding",
      "New era of cooperation begins",
    ],
    themes: [
      "Unity in diversity",
      "Communication barriers",
      "Fear of the unknown",
      "Scientific discovery",
    ],
    conflicts: [
      "Science vs. Military approach",
      "Human political divisions",
      "Xenophobia vs. Acceptance",
    ],
    settings: [
      "Space station or research facility",
      "Alien homeworld",
      "Earth's major cities",
      "Diplomatic meeting spaces",
    ],
  },
  {
    id: "fantasy-chosen-one",
    title: "The Chosen One Fantasy",
    genre: "Fantasy",
    description: "A reluctant hero discovers their destiny to save the world.",
    difficulty: "intermediate",
    estimatedLength: "90,000-120,000 words",
    tags: ["fantasy", "chosen-one", "magic", "quest", "coming-of-age"],
    outline: [
      "Part I: The Ordinary World",
      "Part II: The Call to Adventure",
      "Part III: Training and Trials",
      "Part IV: The Approach to the Ordeal",
      "Part V: The Final Battle",
      "Part VI: Return with the Elixir",
    ],
    characters: [
      {
        name: "The Chosen One",
        role: "Protagonist",
        description: "Reluctant hero with hidden magical abilities",
      },
      {
        name: "The Mentor",
        role: "Guide",
        description: "Wise teacher who reveals the protagonist's destiny",
      },
      {
        name: "The Dark Lord",
        role: "Antagonist",
        description: "Ancient evil threatening to destroy the world",
      },
      {
        name: "The Loyal Companion",
        role: "Supporting",
        description: "Friend who accompanies the hero on their journey",
      },
    ],
    plotPoints: [
      "Hero living ordinary life",
      "Discovery of magical abilities",
      "Learning about the prophecy",
      "Beginning magical training",
      "First encounter with dark forces",
      "Gathering allies and artifacts",
      "Major setback or loss",
      "Final preparation for battle",
      "Confronting the Dark Lord",
      "Victory and new world order",
    ],
    themes: [
      "Good vs. Evil",
      "Self-discovery",
      "Power and responsibility",
      "Sacrifice for others",
    ],
    conflicts: [
      "Personal desires vs. Destiny",
      "Trust in companions",
      "Overcoming self-doubt",
    ],
    settings: [
      "Medieval fantasy world",
      "Magical academy or training ground",
      "Ancient ruins and dungeons",
      "Dark lord's fortress",
    ],
  },
];

const writingPrompts: WritingPrompt[] = [
  {
    id: "char-1",
    type: "character",
    category: "Personality",
    prompt:
      "Create a character who always tells the truth but is never believed.",
    tags: ["honesty", "irony", "misunderstood"],
    difficulty: "medium",
    genre: ["drama", "comedy", "fantasy"],
  },
  {
    id: "char-2",
    type: "character",
    category: "Background",
    prompt: "Write about someone who wakes up with a skill they never learned.",
    tags: ["mystery", "supernatural", "identity"],
    difficulty: "easy",
    genre: ["fantasy", "sci-fi", "thriller"],
  },
  {
    id: "plot-1",
    type: "plot",
    category: "Conflict",
    prompt:
      "Two people discover they've been unknowingly living each other's lives.",
    tags: ["identity", "mystery", "parallel-lives"],
    difficulty: "hard",
    genre: ["drama", "fantasy", "sci-fi"],
  },
  {
    id: "plot-2",
    type: "plot",
    category: "Twist",
    prompt:
      "The villain has been helping the hero all along, but for their own dark reasons.",
    tags: ["betrayal", "plot-twist", "moral-ambiguity"],
    difficulty: "medium",
    genre: ["thriller", "fantasy", "mystery"],
  },
  {
    id: "setting-1",
    type: "setting",
    category: "Unique Places",
    prompt:
      "A library where books write themselves based on the reader's deepest fears.",
    tags: ["supernatural", "fear", "knowledge"],
    difficulty: "medium",
    genre: ["horror", "fantasy", "psychological"],
  },
  {
    id: "dialogue-1",
    type: "dialogue",
    category: "Conflict",
    prompt:
      "Write a conversation where both characters are lying, but about different things.",
    tags: ["deception", "tension", "subtext"],
    difficulty: "hard",
    genre: ["drama", "thriller", "mystery"],
  },
  {
    id: "scenario-1",
    type: "scenario",
    category: "What If",
    prompt: "What if gravity stopped working for exactly one hour every day?",
    tags: ["physics", "daily-life", "adaptation"],
    difficulty: "medium",
    genre: ["sci-fi", "drama", "comedy"],
  },
];

export function StoryTemplates() {
  const { onStoryCreate } = useStory();
  const [selectedTemplate, setSelectedTemplate] =
    useState<StoryTemplate | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<WritingPrompt | null>(
    null,
  );
  const [promptFilter, setPromptFilter] = useState<string>("all");
  const [templateFilter, setTemplateFilter] = useState<string>("all");
  const [customStoryTitle, setCustomStoryTitle] = useState("");
  const [isCreatingFromTemplate, setIsCreatingFromTemplate] = useState(false);

  const getGenreIcon = (genre: string) => {
    switch (genre.toLowerCase()) {
      case "romance":
        return <Heart className="h-4 w-4" />;
      case "mystery":
        return <Skull className="h-4 w-4" />;
      case "science fiction":
      case "sci-fi":
        return <Rocket className="h-4 w-4" />;
      case "fantasy":
        return <Crown className="h-4 w-4" />;
      case "thriller":
        return <Zap className="h-4 w-4" />;
      default:
        return <BookTemplate className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "intermediate":
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "advanced":
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const filteredTemplates = storyTemplates.filter((template) => {
    if (templateFilter === "all") return true;
    return template.genre.toLowerCase() === templateFilter.toLowerCase();
  });

  const filteredPrompts = writingPrompts.filter((prompt) => {
    if (promptFilter === "all") return true;
    return prompt.type === promptFilter;
  });

  const createStoryFromTemplate = () => {
    if (!selectedTemplate || !customStoryTitle.trim()) return;

    const newStory = {
      id: `story-${Date.now()}`,
      title: customStoryTitle,
      genre: selectedTemplate.genre,
      description: `Based on ${selectedTemplate.title} template. ${selectedTemplate.description}`,
      status: "draft" as const,
      progress: 0,
      wordCount: 0,
      lastEdited: new Date(),
      createdAt: new Date(),
      tags: selectedTemplate.tags,
      themes: selectedTemplate.themes,
    };

    // Create initial content based on template
    const initialCharacters = selectedTemplate.characters.map(
      (char, index) => ({
        id: index + 1,
        name: char.name,
        role: char.role,
        description: char.description,
        // ... other character fields with template data
      }),
    );

    const initialNotes = [
      {
        id: 1,
        title: "Story Outline",
        content: selectedTemplate.outline.join("\n\n"),
        category: "Plot",
        tags: ["outline", "template"],
      },
      {
        id: 2,
        title: "Plot Points",
        content: selectedTemplate.plotPoints.join("\n\n"),
        category: "Plot",
        tags: ["plot", "template"],
      },
      {
        id: 3,
        title: "Themes to Explore",
        content: selectedTemplate.themes.join("\n\n"),
        category: "Theme",
        tags: ["themes", "template"],
      },
    ];

    // Store template data
    localStorage.setItem(
      `chronicle-characters-${newStory.id}`,
      JSON.stringify(initialCharacters),
    );
    localStorage.setItem(
      `chronicle-notes-${newStory.id}`,
      JSON.stringify(initialNotes),
    );

    // Create the story
    onStoryCreate(newStory);

    // Reset form
    setCustomStoryTitle("");
    setSelectedTemplate(null);
    setIsCreatingFromTemplate(false);
  };

  const generateRandomPrompt = () => {
    const randomPrompt =
      writingPrompts[Math.floor(Math.random() * writingPrompts.length)];
    setSelectedPrompt(randomPrompt);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            Story Templates & Writing Prompts
          </h2>
          <p className="text-muted-foreground">
            Jumpstart your creativity with proven story structures and inspiring
            prompts
          </p>
        </div>
        <Button onClick={generateRandomPrompt} variant="outline">
          <Shuffle className="h-4 w-4 mr-2" />
          Random Prompt
        </Button>
      </div>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Story Templates</TabsTrigger>
          <TabsTrigger value="prompts">Writing Prompts</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex items-center gap-4">
            <Label>Filter by Genre:</Label>
            <Select value={templateFilter} onValueChange={setTemplateFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                <SelectItem value="mystery">Mystery</SelectItem>
                <SelectItem value="romance">Romance</SelectItem>
                <SelectItem value="science fiction">Science Fiction</SelectItem>
                <SelectItem value="fantasy">Fantasy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedTemplate(template)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getGenreIcon(template.genre)}
                    {template.title}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{template.genre}</Badge>
                    <Badge className={getDifficultyColor(template.difficulty)}>
                      {template.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {template.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {template.estimatedLength}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {template.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="prompts" className="space-y-4">
          <div className="flex items-center gap-4">
            <Label>Filter by Type:</Label>
            <Select value={promptFilter} onValueChange={setPromptFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="character">Character</SelectItem>
                <SelectItem value="plot">Plot</SelectItem>
                <SelectItem value="setting">Setting</SelectItem>
                <SelectItem value="dialogue">Dialogue</SelectItem>
                <SelectItem value="scenario">Scenario</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedPrompt && (
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Featured Prompt
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-3">
                  <Badge variant="default">{selectedPrompt.type}</Badge>
                  <Badge
                    className={getDifficultyColor(selectedPrompt.difficulty)}
                  >
                    {selectedPrompt.difficulty}
                  </Badge>
                </div>
                <p className="text-lg mb-3">{selectedPrompt.prompt}</p>
                <div className="flex flex-wrap gap-1">
                  {selectedPrompt.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPrompts.map((prompt) => (
              <Card
                key={prompt.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedPrompt(prompt)}
              >
                <CardContent className="p-4">
                  <div className="flex gap-2 mb-2">
                    <Badge variant="secondary">{prompt.type}</Badge>
                    <Badge className={getDifficultyColor(prompt.difficulty)}>
                      {prompt.difficulty}
                    </Badge>
                  </div>
                  <p className="mb-3">{prompt.prompt}</p>
                  <div className="flex flex-wrap gap-1">
                    {prompt.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Template Detail Modal */}
      <Dialog
        open={!!selectedTemplate}
        onOpenChange={() => setSelectedTemplate(null)}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedTemplate && getGenreIcon(selectedTemplate.genre)}
              {selectedTemplate?.title}
            </DialogTitle>
          </DialogHeader>

          {selectedTemplate && (
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-6">
                  <div>
                    <p className="text-muted-foreground mb-4">
                      {selectedTemplate.description}
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="secondary">
                        {selectedTemplate.genre}
                      </Badge>
                      <Badge
                        className={getDifficultyColor(
                          selectedTemplate.difficulty,
                        )}
                      >
                        {selectedTemplate.difficulty}
                      </Badge>
                      <Badge variant="outline">
                        {selectedTemplate.estimatedLength}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Story Outline</h4>
                    <ul className="space-y-1">
                      {selectedTemplate.outline.map((point, index) => (
                        <li key={index} className="text-sm">
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Key Characters</h4>
                    <div className="space-y-2">
                      {selectedTemplate.characters.map((char, index) => (
                        <div key={index} className="border rounded p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{char.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {char.role}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {char.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Themes</h4>
                      <ul className="text-sm space-y-1">
                        {selectedTemplate.themes.map((theme, index) => (
                          <li key={index}>• {theme}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Core Conflicts</h4>
                      <ul className="text-sm space-y-1">
                        {selectedTemplate.conflicts.map((conflict, index) => (
                          <li key={index}>• {conflict}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">
                      Create Story from Template
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="story-title">Story Title</Label>
                        <Input
                          id="story-title"
                          placeholder="Enter your story title..."
                          value={customStoryTitle}
                          onChange={(e) => setCustomStoryTitle(e.target.value)}
                        />
                      </div>
                      <Button
                        onClick={createStoryFromTemplate}
                        disabled={!customStoryTitle.trim()}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Story from Template
                      </Button>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
