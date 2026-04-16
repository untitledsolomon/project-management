"use client";

import * as React from "react";
import { X, Clock, Play, Pause, MoreHorizontal, Paperclip, ChevronDown, CheckSquare, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { LiveTaskPresence } from "@/components/PresenceIndicator";
import { RichTextEditor } from "./RichTextEditor";

export function TaskDetailDrawer({
  isOpen,
  onClose,
  taskId = "AX-102"
}: {
  isOpen: boolean;
  onClose: () => void;
  taskId?: string;
}) {
  const [isTimerRunning, setIsTimerRunning] = React.useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/10 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-[420px] bg-white border-l border-border-base shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-base">
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-muted uppercase tracking-widest">{taskId}</span>
                <LiveTaskPresence taskId={taskId} />
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1.5 text-muted hover:text-primary hover:bg-surface-2 rounded-badge transition-colors">
                  <MoreHorizontal size={18} />
                </button>
                <button onClick={onClose} className="p-1.5 text-muted hover:text-primary hover:bg-surface-2 rounded-badge transition-colors" aria-label="Close drawer">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {/* Title Section */}
              <div className="px-6 py-6">
                <h2 className="text-2xl font-display text-primary mb-2 focus:outline-none focus:underline decoration-accent/30 underline-offset-4" contentEditable>
                  Finalize brand guidelines
                </h2>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge className="bg-status-progress-bg text-status-progress-text">In Progress</Badge>
                  <Badge variant="outline">Axis Rebrand</Badge>
                  <Badge variant="priority" color="#BE123C">P1 Priority</Badge>
                </div>
              </div>

              {/* Properties Section */}
              <div className="px-6 py-4 space-y-3">
                {[
                  { label: "Assignee", value: <div className="flex items-center gap-2"><Avatar fallback="SK" size="sm" /> Solomon</div> },
                  { label: "Due Date", value: "Today (Jan 23)" },
                  { label: "Labels", value: <div className="flex gap-1"><Badge variant="outline">Design</Badge><Badge variant="outline">Brand</Badge></div> },
                ].map((prop) => (
                  <div key={prop.label} className="grid grid-cols-3 items-center text-sm">
                    <span className="text-muted">{prop.label}</span>
                    <div className="col-span-2 text-primary font-medium cursor-pointer hover:bg-surface-2 px-2 py-1 -ml-2 rounded transition-colors">
                      {prop.value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-px bg-border-base mx-6 my-4" />

              {/* Description Section */}
              <div className="px-6 py-4">
                <h3 className="text-xs font-mono uppercase tracking-widest text-muted mb-4">Description</h3>
                <RichTextEditor
                  content="<p>Comprehensive refresh of the brand guidelines including:</p><ul><li>Updated typography scale using Instrument Serif</li><li>Refined color palette with indigo accents</li><li>Component-based layout system for web/mobile</li></ul>"
                  onChange={(val) => console.log(val)}
                />
              </div>

              {/* Subtasks Section */}
              <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-muted">Subtasks</h3>
                  <span className="text-[10px] font-mono text-muted">2/3</span>
                </div>
                <ProgressBar value={66} className="mb-4" />
                <div className="space-y-2">
                  {[
                    { title: "Define color palette", done: true },
                    { title: "Select primary fonts", done: true },
                    { title: "Layout grid system", done: false },
                  ].map((sub, i) => (
                    <div key={i} className="flex items-center gap-3 py-1 group">
                      <div className={cn(
                        "h-4 w-4 rounded border flex items-center justify-center transition-colors",
                        sub.done ? "bg-accent border-accent text-white" : "border-border-base group-hover:border-accent"
                      )}>
                        {sub.done && <CheckSquare size={10} />}
                      </div>
                      <span className={cn("text-sm", sub.done ? "text-muted line-through" : "text-primary")}>{sub.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Fields Section */}
              <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-4 group cursor-pointer">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-muted">Custom Fields</h3>
                  <ChevronDown size={14} className="text-muted group-hover:text-primary transition-transform" />
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Technical Debt", value: "Low", type: "Select" },
                    { label: "Reviewer", value: "Emma M.", type: "User" },
                    { label: "Est. Hours", value: "12h", type: "Number" },
                  ].map((field) => (
                    <div key={field.label} className="grid grid-cols-3 items-center text-sm">
                      <span className="text-muted">{field.label}</span>
                      <div className="col-span-2 text-primary font-medium cursor-pointer hover:bg-surface-2 px-2 py-1 -ml-2 rounded transition-colors flex items-center justify-between">
                        <span>{field.value}</span>
                        <span className="text-[10px] font-mono text-muted opacity-0 group-hover:opacity-100 uppercase">{field.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attachments Section */}
              <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-muted">Attachments</h3>
                  <button className="text-[10px] font-mono text-accent hover:underline">Add</button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: "Brand_Guide.pdf", size: "2.4MB" },
                    { name: "Logo_Assets.zip", size: "12.8MB" },
                  ].map((file) => (
                    <div key={file.name} className="p-3 border border-border-base rounded-badge bg-surface-1 hover:bg-surface-2 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-2 mb-1">
                        <Paperclip size={14} className="text-muted" />
                        <span className="text-xs font-medium truncate">{file.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-muted">{file.size}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Time Tracker */}
              <div className="mx-6 my-6 p-4 bg-surface-2 rounded-card border border-border-base">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-muted uppercase">Time Tracked</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-bold">04:22:15</span>
                    <button
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center transition-all",
                        isTimerRunning ? "bg-p1 text-white" : "bg-accent text-white"
                      )}
                    >
                      {isTimerRunning ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                    </button>
                  </div>
                </div>
                <ProgressBar value={80} height={2} className="opacity-50" />
              </div>

              {/* Activity & Comments */}
              <div className="px-6 py-4 border-t border-border-base bg-surface-1">
                <h3 className="text-xs font-mono uppercase tracking-widest text-muted mb-4">Activity</h3>
                <div className="flex gap-3 mb-6">
                  <Avatar fallback="SK" size="sm" />
                  <div className="flex-1">
                    <textarea
                      placeholder="Add a comment..."
                      className="w-full bg-white border border-border-base rounded-card p-3 text-sm outline-none focus:border-accent transition-all resize-none h-20"
                    />
                    <div className="flex justify-end mt-2">
                      <Button size="sm">Comment</Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {[
                    { user: "Emma M.", text: "I've uploaded the latest font files to the attachments.", time: "2h ago", avatar: "EM" },
                    { user: "System", text: "changed status to In Progress", time: "4h ago", isSystem: true },
                  ].map((activity, i) => (
                    <div key={i} className="flex gap-3">
                      {!activity.isSystem ? (
                        <>
                          <Avatar fallback={activity.avatar || "?"} size="sm" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-semibold">{activity.user}</span>
                              <span className="text-[10px] font-mono text-muted">{activity.time}</span>
                            </div>
                            <p className="text-sm text-secondary">{activity.text}</p>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 pl-11">
                          <span className="text-xs font-medium text-primary">{activity.user}</span>
                          <span className="text-xs text-muted">{activity.text}</span>
                          <span className="text-[10px] font-mono text-muted ml-2">{activity.time}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Bottom Bar */}
            <div className="p-4 bg-white border-t border-border-base">
              <Button className="w-full gap-2 bg-accent text-white hover:bg-accent/90">
                <MessageSquare size={16} />
                <span>Ask Axis AI about this task</span>
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
