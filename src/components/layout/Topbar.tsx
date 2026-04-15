"use client";

import * as React from "react";
import { Search, Bell, Plus, Filter, ArrowUpDown, Menu, ChevronDown, CheckSquare, Layers, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

export function Topbar({ title = "Dashboard" }: { title?: string }) {
  const [isNewMenuOpen, setIsNewMenuOpen] = React.useState(false);
  return (
    <header className="sticky top-0 h-14 bg-white border-b border-border-base flex items-center justify-between px-6 z-40">
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 -ml-2 text-secondary hover:bg-surface-2 rounded-badge">
          <Menu size={20} />
        </button>
        <h2 className="text-sm font-medium text-secondary">Workspace</h2>
        <span className="text-muted">/</span>
        <h1 className="text-sm font-semibold text-primary">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative group hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted h-4 w-4" />
          <input
            type="text"
            placeholder="Search tasks, projects..."
            className="h-9 w-64 bg-surface-2 border-transparent focus:bg-white focus:border-border-base rounded-input pl-9 pr-3 text-sm transition-all outline-none"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden group-focus-within:hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border-base bg-white px-1.5 font-mono text-[10px] font-medium text-muted opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>

        <button className="p-2 text-secondary hover:bg-surface-2 rounded-full transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-2 right-2 h-2 w-2 bg-p1 rounded-full border-2 border-white" />
        </button>

        <div className="h-6 w-px bg-border-base mx-1" />

        <div className="relative">
          <Button size="sm" className="gap-2" onClick={() => setIsNewMenuOpen(!isNewMenuOpen)}>
            <Plus size={16} />
            <span>New</span>
            <ChevronDown size={14} className={cn("transition-transform", isNewMenuOpen && "rotate-180")} />
          </Button>

          {isNewMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsNewMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white border border-border-base rounded-card shadow-axis z-20 py-1">
                {[
                  { label: "New Task", icon: CheckSquare, shortcut: "T" },
                  { label: "New Project", icon: Layers, shortcut: "P" },
                  { label: "New Lead", icon: Sparkles, shortcut: "L" },
                ].map((item) => (
                  <button
                    key={item.label}
                    className="flex items-center justify-between w-full px-4 py-2 text-xs text-secondary hover:bg-surface-2 hover:text-primary transition-colors"
                    onClick={() => setIsNewMenuOpen(false)}
                  >
                    <div className="flex items-center gap-2">
                      <item.icon size={14} className="text-muted" />
                      <span>{item.label}</span>
                    </div>
                    <kbd className="font-mono text-[10px] opacity-50">{item.shortcut}</kbd>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <Avatar fallback="SD" size="sm" className="ml-2 cursor-pointer" />
      </div>
    </header>
  );
}
