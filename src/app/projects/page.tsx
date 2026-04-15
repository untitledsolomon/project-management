"use client";

import * as React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { AvatarGroup, Avatar } from "@/components/ui/Avatar";
import { MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useWorkspace } from "@/components/providers/WorkspaceProvider";
import { CreateTaskDialog } from "@/components/project/CreateTaskDialog";

export default function ProjectsPage() {
  const { projects } = useWorkspace();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  return (
    <MainLayout title="Projects">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display text-primary mb-1">Projects</h1>
          <p className="text-secondary text-sm">Manage and monitor all active workspaces.</p>
        </div>
        <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
          <Plus size={16} /> New Project
        </Button>
      </div>

      <CreateTaskDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <Card className="hover:border-accent/50 transition-colors cursor-pointer group h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-display text-xl group-hover:text-accent transition-colors">{project.name}</h3>
                    <p className="text-xs text-muted font-mono uppercase tracking-tight">{project.client}</p>
                  </div>
                  <button className="text-muted hover:text-primary">
                    <MoreHorizontal size={18} />
                  </button>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] font-mono text-muted uppercase">Progress</span>
                    <span className="text-xs font-semibold">{project.progress}%</span>
                  </div>
                  <ProgressBar value={project.progress} />
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <AvatarGroup>
                    <Avatar fallback="SK" size="sm" />
                    <Avatar fallback="EM" size="sm" />
                    <Avatar fallback="JD" size="sm" />
                  </AvatarGroup>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted font-mono">{project.tasks} Tasks</span>
                    <Badge className={project.statusColor}>{project.status}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </MainLayout>
  );
}
