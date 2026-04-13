"use client";

import * as React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  User,
  Shield,
  CreditCard,
  Link as LinkIcon,
  Bell,
  Globe,
  Code,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";

const integrations = [
  { name: "Axis AI", desc: "Advanced project intelligence", status: "Active", icon: "✨", connected: true },
  { name: "Regent CAD", desc: "Leads to projects pipeline", status: "Connected", icon: "🏗️", connected: true },
  { name: "Forge CMS", desc: "Publish deliverables directly", status: "Connected", icon: "🛠️", connected: true },
  { name: "WhatsApp", desc: "Client communication channel", status: "Connected", icon: "📱", connected: true },
  { name: "GitHub", desc: "Sync development tasks", status: "Connect", icon: "🐙", connected: false },
  { name: "Slack", desc: "Team notifications & sync", status: "Coming Soon", icon: "💬", connected: false },
];

const navItems = [
  { label: "General", icon: Globe },
  { label: "Members", icon: User },
  { label: "Roles", icon: Shield },
  { label: "Billing", icon: CreditCard },
  { label: "Integrations", icon: LinkIcon, active: true },
  { label: "API", icon: Code },
  { label: "Notifications", icon: Bell },
];

export default function SettingsPage() {
  return (
    <MainLayout title="Settings">
      <div className="mb-8">
        <h1 className="text-4xl font-display text-primary mb-1">Settings</h1>
        <p className="text-secondary text-sm">Manage your workspace preferences and integrations.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Nav */}
        <aside className="w-full lg:w-48 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-badge text-sm font-medium transition-colors",
                  item.active
                    ? "bg-surface-3 text-primary border-l-2 border-accent"
                    : "text-secondary hover:bg-surface-2"
                )}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </aside>

        {/* Content area */}
        <div className="flex-1">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-display">Integrations</h2>
              <p className="text-sm text-muted">Connect your favorite tools to your Axis workspace.</p>
            </div>
            <Button variant="secondary" size="sm">Add Integration</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((int) => (
              <Card key={int.name} className={cn("transition-all", int.connected ? "border-accent/10 bg-accent/5" : "hover:border-border-base")}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-10 w-10 rounded-card bg-white border border-border-base flex items-center justify-center text-xl shadow-sm">
                      {int.icon}
                    </div>
                    <Badge
                      className={cn(
                        int.connected ? "bg-status-progress-bg text-status-progress-text" : "bg-status-todo-bg text-status-todo-text",
                        int.status === "Coming Soon" && "opacity-50"
                      )}
                    >
                      {int.status}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-primary mb-1">{int.name}</h3>
                  <p className="text-xs text-secondary mb-4">{int.desc}</p>
                  <Button
                    variant={int.connected ? "ghost" : "secondary"}
                    size="sm"
                    className="w-full h-8 text-xs font-mono"
                  >
                    {int.connected ? "Configure" : "Connect"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12">
            <h3 className="text-lg font-display mb-4">API Access</h3>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-secondary mb-6">Use your secret token to access the Axis API and build custom integrations.</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 font-mono text-xs bg-surface-2 p-3 rounded-input border border-border-base text-muted overflow-hidden truncate">
                    ax_live_51P2zWkL0s8nQ7x...
                  </div>
                  <Button variant="secondary" size="sm">Regenerate</Button>
                  <Button variant="primary" size="sm">Copy</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
