"use client";

import * as React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ViewSwitcher } from "@/components/project/ViewSwitcher";
import { KanbanBoard } from "@/components/project/KanbanBoard";
import { ListView } from "@/components/project/ListView";
import { TimelineView } from "@/components/project/TimelineView";
import { Badge } from "@/components/ui/Badge";
import { TaskDetailDrawer } from "@/components/project/TaskDetailDrawer";
import { useParams } from "next/navigation";
import { useWorkspace } from "@/components/providers/WorkspaceProvider";

export default function ProjectPage() {
  const params = useParams();
  const { projects } = useWorkspace();
  const [activeView, setActiveView] = React.useState<"Board" | "List" | "Timeline" | "Calendar">("Board");
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const project = projects.find(p => p.id === params.id);

  if (!project) {
    return (
      <MainLayout title="Project Not Found">
        <div className="h-96 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-display mb-4">Project not found</h1>
          <p className="text-muted">The project you are looking for does not exist or has been moved.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={`Projects / ${project.name}`}>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-4xl font-display text-primary">{project.name}</h1>
          <Badge className={`mt-1 ${project.statusColor}`}>{project.status}</Badge>
        </div>
        <p className="text-secondary text-sm">Design & development of the {project.name} infrastructure.</p>
      </div>

      <ViewSwitcher activeView={activeView} onViewChange={setActiveView} />

      <div className="mt-4">
        {activeView === "Board" && <KanbanBoard onTaskClick={() => setIsDrawerOpen(true)} />}
        {activeView === "List" && <ListView onTaskClick={() => setIsDrawerOpen(true)} />}
        {activeView === "Timeline" && <TimelineView onTaskClick={() => setIsDrawerOpen(true)} />}
        {activeView === "Calendar" && (
          <div className="h-96 flex items-center justify-center bg-white border border-dashed border-border-base rounded-card text-muted">
            Calendar view coming soon
          </div>
        )}
      </div>

      <TaskDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </MainLayout>
  );
}
