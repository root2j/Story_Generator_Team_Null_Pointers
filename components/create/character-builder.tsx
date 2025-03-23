"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, UserPlus } from "lucide-react";

export default function CharacterBuilder({ story, setStory }: any) {
  const [newCharacter, setNewCharacter] = useState({
    name: "",
    role: "",
    description: "",
    background: "",
    goals: "",
    personality: "",
  });

  const addCharacter = () => {
    if (newCharacter.name) {
      setStory({
        ...story,
        characters: [...story.characters, { ...newCharacter, id: Date.now() }],
      });
      setNewCharacter({
        name: "",
        role: "",
        description: "",
        background: "",
        goals: "",
        personality: "",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Character Builder</h2>
        <p className="text-muted-foreground mb-6">
          Create and manage your story's characters. Define their personalities, backgrounds,
          and relationships to bring your narrative to life.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Add New Character</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Character Name</Label>
                <Input
                  id="name"
                  value={newCharacter.name}
                  onChange={(e) =>
                    setNewCharacter({ ...newCharacter, name: e.target.value })
                  }
                  placeholder="Enter character name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role in Story</Label>
                <Input
                  id="role"
                  value={newCharacter.role}
                  onChange={(e) =>
                    setNewCharacter({ ...newCharacter, role: e.target.value })
                  }
                  placeholder="E.g., Protagonist, Antagonist, Supporting"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Physical Description</Label>
                <Textarea
                  id="description"
                  value={newCharacter.description}
                  onChange={(e) =>
                    setNewCharacter({ ...newCharacter, description: e.target.value })
                  }
                  placeholder="Describe the character's appearance..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="personality">Personality Traits</Label>
                <Textarea
                  id="personality"
                  value={newCharacter.personality}
                  onChange={(e) =>
                    setNewCharacter({ ...newCharacter, personality: e.target.value })
                  }
                  placeholder="Describe the character's personality..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="background">Background</Label>
                <Textarea
                  id="background"
                  value={newCharacter.background}
                  onChange={(e) =>
                    setNewCharacter({ ...newCharacter, background: e.target.value })
                  }
                  placeholder="Character's history and background..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goals">Goals & Motivations</Label>
                <Textarea
                  id="goals"
                  value={newCharacter.goals}
                  onChange={(e) =>
                    setNewCharacter({ ...newCharacter, goals: e.target.value })
                  }
                  placeholder="Character's goals and motivations..."
                />
              </div>

              <Button onClick={addCharacter} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Character
              </Button>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Character List</h3>
          {story.characters.length === 0 ? (
            <p className="text-muted-foreground">No characters added yet.</p>
          ) : (
            story.characters.map((character: any) => (
              <Card key={character.id} className="p-4">
                <h4 className="font-semibold">{character.name}</h4>
                <p className="text-sm text-muted-foreground">{character.role}</p>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}