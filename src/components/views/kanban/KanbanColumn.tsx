"use client";

import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task, useCreateTask } from "@/lib/tasks/queries";
import { Section } from "@/lib/sections/queries";
import { TaskCard } from "./TaskCard";
import { MoreHorizontal, Plus, Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

interface KanbanColumnProps {
  section: Section;
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

export function KanbanColumn({ section, tasks, onTaskClick }: KanbanColumnProps) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const createTaskMutation = useCreateTask();
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
          <Badge
            variant={section.wip_limit && tasks.length >= section.wip_limit ? "destructive" : "outline"}
            className="h-5 px-1.5 text-[10px]"
          >
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

      <div className="flex-1 overflow-y-auto min-h-[50px]">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={() => onTaskClick?.(task)} />
          ))}
        </SortableContext>

        {isAddingTask ? (
          <div className="bg-white rounded-card border border-accent p-2 shadow-sm animate-in fade-in zoom-in-95 duration-200">
            <Input
              autoFocus
              placeholder="What needs to be done?"
              className="text-sm h-8 border-none focus:ring-0 px-1 mb-2"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddTask();
                if (e.key === "Escape") setIsAddingTask(false);
              }}
            />
            <div className="flex items-center justify-end gap-1">
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setIsAddingTask(false)}>
                <X size={14} />
              </Button>
              <Button size="sm" className="h-7 px-2 text-xs" onClick={handleAddTask} disabled={!newTaskTitle.trim() || createTaskMutation.isPending}>
                <Check size={14} className="mr-1" />
                Add
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      {!isAddingTask && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start mt-2 gap-2 text-muted hover:text-primary hover:bg-surface-2 h-8 border-none"
          onClick={() => setIsAddingTask(true)}
        >
          <Plus size={14} />
          Add Task
        </Button>
      )}
    </div>
  );
}
