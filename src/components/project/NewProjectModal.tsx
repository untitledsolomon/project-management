"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCreateProject } from "@/lib/projects/queries";
import { useAuthStore } from "@/hooks/useAuthStore";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface NewProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewProjectModal({ open, onOpenChange }: NewProjectModalProps) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("📁");
  const [color, setColor] = useState("#3D3BF3");
  const [isLoading, setIsLoading] = useState(false);
  const createProjectMutation = useCreateProject();
  const { user, org } = useAuthStore();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!org || !user) return;
    setIsLoading(true);

    try {
      const project = await createProjectMutation.mutateAsync({
        org_id: org.id,
        name,
        icon,
        color,
        owner_id: user.id,
        status: 'active',
        privacy: 'public'
      });

      // Create default sections
      const defaultSections = [
        { name: "Backlog", position: 1000 },
        { name: "To Do", position: 2000 },
        { name: "In Progress", position: 3000 },
        { name: "Done", position: 4000 }
      ];

      await supabase.from('sections').insert(
        defaultSections.map(s => ({
          ...s,
          project_id: project.id,
          org_id: org.id
        }))
      );

      toast.success("Project created successfully");
      onOpenChange(false);
      setName("");
    } catch (error: any) {
      toast.error(error.message || "Failed to create project");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Project Name</label>
            <Input
              placeholder="e.g. Website Redesign"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Icon</label>
              <Input
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="Emoji"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Color</label>
              <Input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 p-1"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim()}>
              {isLoading ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
