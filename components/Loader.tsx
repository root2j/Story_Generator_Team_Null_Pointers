import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function WebsiteLoader() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 4000); // Simulate loading time
    }, []);

    if (!loading) return null; // Hide loader when done

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
            {/* Background Stars */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-full h-full bg-gradient-to-b from-black via-gray-900 to-black opacity-60"></div>
                <div className="absolute w-full h-full animate-[starsMove_30s_linear_infinite] bg-[url('/stars.png')] opacity-50"></div>
            </div>

            {/* Rotating Glowing Orb */}
            <motion.div
                className="relative w-32 h-32 rounded-full bg-violet-600 shadow-[0_0_40px_10px_rgba(138,43,226,0.7)]"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
            ></motion.div>

            {/* AI Storytelling Text */}
            <motion.h1
                className="absolute text-2xl md:text-4xl text-white font-extrabold tracking-wide"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            >
                Ascension Studio Loading...
            </motion.h1>
        </div>
    );
}
