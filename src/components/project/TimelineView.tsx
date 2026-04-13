"use client";

import * as React from "react";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

const tasks = [
  { id: "AX-101", title: "User interview synthesis", start: 2, duration: 4, assignee: "SK" },
  { id: "AX-102", title: "Finalize brand guidelines", start: 5, duration: 8, assignee: "SK" },
  { id: "AX-104", title: "Define design tokens", start: 1, duration: 3, assignee: "EM" },
  { id: "AX-98", title: "QA Mobile responsiveness", start: 10, duration: 5, assignee: "JD" },
];

const days = Array.from({ length: 20 }, (_, i) => i + 1);

export function TimelineView() {
  return (
    <div className="bg-white border border-border-base rounded-card overflow-hidden flex h-[calc(100vh-300px)]">
      {/* Left List */}
      <div className="w-80 border-r border-border-base flex flex-col flex-shrink-0">
        <div className="h-12 border-b border-border-base flex items-center px-4 bg-surface-2 text-[10px] font-mono uppercase tracking-widest text-muted">
          Task
        </div>
        <div className="flex-1 overflow-y-auto">
          {tasks.map((task) => (
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

            {tasks.map((task, idx) => (
              <div key={task.id} className="h-12 border-b border-border-base flex relative hover:bg-surface-2/30 transition-colors">
                {days.map((day) => (
                  <div key={day} className="w-12 border-r border-border-base flex-shrink-0" />
                ))}

                {/* Task Bar */}
                <div
                  className="absolute h-6 bg-accent rounded-full top-3 flex items-center px-3 text-[10px] text-white font-medium shadow-sm hover:brightness-110 cursor-pointer transition-all z-10 overflow-hidden"
                  style={{
                    left: `${task.start * 48 + 4}px`,
                    width: `${task.duration * 48 - 8}px`
                  }}
                >
                  <span className="truncate">{task.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
