"use client";

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Wand2, Save, CornerDownRight, Sparkles, GitGraph } from 'lucide-react';
import Link from 'next/link';
import { useStoryStore } from '@/lib/story-context';
import StoryGraphVisualization from '@/components/story/story-graph-visualization';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import '@xyflow/react/dist/style.css';
import { generateStory, generateStoryOptions, StoryContext } from '@/lib/gemini';

export default function CreateStory() {
  const {
    activeGraph,
    createNewGraph,
    getCurrentNode,
    addChoiceToCurrentNode,
    navigateToNode,
    navigateByChoice,
    createSavePoint,
    pastDecisions,
    addCharacter,
    characters
  } = useStoryStore();

  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [customChoice, setCustomChoice] = useState('');
  const [storyStarted, setStoryStarted] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  // Get the current node in the story graph
  const currentNode = getCurrentNode();

  // Generate AI story templates
  const generateRandomStory = async () => {
    setLoadingTemplates(true);
    
    try {
      const templatePrompt = `
        Generate a creative story starter with a title and an intriguing opening paragraph.
        Format the response as follows:
        TITLE: [The title of the story]
        OPENING: [A vivid opening paragraph that sets the scene and invites the reader into the story world]
        
        Make it imaginative and engaging. Choose from genres like fantasy, sci-fi, mystery, or adventure.
      `;
      
      const response = await generateStory(templatePrompt);
      const titleMatch = response.match(/TITLE:\s*(.*)/i);
      const openingMatch = response.match(/OPENING:\s*([\s\S]*)/i);
      
      if (titleMatch && titleMatch[1] && openingMatch && openingMatch[1]) {
        setTitle(titleMatch[1].trim());
        setPrompt(openingMatch[1].trim());
      } else {
        // Fallback in case parsing fails
        setTitle("The Unexpected Journey");
        setPrompt("In a world where nothing is as it seems, you find yourself standing at a crossroads of destiny.");
      }
    } catch (error) {
      console.error("Error generating story template:", error);
      // Fallback
      setTitle("The Mysterious Discovery");
      setPrompt("You stumble upon something unusual that defies explanation, setting you on a path of discovery.");
    } finally {
      setLoadingTemplates(false);
    }
  };

  // Start the story generation process
  const handleGenerate = async () => {
    if (!title || !prompt) return;
    
    setGenerating(true);
    
    try {
      // Create a new story graph with the provided title and prompt
      createNewGraph(title, prompt);
      
      // Add protagonist character
      addCharacter("Protagonist");
      
      // Generate AI choices using Gemini
      const context: StoryContext = {
        characters,
        pastDecisions: [],
        significantEvents: [],
        currentScene: prompt
      };
      
      const choices = await generateStoryOptions(context);
      
      // Generate content for each choice
      for (const choice of choices) {
        const choiceContent = await generateStory(`
          Given this starting scenario:
          "${prompt}"
          
          The protagonist chooses to: "${choice}"
          
          Write a short paragraph describing what happens next (about 2-3 sentences).
        `);
        
        addChoiceToCurrentNode(choice, choiceContent);
      }
      
      setStoryStarted(true);
    } catch (error) {
      console.error("Error generating story:", error);
    } finally {
      setGenerating(false);
    }
  };

  // Handle when the user selects a predefined choice
  const handleChoiceSelection = async (choiceId: string) => {
    setGenerating(true);
    
    try {
      // Navigate to the new story node based on the choice
      navigateByChoice(choiceId);
      
      // Get the current node after navigation
      const node = getCurrentNode();
      if (!node) return;
      
      // Generate new AI choices
      const context: StoryContext = {
        characters,
        pastDecisions,
        significantEvents: [],
        currentScene: node.content
      };
      
      const choices = await generateStoryOptions(context);
      
      // Generate content for each choice
      for (const choice of choices) {
        const choiceContent = await generateStory(`
          Given this current situation:
          "${node.content}"
          
          And the protagonist chooses to: "${choice}"
          
          Write a short paragraph describing what happens next (about 2-3 sentences).
        `);
        
        addChoiceToCurrentNode(choice, choiceContent);
      }
    } catch (error) {
      console.error("Error selecting choice:", error);
    } finally {
      setGenerating(false);
    }
  };

  // Handle when the user enters a custom choice
  const handleCustomChoice = async () => {
    if (!customChoice) return;
    
    setGenerating(true);
    
    try {
      const node = getCurrentNode();
      if (!node) return;
      
      // Generate a response to the custom choice using AI
      const response = await generateStory(`
        Given this current situation:
        "${node.content}"
        
        And the protagonist chooses to: "${customChoice}"
        
        Write a short paragraph describing what happens next (about 2-3 sentences).
      `);
      
      // Add the choice to the current node and navigate to the new node
      addChoiceToCurrentNode(customChoice, response);
      navigateByChoice(node.choices[node.choices.length - 1].id);
      
      // Generate new AI choices for the new node
      const newNode = getCurrentNode();
      if (!newNode) return;
      
      const context: StoryContext = {
        characters,
        pastDecisions: [...pastDecisions, customChoice],
        significantEvents: [],
        currentScene: newNode.content
      };
      
      const choices = await generateStoryOptions(context);
      
      // Generate content for each choice
      for (const choice of choices) {
        const choiceContent = await generateStory(`
          Given this current situation:
          "${newNode.content}"
          
          And the protagonist chooses to: "${choice}"
          
          Write a short paragraph describing what happens next (about 2-3 sentences).
        `);
        
        addChoiceToCurrentNode(choice, choiceContent);
      }
      
      setCustomChoice('');
    } catch (error) {
      console.error("Error processing custom choice:", error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Wand2 className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-semibold">{storyStarted ? title : "Create New Story"}</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {storyStarted && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowGraph(!showGraph)}
                  >
                    <GitGraph className="h-4 w-4 mr-2" />
                    {showGraph ? "Hide Graph" : "Show Graph"}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => createSavePoint()}
                  >
                    <Save className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {!storyStarted ? (
            <Card className="p-6 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Create a New Story</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Story Title</label>
                  <Input 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a title for your story"
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Story Prompt</label>
                  <Textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the starting scenario for your story..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={generateRandomStory}
                  className="gap-2"
                  disabled={loadingTemplates}
                >
                  {loadingTemplates ? (
                    <>
                      <Sparkles className="h-4 w-4 animate-spin" />
                      Generating Ideas...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Inspire Me
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={handleGenerate}
                  disabled={!title || !prompt || generating || loadingTemplates}
                  className="gap-2"
                >
                  {generating ? (
                    <>
                      <Wand2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4" />
                      Generate Story
                    </>
                  )}
                </Button>
              </div>
            </Card>
          ) : (
            <div className={`grid ${showGraph ? 'lg:grid-cols-2' : 'grid-cols-1'} gap-6 ${showGraph ? 'max-w-none' : 'max-w-3xl mx-auto'}`}>
              {/* Story content and choices */}
              <Card className="border shadow-sm">
                <ScrollArea className="h-[calc(100vh-220px)] rounded-md">
                  <div className="p-6">
                    {generating ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-pulse text-center">
                          <Wand2 className="w-8 h-8 mx-auto mb-4 text-primary" />
                          <p>Generating story...</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {pastDecisions.length > 0 && (
                          <div className="bg-muted/50 p-3 rounded-md text-sm text-muted-foreground">
                            <div className="font-medium mb-2">Your journey so far:</div>
                            <ul className="list-disc pl-5 space-y-1">
                              {pastDecisions.map((decision, index) => (
                                <li key={index}>{decision}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div className="prose dark:prose-invert">
                          <p>{currentNode?.content || prompt}</p>
                        </div>
                        
                        <div className="border-t pt-6">
                          <h3 className="text-lg font-medium mb-4">What will you do next?</h3>
                          
                          {currentNode?.choices && currentNode.choices.length > 0 && (
                            <div className="space-y-2 mb-6">
                              {currentNode.choices.map((choice) => (
                                <Button
                                  key={choice.id}
                                  variant="outline"
                                  className="w-full justify-start text-left"
                                  onClick={() => handleChoiceSelection(choice.id)}
                                  disabled={generating}
                                >
                                  <CornerDownRight className="w-4 h-4 mr-2 flex-shrink-0" />
                                  <span>{choice.text}</span>
                                </Button>
                              ))}
                            </div>
                          )}
                          
                          <div className="pt-4 border-t">
                            <label className="text-sm font-medium mb-2 block">Write your own action:</label>
                            <div className="flex gap-2">
                              <Input
                                value={customChoice}
                                onChange={(e) => setCustomChoice(e.target.value)}
                                placeholder="Enter your own action..."
                                disabled={generating}
                                className="flex-1"
                              />
                              <Button 
                                onClick={handleCustomChoice} 
                                disabled={generating || !customChoice}
                                variant="default"
                              >
                                Continue
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </Card>

              {/* Story graph visualization */}
              {showGraph && (
                <Card className="p-4 border shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Story Graph</h3>
                    <Badge variant="outline" className="text-xs">
                      {Object.keys(activeGraph?.nodes || {}).length} nodes
                    </Badge>
                  </div>
                  <div className="h-[calc(100vh-280px)] w-full flex items-center justify-center bg-muted/30 rounded-md">
                    <div className="text-center p-6">
                      <GitGraph className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-xl font-medium mb-2">Work in Progress</h3>
                      <p className="text-muted-foreground">Story graph visualization coming soon...</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
} 