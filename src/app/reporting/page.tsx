"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { BarChart2 } from "lucide-react";

export default function ReportingPage() {
  return (
    <MainLayout title="Reporting" description="Insights into your team's productivity">
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center mb-4">
          <BarChart2 size={32} className="text-muted opacity-50" />
        </div>
        <h3 className="text-lg font-semibold text-primary">No reports yet</h3>
        <p className="text-sm text-secondary max-w-xs mx-auto">
          Start completing tasks to see your team&apos;s progress and velocity here.
        </p>
      </div>
    </MainLayout>
  );
}
