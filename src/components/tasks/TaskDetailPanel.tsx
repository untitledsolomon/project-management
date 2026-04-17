"use client";

import { Task, useUpdateTask } from "@/lib/tasks/queries";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { DueDateBadge } from "@/components/ui/DueDateBadge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { X, CheckSquare, MessageSquare, Clock } from "lucide-react";

interface TaskDetailPanelProps {
  task: Task | null;
  onClose: () => void;
}

export function TaskDetailPanel({ task, onClose }: TaskDetailPanelProps) {
  const updateTaskMutation = useUpdateTask();

  if (!task) return null;

  const handleDescriptionChange = (content: string) => {
    updateTaskMutation.mutate({ id: task.id, updates: { description: content } });
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[500px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-border ${task ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-muted uppercase tracking-wider">{task.id}</span>
            <PriorityBadge priority={task.priority} />
          </div>
          <button onClick={onClose} className="p-1 hover:bg-surface-2 rounded text-muted hover:text-primary">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <input
            className="text-2xl font-display font-bold w-full border-none outline-none mb-6 placeholder:text-muted focus:ring-0"
            defaultValue={task.title}
            onBlur={(e) => {
              if (e.target.value !== task.title) {
                updateTaskMutation.mutate({ id: task.id, updates: { title: e.target.value } });
              }
            }}
          />

          <div className="grid grid-cols-2 gap-6 mb-8 text-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-secondary">Assignee</span>
                <div className="flex items-center gap-2">
                  <Avatar fallback="U" size="xs" />
                  <span className="font-medium text-primary">Unassigned</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary">Due Date</span>
                <DueDateBadge dueDate={task.due_date || new Date()} />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-secondary">Status</span>
                <span className="font-medium text-primary capitalize">{task.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary">Estimate</span>
                <div className="flex items-center gap-1 text-primary">
                  <Clock size={14} />
                  <span>{task.estimated_minutes || 0}m</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-sm font-semibold text-primary mb-3">Description</h4>
            <RichTextEditor
              content={task.description || ""}
              onChange={handleDescriptionChange}
            />
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-primary">Subtasks</h4>
              <span className="text-xs text-muted">0%</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 hover:bg-surface-2 rounded-md border border-transparent hover:border-border group">
                <CheckSquare size={16} className="text-muted" />
                <input
                  placeholder="Add a subtask..."
                  className="bg-transparent border-none outline-none text-sm w-full focus:ring-0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface-1">
          <div className="flex items-center gap-2 text-xs text-muted">
            <MessageSquare size={14} />
            <span>0 Comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
