"use client";

import * as React from "react";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

const tasks = [
  { id: "AX-101", title: "User interview synthesis", status: "Todo", statusColor: "bg-status-todo-bg text-status-todo-text", priority: "P2", priorityColor: "#EA580C", assignee: "SK", dueDate: "Jan 25", project: "Axis Platform" },
  { id: "AX-102", title: "Finalize brand guidelines", status: "In Progress", statusColor: "bg-status-progress-bg text-status-progress-text", priority: "P1", priorityColor: "#BE123C", assignee: "SK", dueDate: "Today", project: "Axis Platform" },
  { id: "AX-104", title: "Define design tokens", status: "Todo", statusColor: "bg-status-todo-bg text-status-todo-text", priority: "P1", priorityColor: "#BE123C", assignee: "EM", dueDate: "Today", project: "Axis Platform" },
  { id: "AX-98", title: "QA Mobile responsiveness", status: "In Review", statusColor: "bg-status-review-bg text-status-review-text", priority: "P3", priorityColor: "#CA8A04", assignee: "JD", dueDate: "Jan 22", project: "Axis Platform" },
];

export function ListView({ onTaskClick }: { onTaskClick?: () => void }) {
  return (
    <div className="bg-white border border-border-base rounded-card overflow-hidden">
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
          {tasks.map((task) => (
            <tr
              key={task.id}
              className="group hover:bg-surface-2 transition-colors cursor-pointer text-sm"
              onClick={onTaskClick}
            >
              <td className="px-6 py-3"><input type="checkbox" className="rounded" /></td>
              <td className="px-4 py-3 font-medium text-primary">{task.title}</td>
              <td className="px-4 py-3">
                <Badge className={task.statusColor}>{task.status}</Badge>
              </td>
              <td className="px-4 py-3">
                <Avatar fallback={task.assignee} size="sm" />
              </td>
              <td className="px-4 py-3">
                <Badge variant="priority" color={task.priorityColor}>{task.id}</Badge>
              </td>
              <td className="px-4 py-3 text-secondary">{task.dueDate}</td>
              <td className="px-4 py-3">
                <Badge variant="outline">{task.project}</Badge>
              </td>
              <td className="px-4 py-3 text-right pr-6">
                <button className="text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-3 border-t border-border-base bg-surface-1">
        <button className="text-xs text-accent font-medium hover:underline ml-12">+ Add new task</button>
      </div>
    </div>
  );
}
