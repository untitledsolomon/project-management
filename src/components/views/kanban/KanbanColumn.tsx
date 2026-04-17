"use client";

import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/lib/tasks/queries";
import { Section } from "@/lib/sections/queries";
import { TaskCard } from "./TaskCard";
import { MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  section: Section;
  tasks: Task[];
}

export function KanbanColumn({ section, tasks }: KanbanColumnProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: section.id,
    data: {
      type: "Column",
      section,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex flex-col w-[300px] min-w-[300px] h-full bg-surface-2/50 rounded-lg p-3",
        isDragging ? "opacity-50" : ""
      )}
    >
      <div className="flex items-center justify-between mb-4 px-1" {...attributes} {...listeners}>
        <div className="flex items-center gap-2">
          <h3 className="font-display font-bold text-sm text-primary uppercase tracking-wider">
            {section.name}
          </h3>
          <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
            {tasks.length}
            {section.wip_limit ? ` / ${section.wip_limit}` : ''}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1 hover:bg-surface-2 rounded text-muted hover:text-primary">
            <Plus size={14} />
          </button>
          <button className="p-1 hover:bg-surface-2 rounded text-muted hover:text-primary">
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>

      <Button variant="ghost" size="sm" className="w-full justify-start mt-2 gap-2 text-muted hover:text-primary hover:bg-surface-2 h-8 border-none">
        <Plus size={14} />
        Add Task
      </Button>
    </div>
  );
}
