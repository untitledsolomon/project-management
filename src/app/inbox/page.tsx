"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { Inbox } from "lucide-react";

export default function InboxPage() {
  return (
    <MainLayout title="Inbox" description="Your central notifications hub">
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center mb-4">
          <Inbox size={32} className="text-muted opacity-50" />
        </div>
        <h3 className="text-lg font-semibold text-primary">Your inbox is empty</h3>
        <p className="text-sm text-secondary max-w-xs mx-auto">
          We&apos;ll notify you when there&apos;s activity on your tasks or projects.
        </p>
      </div>
    </MainLayout>
  );
}
