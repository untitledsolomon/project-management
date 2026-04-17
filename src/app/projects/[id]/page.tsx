"use client";

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
import { useState } from "react";
import { Task } from "@/lib/tasks/queries";

export default function ProjectPage() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState("kanban");
  const { id } = useParams();
  const { data: projects } = useProjects();
  const { data: tasks, isLoading: tasksLoading } = useProjectTasks(id as string);
  const { data: sections, isLoading: sectionsLoading } = useProjectSections(id as string);

  const project = projects?.find(p => p.id === id);

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
          <div className="flex items-center gap-1 bg-surface-2 p-1 rounded-md">
            <button
              onClick={() => setActiveTab("kanban")}
              className={cn("flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded transition-all", activeTab === "kanban" ? "bg-white text-primary shadow-sm" : "text-secondary hover:text-primary")}
            >
              <LayoutGrid size={16} />
              Kanban
            </button>
            <button
              onClick={() => setActiveTab("list")}
              className={cn("flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded transition-all", activeTab === "list" ? "bg-white text-primary shadow-sm" : "text-secondary hover:text-primary")}
            >
              <List size={16} />
              List
            </button>
            <button
              onClick={() => setActiveTab("timeline")}
              className={cn("flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded transition-all opacity-50 cursor-not-allowed", activeTab === "timeline" ? "bg-white text-primary shadow-sm" : "text-secondary")}
              disabled
            >
              <Calendar size={16} />
              Timeline
              <span className="text-[8px] bg-accent/10 text-accent px-1 rounded uppercase">Soon</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Settings size={16} />
            </Button>
          </div>
        </div>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {activeTab === "kanban" && sections && tasks && (
            <KanbanBoard
              initialSections={sections}
              initialTasks={tasks}
              onTaskClick={(task) => setSelectedTask(task)}
            />
          )}

          {activeTab === "list" && sections && tasks && (
            <ListView
              sections={sections}
              tasks={tasks}
              onTaskClick={(task) => setSelectedTask(task)}
            />
          )}
        </div>
      </div>

      <TaskDetailPanel
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </MainLayout>
  );
}
