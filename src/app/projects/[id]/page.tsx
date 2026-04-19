"use client";

import { useParams } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { useProjectTasks, Task } from "@/lib/tasks/queries";
import { useProjectSections } from "@/lib/sections/queries";
import { useProjects } from "@/lib/projects/queries";
import { KanbanBoard } from "@/components/views/kanban/KanbanBoard";
import { ListView } from "@/components/views/list/ListView";
import { Button } from "@/components/ui/Button";
import { LayoutGrid, List, Calendar, Settings, Share2, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { TaskDetailPanel } from "@/components/tasks/TaskDetailPanel";
import { useState } from "react";

export default function ProjectPage() {
  const { id } = useParams();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
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
      <Tabs defaultValue="kanban" className="flex flex-col h-full">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
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

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Settings size={16} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <TabsContent value="kanban" className="flex-1 min-h-0 border-none p-0 outline-none">
          {sections && tasks && (
            <KanbanBoard
              initialSections={sections}
              initialTasks={tasks}
              onTaskClick={(task) => setSelectedTask(task)}
            />
          )}
        </TabsContent>

        <TabsContent value="list" className="flex-1 min-h-0 border-none p-0 outline-none">
          <ListView
            projectId={id as string}
            onTaskClick={(task) => setSelectedTask(task)}
          />
        </TabsContent>

        <TabsContent value="timeline" className="flex-1 min-h-0 border-none p-0 outline-none">
          <div className="flex items-center justify-center h-full text-muted italic">
            Timeline view coming in Phase 2
          </div>
        </TabsContent>
      </Tabs>

      <TaskDetailPanel
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </MainLayout>
  );
}
