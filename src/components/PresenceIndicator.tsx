"use client";

import * as React from "react";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface User {
  id: string;
  name: string;
  fallback: string;
  status: "active" | "away" | "busy";
  location?: string;
}

const activeUsers: User[] = [
  { id: "1", name: "Solomon K.", fallback: "SK", status: "active", location: "Dashboard" },
  { id: "2", name: "Emma M.", fallback: "EM", status: "active", location: "AX-102" },
  { id: "3", name: "Jack D.", fallback: "JD", status: "away", location: "Timeline" },
  { id: "4", name: "Liam H.", fallback: "LH", status: "active", location: "Billing" },
];

export function PresenceIndicator() {
  return (
    <div className="flex flex-col gap-3 py-4 border-t border-border-base mt-auto">
      <div className="px-4 flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted">Active Now</span>
        <div className="flex h-1.5 w-1.5 rounded-full bg-status-done-text animate-pulse" />
      </div>
      <div className="px-2 space-y-1">
        {activeUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-3 px-2 py-1.5 rounded-badge hover:bg-surface-2 transition-colors cursor-pointer group"
          >
            <div className="relative">
              <Avatar fallback={user.fallback} size="sm" />
              <div className={cn(
                "absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-white",
                user.status === "active" ? "bg-status-done-text" : "bg-p3"
              )} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-primary truncate">{user.name}</p>
              <p className="text-[9px] text-muted truncate">{user.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LiveTaskPresence({ taskId }: { taskId: string }) {
  // Simulate users viewing the same task
  const [viewers] = React.useState(activeUsers.slice(0, 2));

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {viewers.map((viewer) => (
          <motion.div
            key={viewer.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            <Avatar
              fallback={viewer.fallback}
              size="sm"
              className="border-2 border-white ring-2 ring-accent/10"
            />
          </motion.div>
        ))}
      </div>
      <span className="text-[10px] text-muted font-medium animate-pulse">Emma is editing...</span>
    </div>
  );
}
