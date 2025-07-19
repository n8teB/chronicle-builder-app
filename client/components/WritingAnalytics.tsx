import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  TrendingUp,
  Clock,
  Target,
  BookOpen,
  Users,
  Zap,
  Eye,
  PieChart,
  Activity,
  Calendar,
  Award,
  Brain,
  LineChart,
} from "lucide-react";
import { useStory } from "@/contexts/StoryContext";

interface AnalyticsData {
  wordCounts: {
    total: number;
    chapters: number;
    scenes: number;
    notes: number;
    average: number;
  };
  characterData: {
    total: number;
    byRole: Record<string, number>;
    mostMentioned: Array<{ name: string; count: number }>;
    averageRelationships: number;
  };
  progressData: {
    chaptersCompleted: number;
    chaptersInProgress: number;
    chaptersDraft: number;
    completionPercentage: number;
  };
  writingVelocity: {
    wordsPerDay: number;
    sessionsPerWeek: number;
    averageSessionLength: number;
    mostProductiveHour: string;
  };
  contentDistribution: {
    chapters: number;
    scenes: number;
    notes: number;
    characters: number;
    worldElements: number;
  };
  insights: Array<{
    type: "positive" | "neutral" | "suggestion";
    title: string;
    description: string;
    metric?: number;
  }>;
}

interface WritingSession {
  date: Date;
  wordsWritten: number;
  timeSpent: number;
  type: string;
}

export function WritingAnalytics() {
  const { currentStory } = useStory();
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">(
    "month",
  );
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load and calculate analytics data
  useEffect(() => {
    if (!currentStory) {
      setIsLoading(false);
      return;
    }

    const calculateAnalytics = async () => {
      setIsLoading(true);

      try {
        // Load all story data
        const chapters = JSON.parse(
          localStorage.getItem(`chronicle-chapters-${currentStory.id}`) || "[]",
        );
        const scenes = JSON.parse(
          localStorage.getItem(`chronicle-scenes-${currentStory.id}`) || "[]",
        );
        const notes = JSON.parse(
          localStorage.getItem(`chronicle-notes-${currentStory.id}`) || "[]",
        );
        const characters = JSON.parse(
          localStorage.getItem(`chronicle-characters-${currentStory.id}`) ||
            "[]",
        );
        const worldElements = JSON.parse(
          localStorage.getItem(`chronicle-world-${currentStory.id}`) || "[]",
        );
        const writingSessions: WritingSession[] = JSON.parse(
          localStorage.getItem("chronicle-writing-sessions") || "[]",
        );

        // Calculate word counts
        const chapterWords = chapters.reduce(
          (sum: number, ch: any) => sum + (ch.wordCount || 0),
          0,
        );
        const sceneWords = scenes.reduce(
          (sum: number, sc: any) => sum + (sc.wordCount || 0),
          0,
        );
        const noteWords = notes.reduce((sum: number, note: any) => {
          if (note.content) {
            return sum + note.content.split(/\s+/).length;
          }
          return sum;
        }, 0);
        const totalWords = chapterWords + sceneWords + noteWords;
        const averageChapterWords =
          chapters.length > 0 ? chapterWords / chapters.length : 0;

        // Character analysis
        const charactersByRole = characters.reduce(
          (acc: Record<string, number>, char: any) => {
            const role = char.role || "unknown";
            acc[role] = (acc[role] || 0) + 1;
            return acc;
          },
          {},
        );

        // Mock character mentions (in real app, you'd analyze content)
        const mostMentioned = characters
          .map((char: any) => ({
            name: char.name,
            count: Math.floor(Math.random() * 50) + 10,
          }))
          .sort((a: any, b: any) => b.count - a.count)
          .slice(0, 5);

        // Progress analysis
        const chaptersByStatus = chapters.reduce(
          (acc: Record<string, number>, ch: any) => {
            acc[ch.status || "draft"] = (acc[ch.status || "draft"] || 0) + 1;
            return acc;
          },
          {},
        );

        const completionPercentage =
          chapters.length > 0
            ? ((chaptersByStatus.completed || 0) / chapters.length) * 100
            : 0;

        // Writing velocity (from sessions in selected time range)
        const now = new Date();
        const timeRangeMs = {
          week: 7 * 24 * 60 * 60 * 1000,
          month: 30 * 24 * 60 * 60 * 1000,
          year: 365 * 24 * 60 * 60 * 1000,
        };

        const cutoffDate = new Date(now.getTime() - timeRangeMs[timeRange]);
        const relevantSessions = writingSessions.filter(
          (session) => new Date(session.date) >= cutoffDate,
        );

        const totalWordsInRange = relevantSessions.reduce(
          (sum, session) => sum + session.wordsWritten,
          0,
        );
        const totalTimeInRange = relevantSessions.reduce(
          (sum, session) => sum + session.timeSpent,
          0,
        );

        const daysInRange = Math.ceil(
          (now.getTime() - cutoffDate.getTime()) / (24 * 60 * 60 * 1000),
        );
        const wordsPerDay = totalWordsInRange / daysInRange;
        const sessionsPerWeek = (relevantSessions.length / daysInRange) * 7;
        const averageSessionLength =
          relevantSessions.length > 0
            ? totalTimeInRange / relevantSessions.length
            : 0;

        // Most productive hour analysis
        const hourCounts = relevantSessions.reduce(
          (acc: Record<number, number>, session) => {
            const hour = new Date(session.date).getHours();
            acc[hour] = (acc[hour] || 0) + session.wordsWritten;
            return acc;
          },
          {},
        );

        const mostProductiveHour =
          Object.keys(hourCounts).length > 0
            ? Object.entries(hourCounts).reduce((max, [hour, count]) =>
                count > hourCounts[parseInt(max)] ? hour : max,
              )
            : "12";

        // Generate insights
        const insights = [];

        // Positive insights
        if (completionPercentage > 50) {
          insights.push({
            type: "positive" as const,
            title: "Great Progress!",
            description: `You've completed ${Math.round(
              completionPercentage,
            )}% of your chapters.`,
            metric: completionPercentage,
          });
        }

        if (wordsPerDay > 500) {
          insights.push({
            type: "positive" as const,
            title: "Excellent Writing Velocity",
            description: `You're averaging ${Math.round(
              wordsPerDay,
            )} words per day!`,
            metric: wordsPerDay,
          });
        }

        // Neutral insights
        insights.push({
          type: "neutral" as const,
          title: "Character Distribution",
          description: `Your story has ${characters.length} characters across ${
            Object.keys(charactersByRole).length
          } different roles.`,
        });

        if (averageChapterWords > 0) {
          insights.push({
            type: "neutral" as const,
            title: "Chapter Length",
            description: `Your chapters average ${Math.round(
              averageChapterWords,
            )} words each.`,
            metric: averageChapterWords,
          });
        }

        // Suggestions
        if (characters.length > 0 && worldElements.length === 0) {
          insights.push({
            type: "suggestion" as const,
            title: "Build Your World",
            description:
              "Consider adding world-building elements to enrich your story's setting.",
          });
        }

        if (chapters.length > 0 && scenes.length === 0) {
          insights.push({
            type: "suggestion" as const,
            title: "Scene Planning",
            description:
              "Break down your chapters into scenes for better story structure.",
          });
        }

        if (wordsPerDay < 100 && relevantSessions.length > 0) {
          insights.push({
            type: "suggestion" as const,
            title: "Consistency Opportunity",
            description:
              "Try setting a daily writing goal to improve your writing consistency.",
          });
        }

        const analyticsData: AnalyticsData = {
          wordCounts: {
            total: totalWords,
            chapters: chapterWords,
            scenes: sceneWords,
            notes: noteWords,
            average: averageChapterWords,
          },
          characterData: {
            total: characters.length,
            byRole: charactersByRole,
            mostMentioned,
            averageRelationships: characters.length > 0 ? 2.5 : 0, // Mock data
          },
          progressData: {
            chaptersCompleted: chaptersByStatus.completed || 0,
            chaptersInProgress: chaptersByStatus["in-progress"] || 0,
            chaptersDraft: chaptersByStatus.draft || 0,
            completionPercentage,
          },
          writingVelocity: {
            wordsPerDay,
            sessionsPerWeek,
            averageSessionLength,
            mostProductiveHour: `${mostProductiveHour}:00`,
          },
          contentDistribution: {
            chapters: chapters.length,
            scenes: scenes.length,
            notes: notes.length,
            characters: characters.length,
            worldElements: worldElements.length,
          },
          insights,
        };

        setAnalytics(analyticsData);
      } catch (error) {
        console.error("Error calculating analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    calculateAnalytics();
  }, [currentStory, timeRange]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "positive":
        return <Award className="h-4 w-4 text-green-500" />;
      case "suggestion":
        return <Brain className="h-4 w-4 text-blue-500" />;
      default:
        return <Eye className="h-4 w-4 text-gray-500" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case "positive":
        return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950";
      case "suggestion":
        return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950";
      default:
        return "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950";
    }
  };

  if (!currentStory) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <BarChart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Story Selected</h3>
          <p className="text-muted-foreground">
            Please select a story to view writing analytics and insights.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <h3 className="text-lg font-semibold mb-2">Analyzing Your Writing</h3>
          <p className="text-muted-foreground">
            Generating insights from your story data...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <BarChart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
          <p className="text-muted-foreground">
            Start writing to see analytics and insights.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Writing Analytics</h2>
          <p className="text-muted-foreground">
            Insights and metrics for "{currentStory.title}"
          </p>
        </div>

        <Select
          value={timeRange}
          onValueChange={(value: any) => setTimeRange(value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Words</p>
                <p className="text-2xl font-bold">
                  {analytics.wordCounts.total.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Progress</p>
                <p className="text-2xl font-bold">
                  {Math.round(analytics.progressData.completionPercentage)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Characters</p>
                <p className="text-2xl font-bold">
                  {analytics.characterData.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Words/Day</p>
                <p className="text-2xl font-bold">
                  {Math.round(analytics.writingVelocity.wordsPerDay)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="characters">Characters</TabsTrigger>
          <TabsTrigger value="velocity">Writing Velocity</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Content Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Chapters</span>
                    <Badge variant="secondary">
                      {analytics.contentDistribution.chapters}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Scenes</span>
                    <Badge variant="secondary">
                      {analytics.contentDistribution.scenes}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Characters</span>
                    <Badge variant="secondary">
                      {analytics.contentDistribution.characters}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Notes</span>
                    <Badge variant="secondary">
                      {analytics.contentDistribution.notes}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>World Elements</span>
                    <Badge variant="secondary">
                      {analytics.contentDistribution.worldElements}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Word Count Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Chapters</span>
                      <span>
                        {analytics.wordCounts.chapters.toLocaleString()}
                      </span>
                    </div>
                    <Progress
                      value={
                        (analytics.wordCounts.chapters /
                          analytics.wordCounts.total) *
                        100
                      }
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Scenes</span>
                      <span>
                        {analytics.wordCounts.scenes.toLocaleString()}
                      </span>
                    </div>
                    <Progress
                      value={
                        (analytics.wordCounts.scenes /
                          analytics.wordCounts.total) *
                        100
                      }
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Notes</span>
                      <span>{analytics.wordCounts.notes.toLocaleString()}</span>
                    </div>
                    <Progress
                      value={
                        (analytics.wordCounts.notes /
                          analytics.wordCounts.total) *
                        100
                      }
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Chapter Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span>Overall Completion</span>
                    <span className="font-semibold">
                      {Math.round(analytics.progressData.completionPercentage)}%
                    </span>
                  </div>
                  <Progress
                    value={analytics.progressData.completionPercentage}
                    className="h-3"
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {analytics.progressData.chaptersCompleted}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Completed
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {analytics.progressData.chaptersInProgress}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      In Progress
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600">
                      {analytics.progressData.chaptersDraft}
                    </div>
                    <div className="text-sm text-muted-foreground">Draft</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="characters" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Character Roles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analytics.characterData.byRole).map(
                    ([role, count]) => (
                      <div
                        key={role}
                        className="flex justify-between items-center"
                      >
                        <span className="capitalize">{role}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Most Mentioned Characters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.characterData.mostMentioned.map((char, index) => (
                    <div
                      key={char.name}
                      className="flex justify-between items-center"
                    >
                      <span>{char.name}</span>
                      <Badge variant="secondary">{char.count} mentions</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="velocity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Writing Velocity ({timeRange})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {Math.round(analytics.writingVelocity.wordsPerDay)}
                  </div>
                  <div className="text-sm text-muted-foreground">Words/Day</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {analytics.writingVelocity.sessionsPerWeek.toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Sessions/Week
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {Math.round(analytics.writingVelocity.averageSessionLength)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Min/Session
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {analytics.writingVelocity.mostProductiveHour}
                  </div>
                  <div className="text-sm text-muted-foreground">Peak Hour</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="space-y-3">
            {analytics.insights.map((insight, index) => (
              <Card key={index} className={getInsightColor(insight.type)}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {insight.description}
                      </p>
                      {insight.metric && (
                        <div className="mt-2">
                          <Badge variant="outline">
                            {insight.metric.toLocaleString()}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
