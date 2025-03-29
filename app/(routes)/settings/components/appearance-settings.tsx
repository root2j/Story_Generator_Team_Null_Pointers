"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Paintbrush, Monitor, Moon, Sun, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AppearanceSettings() {
    const { theme, setTheme } = useTheme();
    const [animationsEnabled, setAnimationsEnabled] = useState(true);
    const [fontSize, setFontSize] = useState("medium");
    const [density, setDensity] = useState("default");
    const [colorScheme, setColorScheme] = useState("default");

    const handleSave = () => {
        toast.success("Your appearance preferences have been updated.",);
    };

    const themeOptions = [
        {
            value: "light",
            label: "Light",
            icon: Sun,
        },
        {
            value: "dark",
            label: "Dark",
            icon: Moon,
        },
        {
            value: "system",
            label: "System",
            icon: Monitor,
        },
    ];

    const fontSizeOptions = [
        { value: "small", label: "Small" },
        { value: "medium", label: "Medium" },
        { value: "large", label: "Large" },
    ];

    const densityOptions = [
        { value: "compact", label: "Compact" },
        { value: "default", label: "Default" },
        { value: "comfortable", label: "Comfortable" },
    ];

    const colorSchemes = [
        { value: "default", label: "Default", colors: ["#000000", "#ffffff"] },
        { value: "blue", label: "Blue", colors: ["#1e40af", "#3b82f6", "#93c5fd"] },
        { value: "green", label: "Green", colors: ["#166534", "#22c55e", "#86efac"] },
        { value: "purple", label: "Purple", colors: ["#581c87", "#a855f7", "#d8b4fe"] },
        { value: "orange", label: "Orange", colors: ["#9a3412", "#f97316", "#fed7aa"] },
    ];

    return (
        <Tabs defaultValue="theme">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="theme">Theme</TabsTrigger>
                <TabsTrigger value="display">Display</TabsTrigger>
                <TabsTrigger value="colors">Colors</TabsTrigger>
            </TabsList>

            <TabsContent value="theme" className="space-y-4 pt-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Paintbrush className="mr-2 h-5 w-5 text-primary" />
                            Theme Preferences
                        </CardTitle>
                        <CardDescription>
                            Customize how the application looks and feels.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Theme Mode</Label>
                                <div className="grid grid-cols-3 gap-4">
                                    {themeOptions.map((option) => {
                                        const Icon = option.icon;
                                        return (
                                            <motion.div
                                                key={option.value}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setTheme(option.value)}
                                            >
                                                <div
                                                    className={`relative flex flex-col items-center justify-center rounded-md border-2 p-4 ${theme === option.value
                                                        ? "border-primary bg-primary/10"
                                                        : "border-border hover:border-primary/50"
                                                        }`}
                                                >
                                                    {theme === option.value && (
                                                        <div className="absolute right-2 top-2 h-4 w-4 text-primary">
                                                            <Check className="h-4 w-4" />
                                                        </div>
                                                    )}
                                                    <Icon className="mb-2 h-6 w-6" />
                                                    <span className="text-sm">{option.label}</span>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="animations">Interface Animations</Label>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setAnimationsEnabled(!animationsEnabled)}
                                    >
                                        {animationsEnabled ? "Disable" : "Enable"}
                                    </Button>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {animationsEnabled
                                        ? "Animations are currently enabled for a more dynamic experience."
                                        : "Animations are currently disabled for improved performance."}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="display" className="space-y-4 pt-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Display Settings</CardTitle>
                        <CardDescription>
                            Adjust how content is displayed throughout the application.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Font Size</Label>
                                <RadioGroup
                                    value={fontSize}
                                    onValueChange={setFontSize}
                                    className="grid grid-cols-3 gap-4"
                                >
                                    {fontSizeOptions.map((option) => (
                                        <div key={option.value}>
                                            <RadioGroupItem
                                                value={option.value}
                                                id={`font-size-${option.value}`}
                                                className="peer sr-only"
                                            />
                                            <Label
                                                htmlFor={`font-size-${option.value}`}
                                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                            >
                                                <span className="text-sm">{option.label}</span>
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>

                            <div className="space-y-2">
                                <Label>Interface Density</Label>
                                <RadioGroup
                                    value={density}
                                    onValueChange={setDensity}
                                    className="grid grid-cols-3 gap-4"
                                >
                                    {densityOptions.map((option) => (
                                        <div key={option.value}>
                                            <RadioGroupItem
                                                value={option.value}
                                                id={`density-${option.value}`}
                                                className="peer sr-only"
                                            />
                                            <Label
                                                htmlFor={`density-${option.value}`}
                                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                            >
                                                <span className="text-sm">{option.label}</span>
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="colors" className="space-y-4 pt-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Color Scheme</CardTitle>
                        <CardDescription>
                            Choose a color scheme for the application.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {colorSchemes.map((scheme) => (
                                <motion.div
                                    key={scheme.value}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setColorScheme(scheme.value)}
                                >
                                    <div
                                        className={`relative flex flex-col items-center justify-center rounded-md border-2 p-4 ${colorScheme === scheme.value
                                            ? "border-primary"
                                            : "border-border hover:border-primary/50"
                                            }`}
                                    >
                                        {colorScheme === scheme.value && (
                                            <div className="absolute right-2 top-2 h-4 w-4 text-primary">
                                                <Check className="h-4 w-4" />
                                            </div>
                                        )}
                                        <div className="flex space-x-1 mb-2">
                                            {scheme.colors.map((color, i) => (
                                                <div
                                                    key={i}
                                                    className="h-4 w-4 rounded-full"
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm">{scheme.label}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex justify-end mt-6"
            >
                <Button onClick={handleSave}>
                    Save appearance settings
                </Button>
            </motion.div>
        </Tabs>
    );
}