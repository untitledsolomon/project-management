"use client";

import { useMyWorkTasks, Task } from "@/lib/tasks/queries";
import { TaskCard } from "@/components/views/kanban/TaskCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { CheckSquare } from "lucide-react";
import { TaskDetailPanel } from "@/components/tasks/TaskDetailPanel";
import { useState } from "react";
import { isBefore, isToday, isAfter, startOfToday } from "date-fns";

export default function MyWorkPage() {
  const { data: tasks, isLoading } = useMyWorkTasks();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const overdue = tasks?.filter(t => t.due_date && isBefore(new Date(t.due_date), startOfToday()) && t.status !== 'done') || [];
  const today = tasks?.filter(t => t.due_date && isToday(new Date(t.due_date)) && t.status !== 'done') || [];
  const upcoming = tasks?.filter(t => (!t.due_date || isAfter(new Date(t.due_date), startOfToday())) && !isToday(new Date(t.due_date || '')) && t.status !== 'done') || [];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-surface-1">
      <PageHeader
        title="My Work"
        description="All tasks assigned to you across all projects."
      />

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Overdue Section */}
          {overdue.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-lg font-display font-bold text-status-blocked-text">Overdue</h2>
                <span className="px-2 py-0.5 bg-status-blocked-text/10 text-status-blocked-text text-xs font-bold rounded-full">
                  {overdue.length}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {overdue.map(task => (
                  <TaskCard key={task.id} task={task} onClick={setSelectedTask} />
                ))}
              </div>
            </section>
          )}

          {/* Today Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-lg font-display font-bold text-primary">Today</h2>
              <span className="px-2 py-0.5 bg-surface-2 text-secondary text-xs font-bold rounded-full">
                {today.length}
              </span>
            </div>
            {today.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {today.map(task => (
                  <TaskCard key={task.id} task={task} onClick={setSelectedTask} />
                ))}
              </div>
            ) : (
              <div className="p-12 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center">
                <p className="text-secondary font-medium mb-1">Clear for today!</p>
                <p className="text-muted text-sm">Enjoy your afternoon or pick something from upcoming.</p>
              </div>
            )}
          </section>

          {/* Upcoming Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-lg font-display font-bold text-primary">Upcoming</h2>
              <span className="px-2 py-0.5 bg-surface-2 text-secondary text-xs font-bold rounded-full">
                {upcoming.length}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {upcoming.map(task => (
                <TaskCard key={task.id} task={task} onClick={setSelectedTask} />
              ))}
            </div>
          </section>
        </div>
      </div>

      <TaskDetailPanel
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  );
}
