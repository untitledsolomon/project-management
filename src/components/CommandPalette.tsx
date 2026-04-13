"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, UserPlus, Sparkles, Layout, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function CommandPalette() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const actions = [
    { label: "Create Task", icon: Plus, shortcut: "N", category: "Quick Actions" },
    { label: "New Project", icon: Layout, shortcut: "P", category: "Quick Actions" },
    { label: "Invite Member", icon: UserPlus, shortcut: "I", category: "Quick Actions" },
    { label: "Open Axis AI", icon: Sparkles, shortcut: "A", category: "Axis AI" },
    { label: "Track Time", icon: Clock, shortcut: "T", category: "Axis AI" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-white/60 backdrop-blur-md z-[200]"
          />
          <div className="fixed inset-0 z-[201] flex items-start justify-center pt-[15vh] pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-2xl bg-white border border-border-base shadow-2xl rounded-card overflow-hidden pointer-events-auto"
            >
              <div className="flex items-center px-4 border-b border-border-base">
                <Search className="text-muted mr-3" size={20} />
                <input
                  autoFocus
                  placeholder="Search anything..."
                  className="flex-1 h-14 bg-transparent outline-none text-base placeholder:text-muted"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6 rounded flex items-center justify-center bg-surface-2 text-muted hover:text-primary transition-colors text-[10px] font-mono"
                >
                  ESC
                </button>
              </div>

              <div className="p-2 max-h-[400px] overflow-y-auto">
                <div className="px-2 py-2 text-[10px] font-mono text-muted uppercase tracking-widest">Quick Actions</div>
                {actions.map((action) => (
                  <button
                    key={action.label}
                    className="w-full flex items-center justify-between px-3 py-3 rounded-badge hover:bg-surface-2 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-card border border-border-base flex items-center justify-center text-muted group-hover:text-accent group-hover:border-accent/20 transition-colors">
                        <action.icon size={16} />
                      </div>
                      <span className="text-sm font-medium text-primary">{action.label}</span>
                    </div>
                    <kbd className="font-mono text-[10px] text-muted bg-surface-3 px-1.5 py-0.5 rounded border border-border-base">{action.shortcut}</kbd>
                  </button>
                ))}

                <div className="mt-4 px-2 py-2 text-[10px] font-mono text-muted uppercase tracking-widest">Recent</div>
                {["AX-102 Finalize brand guidelines", "Axis Platform Project", "Regent CAD Portal"].map(item => (
                  <button key={item} className="w-full flex items-center gap-3 px-3 py-3 rounded-badge hover:bg-surface-2 transition-colors text-left text-sm text-secondary">
                    <Search size={14} className="text-muted" />
                    {item}
                  </button>
                ))}
              </div>

              <div className="p-3 bg-surface-2 border-t border-border-base flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted">
                    <kbd className="px-1 bg-white border border-border-base rounded shadow-sm">↑↓</kbd> Navigate
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted">
                    <kbd className="px-1 bg-white border border-border-base rounded shadow-sm">↵</kbd> Select
                  </div>
                </div>
                <div className="text-[10px] font-mono text-muted">
                  Axis Command <span className="text-accent/50">v1.0</span>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
