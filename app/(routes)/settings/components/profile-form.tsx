"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const profileFormSchema = z.object({
    name: z
        .string()
        .min(2, {
            message: "Name must be at least 2 characters.",
        })
        .max(30, {
            message: "Name must not be longer than 30 characters.",
        }),
    email: z
        .string()
        .min(1, { message: "This field is required." })
        .email("This is not a valid email."),
    bio: z.string().max(160).optional(),
    urls: z
        .object({
            twitter: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
            github: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
            linkedin: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
        })
        .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const defaultValues: Partial<ProfileFormValues> = {
    name: "Sarah Connor",
    email: "sarah@skynet.com",
    bio: "Product designer at Skynet. I enjoy creating intuitive interfaces and exploring new design trends.",
    urls: {
        twitter: "https://twitter.com/sarahconnor",
        github: "https://github.com/sarahconnor",
        linkedin: "https://linkedin.com/in/sarahconnor",
    },
};

export function ProfileForm() {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues,
        mode: "onChange",
    });

    function onSubmit(data: ProfileFormValues) {
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            toast.success("Your profile has been updated successfully.");
            console.log(data);
        }, 1000);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex flex-col items-center space-y-2"
                    >
                        <Avatar className="h-24 w-24">
                            <AvatarImage
                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
                                alt="Profile picture"
                            />
                            <AvatarFallback>SC</AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="sm">
                            Change avatar
                        </Button>
                    </motion.div>

                    <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your name" {...field} />
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
                                            <Input placeholder="Your email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tell us a little bit about yourself"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Brief description for your profile. URLs are hyperlinked.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="text-sm font-medium">Social Links</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="urls.twitter"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Twitter</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://twitter.com/username" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="urls.github"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>GitHub</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://github.com/username" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="urls.linkedin"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>LinkedIn</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://linkedin.com/in/username" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
                        {isLoading ? (
                            <div className="flex items-center">
                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                                <span>Saving...</span>
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <Save className="mr-2 h-4 w-4" />
                                <span>Save changes</span>
                            </div>
                        )}
                    </Button>
                </motion.div>
            </form>
        </Form>
    );
}