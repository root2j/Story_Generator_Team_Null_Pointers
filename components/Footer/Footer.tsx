import { motion } from "framer-motion";

const Footer = () => {
    return (
        <motion.footer
            className="relative flex items-center justify-center p-[3px] dark:bg-slate-900 bg-slate-100 shadow-lg rounded-md overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            {/* Animated Gradient Border */}
            <div className="absolute inset-0 border-2 border-transparent rounded-md">
                <motion.div
                    className="absolute inset-0 rounded-md"
                    style={{
                        background: "linear-gradient(90deg, #3b82f6, #9333ea, #e11d48, #facc15)",
                        backgroundSize: "400% 400%",
                        animation: "gradientMove 6s infinite linear",
                    }}
                />
            </div>

            <div className="relative dark:bg-slate-800 bg-white h-full w-full py-7 rounded-md z-10 text-center">
                <p className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()}{" "}
                    <span className="font-bold text-blue-700">Null Pointers Studio</span>. All rights reserved.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 italic">
                    &quot;AI transforms imagination into reality—one intelligent creation at a time.&quot;
                </p>
            </div>

            <style jsx>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
        </motion.footer>
    );
};

export default Footer;
