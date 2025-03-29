import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

const NoResponse = () => {
    return (
        <motion.div
            className="relative flex flex-col items-center justify-center w-full h-full text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            {/* Floating Icon with a Soft Glow */}
            <motion.div
                className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full shadow-md"
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
                <AlertCircle className="w-10 h-10 text-red-500 animate-pulse" />
            </motion.div>

            {/* Glitching Text Effect */}
            <motion.p
                className="mt-4 text-lg font-semibold text-gray-600 dark:text-gray-300"
                animate={{
                    opacity: [1, 0.8, 1],
                    x: [0, -1, 1, 0],
                }}
                transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut",
                }}
            >
                Oops! No response available.
            </motion.p>

            {/* AI-Themed Subtext with a Glow */}
            <motion.p
                className="mt-2 text-sm text-gray-400 dark:text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
            >
                Look like you have not yet started the conversation.
            </motion.p>
        </motion.div>
    );
};

export default NoResponse;
