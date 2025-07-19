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
  Plus,
  Minus,
  RotateCcw,
} from "lucide-react";

export interface Character {
  id: string;
  name: string;
  role?: string;
  status?: string;
  relationships?: string[];
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
  strength: number;
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

interface RelationshipMapProps {
  currentCharacter: Character;
  characters?: Character[];
  onClose?: () => void;
}

export function RelationshipMap({
  currentCharacter,
  characters = [],
  onClose,
}: RelationshipMapProps) {
  // Early return if currentCharacter is missing
  if (!currentCharacter) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No character selected</p>
      </div>
    );
  }

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [graphNodes, setGraphNodes] = useState<GraphNode[]>([]);
  const [graphEdges, setGraphEdges] = useState<GraphEdge[]>([]);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isAddingRelationship, setIsAddingRelationship] = useState(false);

  // New relationship form
  const [newRel, setNewRel] = useState({
    fromCharacterId: currentCharacter.id,
    toCharacterId: "",
    type: "friendship" as Relationship["type"],
    strength: 3,
    description: "",
    isDirectional: false,
  });

  // Load relationships from localStorage
  useEffect(() => {
    if (!currentCharacter?.id) return;

    const savedRelationships = localStorage.getItem(
      `chronicle-relationships-${currentCharacter.id?.split("-")[0]}`,
    );
    if (savedRelationships) {
      try {
        const rels = JSON.parse(savedRelationships);
        setRelationships(rels);
      } catch (e) {
        console.error("Error loading relationships:", e);
      }
    }
  }, [currentCharacter]);

  // Generate graph data
  useEffect(() => {
    if (!characters || !characters.length) return;

    const nodes: GraphNode[] = (characters || []).map((char, index) => {
      const connections = (relationships || []).filter(
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
        role: char.role || "minor",
        x: 300 + (index % 4) * 120,
        y: 200 + Math.floor(index / 4) * 120,
        connections,
        color:
          roleColors[char.role?.toLowerCase() as keyof typeof roleColors] ||
          "#6b7280",
      };
    });

    const edges: GraphEdge[] = (relationships || []).map((rel) => {
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
      const isCurrent = node.id === currentCharacter.id;
      const radius = 20 + node.connections * 2;

      // Highlight current character
      if (isCurrent) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + 5, 0, 2 * Math.PI);
        ctx.strokeStyle = "#fbbf24";
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = node.color;
      ctx.fill();

      // Hover effect
      if (isHovered) {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Node label
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 12px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(node.name, node.x, node.y + 3);

      // Role badge
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.font = "9px Inter, sans-serif";
      ctx.fillText(node.role, node.x, node.y + radius + 12);
    });

    ctx.restore();
  }, [
    graphNodes,
    graphEdges,
    zoom,
    panX,
    panY,
    hoveredNode,
    currentCharacter.id,
  ]);

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
        return distance < 20 + node.connections * 2;
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
      !currentCharacter?.id ||
      !newRel.fromCharacterId ||
      !newRel.toCharacterId ||
      newRel.fromCharacterId === newRel.toCharacterId
    )
      return;

    const relationship: Relationship = {
      id: Date.now().toString(),
      ...newRel,
    };

    const updatedRelationships = [...relationships, relationship];
    setRelationships(updatedRelationships);

    if (currentCharacter.id) {
      localStorage.setItem(
        `chronicle-relationships-${currentCharacter.id?.split("-")[0]}`,
        JSON.stringify(updatedRelationships),
      );
    }

    // Reset form
    setNewRel({
      fromCharacterId: currentCharacter.id || "",
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Character Relationships: {currentCharacter.name}
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={resetView}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset View
          </Button>
          <Dialog
            open={isAddingRelationship}
            onOpenChange={setIsAddingRelationship}
          >
            <DialogTrigger asChild>
              <Button size="sm">
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
                        {(characters || []).map((char) => (
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
                        {(characters || []).map((char) => (
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
          <TabsTrigger value="list">Relationships List</TabsTrigger>
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
                  className="w-full h-80 cursor-move"
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  onMouseLeave={handleCanvasMouseUp}
                  onWheel={handleWheel}
                />
                <div className="absolute top-2 left-2 text-xs text-muted-foreground bg-background/80 p-2 rounded">
                  Drag to pan • Scroll to zoom • {currentCharacter.name}{" "}
                  highlighted in gold
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Character Relationships</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {(relationships || [])
                    .filter(
                      (rel) =>
                        rel.fromCharacterId === currentCharacter.id ||
                        rel.toCharacterId === currentCharacter.id,
                    )
                    .map((rel) => {
                      const isFrom =
                        rel.fromCharacterId === currentCharacter.id;
                      const otherCharId = isFrom
                        ? rel.toCharacterId
                        : rel.fromCharacterId;
                      const otherChar = (characters || []).find(
                        (c) => c.id === otherCharId,
                      );

                      return (
                        <div
                          key={rel.id}
                          className="flex items-center gap-4 p-3 border rounded"
                        >
                          <div className="flex items-center gap-2">
                            {getRelationshipIcon(rel.type)}
                            <span className="font-medium">
                              {currentCharacter.name}
                            </span>
                            <span className="text-muted-foreground">↔</span>
                            <span className="font-medium">
                              {otherChar?.name}
                            </span>
                          </div>
                          <Badge variant="secondary">{rel.type}</Badge>
                          <div className="flex gap-1">
                            {Array.from({ length: rel.strength }).map(
                              (_, i) => (
                                <div
                                  key={i}
                                  className="w-2 h-2 bg-primary rounded-full"
                                />
                              ),
                            )}
                          </div>
                          {rel.description && (
                            <span className="text-sm text-muted-foreground flex-1">
                              {rel.description}
                            </span>
                          )}
                        </div>
                      );
                    })}

                  {(relationships || []).filter(
                    (rel) =>
                      rel.fromCharacterId === currentCharacter.id ||
                      rel.toCharacterId === currentCharacter.id,
                  ).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No relationships defined yet</p>
                      <p className="text-sm">
                        Add relationships to visualize character connections
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
