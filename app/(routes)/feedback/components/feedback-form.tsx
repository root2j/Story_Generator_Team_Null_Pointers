"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";


import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FeedbackTypeSelector } from "./feedback-type-selector";
import toast from "react-hot-toast";
import { StarRating } from "./star-rating";
import { FileUpload } from "./file-upload";
import { AISuggestion } from "./ai-suggestions";
import { AnimatedSubmitButton } from "./animated-submit-button";

const MAX_FEEDBACK_LENGTH = 1000;

const feedbackSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    feedbackType: z.enum(["bug", "feature", "general"], {
        required_error: "Please select a feedback type",
    }),
    subject: z.string().min(5, { message: "Subject must be at least 5 characters" }),
    message: z.string()
        .min(10, { message: "Message must be at least 10 characters" })
        .max(MAX_FEEDBACK_LENGTH, { message: `Message cannot exceed ${MAX_FEEDBACK_LENGTH} characters` }),
    satisfaction: z.number().min(0).max(5).optional(),
    usability: z.number().min(0).max(5).optional(),
    designRating: z.number().min(0).max(5).optional(),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

export function FeedbackForm() {
    const [files, setFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [characterCount, setCharacterCount] = useState(0);
    const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("details");

    const form = useForm<FeedbackFormValues>({
        resolver: zodResolver(feedbackSchema),
        defaultValues: {
            name: "",
            email: "",
            feedbackType: "general",
            subject: "",
            message: "",
            satisfaction: 0,
            usability: 0,
            designRating: 0,
        },
    });

    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setCharacterCount(value.length);
        form.setValue("message", value);

        // Simulate AI suggestion after typing
        if (value.length > 20 && !aiSuggestion) {
            setTimeout(() => {
                const suggestions = [
                    "Consider adding more details about your environment.",
                    "Would you like to suggest an alternative approach?",
                    "Adding steps to reproduce would be helpful.",
                    "How long have you been experiencing this issue?",
                    "What impact does this have on your workflow?",
                ];
                setAiSuggestion(suggestions[Math.floor(Math.random() * suggestions.length)]);
            }, 1000);
        }
    };

    const onSubmit = async () => {
        setIsSubmitting(true);

        // Simulate API call
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));

            toast.success("Your feedback has been received!");

            // Reset form
            form.reset();
            setFiles([]);
            setCharacterCount(0);
            setAiSuggestion(null);
            setActiveTab("details");
        } catch (error) {
            console.log(error);
            toast.error("Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTabChange = (value: string) => {
        setActiveTab(value);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-3xl mx-auto"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                        <TabsList className="grid grid-cols-3 mb-8">
                            <TabsTrigger value="details" className="relative">
                                Details
                                {form.formState.errors.name || form.formState.errors.email || form.formState.errors.subject ? (
                                    <Badge variant="destructive" className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center z-10">!</Badge>
                                ) : null}
                            </TabsTrigger>
                            <TabsTrigger value="feedback" className="relative">
                                Feedback
                                {form.formState.errors.feedbackType || form.formState.errors.message ? (
                                    <Badge variant="destructive" className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center">!</Badge>
                                ) : null}
                            </TabsTrigger>
                            <TabsTrigger value="ratings">Ratings</TabsTrigger>
                        </TabsList>

                        <TabsContent value="details" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <motion.div whileTap={{ scale: 0.99 }}>
                                                    <Input placeholder="Your name" {...field} />
                                                </motion.div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <motion.div whileTap={{ scale: 0.99 }}>
                                                    <Input placeholder="your.email@example.com" {...field} />
                                                </motion.div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="subject"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Subject</FormLabel>
                                        <FormControl>
                                            <motion.div whileTap={{ scale: 0.99 }}>
                                                <Input placeholder="Brief summary of your feedback" {...field} />
                                            </motion.div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </TabsContent>

                        <TabsContent value="feedback" className="space-y-6">
                            <FormField
                                control={form.control}
                                name="feedbackType"
                                render={({ field }) => (
                                    <FeedbackTypeSelector
                                        control={form.control}
                                        name="feedbackType"
                                        value={field.value}
                                    />
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Message</FormLabel>
                                        <FormControl>
                                            <motion.div whileTap={{ scale: 0.995 }}>
                                                <Textarea
                                                    placeholder="Please provide detailed feedback..."
                                                    className="min-h-[150px] resize-y"
                                                    {...field}
                                                    onChange={handleMessageChange}
                                                />
                                            </motion.div>
                                        </FormControl>
                                        <div className="flex justify-between items-center mt-2">
                                            <FormDescription>
                                                Be specific and include any relevant details
                                            </FormDescription>
                                            <div className="text-sm text-muted-foreground">
                                                {characterCount}/{MAX_FEEDBACK_LENGTH}
                                            </div>
                                        </div>
                                        <Progress
                                            value={(characterCount / MAX_FEEDBACK_LENGTH) * 100}
                                            className="h-1 mt-1"
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <AISuggestion
                                suggestion={aiSuggestion}
                                onDismiss={() => setAiSuggestion(null)}
                            />

                            <div>
                                <FormLabel>Attachments (Optional)</FormLabel>
                                <FileUpload files={files} setFiles={setFiles} />
                            </div>
                        </TabsContent>

                        <TabsContent value="ratings" className="space-y-6">
                            <div className="space-y-6 py-2">
                                <FormField
                                    control={form.control}
                                    name="satisfaction"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Overall Satisfaction</FormLabel>
                                            <FormControl>
                                                <StarRating
                                                    rating={field.value || 0}
                                                    setRating={(value) => form.setValue("satisfaction", value)}
                                                    label=""
                                                    size="lg"
                                                    allowHalfStars={true}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                How satisfied are you with our product/service?
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="usability"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Usability</FormLabel>
                                            <FormControl>
                                                <StarRating
                                                    rating={field.value || 0}
                                                    setRating={(value) => form.setValue("usability", value)}
                                                    label=""
                                                    size="lg"
                                                    allowHalfStars={true}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                How easy is it to use our product/service?
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="designRating"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Design & Aesthetics</FormLabel>
                                            <FormControl>
                                                <StarRating
                                                    rating={field.value || 0}
                                                    setRating={(value) => form.setValue("designRating", value)}
                                                    label=""
                                                    size="lg"
                                                    allowHalfStars={true}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                How would you rate the visual design?
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </TabsContent>
                    </Tabs>

                    <AnimatedSubmitButton
                        isSubmitting={isSubmitting}
                        text="Submit Feedback"
                    />
                </form>
            </Form>
        </motion.div>
    );
}