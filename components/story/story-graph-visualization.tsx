"use client";

import { useCallback } from 'react';
import { StoryGraph, StoryNode } from '@/lib/story-graph';
import { useTheme } from 'next-themes';
import {
  ReactFlow,
  Background,
  Controls,
  ConnectionLineType,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

/**
 * New custom node component rendered as a simple sphere.
 * - Colors are determined based on the node type:
 *    - Root node: blue
 *    - Current node: green
 *    - Other nodes: gray
 * - On click, it calls the onClick callback (passed via node data)
 *   so that the parent can show a detailed panel.
 */
const SimpleSphere = ({ data }: { data: any }) => {
  const { theme } = useTheme();
  
  // Theme-aware colors
  let backgroundColor = theme === 'dark' ? 'hsl(var(--muted))' : 'hsl(var(--muted-foreground))';
  if (data.isRoot) {
    backgroundColor = 'hsl(var(--primary))';
  } else if (data.isCurrent) {
    backgroundColor = 'hsl(var(--secondary))';
  }

  return (
    <div
      style={{
        width: 60,
        height: 60,
        backgroundColor,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }}
      onClick={(e) => {
        // Prevent event propagation so that ReactFlow doesn't handle it as a generic node click.
        e.stopPropagation();
        if (data.onClick) data.onClick(data.id);
      }}
    >
      {/* Display a short label, for example the first few characters of the summary */}
      <span style={{ color: 'hsl(var(--background))' }}>{data.shortLabel}</span>
    </div>
  );
};

const nodeTypes = {
  simpleSphere: SimpleSphere,
};

function layoutElements(graph: StoryGraph, rootId: string, direction: 'TB' | 'LR') {
  const nodeWidth = 60;
  const nodeHeight = 60;
  const spacing = direction === 'TB' ? { x: 100, y: 120 } : { x: 120, y: 100 };
  
  const nodes: any[] = [];
  const edges: any[] = [];
  const nodesByLevel: Record<number, string[]> = {};
  
  // BFS to compute levels
  const queue = [{ id: rootId, level: 0 }];
  const visited = new Set([rootId]);
  
  while (queue.length > 0) {
    const { id, level } = queue.shift()!;
    if (!nodesByLevel[level]) nodesByLevel[level] = [];
    nodesByLevel[level].push(id);
    
    const node = graph.nodes[id];
    for (const choice of node.choices) {
      if (!visited.has(choice.targetNodeId)) {
        visited.add(choice.targetNodeId);
        queue.push({ id: choice.targetNodeId, level: level + 1 });
      }
    }
  }

  // Position nodes
  Object.entries(nodesByLevel).forEach(([levelStr, nodeIds]) => {
    const level = Number(levelStr);
    const isVertical = direction === 'TB';
    const dimension = isVertical ? nodeIds.length : level;
    const offset = isVertical 
      ? -(nodeIds.length * (nodeWidth + spacing.x)) / 2
      : -(level * (nodeHeight + spacing.y)) / 2;

    nodeIds.forEach((id, index) => {
      const node = graph.nodes[id];
      const position = isVertical
        ? {
            x: offset + index * (nodeWidth + spacing.x),
            y: level * spacing.y,
          }
        : {
            x: level * spacing.x,
            y: offset + index * (nodeHeight + spacing.y),
          };

      nodes.push({
        id,
        type: 'simpleSphere',
        position,
        data: {
          id: node.id,
          shortLabel: node.content.substring(0, 10),
          isRoot: node.id === graph.rootNodeId,
          isCurrent: node.id === graph.currentNodeId,
          onClick: (nodeId: string) => {
            // Handle click
          },
        },
      });

      // Create edges
      node.choices.forEach((choice) => {
        edges.push({
          id: `${node.id}-${choice.targetNodeId}`,
          source: node.id,
          target: choice.targetNodeId,
          type: ConnectionLineType.SmoothStep,
          animated: node.id === graph.currentNodeId,
        });
      });
    });
  });

  return { nodes, edges };
}

/**
 * Flow Component
 * - Converts StoryGraph data to ReactFlow nodes and edges.
 * - Uses a BFS approach to compute node levels and positions.
 * - Maintains a selected node state to show a detailed panel when a node is clicked.
 */
function Flow({ graph }: { graph: StoryGraph }) {
  const { theme } = useTheme();
  const { nodes: layoutedNodes, edges: layoutedEdges } = layoutElements(graph, graph.rootNodeId, 'TB');
  
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds: any) => 
      addEdge({ ...params, type: ConnectionLineType.SmoothStep, animated: true }, eds)
    ), []
  );

  const onLayout = useCallback((direction: 'TB' | 'LR') => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = layoutElements(graph, graph.rootNodeId, direction);
    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);
  }, [graph, setNodes, setEdges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      connectionLineType={ConnectionLineType.SmoothStep}
      nodeTypes={nodeTypes}
      fitView
      style={{ backgroundColor: 'hsl(var(--background))' }}
      className="[&_.react-flow__controls]:bg-background [&_.react-flow__controls]:border-border [&_.react-flow__controls-button]:text-foreground [&_.react-flow__controls-button]:hover:bg-muted"
    >
      <Panel position="top-right" className="flex gap-2">
        <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1 rounded-md text-sm" 
                onClick={() => onLayout('TB')}>Vertical</button>
        <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1 rounded-md text-sm" 
                onClick={() => onLayout('LR')}>Horizontal</button>
      </Panel>
      <Background 
        variant={BackgroundVariant.Dots} 
        gap={16} 
        color="hsl(var(--muted-foreground))" 
        style={{ opacity: 0.4 }} 
      />
      <Controls showInteractive={false} />
    </ReactFlow>
  );
}

/**
 * StoryGraphVisualization Component
 * - Wraps the Flow component with ReactFlowProvider.
 * - Provides a container for the flow and handles the case where no graph is provided.
 */
export default function StoryGraphVisualization({
  graph,
  className = "",
}: {
  graph: StoryGraph | null;
  className?: string;
}) {
  if (!graph) {
    return <div className="text-center p-4 text-muted-foreground">No story graph available</div>;
  }
  
  return (
    <div className={`relative ${className}`}>
      <div className="bg-muted/20 rounded-lg border border-border h-[500px]">
        <Flow graph={graph} />
      </div>
    </div>
  );
}

