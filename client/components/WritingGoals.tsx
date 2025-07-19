import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Target,
  TrendingUp,
  Calendar as CalendarIcon,
  Award,
  Flame,
  BookOpen,
  Edit,
  Clock,
  CheckCircle2,
  Plus,
  Settings,
} from "lucide-react";
import { useStory } from "@/contexts/StoryContext";

interface WritingGoal {
  id: string;
  type: "daily" | "weekly" | "monthly" | "project";
  target: number;
  current: number;
  unit: "words" | "pages" | "chapters" | "scenes";
  deadline?: Date;
  title: string;
  description?: string;
  createdAt: Date;
  completed: boolean;
}

interface WritingSession {
  id: string;
  date: Date;
  wordsWritten: number;
  timeSpent: number; // in minutes
  storyId?: string;
  type: "chapters" | "scenes" | "notes" | "editing";
}

interface WritingStats {
  totalWords: number;
  dailyAverage: number;
  currentStreak: number;
  longestStreak: number;
  sessionsThisWeek: number;
  productiveHours: Record<number, number>; // hour of day -> word count
}

export function WritingGoals() {
  const { currentStory } = useStory();
  const [goals, setGoals] = useState<WritingGoal[]>([]);
  const [sessions, setSessions] = useState<WritingSession[]>([]);
  const [stats, setStats] = useState<WritingStats>({
    totalWords: 0,
    dailyAverage: 0,
    currentStreak: 0,
    longestStreak: 0,
    sessionsThisWeek: 0,
    productiveHours: {},
  });
  const [newGoalOpen, setNewGoalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // New goal form state
  const [goalType, setGoalType] = useState<
    "daily" | "weekly" | "monthly" | "project"
  >("daily");
  const [goalTarget, setGoalTarget] = useState("");
  const [goalUnit, setGoalUnit] = useState<
    "words" | "pages" | "chapters" | "scenes"
  >("words");
  const [goalTitle, setGoalTitle] = useState("");
  const [goalDescription, setGoalDescription] = useState("");
  const [goalDeadline, setGoalDeadline] = useState<Date>();

  // Load data from localStorage on mount
  useEffect(() => {
    const savedGoals = localStorage.getItem("chronicle-writing-goals");
    const savedSessions = localStorage.getItem("chronicle-writing-sessions");

    if (savedGoals) {
      try {
        const parsed = JSON.parse(savedGoals);
        setGoals(
          parsed.map((g: any) => ({
            ...g,
            createdAt: new Date(g.createdAt),
            deadline: g.deadline ? new Date(g.deadline) : undefined,
          })),
        );
      } catch (e) {
        console.error("Error loading goals:", e);
      }
    }

    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions);
        setSessions(
          parsed.map((s: any) => ({
            ...s,
            date: new Date(s.date),
          })),
        );
      } catch (e) {
        console.error("Error loading sessions:", e);
      }
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("chronicle-writing-goals", JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(
      "chronicle-writing-sessions",
      JSON.stringify(sessions),
    );
  }, [sessions]);

  // Calculate stats
  useEffect(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentSessions = sessions.filter((s) => s.date >= thirtyDaysAgo);

    const totalWords = recentSessions.reduce(
      (sum, s) => sum + s.wordsWritten,
      0,
    );
    const dailyAverage = totalWords / 30;

    // Calculate streak
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const hasSession = sessions.some((s) => {
        const sessionDate = new Date(s.date);
        sessionDate.setHours(0, 0, 0, 0);
        return (
          sessionDate.getTime() === checkDate.getTime() && s.wordsWritten > 0
        );
      });

      if (hasSession) {
        tempStreak++;
        if (i === 0 || (i === 1 && currentStreak === 0)) {
          currentStreak = tempStreak;
        }
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        if (i <= 1) currentStreak = 0;
        tempStreak = 0;
      }
    }

    longestStreak = Math.max(longestStreak, tempStreak);

    // Calculate productive hours
    const productiveHours: Record<number, number> = {};
    recentSessions.forEach((session) => {
      const hour = session.date.getHours();
      productiveHours[hour] =
        (productiveHours[hour] || 0) + session.wordsWritten;
    });

    const thisWeekStart = new Date(
      now.getTime() - now.getDay() * 24 * 60 * 60 * 1000,
    );
    const sessionsThisWeek = sessions.filter(
      (s) => s.date >= thisWeekStart,
    ).length;

    setStats({
      totalWords,
      dailyAverage,
      currentStreak,
      longestStreak,
      sessionsThisWeek,
      productiveHours,
    });
  }, [sessions]);

  const createGoal = () => {
    if (!goalTitle || !goalTarget) return;

    const newGoal: WritingGoal = {
      id: Date.now().toString(),
      type: goalType,
      target: parseInt(goalTarget),
      current: 0,
      unit: goalUnit,
      title: goalTitle,
      description: goalDescription,
      deadline: goalDeadline,
      createdAt: new Date(),
      completed: false,
    };

    setGoals([...goals, newGoal]);

    // Reset form
    setGoalTitle("");
    setGoalTarget("");
    setGoalDescription("");
    setGoalDeadline(undefined);
    setNewGoalOpen(false);
  };

  const updateGoalProgress = (goalId: string, progress: number) => {
    setGoals(
      goals.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              current: Math.min(progress, goal.target),
              completed: progress >= goal.target,
            }
          : goal,
      ),
    );
  };

  const addWritingSession = (
    wordsWritten: number,
    timeSpent: number,
    type: string,
  ) => {
    const newSession: WritingSession = {
      id: Date.now().toString(),
      date: new Date(),
      wordsWritten,
      timeSpent,
      storyId: currentStory?.id,
      type: type as any,
    };

    setSessions([...sessions, newSession]);

    // Update daily goals automatically
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayWords =
      sessions
        .filter((s) => {
          const sessionDate = new Date(s.date);
          sessionDate.setHours(0, 0, 0, 0);
          return sessionDate.getTime() === today.getTime();
        })
        .reduce((sum, s) => sum + s.wordsWritten, 0) + wordsWritten;

    goals.forEach((goal) => {
      if (goal.type === "daily" && goal.unit === "words") {
        updateGoalProgress(goal.id, todayWords);
      }
    });
  };

  const getTodayProgress = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return sessions
      .filter((s) => {
        const sessionDate = new Date(s.date);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate.getTime() === today.getTime();
      })
      .reduce((sum, s) => sum + s.wordsWritten, 0);
  };

  const getDailyGoal = () => {
    return goals.find((g) => g.type === "daily" && g.unit === "words");
  };

  const getActiveGoals = () => {
    return goals.filter((g) => !g.completed);
  };

  const getCompletedGoals = () => {
    return goals.filter((g) => g.completed);
  };

  const todayWords = getTodayProgress();
  const dailyGoal = getDailyGoal();
  const dailyProgress = dailyGoal ? (todayWords / dailyGoal.target) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header with Quick Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Writing Goals</h2>
          <p className="text-muted-foreground">
            Track your progress and stay motivated
          </p>
        </div>

        <Dialog open={newGoalOpen} onOpenChange={setNewGoalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Writing Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="goal-title">Goal Title</Label>
                <Input
                  id="goal-title"
                  placeholder="e.g., Daily Writing Target"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="goal-type">Type</Label>
                  <Select
                    value={goalType}
                    onValueChange={(value: any) => setGoalType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="goal-unit">Unit</Label>
                  <Select
                    value={goalUnit}
                    onValueChange={(value: any) => setGoalUnit(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="words">Words</SelectItem>
                      <SelectItem value="pages">Pages</SelectItem>
                      <SelectItem value="chapters">Chapters</SelectItem>
                      <SelectItem value="scenes">Scenes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="goal-target">Target</Label>
                <Input
                  id="goal-target"
                  type="number"
                  placeholder="1000"
                  value={goalTarget}
                  onChange={(e) => setGoalTarget(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="goal-description">Description (Optional)</Label>
                <Input
                  id="goal-description"
                  placeholder="Additional details about this goal..."
                  value={goalDescription}
                  onChange={(e) => setGoalDescription(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={createGoal} className="flex-1">
                  Create Goal
                </Button>
                <Button variant="outline" onClick={() => setNewGoalOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Today's Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Today's Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Words Written
              </span>
              <span className="text-2xl font-bold">
                {todayWords.toLocaleString()}
              </span>
            </div>

            {dailyGoal && (
              <>
                <Progress value={dailyProgress} className="h-3" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {dailyGoal.target.toLocaleString()} words goal
                  </span>
                  <span className="font-medium">
                    {Math.round(dailyProgress)}% complete
                  </span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-xl font-bold">{stats.currentStreak} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Longest Streak</p>
                <p className="text-xl font-bold">{stats.longestStreak} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Daily Average</p>
                <p className="text-xl font-bold">
                  {Math.round(stats.dailyAverage)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Edit className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-xl font-bold">
                  {stats.sessionsThisWeek} sessions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Goals */}
      {getActiveGoals().length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getActiveGoals().map((goal) => {
                const progress = (goal.current / goal.target) * 100;
                return (
                  <div key={goal.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{goal.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {goal.current.toLocaleString()} /{" "}
                          {goal.target.toLocaleString()} {goal.unit}
                        </p>
                      </div>
                      <Badge
                        variant={
                          goal.type === "daily" ? "default" : "secondary"
                        }
                      >
                        {goal.type}
                      </Badge>
                    </div>

                    <Progress value={progress} className="mb-2" />

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {Math.round(progress)}% complete
                      </span>
                      {goal.deadline && (
                        <span className="text-muted-foreground">
                          Due: {goal.deadline.toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed Goals */}
      {getCompletedGoals().length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Completed Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getCompletedGoals()
                .slice(0, 5)
                .map((goal) => (
                  <div
                    key={goal.id}
                    className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded"
                  >
                    <span className="font-medium">{goal.title}</span>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      ✓ Completed
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Action to Log Session */}
      <Card>
        <CardHeader>
          <CardTitle>Log Writing Session</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => addWritingSession(250, 30, "chapters")}
            >
              +250 words (30min)
            </Button>
            <Button
              variant="outline"
              onClick={() => addWritingSession(500, 60, "chapters")}
            >
              +500 words (1hr)
            </Button>
            <Button
              variant="outline"
              onClick={() => addWritingSession(1000, 120, "chapters")}
            >
              +1000 words (2hr)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
