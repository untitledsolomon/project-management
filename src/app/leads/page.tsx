"use client";

import * as React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useWorkspace } from "@/components/providers/WorkspaceProvider";
import {
  FileText,
  Zap,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";

export default function LeadsPage() {
  const { leads, convertLead } = useWorkspace();

  return (
    <MainLayout title="Regent CAD / Leads Pipeline">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-8 w-8 bg-orange-50 text-orange-600 rounded-badge flex items-center justify-center border border-orange-100 font-bold">R</div>
          <h1 className="text-4xl font-display text-primary">Regent CAD Leads</h1>
          <Badge className="bg-orange-50 text-orange-700 border border-orange-200">Connected</Badge>
        </div>
        <p className="text-secondary text-sm">Automated pipeline from Regent CAD prospects to Axis projects.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active Leads", value: "14", trend: "+3 this week" },
          { label: "Pipeline Value", value: "$193k", trend: "72% conversion" },
          { label: "Avg. Discovery", value: "12 days", trend: "-2 from last month" },
          { label: "Auto-Projected", value: "6", trend: "Ready for Axis" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <span className="text-[10px] font-mono text-muted uppercase tracking-widest block mb-4">{stat.label}</span>
              <h3 className="text-2xl font-display text-primary">{stat.value}</h3>
              <p className="text-[10px] font-mono text-status-progress-text mt-1">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-display">Current Pipeline</h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">Sync Regent CAD</Button>
          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">Import All Leads</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {leads.map((lead, i) => (
          <motion.div
            key={lead.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="hover:border-orange-200 transition-colors group">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row lg:items-center p-6 gap-8">
                  <div className="flex items-center gap-4 lg:w-64 flex-shrink-0">
                    <div className="h-12 w-12 rounded-card bg-surface-2 flex items-center justify-center text-2xl border border-border-base">
                      {lead.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary">{lead.company}</h4>
                      <p className="text-xs text-muted font-mono">{lead.type}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1">
                    <div>
                      <span className="text-[10px] font-mono text-muted uppercase block mb-1">Status</span>
                      <Badge className="bg-orange-50 text-orange-700">{lead.status}</Badge>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-muted uppercase block mb-1">Potential Value</span>
                      <p className="text-sm font-semibold">{lead.value}</p>
                    </div>
                    <div className="col-span-2">
                      <div className="flex justify-between items-end mb-1">
                        <span className="text-[10px] font-mono text-muted uppercase block">Axis AI Confidence</span>
                        <span className="text-xs font-bold text-orange-600">{lead.confidence}%</span>
                      </div>
                      <ProgressBar value={lead.confidence} className="bg-orange-100" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 lg:pl-8 border-l border-border-base border-dashed">
                    <Button variant="secondary" size="sm" className="gap-2 border-orange-200 text-orange-700 hover:bg-orange-50">
                      <FileText size={14} /> Proposal
                    </Button>
                    <Button
                      size="sm"
                      className="gap-2 bg-accent"
                      onClick={() => convertLead(lead.id)}
                    >
                      <Zap size={14} /> Convert to Project
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Auto-Pipeline Sync Info */}
      <div className="mt-12 bg-orange-50/50 border border-orange-100 rounded-card p-8 flex items-start gap-6">
        <div className="h-10 w-10 bg-white rounded-full border border-orange-100 flex items-center justify-center text-orange-600 flex-shrink-0">
          <CheckCircle2 size={24} />
        </div>
        <div>
          <h3 className="text-lg font-display text-orange-900 mb-2">Automated Conversion Active</h3>
          <p className="text-sm text-orange-800 leading-relaxed max-w-2xl">
            Your workspace is connected to Regent CAD. Leads with an AI confidence score above 80% are automatically staged for project creation in Axis.
            You can manage the auto-provisioning rules in <span className="underline font-medium cursor-pointer">Integrations Settings</span>.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
