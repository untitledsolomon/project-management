"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { useProjects } from "@/lib/projects/queries";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, MoreHorizontal, User, Calendar } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { NewProjectModal } from "@/components/project/NewProjectModal";
import { useState } from "react";

export default function ProjectsPage() {
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);
  const { data: projects, isLoading } = useProjects();

  return (
    <MainLayout
      title="Projects"
      description="Manage and track all your organisation's projects"
      action={
        <Button className="gap-2" onClick={() => setNewProjectModalOpen(true)}>
          <Plus size={18} />
          New Project
        </Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-card" />
          ))
        ) : projects?.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center p-12 text-center bg-white rounded-card border-2 border-dashed border-border">
            <h3 className="text-lg font-display mb-2">No projects yet</h3>
            <p className="text-secondary mb-6">Create your first project to get started</p>
            <Button>Create Project</Button>
          </div>
        ) : (
          projects?.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="hover:border-accent transition-colors group h-full">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-sm"
                        style={{ backgroundColor: project.color || '#3D3BF3', color: '#fff' }}
                      >
                        {project.icon || '📁'}
                      </div>
                      <div>
                        <h3 className="font-display text-lg group-hover:text-accent transition-colors">
                          {project.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-secondary mt-0.5">
                          <Badge variant="outline" className="text-[10px] py-0">{project.status}</Badge>
                          <span>•</span>
                          <span>{project.project_type || 'General'}</span>
                        </div>
                      </div>
                    </div>
                    <button className="text-muted hover:text-primary">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>

                  <p className="text-sm text-secondary line-clamp-2 mb-6 h-10">
                    {project.description || 'No description provided.'}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                    <div className="flex -space-x-2">
                      <div className="w-7 h-7 rounded-full bg-surface-2 border-2 border-white flex items-center justify-center text-[10px] font-medium text-secondary">
                        <User size={12} />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-mono text-secondary">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{project.end_date ? new Date(project.end_date).toLocaleDateString() : 'No date'}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
      <NewProjectModal
        open={newProjectModalOpen}
        onOpenChange={setNewProjectModalOpen}
      />
    </MainLayout>
  );
}
