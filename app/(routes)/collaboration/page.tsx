"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import axios from "axios";

const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY";

export default function StoryGenerator() {
    const [prompt, setPrompt] = useState("");
    const [story, setStory] = useState("");
    const [loading, setLoading] = useState(false);

    const generateStory = async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        try {
            const response = await axios.post(
                "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-001:generateText",
                {
                    prompt: `Write a creative, engaging, and well-structured story based on the following idea: ${prompt}`,
                    max_tokens: 700,
                },
                {
                    headers: {
                        Authorization: `Bearer ${GEMINI_API_KEY}`,
                    },
                }
            );
            setStory(response.data.candidates?.[0]?.output || "No story generated. Try again.");
        } catch (error) {
            console.error("Error generating story:", error);
            setStory("An error occurred while generating the story. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
            <motion.h1
                className="text-5xl font-extrabold text-center text-neon mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                AI-Powered Story Generator
            </motion.h1>

            <Card className="w-full max-w-3xl bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
                <CardContent className="space-y-4">
                    <Input
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Enter your story idea..."
                        className="w-full p-3 bg-gray-700 text-white border-none rounded-lg focus:ring-2 focus:ring-neon focus:outline-none"
                    />
                    <Button
                        onClick={generateStory}
                        className="w-full py-3 text-lg font-semibold bg-neon hover:bg-neon-dark rounded-lg transition-all"
                        disabled={loading}
                    >
                        {loading ? "Generating..." : "Generate Story"}
                    </Button>
                </CardContent>
            </Card>

            {story && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mt-8 w-full max-w-3xl p-8 bg-gray-800 rounded-2xl shadow-xl border border-gray-700"
                >
                    <h2 className="text-2xl font-bold text-neon mb-4 text-center">Generated Story</h2>
                    <Textarea
                        value={story}
                        readOnly
                        className="w-full h-72 p-4 bg-gray-700 text-white border-none rounded-lg resize-none text-lg leading-relaxed"
                    />
                </motion.div>
            )}
        </div>
    );
}