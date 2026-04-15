"use client";

import * as React from "react";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { ArrowUpDown, MoreHorizontal, Layout, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/components/providers/WorkspaceProvider";

export function ListView({ onTaskClick }: { onTaskClick?: () => void }) {
  const { tasks } = useWorkspace();
  const [density, setDensity] = React.useState<"compact" | "comfortable" | "spacious">("comfortable");

  const densityStyles = {
    compact: "py-1.5 px-4 text-[13px]",
    comfortable: "py-3 px-4 text-sm",
    spacious: "py-5 px-4 text-base",
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2 px-1">
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
            title={d.label}
          >
            <d.icon size={12} />
            {density === d.id && <span>{d.label}</span>}
          </button>
        ))}
      </div>
      <div className="bg-white border border-border-base rounded-card overflow-hidden shadow-axis">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border-base bg-surface-2 text-[10px] font-mono uppercase tracking-wider text-muted">
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
            <th className="px-4 py-3 font-medium">Project</th>
            <th className="px-4 py-3 font-medium text-right pr-6"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-base">
          {tasks.map((task) => {
            const statusColors: Record<string, string> = {
              "todo": "bg-status-todo-bg text-status-todo-text",
              "in-progress": "bg-status-progress-bg text-status-progress-text",
              "review": "bg-status-review-bg text-status-review-text",
              "done": "bg-status-done-bg text-status-done-text",
            };

            const priorityColors: Record<string, string> = {
              "P1": "#BE123C",
              "P2": "#EA580C",
              "P3": "#CA8A04",
              "P4": "#9090A0",
            };

            return (
              <tr
                key={task.id}
                className={cn("group hover:bg-surface-2 transition-colors cursor-pointer", density === "compact" ? "text-[13px]" : density === "comfortable" ? "text-sm" : "text-base")}
                onClick={onTaskClick}
              >
                <td className={cn(densityStyles[density], "w-10 pl-6")}><input type="checkbox" className="rounded" /></td>
                <td className={cn(densityStyles[density], "font-medium text-primary")}>{task.title}</td>
                <td className={densityStyles[density]}>
                  <Badge className={statusColors[task.status] || "bg-status-todo-bg text-status-todo-text"}>
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace("-", " ")}
                  </Badge>
                </td>
                <td className={densityStyles[density]}>
                  <Avatar fallback={task.assignee.fallback} size={density === "compact" ? "sm" : "md"} />
                </td>
                <td className={densityStyles[density]}>
                  <Badge variant="priority" color={priorityColors[task.priority]}>{task.id}</Badge>
                </td>
                <td className={cn(densityStyles[density], "text-secondary")}>{task.dueDate}</td>
                <td className={densityStyles[density]}>
                  <Badge variant="outline">{task.project}</Badge>
                </td>
                <td className={cn(densityStyles[density], "text-right pr-6")}>
                  <button className="text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="p-3 border-t border-border-base bg-surface-1">
        <button className="text-xs text-accent font-medium hover:underline ml-12">+ Add new task</button>
      </div>
    </div>
    </div>
  );
}
