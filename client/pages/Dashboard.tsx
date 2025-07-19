import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Clock,
  FileText,
  PenTool,
  Target,
  TrendingUp,
  Users,
  Globe,
  Folder,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/5 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Welcome back, Writer! ✨
            </h1>
            <p className="text-muted-foreground">
              Ready to bring your story to life? Your current project is
              waiting.
            </p>
          </div>
          <Button asChild>
            <Link to="/writing/chapters">Continue Writing</Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Words</CardTitle>
            <PenTool className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15,743</div>
            <p className="text-xs text-muted-foreground">
              +2,401 from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chapters</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Characters</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">4 main characters</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Writing Streak
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7 days</div>
            <p className="text-xs text-muted-foreground">Keep it up!</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-lg bg-chapter-accent">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Updated Chapter 5</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-lg bg-note-accent">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20">
                <FileText className="h-4 w-4 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Added character notes</p>
                <p className="text-xs text-muted-foreground">Yesterday</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Globe className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Expanded world building</p>
                <p className="text-xs text-muted-foreground">3 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Writing Goal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Daily Goal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Words Written Today</span>
                <span className="font-medium">847 / 1,000</span>
              </div>
              <Progress value={84.7} className="h-2" />
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                153 words to reach your goal!
              </p>
              <Button size="sm" className="mt-2" asChild>
                <Link to="/writing/chapters">Start Writing</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              asChild
            >
              <Link to="/stories">
                <div className="flex items-center gap-3">
                  <Folder className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Manage Stories</div>
                    <div className="text-xs text-muted-foreground">
                      Create and organize your stories
                    </div>
                  </div>
                </div>
              </Link>
            </Button>

            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              asChild
            >
              <Link to="/writing/chapters">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">New Chapter</div>
                    <div className="text-xs text-muted-foreground">
                      Start writing your next chapter
                    </div>
                  </div>
                </div>
              </Link>
            </Button>

            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              asChild
            >
              <Link to="/story/characters">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Add Character</div>
                    <div className="text-xs text-muted-foreground">
                      Develop your cast of characters
                    </div>
                  </div>
                </div>
              </Link>
            </Button>

            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              asChild
            >
              <Link to="/writing/notes">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Quick Note</div>
                    <div className="text-xs text-muted-foreground">
                      Capture ideas and thoughts
                    </div>
                  </div>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
