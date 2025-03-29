"use client";

import { motion } from "framer-motion";
import {
    CreditCard,
    Calendar,
    Users,
    HardDrive,
    Download,
    BarChart3,
    ArrowUpRight,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function BillingOverview() {
    const currentPlan = {
        name: "Business Pro",
        price: "$49.99",
        billingCycle: "monthly",
        renewalDate: "May 15, 2025",
        status: "active"
    };

    const usageData = [
        { name: "Team Members", used: 8, limit: 10, icon: Users },
        { name: "Storage", used: 75, limit: 100, unit: "GB", icon: HardDrive },
        { name: "Downloads", used: 450, limit: 500, icon: Download },
        { name: "Analytics", used: 65, limit: 100, unit: "%", icon: BarChart3 },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4 }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Current Subscription</CardTitle>
                                <CardDescription>Your subscription details and usage</CardDescription>
                            </div>
                            <Badge variant={currentPlan.status === "active" ? "default" : "destructive"} className="capitalize">
                                {currentPlan.status}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-bold">{currentPlan.name}</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold">{currentPlan.price}</span>
                                        <span className="text-muted-foreground">/{currentPlan.billingCycle}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>Renews on {currentPlan.renewalDate}</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CreditCard className="h-4 w-4" />
                                    <span>Billed to ending in •••• 4242</span>
                                </div>
                            </div>

                            <div className="flex flex-col justify-end gap-4">
                                <Button className="w-full sm:w-auto">Manage Subscription</Button>
                                <Button variant="outline" className="w-full sm:w-auto">Download Invoice</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Upcoming price change</AlertTitle>
                    <AlertDescription>
                        Your subscription price will increase from $49.99 to $54.99 on your next billing cycle.
                        <Button variant="link" className="h-auto p-0 pl-1">
                            Learn more
                        </Button>
                    </AlertDescription>
                </Alert>
            </motion.div>

            <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader>
                        <CardTitle>Usage Overview</CardTitle>
                        <CardDescription>Monitor your resource usage across your subscription</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {usageData.map((item, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <item.icon className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">{item.name}</span>
                                        </div>
                                        <span className="text-sm">
                                            {item.used} / {item.limit} {item.unit || ""}
                                        </span>
                                    </div>
                                    <Progress value={(item.used / item.limit) * 100} className="h-2" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full">
                            View Detailed Usage
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle>Need More Resources?</CardTitle>
                        <CardDescription>Upgrade your plan or add resources</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Unlock additional team members, storage, and features by upgrading to our Enterprise plan.
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full">
                            Upgrade Plan
                            <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle>Billing Support</CardTitle>
                        <CardDescription>Get help with billing questions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Our support team is available 24/7 to help with any billing or subscription questions.
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full">Contact Support</Button>
                    </CardFooter>
                </Card>
            </motion.div>
        </motion.div>
    );
}