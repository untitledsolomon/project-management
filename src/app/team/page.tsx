"use client";

import * as React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Plus, Shield, MoreHorizontal } from "lucide-react";

const team = [
  { name: "Solomon K.", role: "Lead Designer", email: "solomon@axis.com", status: "Active", access: "Admin", fallback: "SK" },
  { name: "Emma M.", role: "Senior Developer", email: "emma@axis.com", status: "Active", access: "Member", fallback: "EM" },
  { name: "Jack D.", role: "Project Manager", email: "jack@axis.com", status: "Active", access: "Member", fallback: "JD" },
  { name: "Liam H.", role: "UI Engineer", email: "liam@axis.com", status: "Away", access: "Member", fallback: "LH" },
];

export default function TeamPage() {
  return (
    <MainLayout title="Team">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display text-primary mb-1">Team Members</h1>
          <p className="text-secondary text-sm">Manage your workspace collaborators and their permissions.</p>
        </div>
        <Button className="gap-2">
          <Plus size={16} /> Invite Member
        </Button>
      </div>

      <Card>
        <CardContent className="px-0">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-base bg-surface-2 text-[10px] font-mono uppercase tracking-wider text-muted">
                <th className="px-6 py-3 font-medium">Member</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Access</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-base text-sm">
              {team.map((member) => (
                <tr key={member.email} className="hover:bg-surface-2 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar fallback={member.fallback} />
                      <div>
                        <p className="font-medium text-primary">{member.name}</p>
                        <p className="text-xs text-muted font-mono">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-secondary">{member.role}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-secondary">
                      <Shield size={14} className="text-muted" />
                      {member.access}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Badge className={member.status === "Active" ? "bg-status-done-bg text-status-done-text" : "bg-status-todo-bg text-status-todo-text"}>
                      {member.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-right pr-6">
                    <button className="text-muted hover:text-primary">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
