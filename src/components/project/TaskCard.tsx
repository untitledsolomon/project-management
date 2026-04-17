import * as React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { MessageSquare, Paperclip, CheckSquare, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface Task {
  id: string;
  title: string;
  priority: "P1" | "P2" | "P3" | "P4";
  assignee: { name: string; fallback: string; src?: string };
  dueDate: string;
  comments: number;
  attachments: number;
  subtasks: { completed: number; total: number };
}

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

const priorityColors = {
  P1: "#BE123C",
  P2: "#EA580C",
  P3: "#CA8A04",
  P4: "#9090A0",
};

export function TaskCard({ task, onClick }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "mb-3 hover:shadow-md transition-shadow group relative pl-2",
        isDragging && "z-50 shadow-xl border-accent"
      )}
      onClick={onClick}
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute left-0 top-0 bottom-0 w-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={14} className="text-muted" />
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="priority" color={priorityColors[task.priority]} className="font-mono text-[10px] p-0">
            {task.id}
          </Badge>
          <Avatar fallback={task.assignee.fallback} size="sm" src={task.assignee.src} />
        </div>

        <h4 className="text-sm font-medium text-primary mb-4 leading-snug">
          {task.title}
        </h4>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-muted">
            {task.subtasks.total > 0 && (
              <div className="flex items-center gap-1">
                <CheckSquare size={12} />
                <span className="text-[10px] font-mono">{task.subtasks.completed}/{task.subtasks.total}</span>
              </div>
            )}
            {task.comments > 0 && (
              <div className="flex items-center gap-1">
                <MessageSquare size={12} />
                <span className="text-[10px] font-mono">{task.comments}</span>
              </div>
            )}
          </div>
          <span className="text-[10px] font-medium text-secondary">{task.dueDate}</span>
        </div>
      </CardContent>
    </Card>
  );
}
