"use client";

import { useState } from "react";
import {
  Film,
  Folder,
  MoreHorizontal,
  Share,
  Trash2,
  Copy,
  Check,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";

export function NavVideoProjects({
  projects,
}: {
  projects: {
    sceneId: string;
    prompt: string;
  }[];
}) {
  const router = useRouter();
  const { user } = useUser();
  const [showAll, setShowAll] = useState(false);
  const [deleteProject, setDeleteProject] = useState<string | null>(null);
  const [shareProject, setShareProject] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const hasMoreThanThree = projects.length > 3;
  const visibleProjects = showAll ? projects : projects.slice(0, 3);

  const handleDeleteConfirm = () => {
    toast.success("Project deleted successfully.");
    setDeleteProject(null);
  };

  const handleCopy = () => {
    // if (shareProject && user) {
    //   navigator.clipboard.writeText(`${window.location.origin}/overview/scene-generation/${shareProject}&userId=${user?.id}`);
    //   setCopied(true);
    //   setTimeout(() => setCopied(false), 2000);
    // }
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Video Projects</SidebarGroupLabel>
      <SidebarMenu>
        {visibleProjects.map((item) => (
          <SidebarMenuItem key={item.sceneId} className="flex items-center justify-between">
            <SidebarMenuButton onClick={() => router.push(`/videostories/${item.sceneId}`)}>
              <Film />
              <span>{item.prompt}</span>
            </SidebarMenuButton>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 text-xs text-normal rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                  <MoreHorizontal />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem onClick={() => router.push(`/videostories/${item.sceneId}`)}>
                  <Folder className="text-muted-foreground" />
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShareProject(item.sceneId)}>
                  <Share className="text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setDeleteProject(item.sceneId)}>
                  <Trash2 className="text-red-500" />
                  <span className="text-red-500">Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}

        {hasMoreThanThree && !showAll && (
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setShowAll(true)}>
              <MoreHorizontal />
              <span>Show More</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>

      {/* Delete Project Dialog */}
      <Dialog open={!!deleteProject} onOpenChange={() => setDeleteProject(null)}>
        <DialogContent className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-300 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-red-600 dark:text-red-400">
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Are you sure you want to delete this project? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" className="dark:border-gray-600" onClick={() => setDeleteProject(null)}>
              Cancel
            </Button>
            <Button variant="destructive" className="bg-red-600 hover:bg-red-700" onClick={handleDeleteConfirm}>
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Project Dialog */}
      <Dialog open={!!shareProject} onOpenChange={() => setShareProject(null)}>
        <DialogContent className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-300 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-blue-600 dark:text-blue-400">
              Share Project
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Copy the link below to share this project.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-md border border-gray-300 dark:border-gray-700">
            <Input
              className="bg-transparent flex-1 border-none text-gray-900 dark:text-gray-100"
              readOnly
            />
            <Button variant="ghost" className="dark:text-white" onClick={handleCopy}>
              {copied ? <Check className="text-green-500" /> : <Copy />}
            </Button>
          </div>
          <DialogFooter className="flex justify-end">
            <Button variant="outline" className="dark:border-gray-600" onClick={() => setShareProject(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarGroup>
  );
}
