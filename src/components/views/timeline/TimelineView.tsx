"use client";

import { Task } from "@/lib/tasks/queries";
import { format, addDays, startOfToday, eachDayOfInterval, endOfMonth, startOfMonth } from "date-fns";
import { useMemo } from "react";
import { GripVertical } from "lucide-react";

interface TimelineViewProps {
  projectId: string;
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

export function TimelineView({ tasks, onTaskClick }: TimelineViewProps) {
  const today = startOfToday();
  const startDate = useMemo(() => startOfMonth(today), [today]);
  const endDate = useMemo(() => endOfMonth(addDays(startDate, 60)), [startDate]);

  const days = useMemo(() => {
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [startDate, endDate]);

  const dayWidth = 100;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white border border-border rounded-xl overflow-hidden shadow-sm">
      {/* Header / Timeline Labels */}
      <div className="flex border-b border-border bg-surface-1 overflow-x-auto no-scrollbar">
        <div className="w-64 flex-shrink-0 border-r border-border p-4 font-display font-semibold text-sm text-primary flex items-center justify-between">
          <span>Task</span>
          <span className="text-[10px] text-muted font-mono uppercase tracking-widest">Schedule</span>
        </div>
        <div className="flex">
          {days.map((day) => (
            <div
              key={day.toISOString()}
              className="w-[100px] flex-shrink-0 p-2 border-r border-border text-[10px] text-center"
            >
              <div className="text-secondary uppercase font-semibold">{format(day, 'EEE')}</div>
              <div className="font-bold text-primary">{format(day, 'd MMM')}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex-1 overflow-auto">
        <div className="relative min-h-full" style={{ width: 256 + days.length * dayWidth }}>
          {/* Vertical Grid Lines */}
          <div className="absolute inset-0 flex pointer-events-none" style={{ left: 256 }}>
            {days.map((day) => (
              <div
                key={day.toISOString()}
                className={`w-[100px] h-full border-r border-border/40 ${format(day, 'E') === 'Sat' || format(day, 'E') === 'Sun' ? 'bg-surface-2/20' : ''}`}
              />
            ))}
          </div>

          {/* Rows */}
          <div className="flex flex-col relative z-10">
            {tasks.map((task) => {
              const taskStart = task.start_date ? new Date(task.start_date) : today;
              const taskEnd = task.due_date ? new Date(task.due_date) : addDays(taskStart, 2);

              const startOffset = Math.max(0, (taskStart.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
              const duration = Math.max(1, (taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24));

              return (
                <div key={task.id} className="flex border-b border-border/30 group hover:bg-surface-1/40 transition-colors">
                  <div className="w-64 flex-shrink-0 border-r border-border p-3 truncate text-sm font-medium text-primary">
                    {task.title}
                  </div>
                  <div className="relative flex-1 h-12">
                    <div
                      className="absolute top-2 h-8 bg-white border border-border rounded-md flex items-center shadow-sm group/bar cursor-grab active:cursor-grabbing hover:shadow-md transition-all border-l-4"
                      style={{
                        left: startOffset * dayWidth,
                        width: duration * dayWidth,
                        borderLeftColor: 'var(--accent)'
                      }}
                      onClick={() => onTaskClick?.(task)}
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 flex items-center justify-center opacity-0 group-hover/bar:opacity-100 transition-opacity">
                        <GripVertical size={10} className="text-muted" />
                      </div>
                      <span className="px-3 text-[11px] font-semibold text-primary truncate">{task.title}</span>

                      {/* Resize Handles Scaffold */}
                      <div className="absolute -left-1 top-0 bottom-0 w-2 cursor-ew-resize hidden group-hover/bar:block" />
                      <div className="absolute -right-1 top-0 bottom-0 w-2 cursor-ew-resize hidden group-hover/bar:block" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
