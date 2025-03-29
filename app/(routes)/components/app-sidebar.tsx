"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react"


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-storypromptprojects"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { NavVideoProjects } from "./nav-projects"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Create Story by Prompt",
          url: "/createprompt",
        },
        {
          title: "Create User Decision Based Story",
          url: "/create-story",
        },
        {
          title: "Create Audiobooks",
          url: "/audiobooks",
        },
        {
          title: "Create Video Stories",
          url: "/videostories",
        }
      ],
    },
    // {
    //   title: "Models",
    //   url: "#",
    //   icon: Bot,
    //   items: [
    //     {
    //       title: "Genesis",
    //       url: "#",
    //     },
    //     {
    //       title: "Explorer",
    //       url: "#",
    //     },
    //     {
    //       title: "Quantum",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Documentation",
    //   url: "#",
    //   icon: BookOpen,
    //   items: [
    //     {
    //       title: "Introduction",
    //       url: "#",
    //     },
    //     {
    //       title: "Get Started",
    //       url: "#",
    //     },
    //     {
    //       title: "Tutorials",
    //       url: "#",
    //     },
    //     {
    //       title: "Changelog",
    //       url: "#",
    //     },
    //   ],
    // },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/settings",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "/billing",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "/feedback",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

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
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUser();
  const [storyData, setStoryData] = useState<Story[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { isSignedIn, isLoaded } = useUser();
  const [videoAssetsData, setVideoAssetsData] = React.useState<{ id: string; prompt: string }[]>([]);

  async function fetchVideoAssets(): Promise<{ id: string; prompt: string }[]> {
    try {
      const response = await fetch("/api/all-video-assets");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch video assets.");
      }

      const data = await response.json();

      // Extract 'id' and 'prompt' fields from each object in the videoAssets array
      return data.videoAssets?.map((asset: { id: string; prompt: string }) => ({
        id: asset.id,
        prompt: asset.prompt, // Assuming 'content' contains the prompt
      })) || [];
    } catch (error) {
      console.error("Error fetching video assets:", error);
      return [];
    }
  }

  React.useEffect(() => {
    fetchVideoAssets().then((assets) => {
      if (assets) setVideoAssetsData(assets);
    });
  }, []);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch("/api/get-promptstory-by-userId");
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
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Null Pointers Studio</span>
                  <span className="truncate text-xs">Generator</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={storyData} />
        <NavVideoProjects projects={videoAssetsData.map(({ id, prompt }) => ({ sceneId: id, prompt }))} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{
          name: user.user?.fullName || "",
          email: user.user?.emailAddresses[0].emailAddress || "",
          avatar: user.user?.imageUrl || "",
        }} />
      </SidebarFooter>
    </Sidebar>
  )
}
