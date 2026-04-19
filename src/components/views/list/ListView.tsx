"use client";

import * as React from "react";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { ArrowUpDown, X, Layout, Maximize2, Minimize2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task, useProjectTasks, useDeleteTask, useCreateTask } from "@/lib/tasks/queries";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { DueDateBadge } from "@/components/ui/DueDateBadge";

interface ListViewProps {
  projectId: string;
  onTaskClick?: (task: Task) => void;
}

export function ListView({ projectId, onTaskClick }: ListViewProps) {
  const { data: tasks, isLoading } = useProjectTasks(projectId);
  const deleteTaskMutation = useDeleteTask();
  const createTaskMutation = useCreateTask();

  const [density, setDensity] = React.useState<"compact" | "comfortable" | "spacious">("comfortable");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isAdding, setIsAdding] = React.useState(false);
  const [newTaskTitle, setNewTaskTitle] = React.useState("");

  const filteredTasks = tasks?.filter(t =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const densityStyles = {
    compact: "py-1.5 px-4 text-[13px]",
    comfortable: "py-3 px-4 text-sm",
    spacious: "py-5 px-4 text-base",
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim() || !tasks?.[0]) return;

    createTaskMutation.mutate({
      title: newTaskTitle,
      project_id: projectId,
      org_id: tasks[0].org_id,
      section_id: tasks[0].section_id,
      status: "todo",
      priority: "none",
      position: (tasks.length || 0) * 1000 + 1000,
    });
    setNewTaskTitle("");
    setIsAdding(false);
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted">Loading tasks...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="relative flex-1 max-w-sm">
          <Plus className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted h-3.5 w-3.5 rotate-45" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-border rounded-md text-xs outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
        <div className="flex gap-2">
          {[
            { id: "compact", icon: Minimize2, label: "Compact" },
            { id: "comfortable", icon: Layout, label: "Comfortable" },
            { id: "spacious", icon: Maximize2, label: "Spacious" },
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => setDensity(d.id as "compact" | "comfortable" | "spacious")}
              className={cn(
                "flex items-center gap-2 px-2 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider transition-colors",
                density === d.id ? "bg-accent text-white" : "text-muted hover:bg-surface-2"
              )}
              title={d.label}
            >
              <d.icon size={12} />
              {density === d.id && <span>{d.label}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-border rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface-2 text-[10px] font-mono uppercase tracking-wider text-muted">
              <th className="px-6 py-3 font-medium w-10"><input type="checkbox" className="rounded" /></th>
              <th className="px-4 py-3 font-medium">
                <div className="flex items-center gap-2 cursor-pointer hover:text-primary">
                  Task Name <ArrowUpDown size={12} />
                </div>
              </th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Assignee</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-4 py-3 font-medium">Due Date</th>
              <th className="px-4 py-3 font-medium text-right pr-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredTasks.map((task) => (
              <tr
                key={task.id}
                className={cn(
                  "group hover:bg-surface-2 transition-colors cursor-pointer",
                  density === "compact" ? "text-[13px]" : density === "comfortable" ? "text-sm" : "text-base"
                )}
                onClick={() => onTaskClick?.(task)}
              >
                <td className={cn(densityStyles[density], "w-10 pl-6")}>
                  <input type="checkbox" className="rounded" onClick={(e) => e.stopPropagation()} />
                </td>
                <td className={cn(densityStyles[density], "font-medium text-primary")}>{task.title}</td>
                <td className={densityStyles[density]}>
                  <Badge variant="outline" className="capitalize">
                    {task.status.replace("-", " ")}
                  </Badge>
                </td>
                <td className={densityStyles[density]}>
                  <div className="flex -space-x-2">
                    {task.assignee_ids?.map(id => (
                      <Avatar key={id} fallback="U" size="xs" className="border-2 border-white" />
                    )) || <Avatar fallback="?" size="xs" />}
                  </div>
                </td>
                <td className={densityStyles[density]}>
                  <PriorityBadge priority={task.priority} />
                </td>
                <td className={cn(densityStyles[density], "text-secondary")}>
                  {task.due_date ? <DueDateBadge dueDate={task.due_date} /> : "-"}
                </td>
                <td className={cn(densityStyles[density], "text-right pr-6")} onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => { if(confirm("Delete task?")) deleteTaskMutation.mutate(task.id); }}
                    className="text-muted opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="p-3 border-t border-border bg-surface-1">
          {isAdding ? (
            <div className="flex items-center gap-3 ml-12 pr-6">
              <input
                autoFocus
                className="flex-1 h-8 bg-white border border-accent rounded px-3 text-xs outline-none shadow-sm"
                placeholder="What needs to be done?"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddTask();
                  if (e.key === "Escape") setIsAdding(false);
                }}
              />
              <button onClick={handleAddTask} className="text-xs font-semibold text-accent">Save</button>
              <button onClick={() => setIsAdding(false)} className="text-xs text-muted">Cancel</button>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="text-xs text-accent font-medium hover:underline ml-12"
            >
              + Add new task
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
