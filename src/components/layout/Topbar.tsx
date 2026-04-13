"use client";

import * as React from "react";
import { Search, Bell, Plus, Filter, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";

export function Topbar({ title = "Dashboard" }: { title?: string }) {
  return (
    <header className="sticky top-0 h-14 bg-white border-b border-border-base flex items-center justify-between px-6 z-40">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-medium text-secondary">Workspace</h2>
        <span className="text-muted">/</span>
        <h1 className="text-sm font-semibold text-primary">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative group">
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

        <Button size="sm" className="gap-2">
          <Plus size={16} />
          <span>New</span>
        </Button>

        <Avatar fallback="SD" size="sm" className="ml-2 cursor-pointer" />
      </div>
    </header>
  );
}
