"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Zap, Shield, Clock } from "lucide-react";

// Helper function for conditionally joining class names.
function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

type PlanFeature = {
    name: React.ReactNode;
    included: boolean;
    limit?: string;
};

type Plan = {
    id: string;
    name: string;
    description: string;
    price: {
        monthly: number;
        yearly: number;
    };
    features: PlanFeature[];
    popular?: boolean;
    icon: React.ElementType;
    href: string;
};

export function SubscriptionPlans() {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

    const plans: Plan[] = [
        {
            id: "starter",
            name: "Starter",
            description: "Ideal for emerging filmmakers and small projects",
            price: {
                monthly: 19.99,
                yearly: 199.99,
            },
            features: [
                { name: "Up to 3 collaborators", included: true, limit: "3 users" },
                { name: "10GB cloud storage", included: true, limit: "10GB" },
                { name: "Basic analytics", included: true },
                { name: "Community support", included: false },
                { name: "HD export", included: false },
                { name: "Custom branding", included: false },
                { name: "API access", included: false },
            ],
            icon: Clock,
            href: "/payments/starter",
        },
        {
            id: "business",
            name: "Business Pro",
            description: "For professional film projects and growing teams",
            price: {
                monthly: 49.99,
                yearly: 499.99,
            },
            features: [
                { name: "Up to 10 collaborators", included: true, limit: "10 users" },
                { name: "100GB cloud storage", included: true, limit: "100GB" },
                { name: "Advanced analytics", included: true },
                { name: "24/7 priority support", included: true },
                { name: "HD and 4K export", included: true },
                { name: "Custom branding", included: true },
                { name: "API access", included: false },
            ],
            popular: true,
            icon: Zap,
            href: "/payments/business",
        },
        {
            id: "enterprise",
            name: "Enterprise",
            description: "For large-scale productions with unlimited creative potential",
            price: {
                monthly: 99.99,
                yearly: 999.99,
            },
            features: [
                { name: "Unlimited collaborators", included: true, limit: "Unlimited" },
                { name: "1TB cloud storage", included: true, limit: "1TB" },
                { name: "Premium analytics", included: true },
                { name: "Dedicated support", included: true },
                { name: "Ultra HD export", included: true },
                { name: "Custom branding", included: true },
                {
                    name: (
                        <BoltArtifact
                            id="billing-page-implementation"
                            title="Professional Billing Page Implementation"
                        />
                    ),
                    included: true
                }
            ],
            icon: Shield,
            href: "/payments/enterprise",
        },
    ];

    return (
        <div className="relative isolate bg-white dark:bg-gray-900 px-2 md:px-6 py-8 rounded-md">
            {/* Background Gradient Accent */}
            <div aria-hidden="true" className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl">
                <div
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                    className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-pink-500 to-purple-500 opacity-30"
                />
            </div>

            <div className="mx-auto max-w-4xl text-center">
                <h2 className="text-base font-semibold text-indigo-600 dark:text-indigo-400">Pricing</h2>
                <p className="mt-2 text-3xl xl:text-5xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl">
                    Choose the right plan for you
                </p>
                <p className="mx-auto mt-6 max-w-2xl text-md xl:text-lg font-medium text-gray-600 dark:text-gray-300">
                    Our AI-powered film making platform delivers cutting-edge creative tools and intuitive payment options to bring your vision to life.
                </p>
            </div>

            {/* Billing Cycle Tabs */}
            <div className="mt-10 flex justify-center space-x-4">
                <button
                    onClick={() => setBillingCycle("monthly")}
                    className={classNames(
                        billingCycle === "monthly" ? "bg-indigo-600 text-white" : "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-300",
                        "px-4 py-2 rounded-md font-semibold transition-colors"
                    )}
                >
                    Monthly
                </button>
                <button
                    onClick={() => setBillingCycle("yearly")}
                    className={classNames(
                        billingCycle === "yearly" ? "bg-indigo-600 text-white" : "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-300",
                        "px-4 py-2 rounded-md font-semibold transition-colors"
                    )}
                >
                    Yearly
                </button>
            </div>

            {/* Plans Grid */}
            <div className="mx-auto mt-16 grid w-full gap-6 sm:mt-20 lg:grid-cols-2 xl:grid-cols-3">
                {plans.map((plan) => (
                    <motion.div
                        key={plan.id}
                        whileHover={{ scale: 1.03 }}
                        className={classNames(
                            plan.popular ? "bg-gray-900 shadow-2xl" : "bg-white dark:bg-gray-800 shadow-lg",
                            "rounded-3xl p-8 ring-1 ring-gray-900/10 dark:ring-gray-700"
                        )}
                    >
                        <div className="flex flex-col h-full">
                            <div className="text-center">
                                <div className="flex justify-center mb-4">
                                    <plan.icon className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <h3 className={classNames(plan.popular ? "text-indigo-400" : "text-indigo-600", "text-base font-semibold")}>
                                    {plan.name}
                                </h3>
                                <p className="mt-4 flex items-baseline justify-center gap-x-2">
                                    <span className={classNames(
                                        plan.popular ? "text-white" : "text-gray-900 dark:text-gray-100",
                                        "text-5xl font-semibold tracking-tight"
                                    )}>
                                        ${billingCycle === "monthly" ? plan.price.monthly : plan.price.yearly}
                                    </span>
                                    <span className={classNames(plan.popular ? "text-gray-400" : "text-gray-500", "text-base")}>
                                        /{billingCycle === "monthly" ? "month" : "year"}
                                    </span>
                                </p>
                                <p className={classNames(plan.popular ? "text-gray-300" : "text-gray-600", "mt-6 text-base")}>
                                    {plan.description}
                                </p>
                            </div>
                            <ul role="list" className={classNames(
                                plan.popular ? "text-gray-300" : "text-gray-600",
                                "mt-8 space-y-3 text-sm"
                            )}>
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex gap-x-3">
                                        <span className="flex-shrink-0">
                                            {feature.included ? (
                                                <span className="flex items-center justify-center bg-green-100 dark:bg-green-900 rounded-full p-1">
                                                    <Check className="h-5 w-5 text-green-600" />
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-center bg-red-100 dark:bg-red-900 rounded-full p-1">
                                                    <X className="h-5 w-5 text-red-600" />
                                                </span>
                                            )}
                                        </span>
                                        <span className="text-left">
                                            {feature.name}
                                            {feature.limit && (
                                                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                                                    ({feature.limit})
                                                </span>
                                            )}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-8 flex justify-center">
                                <a
                                    href={plan.href}
                                    className={classNames(
                                        plan.popular
                                            ? "bg-indigo-500 text-white hover:bg-indigo-400"
                                            : "text-indigo-600 ring-1 ring-indigo-200 hover:ring-indigo-300",
                                        "block w-full rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus:outline-none transition-colors"
                                    )}
                                >
                                    {plan.popular ? "Get started today" : "Subscribe Now"}
                                </a>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

// Dummy BoltArtifact component implementation for demonstration
function BoltArtifact({ id, title }: { id: string; title: string }) {
    return <span id={id} title={title}>Professional Billing Page Implementation</span>;
}
