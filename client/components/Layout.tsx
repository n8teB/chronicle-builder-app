import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { WritingAssistant } from "@/components/WritingAssistant";
import { StoryManager, useStoryManager } from "@/components/StoryManager";
import { StoryProvider } from "@/contexts/StoryContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FileMenu } from "@/components/FileMenu";
import { ButtonTester } from "@/components/ButtonTester";
import { GlobalSearch } from "@/components/GlobalSearch";
import { downloadStoryAsTxt, downloadStoryAsPdf } from "@/utils/documentExport";
import {
  BookOpen,
  Users,
  Globe,
  Clock,
  FileText,
  Edit,
  Home,
  MessageCircle,
  Menu,
  X,
  Settings,
  HelpCircle,
  Save,
  Folder,
  Target,
  BookTemplate,
  BarChart,
  GitBranch,
  Search,
  Highlighter,
} from "lucide-react";
import { ReactNode, useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

const sidebarItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/",
  },
  {
    title: "Stories",
    icon: Folder,
    href: "/stories",
  },
  {
    title: "Goals",
    icon: Target,
    href: "/goals",
  },
  {
    title: "Templates",
    icon: BookTemplate,
    href: "/templates",
  },
  {
    title: "Analytics",
    icon: BarChart,
    href: "/analytics",
  },
  {
    title: "Versions",
    icon: GitBranch,
    href: "/versions",
  },
  {
    title: "Research",
    icon: Search,
    href: "/research",
  },
  {
    title: "Comments",
    icon: Highlighter,
    href: "/comments",
  },
  {
    title: "Writing",
    items: [
      { title: "Chapters", icon: BookOpen, href: "/writing/chapters" },
      { title: "Scenes", icon: Edit, href: "/writing/scenes" },
      { title: "Notes", icon: FileText, href: "/writing/notes" },
    ],
  },
  {
    title: "Story Bible",
    items: [
      { title: "Characters", icon: Users, href: "/story/characters" },
      { title: "World Building", icon: Globe, href: "/story/world" },
      { title: "Timeline", icon: Clock, href: "/story/timeline" },
    ],
  },
];

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const sidebarScrollRef = useRef<HTMLDivElement>(null);
  const savedScrollPosition = useRef<number>(0);

  // Handle navigation click while preserving scroll
  const handleNavClick = (e: React.MouseEvent) => {
    if (sidebarScrollRef.current) {
      // Store current scroll position
      const currentScroll = sidebarScrollRef.current.scrollTop;
      localStorage.setItem("sidebar-scroll-position", currentScroll.toString());

      // Restore after a brief delay
      setTimeout(() => {
        if (sidebarScrollRef.current) {
          sidebarScrollRef.current.scrollTop = currentScroll;
        }
      }, 0);
    }
  };

  // Preserve sidebar scroll position during navigation
  useEffect(() => {
    const SCROLL_KEY = "sidebar-scroll-position";

    // Restore scroll position on mount and route change
    const restoreScrollPosition = () => {
      if (sidebarScrollRef.current) {
        const savedPosition = localStorage.getItem(SCROLL_KEY);
        if (savedPosition) {
          sidebarScrollRef.current.scrollTop = parseInt(savedPosition, 10);
        }
      }
    };

    // Save scroll position to localStorage
    const saveScrollPosition = () => {
      if (sidebarScrollRef.current) {
        localStorage.setItem(
          SCROLL_KEY,
          sidebarScrollRef.current.scrollTop.toString(),
        );
      }
    };

    // Add scroll listener to save position on scroll
    const handleScroll = () => {
      saveScrollPosition();
    };

    // Restore position after content is rendered
    const timer = setTimeout(restoreScrollPosition, 50);

    // Add scroll listener
    if (sidebarScrollRef.current) {
      sidebarScrollRef.current.addEventListener("scroll", handleScroll, {
        passive: true,
      });
    }

    return () => {
      clearTimeout(timer);
      saveScrollPosition();
      if (sidebarScrollRef.current) {
        sidebarScrollRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [location.pathname]);

  const {
    currentStory,
    stories,
    handleStoryChange,
    handleStoryCreate,
    handleStoryUpdate,
    handleStoryDelete,
  } = useStoryManager();

  const handleSaveDraft = () => {
    if (!currentStory) {
      return;
    }

    try {
      // Download all chapters as .txt file
      downloadStoryAsTxt(currentStory);

      // Update the story with current timestamp and ensure it's in drafting status
      const updatedStory = {
        ...currentStory,
        status: "drafting" as const,
        lastEdited: new Date(),
      };

      handleStoryUpdate(updatedStory);
    } catch (error) {
      console.error("Error downloading draft:", error);
    }
  };

  const handlePublish = () => {
    if (!currentStory) {
      return;
    }

    try {
      // Download all chapters as .pdf file
      downloadStoryAsPdf(currentStory);

      // Update the story status to completed and set current timestamp
      const updatedStory = {
        ...currentStory,
        status: "completed" as const,
        lastEdited: new Date(),
      };

      handleStoryUpdate(updatedStory);
    } catch (error) {
      console.error("Error publishing story:", error);
    }
  };

  const SidebarContent = () => (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="flex-shrink-0 p-6 pb-4">
        {/* Story Selector */}
        <div className="mb-4">
          <StoryManager
            currentStory={currentStory}
            stories={stories}
            onStoryChange={handleStoryChange}
            onStoryCreate={handleStoryCreate}
            onStoryUpdate={handleStoryUpdate}
            onStoryDelete={handleStoryDelete}
          />
        </div>

        {/* Current Story Info */}
        {currentStory && (
          <div className="p-3 rounded-lg bg-muted/50 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium truncate">
                {currentStory.title}
              </span>
              <span className="text-xs text-muted-foreground">
                {currentStory.status}
              </span>
            </div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Progress:</span>
                <span>
                  {Math.round(
                    (currentStory.currentWordCount /
                      currentStory.targetWordCount) *
                      100,
                  )}
                  %
                </span>
              </div>
              <div className="w-full bg-background rounded-full h-1">
                <div
                  className="bg-primary h-1 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      (currentStory.currentWordCount /
                        currentStory.targetWordCount) *
                        100,
                      100,
                    )}%`,
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="flex justify-between">
                  <span>Chapters:</span>
                  <span>{currentStory.chapters}</span>
                </div>
                <div className="flex justify-between">
                  <span>Characters:</span>
                  <span>{currentStory.characters}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        <div
          ref={sidebarScrollRef}
          className="h-full px-3 overflow-y-auto overscroll-contain"
          style={{ scrollBehavior: "auto" }}
        >
          <div className="space-y-4 py-2">
            {sidebarItems.map((item, index) => (
              <div key={index} className="space-y-1">
                {item.href ? (
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-sidebar-accent",
                      location.pathname === item.href
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:text-sidebar-accent-foreground",
                    )}
                    onClick={(e) => {
                      handleNavClick(e);
                      setSidebarOpen(false);
                    }}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                ) : (
                  <div>
                    <div className="px-3 py-2 text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider">
                      {item.title}
                    </div>
                    <div className="space-y-1">
                      {item.items?.map((subItem) => (
                        <Link
                          key={subItem.href}
                          to={subItem.href}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-sidebar-accent",
                            location.pathname === subItem.href
                              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                              : "text-sidebar-foreground hover:text-sidebar-accent-foreground",
                          )}
                          onClick={(e) => {
                            handleNavClick(e);
                            setSidebarOpen(false);
                          }}
                        >
                          <subItem.icon className="h-4 w-4" />
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-shrink-0">
        <Separator />
        <div className="p-4">
          <div className="rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 p-3 mb-3">
            <div className="flex items-center gap-2 text-sm">
              <MessageCircle className="h-4 w-4 text-primary" />
              <span className="font-medium">Writing Assistant</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Get instant prompts and character ideas
            </p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Theme</span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <StoryProvider
      currentStory={currentStory}
      stories={stories}
      onStoryUpdate={handleStoryUpdate}
      onStoryCreate={handleStoryCreate}
      onStoryDelete={handleStoryDelete}
      onStoryChange={handleStoryChange}
    >
      <div className="flex h-screen bg-background">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:bg-sidebar">
          <div className="p-6 pb-4">
            <div className="flex flex-col items-center gap-2 mb-4">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F5e5fbe2172f541a7ba6fd4306293cf62%2F02c752d98eb74503bc78134bd889da93?format=webp&width=800"
                alt="Chronicle Builder Logo"
                className="h-32 w-32 rounded-lg object-contain"
              />
              <span className="text-xs text-muted-foreground">
                Your Story Workspace
              </span>
            </div>
          </div>
          <SidebarContent />
        </div>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-black/20"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed left-0 top-0 h-full w-64 bg-sidebar border-r">
              <div className="flex items-center justify-between p-4">
                <div className="flex flex-col items-center gap-2">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F5e5fbe2172f541a7ba6fd4306293cf62%2F02c752d98eb74503bc78134bd889da93?format=webp&width=800"
                    alt="Chronicle Builder Logo"
                    className="h-32 w-32 rounded-lg object-contain"
                  />
                  <span className="text-xs text-muted-foreground">
                    Your Story Workspace
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <SidebarContent />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <header className="flex h-14 items-center justify-between border-b bg-background px-4 lg:px-6">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <h1 className="text-lg font-semibold text-foreground">
                  {location.pathname === "/" && "Dashboard"}
                  {location.pathname === "/stories" && "Stories"}
                  {location.pathname === "/goals" && "Writing Goals"}
                  {location.pathname === "/templates" && "Story Templates"}
                  {location.pathname === "/analytics" && "Writing Analytics"}
                  {location.pathname === "/versions" && "Version Control"}
                  {location.pathname === "/research" && "Research Hub"}
                  {location.pathname === "/comments" &&
                    "Comments & Annotations"}
                  {location.pathname.startsWith("/writing/chapters") &&
                    "Chapters"}
                  {location.pathname.startsWith("/writing/scenes") && "Scenes"}
                  {location.pathname.startsWith("/writing/notes") && "Notes"}
                  {location.pathname.startsWith("/story/characters") &&
                    "Characters"}
                  {location.pathname.startsWith("/story/world") &&
                    "World Building"}
                  {location.pathname.startsWith("/story/timeline") &&
                    "Timeline"}
                </h1>
                {currentStory && (
                  <p className="text-sm text-muted-foreground">
                    {currentStory.title} • {currentStory.genre}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <GlobalSearch />
              <FileMenu />
              {currentStory && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveDraft}
                    title="Download all chapters as .txt file"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button
                    size="sm"
                    onClick={handlePublish}
                    title="Download all chapters as .pdf file"
                  >
                    Publish
                  </Button>
                </>
              )}
              {!currentStory && (
                <div className="text-sm text-muted-foreground">
                  Select or create a story to begin
                </div>
              )}
              <ThemeToggle />
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto">{children}</main>
        </div>

        {/* Writing Assistant Chatbot */}
        <WritingAssistant />

        {/* Button Testing Tool (Development Only) */}
        <ButtonTester />
      </div>
    </StoryProvider>
  );
}
