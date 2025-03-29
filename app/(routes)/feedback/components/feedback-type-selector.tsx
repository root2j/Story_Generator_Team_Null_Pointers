"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bug, Lightbulb, MessageSquare } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Control, FieldValues, Path, useController } from "react-hook-form";

interface FeedbackTypeSelectorProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    value: string;
}

export function FeedbackTypeSelector<T extends FieldValues>({
    control,
    name,
    value,
}: FeedbackTypeSelectorProps<T>) {
    const { field } = useController({ name, control });

    const feedbackTypeIcons = {
        bug: <Bug className="h-5 w-5" />,
        feature: <Lightbulb className="h-5 w-5" />,
        general: <MessageSquare className="h-5 w-5" />,
    };

    return (
        <FormItem className="space-y-3">
            <FormLabel>Feedback Type</FormLabel>
            <FormControl>
                <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={value}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    {(["bug", "feature", "general"] as const).map((type) => (
                        <motion.div
                            key={type}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1"
                        >
                            <Card className={`cursor-pointer border-2 transition-all ${field.value === type
                                ? "border-primary bg-primary/5 dark:bg-primary/10"
                                : "hover:border-muted-foreground/20"
                                }`}>
                                <CardContent className="flex items-center space-x-2">
                                    <RadioGroupItem value={type} id={type} className="sr-only" />
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                                        {feedbackTypeIcons[type]}
                                    </div>
                                    <div className="font-medium capitalize">{type}</div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </RadioGroup>
            </FormControl>
            <FormMessage />
        </FormItem>
    );
}