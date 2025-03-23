"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Wand2,
  Users,
  PenTool,
  Settings,
  Share2,
  Save,
  Download,
  Sparkles,
  Loader2
} from "lucide-react";
import StoryBasics from "@/components/create/story-basics";
import CharacterBuilder from "@/components/create/character-builder";
import SceneComposer from "@/components/create/scene-composer";
import StoryPreview from "@/components/create/story-preview";
import PublishOptions from "@/components/create/publish-options";
import { generateStory } from "@/lib/gemini";
import { toast } from "sonner";

interface Character {
  name: string;
  role: string;
}

interface Story {
  title: string;
  genre: string;
  type: string;
  ageGroup: string;
  tone: string;
  synopsis: string;
  characters: Character[];
  scenes: any[];
  content: string;
}


export default function CreateStory() {
  const [activeTab, setActiveTab] = useState("basics");
  const [progress, setProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [story, setStory] = useState<Story>({
    title: "",
    genre: "",
    type: "",
    ageGroup: "",
    tone: "",
    synopsis: "",
    characters: [] as Character[],
    scenes: [],
    content: ""
  });


  const handleSave = () => {
    // Calculate progress based on filled fields
    const totalFields = Object.keys(story).length;
    const filledFields = Object.entries(story).filter(([key, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== "";
    }).length;

    const newProgress = Math.round((filledFields / totalFields) * 100);
    setProgress(newProgress);

    toast.success(
      `Your story is ${newProgress}% complete.`,
    );
  };

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);

      const prompt = `
        Create a ${story.genre} ${story.type} for ${story.ageGroup} with a ${story.tone} tone.
        Title: ${story.title}
        Synopsis: ${story.synopsis}
        Characters: ${story.characters.map(c => `${c.name} - ${c.role}`).join(', ')}
        Scenes: ${story.scenes.map(s => s.title).join(', ')}
      `;

      const generatedContent = await generateStory(prompt);
      setStory(prev => ({ ...prev, content: generatedContent }));

      toast.success("Your AI-generated story is ready to preview.");
    } catch (error) {
      toast("Failed to generate story. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full bg-background p-6">
      <div className="w-full mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-foreground">Create Your Story</h1>
          <div className="flex gap-4">
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Story Progress</span>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full px-4">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="basics" className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Basics
                </TabsTrigger>
                <TabsTrigger value="characters">
                  <Users className="w-4 h-4 mr-2" />
                  Characters
                </TabsTrigger>
                <TabsTrigger value="scenes">
                  <PenTool className="w-4 h-4 mr-2" />
                  Scenes
                </TabsTrigger>
                <TabsTrigger value="ai">
                  <Wand2 className="w-4 h-4 mr-2" />
                  AI Assist
                </TabsTrigger>
                <TabsTrigger value="publish">
                  <Settings className="w-4 h-4 mr-2" />
                  Publish
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="h-full] p-6">
                <TabsContent value="basics">
                  <StoryBasics story={story} setStory={setStory} />
                </TabsContent>
                <TabsContent value="characters">
                  <CharacterBuilder story={story} setStory={setStory} />
                </TabsContent>
                <TabsContent value="scenes">
                  <SceneComposer story={story} setStory={setStory} />
                </TabsContent>
                <TabsContent value="ai">
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <h2 className="text-2xl font-semibold">AI Writing Assistant</h2>
                    </div>
                    <p className="text-muted-foreground">
                      Let our AI help you generate a complete story based on your input.
                      Make sure you've filled in the basic details, characters, and scenes
                      for the best results.
                    </p>
                    <Button
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating Story...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-4 h-4 mr-2" />
                          Generate Story
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="publish">
                  <PublishOptions />
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </Card>

          <Card className="h-full">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Story Preview</h2>
            </div>
            <ScrollArea className="h-full p-4">
              <StoryPreview story={story} />
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
}