"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStoryStore } from '@/lib/story-context';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { 
  Bookmark,
  Clock,
  Trash2,
  ChevronRight
} from 'lucide-react';

export default function SavePoints() {
  const { savePoints, loadSavePoint, savedGraphs } = useStoryStore();
  const [selectedSavePoint, setSelectedSavePoint] = useState<string | null>(null);

  if (savePoints.length === 0) {
    return (
      <Card className="p-6 flex flex-col items-center justify-center h-64">
        <Bookmark className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No Save Points Yet</h3>
        <p className="text-center text-muted-foreground max-w-md">
          Create save points during your storytelling journey to come back to specific moments later.
        </p>
      </Card>
    );
  }

  // Group save points by story
  const savePointsByStory = savePoints.reduce((acc, savePoint) => {
    const story = savedGraphs.find(g => g.rootNodeId === savePoint.graphId);
    const storyTitle = story?.title || 'Unknown Story';
    
    if (!acc[storyTitle]) {
      acc[storyTitle] = [];
    }
    
    acc[storyTitle].push(savePoint);
    return acc;
  }, {} as Record<string, typeof savePoints>);

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Bookmark className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Save Points</h2>
      </div>
      
      <ScrollArea className="h-[500px] w-full">
        <div className="space-y-6">
          {Object.entries(savePointsByStory).map(([storyTitle, storyPoints]) => (
            <div key={storyTitle} className="space-y-3">
              <h3 className="font-medium text-lg">{storyTitle}</h3>
              
              <div className="space-y-2">
                {storyPoints.map((savePoint, index) => {
                  const isSelected = selectedSavePoint === savePoint.graphId;
                  
                  return (
                    <motion.div
                      key={`${savePoint.graphId}-${savePoint.nodeId}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div 
                        className={`p-3 rounded-md border ${isSelected ? 'border-primary bg-primary/5' : 'border-border bg-card'} 
                                  hover:border-primary/50 cursor-pointer transition-colors`}
                        onClick={() => setSelectedSavePoint(savePoint.graphId)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Clock className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{savePoint.previewText.slice(0, 50)}...</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(savePoint.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Delete save point functionality
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                            </Button>
                          </div>
                        </div>
                        
                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-3 pt-3 border-t"
                          >
                            <Button 
                              className="w-full"
                              onClick={() => loadSavePoint(savePoint.graphId)}
                            >
                              Continue from this point
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
} 