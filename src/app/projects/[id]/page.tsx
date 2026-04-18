"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { useProjectTasks } from "@/lib/tasks/queries";
import { useProjectSections } from "@/lib/sections/queries";
import { useProjects } from "@/lib/projects/queries";
import { KanbanBoard } from "@/components/views/kanban/KanbanBoard";
import { ListView } from "@/components/views/list/ListView";
import { TaskDetailPanel } from "@/components/tasks/TaskDetailPanel";
import { Button } from "@/components/ui/Button";
import { LayoutGrid, List, Calendar, Settings, Share2, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";

export default function ProjectPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = React.useState("kanban");
  const [selectedTaskId, setSelectedTaskId] = React.useState<string | null>(null);

  const { data: projects } = useProjects();
  const { data: tasks, isLoading: tasksLoading } = useProjectTasks(id as string);
  const { data: sections, isLoading: sectionsLoading } = useProjectSections(id as string);

  const project = projects?.find(p => p.id === id);
  const selectedTask = tasks?.find(t => t.id === selectedTaskId);

  if (tasksLoading || sectionsLoading) {
    return (
      <MainLayout>
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <div className="flex gap-4">
            <Skeleton className="h-96 w-72" />
            <Skeleton className="h-96 w-72" />
            <Skeleton className="h-96 w-72" />
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title={project?.name || "Project"}
      description={project?.description}
      action={
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="gap-2">
            <Share2 size={16} />
            Share
          </Button>
          <Button size="sm" className="gap-2">
            <Plus size={16} />
            New Task
          </Button>
        </div>
      }
    >
      <div className="flex flex-col h-full">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="kanban" className="gap-2">
                <LayoutGrid size={16} />
                Kanban
              </TabsTrigger>
              <TabsTrigger value="list" className="gap-2">
                <List size={16} />
                List
              </TabsTrigger>
              <TabsTrigger value="timeline" className="gap-2">
                <Calendar size={16} />
                Timeline
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Settings size={16} />
            </Button>
          </div>
        </div>

        {/* Views */}
        <div className="flex-1 overflow-hidden relative">
          {activeTab === "kanban" && sections && tasks && (
            <KanbanBoard initialSections={sections} initialTasks={tasks} onTaskClick={setSelectedTaskId} />
          )}
          {activeTab === "list" && tasks && (
            <ListView tasks={tasks} onTaskClick={setSelectedTaskId} />
          )}
          {activeTab === "timeline" && (
            <div className="flex flex-col items-center justify-center h-full text-muted">
              <Calendar size={48} className="mb-4 opacity-20" />
              <p className="text-sm font-medium">Timeline View coming in Phase 2</p>
            </div>
          )}
        </div>

        <TaskDetailPanel
          task={selectedTask || null}
          onClose={() => setSelectedTaskId(null)}
        />
      </div>
    </MainLayout>
  );
}
