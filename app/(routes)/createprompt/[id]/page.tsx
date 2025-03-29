"use client";

import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { BookPreview } from "../components/bookepreview";

interface Story {
    id: string;
    storypromptId: string;
    storyPrompt: string;
    storyType: string;
    ageGroup: string;
    writingStyle: string;
    complexity: number[];
    bookCoverImage: string;
    chapterTexts: string[];
    chapterImages: string[];
    createdAt: string;
}

const CreatPromptIdPage = () => {
    const [storyData, setStoryData] = useState<Story[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { user, isLoaded } = useUser();
    const { id: storypromptId } = useParams();

    const [open, setOpen] = useState(false);
    const [selectedStory, setSelectedStory] = useState<Story | null>(null);

    const fetchStories = useCallback(async () => {
        if (!isLoaded || !user || !storypromptId) return;

        const controller = new AbortController();
        const signal = controller.signal;

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `/api/get-promptstory-by-id?storypromptId=${storypromptId}&userId=${user.id}`,
                { signal }
            );

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            setStoryData(Array.isArray(data.stories) ? data.stories : []);
        } catch (err) {
            if (err instanceof Error && err.name !== "AbortError") {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setLoading(false);
        }

        return () => controller.abort();
    }, [isLoaded, user?.id, storypromptId]);

    useEffect(() => {
        fetchStories();
    }, [fetchStories]);

    const memoizedStories = useMemo(() => storyData, [storyData]);

    return (
        <div className="p-6 w-full flex flex-col items-center mx-auto max-w-7xl">
            <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800 dark:text-white">
                📖 Your Stories
            </h1>

            {loading && (
                <p className="text-center text-gray-500 text-lg animate-pulse">Fetching your stories...</p>
            )}
            {error && <p className="text-red-500 text-center font-semibold">{error}</p>}

            {!loading && memoizedStories.length === 0 && !error && (
                <p className="text-center text-gray-500 text-lg">No stories found.</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {memoizedStories.map((story) => (
                    <div
                        key={story.id}
                        className="bg-white dark:bg-slate-900 dark:text-white shadow-xl rounded-2xl p-6 transition-transform transform hover:scale-105 hover:shadow-2xl duration-300"
                    >
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                            {story.storyPrompt}
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300"><strong>Type:</strong> {story.storyType}</p>
                        <p className="text-gray-700 dark:text-gray-300"><strong>Age Group:</strong> {story.ageGroup}</p>
                        <p className="text-gray-700 dark:text-gray-300"><strong>Writing Style:</strong> {story.writingStyle}</p>
                        <p className="text-gray-700 dark:text-gray-300"><strong>Complexity:</strong> {story.complexity.join(", ")}</p>

                        {story.bookCoverImage && (
                            <img
                                src={story.bookCoverImage}
                                alt={`Cover of the book "${story.storyPrompt}"`}
                                className="w-full h-64 object-cover mt-4 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
                            />
                        )}

                        <button
                            onClick={() => {
                                setSelectedStory(story);
                                setOpen(true);
                            }}
                            className="mt-6 w-full bg-gradient-to-r from-purple-800 to-purple-900 text-white py-3 rounded-lg text-lg font-semibold hover:opacity-90 transition-all shadow-md focus:outline-none focus:ring-4 focus:ring-purple-400"
                        >
                            📖 Read Story
                        </button>
                    </div>
                ))}
            </div>

            {selectedStory && (
                <BookPreview
                    bookCoverImage={selectedStory.bookCoverImage}
                    chapterImages={selectedStory.chapterImages}
                    content={selectedStory.chapterTexts}
                    isOpen={open}
                    onClose={() => setOpen(false)}
                />
            )}
        </div>
    );
};

export default CreatPromptIdPage;
