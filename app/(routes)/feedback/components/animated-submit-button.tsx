"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface AnimatedSubmitButtonProps {
    isSubmitting: boolean;
    text: string;
    loadingText?: string;
}

export function AnimatedSubmitButton({
    isSubmitting,
    text,
    loadingText = "Submitting...",
}: AnimatedSubmitButtonProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="pt-2"
        >
            <Button
                type="submit"
                className="w-full relative overflow-hidden group"
                disabled={isSubmitting}
            >
                <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isSubmitting ? loadingText : text}
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></span>
            </Button>
        </motion.div>
    );
}