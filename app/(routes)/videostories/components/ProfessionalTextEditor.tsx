"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ShareDialog from "./ShareDialog";
import { Brain, Redo, Undo } from "lucide-react";
import ImportPrompt from "./ImportPrompt";
import toast from "react-hot-toast";
import { VideoAssets, CaptionResult } from "@/store/allinterfaces";
import { useUser } from "@clerk/nextjs";

interface Dialog {
    sceneName: string;
    text: string;
}

interface DialogAnalysisResult {
    firstSceneNarration: string;
    dialogs: Dialog[];
    lastSceneDialog: string;
}

interface AudioGenerationResult {
    firstSceneAudioUrl: string;
    dialogAudioUrls: Array<{ sceneName: string; audioUrl: string }>;
    lastSceneAudioUrl: string;
}

interface CaptionGenerationResult {
    firstSceneCaption: CaptionResult;
    dialogCaptions: Record<string, CaptionResult>;
    lastSceneCaption: CaptionResult;
    totalDuration: number;
}

interface SceneGenerationResult {
    firstScene: string;
    scenes: string[];
    lastScene: string;
}

interface EditorAreaProps {
    content: string;
    onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onGenerateVideo: () => void;
    onAnalyzeContent: () => void;
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    finalVideoAssets: VideoAssets | null;
    isProcessing: boolean;
    setIsProcessing: (isProcessing: boolean) => void;
    setContent: (content: string) => void;
    isImportDialogOpen: boolean;
    setIsImportDialogOpen: (open: boolean) => void;
    isContentValid: boolean;
}

interface ProfessionalTextEditorProps {
    dynamicUrl: string;
    shareDialogOpen: boolean;
    setShareDialogOpen: (open: boolean) => void;
    setIsSaving: (isSaving: boolean) => void;
    setCurrentStep: (value: number | ((prevState: number) => number)) => void;
    finalVideoAssets: VideoAssets | null;
    setFinalVideoAssets: (assets: VideoAssets) => void;
    selectLanguage: string;
}

const EditorArea: React.FC<EditorAreaProps> = ({
    content,
    onContentChange,
    onGenerateVideo,
    onAnalyzeContent,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
    isProcessing,
    setIsProcessing,
    setContent,
    isImportDialogOpen,
    setIsImportDialogOpen,
    isContentValid,
}) => {

    return (
        <div className="w-full border border-pink-500 p-2 sm:p-6 rounded-lg bg-slate-100 dark:bg-gray-900 shadow-lg">
            <div className="flex flex-row items-center justify-between gap-2 mb-2">
                <h2 className="text-sm px-1 md:text-xl 2xl:text-xl font-bold text-center bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                    Professional Story Editor
                </h2>
                <div className="flex flex-row justify-center gap-2">
                    <Button
                        onClick={onAnalyzeContent}
                        variant="outline"
                        title="AI Prompt Improver"
                        disabled={!isContentValid || isProcessing}
                    >
                        <Brain className="h-4 w-4" />
                    </Button>
                    <ImportPrompt
                        isImportDialogOpen={isImportDialogOpen}
                        setIsImportDialogOpen={setIsImportDialogOpen}
                        setIsProcessing={setIsProcessing}
                        setContent={setContent}
                        isProcessing={isProcessing}
                    />
                </div>
            </div>
            <Textarea
                className="w-full h-[310px] p-4 bg-white text-black dark:bg-gray-700 dark:text-white rounded-lg resize-none"
                placeholder="Type your content here..."
                value={content}
                onChange={onContentChange}
            />
            <div className="flex items-center justify-between gap-2">
                <Button
                    onClick={onGenerateVideo}
                    variant="outline"
                    className="mt-2"
                    disabled={!isContentValid || isProcessing}
                >
                    Generate Video
                </Button>
                <div className="flex gap-2 items-center mt-2">
                    <Button onClick={onUndo} variant="outline" disabled={!canUndo}>
                        <Undo className="h-4 w-4" />
                    </Button>
                    <Button onClick={onRedo} variant="outline" disabled={!canRedo}>
                        <Redo className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

interface Character {
    name: string;
    description: string;
    imageUrl: string;
}

const ProfessionalTextEditor: React.FC<ProfessionalTextEditorProps> = ({
    dynamicUrl,
    shareDialogOpen,
    setShareDialogOpen,
    setIsSaving,
    setCurrentStep,
    finalVideoAssets,
    setFinalVideoAssets,
    selectLanguage,
}) => {
    const { user } = useUser();
    const [content, setContent] = useState("");
    const [isContentValid, setIsContentValid] = useState(false);
    const [undoStack, setUndoStack] = useState<string[]>([]);
    const [redoStack, setRedoStack] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

    useEffect(() => {
        if (finalVideoAssets?.content) {
            setContent(finalVideoAssets.content);
        }
    }, [finalVideoAssets?.content]);

    useEffect(() => {
        const isValid = content.trim().length >= 5 && /\w{3,}/.test(content);
        setIsContentValid(isValid);
    }, [content]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsSaving(true);
            localStorage.setItem("editorContent", content);
            setTimeout(() => setIsSaving(false), 500);
        }, 1000);
        return () => clearTimeout(timer);
    }, [content, setIsSaving]);

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setUndoStack((prev) => [...prev, content]);
        setRedoStack([]);
        setContent(e.target.value);
    };

    const handleUndo = () => {
        if (undoStack.length > 0) {
            const previous = undoStack[undoStack.length - 1];
            setUndoStack((prev) => prev.slice(0, prev.length - 1));
            setRedoStack((prev) => [...prev, content]);
            setContent(previous);
        }
    };

    const handleRedo = () => {
        if (redoStack.length > 0) {
            const next = redoStack[redoStack.length - 1];
            setRedoStack((prev) => prev.slice(0, prev.length - 1));
            setUndoStack((prev) => [...prev, content]);
            setContent(next);
        }
    };

    const analyzeCharacter = async (content: string) => {
        try {
            const response = await fetch("/api/analyze-character", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content, selectedLanguage: selectLanguage }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Analysis failed");
            }
            const responseData = await response.json();
            if (
                !Array.isArray(responseData.characters) ||
                !Array.isArray(responseData.thinking)
            ) {
                throw new Error("Invalid API response structure");
            }
            return {
                thinking: responseData.thinking,
                characters: responseData.characters.map((character: { [key: string]: any }) => ({
                    name: character.name || "Unknown",
                    gender: character.gender || "Unknown",
                    characteristics: character.characteristics || [],
                    description: character.description || "No description available",
                })),
            };
        } catch (error) {
            console.error("Analysis Error:", error);
            toast.error("Failed to analyze character");
            return null;
        }
    };

    const generateCharacterImages = async () => {
        if (!content.trim()) {
            toast.error("Please enter some content first");
            return;
        }

        setIsProcessing(true);

        try {
            const result = await analyzeCharacter(content);
            if (!result || !result.characters?.length) {
                throw new Error("No characters found in the analysis.");
            }

            const charactersWithImages: Character[] = [];

            for (const character of result.characters) {
                try {
                    const payload = {
                        character: {
                            ...character,
                            traits: [], // Reset traits
                            type: "realistic",
                        },
                        selectedCharacterType: "realistic",
                        thinking: result.thinking,
                    };

                    const response = await fetch("/api/generate-character-image", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || "Image generation failed");
                    }

                    const responseData = await response.json();
                    const { imageUrl, name, description } = responseData.data || {};

                    if (!imageUrl || !name || !description) {
                        throw new Error("Missing data fields in response");
                    }

                    charactersWithImages.push({ ...character, imageUrl, name, description });
                } catch (error) {
                    console.error(`Failed to generate image for ${character.name}:`, error);
                    charactersWithImages.push({ ...character, imageUrl: null }); // Keep character in list even if image fails
                }
            }

            toast.success("Character images generated successfully!");
            console.log("charactersWithImages", charactersWithImages)
            return charactersWithImages; // Return updated character list
        } catch (error) {
            console.error("Character Generation Error:", error);
            toast.error("Failed to generate characters");
        } finally {
            setIsProcessing(false);
        }
    };

    const analyzeactualscene = useCallback(
        async (scriptConcept: any, charactersResponse: any, selectLanguage: string) => {
            try {
                const response = await fetch("/api/generate-actual-scenes", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ scriptConcept, charactersResponse, selectLanguage }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Analysis failed");
                }

                const textData = await response.json();

                return {
                    textData,
                };
            } catch (error: unknown) {
                console.error("Error fetching data:", error);
                return { error: error instanceof Error ? error.message : "Unknown error occurred" };
            }
        },
        []
    );

    async function generateImagePrompt(textData: any, character_details: any) {
        const apiImageUrl = "/api/create-image-prompt";

        async function fetchImagePrompt(description: string): Promise<string> {
            try {
                const response = await fetch(apiImageUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ prompt: description, character_details }),
                });

                const data = await response.json();
                return data.finalprompt || "Error generating image prompt";
            } catch (error) {
                console.error("Error generating image prompt:", error);
                return "Error generating image prompt";
            }
        }

        // Fetch first scene
        const firstScenePrompt = await fetchImagePrompt(textData.textData.firstScene.description);

        // Fetch all scene prompts & videos in parallel
        const scenes: Record<string, string> = {};

        const sceneEntries = Object.entries(textData.textData.scenes);

        await Promise.all(
            sceneEntries.map(async ([key, scene]) => {
                const imagePrompt = await fetchImagePrompt((scene as any).description);
                scenes[key] = imagePrompt;
            })
        );


        // Fetch final scene & coming soon teaser in parallel
        const [finalScenePrompt, comingSoonTeaserPrompt] = await Promise.all([
            fetchImagePrompt(textData.textData.finalScene.description),
            fetchImagePrompt(textData.textData.comingSoonTeaser.description),
        ]);


        return {
            firstScene: firstScenePrompt,
            scenes,
            finalScene: finalScenePrompt,
            comingSoonTeaser: comingSoonTeaserPrompt,
        };
    }

    const analyzedialog = useCallback(
        async (
            firstScene: any,
            scenes: any[],
            lastScene: any,
            selectLanguage: string
        ): Promise<DialogAnalysisResult | { error: string }> => {
            try {
                const response = await fetch("/api/analyze-dialog", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ firstScene, scenes, lastScene, selectLanguage }),
                });

                const responseText = await response.text(); // Capture raw response
                console.log("Raw API Response:", responseText); // Debug log

                if (!response.ok) {
                    throw new Error(`API Error: ${response.statusText}`);
                }

                let jsonData;
                try {
                    jsonData = JSON.parse(responseText); // Ensure it's valid JSON
                } catch (err) {
                    throw new Error("API did not return valid JSON");
                }

                // Validate JSON structure
                if (
                    !jsonData.dialogs ||
                    !Array.isArray(jsonData.dialogs) ||
                    !jsonData.firstSceneNarration ||
                    typeof jsonData.firstSceneNarration !== "string" ||
                    !jsonData.lastSceneDialog ||
                    typeof jsonData.lastSceneDialog !== "string"
                ) {
                    console.error("Invalid API response structure:", jsonData);
                    throw new Error("Invalid API response structure");
                }

                return {
                    firstSceneNarration: jsonData.firstSceneNarration,
                    dialogs: jsonData.dialogs,
                    lastSceneDialog: jsonData.lastSceneDialog,
                };
            } catch (error: unknown) {
                console.error("Error fetching data:", error);
                return { error: error instanceof Error ? error.message : "Unknown error occurred" };
            }
        },
        []
    );


    const generateaudio = useCallback(
        async (
            firstSceneNarration: string,
            dialogs: Dialog[],
            lastSceneDialog: string
        ): Promise<AudioGenerationResult | { error: string }> => {
            try {
                const response = await fetch("/api/generate-audio", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ firstSceneNarration, dialogs, lastSceneDialog }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Audio generation failed");
                }

                const jsonData = await response.json();

                console.log("audioUrls", jsonData);

                if (!jsonData.firstScene || !jsonData.lastScene || !Array.isArray(jsonData.dialogs)) {
                    throw new Error("Invalid API response structure");
                }

                return {
                    firstSceneAudioUrl: jsonData.firstScene,
                    dialogAudioUrls: jsonData.dialogs,
                    lastSceneAudioUrl: jsonData.lastScene,
                };
            } catch (error: unknown) {
                console.error("Error generating audio:", error);
                return { error: error instanceof Error ? error.message : "Unknown error occurred" };
            }
        },
        []
    );

    const generatecaptions = useCallback(
        async (
            firstSceneAudioUrl: string,
            dialogAudioUrls: Array<{ sceneName: string; audioUrl: string }>,
            lastSceneAudioUrl: string
        ): Promise<CaptionGenerationResult | { error: string }> => {
            try {
                const response = await fetch("/api/generate-captions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        firstSceneAudioUrl,
                        dialogAudioUrls,
                        lastSceneAudioUrl,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Caption generation failed");
                }

                const jsonData = await response.json();

                console.log("captions", jsonData)

                if (
                    !jsonData.firstSceneCaption ||
                    !jsonData.lastSceneCaption ||
                    typeof jsonData.dialogCaptions !== "object" ||
                    !jsonData.totalDuration
                ) {
                    throw new Error("Invalid API response structure");
                }

                return {
                    firstSceneCaption: jsonData.firstSceneCaption,
                    dialogCaptions: jsonData.dialogCaptions,
                    lastSceneCaption: jsonData.lastSceneCaption,
                    totalDuration: jsonData.totalDuration,
                };
            } catch (error: unknown) {
                console.error("Error generating captions:", error);
                return { error: error instanceof Error ? error.message : "Unknown error occurred" };
            }
        },
        []
    );


    const generatescenes = useCallback(
        async (
            firstScene: string,
            scenes: string[],
            lastScene: string
        ): Promise<SceneGenerationResult | { error: string }> => {
            try {
                const response = await fetch("/api/generate-scene", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ firstScene, scenes, lastScene }),
                });

                if (!response.ok) {
                    let errorMessage = "Scene generation failed";
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.error || errorMessage;
                    } catch (jsonError) {
                        console.error("Failed to parse error response:", jsonError);
                    }
                    throw new Error(errorMessage);
                }

                const jsonData = await response.json();

                if (
                    !jsonData.firstScene ||
                    !jsonData.lastScene ||
                    !Array.isArray(jsonData.scenes)
                ) {
                    throw new Error("Invalid API response structure");
                }

                return {
                    firstScene: jsonData.firstScene,
                    scenes: jsonData.scenes,
                    lastScene: jsonData.lastScene,
                };
            } catch (error) {
                console.error("❌ Error generating scene:", error);
                return { error: error instanceof Error ? error.message : "Unknown error occurred" };
            }
        },
        []
    );


    const checkPromptValidity = useCallback(async (content: string): Promise<boolean> => {
        try {
            const response = await fetch("/api/analyze-prompt", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content }),
            });

            if (!response.ok) {
                throw new Error("Failed to validate prompt");
            }

            const data = await response.json();
            return data.isPromptValid;
        } catch (error) {
            console.error("Error validating prompt:", error);
            return false;
        }
    }, []);


    const handleGenerateVideo = async () => {
        if (!isContentValid) {
            toast.error("Please enter a valid prompt (minimum 5 characters with meaningful content)");
            return;
        }

        const result = await checkPromptValidity(content);
        if (!result) {
            toast.error("Please enter a valid prompt");
            return;
        }

        try {
            setIsProcessing(true);
            setCurrentStep(0);

            setCurrentStep((prev) => prev + 1);
            const imageUrlResponse = await generateCharacterImages();

            if (!imageUrlResponse) {
                toast.error("Image generation failed");
                return;
            }

            console.log("imageUrlResponse", imageUrlResponse);

            const analysisScene = await analyzeactualscene(content, imageUrlResponse, selectLanguage);
            if (!analysisScene) {
                toast.error("Scene Analysis failed");
                return;
            }

            console.log("analysisScene", analysisScene);

            setCurrentStep((prev) => prev + 1);
            const dialogAnalysis = await analyzedialog(
                analysisScene.textData.firstScene,
                analysisScene.textData.scenes,
                analysisScene.textData.finalScene,
                selectLanguage
            );

            if (!dialogAnalysis || "error" in dialogAnalysis) {
                toast.error("Dialog analysis failed");
                return;
            }

            console.log("dialogAnalysis", dialogAnalysis);

            setCurrentStep((prev) => prev + 1);
            const audioAssets = await generateaudio(
                dialogAnalysis.firstSceneNarration,
                dialogAnalysis.dialogs,
                dialogAnalysis.lastSceneDialog
            );
            if (!audioAssets || "error" in audioAssets) {
                toast.error("Audio generation failed");
                return;
            }

            console.log("audioAssets", audioAssets);

            setCurrentStep((prev) => prev + 1);
            const captionResults = await generatecaptions(
                audioAssets.firstSceneAudioUrl,
                audioAssets.dialogAudioUrls,
                audioAssets.lastSceneAudioUrl
            );
            if (!captionResults || "error" in captionResults) {
                toast.error("Caption generation failed");
                return;
            }

            console.log("captionResults", captionResults);

            setCurrentStep((prev) => prev + 1);

            const imagePrompt = await generateImagePrompt(
                analysisScene,
                imageUrlResponse
            )

            if (!imagePrompt || "error" in imagePrompt) {
                toast.error("Image prompt generation failed");
                return;
            }

            const sceneResults = await generatescenes(
                imagePrompt.firstScene,
                Object.values(imagePrompt.scenes),
                imagePrompt.finalScene,
            );
            if (!sceneResults || "error" in sceneResults) {
                toast.error("Scene generation failed");
                return;
            }

            console.log("sceneResults", sceneResults);

            setCurrentStep((prev) => prev + 1);
            const finalAssets = {
                userId: user?.id || "",
                prompt: analysisScene.textData.prompt || "",
                captions: {
                    firstScene: captionResults.firstSceneCaption,
                    dialogs: captionResults.dialogCaptions,
                    lastScene: captionResults.lastSceneCaption,
                },
                audioUrls: {
                    firstScene: audioAssets.firstSceneAudioUrl,
                    dialogs: audioAssets.dialogAudioUrls,
                    lastScene: audioAssets.lastSceneAudioUrl,
                },
                imageUrls: {
                    firstScene: sceneResults.firstScene,
                    scenes: sceneResults.scenes,
                    lastScene: sceneResults.lastScene,
                },
                content: content,
                totalDuration: captionResults.totalDuration,
            };
            console.log("finalVideoAssets", finalAssets);


            // Save assets to local state and localStorage
            setFinalVideoAssets(finalAssets);
            localStorage.setItem("finalVideoAssets", JSON.stringify(finalAssets));

            // POST the finalAssets to the database via your Next.js API route
            const response = await fetch("/api/video-assets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...finalAssets }),
            });

            if (!response.ok) {
                toast.error("Failed to save video assets to database");
                throw new Error("Failed to save video assets to database");
            }

            const savedData = await response.json();
            console.log("Video assets saved:", savedData);

            setCurrentStep((prev) => prev + 1);
        } catch (error) {
            console.error("Video generation pipeline error:", error);
            toast.error("Video generation process failed");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleAnalyzeContent = async () => {
        if (!isContentValid) {
            toast.error("Please enter a valid prompt to analyze");
            return;
        }
        const result = await checkPromptValidity(content);

        if (!result) {
            toast.error("Please enter a valid prompt");
            return;
        }
        alert("Analyzing your content using AI...");
    };

    return (
        <div className="w-full rounded-md bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white flex flex-col">
            <main className="w-full flex-grow p-2 sm:p-4">
                <EditorArea
                    content={content}
                    onContentChange={handleContentChange}
                    onGenerateVideo={handleGenerateVideo}
                    finalVideoAssets={finalVideoAssets}
                    onAnalyzeContent={handleAnalyzeContent}
                    setIsProcessing={setIsProcessing}
                    setContent={setContent}
                    isProcessing={isProcessing}
                    setIsImportDialogOpen={setIsImportDialogOpen}
                    isImportDialogOpen={isImportDialogOpen}
                    onUndo={handleUndo}
                    onRedo={handleRedo}
                    canUndo={undoStack.length > 0}
                    canRedo={redoStack.length > 0}
                    isContentValid={isContentValid}
                />
            </main>

            <ShareDialog
                open={shareDialogOpen}
                onOpenChange={setShareDialogOpen}
                dynamicUrl={dynamicUrl}
            />
        </div>
    );
};

export default ProfessionalTextEditor;
