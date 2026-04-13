"use client";

import * as React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ViewSwitcher } from "@/components/project/ViewSwitcher";
import { KanbanBoard } from "@/components/project/KanbanBoard";
import { ListView } from "@/components/project/ListView";
import { TimelineView } from "@/components/project/TimelineView";
import { Badge } from "@/components/ui/Badge";
import { TaskDetailDrawer } from "@/components/project/TaskDetailDrawer";

export default function ProjectPage() {
  const [activeView, setActiveView] = React.useState<"Board" | "List" | "Timeline" | "Calendar">("Board");
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  return (
    <MainLayout title="Projects / Axis Platform">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-4xl font-display text-primary">Axis Platform</h1>
          <Badge className="bg-status-progress-bg text-status-progress-text mt-1">Active</Badge>
        </div>
        <p className="text-secondary text-sm">Design & development of the core Axis infrastructure.</p>
      </div>

      <ViewSwitcher activeView={activeView} onViewChange={setActiveView} />

      <div className="mt-4" onClick={() => setIsDrawerOpen(true)}>
        {activeView === "Board" && <KanbanBoard />}
        {activeView === "List" && <ListView />}
        {activeView === "Timeline" && <TimelineView />}
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
