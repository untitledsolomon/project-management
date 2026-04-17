"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/Card";
import { Task } from "@/lib/tasks/queries";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { DueDateBadge } from "@/components/ui/DueDateBadge";
import { Avatar, AvatarGroup } from "@/components/ui/Avatar";
import { MessageSquare, Paperclip, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
}

export function TaskCard({ task, isOverlay }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 bg-accent/5 border-2 border-dashed border-accent rounded-card h-[120px] mb-3"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "group mb-3 cursor-grab active:cursor-grabbing outline-none",
        isOverlay ? "rotate-3 scale-105 z-50 shadow-xl" : ""
      )}
    >
      <Card className="hover:border-accent transition-colors">
        <CardContent className="p-3">
          <div className="flex justify-between items-start mb-2">
            <PriorityBadge priority={task.priority} />
            <div className="flex items-center gap-1 text-[10px] font-mono text-muted uppercase">
              {task.id.split('-')[0]}
            </div>
          </div>

          <h4 className="text-sm font-medium text-primary mb-3 line-clamp-2">
            {task.title}
          </h4>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              {task.due_date && <DueDateBadge dueDate={task.due_date} />}
            </div>

            <div className="flex items-center gap-3 text-muted">
              <AvatarGroup>
                {task.assignee_ids?.map(id => (
                  <Avatar key={id} fallback="U" size="xs" />
                )) || <Avatar fallback="?" size="xs" />}
              </AvatarGroup>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/50 text-[10px] text-muted">
            <div className="flex items-center gap-1">
              <CheckSquare size={12} />
              <span>0</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare size={12} />
              <span>0</span>
            </div>
            <div className="flex items-center gap-1">
              <Paperclip size={12} />
              <span>0</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
