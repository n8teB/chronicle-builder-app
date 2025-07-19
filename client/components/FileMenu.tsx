import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ManuscriptExport } from "@/components/ManuscriptExport";
import {
  File,
  FolderOpen,
  Save,
  Download,
  FileText,
  HardDrive,
  Clock,
  Plus,
  BookOpen,
} from "lucide-react";
import { useElectronStory } from "@/contexts/ElectronStoryContext";

export function FileMenu() {
  const [recentFilesOpen, setRecentFilesOpen] = useState(false);
  const [manuscriptExportOpen, setManuscriptExportOpen] = useState(false);
  const {
    isElectronEnvironment,
    newStory,
    openStory,
    saveStory,
    saveStoryAs,
    exportStory,
    recentFiles,
    currentStory,
    isLoading,
  } = useElectronStory();

  const handleRecentFileClick = async (filePath: string) => {
    // In a real implementation, you'd want to open the specific file
    // For now, we'll just trigger the open dialog
    setRecentFilesOpen(false);
    await openStory();
  };

  if (!isElectronEnvironment) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <File className="h-4 w-4 mr-2" />
            File
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Browser Mode</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => exportStory("json")}>
            <Download className="h-4 w-4 mr-2" />
            Download Story (JSON)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => exportStory("txt")}>
            <FileText className="h-4 w-4 mr-2" />
            Export as Text
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setManuscriptExportOpen(true)}>
            <BookOpen className="h-4 w-4 mr-2" />
            Export Manuscript
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={isLoading}>
            <HardDrive className="h-4 w-4 mr-2" />
            File
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>File Operations</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={newStory}>
            <Plus className="h-4 w-4 mr-2" />
            New Story
            <span className="ml-auto text-xs text-muted-foreground">
              Ctrl+N
            </span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={openStory}>
            <FolderOpen className="h-4 w-4 mr-2" />
            Open Story...
            <span className="ml-auto text-xs text-muted-foreground">
              Ctrl+O
            </span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => saveStory()}
            disabled={!currentStory}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Story
            <span className="ml-auto text-xs text-muted-foreground">
              Ctrl+S
            </span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={saveStoryAs} disabled={!currentStory}>
            <Save className="h-4 w-4 mr-2" />
            Save Story As...
            <span className="ml-auto text-xs text-muted-foreground">
              Ctrl+Shift+S
            </span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => exportStory("txt")}
            disabled={!currentStory}
          >
            <FileText className="h-4 w-4 mr-2" />
            Export as Text
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => exportStory("json")}
            disabled={!currentStory}
          >
            <Download className="h-4 w-4 mr-2" />
            Export as JSON
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setManuscriptExportOpen(true)}
            disabled={!currentStory}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Export Manuscript
          </DropdownMenuItem>

          {recentFiles.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setRecentFilesOpen(true)}>
                <Clock className="h-4 w-4 mr-2" />
                Recent Files
                <Badge variant="secondary" className="ml-auto">
                  {recentFiles.length}
                </Badge>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Recent Files Dialog */}
      <Dialog open={recentFilesOpen} onOpenChange={setRecentFilesOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Files
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-96 overflow-auto">
            {recentFiles.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No recent files</p>
              </div>
            ) : (
              recentFiles.map((filePath, index) => {
                const fileName = filePath.split("/").pop() || filePath;
                const directory = filePath.substring(
                  0,
                  filePath.lastIndexOf("/"),
                );

                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleRecentFileClick(filePath)}
                  >
                    <File className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{fileName}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {directory}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                  </div>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Manuscript Export Dialog */}
      <Dialog
        open={manuscriptExportOpen}
        onOpenChange={setManuscriptExportOpen}
      >
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Export Manuscript</DialogTitle>
          </DialogHeader>
          <ManuscriptExport />
        </DialogContent>
      </Dialog>
    </>
  );
}
