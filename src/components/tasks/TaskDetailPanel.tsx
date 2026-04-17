"use client";

import { Task, useUpdateTask, useTaskComments, useCreateComment, useSubtasks, useCreateTask } from "@/lib/tasks/queries";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { DueDateBadge } from "@/components/ui/DueDateBadge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { X, CheckSquare, MessageSquare, Clock, Send, Square, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface TaskDetailPanelProps {
  task: Task | null;
  onClose: () => void;
}

export function TaskDetailPanel({ task, onClose }: TaskDetailPanelProps) {
  const [newComment, setNewComment] = useState("");
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const updateTaskMutation = useUpdateTask();
  const { data: comments } = useTaskComments(task?.id || "");
  const { data: subtasks } = useSubtasks(task?.id || "");
  const createCommentMutation = useCreateComment();
  const createSubtaskMutation = useCreateTask();

  if (!task) return null;

  const completedSubtasks = subtasks?.filter(s => s.completed_at).length || 0;
  const totalSubtasks = subtasks?.length || 0;
  const progress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

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
              <span className="text-xs text-muted">{progress}%</span>
            </div>
            <div className="space-y-1 mb-4">
              {subtasks?.map((subtask) => (
                <div key={subtask.id} className="flex items-center gap-3 p-2 hover:bg-surface-2 rounded-md group">
                  <button
                    onClick={() => {
                      updateTaskMutation.mutate({
                        id: subtask.id,
                        updates: { completed_at: subtask.completed_at ? null : new Date().toISOString() }
                      });
                    }}
                    className="text-muted hover:text-accent transition-colors"
                  >
                    {subtask.completed_at ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Square size={16} />}
                  </button>
                  <span className={cn("text-sm flex-1", subtask.completed_at ? "line-through text-muted" : "text-primary")}>
                    {subtask.title}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 p-2 hover:bg-surface-2 rounded-md border border-transparent hover:border-border group">
              <Plus size={16} className="text-muted" />
              <input
                placeholder="Add a subtask..."
                className="bg-transparent border-none outline-none text-sm w-full focus:ring-0"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key === "Enter" && newSubtaskTitle.trim()) {
                    try {
                      await createSubtaskMutation.mutateAsync({
                        org_id: task.org_id,
                        project_id: task.project_id,
                        section_id: task.section_id,
                        title: newSubtaskTitle,
                        parent_task_id: task.id,
                        position: (subtasks?.length || 0) * 1000 + 1000
                      });
                      setNewSubtaskTitle("");
                      toast.success("Subtask added");
                    } catch (err: any) {
                      toast.error(err.message || "Failed to add subtask");
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="border-t border-border bg-surface-1 flex flex-col max-h-[40%]">
          <div className="p-4 flex items-center gap-2 text-xs font-semibold text-primary border-b border-border/50">
            <MessageSquare size={14} />
            <span>{comments?.length || 0} Comments</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {comments?.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar fallback={comment.user?.full_name || "U"} src={comment.user?.avatar_url} size="xs" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-primary">{comment.user?.full_name}</span>
                    <span className="text-[10px] text-muted">{formatDistanceToNow(new Date(comment.created_at))} ago</span>
                  </div>
                  <div className="text-sm text-secondary bg-white p-2 rounded-md border border-border shadow-sm prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: comment.body }} />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-border bg-white">
            <RichTextEditor
              content={newComment}
              onChange={setNewComment}
              placeholder="Write a comment..."
            />
            <div className="flex justify-end mt-2">
              <Button
                size="sm"
                className="gap-2"
                disabled={!newComment.trim() || createCommentMutation.isPending}
                onClick={async () => {
                  try {
                    await createCommentMutation.mutateAsync({
                      taskId: task.id,
                      body: newComment,
                      orgId: task.org_id
                    });
                    setNewComment("");
                    toast.success("Comment added");
                  } catch (e: any) {
                    toast.error(e.message || "Failed to add comment");
                  }
                }}
              >
                <Send size={14} />
                Comment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
