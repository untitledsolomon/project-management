import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CheckSquare } from "lucide-react";

const tasks = [
  { id: "AX-102", title: "Finalize brand guidelines", project: "Axis Rebrand", due: "Today", priority: "P1", color: "#BE123C" },
  { id: "AX-105", title: "Review Q1 roadmap with stakeholders", project: "Strategy", due: "Tomorrow", priority: "P2", color: "#EA580C" },
  { id: "AX-108", title: "API Documentation updates", project: "Core API", due: "Jan 24", priority: "P3", color: "#CA8A04" },
  { id: "AX-112", title: "Competitor analysis report", project: "Marketing", due: "Jan 25", priority: "P4", color: "#9090A0" },
];

export function MyTasks() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <CardTitle className="text-lg">My Tasks</CardTitle>
        <Badge variant="outline" className="font-mono">14 Total</Badge>
      </CardHeader>
      <CardContent className="px-0">
        <div className="divide-y divide-border-base">
          {tasks.map((task) => (
            <div key={task.id} className="group flex items-center px-6 py-3 hover:bg-surface-2 transition-colors cursor-pointer">
              <div className="h-4 w-4 rounded border border-border-base mr-4 group-hover:border-accent flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary truncate">{task.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] font-mono text-muted uppercase">{task.id}</span>
                  <Badge variant="outline" className="text-[10px] h-4 px-1">{task.project}</Badge>
                </div>
              </div>
              <div className="text-right ml-4">
                <p className="text-[10px] font-medium text-secondary">{task.due}</p>
                <Badge variant="priority" color={task.color} className="p-0 mt-0.5" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
