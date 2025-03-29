"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AISuggestionProps {
    suggestion: string | null;
    onDismiss: () => void;
}

export function AISuggestion({ suggestion, onDismiss }: AISuggestionProps) {
    if (!suggestion) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-secondary/50 border border-secondary rounded-lg p-4 flex items-start gap-3"
            >
                <div className="text-primary mt-0.5">
                    <Lightbulb className="h-5 w-5" />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium mb-1">AI Suggestion</p>
                    <p className="text-sm text-muted-foreground">{suggestion}</p>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full"
                    onClick={onDismiss}
                >
                    <X className="h-4 w-4" />
                </Button>
            </motion.div>
        </AnimatePresence>
    );
}