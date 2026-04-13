import * as React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { MessageSquare, Paperclip, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";

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
  return (
    <Card
      className="mb-3 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group relative"
      onClick={onClick}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-accent/20 transition-colors rounded-l-card" />
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
