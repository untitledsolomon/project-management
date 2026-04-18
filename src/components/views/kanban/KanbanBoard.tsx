"use client";

import React, { useState, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { Task, useMoveTask } from "@/lib/tasks/queries";
import { Section } from "@/lib/sections/queries";
import { KanbanColumn } from "./KanbanColumn";
import { TaskCard } from "./TaskCard";

interface KanbanBoardProps {
  initialSections: Section[];
  initialTasks: Task[];
  onTaskClick?: (taskId: string) => void;
}

export function KanbanBoard({ initialSections, initialTasks, onTaskClick }: KanbanBoardProps) {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeColumn, setActiveColumn] = useState<Section | null>(null);
  const moveTaskMutation = useMoveTask();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const tasksBySection = useMemo(() => {
    const grouped: Record<string, Task[]> = {};
    sections.forEach((s) => (grouped[s.id] = []));
    tasks.forEach((t) => {
      if (grouped[t.section_id]) {
        grouped[t.section_id].push(t);
      }
    });
    // Sort tasks in each section by position
    Object.keys(grouped).forEach(sectionId => {
      grouped[sectionId].sort((a, b) => a.position - b.position);
    });
    return grouped;
  }, [sections, tasks]);

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.section);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].section_id !== tasks[overIndex].section_id) {
          tasks[activeIndex].section_id = tasks[overIndex].section_id;
          return arrayMove(tasks, activeIndex, overIndex);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        tasks[activeIndex].section_id = overId as string;
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (active.data.current?.type === "Column") {
      if (activeId !== overId) {
        setSections((sections) => {
          const activeIndex = sections.findIndex((s) => s.id === activeId);
          const overIndex = sections.findIndex((s) => s.id === overId);
          return arrayMove(sections, activeIndex, overIndex);
        });
      }
    }

    if (active.data.current?.type === "Task") {
      const task = tasks.find((t) => t.id === activeId);
      if (task) {
        const sectionId = task.section_id;
        const sortedTasks = tasks
          .filter(t => t.section_id === sectionId)
          .sort((a, b) => a.position - b.position);

        const index = sortedTasks.findIndex(t => t.id === activeId);

        let newPosition: number;

        if (sortedTasks.length === 1) {
          newPosition = 1000;
        } else if (index === 0) {
          newPosition = sortedTasks[1].position / 2;
        } else if (index === sortedTasks.length - 1) {
          newPosition = sortedTasks[index - 1].position + 1000;
        } else {
          newPosition = (sortedTasks[index - 1].position + sortedTasks[index + 1].position) / 2;
        }

        moveTaskMutation.mutate({
          id: activeId as string,
          section_id: sectionId,
          position: newPosition
        });
      }
    }
  }

  return (
    <div className="flex-1 flex overflow-x-auto gap-4 pb-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className="flex gap-4">
          <SortableContext items={sections.map(s => s.id)} strategy={horizontalListSortingStrategy}>
            {sections.map((section) => (
              <KanbanColumn
                key={section.id}
                section={section}
                tasks={tasksBySection[section.id] || []}
                onTaskClick={onTaskClick}
              />
            ))}
          </SortableContext>
        </div>

        {typeof document !== "undefined" && createPortal(
          <DragOverlay dropAnimation={{
            sideEffects: defaultDropAnimationSideEffects({
              styles: {
                active: {
                  opacity: "0.5",
                },
              },
            }),
          }}>
            {activeColumn && (
              <KanbanColumn
                section={activeColumn}
                tasks={tasksBySection[activeColumn.id] || []}
              />
            )}
            {activeTask && <TaskCard task={activeTask} isOverlay />}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}
