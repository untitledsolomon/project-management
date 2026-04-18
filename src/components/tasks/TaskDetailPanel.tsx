"use client";

import { Task, useUpdateTask, useTaskActivity, useTaskComments, useTaskSubtasks, useCreateTask } from "@/lib/tasks/queries";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { DueDateBadge } from "@/components/ui/DueDateBadge";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { X, CheckSquare, MessageSquare, Clock, History, Maximize2, Minimize2, PlusCircle } from "lucide-react";
import { useState } from "react";
import { TaskActivityLog } from "./TaskActivityLog";
import { TaskComments } from "./TaskComments";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { formatDistanceToNow } from "date-fns";

interface TaskDetailPanelProps {
  task: Task | null;
  onClose: () => void;
}

export function TaskDetailPanel({ task, onClose }: TaskDetailPanelProps) {
  const updateTaskMutation = useUpdateTask();
  const createTaskMutation = useCreateTask();
  const [isExpanded, setIsExpanded] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const { data: activities } = useTaskActivity(task?.id || "");
  const { data: comments } = useTaskComments(task?.id || "");
  const { data: subtasks } = useTaskSubtasks(task?.id || "");

  if (!task) return null;

  const handleDescriptionChange = (content: string) => {
    updateTaskMutation.mutate({ id: task.id, updates: { description: content } });
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-white shadow-2xl z-50 transform transition-all duration-300 ease-in-out border-l border-border-base ${task ? 'translate-x-0' : 'translate-x-full'} ${isExpanded ? 'w-full lg:w-3/4' : 'w-full lg:w-[600px]'}`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-base bg-surface-1">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-2 py-1 bg-surface-2 rounded-badge border border-border-base">
              <span className="text-[10px] font-mono text-muted uppercase tracking-widest">{task.id.slice(0, 8)}</span>
            </div>
            <PriorityBadge priority={task.priority} />
            <div className="h-4 w-px bg-border-base" />
            <span className="text-xs text-secondary font-medium">In {task.status.replace("_", " ")}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-surface-2 rounded-md text-muted transition-colors"
              title={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            <button onClick={onClose} className="p-2 hover:bg-surface-2 rounded-md text-muted transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-10">
          <div className="max-w-3xl mx-auto space-y-12">
            <section>
              <input
                className="text-4xl font-display font-bold w-full border-none outline-none mb-8 placeholder:text-muted focus:ring-0 bg-transparent text-primary"
                defaultValue={task.title}
                placeholder="Task title"
                onBlur={(e) => {
                  if (e.target.value !== task.title) {
                    updateTaskMutation.mutate({ id: task.id, updates: { title: e.target.value } });
                  }
                }}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-sm py-8 border-y border-border-base">
                <div className="space-y-6">
                  <div className="flex items-center justify-between group">
                    <span className="text-secondary font-medium">Assignee</span>
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-surface-2 p-1 px-2 rounded-md transition-colors">
                      <Avatar fallback="U" size="xs" />
                      <span className="font-semibold text-primary">Unassigned</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-secondary font-medium">Due Date</span>
                    <DueDateBadge dueDate={task.due_date || new Date()} />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-secondary font-medium">Status</span>
                    <Badge className="bg-surface-2 text-primary font-bold border border-border-base uppercase tracking-wider text-[10px]">
                      {task.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-secondary font-medium">Estimate</span>
                    <div className="flex items-center gap-1.5 text-primary font-semibold">
                      <Clock size={14} className="text-muted" />
                      <span>{task.estimated_minutes || 0}m</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <Tabs defaultValue="description" className="w-full">
              <TabsList className="bg-transparent border-b border-border-base w-full justify-start rounded-none h-auto p-0 mb-8 gap-8">
                <TabsTrigger
                  value="description"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-2 text-sm font-semibold"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="subtasks"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-2 text-sm font-semibold gap-2"
                >
                  Subtasks
                  <span className="bg-surface-2 text-muted px-1.5 rounded text-[10px]">{subtasks?.length || 0}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="comments"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-2 text-sm font-semibold gap-2"
                >
                  Comments
                  <span className="bg-surface-2 text-muted px-1.5 rounded text-[10px]">{comments?.length || 0}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-2 text-sm font-semibold"
                >
                  Activity
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-0 focus-visible:ring-0">
                <div className="prose prose-sm max-w-none">
                  <RichTextEditor
                    content={task.description || ""}
                    onChange={handleDescriptionChange}
                  />
                </div>
              </TabsContent>

              <TabsContent value="subtasks" className="mt-0 focus-visible:ring-0">
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-primary">Progress</h4>
                    <span className="text-xs font-mono text-accent font-bold">
                      {subtasks?.length
                        ? Math.round((subtasks.filter(s => s.status === 'done').length / subtasks.length) * 100)
                        : 0}%
                    </span>
                  </div>

                  <div className="space-y-2">
                    {subtasks?.map(subtask => (
                      <div key={subtask.id} className="flex items-center gap-3 p-3 bg-surface-1 rounded-lg border border-border-base group hover:border-border-hover transition-all">
                        <button
                          onClick={() => updateTaskMutation.mutate({
                            id: subtask.id,
                            updates: { status: subtask.status === 'done' ? 'todo' : 'done' }
                          })}
                          className={`rounded transition-colors ${subtask.status === 'done' ? 'text-status-done-text bg-status-done-bg' : 'text-muted hover:text-primary'}`}
                        >
                          <CheckSquare size={18} />
                        </button>
                        <span className={`text-sm flex-1 ${subtask.status === 'done' ? 'line-through text-muted' : 'text-primary'}`}>
                          {subtask.title}
                        </span>
                      </div>
                    ))}

                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-dashed border-border-base group focus-within:border-accent focus-within:border-solid transition-all mt-4">
                      <PlusCircle size={18} className="text-muted" />
                      <input
                        placeholder="Add a subtask..."
                        className="bg-transparent border-none outline-none text-sm w-full focus:ring-0 text-primary"
                        value={newSubtaskTitle}
                        onChange={(e) => setNewSubtaskTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newSubtaskTitle.trim()) {
                            const lastPosition = subtasks?.length
                              ? Math.max(...subtasks.map(s => s.position))
                              : 0;
                            createTaskMutation.mutate({
                              title: newSubtaskTitle.trim(),
                              parent_task_id: task.id,
                              project_id: task.project_id,
                              org_id: task.org_id,
                              section_id: task.section_id,
                              status: 'todo',
                              position: lastPosition + 1000.0,
                              priority: 'none'
                            });
                            setNewSubtaskTitle("");
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="comments" className="mt-0 focus-visible:ring-0">
                <TaskComments taskId={task.id} comments={comments || []} />
              </TabsContent>

              <TabsContent value="activity" className="mt-0 focus-visible:ring-0">
                <TaskActivityLog activities={activities || []} />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-border-base bg-surface-1 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted">
              <MessageSquare size={12} />
              <span>{comments?.length || 0} Comments</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted">
              <History size={12} />
              <span>{activities?.length || 0} Events</span>
            </div>
          </div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted">
            Created {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
          </div>
        </div>
      </div>
    </div>
  );
}
