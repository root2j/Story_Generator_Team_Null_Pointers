"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Define the steps in your process
const steps = [
    "Starting analyzing content",
    "Analyzing Dialogues",
    "Generating audio",
    "Generating captions",
    "Generating scenes",
    "Video is ready!"
];

interface ProgressProps {
    currentStep: number;
}

const ProgressComponent: React.FC<ProgressProps> = ({ currentStep }) => {

    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) return null;

    const progressPercentage = (currentStep / (steps.length - 1)) * 100;

    return (
        <div className="w-full p-2 md:p-6 rounded-lg backdrop-blur-md shadow-lg">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-4">
                <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-100">
                    Processing...
                </h2>
                {/* Progress Bar */}
                <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                    <motion.div
                        className="h-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                    />
                </div>
            </div>
            {/* Steps List */}
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
                {steps.map((step, index) => (
                    <motion.li
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{
                            opacity: index <= currentStep ? 1 : 0.5,
                            y: index <= currentStep ? 0 : 10,
                        }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                        className={`flex flex-col items-center p-3 rounded-lg border ${index < currentStep
                            ? 'border-green-500'
                            : index === currentStep
                                ? 'border-pink-500'
                                : 'border-gray-300'
                            } bg-white/10 dark:bg-gray-800/30`}
                    >
                        <span
                            className={`mb-2 text-xl ${index < currentStep
                                ? 'text-green-500'
                                : index === currentStep
                                    ? 'text-pink-500'
                                    : 'text-gray-400'
                                }`}
                        >
                            {index < currentStep ? '✔️' : index === currentStep ? '⏳' : '⏺️'}
                        </span>
                        <span className="text-center text-gray-800 dark:text-gray-100 text-sm">
                            {step}
                        </span>
                    </motion.li>
                ))}
            </ul>
        </div>
    );
};

export default ProgressComponent;
