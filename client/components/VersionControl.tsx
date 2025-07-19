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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  GitBranch,
  Clock,
  FileText,
  Edit,
  Save,
  RotateCcw,
  Copy,
  Trash2,
  Plus,
  Eye,
  MessageSquare,
  Download,
  Upload,
  Check,
  X,
  ArrowRight,
  History,
  GitCommit,
  Info,
} from "lucide-react";
import { useStory } from "@/contexts/StoryContext";

interface Version {
  id: string;
  name: string;
  description: string;
  content: {
    chapters: Chapter[];
    characters: any[];
    worldBuilding: any[];
    notes: any[];
  };
  timestamp: Date;
  author: string;
  parentVersionId?: string;
  tags: string[];
  wordCount: number;
  isPublished: boolean;
  changes?: VersionChange[];
}

interface VersionChange {
  type: "added" | "modified" | "deleted";
  section: string;
  itemId: string;
  itemName: string;
  description: string;
}

interface Chapter {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  lastModified: Date;
}

interface ComparisonResult {
  added: any[];
  modified: any[];
  deleted: any[];
}

export function VersionControl() {
  const { currentStory } = useStory();
  const [versions, setVersions] = useState<Version[]>([]);
  const [selectedVersions, setSelectedVersions] = useState<[string?, string?]>(
    [],
  );
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [newVersionDialog, setNewVersionDialog] = useState(false);
  const [restoreDialog, setRestoreDialog] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const [newVersionData, setNewVersionData] = useState({
    name: "",
    description: "",
    tags: [] as string[],
    isPublished: false,
  });

  useEffect(() => {
    loadVersions();
  }, [currentStory]);

  const loadVersions = () => {
    if (!currentStory) return;
    const storyVersions = localStorage.getItem(
      `story-versions-${currentStory.id}`,
    );
    if (storyVersions) {
      const parsed = JSON.parse(storyVersions).map((v: any) => ({
        ...v,
        timestamp: new Date(v.timestamp),
      }));
      setVersions(parsed);
    }
  };

  const saveVersions = (updatedVersions: Version[]) => {
    if (!currentStory) return;
    localStorage.setItem(
      `story-versions-${currentStory.id}`,
      JSON.stringify(updatedVersions),
    );
    setVersions(updatedVersions);
  };

  const createVersion = async () => {
    if (!currentStory || !newVersionData.name.trim()) return;

    const currentContent = await getCurrentStoryContent();
    const newVersion: Version = {
      id: `version-${Date.now()}`,
      name: newVersionData.name,
      description: newVersionData.description,
      content: currentContent,
      timestamp: new Date(),
      author: "Current User",
      tags: newVersionData.tags,
      wordCount: calculateWordCount(currentContent),
      isPublished: newVersionData.isPublished,
      changes: calculateChanges(currentContent),
    };

    const updatedVersions = [...versions, newVersion];
    saveVersions(updatedVersions);

    setNewVersionDialog(false);
    setNewVersionData({
      name: "",
      description: "",
      tags: [],
      isPublished: false,
    });
  };

  const getCurrentStoryContent = async () => {
    if (!currentStory)
      return { chapters: [], characters: [], worldBuilding: [], notes: [] };

    const chapters = JSON.parse(
      localStorage.getItem(`chapters-${currentStory.id}`) || "[]",
    );
    const characters = JSON.parse(
      localStorage.getItem(`characters-${currentStory.id}`) || "[]",
    );
    const worldBuilding = JSON.parse(
      localStorage.getItem(`worldbuilding-${currentStory.id}`) || "[]",
    );
    const notes = JSON.parse(
      localStorage.getItem(`notes-${currentStory.id}`) || "[]",
    );

    return { chapters, characters, worldBuilding, notes };
  };

  const calculateWordCount = (content: any) => {
    let totalWords = 0;
    if (content.chapters) {
      totalWords += content.chapters.reduce(
        (sum: number, chapter: any) =>
          sum + (chapter.content ? chapter.content.split(" ").length : 0),
        0,
      );
    }
    if (content.notes) {
      totalWords += content.notes.reduce(
        (sum: number, note: any) =>
          sum + (note.content ? note.content.split(" ").length : 0),
        0,
      );
    }
    return totalWords;
  };

  const calculateChanges = (content: any): VersionChange[] => {
    const changes: VersionChange[] = [];
    const lastVersion = versions[versions.length - 1];

    if (!lastVersion) {
      content.chapters?.forEach((chapter: any) => {
        changes.push({
          type: "added",
          section: "chapters",
          itemId: chapter.id,
          itemName: chapter.title,
          description: "Chapter added",
        });
      });
    }

    return changes;
  };

  const restoreVersion = (version: Version) => {
    if (!currentStory) return;

    const { chapters, characters, worldBuilding, notes } = version.content;

    localStorage.setItem(
      `chapters-${currentStory.id}`,
      JSON.stringify(chapters),
    );
    localStorage.setItem(
      `characters-${currentStory.id}`,
      JSON.stringify(characters),
    );
    localStorage.setItem(
      `worldbuilding-${currentStory.id}`,
      JSON.stringify(worldBuilding),
    );
    localStorage.setItem(`notes-${currentStory.id}`, JSON.stringify(notes));

    setRestoreDialog(false);
    window.location.reload();
  };

  const compareVersions = (versionId1: string, versionId2: string) => {
    const version1 = versions.find((v) => v.id === versionId1);
    const version2 = versions.find((v) => v.id === versionId2);

    if (!version1 || !version2) return;

    const comparison: ComparisonResult = {
      added: [],
      modified: [],
      deleted: [],
    };

    const sections = ["chapters", "characters", "worldBuilding", "notes"];

    sections.forEach((section) => {
      const items1 =
        version1.content[section as keyof typeof version1.content] || [];
      const items2 =
        version2.content[section as keyof typeof version2.content] || [];

      items2.forEach((item: any) => {
        const existsInV1 = items1.find((i: any) => i.id === item.id);
        if (!existsInV1) {
          comparison.added.push({ ...item, section });
        } else if (JSON.stringify(existsInV1) !== JSON.stringify(item)) {
          comparison.modified.push({ ...item, section, original: existsInV1 });
        }
      });

      items1.forEach((item: any) => {
        const existsInV2 = items2.find((i: any) => i.id === item.id);
        if (!existsInV2) {
          comparison.deleted.push({ ...item, section });
        }
      });
    });

    setComparison(comparison);
  };

  const duplicateVersion = (version: Version) => {
    const duplicated: Version = {
      ...version,
      id: `version-${Date.now()}`,
      name: `${version.name} (Copy)`,
      timestamp: new Date(),
      parentVersionId: version.id,
    };

    const updatedVersions = [...versions, duplicated];
    saveVersions(updatedVersions);
  };

  const deleteVersion = (versionId: string) => {
    const updatedVersions = versions.filter((v) => v.id !== versionId);
    saveVersions(updatedVersions);
  };

  const exportVersion = (version: Version) => {
    const dataStr = JSON.stringify(version, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${version.name}-${version.timestamp.toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!currentStory) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>Select a story to manage versions</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Version Control</h2>
          <p className="text-muted-foreground">
            Manage drafts, track changes, and compare versions
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={newVersionDialog} onOpenChange={setNewVersionDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Version
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Version</DialogTitle>
                <DialogDescription>
                  Save the current state of your story as a new version
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="version-name">Version Name</Label>
                  <Input
                    id="version-name"
                    placeholder="e.g., Chapter 5 Draft, First Complete Draft"
                    value={newVersionData.name}
                    onChange={(e) =>
                      setNewVersionData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="version-description">Description</Label>
                  <Textarea
                    id="version-description"
                    placeholder="Describe what changed in this version..."
                    value={newVersionData.description}
                    onChange={(e) =>
                      setNewVersionData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="version-tags">Tags (comma separated)</Label>
                  <Input
                    id="version-tags"
                    placeholder="draft, complete, review, final"
                    onChange={(e) =>
                      setNewVersionData((prev) => ({
                        ...prev,
                        tags: e.target.value
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter(Boolean),
                      }))
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setNewVersionDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={createVersion}
                  disabled={!newVersionData.name.trim()}
                >
                  Create Version
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="versions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="versions">
            <History className="h-4 w-4 mr-2" />
            Versions
          </TabsTrigger>
          <TabsTrigger value="compare">
            <GitBranch className="h-4 w-4 mr-2" />
            Compare
          </TabsTrigger>
          <TabsTrigger value="timeline">
            <Clock className="h-4 w-4 mr-2" />
            Timeline
          </TabsTrigger>
        </TabsList>

        <TabsContent value="versions" className="space-y-4">
          {versions.length === 0 ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                No versions created yet. Create your first version to start
                tracking changes.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-4">
              {versions
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                .map((version) => (
                  <Card key={version.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <GitCommit className="h-4 w-4" />
                            {version.name}
                            {version.isPublished && (
                              <Badge variant="secondary">Published</Badge>
                            )}
                          </CardTitle>
                          <CardDescription>
                            {version.description || "No description provided"}
                          </CardDescription>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <div>{version.timestamp.toLocaleDateString()}</div>
                          <div>{version.timestamp.toLocaleTimeString()}</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Word Count
                          </div>
                          <div className="font-medium">
                            {version.wordCount.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Chapters
                          </div>
                          <div className="font-medium">
                            {version.content.chapters?.length || 0}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Characters
                          </div>
                          <div className="font-medium">
                            {version.content.characters?.length || 0}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Notes
                          </div>
                          <div className="font-medium">
                            {version.content.notes?.length || 0}
                          </div>
                        </div>
                      </div>
                      {version.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {version.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {version.changes && version.changes.length > 0 && (
                        <div className="space-y-1">
                          <div className="text-sm font-medium">Changes:</div>
                          {version.changes.slice(0, 3).map((change, index) => (
                            <div
                              key={index}
                              className="text-sm text-muted-foreground flex items-center gap-2"
                            >
                              {change.type === "added" && (
                                <Plus className="h-3 w-3 text-green-600" />
                              )}
                              {change.type === "modified" && (
                                <Edit className="h-3 w-3 text-blue-600" />
                              )}
                              {change.type === "deleted" && (
                                <Trash2 className="h-3 w-3 text-red-600" />
                              )}
                              {change.description}
                            </div>
                          ))}
                          {version.changes.length > 3 && (
                            <div className="text-xs text-muted-foreground">
                              +{version.changes.length - 3} more changes
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedVersion(version);
                            setRestoreDialog(true);
                          }}
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Restore
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => duplicateVersion(version)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => exportVersion(version)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteVersion(version.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="compare" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>First Version</Label>
              <Select
                onValueChange={(value) =>
                  setSelectedVersions([value, selectedVersions[1]])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select first version" />
                </SelectTrigger>
                <SelectContent>
                  {versions.map((version) => (
                    <SelectItem key={version.id} value={version.id}>
                      {version.name} - {version.timestamp.toLocaleDateString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Second Version</Label>
              <Select
                onValueChange={(value) =>
                  setSelectedVersions([selectedVersions[0], value])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select second version" />
                </SelectTrigger>
                <SelectContent>
                  {versions.map((version) => (
                    <SelectItem key={version.id} value={version.id}>
                      {version.name} - {version.timestamp.toLocaleDateString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedVersions[0] && selectedVersions[1] && (
            <Button
              onClick={() =>
                compareVersions(selectedVersions[0]!, selectedVersions[1]!)
              }
            >
              <GitBranch className="h-4 w-4 mr-2" />
              Compare Versions
            </Button>
          )}

          {comparison && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Comparison Results</h3>

              {comparison.added.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-600 flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Added ({comparison.added.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {comparison.added.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-green-50 rounded"
                        >
                          <div className="font-medium">
                            {item.title || item.name}
                          </div>
                          <Badge variant="outline">{item.section}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {comparison.modified.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-600 flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      Modified ({comparison.modified.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {comparison.modified.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-blue-50 rounded"
                        >
                          <div className="font-medium">
                            {item.title || item.name}
                          </div>
                          <Badge variant="outline">{item.section}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {comparison.deleted.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600 flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      Deleted ({comparison.deleted.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {comparison.deleted.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-red-50 rounded"
                        >
                          <div className="font-medium">
                            {item.title || item.name}
                          </div>
                          <Badge variant="outline">{item.section}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <div className="space-y-4">
            {versions
              .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
              .map((version, index) => (
                <div key={version.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-primary rounded-full" />
                    {index < versions.length - 1 && (
                      <div className="w-0.5 h-16 bg-border mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="font-medium">{version.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {version.timestamp.toLocaleDateString()}{" "}
                        {version.timestamp.toLocaleTimeString()}
                      </div>
                      {version.isPublished && (
                        <Badge variant="secondary">Published</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {version.description || "No description provided"}
                    </div>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>{version.wordCount.toLocaleString()} words</span>
                      <span>
                        {version.content.chapters?.length || 0} chapters
                      </span>
                      <span>
                        {version.content.characters?.length || 0} characters
                      </span>
                    </div>
                    {version.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {version.tags.map((tag, tagIndex) => (
                          <Badge
                            key={tagIndex}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={restoreDialog} onOpenChange={setRestoreDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore Version</DialogTitle>
            <DialogDescription>
              Are you sure you want to restore to "{selectedVersion?.name}"?
              This will replace your current story content.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRestoreDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => selectedVersion && restoreVersion(selectedVersion)}
            >
              Restore Version
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
