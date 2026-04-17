"use client";

import * as React from "react";
import { useWorkspace, Task } from "@/components/providers/WorkspaceProvider";
import { Avatar } from "@/components/ui/Avatar";
import { ChevronRight, Search, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";

const days = Array.from({ length: 20 }, (_, i) => i + 1);

interface TimelineTask extends Task {
  start: number;
  duration: number;
  dependencies: string[];
}

export function TimelineView({ onTaskClick }: { onTaskClick?: (taskId: string) => void }) {
  const { tasks: workspaceTasks, updateTask } = useWorkspace();

  // Map workspace tasks to timeline format (adding dummy timeline data if missing)
  const timelineTasks: TimelineTask[] = workspaceTasks.map((t, index) => {
    const extended = t as unknown as { start?: number; duration?: number; dependencies?: string[] };
    return {
      ...t,
      start: extended.start || (index * 2 + 1),
      duration: extended.duration || 3,
      dependencies: extended.dependencies || []
    };
  });

  const handleTaskDrag = (taskId: string, newStart: number) => {
    const task = timelineTasks.find(t => t.id === taskId);
    if (task && task.start !== newStart) {
      updateTask(taskId, { start: newStart } as Partial<Task>);
    }
  };

  const handleTaskResize = (taskId: string, newDuration: number) => {
    const task = timelineTasks.find(t => t.id === taskId);
    if (task && task.duration !== newDuration && newDuration > 0) {
      updateTask(taskId, { duration: newDuration } as Partial<Task>);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-300px)]">
      {/* Timeline Toolbar */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted h-3.5 w-3.5" />
            <input
              type="text"
              placeholder="Filter timeline..."
              className="pl-8 pr-3 py-1.5 bg-white border border-border-base rounded-badge text-xs outline-none focus:ring-1 focus:ring-accent w-48"
            />
          </div>
          <div className="flex items-center bg-white border border-border-base rounded-badge p-0.5">
            {["Day", "Week", "Month", "Quarter"].map((v) => (
              <button
                key={v}
                className={cn(
                  "px-3 py-1 text-[10px] font-mono uppercase tracking-tight rounded-badge transition-colors",
                  v === "Week" ? "bg-accent text-white" : "text-muted hover:text-primary"
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-muted hover:bg-white border border-transparent hover:border-border-base rounded-badge transition-all">
            <ZoomOut size={16} />
          </button>
          <button className="p-1.5 text-muted hover:bg-white border border-transparent hover:border-border-base rounded-badge transition-all">
            <ZoomIn size={16} />
          </button>
        </div>
      </div>

      <div className="bg-white border border-border-base rounded-card overflow-hidden flex flex-1 shadow-axis">
        {/* Left List */}
        <div className="w-80 border-r border-border-base flex flex-col flex-shrink-0">
          <div className="h-12 border-b border-border-base flex items-center px-4 bg-surface-2 text-[10px] font-mono uppercase tracking-widest text-muted">
            Task Hierarchy
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {timelineTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onTaskClick?.(task.id)}
                className="h-12 border-b border-border-base flex items-center px-4 text-[13px] font-medium text-primary hover:bg-surface-2 cursor-pointer group"
              >
                <ChevronRight size={14} className="text-muted mr-1 opacity-50 group-hover:opacity-100 transition-opacity" />
                <span className="text-[10px] font-mono text-muted mr-2">{task.id}</span>
                <span className="truncate flex-1">{task.title}</span>
                <Avatar fallback={task.assignee.fallback} size="sm" className="ml-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Timeline */}
        <div className="flex-1 overflow-auto custom-scrollbar relative">
          <div className="inline-flex flex-col min-w-full">
            {/* Header */}
            <div className="h-12 border-b border-border-base flex bg-surface-2 sticky top-0 z-20">
              {days.map((day) => (
                <div key={day} className="w-12 border-r border-border-base flex-shrink-0 flex flex-col items-center justify-center">
                  <span className="text-[9px] font-mono text-muted/60 uppercase">Jan</span>
                  <span className="text-[11px] font-mono font-bold text-muted">{day}</span>
                </div>
              ))}
            </div>

            {/* Grid Rows */}
            <div className="relative">
              {/* Today Line */}
              <div className="absolute top-0 bottom-0 left-[240px] w-px bg-accent z-20">
                <div className="h-2 w-2 rounded-full bg-accent -ml-[3.5px] mt-0" />
              </div>

              <svg className="absolute inset-0 pointer-events-none z-0" width={days.length * 48} height={timelineTasks.length * 48}>
                {timelineTasks.map((task, i) =>
                  task.dependencies.map((depId) => {
                    const depTask = timelineTasks.find(t => t.id === depId);
                    if (!depTask) return null;
                    const depIdx = timelineTasks.indexOf(depTask);
                    const startX = (depTask.start + depTask.duration) * 48 - 4;
                    const startY = depIdx * 48 + 24;
                    const endX = task.start * 48 + 4;
                    const endY = i * 48 + 24;

                    return (
                      <path
                        key={`${depId}-${task.id}`}
                        d={`M ${startX} ${startY} L ${startX + 12} ${startY} L ${startX + 12} ${endY} L ${endX} ${endY}`}
                        stroke="#E4E4E7"
                        strokeWidth="1.5"
                        fill="none"
                        markerEnd="url(#arrowhead)"
                      />
                    );
                  })
                )}
                <defs>
                  <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="6" refY="2" orientation="auto">
                    <polygon points="0 0, 6 2, 0 4" fill="#E4E4E7" />
                  </marker>
                </defs>
              </svg>

              {timelineTasks.map((task) => (
                <div key={task.id} className="h-12 border-b border-border-base flex relative hover:bg-surface-2/30 transition-colors">
                  {days.map((day) => (
                    <div key={day} className="w-12 border-r border-border-base flex-shrink-0" />
                  ))}

                  {/* Milestone Diamond */}
                  {task.duration === 1 && (
                    <div
                      className="absolute h-4 w-4 bg-accent rotate-45 top-4 z-10 shadow-sm border-2 border-white"
                      style={{ left: `${task.start * 48 + 16}px` }}
                    />
                  )}

                  {/* Task Bar */}
                  {task.duration > 1 && (
                    <div
                      className={cn(
                        "absolute h-6 rounded-full top-3 flex items-center px-3 text-[10px] text-white font-medium shadow-sm hover:brightness-110 cursor-pointer transition-all z-10 overflow-hidden",
                        task.priority === "P1" ? "bg-accent brightness-[0.85] saturate-[1.2] border border-p1/20" : "bg-accent"
                      )}
                      style={{
                        left: `${task.start * 48 + 4}px`,
                        width: `${task.duration * 48 - 8}px`
                      }}
                      onMouseDown={(e) => {
                        const startX = e.clientX;
                        const initialStart = task.start;

                        const onMouseMove = (moveEvent: MouseEvent) => {
                          const delta = Math.round((moveEvent.clientX - startX) / 48);
                          handleTaskDrag(task.id, Math.max(0, initialStart + delta));
                        };

                        const onMouseUp = () => {
                          window.removeEventListener("mousemove", onMouseMove);
                          window.removeEventListener("mouseup", onMouseUp);
                        };

                        window.addEventListener("mousemove", onMouseMove);
                        window.addEventListener("mouseup", onMouseUp);
                      }}
                    >
                      <div
                        className="absolute left-0 top-0 bottom-0 w-2 bg-white/20 hover:bg-white/40 cursor-ew-resize"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          const sX = e.clientX;
                          const iS = task.start;
                          const iD = task.duration;

                          const onMouseMove = (moveEvent: MouseEvent) => {
                            const delta = Math.round((moveEvent.clientX - sX) / 48);
                            const nS = Math.max(0, iS + delta);
                            const nD = iD - (nS - iS);
                            if (nD > 0) {
                              handleTaskDrag(task.id, nS);
                              handleTaskResize(task.id, nD);
                            }
                          };

                          const onMouseUp = () => {
                            window.removeEventListener("mousemove", onMouseMove);
                            window.removeEventListener("mouseup", onMouseUp);
                          };

                          window.addEventListener("mousemove", onMouseMove);
                          window.addEventListener("mouseup", onMouseUp);
                        }}
                      />
                      <span className="truncate ml-1 select-none pointer-events-none">{task.title}</span>
                      <div
                        className="absolute right-0 top-0 bottom-0 w-2 bg-white/20 hover:bg-white/40 cursor-ew-resize"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          const sX = e.clientX;
                          const iD = task.duration;

                          const onMouseMove = (moveEvent: MouseEvent) => {
                            const delta = Math.round((moveEvent.clientX - sX) / 48);
                            handleTaskResize(task.id, Math.max(1, iD + delta));
                          };

                          const onMouseUp = () => {
                            window.removeEventListener("mousemove", onMouseMove);
                            window.removeEventListener("mouseup", onMouseUp);
                          };

                          window.addEventListener("mousemove", onMouseMove);
                          window.addEventListener("mouseup", onMouseUp);
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
