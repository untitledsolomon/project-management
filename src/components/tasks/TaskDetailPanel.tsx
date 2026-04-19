"use client";

import { Task, useUpdateTask, useSubtasks, useCreateTask, useTaskActivity, useTaskComments, useCreateComment } from "@/lib/tasks/queries";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { DueDateBadge } from "@/components/ui/DueDateBadge";
import { Avatar } from "@/components/ui/Avatar";
import { X, CheckSquare, MessageSquare, Clock, Plus, Send } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface TaskDetailPanelProps {
  task: Task | null;
  onClose: () => void;
}

export function TaskDetailPanel({ task, onClose }: TaskDetailPanelProps) {
  const updateTaskMutation = useUpdateTask();
  const createTaskMutation = useCreateTask();
  const createCommentMutation = useCreateComment();
  const { data: subtasks } = useSubtasks(task?.id || "");
  const { data: activity } = useTaskActivity(task?.id || "");
  const { data: comments } = useTaskComments(task?.id || "");
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [newComment, setNewComment] = useState("");

  if (!task) return null;

  const handleDescriptionChange = (content: string) => {
    updateTaskMutation.mutate({ id: task.id, updates: { description: content } });
  };

  const handleAddSubtask = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newSubtaskTitle.trim()) {
      createTaskMutation.mutate({
        title: newSubtaskTitle,
        project_id: task.project_id,
        org_id: task.org_id,
        section_id: task.section_id,
        parent_task_id: task.id,
        status: "todo",
        position: (subtasks?.length || 0) * 1000 + 1000,
      });
      setNewSubtaskTitle("");
    }
  };

  const toggleSubtask = (subtask: Task) => {
    updateTaskMutation.mutate({
      id: subtask.id,
      updates: {
        status: subtask.status === "done" ? "todo" : "done",
        completed_at: subtask.status === "done" ? null : new Date().toISOString()
      }
    });
  };

  const subtasksProgress = subtasks && subtasks.length > 0
    ? Math.round((subtasks.filter(t => t.status === "done").length / subtasks.length) * 100)
    : 0;

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    createCommentMutation.mutate({
      task_id: task.id,
      org_id: task.org_id,
      body: newComment,
    });
    setNewComment("");
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[500px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-border ${task ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-muted uppercase tracking-wider">{task.id.split('-')[0]}</span>
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
                <DueDateBadge dueDate={task.due_date || new Date().toISOString()} />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-secondary">Status</span>
                <span className="font-medium text-primary capitalize">{task.status.replace("-", " ")}</span>
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

          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-primary">Subtasks</h4>
              <span className="text-xs text-muted">{subtasksProgress}%</span>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-surface-2 rounded-full mb-4 overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${subtasksProgress}%` }}
              />
            </div>

            <div className="space-y-1 mb-4">
              {subtasks?.map((subtask) => (
                <div key={subtask.id} className="flex items-center gap-3 p-2 hover:bg-surface-2 rounded-md group">
                  <button
                    onClick={() => toggleSubtask(subtask)}
                    className={cn(
                      "flex-shrink-0 w-4 h-4 rounded border transition-colors flex items-center justify-center",
                      subtask.status === "done" ? "bg-accent border-accent text-white" : "border-border text-transparent hover:border-accent"
                    )}
                  >
                    <CheckSquare size={10} />
                  </button>
                  <input
                    className={cn(
                      "bg-transparent border-none outline-none text-sm w-full focus:ring-0",
                      subtask.status === "done" ? "text-muted line-through" : "text-primary"
                    )}
                    defaultValue={subtask.title}
                    onBlur={(e) => {
                      if (e.target.value !== subtask.title) {
                        updateTaskMutation.mutate({ id: subtask.id, updates: { title: e.target.value } });
                      }
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 p-2 bg-surface-1 rounded-md border border-dashed border-border group focus-within:border-accent focus-within:border-solid transition-colors">
              <Plus size={16} className="text-muted group-focus-within:text-accent" />
              <input
                placeholder="Add a subtask..."
                className="bg-transparent border-none outline-none text-sm w-full focus:ring-0"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={handleAddSubtask}
              />
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-sm font-semibold text-primary mb-6">Activity</h4>
            <div className="space-y-6">
              {activity?.map((item) => (
                <div key={item.id} className="flex gap-3 text-xs">
                  <Avatar fallback={item.user?.full_name?.charAt(0) || "U"} size="xs" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-primary">{item.user?.full_name || "System"}</span>
                      <span className="text-muted">
                        {item.action === 'create' && 'created this task'}
                        {item.action === 'update' && `updated ${item.field_name}`}
                        {item.action === 'move' && 'moved this task'}
                        {item.action === 'reorder' && 'reordered this task'}
                        {item.action === 'delete' && 'deleted this task'}
                      </span>
                      <span className="text-muted">•</span>
                      <span className="text-muted">{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                    {item.field_name === 'description' && (
                      <div className="p-2 bg-surface-2 rounded-md text-secondary italic">
                        Description updated
                      </div>
                    )}
                    {item.field_name && item.field_name !== 'description' && (
                      <div className="flex items-center gap-2 text-muted">
                        <span className="line-through">{item.old_value}</span>
                        <span>→</span>
                        <span className="text-primary font-medium">{item.new_value}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer / Comments Input */}
        <div className="p-4 border-t border-border bg-surface-1">
          <div className="mb-4 space-y-4 max-h-[200px] overflow-y-auto">
            {comments?.map((comment) => (
              <div key={comment.id} className="flex gap-3 text-xs">
                <Avatar fallback={comment.user?.full_name?.charAt(0) || "U"} size="xs" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-primary">{comment.user?.full_name || "You"}</span>
                    <span className="text-muted">{new Date(comment.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-secondary leading-normal">{comment.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-white border border-border rounded-lg p-2 focus-within:ring-1 focus-within:ring-accent transition-shadow">
            <input
              className="flex-1 bg-transparent border-none outline-none text-sm px-2"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
            />
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="p-1.5 bg-accent text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/90 transition-colors"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
