"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Download,
  Share2,
  BookOpen,
  FileText,
  Book,
  File
} from "lucide-react";

export default function PublishOptions() {
  const handleExport = (format: string) => {
    // Export functionality will be implemented here
    console.log(`Exporting as ${format}...`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Publish & Share</h2>
        <p className="text-muted-foreground mb-6">
          Export your story in various formats or share it with others.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Export Options</h3>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleExport("pdf")}
            >
              <FileText className="w-4 h-4 mr-2" />
              Export as PDF
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleExport("docx")}
            >
              <File className="w-4 h-4 mr-2" />
              Export as DOCX
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleExport("epub")}
            >
              <Book className="w-4 h-4 mr-2" />
              Export as EPUB
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleExport("txt")}
            >
              <FileText className="w-4 h-4 mr-2" />
              Export as TXT
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Share & Publish</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Share2 className="w-4 h-4 mr-2" />
              Share with Others
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <BookOpen className="w-4 h-4 mr-2" />
              Publish to Platform
            </Button>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Publishing Checklist</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500" />
            <p>Story has a title and synopsis</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500" />
            <p>At least one character defined</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500" />
            <p>Minimum word count reached</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500" />
            <p>Grammar and spell check completed</p>
          </div>
        </div>
      </Card>
    </div>
  );
}