import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";

const activities = [
  { user: "SK", name: "Solomon", action: "completed", target: "AX-89", time: "12m ago" },
  { user: "EM", name: "Emma", action: "commented on", target: "AX-102", time: "45m ago" },
  { user: "JD", name: "Jack", action: "moved", target: "AX-45", extra: "to In Review", time: "2h ago" },
  { user: "SK", name: "Solomon", action: "uploaded", target: "v2_design.fig", time: "4h ago" },
  { user: "LH", name: "Liam", action: "joined", target: "Axis Rebrand", time: "1d ago" },
];

export function RecentActivity() {
  return (
    <Card className="h-full">
      <CardHeader className="py-4">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <div className="space-y-4 px-6">
          {activities.map((act, i) => (
            <div key={i} className="flex gap-3">
              <Avatar fallback={act.user} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-primary leading-tight">
                  <span className="font-semibold">{act.name}</span> {act.action}{" "}
                  <span className="text-accent font-medium cursor-pointer">{act.target}</span>
                  {act.extra && <span className="text-muted italic"> {act.extra}</span>}
                </p>
                <p className="text-[10px] font-mono text-muted mt-0.5">{act.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
