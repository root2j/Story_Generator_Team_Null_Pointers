"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function GradientBackground() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
            >
                <div
                    className={`absolute -inset-[10px] opacity-30 ${theme === "dark" ? "bg-gradient-dark" : "bg-gradient-light"
                        }`}
                />
                <div className="absolute inset-0 backdrop-blur-[100px]" />
            </motion.div>
        </div>
    );
}