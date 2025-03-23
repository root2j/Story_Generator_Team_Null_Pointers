"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const genres = [
  "Fantasy",
  "Science Fiction",
  "Mystery",
  "Romance",
  "Thriller",
  "Adventure",
  "Horror",
  "Historical Fiction",
  "Literary Fiction",
  "Young Adult",
];

const storyTypes = [
  "Short Story",
  "Novel",
  "Interactive Story",
  "Comic Script",
  "Screenplay",
  "Poetry",
];

const ageGroups = [
  "Children",
  "Young Adult",
  "Adult",
  "All Ages",
];

const tones = [
  "Light-hearted",
  "Dark",
  "Humorous",
  "Serious",
  "Mysterious",
  "Romantic",
  "Suspenseful",
  "Inspirational",
];

export default function StoryBasics({ story, setStory }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Story Basics</h2>
        <p className="text-muted-foreground mb-6">
          Start by setting up the fundamental elements of your story. These details will help
          guide the creative process and ensure consistency throughout your narrative.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Story Title</Label>
          <Input
            id="title"
            placeholder="Enter your story title"
            value={story.title}
            onChange={(e) => setStory({ ...story, title: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Genre</Label>
            <Select
              value={story.genre}
              onValueChange={(value) => setStory({ ...story, genre: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a genre" />
              </SelectTrigger>
              <SelectContent>
                {genres.map((genre) => (
                  <SelectItem key={genre} value={genre.toLowerCase()}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Story Type</Label>
            <Select
              value={story.type}
              onValueChange={(value) => setStory({ ...story, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select story type" />
              </SelectTrigger>
              <SelectContent>
                {storyTypes.map((type) => (
                  <SelectItem key={type} value={type.toLowerCase()}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Age Group</Label>
            <Select
              value={story.ageGroup}
              onValueChange={(value) => setStory({ ...story, ageGroup: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select target age group" />
              </SelectTrigger>
              <SelectContent>
                {ageGroups.map((age) => (
                  <SelectItem key={age} value={age.toLowerCase()}>
                    {age}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tone</Label>
            <Select
              value={story.tone}
              onValueChange={(value) => setStory({ ...story, tone: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select story tone" />
              </SelectTrigger>
              <SelectContent>
                {tones.map((tone) => (
                  <SelectItem key={tone} value={tone.toLowerCase()}>
                    {tone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="synopsis">Synopsis</Label>
          <Textarea
            id="synopsis"
            placeholder="Write a brief summary of your story..."
            className="h-32"
            value={story.synopsis}
            onChange={(e) => setStory({ ...story, synopsis: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}