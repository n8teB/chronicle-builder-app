import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Download,
  FileText,
  BookOpen,
  Settings,
  Eye,
  Printer,
  Globe,
  Smartphone,
  Upload,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import { useStory } from "@/contexts/StoryContext";

interface ExportSettings {
  includeChapters: boolean;
  includeScenes: boolean;
  includeNotes: boolean;
  includeCharacterProfiles: boolean;
  includeWorldBuilding: boolean;
  includeTimeline: boolean;
  includeOutline: boolean;
  includeCoverPage: boolean;
  includeTableOfContents: boolean;
  includePageNumbers: boolean;
  includeWordCount: boolean;
  customHeader: string;
  customFooter: string;
  authorName: string;
  subtitle: string;
  dedication: string;
  acknowledgments: string;
  fontSize: number;
  fontFamily: string;
  lineSpacing: number;
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  paperSize: "A4" | "US Letter" | "US Legal";
  chapterPageBreak: boolean;
  sceneBreak: string;
}

interface ExportFormat {
  id: string;
  name: string;
  description: string;
  extension: string;
  icon: any;
  supports: string[];
  recommended: boolean;
}

const exportFormats: ExportFormat[] = [
  {
    id: "pdf",
    name: "PDF Document",
    description: "Professional publication-ready format",
    extension: ".pdf",
    icon: FileText,
    supports: ["formatting", "images", "print-ready"],
    recommended: true,
  },
  {
    id: "docx",
    name: "Microsoft Word",
    description: "Editable document for further editing",
    extension: ".docx",
    icon: FileText,
    supports: ["editing", "comments", "track-changes"],
    recommended: true,
  },
  {
    id: "epub",
    name: "EPUB eBook",
    description: "Standard eBook format for e-readers",
    extension: ".epub",
    icon: BookOpen,
    supports: ["responsive", "metadata", "chapters"],
    recommended: false,
  },
  {
    id: "txt",
    name: "Plain Text",
    description: "Simple text file without formatting",
    extension: ".txt",
    icon: FileText,
    supports: ["universal", "lightweight"],
    recommended: false,
  },
  {
    id: "html",
    name: "HTML Document",
    description: "Web-ready format with styling",
    extension: ".html",
    icon: Globe,
    supports: ["web", "styling", "responsive"],
    recommended: false,
  },
  {
    id: "markdown",
    name: "Markdown",
    description: "Formatted text for developers and writers",
    extension: ".md",
    icon: FileText,
    supports: ["formatting", "version-control", "portable"],
    recommended: false,
  },
];

export function ManuscriptExport() {
  const { currentStory } = useStory();
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const [settings, setSettings] = useState<ExportSettings>({
    includeChapters: true,
    includeScenes: false,
    includeNotes: false,
    includeCharacterProfiles: true,
    includeWorldBuilding: false,
    includeTimeline: false,
    includeOutline: true,
    includeCoverPage: true,
    includeTableOfContents: true,
    includePageNumbers: true,
    includeWordCount: true,
    customHeader: "",
    customFooter: "",
    authorName: "",
    subtitle: "",
    dedication: "",
    acknowledgments: "",
    fontSize: 12,
    fontFamily: "Times New Roman",
    lineSpacing: 1.5,
    margins: {
      top: 1,
      bottom: 1,
      left: 1,
      right: 1,
    },
    paperSize: "A4",
    chapterPageBreak: true,
    sceneBreak: "* * *",
  });
  const [chapters, setChapters] = useState<any[]>([]);
  const [scenes, setScenes] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [characters, setCharacters] = useState<any[]>([]);
  const [worldElements, setWorldElements] = useState<any[]>([]);
  const [exportOpen, setExportOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState("");

  // Load story content
  useEffect(() => {
    if (!currentStory) return;

    const loadContent = async () => {
      try {
        const chaptersData = localStorage.getItem(
          `chronicle-chapters-${currentStory.id}`,
        );
        const scenesData = localStorage.getItem(
          `chronicle-scenes-${currentStory.id}`,
        );
        const notesData = localStorage.getItem(
          `chronicle-notes-${currentStory.id}`,
        );
        const charactersData = localStorage.getItem(
          `chronicle-characters-${currentStory.id}`,
        );
        const worldData = localStorage.getItem(
          `chronicle-world-${currentStory.id}`,
        );

        setChapters(chaptersData ? JSON.parse(chaptersData) : []);
        setScenes(scenesData ? JSON.parse(scenesData) : []);
        setNotes(notesData ? JSON.parse(notesData) : []);
        setCharacters(charactersData ? JSON.parse(charactersData) : []);
        setWorldElements(worldData ? JSON.parse(worldData) : []);
      } catch (error) {
        console.error("Error loading story content:", error);
      }
    };

    loadContent();
  }, [currentStory]);

  const generatePreview = () => {
    let content = "";

    // Cover page
    if (settings.includeCoverPage) {
      content += `${currentStory?.title}\n`;
      if (settings.subtitle) content += `${settings.subtitle}\n`;
      if (settings.authorName) content += `by ${settings.authorName}\n`;
      content += "\n\n";
    }

    // Table of contents
    if (settings.includeTableOfContents) {
      content += "TABLE OF CONTENTS\n\n";
      if (settings.includeChapters) {
        chapters.forEach((chapter, index) => {
          content += `Chapter ${index + 1}: ${chapter.title}\n`;
        });
      }
      content += "\n\n";
    }

    // Dedication
    if (settings.dedication) {
      content += `DEDICATION\n\n${settings.dedication}\n\n\n`;
    }

    // Main content
    if (settings.includeChapters) {
      chapters.forEach((chapter, index) => {
        if (settings.chapterPageBreak && index > 0) {
          content += "\n--- PAGE BREAK ---\n\n";
        }
        content += `CHAPTER ${index + 1}\n${chapter.title.toUpperCase()}\n\n`;
        if (chapter.summary) {
          content += `${chapter.summary}\n\n`;
        }
        content += "\n";
      });
    }

    // Character profiles
    if (settings.includeCharacterProfiles && characters.length > 0) {
      content += "\n--- PAGE BREAK ---\n\n";
      content += "CHARACTER PROFILES\n\n";
      characters.forEach((character) => {
        content += `${character.name.toUpperCase()}\n`;
        if (character.role) content += `Role: ${character.role}\n`;
        if (character.description)
          content += `Description: ${character.description}\n`;
        content += "\n";
      });
    }

    // Acknowledgments
    if (settings.acknowledgments) {
      content += "\n--- PAGE BREAK ---\n\n";
      content += `ACKNOWLEDGMENTS\n\n${settings.acknowledgments}\n\n`;
    }

    return content;
  };

  const calculateWordCount = () => {
    let totalWords = 0;

    if (settings.includeChapters) {
      chapters.forEach((chapter) => {
        if (chapter.summary) {
          totalWords += chapter.summary.split(/\s+/).length;
        }
      });
    }

    if (settings.includeScenes) {
      scenes.forEach((scene) => {
        if (scene.content) {
          totalWords += scene.content.split(/\s+/).length;
        }
      });
    }

    return totalWords;
  };

  const exportManuscript = async () => {
    if (!currentStory) return;

    setIsExporting(true);
    setExportProgress(0);

    try {
      // Simulate export process with progress updates
      const steps = [
        "Gathering content...",
        "Formatting document...",
        "Adding metadata...",
        "Generating final file...",
        "Download ready!",
      ];

      for (let i = 0; i < steps.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setExportProgress(((i + 1) / steps.length) * 100);
      }

      // Generate the actual export content
      const content = generatePreview();
      const format = exportFormats.find((f) => f.id === selectedFormat);

      // Create and download file
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${currentStory.title.replace(/[^a-zA-Z0-9]/g, "_")}${
        format?.extension || ".txt"
      }`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportOpen(false);
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const getFormatIcon = (formatId: string) => {
    const format = exportFormats.find((f) => f.id === formatId);
    const IconComponent = format?.icon || FileText;
    return <IconComponent className="h-4 w-4" />;
  };

  if (!currentStory) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Download className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Story Selected</h3>
          <p className="text-muted-foreground">
            Please select a story to export as a manuscript.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Manuscript Export</h2>
          <p className="text-muted-foreground">
            Export "{currentStory.title}" in professional formats
          </p>
        </div>

        <Dialog open={exportOpen} onOpenChange={setExportOpen}>
          <DialogTrigger asChild>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export Manuscript
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Export Manuscript: {currentStory.title}</DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="format" className="flex-1 overflow-hidden">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="format">Format</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="layout">Layout</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="format" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">Choose Export Format</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {exportFormats.map((format) => (
                      <Card
                        key={format.id}
                        className={`cursor-pointer transition-all ${
                          selectedFormat === format.id
                            ? "ring-2 ring-primary"
                            : "hover:shadow-md"
                        }`}
                        onClick={() => setSelectedFormat(format.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-2">
                            {getFormatIcon(format.id)}
                            <div>
                              <h5 className="font-medium">{format.name}</h5>
                              {format.recommended && (
                                <Badge variant="secondary" className="text-xs">
                                  Recommended
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {format.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {format.supports.slice(0, 3).map((feature) => (
                              <Badge
                                key={feature}
                                variant="outline"
                                className="text-xs"
                              >
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">Content to Include</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="chapters"
                          checked={settings.includeChapters}
                          onCheckedChange={(checked) =>
                            setSettings({
                              ...settings,
                              includeChapters: !!checked,
                            })
                          }
                        />
                        <Label htmlFor="chapters">
                          Chapters ({chapters.length})
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="scenes"
                          checked={settings.includeScenes}
                          onCheckedChange={(checked) =>
                            setSettings({
                              ...settings,
                              includeScenes: !!checked,
                            })
                          }
                        />
                        <Label htmlFor="scenes">Scenes ({scenes.length})</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="characters"
                          checked={settings.includeCharacterProfiles}
                          onCheckedChange={(checked) =>
                            setSettings({
                              ...settings,
                              includeCharacterProfiles: !!checked,
                            })
                          }
                        />
                        <Label htmlFor="characters">
                          Character Profiles ({characters.length})
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="notes"
                          checked={settings.includeNotes}
                          onCheckedChange={(checked) =>
                            setSettings({
                              ...settings,
                              includeNotes: !!checked,
                            })
                          }
                        />
                        <Label htmlFor="notes">Notes ({notes.length})</Label>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="cover"
                          checked={settings.includeCoverPage}
                          onCheckedChange={(checked) =>
                            setSettings({
                              ...settings,
                              includeCoverPage: !!checked,
                            })
                          }
                        />
                        <Label htmlFor="cover">Cover Page</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="toc"
                          checked={settings.includeTableOfContents}
                          onCheckedChange={(checked) =>
                            setSettings({
                              ...settings,
                              includeTableOfContents: !!checked,
                            })
                          }
                        />
                        <Label htmlFor="toc">Table of Contents</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="page-numbers"
                          checked={settings.includePageNumbers}
                          onCheckedChange={(checked) =>
                            setSettings({
                              ...settings,
                              includePageNumbers: !!checked,
                            })
                          }
                        />
                        <Label htmlFor="page-numbers">Page Numbers</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="word-count"
                          checked={settings.includeWordCount}
                          onCheckedChange={(checked) =>
                            setSettings({
                              ...settings,
                              includeWordCount: !!checked,
                            })
                          }
                        />
                        <Label htmlFor="word-count">Word Count</Label>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h5 className="font-medium">Manuscript Information</h5>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="author">Author Name</Label>
                      <Input
                        id="author"
                        value={settings.authorName}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            authorName: e.target.value,
                          })
                        }
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subtitle">Subtitle (Optional)</Label>
                      <Input
                        id="subtitle"
                        value={settings.subtitle}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            subtitle: e.target.value,
                          })
                        }
                        placeholder="Story subtitle"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="layout" className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Typography</h4>
                    <div>
                      <Label htmlFor="font">Font Family</Label>
                      <Select
                        value={settings.fontFamily}
                        onValueChange={(value) =>
                          setSettings({ ...settings, fontFamily: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Times New Roman">
                            Times New Roman
                          </SelectItem>
                          <SelectItem value="Arial">Arial</SelectItem>
                          <SelectItem value="Garamond">Garamond</SelectItem>
                          <SelectItem value="Georgia">Georgia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="font-size">Font Size</Label>
                      <Input
                        id="font-size"
                        type="number"
                        min="8"
                        max="16"
                        value={settings.fontSize}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            fontSize: parseInt(e.target.value) || 12,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="line-spacing">Line Spacing</Label>
                      <Select
                        value={settings.lineSpacing.toString()}
                        onValueChange={(value) =>
                          setSettings({
                            ...settings,
                            lineSpacing: parseFloat(value),
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Single</SelectItem>
                          <SelectItem value="1.5">1.5x</SelectItem>
                          <SelectItem value="2">Double</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Page Layout</h4>
                    <div>
                      <Label htmlFor="paper-size">Paper Size</Label>
                      <Select
                        value={settings.paperSize}
                        onValueChange={(value: any) =>
                          setSettings({ ...settings, paperSize: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A4">A4 (210 × 297 mm)</SelectItem>
                          <SelectItem value="US Letter">
                            US Letter (8.5 × 11 in)
                          </SelectItem>
                          <SelectItem value="US Legal">
                            US Legal (8.5 × 14 in)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Margins (inches)</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="margin-top" className="text-xs">
                            Top
                          </Label>
                          <Input
                            id="margin-top"
                            type="number"
                            step="0.1"
                            value={settings.margins.top}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                margins: {
                                  ...settings.margins,
                                  top: parseFloat(e.target.value) || 1,
                                },
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="margin-bottom" className="text-xs">
                            Bottom
                          </Label>
                          <Input
                            id="margin-bottom"
                            type="number"
                            step="0.1"
                            value={settings.margins.bottom}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                margins: {
                                  ...settings.margins,
                                  bottom: parseFloat(e.target.value) || 1,
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Export Preview</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewContent(generatePreview())}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Refresh Preview
                  </Button>
                </div>

                <div className="border rounded-lg p-4 bg-white dark:bg-gray-900 max-h-96 overflow-auto">
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed">
                      {previewContent ||
                        generatePreview().slice(0, 1000) + "..."}
                    </pre>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h5 className="font-medium mb-2">Export Summary</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Format:</span>{" "}
                      {exportFormats.find((f) => f.id === selectedFormat)?.name}
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Estimated word count:
                      </span>{" "}
                      {calculateWordCount().toLocaleString()}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Chapters:</span>{" "}
                      {settings.includeChapters ? chapters.length : 0}
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Character profiles:
                      </span>{" "}
                      {settings.includeCharacterProfiles
                        ? characters.length
                        : 0}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                {isExporting && (
                  <>
                    <Progress value={exportProgress} className="w-32 mr-2" />
                    Exporting...
                  </>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setExportOpen(false)}
                  disabled={isExporting}
                >
                  Cancel
                </Button>
                <Button onClick={exportManuscript} disabled={isExporting}>
                  {isExporting ? (
                    "Exporting..."
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Export {selectedFormat.toUpperCase()}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="h-8 w-8 text-blue-500" />
              <div>
                <h3 className="font-semibold">Quick PDF Export</h3>
                <p className="text-sm text-muted-foreground">
                  Professional manuscript format
                </p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Export PDF
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="h-8 w-8 text-green-500" />
              <div>
                <h3 className="font-semibold">Word Document</h3>
                <p className="text-sm text-muted-foreground">
                  Editable format for revisions
                </p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Export DOCX
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="h-8 w-8 text-purple-500" />
              <div>
                <h3 className="font-semibold">eBook Format</h3>
                <p className="text-sm text-muted-foreground">
                  EPUB for e-readers
                </p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Export EPUB
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Content Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Manuscript Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{chapters.length}</div>
              <div className="text-sm text-muted-foreground">Chapters</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{scenes.length}</div>
              <div className="text-sm text-muted-foreground">Scenes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{characters.length}</div>
              <div className="text-sm text-muted-foreground">Characters</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {calculateWordCount().toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                Estimated Words
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
