"use client";

import { motion } from 'framer-motion';
import { useStoryStore } from '@/lib/story-context';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GitBranch, GitFork, ArrowRight, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StoryTimeline() {
  const { 
    pastDecisions, 
    activeGraph, 
    navigateToNode, 
    savePoints, 
    loadSavePoint 
  } = useStoryStore();

  // Fall back to old system if graph not available
  if (!activeGraph && pastDecisions.length === 0) return null;

  // If we have a graph, render it
  if (activeGraph) {
    const currentNodeId = activeGraph.currentNodeId;
    const visitedNodes = activeGraph.visitedNodeIds;
    
    // Get list of save points for this story
    const storySpecificSavePoints = savePoints.filter(
      sp => sp.graphId === activeGraph.rootNodeId
    );
    
    return (
      <Card className="p-6 h-full">
        <div className="flex items-center space-x-2 mb-4">
          <GitBranch className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Story Map</h2>
          <span className="ml-auto text-sm text-muted-foreground">
            {visitedNodes.length} nodes explored
          </span>
        </div>
        
        <ScrollArea className="h-[calc(100vh-20rem)]">
          {/* Visualize the story graph */}
          <div className="space-y-6 pr-4">
            {/* Save Points Section */}
            {storySpecificSavePoints.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2 text-muted-foreground">Save Points</h3>
                <div className="space-y-2">
                  {storySpecificSavePoints.map((savePoint, index) => (
                    <Button 
                      key={index}
                      variant="ghost" 
                      size="sm"
                      className="w-full justify-start text-left"
                      onClick={() => loadSavePoint(savePoint.graphId)}
                    >
                      <div className="flex items-center">
                        <Bookmark className="h-4 w-4 mr-2" />
                        <div>
                          <div className="font-medium truncate w-48">
                            {savePoint.previewText.substring(0, 30)}...
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(savePoint.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Story Path */}
            <div>
              <h3 className="text-sm font-medium mb-2 text-muted-foreground">Your Journey</h3>
              <div className="space-y-4">
                {visitedNodes.map((nodeId, index) => {
                  const node = activeGraph.nodes[nodeId];
                  const isCurrentNode = nodeId === currentNodeId;
                  
                  if (!node) return null;
                  
                  // Find which choice led to this node (except for the root)
                  let originChoice = null;
                  let originNode = null;
                  
                  if (nodeId !== activeGraph.rootNodeId) {
                    // Search through all nodes to find which one points to this node
                    for (const [originId, node] of Object.entries(activeGraph.nodes)) {
                      const choice = node.choices.find(c => c.targetNodeId === nodeId);
                      if (choice) {
                        originChoice = choice;
                        originNode = node;
                        break;
                      }
                    }
                  }
                  
                  return (
                    <motion.div
                      key={nodeId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative"
                    >
                      <div className="flex items-start space-x-4">
                        <div 
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-medium
                            ${isCurrentNode 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted text-muted-foreground'}`
                          }
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          {originChoice && (
                            <div className="mb-2 flex items-center text-sm text-muted-foreground">
                              <ArrowRight className="h-3 w-3 mr-1" />
                              <span className="italic">"{originChoice.text}"</span>
                            </div>
                          )}
                          
                          <div 
                            className={`p-4 rounded-lg ${
                              isCurrentNode 
                                ? 'bg-primary/10 border border-primary/20' 
                                : 'bg-muted cursor-pointer hover:bg-muted/80'
                            }`}
                            onClick={() => !isCurrentNode && navigateToNode(nodeId)}
                          >
                            <p className="leading-relaxed line-clamp-2">{node.content.split('\n')[0]}</p>
                          </div>
                          
                          {/* Show branch indicator if this node has multiple choices */}
                          {node.choices.length > 1 && (
                            <div className="mt-2 flex justify-start">
                              <div className="inline-flex items-center text-xs text-muted-foreground">
                                <GitFork className="h-3 w-3 mr-1" />
                                <span>{node.choices.length} branches</span>
                              </div>
                            </div>
                          )}
                          
                          {index !== visitedNodes.length - 1 && (
                            <div className="absolute left-4 top-8 w-[2px] h-8 bg-border" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollArea>
      </Card>
    );
  }
  
  // Fall back to original rendering if we're using the old system
  return (
    <Card className="p-6 h-full">
      <div className="flex items-center space-x-2 mb-4">
        <GitBranch className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Story Branches</h2>
        <span className="ml-auto text-sm text-muted-foreground">
          {pastDecisions.length} of 6 choices
        </span>
      </div>
      <ScrollArea className="h-[calc(100vh-20rem)]">
        <div className="space-y-4 pr-4">
          {pastDecisions.map((decision, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="leading-relaxed">{decision}</p>
                  </div>
                  {index !== pastDecisions.length - 1 && (
                    <div className="absolute left-4 top-8 w-[2px] h-8 bg-border" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}