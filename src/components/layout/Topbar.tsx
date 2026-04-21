"use client";

import { Search, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { NotificationCenter } from "./NotificationCenter";
import { useAuth } from "@/hooks/useAuth";

export function Topbar() {
  const { user, role } = useAuth();

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
          <NotificationCenter />
        </div>

        <div className="w-px h-6 bg-border mx-2"></div>

        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-medium text-primary">{user?.full_name || "Guest"}</p>
            <p className="text-[10px] text-secondary uppercase">{role || "Member"}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-surface-2 border border-border flex items-center justify-center text-secondary overflow-hidden">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
            ) : (
              <User size={16} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
