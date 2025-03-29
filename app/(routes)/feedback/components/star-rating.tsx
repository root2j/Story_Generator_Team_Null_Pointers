"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
    rating: number;
    setRating: (rating: number) => void;
    count?: number;
    size?: "sm" | "md" | "lg";
    color?: string;
    hoverColor?: string;
    className?: string;
    allowHalfStars?: boolean;
    label?: string;
    showRatingText?: boolean;
}

export function StarRating({
    rating,
    setRating,
    count = 5,
    size = "md",
    hoverColor = "text-yellow-500",
    className,
    allowHalfStars = true,
    label = "Rating",
    showRatingText = true,
}: StarRatingProps) {
    const [hoverRating, setHoverRating] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-6 w-6",
        lg: "h-8 w-8",
    };

    const starSize = sizeClasses[size];

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
        if (!isDragging) return;

        const { left, width } = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - left) / width;

        let value = index;
        if (allowHalfStars && percent <= 0.5) {
            value -= 0.5;
        }

        setHoverRating(value);
    };

    const handleClick = (index: number, e: React.MouseEvent<HTMLDivElement>) => {
        const { left, width } = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - left) / width;

        let value = index;
        if (allowHalfStars && percent <= 0.5) {
            value -= 0.5;
        }

        setRating(value);
    };

    const handleMouseDown = () => {
        setIsDragging(true);
    };

    const handleMouseUp = () => {
        if (isDragging && hoverRating > 0) {
            setRating(hoverRating);
        }
        setIsDragging(false);
        setHoverRating(0);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
        setHoverRating(0);
    };

    const getRatingText = (rating: number) => {
        if (rating === 0) return "Not rated";
        if (rating <= 1) return "Poor";
        if (rating <= 2) return "Fair";
        if (rating <= 3) return "Good";
        if (rating <= 4) return "Very Good";
        return "Excellent";
    };

    return (
        <div className={cn("flex flex-col gap-1.5", className)}>
            {label && <label className="text-sm font-medium">{label}</label>}
            <div
                className="flex items-center gap-1"
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
            >
                {Array.from({ length: count }).map((_, i) => {
                    const index = i + 1;
                    const isHalfStar =
                        allowHalfStars &&
                        ((hoverRating > 0 ? hoverRating : rating) === index - 0.5);
                    const isActiveStar =
                        (hoverRating > 0 ? hoverRating : rating) >= index;
                    const isActiveHalfStar =
                        allowHalfStars &&
                        ((hoverRating > 0 ? hoverRating : rating) >= index - 0.5) &&
                        !isActiveStar;

                    return (
                        <motion.div
                            key={i}
                            className="relative cursor-pointer"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onMouseMove={(e) => handleMouseMove(e, index)}
                            onMouseDown={handleMouseDown}
                            onClick={(e) => handleClick(index, e)}
                        >
                            {isHalfStar ? (
                                <StarHalf
                                    className={cn(
                                        starSize,
                                        "transition-colors",
                                        isActiveHalfStar || isActiveStar ? hoverColor : "text-muted-foreground/30"
                                    )}
                                />
                            ) : (
                                <Star
                                    className={cn(
                                        starSize,
                                        "transition-colors",
                                        isActiveStar ? hoverColor : "text-muted-foreground/30",
                                        isActiveHalfStar && "text-yellow-400/50"
                                    )}
                                    fill={isActiveStar ? "currentColor" : "none"}
                                />
                            )}
                        </motion.div>
                    );
                })}

                {showRatingText && (
                    <div className="ml-2 text-sm font-medium">
                        {rating > 0 ? (
                            <motion.span
                                key={rating}
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-block"
                            >
                                {getRatingText(rating)} ({rating})
                            </motion.span>
                        ) : (
                            <span className="text-muted-foreground">Not rated</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}