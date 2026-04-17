"use client";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { PageHeader } from "../ui/PageHeader";

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function MainLayout({ children, title, description, action }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-surface-1 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-8">
          {title && (
            <PageHeader
              title={title}
              description={description}
              action={action}
            />
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
