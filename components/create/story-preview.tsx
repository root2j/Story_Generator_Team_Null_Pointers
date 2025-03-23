"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function StoryPreview({ story }: any) {
  const [currentPage, setCurrentPage] = useState(0);
  const pages = story.content ? story.content.split('\n\n') : [];

  if (!story.title && !story.content) {
    return (
      <div className="text-center text-muted-foreground p-4">
        <p>Your story preview will appear here as you write.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{story.title}</h1>
        {story.genre && (
          <p className="text-sm text-muted-foreground">
            {story.genre} • {story.type} • {story.ageGroup}
          </p>
        )}
      </div>

      <Card className="relative min-h-[400px] p-6 bg-card shadow-lg">
        <div className="prose prose-sm max-w-none">
          {pages.length > 0 ? (
            <div className="space-y-4">
              <div className="text-right text-sm text-muted-foreground">
                Page {currentPage + 1} of {pages.length}
              </div>
              <div className="min-h-[300px]">{pages[currentPage]}</div>
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))}
                  disabled={currentPage === pages.length - 1}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No content available yet.</p>
          )}
        </div>
      </Card>

      {story.synopsis && (
        <div className="prose prose-sm max-w-none">
          <h2 className="text-lg font-semibold">Synopsis</h2>
          <p>{story.synopsis}</p>
        </div>
      )}

      {story.scenes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Scenes</h2>
          {story.scenes.map((scene: any) => (
            <div key={scene.id} className="space-y-2">
              <h3 className="font-medium">{scene.title}</h3>
              <p className="text-sm">{scene.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}