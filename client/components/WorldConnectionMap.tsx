import { useState, useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Globe,
  MapPin,
  Building,
  Crown,
  Star,
  Scroll,
  Target,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Move,
  Landmark,
  Trees,
  Castle,
} from "lucide-react";

export interface WorldElement {
  id: string;
  name: string;
  type: string;
  category: string;
}

interface ConnectionNode {
  id: string;
  name: string;
  type: string;
  category: string;
  x: number;
  y: number;
  connections: Connection[];
}

interface Connection {
  target: string;
  type: string;
}

interface WorldConnectionMapProps {
  currentElement: WorldElement;
  allElements: WorldElement[];
  connections: string[];
}

const elementTypeIcons = {
  location: { icon: MapPin, color: "#3B82F6" },
  organization: { icon: Users, color: "#8B5CF6" },
  system: { icon: Target, color: "#10B981" },
  culture: { icon: Crown, color: "#F59E0B" },
  history: { icon: Scroll, color: "#EF4444" },
  other: { icon: Globe, color: "#6B7280" },
};

const categoryIcons = {
  City: { icon: Building, color: "#3B82F6" },
  Institution: { icon: Landmark, color: "#8B5CF6" },
  "Natural Area": { icon: Trees, color: "#10B981" },
  "Secret Society": { icon: Crown, color: "#7C3AED" },
  "Magic System": { icon: Star, color: "#F59E0B" },
  Government: { icon: Castle, color: "#EF4444" },
  default: { icon: Globe, color: "#6B7280" },
};

export function WorldConnectionMap({
  currentElement,
  allElements,
  connections,
}: WorldConnectionMapProps) {
  const [selectedLayout, setSelectedLayout] = useState<
    "circle" | "force" | "hierarchical"
  >("circle");
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const nodes = useMemo(() => {
    // Parse connections to create connection objects
    const connectionObjects: Connection[] = connections.map((conn) => {
      const cleanConn = conn.trim();
      // Try to extract connection type from parentheses
      const match = cleanConn.match(/^(.+?)\s*\((.+?)\)$/);
      if (match) {
        const [, name, type] = match;
        return {
          target: name.trim(),
          type: type.toLowerCase(),
        };
      } else {
        return {
          target: cleanConn,
          type: "connected",
        };
      }
    });

    // Create the main element node
    const mainNode: ConnectionNode = {
      id: currentElement.id,
      name: currentElement.name,
      type: currentElement.type,
      category: currentElement.category,
      x: 200,
      y: 200,
      connections: connectionObjects,
    };

    // Create connected element nodes
    const connectedNodes: ConnectionNode[] = connectionObjects.map(
      (conn, index) => {
        const angle = (index / connectionObjects.length) * 2 * Math.PI;
        const radius =
          selectedLayout === "circle" ? 120 : 80 + Math.random() * 40;

        // Try to find this element in allElements to get its type/category
        const foundElement = allElements.find((el) => el.name === conn.target);

        return {
          id: `connected-${index}`,
          name: conn.target,
          type: foundElement?.type || "other",
          category: foundElement?.category || "Other",
          x: 200 + Math.cos(angle) * radius,
          y: 200 + Math.sin(angle) * radius,
          connections: [
            {
              target: currentElement.name,
              type: conn.type,
            },
          ],
        };
      },
    );

    return [mainNode, ...connectedNodes];
  }, [currentElement, connections, selectedLayout, allElements]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getElementIcon = (type: string, category: string) => {
    // First try to match by category
    const categoryStyle = categoryIcons[category as keyof typeof categoryIcons];
    if (categoryStyle) return categoryStyle;

    // Fall back to type
    const typeStyle = elementTypeIcons[type as keyof typeof elementTypeIcons];
    if (typeStyle) return typeStyle;

    // Default
    return categoryIcons.default;
  };

  const resetView = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 3));
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.5));

  if (connections.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Connection Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Globe className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">No Connections Defined</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add connections in the field above to see the visual map.
            </p>
            <p className="text-xs text-muted-foreground">
              Format: "Element Name" or "Element Name (type)" - e.g., "Grand
              Library", "Elena (character)"
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Connection Map
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select
              value={selectedLayout}
              onValueChange={(value: any) => setSelectedLayout(value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="circle">Circle</SelectItem>
                <SelectItem value="force">Organic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={zoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                {Math.round(zoom * 100)}%
              </span>
              <Button variant="outline" size="sm" onClick={zoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={resetView}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Move className="h-3 w-3" />
              Drag to pan
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
            {Object.entries(elementTypeIcons).map(([key, type]) => (
              <Badge key={key} variant="secondary" className="text-xs">
                <type.icon
                  className="h-3 w-3 mr-1"
                  style={{ color: type.color }}
                />
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Badge>
            ))}
          </div>

          {/* Connection Map SVG */}
          <div
            className="relative border rounded-lg bg-gradient-to-br from-background to-muted/20 overflow-hidden"
            style={{ height: "400px" }}
          >
            <svg
              ref={svgRef}
              width="100%"
              height="100%"
              viewBox="0 0 400 400"
              className="cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <defs>
                <filter id="world-glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                {Object.entries(elementTypeIcons).map(([key, type]) => (
                  <marker
                    key={key}
                    id={`world-arrow-${key}`}
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="3"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto"
                  >
                    <path d="m0,0 l0,6 l9,3 l0,-6 z" fill={type.color} />
                  </marker>
                ))}
              </defs>

              <g
                transform={`translate(${offset.x}, ${offset.y}) scale(${zoom})`}
              >
                {/* Connections */}
                {nodes[0]?.connections.map((connection, index) => {
                  const targetNode = nodes[index + 1];
                  if (!targetNode) return null;

                  const elementStyle = getElementIcon(
                    targetNode.type,
                    targetNode.category,
                  );

                  return (
                    <g key={`connection-${index}`}>
                      <line
                        x1={nodes[0].x}
                        y1={nodes[0].y}
                        x2={targetNode.x}
                        y2={targetNode.y}
                        stroke={elementStyle.color}
                        strokeWidth="2"
                        strokeDasharray={
                          connection.type === "conflict" ? "5,5" : "none"
                        }
                        markerEnd={`url(#world-arrow-${targetNode.type})`}
                        opacity="0.7"
                      />
                      {/* Connection label */}
                      <text
                        x={(nodes[0].x + targetNode.x) / 2}
                        y={(nodes[0].y + targetNode.y) / 2 - 8}
                        textAnchor="middle"
                        className="text-xs fill-current"
                        style={{ fill: elementStyle.color }}
                      >
                        {connection.type}
                      </text>
                    </g>
                  );
                })}

                {/* Nodes */}
                {nodes.map((node, index) => {
                  const isMainElement = index === 0;
                  const elementStyle = getElementIcon(node.type, node.category);
                  const IconComponent = elementStyle.icon;

                  return (
                    <g key={node.id}>
                      {/* Node circle */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isMainElement ? 25 : 20}
                        fill={elementStyle.color}
                        stroke={isMainElement ? "#1F2937" : "#4B5563"}
                        strokeWidth="2"
                        filter={isMainElement ? "url(#world-glow)" : "none"}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                      />

                      {/* Node icon */}
                      <foreignObject
                        x={node.x - 8}
                        y={node.y - 8}
                        width="16"
                        height="16"
                        className="pointer-events-none"
                      >
                        <IconComponent className="h-4 w-4 text-white" />
                      </foreignObject>

                      {/* Node label */}
                      <text
                        x={node.x}
                        y={node.y + (isMainElement ? 35 : 30)}
                        textAnchor="middle"
                        className={`text-xs font-medium fill-current ${
                          isMainElement ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {node.name}
                      </text>

                      {/* Type subtitle for main element */}
                      {isMainElement && (
                        <text
                          x={node.x}
                          y={node.y + 45}
                          textAnchor="middle"
                          className="text-xs fill-current text-muted-foreground"
                        >
                          {node.type.charAt(0).toUpperCase() +
                            node.type.slice(1)}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          {/* Connection Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm mb-2">Connected Elements</h4>
              <div className="space-y-1">
                {connections.map((conn, index) => {
                  const match = conn.trim().match(/^(.+?)\s*\((.+?)\)$/);
                  const name = match ? match[1].trim() : conn.trim();
                  const type = match ? match[2].toLowerCase() : "connected";

                  // Find the element to get proper styling
                  const foundElement = allElements.find(
                    (el) => el.name === name,
                  );
                  const elementStyle = getElementIcon(
                    foundElement?.type || "other",
                    foundElement?.category || "Other",
                  );

                  return (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm"
                    >
                      <elementStyle.icon
                        className="h-3 w-3"
                        style={{ color: elementStyle.color }}
                      />
                      <span>{name}</span>
                      <Badge variant="outline" className="text-xs">
                        {foundElement?.type || type}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm mb-2">Network Stats</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Total Connections:
                  </span>
                  <span className="font-medium">{connections.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Network Size:</span>
                  <span className="font-medium">
                    {connections.length > 0 ? connections.length + 1 : 0}{" "}
                    elements
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Element Type:</span>
                  <span className="font-medium">
                    {currentElement.type.charAt(0).toUpperCase() +
                      currentElement.type.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
