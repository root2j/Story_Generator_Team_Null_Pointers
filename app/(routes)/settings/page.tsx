"use client";

import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { Settings, User, Bell, Shield, Paintbrush, CreditCard } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import BillingPage from "./components/billing/billing";
import { ProfileForm } from "./components/profile-form";
import { NotificationSettings } from "./components/notification-settings";
import { SecuritySettings } from "./components/security-settings";
import { AppearanceSettings } from "./components/appearance-settings";
import { GradientBackground } from "@/components/gradient-background";


function LoadingPlaceholder() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-8 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Separator className="my-4" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        </div>
    );
}

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");

    const tabItems = [
        {
            id: "profile",
            label: "Profile",
            icon: <User className="h-4 w-4" />,
            content: <ProfileForm />,
        },
        {
            id: "notifications",
            label: "Notifications",
            icon: <Bell className="h-4 w-4" />,
            content: <NotificationSettings />,
        },
    ];

    const tab2Items = [
        {
            id: "security",
            label: "Security",
            icon: <Shield className="h-4 w-4" />,
            content: <SecuritySettings />,
        },
        {
            id: "appearance",
            label: "Appearance",
            icon: <Paintbrush className="h-4 w-4" />,
            content: <AppearanceSettings />,
        },
    ]

    const tab3Items = [
        {
            id: "billing",
            label: "Billing",
            icon: <CreditCard className="h-4 w-4" />,
            content: <BillingPage />,
        },
    ];

    return (
        <div>
            <GradientBackground />
            <div className="p-1 lg:p-4">
                <main className="w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6 p-4"
                    >
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                <Settings className="inline-block mr-2 h-8 w-8" />
                                Settings
                            </h1>
                            <p className="text-muted-foreground">
                                Manage your account settings and preferences.
                            </p>
                        </div>
                        <Separator />
                        <Tabs
                            defaultValue="profile"
                            value={activeTab}
                            onValueChange={setActiveTab}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
                                <TabsList className="grid grid-cols-2 gap-2">
                                    {tabItems.map((tab) => (
                                        <TabsTrigger key={tab.id} value={tab.id} className="flex items-center">
                                            {tab.icon}
                                            <span className="ml-2">{tab.label}</span>
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                                <TabsList className="grid grid-cols-2 gap-2">
                                    {tab2Items.map((tab) => (
                                        <TabsTrigger key={tab.id} value={tab.id} className="flex items-center">
                                            {tab.icon}
                                            <span className="ml-2">{tab.label}</span>
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                                <TabsList className="grid grid-cols-1 gap-2">
                                    {tab3Items.map((tab) => (
                                        <TabsTrigger key={tab.id} value={tab.id} className="flex items-center">
                                            {tab.icon}
                                            <span className="ml-2">{tab.label}</span>
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </div>

                            {tabItems.map((tab) => (
                                <TabsContent key={tab.id} value={tab.id} className="space-y-6">
                                    <Suspense fallback={<LoadingPlaceholder />}>
                                        {tab.content}
                                    </Suspense>
                                </TabsContent>
                            ))}
                            {tab2Items.map((tab) => (
                                <TabsContent key={tab.id} value={tab.id} className="space-y-6">
                                    <Suspense fallback={<LoadingPlaceholder />}>
                                        {tab.content}
                                    </Suspense>
                                </TabsContent>
                            ))}
                            {tab3Items.map((tab) => (
                                <TabsContent key={tab.id} value={tab.id} className="space-y-6">
                                    <Suspense fallback={<LoadingPlaceholder />}>
                                        {tab.content}
                                    </Suspense>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </motion.div>
                </main>
            </div>
        </div>
    );
}