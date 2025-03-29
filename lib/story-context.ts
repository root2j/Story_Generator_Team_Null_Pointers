import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';
import { StoryGraph, StoryNode, StoryChoice, generateId, StorySavePoint } from './story-graph';

// Define the context interface for story state
export interface StoryContext {
  characters: string[];
  pastDecisions: string[];
  significantEvents: string[];
  currentScene: string;
}

// Export the interface
export interface StoryState extends StoryContext {
  addCharacter: (character: string) => void;
  addDecision: (decision: string) => void;
  addEvent: (event: string) => void;
  setCurrentScene: (scene: string) => void;
  reset: () => void;
  activeGraph: StoryGraph | null;
  savedGraphs: StoryGraph[];
  savePoints: StorySavePoint[];
  createNewGraph: (title: string, initialContent: string) => StoryGraph;
  loadGraph: (graphId: string) => void;
  saveCurrentGraph: () => void;
  getCurrentNode: () => StoryNode | null;
  addChoiceToCurrentNode: (choiceText: string, targetContent: string) => void;
  navigateToNode: (nodeId: string) => void;
  navigateByChoice: (choiceId: string) => void;
  createSavePoint: (description?: string) => StorySavePoint;
  loadSavePoint: (savePointId: string) => void;
  persistToLocalStorage: () => void;
}

const initialState: StoryContext = {
  characters: [],
  pastDecisions: [],
  significantEvents: [],
  currentScene: '',
};

const store = createStore<StoryState>()((set, get) => ({
  ...initialState,
  activeGraph: null,
  savedGraphs: [],
  savePoints: [],
  addCharacter: (character) =>
    set((state) => ({
      characters: [...state.characters, character],
    })),
  addDecision: (decision) =>
    set((state) => ({
      pastDecisions: [...state.pastDecisions, decision],
    })),
  addEvent: (event) =>
    set((state) => ({
      significantEvents: [...state.significantEvents, event],
    })),
  setCurrentScene: (scene) =>
    set(() => ({
      currentScene: scene,
    })),
  reset: () => set(initialState),
  createNewGraph: (title, initialContent) => {
    const rootNodeId = generateId();
    const newGraph: StoryGraph = {
      rootNodeId,
      nodes: {
        [rootNodeId]: {
          id: rootNodeId,
          content: initialContent,
          choices: [],
          metadata: {
            title,
            characters: get().characters,
            timestamp: Date.now()
          }
        }
      },
      currentNodeId: rootNodeId,
      visitedNodeIds: [rootNodeId],
      title,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    set((state) => ({
      activeGraph: newGraph,
      savedGraphs: [...state.savedGraphs, newGraph],
      currentScene: initialContent,
    }));
    
    localStorage.setItem('story-graphs', JSON.stringify([...get().savedGraphs, newGraph]));
    
    return newGraph;
  },
  loadGraph: (graphId) => {
    const { savedGraphs } = get();
    const graph = savedGraphs.find(g => g.rootNodeId === graphId);
    
    if (graph) {
      set({
        activeGraph: graph,
        currentScene: graph.nodes[graph.currentNodeId].content,
      });
      
      if (graph.nodes[graph.currentNodeId].metadata?.characters) {
        set({
          characters: graph.nodes[graph.currentNodeId].metadata?.characters || []
        });
      }
    }
  },
  saveCurrentGraph: () => {
    const { activeGraph, savedGraphs } = get();
    
    if (!activeGraph) return;
    
    const updatedGraph = {
      ...activeGraph,
      updatedAt: Date.now()
    };
    
    const updatedGraphs = savedGraphs.map(g => 
      g.rootNodeId === activeGraph.rootNodeId ? updatedGraph : g
    );
    
    set({
      activeGraph: updatedGraph,
      savedGraphs: updatedGraphs
    });
    
    localStorage.setItem('story-graphs', JSON.stringify(updatedGraphs));
  },
  getCurrentNode: () => {
    const { activeGraph } = get();
    if (!activeGraph) return null;
    
    return activeGraph.nodes[activeGraph.currentNodeId];
  },
  addChoiceToCurrentNode: (choiceText: string, targetContent: string): void => {
    const { activeGraph } = get();
    if (!activeGraph) return;
    
    const currentNode = activeGraph.nodes[activeGraph.currentNodeId];
    const newNodeId = generateId();
    const newChoiceId = generateId();
    
    const newChoice: StoryChoice = {
      id: newChoiceId,
      text: choiceText,
      targetNodeId: newNodeId
    };
    
    const newNode: StoryNode = {
      id: newNodeId,
      content: targetContent,
      choices: [],
      metadata: {
        characters: get().characters,
        timestamp: Date.now()
      }
    };
    
    const updatedNodes = {
      ...activeGraph.nodes,
      [currentNode.id]: {
        ...currentNode,
        choices: [...currentNode.choices, newChoice]
      },
      [newNodeId]: newNode
    };
    
    // Update activeGraph
    set({
      activeGraph: {
        ...activeGraph,
        nodes: updatedNodes,
        updatedAt: Date.now()
      }
    });
    
    // Also update savedGraphs with the new nodes
    set((state) => ({
      savedGraphs: state.savedGraphs.map(g => 
        g.rootNodeId === activeGraph.rootNodeId 
          ? {...g, nodes: updatedNodes} 
          : g
      )
    }));
  },
  navigateToNode: (nodeId: string): void => {
    const { activeGraph } = get();
    if (!activeGraph || !activeGraph.nodes[nodeId]) return;
    
    const updatedGraph = {
      ...activeGraph,
      currentNodeId: nodeId,
      visitedNodeIds: activeGraph.visitedNodeIds.includes(nodeId) 
        ? activeGraph.visitedNodeIds 
        : [...activeGraph.visitedNodeIds, nodeId],
      updatedAt: Date.now()
    };
    
    set({
      activeGraph: updatedGraph,
      currentScene: activeGraph.nodes[nodeId].content
    });
    
    // Synchronize with savedGraphs
    set((state) => ({
      savedGraphs: state.savedGraphs.map(g => 
        g.rootNodeId === activeGraph.rootNodeId ? updatedGraph : g
      )
    }));
  },
  navigateByChoice: (choiceId) => {
    const { activeGraph } = get();
    if (!activeGraph) return;
    
    const currentNode = activeGraph.nodes[activeGraph.currentNodeId];
    const choice = currentNode.choices.find((c: StoryChoice) => c.id === choiceId);
    
    if (choice) {
      get().navigateToNode(choice.targetNodeId);
      
      set((state) => ({
        pastDecisions: [...state.pastDecisions, choice.text]
      }));
    }
  },
  createSavePoint: (description?) => {
    const { activeGraph } = get();
    if (!activeGraph) throw new Error("No active story to save");
    
    const currentNode = activeGraph.nodes[activeGraph.currentNodeId];
    const savePoint: StorySavePoint = {
      graphId: activeGraph.rootNodeId,
      nodeId: currentNode.id,
      timestamp: Date.now(),
      previewText: description || currentNode.content.substring(0, 100) + '...'
    };
    
    set((state) => ({
      savePoints: [...state.savePoints, savePoint]
    }));
    
    localStorage.setItem('story-save-points', JSON.stringify(get().savePoints));
    
    return savePoint;
  },
  loadSavePoint: (savePointId: string): void => {
    const { savePoints, savedGraphs } = get();
    
    // Find the save point by any valid identifier
    const savePoint = savePoints.find(sp => 
      sp.graphId === savePointId || sp.nodeId === savePointId
    );
    
    if (!savePoint) {
      console.error('Save point not found:', savePointId);
      return;
    }
    
    // Find the graph
    const graph = savedGraphs.find(g => g.rootNodeId === savePoint.graphId);
    
    if (!graph) {
      console.error('Graph not found for save point:', savePoint);
      return;
    }
    
    // Ensure node exists in graph
    if (!graph.nodes[savePoint.nodeId]) {
      console.error(`Node ${savePoint.nodeId} not found in graph ${savePoint.graphId}`);
      return;
    }
    
    // Set the state
    set({
      activeGraph: {
        ...graph,
        currentNodeId: savePoint.nodeId
      },
      currentScene: graph.nodes[savePoint.nodeId].content
    });
  },
  persistToLocalStorage: () => {
    const { savedGraphs, savePoints } = get();
    
    if (typeof window !== 'undefined') {
      // Save graphs
      localStorage.setItem('story-graphs', JSON.stringify(savedGraphs));
      
      // Save points
      localStorage.setItem('story-save-points', JSON.stringify(savePoints));
    }
  }
}));

// Initialize from localStorage if available
if (typeof window !== 'undefined') {
  try {
    const savedGraphsJSON = localStorage.getItem('story-graphs');
    if (savedGraphsJSON) {
      const savedGraphs = JSON.parse(savedGraphsJSON);
      store.setState({ savedGraphs });
    }
    
    const savePointsJSON = localStorage.getItem('story-save-points');
    if (savePointsJSON) {
      const savePoints = JSON.parse(savePointsJSON);
      store.setState({ savePoints });
    }
  } catch (e) {
    console.error('Error loading saved stories:', e);
  }
}

export const useStoryStore = () => useStore(store);