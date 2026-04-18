"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Avatar } from "@/components/ui/Avatar";
import { formatDistanceToNow } from "date-fns";
import { Bell } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface Notification {
  id: string;
  org_id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  data: Record<string, unknown> | null;
  read_at: string | null;
  created_at: string;
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      return data as Notification[];
    },
  });

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("notifications")
        .update({ read_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const unreadCount = notifications?.filter((n) => !n.read_at).length || 0;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-surface-2 rounded-md transition-colors text-muted hover:text-primary"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-p1 rounded-full border-2 border-white" />
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 lg:w-96 bg-white border border-border-base rounded-lg shadow-xl z-50 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border-base bg-surface-1">
              <h3 className="text-sm font-bold text-primary">Notifications</h3>
              <div className="flex items-center gap-2">
                <button className="text-[10px] font-mono uppercase tracking-widest text-accent hover:underline">
                  Mark all as read
                </button>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications?.length ? (
                <div className="divide-y divide-border-base">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        "p-4 flex gap-3 hover:bg-surface-2 transition-colors cursor-pointer",
                        !n.read_at && "bg-accent/5"
                      )}
                      onClick={() => !n.read_at && markAsRead.mutate(n.id)}
                    >
                      <Avatar fallback={n.title.charAt(0)} size="xs" />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={cn("text-xs", !n.read_at ? "font-bold text-primary" : "text-secondary")}>
                            {n.title}
                          </span>
                          <span className="text-[10px] text-muted font-mono uppercase">
                            {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-[13px] text-secondary leading-snug line-clamp-2">
                          {n.body}
                        </p>
                      </div>
                      {!n.read_at && (
                        <div className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-sm text-muted">No notifications yet</p>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-border-base bg-surface-1 text-center">
              <button className="text-xs font-semibold text-secondary hover:text-primary">
                View all activity
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
