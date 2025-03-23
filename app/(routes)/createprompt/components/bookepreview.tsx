"use client";
import React, { useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { convert } from "html-to-text";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface BookPreviewProps {
    content: string;
    isOpen: boolean;
    onClose: () => void;
}

interface PageProps {
    number: number;
    content: string;
    isCover?: boolean;
    isBlank?: boolean;
    image?: string;
}

const Page = React.forwardRef<HTMLDivElement, PageProps>(({ number, content, isCover, isBlank, image }, ref) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const speechSynthesis = typeof window !== "undefined" ? window.speechSynthesis : null;
    let utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    const toggleSpeech = () => {
        if (!speechSynthesis) return;

        if (isPlaying) {
            speechSynthesis.cancel();
            setIsPlaying(false);
        } else {
            const utterance = new SpeechSynthesisUtterance(content);
            utterance.onend = () => setIsPlaying(false); // Ensure button resets when speech ends
            speechSynthesis.speak(utterance);
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
            className={`relative h-full w-full shadow-xl rounded-lg overflow-hidden border border-gray-700 p-6 bg-white 
                ${isCover ? "bg-gradient-to-br from-yellow-400 to-red-500 text-white text-3xl font-bold flex items-center justify-center" : ""} 
                ${isBlank ? "bg-gray-200" : ""}`}
        >
            {image ? (
                <img src={image} alt="Cover" className="w-full h-full object-cover" />
            ) : isCover ? (
                <div className="text-center">{content}</div>
            ) : isBlank ? null : (
                <div className="absolute inset-0 p-8 text-justify text-lg leading-relaxed text-black overflow-y-auto">
                    {content.split("\n").map((paragraph, index) => (
                        <p key={index} className="mb-4">{paragraph}</p>
                    ))}
                </div>
            )}
            {!isCover && !isBlank && (
                <>
                    <div className="absolute bottom-4 right-4 text-sm text-gray-600">{number}</div>
                    <Button variant="secondary" size="sm" className="absolute top-2 right-2" onClick={toggleSpeech}>
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>
                </>
            )}
        </motion.div>
    );
});

Page.displayName = "Page";


const coverImage = "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";
const backCoverImage = coverImage;

export function BookPreview({ content, isOpen, onClose }: BookPreviewProps) {
    const book = useRef<any>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [currentPage, setCurrentPage] = useState(0);

    const plainText = convert(content, { wordwrap: 80 });
    const paragraphs = plainText.split("\n").filter(p => p.trim() !== "");
    const wordsPerPage = 80;

    const pages = paragraphs.reduce((acc: string[], paragraph) => {
        let lastPage = acc[acc.length - 1];
        if (!lastPage || lastPage.split(" ").length + paragraph.split(" ").length > wordsPerPage) {
            acc.push(paragraph);
        } else {
            acc[acc.length - 1] = `${lastPage}\n${paragraph}`;
        }
        return acc;
    }, []);

    pages.unshift("📖 My Amazing Book");
    pages.push("📚 The End");

    const playFlipSound = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        }
    };

    const handleFlip = (e: any) => {
        if (!book.current) return;

        const pageNumber = e.data;
        const leftPageNumber = Math.floor(pageNumber / 2) + 1;

        if (leftPageNumber !== currentPage) {
            setCurrentPage(leftPageNumber);
            playFlipSound();
        }
    };

    const nextPage = () => {
        if (book.current && currentPage < pages.length - 1) {
            book.current.pageFlip().flipNext();
        }
    };

    const prevPage = () => {
        if (book.current && currentPage > 0) {
            book.current.pageFlip().flipPrev();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-full" style={{ maxWidth: "1000px" }}>
                <div className="max-w-6xl w-full h-full p-0 gap-0 flex flex-col items-center">
                    <DialogTitle>
                        <VisuallyHidden>Book Preview</VisuallyHidden>
                    </DialogTitle>
                    <AnimatePresence>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="relative w-full max-w-6xl flex items-center justify-center">
                            <HTMLFlipBook
                                width={600}
                                height={750}
                                size="stretch"
                                minWidth={300}
                                maxWidth={1200}
                                minHeight={400}
                                maxHeight={1000}
                                showCover={true}
                                maxShadowOpacity={0.4}
                                ref={book}
                                onFlip={handleFlip}
                                className="shadow-2xl rounded-lg overflow-hidden"
                                startPage={0}
                                drawShadow={true}
                                flippingTime={800}
                                usePortrait={true}
                                startZIndex={10}
                                autoSize={true}
                                mobileScrollSupport={true}
                                clickEventForward={true}
                                useMouseEvents={true}
                                swipeDistance={30}
                                showPageCorners={true}
                                disableFlipByClick={false}
                                style={{ backgroundColor: "transparent" }}
                            >
                                <Page number={0} content="" isBlank image={coverImage} />
                                {pages.map((pageContent, index) => (
                                    <Page key={index} number={index} content={pageContent} />
                                ))}
                                <Page number={pages.length} content="" isBlank image={backCoverImage} />
                            </HTMLFlipBook>
                        </motion.div>
                    </AnimatePresence>

                    <div className="mt-4 flex items-center gap-4">
                        <Button variant="outline" size="icon" onClick={prevPage} disabled={currentPage <= 1}>
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={nextPage} disabled={currentPage >= pages.length - 1}>
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
            <audio ref={audioRef} src="/page-flip.mp3" preload="auto" />
        </Dialog>
    );
}
