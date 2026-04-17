"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { useUserTasks, Task } from "@/lib/tasks/queries";
import { TaskCard } from "@/components/views/kanban/TaskCard";
import { TaskDetailPanel } from "@/components/tasks/TaskDetailPanel";
import { useState } from "react";
import { isToday, isThisWeek, isAfter, parseISO } from "date-fns";
import { Skeleton } from "@/components/ui/Skeleton";

export default function MyWorkPage() {
  const { data: tasks, isLoading } = useUserTasks();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const todayTasks = tasks?.filter(t => t.due_date && isToday(parseISO(t.due_date))) || [];
  const thisWeekTasks = tasks?.filter(t => t.due_date && isThisWeek(parseISO(t.due_date)) && !isToday(parseISO(t.due_date))) || [];
  const upcomingTasks = tasks?.filter(t => t.due_date && isAfter(parseISO(t.due_date), new Date()) && !isThisWeek(parseISO(t.due_date))) || [];
  const noDateTasks = tasks?.filter(t => !t.due_date) || [];

  return (
    <MainLayout title="My Work" description="Tasks assigned to you across all projects">
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <TaskGroup title="Today" tasks={todayTasks} onTaskClick={setSelectedTask} />
          <TaskGroup title="This Week" tasks={thisWeekTasks} onTaskClick={setSelectedTask} />
          <TaskGroup title="Upcoming" tasks={upcomingTasks} onTaskClick={setSelectedTask} />
          <TaskGroup title="No Date" tasks={noDateTasks} onTaskClick={setSelectedTask} />
        </div>
      )}

      <TaskDetailPanel task={selectedTask} onClose={() => setSelectedTask(null)} />
    </MainLayout>
  );
}

function TaskGroup({ title, tasks, onTaskClick }: { title: string; tasks: Task[]; onTaskClick: (t: Task) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-display font-bold text-sm text-primary uppercase tracking-wider">{title}</h3>
        <span className="text-[10px] bg-surface-2 px-1.5 py-0.5 rounded border border-border text-secondary font-mono">{tasks.length}</span>
      </div>
      <div className="space-y-3">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
        ))}
        {tasks.length === 0 && (
          <div className="py-8 text-center border-2 border-dashed border-border rounded-card bg-surface-1/50">
            <p className="text-xs text-muted">No tasks</p>
          </div>
        )}
      </div>
    </div>
  );
}
