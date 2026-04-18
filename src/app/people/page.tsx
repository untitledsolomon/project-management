"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { Users } from "lucide-react";

export default function PeoplePage() {
  return (
    <MainLayout title="People & Teams" description="Manage your organization members">
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center mb-4">
          <Users size={32} className="text-muted opacity-50" />
        </div>
        <h3 className="text-lg font-semibold text-primary">Team Management</h3>
        <p className="text-sm text-secondary max-w-xs mx-auto">
          Invite teammates and organize them into functional teams for better collaboration.
        </p>
      </div>
    </MainLayout>
  );
}
