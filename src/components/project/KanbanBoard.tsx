"use client";

import * as React from "react";
import { Plus, MoreHorizontal } from "lucide-react";
import { TaskCard, type Task } from "./TaskCard";
import { Badge } from "@/components/ui/Badge";

interface Column {
  id: string;
  title: string;
  tasks: Task[];
  statusColor: string;
}

const initialData: Column[] = [
  {
    id: "todo",
    title: "Todo",
    statusColor: "bg-status-todo-bg text-status-todo-text",
    tasks: [
      { id: "AX-101", title: "User interview synthesis", priority: "P2", assignee: { name: "Solomon", fallback: "SK" }, dueDate: "Jan 25", comments: 4, attachments: 2, subtasks: { completed: 0, total: 5 } },
      { id: "AX-104", title: "Define design tokens", priority: "P1", assignee: { name: "Emma", fallback: "EM" }, dueDate: "Today", comments: 12, attachments: 1, subtasks: { completed: 3, total: 8 } },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    statusColor: "bg-status-progress-bg text-status-progress-text",
    tasks: [
      { id: "AX-102", title: "Finalize brand guidelines", priority: "P1", assignee: { name: "Solomon", fallback: "SK" }, dueDate: "Today", comments: 0, attachments: 5, subtasks: { completed: 2, total: 3 } },
    ],
  },
  {
    id: "review",
    title: "In Review",
    statusColor: "bg-status-review-bg text-status-review-text",
    tasks: [
      { id: "AX-98", title: "QA Mobile responsiveness", priority: "P3", assignee: { name: "Jack", fallback: "JD" }, dueDate: "Jan 22", comments: 8, attachments: 0, subtasks: { completed: 5, total: 5 } },
    ],
  },
  {
    id: "done",
    title: "Done",
    statusColor: "bg-status-done-bg text-status-done-text",
    tasks: [
      { id: "AX-85", title: "Onboarding flow diagrams", priority: "P4", assignee: { name: "Solomon", fallback: "SK" }, dueDate: "Jan 20", comments: 2, attachments: 1, subtasks: { completed: 10, total: 10 } },
    ],
  },
];

export function KanbanBoard() {
  return (
    <div className="flex gap-6 overflow-x-auto pb-4 h-[calc(100vh-250px)]">
      {initialData.map((column) => (
        <div key={column.id} className="w-80 flex-shrink-0 flex flex-col">
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-primary">{column.title}</h3>
              <Badge className={column.statusColor}>{column.tasks.length}</Badge>
            </div>
            <button className="text-muted hover:text-primary">
              <MoreHorizontal size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {column.tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}

            <button className="w-full py-2 flex items-center justify-center gap-2 text-muted hover:text-accent hover:bg-white rounded-badge border border-transparent hover:border-border-base transition-all text-sm group">
              <Plus size={16} className="group-hover:scale-110 transition-transform" />
              <span>Add task</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
