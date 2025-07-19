import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HardDrive,
  Cloud,
  Save,
  AlertCircle,
  CheckCircle,
  Loader2,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useElectronStory } from "@/contexts/ElectronStoryContext";

export function StatusBar() {
  const {
    isElectronEnvironment,
    currentFilePath,
    isDirty,
    isLoading,
    autoSaveEnabled,
    saveStory,
  } = useElectronStory();

  const getFileName = () => {
    if (!currentFilePath) return "Untitled";
    return currentFilePath.split("/").pop() || "Untitled";
  };

  const getFileStatus = () => {
    if (isLoading)
      return { icon: Loader2, color: "text-blue-500", text: "Saving..." };
    if (isDirty)
      return {
        icon: AlertCircle,
        color: "text-yellow-500",
        text: "Unsaved changes",
      };
    if (currentFilePath)
      return { icon: CheckCircle, color: "text-green-500", text: "Saved" };
    return { icon: AlertCircle, color: "text-gray-500", text: "Not saved" };
  };

  const status = getFileStatus();
  const StatusIcon = status.icon;

  return (
    <div className="flex items-center justify-between px-4 py-1 bg-muted/30 border-t text-xs text-muted-foreground">
      {/* Left side - File info */}
      <div className="flex items-center gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1">
                {isElectronEnvironment ? (
                  <HardDrive className="h-3 w-3" />
                ) : (
                  <Cloud className="h-3 w-3" />
                )}
                <span>{isElectronEnvironment ? "Desktop App" : "Web App"}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {isElectronEnvironment
                  ? "Running as desktop application with file system access"
                  : "Running in web browser with limited file access"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="w-px h-4 bg-border" />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1">
                <StatusIcon
                  className={`h-3 w-3 ${status.color} ${
                    isLoading ? "animate-spin" : ""
                  }`}
                />
                <span>{getFileName()}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {currentFilePath || "No file selected"} - {status.text}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {isDirty && !isLoading && (
          <>
            <div className="w-px h-4 bg-border" />
            <Button
              variant="ghost"
              size="sm"
              className="h-auto py-0 px-2 text-xs"
              onClick={() => saveStory()}
            >
              <Save className="h-3 w-3 mr-1" />
              Save
            </Button>
          </>
        )}
      </div>

      {/* Right side - Status badges */}
      <div className="flex items-center gap-2">
        {autoSaveEnabled && isElectronEnvironment && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="text-xs py-0">
                  Auto-save
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Automatic saving every 30 seconds</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1">
                {navigator.onLine ? (
                  <Wifi className="h-3 w-3 text-green-500" />
                ) : (
                  <WifiOff className="h-3 w-3 text-red-500" />
                )}
                <span>{navigator.onLine ? "Online" : "Offline"}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {navigator.onLine
                  ? "Connected to the internet"
                  : "No internet connection"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {isElectronEnvironment && (
          <Badge variant="secondary" className="text-xs py-0">
            Desktop
          </Badge>
        )}
      </div>
    </div>
  );
}
