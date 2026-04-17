"use client";

import * as React from "react";
import { Plus, MoreHorizontal } from "lucide-react";
import { TaskCard } from "./TaskCard";
import { Badge } from "@/components/ui/Badge";
import { useWorkspace, Task } from "@/components/providers/WorkspaceProvider";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  useDroppable
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface KanbanColumnProps {
  column: { id: string; title: string; statusColor: string };
  tasks: Task[];
  onTaskClick?: () => void;
}

function KanbanColumn({ column, tasks, onTaskClick }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });
  const [isAdding, setIsAdding] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const { addTask } = useWorkspace();

  const handleAdd = () => {
    if (!title.trim()) return;
    addTask({
      title,
      status: column.id,
      priority: "P3",
      assignee: { name: "Solomon", fallback: "SK" },
      dueDate: "Tomorrow",
      project: "Axis Platform",
      subtasks: { completed: 0, total: 0 }
    });
    setTitle("");
    setIsAdding(false);
  };

  return (
    <div ref={setNodeRef} className="w-80 flex-shrink-0 flex flex-col">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-primary">{column.title}</h3>
          <Badge className={column.statusColor}>{tasks.length}</Badge>
        </div>
        <button className="text-muted hover:text-primary">
          <MoreHorizontal size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-[150px]">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={onTaskClick} />
          ))}
        </SortableContext>

        {isAdding ? (
          <div className="bg-white p-3 rounded-card border border-accent shadow-sm mb-3">
            <textarea
              autoFocus
              className="w-full text-sm outline-none resize-none mb-2"
              placeholder="Task title..."
              rows={2}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAdd(); }
                if (e.key === "Escape") setIsAdding(false);
              }}
            />
            <div className="flex gap-2">
              <button onClick={handleAdd} className="text-[10px] font-bold text-accent uppercase">Add</button>
              <button onClick={() => setIsAdding(false)} className="text-[10px] font-bold text-muted uppercase">Cancel</button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full py-2 flex items-center justify-center gap-2 text-muted hover:text-accent hover:bg-white rounded-badge border border-transparent hover:border-border-base transition-all text-sm group"
          >
            <Plus size={16} className="group-hover:scale-110 transition-transform" />
            <span>Add task</span>
          </button>
        )}
      </div>
    </div>
  );
}

export function KanbanBoard({ onTaskClick }: { onTaskClick?: () => void }) {
  const { tasks, updateTask } = useWorkspace();

  const columns = [
    { id: "todo", title: "Todo", statusColor: "bg-status-todo-bg text-status-todo-text" },
    { id: "in-progress", title: "In Progress", statusColor: "bg-status-progress-bg text-status-progress-text" },
    { id: "review", title: "In Review", statusColor: "bg-status-review-bg text-status-review-text" },
    { id: "done", title: "Done", statusColor: "bg-status-done-bg text-status-done-text" },
  ];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    // Check if dropped over a column or another task
    const overColumn = columns.find(c => c.id === overId);
    if (overColumn) {
      updateTask(taskId, { status: overColumn.id });
      return;
    }

    const overTask = tasks.find(t => t.id === overId);
    if (overTask && overTask.status !== tasks.find(t => t.id === taskId)?.status) {
      updateTask(taskId, { status: overTask.status });
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 overflow-x-auto pb-4 h-[calc(100vh-250px)]">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={tasks.filter(t => t.status === column.id)}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>
    </DndContext>
  );
}
