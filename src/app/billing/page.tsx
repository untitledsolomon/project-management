"use client";

import * as React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Clock, FileText, TrendingUp, DollarSign, Search, Calendar, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
  const [activeTab, setActiveTab] = React.useState<"logs" | "invoices" | "reports">("logs");

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

      <div className="flex items-center gap-6 border-b border-border-base mb-8 overflow-x-auto no-scrollbar">
        {[
          { id: "logs", label: "Time Logs" },
          { id: "invoices", label: "Invoices" },
          { id: "reports", label: "Financial Reports" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as "logs" | "invoices" | "reports")}
            className={cn(
              "pb-4 text-sm font-medium transition-all relative whitespace-nowrap",
              activeTab === tab.id ? "text-accent" : "text-muted hover:text-secondary"
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="billing-tab-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
              />
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {activeTab === "logs" && (
              <motion.div
                key="logs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between py-4">
                    <CardTitle className="text-lg">Recent Time Logs</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">Filter</Button>
                      <Button variant="ghost" size="sm">Export</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="px-0">
                    <div className="overflow-x-auto">
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
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "invoices" && (
              <motion.div
                key="invoices"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <Card>
                  <CardContent className="p-0">
                    <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted h-4 w-4" />
                        <input
                          type="text"
                          placeholder="Search invoices..."
                          className="w-full pl-10 pr-4 py-2 bg-surface-2 border-transparent focus:bg-white focus:border-border-base rounded-input text-sm outline-none transition-all"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Button variant="secondary" size="sm" className="gap-2">
                          <Calendar size={14} /> Last 30 Days
                        </Button>
                        <Button size="sm">Create New Invoice</Button>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-y border-border-base bg-surface-2 text-[10px] font-mono uppercase tracking-wider text-muted">
                            <th className="px-6 py-3 font-medium">Invoice ID</th>
                            <th className="px-4 py-3 font-medium">Project</th>
                            <th className="px-4 py-3 font-medium">Date</th>
                            <th className="px-4 py-3 font-medium">Amount</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border-base text-sm">
                          {[
                            { id: "INV-2024-001", project: "Axis Platform", date: "Jan 15, 2024", amount: "$8,200.00", status: "Paid", color: "text-status-done-text bg-status-done-bg" },
                            { id: "INV-2024-002", project: "Regent Portal", date: "Jan 20, 2024", amount: "$4,250.00", status: "Sent", color: "text-status-progress-text bg-status-progress-bg" },
                            { id: "INV-2024-003", project: "Forge CMS", date: "Jan 23, 2024", amount: "$1,800.00", status: "Draft", color: "text-status-todo-text bg-status-todo-bg" },
                          ].map((inv) => (
                            <tr key={inv.id} className="hover:bg-surface-2 transition-colors">
                              <td className="px-6 py-4 font-mono text-xs font-semibold">{inv.id}</td>
                              <td className="px-4 py-4 font-medium">{inv.project}</td>
                              <td className="px-4 py-4 text-muted">{inv.date}</td>
                              <td className="px-4 py-4 font-semibold">{inv.amount}</td>
                              <td className="px-4 py-4">
                                <Badge className={inv.color}>{inv.status}</Badge>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <ChevronRight size={16} />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "reports" && (
              <motion.div
                key="reports"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Revenue by Project</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 flex items-end justify-between gap-2 px-4 pb-2">
                      {[65, 90, 45, 75].map((h, i) => (
                        <div key={i} className="flex-1 bg-accent rounded-t-[4px] relative group" style={{ height: `${h}%` }}>
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            ${h * 100}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-4 px-4 text-[10px] font-mono text-muted uppercase tracking-wider">
                      <span>Axis</span>
                      <span>Regent</span>
                      <span>Forge</span>
                      <span>Other</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Resource Allocation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {[
                      { label: "Engineering", value: 65 },
                      { label: "Design", value: 25 },
                      { label: "Management", value: 10 },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between text-xs mb-2">
                          <span className="text-secondary font-medium">{item.label}</span>
                          <span className="text-muted">{item.value}%</span>
                        </div>
                        <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
                          <div className="h-full bg-accent" style={{ width: `${item.value}%` }} />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
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
