// Basic types for the story graph
export interface StoryNode {
    id: string;
    content: string;
    choices: StoryChoice[];
    metadata?: {
      title?: string;
      isEnding?: boolean;
      characters?: string[];
      location?: string;
      timestamp?: number;
    };
  }
  
  export interface StoryChoice {
    id: string;
    text: string;
    targetNodeId: string;
  }
  
  export interface StoryGraph {
    rootNodeId: string;
    nodes: Record<string, StoryNode>;
    currentNodeId: string;
    visitedNodeIds: string[];
    title: string;
    createdAt: number;
    updatedAt: number;
  }
  
  export interface StorySavePoint {
    graphId: string;
    nodeId: string;
    timestamp: number;
    previewText: string;
  }
  
  // Unique ID generation utility
  export function generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }