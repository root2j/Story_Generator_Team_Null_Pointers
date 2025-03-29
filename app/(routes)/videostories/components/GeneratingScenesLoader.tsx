import { motion } from "framer-motion";
import { Loader, Sparkles } from "lucide-react";

const GeneratingScenesLoader = () => {
    return (
        <div className="flex flex-col rounded-md items-center justify-center w-full h-full py-12 relative overflow-hidden">
            {/* Animated Neon Background Gradient */}
            <motion.div
                className="absolute inset-0"
                animate={{
                    background: [
                        "linear-gradient(135deg, rgba(255,105,180,0.3), rgba(0,255,255,0.3))",
                        "linear-gradient(135deg, rgba(0,255,255,0.3), rgba(75,0,130,0.3))",
                        "linear-gradient(135deg, rgba(75,0,130,0.3), rgba(255,105,180,0.3))"
                    ]
                }}
                transition={{ duration: 10, repeat: Infinity, repeatType: "mirror" }}
            />

            {/* Neon Sparkles Effect */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
            >
                <div className="absolute top-8 left-1/4 animate-pulse text-pink-500 drop-shadow-[0_0_8px_rgba(255,105,180,0.8)]">
                    <Sparkles size={28} />
                </div>
                <div className="absolute bottom-10 right-1/3 animate-pulse text-cyan-500 drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]">
                    <Sparkles size={34} />
                </div>
                <div className="absolute top-1/2 right-1/4 animate-pulse text-lime-500 drop-shadow-[0_0_8px_rgba(57,255,20,0.8)]">
                    <Sparkles size={24} />
                </div>
                <div className="absolute bottom-1/3 left-1/3 animate-pulse text-blue-500 drop-shadow-[0_0_8px_rgba(0,0,255,0.8)]">
                    <Sparkles size={30} />
                </div>
            </motion.div>

            {/* Main Loader Message with Neon Glow */}
            <motion.div
                className="flex items-center space-x-4 bg-gradient-to-r from-pink-500 to-cyan-500 px-6 py-3 rounded-full shadow-2xl"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
            >
                <Loader className="animate-spin text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]" size={28} />
                <span className="text-xl font-bold text-white drop-shadow-[0_0_10px_rgba(0,0,0,0.7)]">
                    Generating your scenes...
                </span>
            </motion.div>

            {/* Supporting Neon Message */}
            <motion.div
                className="px-10 flex flex-col text-center mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.5 }}
            >
                <span className="text-2xl font-bold bg-gradient-to-r from-lime-500 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(57,255,20,0.8)] animate-pulse">
                    &quot;Sit back and relax while the magic unfolds!&quot;
                </span>
                <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(255,105,180,0.8)] animate-pulse">
                    Don&apos;t Go Anywhere! Else The Magic Will Vanish
                </span>
            </motion.div>
        </div>
    );
};

export default GeneratingScenesLoader;
