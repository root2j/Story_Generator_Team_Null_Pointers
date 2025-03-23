"use client";

import { ReactNode } from "react";
import dynamic from "next/dynamic";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";

const ThemeToggle = dynamic(() => import("@/components/ThemeToggle").then((mod) => mod.ThemeToggle), {
    ssr: false,
});

interface OverviewLayoutProps {
    children: ReactNode;
}

export default function OverviewLayout({ children }: OverviewLayoutProps) {
    return (
        <SidebarProvider>
            <div className="flex h-screen w-full">
                <AppSidebar className="w-64 shrink-0 hidden lg:block" />
                <SidebarInset className="flex flex-1 flex-col overflow-hidden">
                    <header className="flex h-16 shrink-0 items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/">AI Story</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>
                                        AI Powered Unique Applications
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <div className="ml-auto">
                            <ThemeToggle />
                        </div>
                    </header>
                    <main className="flex-1 overflow-scroll">{children}</main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
