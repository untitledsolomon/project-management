"use client";

import * as React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function MainLayout({
  children,
  title
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="flex min-h-screen bg-surface-2">
      <Sidebar />
      <div className="flex-1 flex flex-col transition-all duration-300 lg:ml-[256px] group-has-[aside.w-\[64px\]]:lg:ml-[64px]">
        <Topbar title={title} />
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
