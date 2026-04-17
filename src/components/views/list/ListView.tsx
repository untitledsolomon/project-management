"use client";

import { Task } from "@/lib/tasks/queries";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { DueDateBadge } from "@/components/ui/DueDateBadge";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import { MessageSquare, Paperclip, CheckSquare, Plus } from "lucide-react";
import { Section } from "@/lib/sections/queries";
import { useState, useMemo } from "react";

interface ListViewProps {
  sections: Section[];
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export function ListView({ sections, tasks, onTaskClick }: ListViewProps) {
  const tasksBySection = useMemo(() => {
    const grouped: Record<string, Task[]> = {};
    sections.forEach((s) => (grouped[s.id] = []));
    tasks.forEach((t) => {
      if (grouped[t.section_id]) {
        grouped[t.section_id].push(t);
      }
    });
    return grouped;
  }, [sections, tasks]);

  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <div key={section.id} className="space-y-2">
          <div className="flex items-center gap-3 px-1 mb-2">
            <h3 className="font-display font-bold text-xs text-primary uppercase tracking-widest">{section.name}</h3>
            <span className="text-[10px] text-muted font-mono">{tasksBySection[section.id]?.length || 0}</span>
          </div>

          <div className="border border-border rounded-lg bg-white overflow-hidden shadow-sm">
            <div className="grid grid-cols-[1fr,120px,120px,100px,80px] gap-4 px-4 py-2 bg-surface-1 border-b border-border text-[10px] font-bold text-muted uppercase tracking-wider">
              <div>Task Name</div>
              <div>Assignee</div>
              <div>Due Date</div>
              <div>Priority</div>
              <div className="text-right">Stats</div>
            </div>

            <div className="divide-y divide-border/50">
              {tasksBySection[section.id]?.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onTaskClick(task)}
                  className="grid grid-cols-[1fr,120px,120px,100px,80px] gap-4 px-4 py-3 hover:bg-surface-2 transition-colors cursor-pointer items-center"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-[10px] font-mono text-muted uppercase shrink-0">{task.id.split('-')[0]}</span>
                    <span className="text-sm font-medium text-primary truncate">{task.title}</span>
                  </div>

                  <div>
                    <div className="flex -space-x-1">
                      {task.assignee_ids?.length > 0 ? (
                        task.assignee_ids.map(id => <Avatar key={id} fallback="U" size="xs" />)
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-dashed border-border flex items-center justify-center text-[10px] text-muted">?</div>
                      )}
                    </div>
                  </div>

                  <div>
                    {task.due_date ? <DueDateBadge dueDate={task.due_date} /> : <span className="text-xs text-muted">-</span>}
                  </div>

                  <div>
                    <PriorityBadge priority={task.priority} />
                  </div>

                  <div className="flex items-center justify-end gap-3 text-muted">
                    <div className="flex items-center gap-1 text-[10px]">
                      <MessageSquare size={10} />
                      <span>0</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px]">
                      <CheckSquare size={10} />
                      <span>0/0</span>
                    </div>
                  </div>
                </div>
              ))}

              {(!tasksBySection[section.id] || tasksBySection[section.id].length === 0) && (
                <div className="px-4 py-8 text-center text-xs text-muted italic">
                  No tasks in this section
                </div>
              )}
            </div>

            <button className="w-full px-4 py-2 flex items-center gap-2 text-xs text-muted hover:text-primary hover:bg-surface-2 border-t border-border transition-colors">
              <Plus size={12} />
              Add task
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
