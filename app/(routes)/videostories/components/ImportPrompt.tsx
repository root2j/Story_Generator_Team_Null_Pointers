import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { CloudAlert, FileUp } from 'lucide-react'
import React, { useRef } from 'react'
import toast from 'react-hot-toast'
import * as pdfjs from "pdfjs-dist";

// Configure PDF.js worker (client-side only)
if (typeof window !== "undefined") {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
}


interface ImportPromptProps {
    isImportDialogOpen: boolean
    setIsImportDialogOpen: (open: boolean) => void
    isProcessing: boolean
    setIsProcessing: (isProcessing: boolean) => void
    setContent: (content: string) => void
}

const ImportPrompt: React.FC<ImportPromptProps> = ({ isImportDialogOpen, setIsImportDialogOpen, isProcessing, setIsProcessing, setContent }) => {

    const textFileRef = useRef<HTMLInputElement>(null);
    const pdfFileRef = useRef<HTMLInputElement>(null);

    async function fetchExtractedData(content: string) {
        try {
            const response = await fetch("/api/prompt-cleanerai", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }

            const textData = await response.text();
            return textData;
        } catch (error) {
            console.error("Error fetching data:", error);
            return "Error fetching data";
        }
    }


    const readFileAsText = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result?.toString() || "");
            reader.onerror = reject;
            reader.readAsText(file);
        });
    };

    const readFileAsPdf = async (file: File): Promise<string> => {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const pdf = await pdfjs.getDocument(uint8Array).promise;
        let extractedText = "";

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            extractedText += textContent.items
                .map((item) => ("str" in item ? item.str : ""))
                .join(" ") + "\n";
        }

        const response = await fetchExtractedData(extractedText.trim());

        return response;
    };

    const handleFileRead = async (file: File, type: "text" | "pdf") => {
        try {
            setIsProcessing(true);
            const content = await (type === "text" ? readFileAsText(file) : readFileAsPdf(file));
            setContent(content);
            setIsImportDialogOpen(false);
            toast.success(`${type.toUpperCase()} imported successfully`);
        } catch (error) {
            console.error("File processing error:", error);
            toast.error(`Failed to process ${type.toUpperCase()} file`);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleFileChange = (type: "text" | "pdf") => (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            toast.error("File size exceeds 10MB limit");
            return;
        }

        handleFileRead(file, type);
        e.target.value = ""; // Reset input to allow re-uploading the same file
    };

    return (
        <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
            <DialogTrigger asChild>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                        "flex items-center justify-center gap-2 px-4 py-2 rounded-lg w-full",
                        "text-sm font-medium text-white",
                        "bg-gradient-to-r from-indigo-500 to-pink-500",
                        "hover:opacity-90 transition-all duration-300",
                        "shadow-lg shadow-indigo-500/20",
                        isProcessing && "opacity-75 cursor-not-allowed"
                    )}
                    disabled={isProcessing}
                >
                    <CloudAlert className="h-4 w-4" />
                    {isProcessing ? "Processing..." : "Import Prompt"}
                </motion.button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-lg bg-white dark:bg-slate-900 p-6">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                        Import Character Data
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-3">
                    <Button
                        variant="outline"
                        className="h-12 text-base gap-3 hover:bg-indigo-50 dark:hover:bg-indigo-900 transition-colors"
                        onClick={() => textFileRef.current?.click()}
                    >
                        <FileUp className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
                        Text File (.txt)
                    </Button>
                    <Button
                        variant="outline"
                        className="h-12 text-base gap-3 hover:bg-purple-50 dark:hover:bg-purple-900 transition-colors"
                        onClick={() => pdfFileRef.current?.click()}
                    >
                        <FileUp className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                        PDF File (.pdf)
                    </Button>
                </div>
                <input
                    type="file"
                    ref={textFileRef}
                    accept=".txt, text/plain"
                    hidden
                    onChange={handleFileChange("text")}
                />
                <input
                    type="file"
                    ref={pdfFileRef}
                    accept=".pdf, application/pdf"
                    hidden
                    onChange={handleFileChange("pdf")}
                />
            </DialogContent>
        </Dialog>
    )
}

export default ImportPrompt