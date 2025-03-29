"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BillingOverview } from "./billing-overview";
import { SubscriptionPlans } from "./subscription-plan";
import { PaymentMethods } from "./payment-methods";
import { BillingHistory } from "./billing-history";
import { GradientBackground } from "@/components/gradient-background";

export default function BillingPage() {
    const [activeTab, setActiveTab] = useState("overview");

    const tabVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    };

    return (
        <div className="relative bg-background">
            <GradientBackground />

            <div>
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-center md:text-left"
                >
                    <h1 className="text-3xl font-bold text-primary">Billing & Subscription</h1>
                    <p className="mt-2 text-muted-foreground">
                        Manage your subscription, payment methods, and billing history.
                    </p>
                </motion.div>

                <Tabs
                    defaultValue="overview"
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="mt-8"
                >
                    <TabsList className="hidden md:grid grid-cols-4 gap-2 rounded-lg bg-muted p-1">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="plans">Plans</TabsTrigger>
                        <TabsTrigger value="payment">Payment Methods</TabsTrigger>
                        <TabsTrigger value="history">Billing History</TabsTrigger>
                    </TabsList>

                    <div className="md:hidden flex flex-col gap-4">
                        <TabsList className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="plans">Plans</TabsTrigger>
                        </TabsList>

                        <TabsList className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
                            <TabsTrigger value="payment">Payment Methods</TabsTrigger>
                            <TabsTrigger value="history">Billing History</TabsTrigger>
                        </TabsList>
                    </div>

                    <motion.div
                        key={activeTab}
                        initial="hidden"
                        animate="visible"
                        variants={tabVariants}
                        className="mt-6"
                    >
                        <TabsContent value="overview">
                            <BillingOverview />
                        </TabsContent>
                        <TabsContent value="plans">
                            <SubscriptionPlans />
                        </TabsContent>
                        <TabsContent value="payment">
                            <PaymentMethods />
                        </TabsContent>
                        <TabsContent value="history">
                            <BillingHistory />
                        </TabsContent>
                    </motion.div>
                </Tabs>
            </div>
        </div>
    );
}
