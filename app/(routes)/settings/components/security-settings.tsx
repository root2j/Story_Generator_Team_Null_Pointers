"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff, Lock, Shield, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const passwordFormSchema = z
    .object({
        currentPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
        newPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
        confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export function SecuritySettings() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
    });

    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [sessionTimeout, setSessionTimeout] = useState(30);

    const form = useForm({
        resolver: zodResolver(passwordFormSchema),
        defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
        mode: "onChange",
    });

    function onSubmit() {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            toast.success("Your password has been updated successfully.");
            form.reset();
        }, 1000);
    }

    return (
        <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center text-xl font-semibold">
                            <Lock className="mr-2 h-6 w-6 text-primary" /> Change Password
                        </CardTitle>
                        <CardDescription>Update your password to keep your account secure.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {['currentPassword', 'newPassword', 'confirmPassword'].map((field, index) => (
                                        <FormField key={index} control={form.control} name={field as "currentPassword" | "newPassword" | "confirmPassword"} render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {field.name === "currentPassword" ? "Current Password" : field.name === "newPassword" ? "New Password" : "Confirm New Password"}
                                                </FormLabel>
                                                <div className="relative">
                                                    <FormControl>
                                                        <Input type={field.name as keyof typeof showPassword ? "text" : "password"} {...field} className="pr-10" />
                                                    </FormControl>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                                        onClick={() => setShowPassword((prev) => ({ ...prev, [field.name as "currentPassword" | "newPassword" | "confirmPassword"]: !prev[field.name as "currentPassword" | "newPassword" | "confirmPassword"] }))}

                                                    >
                                                        {showPassword[field.name as keyof typeof showPassword] ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                    </Button>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    ))}
                                </div>
                                <Button type="submit" disabled={isLoading} className="w-fit">
                                    {isLoading ? "Updating..." : "Update Password"}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[{
                    title: "Two-Factor Authentication",
                    icon: <Smartphone className="mr-2 h-6 w-6 text-primary" />,
                    description: "Add an extra layer of security to your account.",
                    content: (
                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="two-factor">Enable 2FA</Label>
                                <p className="text-sm">Require a verification code when logging in.</p>
                            </div>
                            <Switch id="two-factor" checked={twoFactorEnabled} onCheckedChange={() => setTwoFactorEnabled(!twoFactorEnabled)} />
                        </div>
                    )
                }, {
                    title: "Session Security",
                    icon: <Shield className="mr-2 h-6 w-6 text-primary" />,
                    description: "Manage your active sessions and security settings.",
                    content: (
                        <div className="flex gap-2 items-center justify-between">
                            <div>
                                <Label>Session timeout (minutes)</Label>
                                <Input type="number" value={sessionTimeout} onChange={(e) => setSessionTimeout(parseInt(e.target.value))} min={5} max={120} className="w-20 mt-2" />
                            </div>
                            <Button onClick={() => toast.success(`Timeout set to ${sessionTimeout} min`)} className="mt-3">Save</Button>
                        </div>
                    )
                }].map((section, index) => (
                    <motion.div key={index} whileHover={{ scale: 1.02 }}>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center text-lg font-semibold">{section.icon} {section.title}</CardTitle>
                                <CardDescription>{section.description}</CardDescription>
                            </CardHeader>
                            <CardContent>{section.content}</CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
