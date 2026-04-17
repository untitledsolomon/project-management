import * as React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Kanban, CheckCircle2, Clock, Users } from "lucide-react";

const kpis = [
  { label: "Active Projects", value: "12", icon: Kanban, change: "+2 from last month" },
  { label: "Tasks Due Today", value: "8", icon: CheckCircle2, change: "3 high priority" },
  { label: "Hours This Week", value: "34.5", icon: Clock, change: "82% billable" },
  { label: "Team Members", value: "18", icon: Users, change: "2 out of office" },
];

export function KPICards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Card key={kpi.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted">{kpi.label}</span>
                <Icon size={18} className="text-accent" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-display text-primary">{kpi.value}</h3>
                <p className="text-[10px] font-mono text-muted uppercase tracking-tight">{kpi.change}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
