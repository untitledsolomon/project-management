"use client";

import * as React from "react";
import { LayoutGrid, List, BarChart2, Calendar, Filter, ArrowUpDown, Search, UserPlus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

type ViewType = "Board" | "List" | "Timeline" | "Calendar";

const views: ViewType[] = ["Board", "List", "Timeline", "Calendar"];

interface ViewSwitcherProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function ViewSwitcher({ activeView, onViewChange }: ViewSwitcherProps) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center border-b border-border-base w-full sm:w-auto">
          {views.map((view) => (
            <button
              key={view}
              onClick={() => onViewChange(view)}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors relative",
                activeView === view
                  ? "text-accent"
                  : "text-muted hover:text-secondary"
              )}
            >
              <div className="flex items-center gap-2">
                {view === "Board" && <LayoutGrid size={16} />}
                {view === "List" && <List size={16} />}
                {view === "Timeline" && <BarChart2 size={16} />}
                {view === "Calendar" && <Calendar size={16} />}
                {view}
              </div>
              {activeView === view && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
              )}
            </button>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-muted hover:text-secondary gap-2">
            <Filter size={14} /> Filter
          </Button>
          <Button variant="ghost" size="sm" className="text-muted hover:text-secondary gap-2">
            <ArrowUpDown size={14} /> Sort
          </Button>
          <div className="h-4 w-px bg-border-base mx-1" />
          <Button variant="secondary" size="sm" className="gap-2 border-border-base text-secondary">
            <UserPlus size={14} /> Invite
          </Button>
          <Button size="sm" className="gap-2">
            <Plus size={14} /> New Task
          </Button>
        </div>
      </div>
    </div>
  );
}
