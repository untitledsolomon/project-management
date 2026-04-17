"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  CheckSquare,
  Layers,
  Inbox,
  Users,
  BarChart2,
  Settings,
  Plus,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { NewProjectModal } from "../project/NewProjectModal";

export function Sidebar() {
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);
  const pathname = usePathname();
  const { user, org, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/" },
    { label: "My Work", icon: CheckSquare, href: "/my-work" },
    { label: "Projects", icon: Layers, href: "/projects" },
    { label: "Inbox", icon: Inbox, href: "/inbox" },
    { label: "People & Teams", icon: "/people", href: "/people", lucide: Users },
    { label: "Reporting", icon: BarChart2, href: "/reporting" },
    { label: "Settings", icon: Settings, href: "/settings" },
  ];

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-white border-r border-border transition-all duration-300",
        collapsed ? "w-[64px]" : "w-[256px]"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 mb-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded flex items-center justify-center text-white font-display font-bold">R</div>
            <span className="font-display font-bold text-lg">Regent PM</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-surface-2 rounded text-secondary"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* New Project Button */}
      {!collapsed && (
        <div className="px-4 mb-6">
          <Button
            className="w-full gap-2 justify-start"
            onClick={() => setNewProjectModalOpen(true)}
          >
            <Plus size={18} />
            New Project
          </Button>
        </div>
      )}

      <NewProjectModal
        open={newProjectModalOpen}
        onOpenChange={setNewProjectModalOpen}
      />

      {/* Navigation */}
      <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = (item as any).lucide || item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                isActive
                  ? "bg-accent/10 text-accent font-medium"
                  : "text-secondary hover:bg-surface-2 hover:text-primary"
              )}
            >
              <Icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-border">
        <div className={cn(
          "flex items-center gap-3",
          collapsed ? "justify-center" : ""
        )}>
          <Avatar
            fallback={user?.full_name || "U"}
            src={user?.avatar_url}
            size="sm"
          />
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-primary truncate">{user?.full_name}</p>
              <p className="text-xs text-secondary truncate">{org?.name}</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={signOut}
              className="p-1 hover:bg-surface-2 rounded text-secondary"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
