"use client";

import * as React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAllTasks } from "@/lib/tasks/queries";
import { useAuthStore } from "@/hooks/useAuthStore";
import { ListView } from "@/components/views/list/ListView";
import { TaskDetailPanel } from "@/components/tasks/TaskDetailPanel";
import { Skeleton } from "@/components/ui/Skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { ListChecks, Calendar, CheckCircle2 } from "lucide-react";

export default function MyWorkPage() {
  const { user } = useAuthStore();
  const { data: allTasks, isLoading } = useAllTasks();
  const [selectedTaskId, setSelectedTaskId] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<"all" | "today" | "upcoming">("all");

  const myTasks = React.useMemo(() => {
    if (!allTasks || !user) return [];

    let filtered = allTasks.filter(t => t.assignee_ids?.includes(user.id));

    if (filter === "today") {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(t => t.due_date?.startsWith(today));
    } else if (filter === "upcoming") {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(t => t.due_date && t.due_date > today);
    }

    return filtered;
  }, [allTasks, user, filter]);

  const selectedTask = allTasks?.find(t => t.id === selectedTaskId);

  return (
    <MainLayout
      title="My Work"
      description="Everything assigned to you across all projects"
    >
      <div className="flex flex-col h-full space-y-6">
        <div className="flex items-center justify-between border-b border-border-base pb-4">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as "all" | "today" | "upcoming")}>
            <TabsList>
              <TabsTrigger value="all" className="gap-2">
                <ListChecks size={16} />
                All Tasks
              </TabsTrigger>
              <TabsTrigger value="today" className="gap-2">
                <CheckCircle2 size={16} />
                Due Today
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="gap-2">
                <Calendar size={16} />
                Upcoming
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="text-xs text-muted font-mono uppercase tracking-widest">
            {myTasks.length} {myTasks.length === 1 ? 'Task' : 'Tasks'} Total
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : myTasks.length > 0 ? (
          <ListView
            tasks={myTasks}
            onTaskClick={setSelectedTaskId}
            groupBy="status"
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center mb-4">
              <ListChecks size={32} className="text-muted opacity-50" />
            </div>
            <h3 className="text-lg font-semibold text-primary">All caught up!</h3>
            <p className="text-sm text-secondary max-w-xs mx-auto">
              You don&apos;t have any tasks matching this filter. Enjoy your clear schedule.
            </p>
          </div>
        )}

        <TaskDetailPanel
          task={selectedTask || null}
          onClose={() => setSelectedTaskId(null)}
        />
      </div>
    </MainLayout>
  );
}
