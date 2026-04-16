"use client";

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
import { useWorkspace } from "@/components/providers/WorkspaceProvider";
import Link from "next/link";
import { Skeleton } from "@/components/ui/Skeleton";
import { motion } from "framer-motion";

export default function Home() {
  const { projects, isLoading } = useWorkspace();
  return (
    <MainLayout title="Dashboard">
      <div className="mb-8">
        <h1 className="text-4xl font-display text-primary mb-1">Good morning, Solomon</h1>
        <p className="text-secondary text-sm">Tuesday, January 23, 2024</p>
      </div>

      <KPICards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 items-start">
        <div className="lg:col-span-2 h-full">
          <MyTasks />
        </div>
        <div className="flex flex-col gap-8 h-full">
          <AxisAI />
          <RecentActivity />
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-display">Active Projects</h2>
        <button className="text-accent text-sm font-medium hover:underline">View all projects</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-6 space-y-4">
              <div className="flex justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              <Skeleton className="h-2 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-24" />
              </div>
            </Card>
          ))
        ) : (
          projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link href={`/projects/${project.id}`}>
                <Card className="hover:border-accent/50 transition-colors cursor-pointer group h-full">
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
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </MainLayout>
  );
}
