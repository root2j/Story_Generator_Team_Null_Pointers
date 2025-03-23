"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

import { BookOpen, Sparkles, Moon, Sun, Save, Share2, Download, RefreshCw, Book } from "lucide-react";
import { useTheme } from "next-themes";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { marked } from "marked";
import { saveAs } from 'file-saver';
import { BookPreview } from "../createprompt/components/bookepreview";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

const storyTypes = [
  { value: "fiction", label: "Fiction" },
  { value: "fantasy", label: "Fantasy" },
  { value: "scifi", label: "Sci-Fi" },
  { value: "horror", label: "Horror" },
  { value: "mystery", label: "Mystery" },
  { value: "adventure", label: "Adventure" }
];

const ageGroups = [
  { value: "kids", label: "Kids" },
  { value: "teens", label: "Teens" },
  { value: "adults", label: "Adults" },
  { value: "general", label: "General Audience" }
];

const writingStyles = [
  { value: "poetic", label: "Poetic" },
  { value: "descriptive", label: "Descriptive" },
  { value: "concise", label: "Concise" },
  { value: "dialogue", label: "Dialogue-Driven" }
];

const tabs = ["story", "audience", "style"];

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("story");
  const [progress, setProgress] = useState(0);
  const [storyType, setStoryType] = useState("");
  const [storyPrompt, setStoryPrompt] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [writingStyle, setWritingStyle] = useState("");
  const [complexity, setComplexity] = useState([50]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStory, setGeneratedStory] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isBookOpen, setIsBookOpen] = useState(false);

  const handleSave = (currentTab: string) => {
    const currentTabIndex = tabs.indexOf(currentTab);
    const nextTab = tabs[currentTabIndex + 1];

    if (nextTab) {
      setActiveTab(nextTab);
    }

    const newProgress = Math.min(100, progress + 25);
    setProgress(newProgress);
  };

  const generatePrompt = () => {
    return `
      Create a ${storyType} story with the following specifications:
      - Target audience: ${ageGroup}
      - Writing style: ${writingStyle}
      - Complexity level: ${complexity[0]}%
      - Story prompt: ${storyPrompt}
      
      Please write an engaging and immersive story that follows these guidelines.
      Format the story with proper paragraphs and dialogue formatting.
      Make it creative and unique.
    `;
  };

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      setProgress(75);

      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
      const prompt = generatePrompt();

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const formattedStory = marked(response.text());

      setGeneratedStory(formattedStory as string);
      setProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate story. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'My Generated Story',
        text: generatedStory.replace(/<[^>]*>/g, ''),
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([generatedStory.replace(/<[^>]*>/g, '')], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `story_${new Date().toISOString().slice(0, 10)}.txt`);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/5 via-background to-primary/5 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
              AI Story Creator
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full hover:bg-primary/10"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6 backdrop-blur-sm bg-card/50 border-primary/20 shadow-lg shadow-primary/5">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid grid-cols-3 gap-4 p-1 bg-muted/50">
                <TabsTrigger value="story">Story Type</TabsTrigger>
                <TabsTrigger value="audience">Audience</TabsTrigger>
                <TabsTrigger value="style">Style</TabsTrigger>
              </TabsList>

              <TabsContent value="story" className="space-y-4">
                <div className="space-y-4">
                  <Label>Select Story Type</Label>
                  <Select value={storyType} onValueChange={setStoryType}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Choose a story type" />
                    </SelectTrigger>
                    <SelectContent>
                      {storyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="space-y-2">
                    <Label>Story Prompt</Label>
                    <Textarea
                      placeholder="Describe the story you want to create..."
                      value={storyPrompt}
                      onChange={(e) => setStoryPrompt(e.target.value)}
                      className="h-32 bg-background/50"
                    />
                  </div>
                  <Button
                    onClick={() => handleSave("story")}
                    className="w-full bg-primary/90 hover:bg-primary"
                    disabled={!storyType || !storyPrompt}
                  >
                    <Save className="mr-2 h-4 w-4" /> Save & Continue
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="audience" className="space-y-4">
                <div className="space-y-4">
                  <Label>Target Age Group</Label>
                  <Select value={ageGroup} onValueChange={setAgeGroup}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Select age group" />
                    </SelectTrigger>
                    <SelectContent>
                      {ageGroups.map((group) => (
                        <SelectItem key={group.value} value={group.value}>
                          {group.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={() => handleSave("audience")}
                    className="w-full bg-primary/90 hover:bg-primary"
                    disabled={!ageGroup}
                  >
                    <Save className="mr-2 h-4 w-4" /> Save & Continue
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="style" className="space-y-4">
                <div className="space-y-4">
                  <Label>Writing Style</Label>
                  <Select value={writingStyle} onValueChange={setWritingStyle}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Choose writing style" />
                    </SelectTrigger>
                    <SelectContent>
                      {writingStyles.map((style) => (
                        <SelectItem key={style.value} value={style.value}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="space-y-2">
                    <Label>Story Complexity</Label>
                    <Slider
                      value={complexity}
                      onValueChange={setComplexity}
                      max={100}
                      step={1}
                      className="py-4"
                    />
                  </div>
                  <Button
                    onClick={() => handleSave("style")}
                    className="w-full bg-primary/90 hover:bg-primary"
                    disabled={!writingStyle}
                  >
                    <Save className="mr-2 h-4 w-4" /> Save Selection
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <Label>Progress</Label>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <Button
                className="w-full bg-gradient-to-r from-primary/90 via-primary to-primary/90 hover:from-primary hover:to-primary text-primary-foreground shadow-lg"
                onClick={handleGenerate}
                disabled={isGenerating || progress < 75}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {isGenerating ? "Generating Story..." : "Generate Story"}
              </Button>
            </div>
          </Card>

          <Card className="p-6 backdrop-blur-sm bg-card/50 border-primary/20 shadow-lg shadow-primary/5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Story Preview</h2>
                {generatedStory && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsBookOpen(true)}
                      className="text-xs"
                    >
                      <Book className="h-3 w-3 mr-1" />
                      Read
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="text-xs"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Regenerate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      className="text-xs"
                    >
                      <Share2 className="h-3 w-3 mr-1" />
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownload}
                      className="text-xs"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
              <ScrollArea className="h-[500px] rounded-md border p-4 bg-background/50">
                {error ? (
                  <div className="text-red-500 p-4 rounded-md bg-red-50 dark:bg-red-950/50">
                    {error}
                  </div>
                ) : generatedStory ? (
                  <div
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: generatedStory }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Your story will appear here...
                  </div>
                )}
              </ScrollArea>
            </div>
          </Card>
        </div>
      </div>

      <BookPreview
        content={generatedStory}
        isOpen={isBookOpen}
        onClose={() => setIsBookOpen(false)}
      />
    </div>
  );
}