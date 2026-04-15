"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useWorkspace, Task } from "@/components/providers/WorkspaceProvider";

const days = Array.from({ length: 20 }, (_, i) => i + 1);

interface TimelineTask extends Task {
  start: number;
  duration: number;
  dependencies: string[];
}

export function TimelineView() {
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
    <div className="bg-white border border-border-base rounded-card overflow-hidden flex h-[calc(100vh-300px)]">
      {/* Left List */}
      <div className="w-80 border-r border-border-base flex flex-col flex-shrink-0">
        <div className="h-12 border-b border-border-base flex items-center px-4 bg-surface-2 text-[10px] font-mono uppercase tracking-widest text-muted">
          Task
        </div>
        <div className="flex-1 overflow-y-auto">
          {timelineTasks.map((task) => (
            <div key={task.id} className="h-12 border-b border-border-base flex items-center px-4 text-xs font-medium text-primary hover:bg-surface-2 cursor-pointer">
              <span className="text-muted font-mono mr-2">{task.id}</span>
              <span className="truncate">{task.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Timeline */}
      <div className="flex-1 overflow-auto custom-scrollbar relative">
        <div className="inline-flex flex-col min-w-full">
          {/* Header */}
          <div className="h-12 border-b border-border-base flex bg-surface-2 sticky top-0 z-10">
            {days.map((day) => (
              <div key={day} className="w-12 border-r border-border-base flex-shrink-0 flex items-center justify-center text-[10px] font-mono text-muted">
                Jan {day}
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
                    className="absolute h-6 bg-accent rounded-full top-3 flex items-center px-3 text-[10px] text-white font-medium shadow-sm hover:brightness-110 cursor-pointer transition-all z-10 overflow-hidden"
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
  );
}
