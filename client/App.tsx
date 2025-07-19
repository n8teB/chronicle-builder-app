import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  HashRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ElectronStoryProvider } from "@/contexts/ElectronStoryContext";
import { StatusBar } from "@/components/StatusBar";

// Import button tester for development
if (process.env.NODE_ENV === "development") {
  import("@/utils/buttonTester").then((module) => {
    const ButtonTester = module.default;
    window.buttonTester = new ButtonTester();
    window.testButtons = () => window.buttonTester.testAllButtons();
    console.log("🧪 Button Tester loaded. Use testButtons() in console.");
  });
}

// Pages
import Dashboard from "./pages/Dashboard";
import Stories from "./pages/Stories";
import Goals from "./pages/Goals";
import Templates from "./pages/Templates";
import Analytics from "./pages/Analytics";
import VersionControl from "./pages/VersionControl";
import Research from "./pages/Research";
import Comments from "./pages/Comments";
import Chapters from "./pages/writing/Chapters";
import Scenes from "./pages/writing/Scenes";
import Notes from "./pages/writing/Notes";
import Characters from "./pages/story/Characters";
import WorldBuilding from "./pages/story/WorldBuilding";
import Timeline from "./pages/story/Timeline";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component to handle scroll behavior on route changes
function ScrollManager() {
  const location = useLocation();

  useEffect(() => {
    // Store scroll positions for each route
    const scrollPositions = new Map();

    // Save current scroll position before navigation
    const saveScrollPosition = () => {
      const mainContent = document.querySelector("main");
      if (mainContent) {
        scrollPositions.set(location.pathname, mainContent.scrollTop);
      }
    };

    // Restore scroll position after navigation
    const restoreScrollPosition = () => {
      const mainContent = document.querySelector("main");
      if (mainContent) {
        const savedPosition = scrollPositions.get(location.pathname);
        if (savedPosition !== undefined) {
          mainContent.scrollTop = savedPosition;
        }
      }
    };

    // Small delay to ensure content is rendered
    const timer = setTimeout(restoreScrollPosition, 50);

    return () => {
      clearTimeout(timer);
      saveScrollPosition();
    };
  }, [location.pathname]);

  return null;
}

const App = () => {
  const isElectron = typeof window !== "undefined" && !!window.electronAPI;
  const Router = isElectron ? HashRouter : BrowserRouter;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <ElectronStoryProvider>
            <Toaster />
            <Sonner />
            <Router>
              <ScrollManager />
              <div className="flex flex-col h-screen">
                <div className="flex-1 overflow-hidden">
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/stories" element={<Stories />} />
                      <Route path="/goals" element={<Goals />} />
                      <Route path="/templates" element={<Templates />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/versions" element={<VersionControl />} />
                      <Route path="/research" element={<Research />} />
                      <Route path="/comments" element={<Comments />} />
                      <Route path="/writing/chapters" element={<Chapters />} />
                      <Route path="/writing/scenes" element={<Scenes />} />
                      <Route path="/writing/notes" element={<Notes />} />
                      <Route
                        path="/story/characters"
                        element={<Characters />}
                      />
                      <Route path="/story/world" element={<WorldBuilding />} />
                      <Route path="/story/timeline" element={<Timeline />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Layout>
                </div>
                <StatusBar />
              </div>
            </Router>
          </ElectronStoryProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
