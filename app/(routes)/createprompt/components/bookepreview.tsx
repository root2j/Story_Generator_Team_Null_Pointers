"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import HTMLFlipBook from "react-pageflip";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

// Custom hook to check if the device is large (e.g., width >= 768px)
function useIsLargeDevice(threshold = 768) {
    const [isLarge, setIsLarge] = useState(
        typeof window !== "undefined" ? window.innerWidth >= threshold : false
    );
    useEffect(() => {
        const handleResize = () => setIsLarge(window.innerWidth >= threshold);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [threshold]);
    return isLarge;
}

interface BookPreviewProps {
    bookCoverImage: string;
    chapterImages: string[]; // Array of images for each chapter
    content: string[]; // Array of paragraphs
    isOpen: boolean;
    onClose: () => void;
}

interface PageProps {
    number: number;
    content: string;
    image?: string;
    isCover?: boolean;
    // When global reading is active on this page,
    // the text will be animated letter-by-letter in blue.
    isBeingRead?: boolean;
}

const Page = React.forwardRef<HTMLDivElement, PageProps>(
    ({ number, content, image, isCover, isBeingRead }, ref) => {
        const [isPlaying, setIsPlaying] = useState(false);
        const speechSynthesisAvailable =
            typeof window !== "undefined" ? window.speechSynthesis : null;
        const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

        const letters = content.split("");
        const [activeLetterIndex, setActiveLetterIndex] = useState(0);

        useEffect(() => {
            if (isBeingRead) {
                setActiveLetterIndex(0);
                const timer = setInterval(() => {
                    setActiveLetterIndex((prev) => {
                        if (prev < letters.length) {
                            return prev + 1;
                        } else {
                            clearInterval(timer);
                            return prev;
                        }
                    });
                }, 80);
                return () => clearInterval(timer);
            } else {
                setActiveLetterIndex(0);
            }
        }, [isBeingRead, content, letters.length]);

        const toggleSpeech = () => {
            if (!speechSynthesisAvailable) return;
            if (isPlaying) {
                speechSynthesisAvailable.cancel();
                setIsPlaying(false);
            } else {
                const utterance = new SpeechSynthesisUtterance(content);
                utterance.onend = () => setIsPlaying(false);
                speechSynthesisAvailable.speak(utterance);
                utteranceRef.current = utterance;
                setIsPlaying(true);
            }
        };

        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative h-full w-full shadow-lg rounded-2xl overflow-hidden border border-gray-500 p-6 bg-white dark:bg-gray-900 flex flex-col"
            >
                {isCover ? (
                    <div className="relative flex items-center justify-center h-full text-white text-3xl font-bold">
                        {image ? (
                            <img
                                src={image}
                                alt="Book Cover"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        ) : (
                            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 w-full h-full flex items-center justify-center">
                                {content}
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        {image && (
                            <img
                                src={image}
                                alt="Illustration"
                                className="w-full h-1/2 object-cover rounded-md mb-4 flex-shrink-0"
                            />
                        )}
                        <div className="cursor-default p-4 text-justify text-lg leading-relaxed overflow-auto flex-1">
                            {letters.map((letter, index) => (
                                <span
                                    key={index}
                                    className={
                                        index < activeLetterIndex
                                            ? "text-blue-500"
                                            : "text-gray-900 dark:text-gray-200"
                                    }
                                >
                                    {letter}
                                </span>
                            ))}
                        </div>
                        <div className="absolute bottom-4 right-4 text-sm text-gray-600 dark:text-gray-400">
                            {number}
                        </div>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="absolute bottom-2 left-2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full shadow-md backdrop-blur-lg"
                            onClick={toggleSpeech}
                        >
                            {isPlaying ? (
                                <Pause className="h-5 w-5" />
                            ) : (
                                <Play className="h-5 w-5" />
                            )}
                        </Button>
                    </>
                )}
            </motion.div>
        );
    }
);

Page.displayName = "Page";

// Helper to split text based on max characters, preserving whole words.
function splitParagraph(text: string, maxChars: number): string[] {
    if (text.length <= maxChars) return [text];
    const parts: string[] = [];
    let start = 0;
    while (start < text.length) {
        let end = start + maxChars;
        if (end < text.length) {
            const lastSpace = text.lastIndexOf(" ", end);
            if (lastSpace > start) {
                end = lastSpace;
            }
        }
        parts.push(text.slice(start, end).trim());
        start = end;
    }
    return parts;
}

interface ProcessedPage {
    content: string;
    image?: string;
}

export function BookPreview({
    content,
    isOpen,
    onClose,
    bookCoverImage,
    chapterImages,
}: BookPreviewProps) {
    const processedPages: ProcessedPage[] = [];
    // Process each paragraph with conditional character limits.
    content.forEach((paragraph, index) => {
        const image = chapterImages[index];
        if (image) {
            // If an image exists for the chapter, the first page gets 400 chars.
            const firstChunk = paragraph.slice(0, 400).trim();
            processedPages.push({ content: firstChunk, image });
            const remainder = paragraph.slice(400).trim();
            if (remainder.length > 0) {
                // The remaining pages (without image) get 700 chars per page.
                const additionalChunks = splitParagraph(remainder, 700);
                additionalChunks.forEach((chunk) => {
                    processedPages.push({ content: chunk });
                });
            }
        } else {
            // No image: use 700 characters per page.
            const splits = splitParagraph(paragraph, 700);
            splits.forEach((chunk) => {
                processedPages.push({ content: chunk });
            });
        }
    });

    const book = useRef<any>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [isGlobalPlaying, setIsGlobalPlaying] = useState(false);
    const globalUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const isLargeDevice = useIsLargeDevice();
    // Total pages includes cover and end.
    const totalPages = processedPages.length + 2;

    // State for global play choice overlay.
    const [readingChoice, setReadingChoice] = useState<{
        show: boolean;
        pageIndex: number;
    } | null>(null);

    const playFlipSound = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        }
    };

    const handleFlip = (e: any) => {
        if (!book.current) return;
        const pageNumber = e.data;
        // Calculate left page number (cover is page 0)
        const leftPageNumber = Math.floor(pageNumber / 2) + 1;
        if (leftPageNumber !== currentPage) {
            setCurrentPage(leftPageNumber);
            playFlipSound();
        }
    };

    const nextPage = () => {
        if (book.current && currentPage < totalPages - 1) {
            book.current.pageFlip().flipNext();
        }
    };

    const prevPage = () => {
        if (book.current && currentPage > 0) {
            book.current.pageFlip().flipPrev();
        }
    };

    // Global auto-play: different behavior for large and small devices.
    const playGlobalPage = (index: number) => {
        if (isLargeDevice) {
            // On large devices, read two pages (a spread) at once.
            if (index >= processedPages.length) {
                setIsGlobalPlaying(false);
                return;
            }
            let textToRead = processedPages[index].content;
            if (index + 1 < processedPages.length) {
                textToRead += " " + processedPages[index + 1].content;
            }
            const utterance = new SpeechSynthesisUtterance(textToRead);
            utterance.onend = () => {
                if (index + 2 < processedPages.length) {
                    nextPage();
                    setTimeout(() => {
                        playGlobalPage(index + 2);
                    }, 800);
                } else {
                    setIsGlobalPlaying(false);
                }
            };
            globalUtteranceRef.current = utterance;
            window.speechSynthesis.speak(utterance);
        } else {
            // On small devices, read one page at a time.
            if (index >= processedPages.length) {
                setIsGlobalPlaying(false);
                return;
            }
            const utterance = new SpeechSynthesisUtterance(processedPages[index].content);
            utterance.onend = () => {
                if (index < processedPages.length - 1) {
                    nextPage();
                    setTimeout(() => {
                        playGlobalPage(index + 1);
                    }, 800);
                } else {
                    setIsGlobalPlaying(false);
                }
            };
            globalUtteranceRef.current = utterance;
            window.speechSynthesis.speak(utterance);
        }
    };

    // Jump to a given processedPages index and start reading from there.
    const startGlobalPlaybackFrom = (index: number) => {
        if (book.current) {
            book.current.pageFlip().flip(index + 1); // cover is page 0
            setTimeout(() => {
                playGlobalPage(index);
            }, 800);
        }
    };

    // Global playback starting logic.
    // When the global play button is clicked:
    // - If we are not at the beginning (currentPage > 1), show a dialog for the user to choose
    //   "Continue Reading" or "Read from Start".
    // - Otherwise, start global playback immediately.
    const handleGlobalPlayClick = () => {
        if (currentPage > 1) {
            setReadingChoice({ show: true, pageIndex: currentPage - 1 });
        } else {
            startGlobalPlayback();
        }
    };

    const startGlobalPlayback = () => {
        if (currentPage <= 1) {
            nextPage();
        }
        setIsGlobalPlaying(true);
        const startingIndex = currentPage > 1 ? currentPage - 1 : 0;
        playGlobalPage(startingIndex);
    };

    const stopGlobalPlayback = () => {
        window.speechSynthesis.cancel();
        setIsGlobalPlaying(false);
    };

    // For progress: on large devices, each flip counts as two pages.
    const effectivePage = isLargeDevice ? Math.min(currentPage * 2, totalPages - 1) : currentPage;
    const progressPercent = (effectivePage / (totalPages - 1)) * 100;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                style={{ maxWidth: "1050px" }}
                className="w-full p-0 bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 shadow-2xl rounded-xl"
            >
                <DialogTitle>
                    <VisuallyHidden>Book Preview</VisuallyHidden>
                </DialogTitle>
                <div className="max-w-6xl w-full h-full p-8 flex flex-col items-center relative">
                    <AnimatePresence>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            className="relative w-full max-w-6xl flex items-center justify-center"
                        >
                            <HTMLFlipBook
                                width={600}
                                height={750}
                                size="stretch"
                                minWidth={300}
                                maxWidth={1000}
                                minHeight={400}
                                maxHeight={1000}
                                showCover
                                maxShadowOpacity={0.3}
                                ref={book}
                                onFlip={handleFlip}
                                className="shadow-2xl rounded-xl overflow-hidden"
                                flippingTime={700}
                                usePortrait
                                autoSize
                                mobileScrollSupport
                                clickEventForward
                                useMouseEvents
                                swipeDistance={30}
                                showPageCorners
                                style={{ background: "transparent" }}
                                startPage={0}
                                drawShadow={true}
                                startZIndex={0}
                                disableFlipByClick={false}
                            >
                                {/* Cover Page */}
                                <Page
                                    number={0}
                                    content="📖 My Amazing Book"
                                    isCover
                                    image={bookCoverImage}
                                />

                                {/* Story Pages */}
                                {processedPages.map((page, index) => (
                                    <Page
                                        key={index}
                                        number={index + 1}
                                        content={page.content}
                                        image={page.image}
                                        // Mark page as active for global reading if it matches the current page.
                                        isBeingRead={isGlobalPlaying && currentPage === index + 1}
                                    />
                                ))}

                                {/* End Page */}
                                <Page
                                    number={processedPages.length + 1}
                                    content="📚 The End"
                                    isCover
                                    image={bookCoverImage}
                                />
                            </HTMLFlipBook>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="mt-4 flex items-center justify-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={prevPage}
                            disabled={currentPage <= 1}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={nextPage}
                            disabled={currentPage >= totalPages - 1}
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Global Play/Pause Controls */}
                    <div className="mt-4 flex items-center justify-center gap-4">
                        {!isGlobalPlaying ? (
                            <Button variant="outline" onClick={handleGlobalPlayClick}>
                                <Play className="h-5 w-5" />
                                <span className="ml-2">Play Whole Book</span>
                            </Button>
                        ) : (
                            <Button variant="outline" onClick={stopGlobalPlayback}>
                                <Pause className="h-5 w-5" />
                                <span className="ml-2">Pause Global Playback</span>
                            </Button>
                        )}
                    </div>

                    {/* Progress Gradient Line with Current Page Indicator */}
                    <div className="w-full h-2 mt-4 bg-gray-300 rounded-full overflow-hidden relative">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-green-500"
                            style={{ width: `${progressPercent}%` }}
                        />
                        <div
                            className="absolute top-0 h-full w-0.5 bg-blue-900"
                            style={{ left: `${progressPercent}%` }}
                        />
                    </div>

                    {/* Global Play Choice Overlay */}
                    {readingChoice && readingChoice.show && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg text-center">
                                <p className="mb-4 text-lg">
                                    Start reading from here or from the beginning?
                                </p>
                                <div className="flex items-center justify-center gap-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            startGlobalPlaybackFrom(readingChoice.pageIndex);
                                            setReadingChoice(null);
                                        }}
                                    >
                                        Continue Reading
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            startGlobalPlaybackFrom(0);
                                            setReadingChoice(null);
                                        }}
                                    >
                                        Read from Start
                                    </Button>
                                    <Button variant="outline" onClick={() => setReadingChoice(null)}>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
            <audio ref={audioRef} src="/page-flip.mp3" preload="auto" />
        </Dialog>
    );
}
