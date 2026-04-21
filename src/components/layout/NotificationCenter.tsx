"use client";

import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead, Notification } from "@/lib/notifications/queries";
import { Bell, Check, MoreVertical, Inbox } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/Button";

export function NotificationCenter() {
  const { data: notifications, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications?.filter(n => !n.read_at).length || 0;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="relative p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-p1 rounded-full border-2 border-white"></span>
        )}
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 max-h-[480px] bg-white border border-border rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between bg-surface-1">
              <h3 className="font-display font-semibold text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllRead.mutate()}
                  className="text-xs text-accent hover:underline flex items-center gap-1"
                >
                  <Check size={12} />
                  Mark all as read
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="p-8 text-center text-secondary text-sm">Loading...</div>
              ) : !notifications || notifications.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center">
                  <div className="w-12 h-12 bg-surface-2 rounded-full flex items-center justify-center mb-4 text-muted">
                    <Inbox size={24} />
                  </div>
                  <p className="text-sm font-medium text-primary">All caught up!</p>
                  <p className="text-xs text-secondary mt-1">No new notifications.</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        "p-4 hover:bg-surface-1 transition-colors relative group",
                        !n.read_at && "bg-accent/5"
                      )}
                      onClick={() => !n.read_at && markRead.mutate(n.id)}
                    >
                      {!n.read_at && (
                        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-accent rounded-full" />
                      )}
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-primary">{n.title}</span>
                        <span className="text-[10px] text-secondary">
                          {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-xs text-secondary line-clamp-2 leading-relaxed">
                        {n.body}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-2 border-t border-border bg-surface-1 text-center">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs text-secondary"
                onClick={() => setIsOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
