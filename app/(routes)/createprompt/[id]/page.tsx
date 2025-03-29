"use client";

import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

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
    const [storyData, setStoryData] = useState<Story[]>([]); // Ensure it's always an array
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { user, isLoaded } = useUser();
    const { id: storypromptId } = useParams(); // Get ID from URL path

    useEffect(() => {
        if (!isLoaded || !user || !storypromptId) return;

        const fetchStories = async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    `/api/get-promptstory-by-id?storypromptId=${storypromptId}&userId=${user.id}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch stories");
                }

                const data = await response.json();
                setStoryData(Array.isArray(data.stories) ? data.stories : []); // Ensure it's an array
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
                setStoryData([]); // Ensure `storyData` is always an array even on error
            } finally {
                setLoading(false);
            }
        };

        fetchStories();
    }, [isLoaded, user?.id, storypromptId]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Your Stories</h1>

            {loading && <p>Loading stories...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {storyData.length === 0 && !loading && !error && (
                <p>No stories found.</p>
            )}

            {storyData.map((story) => (
                <div key={story.id} className="border p-4 mb-4 rounded shadow">
                    <h2 className="text-lg font-semibold">{story.storyPrompt}</h2>
                    <p>Story Type: {story.storyType}</p>
                    <p>Age Group: {story.ageGroup}</p>
                    <p>Writing Style: {story.writingStyle}</p>
                    <p>Complexity: {story.complexity.join(", ")}</p>
                    {story.bookCoverImage && (
                        <img
                            src={story.bookCoverImage}
                            alt="Book Cover"
                            className="w-32 h-48 object-cover mt-2"
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default CreatPromptIdPage;
