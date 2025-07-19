import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Network,
  Users,
  Heart,
  Sword,
  Crown,
  Shield,
  Zap,
  Eye,
  Plus,
  Minus,
  RotateCcw,
  Download,
  Settings,
  Info,
} from "lucide-react";
import { useStory } from "@/contexts/StoryContext";

interface Character {
  id: string;
  name: string;
  role: string;
  description: string;
  x?: number;
  y?: number;
}

interface Relationship {
  id: string;
  fromCharacterId: string;
  toCharacterId: string;
  type:
    | "family"
    | "romantic"
    | "friendship"
    | "rivalry"
    | "mentor"
    | "enemy"
    | "ally"
    | "professional";
  strength: number; // 1-5
  description: string;
  isDirectional: boolean;
}

interface GraphNode {
  id: string;
  name: string;
  role: string;
  x: number;
  y: number;
  connections: number;
  color: string;
}

interface GraphEdge {
  from: string;
  to: string;
  type: string;
  strength: number;
  color: string;
  label: string;
}

export function RelationshipVisualization() {
  const { currentStory } = useStory();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null,
  );
  const [isAddingRelationship, setIsAddingRelationship] = useState(false);
  const [graphNodes, setGraphNodes] = useState<GraphNode[]>([]);
  const [graphEdges, setGraphEdges] = useState<GraphEdge[]>([]);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // New relationship form
  const [newRel, setNewRel] = useState({
    fromCharacterId: "",
    toCharacterId: "",
    type: "friendship" as Relationship["type"],
    strength: 3,
    description: "",
    isDirectional: false,
  });

  // Load characters and relationships from localStorage
  useEffect(() => {
    if (!currentStory) return;

    const savedCharacters = localStorage.getItem(
      `chronicle-characters-${currentStory.id}`,
    );
    const savedRelationships = localStorage.getItem(
      `chronicle-relationships-${currentStory.id}`,
    );

    if (savedCharacters) {
      try {
        const chars = JSON.parse(savedCharacters);
        setCharacters(chars);
      } catch (e) {
        console.error("Error loading characters:", e);
      }
    }

    if (savedRelationships) {
      try {
        const rels = JSON.parse(savedRelationships);
        setRelationships(rels);
      } catch (e) {
        console.error("Error loading relationships:", e);
      }
    }
  }, [currentStory]);

  // Generate graph data from characters and relationships
  useEffect(() => {
    if (!characters.length) return;

    const nodes: GraphNode[] = characters.map((char, index) => {
      const connections = relationships.filter(
        (rel) =>
          rel.fromCharacterId === char.id || rel.toCharacterId === char.id,
      ).length;

      const roleColors = {
        protagonist: "#3b82f6",
        antagonist: "#ef4444",
        supporting: "#10b981",
        minor: "#6b7280",
        deuteragonist: "#8b5cf6",
        love_interest: "#ec4899",
      };

      return {
        id: char.id,
        name: char.name,
        role: char.role,
        x: char.x || 200 + (index % 3) * 150,
        y: char.y || 200 + Math.floor(index / 3) * 150,
        connections,
        color:
          roleColors[char.role.toLowerCase() as keyof typeof roleColors] ||
          "#6b7280",
      };
    });

    const edges: GraphEdge[] = relationships.map((rel) => {
      const typeColors = {
        family: "#f59e0b",
        romantic: "#ec4899",
        friendship: "#10b981",
        rivalry: "#f97316",
        mentor: "#8b5cf6",
        enemy: "#ef4444",
        ally: "#3b82f6",
        professional: "#6b7280",
      };

      return {
        from: rel.fromCharacterId,
        to: rel.toCharacterId,
        type: rel.type,
        strength: rel.strength,
        color: typeColors[rel.type] || "#6b7280",
        label: rel.type,
      };
    });

    setGraphNodes(nodes);
    setGraphEdges(edges);
  }, [characters, relationships]);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !graphNodes.length) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    // Apply zoom and pan
    ctx.save();
    ctx.translate(panX, panY);
    ctx.scale(zoom, zoom);

    // Draw edges
    graphEdges.forEach((edge) => {
      const fromNode = graphNodes.find((n) => n.id === edge.from);
      const toNode = graphNodes.find((n) => n.id === edge.to);

      if (!fromNode || !toNode) return;

      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      ctx.strokeStyle = edge.color;
      ctx.lineWidth = edge.strength;
      ctx.stroke();

      // Draw edge label
      const midX = (fromNode.x + toNode.x) / 2;
      const midY = (fromNode.y + toNode.y) / 2;
      ctx.fillStyle = edge.color;
      ctx.font = "12px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(edge.label, midX, midY - 5);
    });

    // Draw nodes
    graphNodes.forEach((node) => {
      const isHovered = hoveredNode === node.id;
      const radius = 25 + node.connections * 3;

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = node.color;
      ctx.fill();

      // Hover effect
      if (isHovered) {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Node label
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 14px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(node.name, node.x, node.y + 5);

      // Role badge
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.font = "10px Inter, sans-serif";
      ctx.fillText(node.role, node.x, node.y + radius + 15);
    });

    ctx.restore();
  }, [graphNodes, graphEdges, zoom, panX, panY, hoveredNode]);

  // Canvas event handlers
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setPanX(e.clientX - dragStart.x);
      setPanY(e.clientY - dragStart.y);
    } else {
      // Check for hover
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - panX) / zoom;
      const y = (e.clientY - rect.top - panY) / zoom;

      const hoveredNodeId = graphNodes.find((node) => {
        const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
        return distance < 25 + node.connections * 3;
      })?.id;

      setHoveredNode(hoveredNodeId || null);
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((prev) => Math.max(0.5, Math.min(3, prev * zoomFactor)));
  };

  const addRelationship = () => {
    if (
      !newRel.fromCharacterId ||
      !newRel.toCharacterId ||
      !currentStory ||
      newRel.fromCharacterId === newRel.toCharacterId
    )
      return;

    const relationship: Relationship = {
      id: Date.now().toString(),
      ...newRel,
    };

    const updatedRelationships = [...relationships, relationship];
    setRelationships(updatedRelationships);

    localStorage.setItem(
      `chronicle-relationships-${currentStory.id}`,
      JSON.stringify(updatedRelationships),
    );

    // Reset form
    setNewRel({
      fromCharacterId: "",
      toCharacterId: "",
      type: "friendship",
      strength: 3,
      description: "",
      isDirectional: false,
    });
    setIsAddingRelationship(false);
  };

  const resetView = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  const getRelationshipIcon = (type: string) => {
    const icons = {
      family: Crown,
      romantic: Heart,
      friendship: Users,
      rivalry: Sword,
      mentor: Shield,
      enemy: Zap,
      ally: Shield,
      professional: Crown,
    };
    const IconComponent = icons[type as keyof typeof icons] || Users;
    return <IconComponent className="h-4 w-4" />;
  };

  const getCharactersByRole = () => {
    const grouped = characters.reduce(
      (acc, char) => {
        const role = char.role || "other";
        if (!acc[role]) acc[role] = [];
        acc[role].push(char);
        return acc;
      },
      {} as Record<string, Character[]>,
    );
    return grouped;
  };

  if (!currentStory) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Story Selected</h3>
          <p className="text-muted-foreground">
            Please select a story to visualize character relationships.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!characters.length) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Characters Found</h3>
          <p className="text-muted-foreground">
            Create some characters first to visualize their relationships.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Character Relationships</h2>
          <p className="text-muted-foreground">
            Visualize and manage character connections in {currentStory.title}
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={resetView}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset View
          </Button>
          <Dialog
            open={isAddingRelationship}
            onOpenChange={setIsAddingRelationship}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Relationship
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Character Relationship</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>From Character</Label>
                    <Select
                      value={newRel.fromCharacterId}
                      onValueChange={(value) =>
                        setNewRel({ ...newRel, fromCharacterId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select character" />
                      </SelectTrigger>
                      <SelectContent>
                        {characters.map((char) => (
                          <SelectItem key={char.id} value={char.id}>
                            {char.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>To Character</Label>
                    <Select
                      value={newRel.toCharacterId}
                      onValueChange={(value) =>
                        setNewRel({ ...newRel, toCharacterId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select character" />
                      </SelectTrigger>
                      <SelectContent>
                        {characters.map((char) => (
                          <SelectItem key={char.id} value={char.id}>
                            {char.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Relationship Type</Label>
                  <Select
                    value={newRel.type}
                    onValueChange={(value: Relationship["type"]) =>
                      setNewRel({ ...newRel, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="family">Family</SelectItem>
                      <SelectItem value="romantic">Romantic</SelectItem>
                      <SelectItem value="friendship">Friendship</SelectItem>
                      <SelectItem value="rivalry">Rivalry</SelectItem>
                      <SelectItem value="mentor">Mentor</SelectItem>
                      <SelectItem value="enemy">Enemy</SelectItem>
                      <SelectItem value="ally">Ally</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Strength (1-5)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    value={newRel.strength}
                    onChange={(e) =>
                      setNewRel({
                        ...newRel,
                        strength: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={addRelationship} className="flex-1">
                    Add Relationship
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddingRelationship(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="graph" className="space-y-4">
        <TabsList>
          <TabsTrigger value="graph">Relationship Graph</TabsTrigger>
          <TabsTrigger value="matrix">Relationship Matrix</TabsTrigger>
          <TabsTrigger value="analysis">Network Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="graph">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  Interactive Relationship Map
                </span>
                <div className="flex gap-2 text-sm">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setZoom(zoom * 1.2)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setZoom(zoom * 0.8)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative border rounded-lg overflow-hidden">
                <canvas
                  ref={canvasRef}
                  className="w-full h-96 cursor-move"
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  onMouseLeave={handleCanvasMouseUp}
                  onWheel={handleWheel}
                />
                <div className="absolute top-2 left-2 text-xs text-muted-foreground bg-background/80 p-2 rounded">
                  Drag to pan • Scroll to zoom • Hover over characters for
                  details
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matrix">
          <Card>
            <CardHeader>
              <CardTitle>Character Relationship Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {relationships.map((rel) => {
                    const fromChar = characters.find(
                      (c) => c.id === rel.fromCharacterId,
                    );
                    const toChar = characters.find(
                      (c) => c.id === rel.toCharacterId,
                    );

                    return (
                      <div
                        key={rel.id}
                        className="flex items-center gap-4 p-3 border rounded"
                      >
                        <div className="flex items-center gap-2">
                          {getRelationshipIcon(rel.type)}
                          <span className="font-medium">{fromChar?.name}</span>
                          <span className="text-muted-foreground">→</span>
                          <span className="font-medium">{toChar?.name}</span>
                        </div>
                        <Badge variant="secondary">{rel.type}</Badge>
                        <div className="flex gap-1">
                          {Array.from({ length: rel.strength }).map((_, i) => (
                            <div
                              key={i}
                              className="w-2 h-2 bg-primary rounded-full"
                            />
                          ))}
                        </div>
                        {rel.description && (
                          <span className="text-sm text-muted-foreground flex-1">
                            {rel.description}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Network Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Characters:</span>
                    <span className="font-medium">{characters.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Relationships:</span>
                    <span className="font-medium">{relationships.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Network Density:</span>
                    <span className="font-medium">
                      {characters.length > 1
                        ? Math.round(
                            (relationships.length /
                              (characters.length * (characters.length - 1))) *
                              100,
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Most Connected Characters</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48">
                  <div className="space-y-2">
                    {graphNodes
                      .sort((a, b) => b.connections - a.connections)
                      .slice(0, 5)
                      .map((node) => (
                        <div
                          key={node.id}
                          className="flex items-center justify-between"
                        >
                          <span className="font-medium">{node.name}</span>
                          <Badge variant="outline">
                            {node.connections} connections
                          </Badge>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
