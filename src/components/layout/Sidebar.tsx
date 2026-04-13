"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Kanban,
  Clock,
  Settings,
  Users,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Projects", icon: Kanban, href: "/projects" },
  { label: "Time & Billing", iconComp: Clock, href: "/billing" },
  { label: "Team", iconComp: Users, href: "/team" },
  { label: "Settings", iconComp: Settings, href: "/settings" },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-white border-r border-border-base transition-all duration-300 z-50 flex flex-col",
        isCollapsed ? "w-[64px]" : "w-[256px]"
      )}
    >
      {/* Header */}
      <div className="h-14 flex items-center px-4 border-b border-border-base justify-between">
        {!isCollapsed && (
          <span className="font-display text-2xl text-accent tracking-tight">Axis</span>
        )}
        {isCollapsed && <Layers className="text-accent h-6 w-6 mx-auto" />}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hover:bg-surface-2 p-1 rounded-badge text-muted"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.iconComp || (item.icon as React.ElementType);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center h-9 px-3 rounded-badge transition-colors",
                isActive
                  ? "bg-surface-3 text-primary border-l-2 border-accent"
                  : "text-secondary hover:bg-surface-2"
              )}
            >
              <Icon size={18} className={isCollapsed ? "mx-auto" : "mr-3"} />
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-border-base space-y-1">
        <button className="flex items-center w-full h-9 px-3 rounded-badge text-muted hover:bg-surface-2 transition-colors">
          <Sparkles size={18} className={isCollapsed ? "mx-auto" : "mr-3"} />
          {!isCollapsed && <span className="text-xs font-medium">Axis AI</span>}
        </button>
        <div className="pt-2 px-3">
          {!isCollapsed && (
            <p className="text-[10px] text-muted uppercase tracking-wider font-mono">Mobile app coming soon</p>
          )}
        </div>
      </div>
    </aside>
  );
}
