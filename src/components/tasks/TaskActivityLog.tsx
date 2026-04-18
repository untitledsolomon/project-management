"use client";

import { ActivityLog } from "@/lib/tasks/queries";
import { Avatar } from "@/components/ui/Avatar";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowRight
} from "lucide-react";

interface TaskActivityLogProps {
  activities: ActivityLog[];
}

export function TaskActivityLog({ activities }: TaskActivityLogProps) {
  const formatValue = (field: string | null, value: string | null) => {
    if (!value || value === "null") return "none";
    if (field === "due_date") {
      try {
        return new Date(value).toLocaleDateString();
      } catch (e) {
        return value;
      }
    }
    return value;
  };

  const getActionText = (activity: ActivityLog) => {
    const userName = activity.user?.full_name || "Someone";

    switch (activity.action) {
      case "create":
        return <span><strong>{userName}</strong> created this task</span>;
      case "comment":
        return <span><strong>{userName}</strong> commented</span>;
      case "update":
        return (
          <span>
            <strong>{userName}</strong> changed <strong>{activity.field_name?.replace("_", " ")}</strong> from{" "}
            <span className="text-secondary">{formatValue(activity.field_name, activity.old_value)}</span> to{" "}
            <strong>{formatValue(activity.field_name, activity.new_value)}</strong>
          </span>
        );
      case "move":
        return <span><strong>{userName}</strong> moved this task</span>;
      case "delete":
        return <span><strong>{userName}</strong> deleted this task</span>;
      default:
        return <span><strong>{userName}</strong> {activity.action}d this task</span>;
    }
  };

  return (
    <div className="space-y-6">
      {activities.map((activity) => (
        <div key={activity.id} className="flex gap-3">
          <div className="mt-1">
            <Avatar
              fallback={activity.user?.full_name?.charAt(0) || "U"}
              src={activity.user?.avatar_url}
              size="xs"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-primary leading-relaxed">
              {getActionText(activity)}
            </div>
            <div className="text-[10px] text-muted mt-1 font-mono uppercase tracking-wider">
              {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
