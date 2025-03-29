"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    PenLine,
    Mic,
    Video,
    Sparkles,
    Heart,
    Share2,
    MoreVertical,
    BookOpen,
    Clock,
    Star,
    Eye,
    MessageCircle,
    Bookmark,
    User
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

const storyCategories = ["All Stories", "Fantasy", "Mystery", "Fiction", "SciFi", "Adventure", "Horror", "Romance"];

const stories = [
    {
        id: 1,
        title: "The Lost Kingdom",
        category: "Fantasy",
        coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=500",
        isPremium: true,
        author: "Elena Rivers",
        readTime: "15 min",
        rating: 4.8,
        views: 12500,
        comments: 89,
        likes: 2341,
        description: "A tale of magic and mystery in an ancient realm.",
        tags: ["Epic Fantasy", "Magic", "Adventure"]
    },
    {
        id: 2,
        title: "Midnight Mystery",
        category: "Mystery",
        coverImage: "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?auto=format&fit=crop&q=80&w=500",
        isPremium: false,
        author: "James Blake",
        readTime: "12 min",
        rating: 4.5,
        views: 8900,
        comments: 67,
        likes: 1567,
        description: "A gripping detective story in the heart of London.",
        tags: ["Detective", "Thriller", "Crime"]
    },
    {
        id: 3,
        title: "Eternal Love",
        category: "Romance",
        coverImage: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?auto=format&fit=crop&q=80&w=500",
        isPremium: true,
        author: "Sarah Heart",
        readTime: "18 min",
        rating: 4.9,
        views: 15600,
        comments: 156,
        likes: 3789,
        description: "A timeless romance that spans centuries.",
        tags: ["Romance", "Historical", "Drama"]
    },
    {
        id: 4,
        title: "Galaxy's Edge",
        category: "Sci-Fi",
        coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=500",
        isPremium: true,
        author: "Alex Nova",
        readTime: "20 min",
        rating: 4.7,
        views: 11200,
        comments: 94,
        likes: 2156,
        description: "An epic space adventure at the edge of known space.",
        tags: ["Space Opera", "Adventure", "AI"]
    },
    {
        id: 5,
        title: "Mountain Quest",
        category: "Adventure",
        coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=500",
        isPremium: false,
        author: "Chris Peak",
        readTime: "25 min",
        rating: 4.6,
        views: 9800,
        comments: 78,
        likes: 1890,
        description: "A thrilling journey to the world's highest peaks.",
        tags: ["Adventure", "Nature", "Survival"]
    },
    {
        id: 6,
        title: "Haunted Manor",
        category: "Horror",
        coverImage: "https://images.unsplash.com/photo-1520263115673-610416f52ab6?auto=format&fit=crop&q=80&w=500",
        isPremium: true,
        author: "Mary Shadows",
        readTime: "16 min",
        rating: 4.4,
        views: 13400,
        comments: 167,
        likes: 2789,
        description: "A spine-chilling tale of supernatural encounters.",
        tags: ["Horror", "Supernatural", "Mystery"]
    }
];

const creationMethods = [
    {
        title: "Create Story by Prompt",
        description: "Use AI to generate unique stories from your prompts",
        icon: Sparkles,
        gradient: "from-purple-500 to-pink-500",
        link: "/createprompt"
    },
    {
        title: "Create Story Manually",
        description: "Write your own story from scratch",
        icon: PenLine,
        gradient: "from-blue-500 to-cyan-500",
        link: "/storymanually"
    },
    {
        title: "Audiobooks",
        description: "Convert your stories into audiobooks",
        icon: Mic,
        gradient: "from-green-500 to-emerald-500",
        link: "/audiobooks"
    },
    {
        title: "Video Stories",
        description: "Transform stories into animated videos",
        icon: Video,
        gradient: "from-orange-500 to-yellow-500",
        link: "/videostories"
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
        },
    },
};

interface Story {
    id: string;
    storypromptId: string;
    storyTitle: string;
    storyPrompt: string;
    storyType: string;
    ageGroup: string;
    writingStyle: string;
    complexity: number[];
    bookCoverImage: string;
    chapterTexts: string[];
    chapterImages: string[];
    createdAt: string;
}

export default function OverviewComponent() {
    const [selectedCategory, setSelectedCategory] = useState("All Stories");
    const [likedStories, setLikedStories] = useState<number[]>([]);
    const [savedStories, setSavedStories] = useState<number[]>([]);

    const [storyData, setStoryData] = useState<Story[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const user = useUser();

    const filteredStories = selectedCategory === "All Stories"
        ? storyData
        : storyData.filter(story => story.storyType.toLowerCase() === selectedCategory.toLowerCase());

    const toggleLike = (id: number) => {
        setLikedStories(prev =>
            prev.includes(id) ? prev.filter(storyId => storyId !== id) : [...prev, id]
        );
    };

    const toggleSave = (id: number) => {
        setSavedStories(prev =>
            prev.includes(id) ? prev.filter(storyId => storyId !== id) : [...prev, id]
        );
    };

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await fetch("/api/save-promptstory");
                if (!response.ok) {
                    throw new Error("Failed to fetch stories");
                }
                const data = await response.json();
                setStoryData(data.stories);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchStories();
    }, []);

    return (
        <div className="min-h-screen p-6 space-y-8">
            <div className="w-full mx-auto">
                <motion.h1
                    className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Story Dashboard
                </motion.h1>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                >
                    {creationMethods.map((method, index) => (
                        <motion.div
                            key={method.title + index}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Card className="premium-card h-full cursor-pointer">
                                <CardHeader>
                                    <Link href={method.link}>
                                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${method.gradient} flex items-center justify-center mb-4`}>
                                            <method.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <CardTitle className="text-xl">{method.title}</CardTitle>
                                        <CardDescription>{method.description}</CardDescription>
                                    </Link>
                                </CardHeader>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                <Tabs defaultValue="All Stories" className="space-y-4">
                    <TabsList className="flex space-x-2 overflow-x-auto bg-background/50 backdrop-blur-lg p-1 rounded-full">
                        {storyCategories.map((category) => (
                            <TabsTrigger
                                key={category}
                                value={category}
                                onClick={() => setSelectedCategory(category)}
                                className="px-4 py-2 rounded-full"
                            >
                                {category}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <AnimatePresence mode="wait">
                        <TabsContent value={selectedCategory} className="mt-6">
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            >
                                {filteredStories.map((story) => (
                                    <motion.div
                                        key={story.id}
                                        variants={itemVariants}
                                        whileHover={{
                                            y: -5,
                                            transition: { duration: 0.2 }
                                        }}
                                        className="premium-card rounded-xl overflow-hidden group"
                                    >
                                        <div className="relative aspect-[3/4]">
                                            <img
                                                src={story.bookCoverImage}
                                                alt={story.storyType}
                                                className="object-cover w-full h-full rounded-t-xl transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            {story.storyType && (
                                                <div className="premium-badge">
                                                    {story.storyType}
                                                </div>
                                            )}
                                            <motion.div
                                                className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                            >
                                                <h3 className="font-semibold text-lg mb-1 line-clamp-1">{story.storyTitle}</h3>
                                                <p className="text-sm text-gray-200">
                                                    {story.storyPrompt.split(" ").slice(0, 10).join(" ")}...
                                                </p>
                                            </motion.div>
                                        </div>

                                        <CardContent className="p-4 space-y-4 relative bg-gradient-to-b from-background/80 to-background backdrop-blur-md">
                                            <div className="flex items-center space-x-2">
                                                <div className="flex items-center space-x-2 text-sm">
                                                    <User className="w-4 h-4" />
                                                    <span className="font-medium">{user.user?.fullName}</span>
                                                </div>
                                                <span className="text-muted-foreground">•</span>
                                                <div className="flex items-center text-sm text-muted-foreground">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    {story.createdAt}
                                                </div>
                                            </div>

                                            {/* <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex items-center">
                                                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                                        <span className="font-medium">{story.rating}</span>
                                                    </div>
                                                    <div className="flex items-center text-muted-foreground">
                                                        <Eye className="w-4 h-4 mr-1" />
                                                        {story.views.toLocaleString()}
                                                    </div>
                                                    <div className="flex items-center text-muted-foreground">
                                                        <MessageCircle className="w-4 h-4 mr-1" />
                                                        {story.comments}
                                                    </div>
                                                </div>
                                            </div> */}

                                            {/* <div className="flex flex-wrap gap-2">
                                                {story.tags.map((tag, index) => (
                                                    <Badge key={index} variant="secondary" className="text-xs">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div> */}

                                            <div className="flex items-center justify-between pt-2 border-t border-border">
                                                <div className="flex space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className={`hover:text-rose-500 ${likedStories.includes(Number(story.id)) ? 'text-rose-500' : ''}`}
                                                        onClick={() => toggleLike(Number(story.id))}
                                                    >
                                                        <Heart className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className={`hover:text-blue-500 ${savedStories.includes(Number(story.id)) ? 'text-blue-500' : ''}`}
                                                        onClick={() => toggleSave(Number(story.id))}
                                                    >
                                                        <Bookmark className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="hover:text-blue-500">
                                                        <Share2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            <BookOpen className="w-4 h-4 mr-2" /> Read Now
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem>Download</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </CardContent>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </TabsContent>
                    </AnimatePresence>
                </Tabs>
            </div>
        </div>
    );
}