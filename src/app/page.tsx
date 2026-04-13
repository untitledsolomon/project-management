import { MainLayout } from "@/components/layout/MainLayout";
import { KPICards } from "@/components/dashboard/KPICards";
import { MyTasks } from "@/components/dashboard/MyTasks";
import { AxisAI } from "@/components/dashboard/AxisAI";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { AvatarGroup, Avatar } from "@/components/ui/Avatar";
import { MoreHorizontal } from "lucide-react";

const projects = [
  { name: "Axis Platform", client: "Internal", progress: 65, tasks: 24, status: "In Progress", statusColor: "text-status-progress-text bg-status-progress-bg" },
  { name: "Regent Portal", client: "Regent CAD", progress: 92, tasks: 4, status: "In Review", statusColor: "text-status-review-text bg-status-review-bg" },
  { name: "Forge CMS", client: "Forge Inc.", progress: 12, tasks: 45, status: "In Progress", statusColor: "text-status-progress-text bg-status-progress-bg" },
];

export default function Home() {
  return (
    <MainLayout title="Dashboard">
      <div className="mb-8">
        <h1 className="text-4xl font-display text-primary mb-1">Good morning, Solomon</h1>
        <p className="text-secondary text-sm">Tuesday, January 23, 2024</p>
      </div>

      <KPICards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <MyTasks />
        </div>
        <div className="space-y-8">
          <AxisAI />
          <RecentActivity />
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-display">Active Projects</h2>
        <button className="text-accent text-sm font-medium hover:underline">View all projects</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.name} className="hover:border-accent/50 transition-colors cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-display text-xl group-hover:text-accent transition-colors">{project.name}</h3>
                  <p className="text-xs text-muted font-mono uppercase tracking-tight">{project.client}</p>
                </div>
                <button className="text-muted hover:text-primary">
                  <MoreHorizontal size={18} />
                </button>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[10px] font-mono text-muted uppercase">Progress</span>
                  <span className="text-xs font-semibold">{project.progress}%</span>
                </div>
                <ProgressBar value={project.progress} />
              </div>

              <div className="flex items-center justify-between">
                <AvatarGroup>
                  <Avatar fallback="SK" size="sm" />
                  <Avatar fallback="EM" size="sm" />
                  <Avatar fallback="JD" size="sm" />
                </AvatarGroup>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted font-mono">{project.tasks} Tasks</span>
                  <Badge className={project.statusColor}>{project.status}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </MainLayout>
  );
}
