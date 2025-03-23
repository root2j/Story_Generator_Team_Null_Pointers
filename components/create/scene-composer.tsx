"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, BookOpen } from "lucide-react";

export default function SceneComposer({ story, setStory }: any) {
  const [newScene, setNewScene] = useState({
    title: "",
    setting: "",
    time: "",
    weather: "",
    mood: "",
    characters: [],
    content: "",
  });

  const addScene = () => {
    if (newScene.title && newScene.content) {
      setStory({
        ...story,
        scenes: [...story.scenes, { ...newScene, id: Date.now() }],
      });
      setNewScene({
        title: "",
        setting: "",
        time: "",
        weather: "",
        mood: "",
        characters: [],
        content: "",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Scene Composer</h2>
        <p className="text-muted-foreground mb-6">
          Craft your story scene by scene. Define the setting, mood, and action to create
          a vivid and engaging narrative.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Add New Scene</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Scene Title</Label>
                <Input
                  id="title"
                  value={newScene.title}
                  onChange={(e) =>
                    setNewScene({ ...newScene, title: e.target.value })
                  }
                  placeholder="Enter scene title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="setting">Setting</Label>
                <Input
                  id="setting"
                  value={newScene.setting}
                  onChange={(e) =>
                    setNewScene({ ...newScene, setting: e.target.value })
                  }
                  placeholder="Where does this scene take place?"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Select
                    value={newScene.time}
                    onValueChange={(value) =>
                      setNewScene({ ...newScene, time: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning</SelectItem>
                      <SelectItem value="afternoon">Afternoon</SelectItem>
                      <SelectItem value="evening">Evening</SelectItem>
                      <SelectItem value="night">Night</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weather">Weather</Label>
                  <Select
                    value={newScene.weather}
                    onValueChange={(value) =>
                      setNewScene({ ...newScene, weather: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select weather" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sunny">Sunny</SelectItem>
                      <SelectItem value="cloudy">Cloudy</SelectItem>
                      <SelectItem value="rainy">Rainy</SelectItem>
                      <SelectItem value="stormy">Stormy</SelectItem>
                      <SelectItem value="snowy">Snowy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mood">Scene Mood</Label>
                <Select
                  value={newScene.mood}
                  onValueChange={(value) =>
                    setNewScene({ ...newScene, mood: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select mood" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tense">Tense</SelectItem>
                    <SelectItem value="peaceful">Peaceful</SelectItem>
                    <SelectItem value="mysterious">Mysterious</SelectItem>
                    <SelectItem value="romantic">Romantic</SelectItem>
                    <SelectItem value="melancholic">Melancholic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Scene Content</Label>
                <Textarea
                  id="content"
                  value={newScene.content}
                  onChange={(e) =>
                    setNewScene({ ...newScene, content: e.target.value })
                  }
                  placeholder="Write your scene..."
                  className="h-32"
                />
              </div>

              <Button onClick={addScene} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Scene
              </Button>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Scene List</h3>
          {story.scenes.length === 0 ? (
            <p className="text-muted-foreground">No scenes added yet.</p>
          ) : (
            story.scenes.map((scene: any) => (
              <Card key={scene.id} className="p-4">
                <h4 className="font-semibold">{scene.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {scene.setting} - {scene.time}
                </p>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}