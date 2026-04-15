"use client";

import * as React from "react";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Card, CardContent } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import {
  FileText,
  MessageSquare,
  Download,
  CheckCircle2,
  Clock,
  ChevronRight,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ClientPortal() {
  return (
    <div className="min-h-screen bg-surface-2">
      {/* Portal Header */}
      <header className="bg-white border-b border-border-base px-12 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-accent rounded-card flex items-center justify-center text-white">
              <Layers size={24} />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-primary">Regent CAD Project Portal</h1>
              <p className="text-[10px] font-mono text-muted uppercase tracking-widest">Powered by Axis</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-secondary">Dashboard</Button>
            <Button variant="ghost" size="sm" className="text-secondary">Messages</Button>
            <div className="h-4 w-px bg-border-base mx-2" />
            <Avatar fallback="RC" />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-12 py-12">
        {/* Project Hero */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-status-progress-bg text-status-progress-text">Phase 2: Development</Badge>
            <span className="text-muted text-sm font-mono">• Updated 4h ago</span>
          </div>
          <h2 className="text-5xl font-display text-primary mb-8">Regent Platform Portal</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <p className="text-xl text-secondary leading-relaxed mb-8">
                Your project is currently on track. We&apos;ve completed the brand integration and are now focusing on the core CAD viewer infrastructure.
              </p>

              {/* Milestone Timeline */}
              <div className="space-y-8 relative">
                <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border-base" />
                {[
                  { title: "Project Kickoff", date: "Jan 10", status: "completed" },
                  { title: "Brand Identity Sync", date: "Jan 18", status: "completed" },
                  { title: "Core Architecture", date: "Jan 25", status: "active" },
                  { title: "Beta Release", date: "Feb 12", status: "upcoming" },
                ].map((m, i) => (
                  <div key={i} className="flex gap-6 relative">
                    <div className={cn(
                      "h-8 w-8 rounded-full border-2 flex items-center justify-center z-10",
                      m.status === "completed" ? "bg-status-done-bg border-status-done-text text-status-done-text" :
                      m.status === "active" ? "bg-accent border-accent text-white" :
                      "bg-white border-border-base text-muted"
                    )}>
                      {m.status === "completed" ? <CheckCircle2 size={16} /> : <span className="text-[10px] font-bold">{i+1}</span>}
                    </div>
                    <div>
                      <h4 className={cn("text-lg font-medium", m.status === "upcoming" ? "text-muted" : "text-primary")}>{m.title}</h4>
                      <p className="text-sm text-secondary">{m.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-sm font-semibold mb-4">Project Progress</h3>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-muted">Overall Completion</span>
                    <span className="font-bold">42%</span>
                  </div>
                  <ProgressBar value={42} height={6} />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-sm font-semibold mb-4">Latest Deliverables</h3>
                  <div className="space-y-3">
                    {[
                      { name: "Brand_Guide_v2.pdf", size: "4.2 MB" },
                      { name: "Architecture_Specs.docx", size: "1.8 MB" },
                    ].map((f) => (
                      <div key={f.name} className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-2">
                          <FileText size={14} className="text-accent" />
                          <span className="text-xs font-medium group-hover:underline">{f.name}</span>
                        </div>
                        <Download size={14} className="text-muted group-hover:text-primary" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Button className="w-full gap-2 py-6 text-base">
                <MessageSquare size={18} />
                Contact Team
              </Button>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mt-24 border-t border-border-base pt-12">
          <h3 className="text-2xl font-display mb-8">Your Project Team</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Solomon K.", role: "Lead Designer", fallback: "SK" },
              { name: "Emma M.", role: "Senior Developer", fallback: "EM" },
              { name: "Jack D.", role: "Project Manager", fallback: "JD" },
            ].map((member) => (
              <div key={member.name} className="flex items-center gap-4">
                <Avatar fallback={member.fallback} size="lg" />
                <div>
                  <h4 className="font-medium text-primary">{member.name}</h4>
                  <p className="text-xs text-muted">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
