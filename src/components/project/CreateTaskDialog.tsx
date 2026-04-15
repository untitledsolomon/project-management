"use client";

import * as React from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useWorkspace } from "@/components/providers/WorkspaceProvider";
import { motion, AnimatePresence } from "framer-motion";

export function CreateTaskDialog({
  isOpen,
  onClose,
  projectName = "Axis Platform"
}: {
  isOpen: boolean;
  onClose: () => void;
  projectName?: string;
}) {
  const { addTask } = useWorkspace();
  const [title, setTitle] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    addTask({
      title,
      status: "todo",
      priority: "P2",
      assignee: { name: "Solomon", fallback: "SK" },
      dueDate: "Jan 28",
      project: projectName,
      subtasks: { completed: 0, total: 0 }
    });

    setTitle("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/10 backdrop-blur-sm z-[200]"
          />
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg bg-white border border-border-base shadow-2xl rounded-card overflow-hidden pointer-events-auto"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border-base">
                <h2 className="text-xl font-display text-primary">Create New Task</h2>
                <button onClick={onClose} className="text-muted hover:text-primary transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-muted">Task Title</label>
                  <Input
                    autoFocus
                    placeholder="What needs to be done?"
                    className="h-11 text-base"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-muted">Project</label>
                    <div className="h-10 px-3 bg-surface-2 border border-border-base rounded-badge flex items-center text-sm text-secondary font-medium">
                      {projectName}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-muted">Priority</label>
                    <div className="flex gap-2">
                      {["P1", "P2", "P3", "P4"].map((p) => (
                        <button
                          key={p}
                          type="button"
                          className={cn(
                            "flex-1 h-10 border rounded-badge text-[10px] font-bold transition-all",
                            p === "P2" ? "bg-accent border-accent text-white" : "border-border-base text-muted hover:bg-surface-2"
                          )}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                  <Button type="submit" className="gap-2">
                    <Plus size={16} /> Create Task
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function cn(...inputs: (string | boolean | undefined | null)[]) {
  return inputs.filter(Boolean).join(" ");
}
