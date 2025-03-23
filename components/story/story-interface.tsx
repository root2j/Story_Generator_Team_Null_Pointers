"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Book, Sun, Moon, RotateCcw, Bookmark, ScrollText, Save } from 'lucide-react';
import { generateStoryOptions } from '@/lib/gemini';
import { useStoryStore } from '@/lib/story-context';
import StoryTimeline from './story-timeline';

export default function StoryInterface() {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [storyTitle, setStoryTitle] = useState<string>("");
  const [storyMoral, setStoryMoral] = useState<string>("");
  const [choiceCount, setChoiceCount] = useState(0);
  const [completeStory, setCompleteStory] = useState<string>("");
  const { theme, setTheme } = useTheme();
  
  const {
    currentScene, 
    characters,
    pastDecisions,
    addCharacter,
    setCurrentScene,
    reset,
    // New graph methods
    activeGraph,
    createNewGraph,
    getCurrentNode,
    addChoiceToCurrentNode,
    createSavePoint
  } = useStoryStore();

  // Auto-generate complete story text
  const generateCompleteStory = () => {
    const story = [
      `# ${storyTitle}`,
      "\n",
      currentScene,
      ...pastDecisions,
      "\n",
      `Moral: ${storyMoral}`
    ].join("\n\n");
    setCompleteStory(story);
  };

  const handleStart = async () => {
    setIsLoading(true);
    try {
      const initialScene = "In a world where reality bends to the power of choice, you awaken in an ancient garden. Crystalline fountains whisper secrets, and paths of golden light weave between towering trees whose leaves shimmer with otherworldly energy. The air itself seems alive with possibility...";
      
      // Create a new story graph
      const title = "The Garden of Infinite Paths";
      createNewGraph(title, initialScene);
      setStoryTitle(title);
      
      addCharacter("Protagonist");
      setChoiceCount(0);
      setCompleteStory("");
      
      const newOptions = await generateStoryOptions({
        characters,
        pastDecisions: [],
        significantEvents: [],
        currentScene: initialScene,
      });
      
      setOptions(newOptions);
    } catch (error) {
      console.error("Error starting story:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChoice = async (choice: string) => {
    setIsLoading(true);
    try {
      // Update choice count
      setChoiceCount(prev => prev + 1);
      
      // Generate new content based on the choice
      const newContent = choice + "\n\n" + (choiceCount >= 5 
        ? "You've reached the end of your journey. The path has led you to wisdom and understanding."
        : "The story continues as you make your choice...");
      
      // Add the choice to the current node, creating a new node with the content
      addChoiceToCurrentNode(choice, newContent);
      
      if (choiceCount >= 5) {
        setStoryMoral("In the garden of infinite paths, we learn that every choice, no matter how small, shapes the tapestry of our destiny.");
        setOptions([]);
        generateCompleteStory();
        return;
      }
      
      // Generate new options for the story
      const newOptions = await generateStoryOptions({
        characters,
        pastDecisions: [...pastDecisions, choice],
        significantEvents: [],
        currentScene: newContent,
      });
      
      setOptions(newOptions);
    } catch (error) {
      console.error("Error processing choice:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSavePoint = () => {
    if (!activeGraph) return;
    
    try {
      const savePoint = createSavePoint();
      console.log("Save point created:", savePoint);
      // Could show a toast notification here
    } catch (error) {
      console.error("Error creating save point:", error);
    }
  };

  const handleReset = () => {
    reset();
    setOptions([]);
    setStoryTitle("");
    setStoryMoral("");
    setChoiceCount(0);
    setCompleteStory("");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 grid gap-8 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Book className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">AI Story Generator</h1>
              {storyTitle && (
                <p className="text-muted-foreground text-lg">{storyTitle}</p>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            {activeGraph && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleCreateSavePoint}
                title="Create save point"
              >
                <Save className="h-5 w-5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleReset}
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Bookmark className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Current Chapter</h2>
              </div>
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-lg leading-relaxed">
                    {currentScene || "Ready to begin your adventure?"}
                  </p>
                  {storyMoral && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 bg-accent rounded-lg"
                    >
                      <h3 className="font-semibold mb-2">Moral of the Story</h3>
                      <p className="italic">{storyMoral}</p>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>

              <div className="mt-6 space-y-4">
                {!currentScene ? (
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleStart}
                    disabled={isLoading}
                  >
                    Begin Your Journey
                  </Button>
                ) : (
                  <AnimatePresence mode="wait">
                    <div className="grid gap-4">
                      {options.map((option, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Button
                            variant="outline"
                            className="w-full text-left h-auto py-4 px-6"
                            onClick={() => handleChoice(option)}
                            disabled={isLoading}
                          >
                            {option}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </AnimatePresence>
                )}
              </div>
            </Card>

            {completeStory && (
              <Card className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <ScrollText className="h-5 w-5" />
                  <h2 className="text-xl font-semibold">Complete Story</h2>
                </div>
                <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                  <div className="prose dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap">{completeStory}</div>
                  </div>
                </ScrollArea>
              </Card>
            )}
          </div>

          <StoryTimeline />
        </div>
      </div>
    </div>
  );
}