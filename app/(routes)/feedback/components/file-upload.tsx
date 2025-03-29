"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import Image from "next/image";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif", "application/pdf"];

interface FileUploadProps {
    files: File[];
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export function FileUpload({ files, setFiles }: FileUploadProps) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const validFiles = acceptedFiles.filter(
            (file) =>
                ALLOWED_FILE_TYPES.includes(file.type) &&
                file.size <= MAX_FILE_SIZE
        );

        if (validFiles.length !== acceptedFiles.length) {
            toast.error("Some files were rejected. Please check file type and size (max 5MB).");
        }

        setFiles((prev) => [...prev, ...validFiles]);
    }, [setFiles]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
            'application/pdf': ['.pdf'],
        },
        maxSize: MAX_FILE_SIZE,
    });

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div>
            <div
                {...getRootProps()}
                className={`
          mt-2 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-colors
          ${isDragActive
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/20 hover:border-muted-foreground/30"
                    }
        `}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium">
                        {isDragActive
                            ? "Drop the files here..."
                            : "Drag & drop files here, or click to select files"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Supports: JPG, PNG, GIF, PDF (Max 5MB)
                    </p>
                </div>
            </div>

            {files.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4"
                >
                    <p className="text-sm font-medium">Attached Files:</p>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                        <AnimatePresence>
                            {files.map((file, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="relative group bg-secondary/50 rounded-lg p-2 flex flex-col items-center justify-center"
                                >
                                    {file.type.startsWith("image/") ? (
                                        <div className="relative w-24 h-24 overflow-hidden rounded-lg">
                                            <Image
                                                src={URL.createObjectURL(file)}
                                                alt="Preview"
                                                layout="fill"
                                                objectFit="cover"
                                                className="rounded-lg"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-24 h-24 flex items-center justify-center bg-primary/10 rounded-lg">
                                            <span className="text-xs font-medium">
                                                {file.name.split('.').pop()?.toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-b-lg truncate w-full text-center">
                                        {file.name}
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-1 right-1 h-6 w-6 rounded-full bg-white shadow-md"
                                        onClick={() => removeFile(index)}
                                    >
                                        <X className="h-4 w-4 text-black" />
                                    </Button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
        </div>
    );
}