"use client";

import * as React from "react";
import { Task, useUpdateTask, useDeleteTask } from "@/lib/tasks/queries";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { DueDateBadge } from "@/components/ui/DueDateBadge";
import { X, Layout, Maximize2, Minimize2, Plus, GripVertical, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface ListViewProps {
  tasks: Task[];
  onTaskClick?: (taskId: string) => void;
  groupBy?: "status" | "assignee" | "priority" | "none";
}

export function ListView({ tasks, onTaskClick, groupBy = "none" }: ListViewProps) {
  const [density, setDensity] = React.useState<"compact" | "comfortable" | "spacious">("comfortable");
  const [searchTerm, setSearchTerm] = React.useState("");
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const filteredTasks = tasks.filter(t =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const densityStyles = {
    compact: "py-1.5 px-4 text-[13px]",
    comfortable: "py-3 px-4 text-sm",
    spacious: "py-5 px-4 text-base",
  };

  const groups = React.useMemo(() => {
    if (groupBy === "none") return [{ name: "All Tasks", tasks: filteredTasks }];

    const grouped = filteredTasks.reduce((acc, task) => {
      let key = "Other";
      if (groupBy === "status") key = task.status;
      else if (groupBy === "priority") key = task.priority;
      else if (groupBy === "assignee") key = task.assignee_ids?.[0] || "Unassigned";

      if (!acc[key]) acc[key] = [];
      acc[key].push(task);
      return acc;
    }, {} as Record<string, Task[]>);

    return Object.entries(grouped).map(([name, tasks]) => ({ name, tasks }));
  }, [filteredTasks, groupBy]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <div className="relative flex-1 max-w-sm">
          <Plus className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted h-3.5 w-3.5 rotate-45" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-border-base rounded-badge text-xs outline-none focus:ring-1 focus:ring-accent transition-all"
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
                "flex items-center gap-2 px-2 py-1 rounded-badge text-[10px] font-mono uppercase tracking-wider transition-colors",
                density === d.id ? "bg-accent text-white" : "text-muted hover:bg-surface-2"
              )}
            >
              <d.icon size={12} />
              {density === d.id && <span>{d.label}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {groups.map((group) => (
          <div key={group.name} className="space-y-3">
            {groupBy !== "none" && (
              <h3 className="text-[10px] font-mono uppercase tracking-widest text-muted px-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                {group.name.replace("_", " ")}
                <span className="ml-2 bg-surface-2 px-1.5 rounded">{group.tasks.length}</span>
              </h3>
            )}

            <div className="bg-white border border-border-base rounded-card overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-base bg-surface-1 text-[10px] font-mono uppercase tracking-wider text-muted">
                    <th className="px-6 py-3 font-medium w-12"><input type="checkbox" className="rounded" /></th>
                    <th className="px-4 py-3 font-medium">Task Name</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Assignee</th>
                    <th className="px-4 py-3 font-medium">Priority</th>
                    <th className="px-4 py-3 font-medium">Due Date</th>
                    <th className="px-4 py-3 font-medium text-right pr-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-base">
                  {group.tasks.map((task) => (
                    <tr
                      key={task.id}
                      className={cn(
                        "group hover:bg-surface-2 transition-all duration-200 cursor-pointer hover:scale-[1.005] hover:z-10 relative",
                        densityStyles[density]
                      )}
                      onClick={() => onTaskClick?.(task.id)}
                    >
                      <td className="px-6 py-3 w-12" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <GripVertical size={12} className="text-muted opacity-0 group-hover:opacity-100" />
                          <input type="checkbox" className="rounded border-border-base" />
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-primary">
                        <input
                          className="bg-transparent border-none outline-none w-full focus:ring-1 focus:ring-accent rounded px-1 -mx-1"
                          defaultValue={task.title}
                          onClick={(e) => e.stopPropagation()}
                          onBlur={(e) => {
                            if (e.target.value !== task.title) {
                              updateTaskMutation.mutate({ id: task.id, updates: { title: e.target.value } });
                            }
                          }}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="bg-surface-2 font-bold text-[10px] uppercase tracking-wider">
                          {task.status.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex -space-x-2">
                          {task.assignee_ids?.length ? (
                            task.assignee_ids.map(id => <Avatar key={id} fallback="U" size="xs" />)
                          ) : (
                            <Avatar fallback="?" size="xs" className="opacity-50" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <PriorityBadge priority={task.priority} />
                      </td>
                      <td className="px-4 py-3">
                        <DueDateBadge dueDate={task.due_date} />
                      </td>
                      <td className="px-4 py-3 text-right pr-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => { if(confirm("Delete task?")) deleteTaskMutation.mutate(task.id); }}
                            className="text-muted opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                          >
                            <X size={14} />
                          </button>
                          <button className="text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
