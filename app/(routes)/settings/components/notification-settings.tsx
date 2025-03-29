"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Mail, Smartphone } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

type NotificationType = "marketing" | "social" | "security";

export function NotificationSettings() {
    const [isLoading, setIsLoading] = useState(false);
    const [settings, setSettings] = useState({
        email: {
            marketing: true,
            social: true,
            security: true,
        },
        push: {
            marketing: false,
            social: true,
            security: true,
        },
        sms: {
            marketing: false,
            social: false,
            security: true,
        },
    });

    const handleToggle = (
        channel: "email" | "push" | "sms",
        type: NotificationType
    ) => {
        setSettings((prev) => ({
            ...prev,
            [channel]: {
                ...prev[channel],
                [type]: !prev[channel][type],
            },
        }));
    };

    const handleSave = () => {
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            toast.success("Your notification preferences have been saved.");
        }, 1000);
    };

    const notificationTypes: { id: NotificationType; title: string; description: string }[] = [
        {
            id: "marketing",
            title: "Marketing",
            description: "Receive emails about new products, features, and more.",
        },
        {
            id: "social",
            title: "Social",
            description: "Receive notifications when someone mentions you or replies to your messages.",
        },
        {
            id: "security",
            title: "Security",
            description: "Receive notifications about your account security.",
        },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="card-hover"
                >
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center text-lg">
                                <Mail className="mr-2 h-5 w-5 text-primary" />
                                Email Notifications
                            </CardTitle>
                            <CardDescription>
                                Manage how you receive email notifications.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {notificationTypes.map((type) => (
                                <div key={`email-${type.id}`} className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor={`email-${type.id}`}>{type.title}</Label>
                                        <p className="text-xs text-muted-foreground">
                                            {type.description}
                                        </p>
                                    </div>
                                    <Switch
                                        id={`email-${type.id}`}
                                        checked={settings.email[type.id]}
                                        onCheckedChange={() => handleToggle("email", type.id)}
                                    />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="card-hover"
                >
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center text-lg">
                                <Bell className="mr-2 h-5 w-5 text-primary" />
                                Push Notifications
                            </CardTitle>
                            <CardDescription>
                                Manage your push notification preferences.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {notificationTypes.map((type) => (
                                <div key={`push-${type.id}`} className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor={`push-${type.id}`}>{type.title}</Label>
                                        <p className="text-xs text-muted-foreground">
                                            {type.description}
                                        </p>
                                    </div>
                                    <Switch
                                        id={`push-${type.id}`}
                                        checked={settings.push[type.id]}
                                        onCheckedChange={() => handleToggle("push", type.id)}
                                    />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="card-hover"
                >
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center text-lg">
                                <Smartphone className="mr-2 h-5 w-5 text-primary" />
                                SMS Notifications
                            </CardTitle>
                            <CardDescription>
                                Manage your SMS notification preferences.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {notificationTypes.map((type) => (
                                <div key={`sms-${type.id}`} className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor={`sms-${type.id}`}>{type.title}</Label>
                                        <p className="text-xs text-muted-foreground">
                                            {type.description}
                                        </p>
                                    </div>
                                    <Switch
                                        id={`sms-${type.id}`}
                                        checked={settings.sms[type.id]}
                                        onCheckedChange={() => handleToggle("sms", type.id)}
                                    />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex justify-end"
            >
                <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading ? (
                        <div className="flex items-center">
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                            <span>Saving...</span>
                        </div>
                    ) : (
                        "Save notification settings"
                    )}
                </Button>
            </motion.div>
        </div>
    );
}