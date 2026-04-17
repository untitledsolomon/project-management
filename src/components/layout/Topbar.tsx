"use client";

import { Search, Bell, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function Topbar() {
  return (
    <header className="h-14 border-b border-border bg-white sticky top-0 z-10 px-6 flex items-center justify-between">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
          <Input
            placeholder="Search projects, tasks... (Cmd+K)"
            className="pl-10 bg-surface-1 border-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="gap-2">
            <Plus size={16} />
            Quick Add
          </Button>
          <Button variant="ghost" size="sm" className="relative p-2">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-p1 rounded-full border-2 border-white"></span>
          </Button>
        </div>

        <div className="w-px h-6 bg-border mx-2"></div>

        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-medium text-primary">Solomon Kani</p>
            <p className="text-[10px] text-secondary uppercase">Owner</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-surface-2 border border-border flex items-center justify-center text-secondary">
            <User size={16} />
          </div>
        </div>
      </div>
    </header>
  );
}
