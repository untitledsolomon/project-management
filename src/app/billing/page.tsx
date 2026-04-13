"use client";

import * as React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Clock, FileText, TrendingUp, DollarSign, Download, MoreHorizontal } from "lucide-react";

const summaries = [
  { label: "Total Hours", value: "164.5", icon: Clock },
  { label: "Billable Hours", value: "142.0", icon: TrendingUp },
  { label: "Uninvoiced", value: "$12,450", icon: FileText },
  { label: "Paid This Month", value: "$8,200", icon: DollarSign },
];

const timeLogs = [
  { date: "Jan 23, 2024", project: "Axis Platform", task: "Finalize brand guidelines", member: "Solomon", duration: "4:22:15", billable: true, amount: "$420.00" },
  { date: "Jan 22, 2024", project: "Regent Portal", task: "API Integration design", member: "Emma", duration: "6:45:00", billable: true, amount: "$675.00" },
  { date: "Jan 22, 2024", project: "Axis Platform", task: "User interview synthesis", member: "Solomon", duration: "3:15:00", billable: true, amount: "$325.00" },
  { date: "Jan 21, 2024", project: "Internal", task: "Team Sync", member: "All", duration: "1:00:00", billable: false, amount: "$0.00" },
];

export default function BillingPage() {
  return (
    <MainLayout title="Time & Billing">
      <div className="mb-8">
        <h1 className="text-4xl font-display text-primary mb-1">Financial Overview</h1>
        <p className="text-secondary text-sm">Monitor workspace productivity and revenue.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaries.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-muted">{s.label}</span>
                  <Icon size={16} className="text-accent" />
                </div>
                <h3 className="text-2xl font-display text-primary">{s.value}</h3>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <CardTitle className="text-lg">Recent Time Logs</CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">Filter</Button>
                <Button variant="ghost" size="sm">Export</Button>
              </div>
            </CardHeader>
            <CardContent className="px-0">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-y border-border-base bg-surface-2 text-[10px] font-mono uppercase tracking-wider text-muted">
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Task</th>
                    <th className="px-4 py-3 font-medium">Member</th>
                    <th className="px-4 py-3 font-medium">Duration</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-base text-sm">
                  {timeLogs.map((log, i) => (
                    <tr key={i} className="hover:bg-surface-2 transition-colors">
                      <td className="px-6 py-4 text-muted whitespace-nowrap">{log.date}</td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-primary">{log.task}</p>
                        <p className="text-[10px] text-muted font-mono">{log.project}</p>
                      </td>
                      <td className="px-4 py-4 text-secondary">{log.member}</td>
                      <td className="px-4 py-4 font-mono text-xs">{log.duration}</td>
                      <td className="px-4 py-4 font-semibold text-primary">{log.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-accent text-white border-accent">
            <CardHeader>
              <CardTitle className="text-lg">Generate Invoice</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 text-sm mb-6">Select a project and date range to generate a professional invoice for your client.</p>
              <div className="space-y-4 mb-6">
                <div className="bg-white/10 rounded-input p-3 border border-white/20">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-white/60 mb-1">Project</p>
                  <p className="text-sm font-medium">Axis Platform</p>
                </div>
                <div className="bg-white/10 rounded-input p-3 border border-white/20">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-white/60 mb-1">Date Range</p>
                  <p className="text-sm font-medium">Jan 1 - Jan 23, 2024</p>
                </div>
              </div>
              <Button className="w-full bg-white text-accent hover:bg-white/90">Preview Invoice</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: "INV-2024-001", status: "Paid", color: "text-status-done-text bg-status-done-bg" },
                { id: "INV-2024-002", status: "Sent", color: "text-status-progress-text bg-status-progress-bg" },
                { id: "INV-2024-003", status: "Draft", color: "text-status-todo-text bg-status-todo-bg" },
              ].map((inv) => (
                <div key={inv.id} className="flex items-center justify-between py-2 border-b border-border-base last:border-0">
                  <div className="flex items-center gap-3">
                    <FileText size={16} className="text-muted" />
                    <span className="text-xs font-mono font-medium">{inv.id}</span>
                  </div>
                  <Badge className={inv.color}>{inv.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
