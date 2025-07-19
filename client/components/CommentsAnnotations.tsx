import { useState, useEffect, useRef } from "react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MessageSquare,
  Edit,
  Trash2,
  Reply,
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  Plus,
  Filter,
  Search,
  User,
  Clock,
  Hash,
  CheckCircle,
  AlertCircle,
  Info,
  Lightbulb,
  Flag,
  Bookmark,
  FileText,
  Highlighter,
  Pin,
  Eye,
  EyeOff,
} from "lucide-react";
import { useStory } from "@/contexts/StoryContext";

interface Comment {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
  type: "comment" | "suggestion" | "question" | "praise" | "issue";
  priority: "low" | "medium" | "high";
  status: "open" | "resolved" | "archived";
  parentId?: string; // For replies
  targetType: "chapter" | "character" | "note" | "worldbuilding" | "scene";
  targetId: string;
  targetSection?: string; // specific section or paragraph
  isResolved: boolean;
  tags: string[];
  likes: number;
  dislikes: number;
  isPublic: boolean;
  attachments?: string[];
}

interface Annotation {
  id: string;
  text: string;
  note: string;
  color: string;
  type: "highlight" | "underline" | "strikethrough" | "note";
  startOffset: number;
  endOffset: number;
  targetType: "chapter" | "character" | "note" | "worldbuilding" | "scene";
  targetId: string;
  author: string;
  timestamp: Date;
  isVisible: boolean;
  tags: string[];
}

interface CommentThread {
  parentComment: Comment;
  replies: Comment[];
}

export function CommentsAnnotations() {
  const { currentStory } = useStory();
  const [comments, setComments] = useState<Comment[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedText, setSelectedText] = useState("");
  const [selectedRange, setSelectedRange] = useState<Range | null>(null);
  const [newCommentDialog, setNewCommentDialog] = useState(false);
  const [newAnnotationDialog, setNewAnnotationDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const [newComment, setNewComment] = useState({
    content: "",
    type: "comment" as Comment["type"],
    priority: "medium" as Comment["priority"],
    targetType: "chapter" as Comment["targetType"],
    targetId: "",
    targetSection: "",
    tags: [] as string[],
    isPublic: true,
  });

  const [newAnnotation, setNewAnnotation] = useState({
    note: "",
    color: "#fbbf24",
    type: "highlight" as Annotation["type"],
    tags: [] as string[],
  });

  const commentTypes = {
    comment: { icon: MessageSquare, color: "blue", label: "Comment" },
    suggestion: { icon: Lightbulb, color: "green", label: "Suggestion" },
    question: { icon: Info, color: "purple", label: "Question" },
    praise: { icon: ThumbsUp, color: "emerald", label: "Praise" },
    issue: { icon: AlertCircle, color: "red", label: "Issue" },
  };

  const annotationColors = [
    "#fbbf24", // yellow
    "#10b981", // green
    "#3b82f6", // blue
    "#8b5cf6", // purple
    "#f59e0b", // orange
    "#ef4444", // red
    "#06b6d4", // cyan
    "#84cc16", // lime
  ];

  useEffect(() => {
    loadCommentsAndAnnotations();
    document.addEventListener("mouseup", handleTextSelection);
    return () => document.removeEventListener("mouseup", handleTextSelection);
  }, [currentStory]);

  const loadCommentsAndAnnotations = () => {
    if (!currentStory) return;

    const commentsData = localStorage.getItem(`comments-${currentStory.id}`);
    if (commentsData) {
      setComments(
        JSON.parse(commentsData).map((comment: any) => ({
          ...comment,
          timestamp: new Date(comment.timestamp),
        })),
      );
    }

    const annotationsData = localStorage.getItem(
      `annotations-${currentStory.id}`,
    );
    if (annotationsData) {
      setAnnotations(
        JSON.parse(annotationsData).map((annotation: any) => ({
          ...annotation,
          timestamp: new Date(annotation.timestamp),
        })),
      );
    }
  };

  const saveData = () => {
    if (!currentStory) return;
    localStorage.setItem(
      `comments-${currentStory.id}`,
      JSON.stringify(comments),
    );
    localStorage.setItem(
      `annotations-${currentStory.id}`,
      JSON.stringify(annotations),
    );
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString());
      setSelectedRange(selection.getRangeAt(0).cloneRange());
    }
  };

  const createComment = () => {
    if (!newComment.content.trim()) return;

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      content: newComment.content,
      author: "Current User",
      timestamp: new Date(),
      type: newComment.type,
      priority: newComment.priority,
      status: "open",
      targetType: newComment.targetType,
      targetId: newComment.targetId,
      targetSection: newComment.targetSection,
      isResolved: false,
      tags: newComment.tags,
      likes: 0,
      dislikes: 0,
      isPublic: newComment.isPublic,
    };

    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    setNewCommentDialog(false);
    setNewComment({
      content: "",
      type: "comment",
      priority: "medium",
      targetType: "chapter",
      targetId: "",
      targetSection: "",
      tags: [],
      isPublic: true,
    });
    saveData();
  };

  const createAnnotation = () => {
    if (!selectedText || !selectedRange) return;

    const annotation: Annotation = {
      id: `annotation-${Date.now()}`,
      text: selectedText,
      note: newAnnotation.note,
      color: newAnnotation.color,
      type: newAnnotation.type,
      startOffset: selectedRange.startOffset,
      endOffset: selectedRange.endOffset,
      targetType: "chapter", // This would be determined by current context
      targetId: currentStory?.id || "",
      author: "Current User",
      timestamp: new Date(),
      isVisible: true,
      tags: newAnnotation.tags,
    };

    const updatedAnnotations = [...annotations, annotation];
    setAnnotations(updatedAnnotations);
    setNewAnnotationDialog(false);
    setNewAnnotation({
      note: "",
      color: "#fbbf24",
      type: "highlight",
      tags: [],
    });
    setSelectedText("");
    setSelectedRange(null);
    saveData();
  };

  const replyToComment = (parentId: string, content: string) => {
    const reply: Comment = {
      id: `comment-${Date.now()}`,
      content,
      author: "Current User",
      timestamp: new Date(),
      type: "comment",
      priority: "medium",
      status: "open",
      parentId,
      targetType: "chapter",
      targetId: currentStory?.id || "",
      isResolved: false,
      tags: [],
      likes: 0,
      dislikes: 0,
      isPublic: true,
    };

    const updatedComments = [...comments, reply];
    setComments(updatedComments);
    saveData();
  };

  const toggleCommentStatus = (commentId: string) => {
    const updatedComments = comments.map((comment) =>
      comment.id === commentId
        ? {
            ...comment,
            status:
              comment.status === "open"
                ? "resolved"
                : comment.status === "resolved"
                  ? "archived"
                  : "open",
            isResolved: comment.status === "open",
          }
        : comment,
    );
    setComments(updatedComments);
    saveData();
  };

  const likeComment = (commentId: string, isLike: boolean) => {
    const updatedComments = comments.map((comment) =>
      comment.id === commentId
        ? {
            ...comment,
            likes: isLike ? comment.likes + 1 : comment.likes,
            dislikes: !isLike ? comment.dislikes + 1 : comment.dislikes,
          }
        : comment,
    );
    setComments(updatedComments);
    saveData();
  };

  const deleteComment = (commentId: string) => {
    const updatedComments = comments.filter(
      (comment) => comment.id !== commentId && comment.parentId !== commentId,
    );
    setComments(updatedComments);
    saveData();
  };

  const deleteAnnotation = (annotationId: string) => {
    const updatedAnnotations = annotations.filter(
      (annotation) => annotation.id !== annotationId,
    );
    setAnnotations(updatedAnnotations);
    saveData();
  };

  const toggleAnnotationVisibility = (annotationId: string) => {
    const updatedAnnotations = annotations.map((annotation) =>
      annotation.id === annotationId
        ? { ...annotation, isVisible: !annotation.isVisible }
        : annotation,
    );
    setAnnotations(updatedAnnotations);
    saveData();
  };

  const organizeComments = (): CommentThread[] => {
    const parentComments = comments.filter((comment) => !comment.parentId);
    return parentComments.map((parent) => ({
      parentComment: parent,
      replies: comments.filter((comment) => comment.parentId === parent.id),
    }));
  };

  const filteredComments = comments.filter((comment) => {
    const matchesSearch =
      comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || comment.status === filterStatus;

    const matchesType = filterType === "all" || comment.type === filterType;

    return matchesSearch && matchesStatus && matchesType && !comment.parentId;
  });

  const filteredAnnotations = annotations.filter((annotation) => {
    const matchesSearch =
      annotation.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      annotation.note.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  if (!currentStory) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>Select a story to manage comments and annotations</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Comments & Annotations</h2>
          <p className="text-muted-foreground">
            Add feedback, notes, and highlights to your content
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog
            open={newAnnotationDialog}
            onOpenChange={setNewAnnotationDialog}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                disabled={!selectedText}
                title="Select text to annotate"
              >
                <Highlighter className="h-4 w-4 mr-2" />
                Annotate
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Annotation</DialogTitle>
                <DialogDescription>
                  Add a note to the selected text: "{selectedText}"
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Type</Label>
                  <Select
                    value={newAnnotation.type}
                    onValueChange={(value: Annotation["type"]) =>
                      setNewAnnotation((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="highlight">Highlight</SelectItem>
                      <SelectItem value="underline">Underline</SelectItem>
                      <SelectItem value="strikethrough">
                        Strikethrough
                      </SelectItem>
                      <SelectItem value="note">Note</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Color</Label>
                  <div className="flex gap-2 mt-2">
                    {annotationColors.map((color) => (
                      <button
                        key={color}
                        className={`w-6 h-6 rounded border-2 ${
                          newAnnotation.color === color
                            ? "border-gray-800"
                            : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() =>
                          setNewAnnotation((prev) => ({ ...prev, color }))
                        }
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="annotation-note">Note</Label>
                  <Textarea
                    id="annotation-note"
                    placeholder="Add your note here..."
                    value={newAnnotation.note}
                    onChange={(e) =>
                      setNewAnnotation((prev) => ({
                        ...prev,
                        note: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="annotation-tags">
                    Tags (comma separated)
                  </Label>
                  <Input
                    id="annotation-tags"
                    placeholder="important, fix, review"
                    onChange={(e) =>
                      setNewAnnotation((prev) => ({
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
                  onClick={() => setNewAnnotationDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={createAnnotation}>Create Annotation</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={newCommentDialog} onOpenChange={setNewCommentDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Comment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Comment</DialogTitle>
                <DialogDescription>
                  Add feedback or notes to your content
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Type</Label>
                  <Select
                    value={newComment.type}
                    onValueChange={(value: Comment["type"]) =>
                      setNewComment((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(commentTypes).map(([key, type]) => (
                        <SelectItem key={key} value={key}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select
                    value={newComment.priority}
                    onValueChange={(value: Comment["priority"]) =>
                      setNewComment((prev) => ({ ...prev, priority: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="comment-content">Comment</Label>
                  <Textarea
                    id="comment-content"
                    placeholder="Enter your comment..."
                    value={newComment.content}
                    onChange={(e) =>
                      setNewComment((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="comment-section">Section/Context</Label>
                  <Input
                    id="comment-section"
                    placeholder="Chapter 1, paragraph 3..."
                    value={newComment.targetSection}
                    onChange={(e) =>
                      setNewComment((prev) => ({
                        ...prev,
                        targetSection: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="comment-tags">Tags (comma separated)</Label>
                  <Input
                    id="comment-tags"
                    placeholder="plot, character, pacing"
                    onChange={(e) =>
                      setNewComment((prev) => ({
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
                  onClick={() => setNewCommentDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={createComment}
                  disabled={!newComment.content.trim()}
                >
                  Add Comment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="all">
            <MessageSquare className="h-4 w-4 mr-2" />
            All ({comments.length + annotations.length})
          </TabsTrigger>
          <TabsTrigger value="comments">
            <MessageSquare className="h-4 w-4 mr-2" />
            Comments ({comments.length})
          </TabsTrigger>
          <TabsTrigger value="annotations">
            <Highlighter className="h-4 w-4 mr-2" />
            Annotations ({annotations.length})
          </TabsTrigger>
        </TabsList>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search comments and annotations..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {(activeTab === "all" || activeTab === "comments") && (
            <>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.entries(commentTypes).map(([key, type]) => (
                    <SelectItem key={key} value={key}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}
        </div>

        <TabsContent value="all" className="space-y-4">
          <div className="space-y-4">
            {filteredComments.map((comment) => {
              const CommentIcon = commentTypes[comment.type].icon;
              const replies = comments.filter((c) => c.parentId === comment.id);

              return (
                <Card key={comment.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <CommentIcon className="h-4 w-4" />
                        <Badge
                          variant={
                            comment.priority === "high"
                              ? "destructive"
                              : comment.priority === "medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {comment.priority}
                        </Badge>
                        <Badge
                          variant={
                            comment.status === "resolved"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {comment.status}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                          {commentTypes[comment.type].label}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => toggleCommentStatus(comment.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Toggle Status
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => deleteComment(comment.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-3">{comment.content}</p>
                    {comment.targetSection && (
                      <div className="text-sm text-muted-foreground mb-2">
                        Context: {comment.targetSection}
                      </div>
                    )}
                    {comment.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {comment.tags.map((tag, index) => (
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
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {comment.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {comment.timestamp.toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => likeComment(comment.id, true)}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {comment.likes}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => likeComment(comment.id, false)}
                      >
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        {comment.dislikes}
                      </Button>
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Reply className="h-4 w-4 mr-2" />
                          Reply ({replies.length})
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            {replies.map((reply) => (
                              <div
                                key={reply.id}
                                className="p-2 bg-muted rounded text-sm"
                              >
                                <p>{reply.content}</p>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {reply.author} •{" "}
                                  {reply.timestamp.toLocaleDateString()}
                                </div>
                              </div>
                            ))}
                          </div>
                          <div>
                            <Textarea
                              placeholder="Write a reply..."
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && e.ctrlKey) {
                                  const content = e.currentTarget.value;
                                  if (content.trim()) {
                                    replyToComment(comment.id, content);
                                    e.currentTarget.value = "";
                                  }
                                }
                              }}
                            />
                            <div className="text-xs text-muted-foreground mt-1">
                              Press Ctrl+Enter to reply
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </CardFooter>
                </Card>
              );
            })}

            {filteredAnnotations.map((annotation) => (
              <Card key={annotation.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Highlighter className="h-4 w-4" />
                      <Badge variant="outline">{annotation.type}</Badge>
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: annotation.color }}
                      />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            toggleAnnotationVisibility(annotation.id)
                          }
                        >
                          {annotation.isVisible ? (
                            <EyeOff className="h-4 w-4 mr-2" />
                          ) : (
                            <Eye className="h-4 w-4 mr-2" />
                          )}
                          {annotation.isVisible ? "Hide" : "Show"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteAnnotation(annotation.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-3">
                    <div className="text-sm font-medium mb-1">
                      Selected text:
                    </div>
                    <div
                      className="p-2 rounded text-sm"
                      style={{
                        backgroundColor: `${annotation.color}20`,
                        borderLeft: `3px solid ${annotation.color}`,
                      }}
                    >
                      "{annotation.text}"
                    </div>
                  </div>
                  {annotation.note && (
                    <div className="mb-3">
                      <div className="text-sm font-medium mb-1">Note:</div>
                      <p className="text-sm">{annotation.note}</p>
                    </div>
                  )}
                  {annotation.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {annotation.tags.map((tag, index) => (
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
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {annotation.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {annotation.timestamp.toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="comments" className="space-y-4">
          <div className="space-y-4">
            {filteredComments.map((comment) => {
              const CommentIcon = commentTypes[comment.type].icon;
              const replies = comments.filter((c) => c.parentId === comment.id);

              return (
                <Card key={comment.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <CommentIcon className="h-4 w-4" />
                        <Badge
                          variant={
                            comment.priority === "high"
                              ? "destructive"
                              : comment.priority === "medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {comment.priority}
                        </Badge>
                        <Badge
                          variant={
                            comment.status === "resolved"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {comment.status}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                          {commentTypes[comment.type].label}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => toggleCommentStatus(comment.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Toggle Status
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => deleteComment(comment.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-3">{comment.content}</p>
                    {comment.targetSection && (
                      <div className="text-sm text-muted-foreground mb-2">
                        Context: {comment.targetSection}
                      </div>
                    )}
                    {comment.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {comment.tags.map((tag, index) => (
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
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {comment.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {comment.timestamp.toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => likeComment(comment.id, true)}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {comment.likes}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => likeComment(comment.id, false)}
                      >
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        {comment.dislikes}
                      </Button>
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Reply className="h-4 w-4 mr-2" />
                          Reply ({replies.length})
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            {replies.map((reply) => (
                              <div
                                key={reply.id}
                                className="p-2 bg-muted rounded text-sm"
                              >
                                <p>{reply.content}</p>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {reply.author} •{" "}
                                  {reply.timestamp.toLocaleDateString()}
                                </div>
                              </div>
                            ))}
                          </div>
                          <div>
                            <Textarea
                              placeholder="Write a reply..."
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && e.ctrlKey) {
                                  const content = e.currentTarget.value;
                                  if (content.trim()) {
                                    replyToComment(comment.id, content);
                                    e.currentTarget.value = "";
                                  }
                                }
                              }}
                            />
                            <div className="text-xs text-muted-foreground mt-1">
                              Press Ctrl+Enter to reply
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="annotations" className="space-y-4">
          <div className="space-y-4">
            {filteredAnnotations.map((annotation) => (
              <Card key={annotation.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Highlighter className="h-4 w-4" />
                      <Badge variant="outline">{annotation.type}</Badge>
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: annotation.color }}
                      />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            toggleAnnotationVisibility(annotation.id)
                          }
                        >
                          {annotation.isVisible ? (
                            <EyeOff className="h-4 w-4 mr-2" />
                          ) : (
                            <Eye className="h-4 w-4 mr-2" />
                          )}
                          {annotation.isVisible ? "Hide" : "Show"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteAnnotation(annotation.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-3">
                    <div className="text-sm font-medium mb-1">
                      Selected text:
                    </div>
                    <div
                      className="p-2 rounded text-sm"
                      style={{
                        backgroundColor: `${annotation.color}20`,
                        borderLeft: `3px solid ${annotation.color}`,
                      }}
                    >
                      "{annotation.text}"
                    </div>
                  </div>
                  {annotation.note && (
                    <div className="mb-3">
                      <div className="text-sm font-medium mb-1">Note:</div>
                      <p className="text-sm">{annotation.note}</p>
                    </div>
                  )}
                  {annotation.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {annotation.tags.map((tag, index) => (
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
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {annotation.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {annotation.timestamp.toLocaleDateString()}
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
