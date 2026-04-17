"use client";

import { useAuthStore } from "@/hooks/useAuthStore";
import { AuthProvider } from "@/providers/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useState } from "react";
import { CommandPalette } from "@/components/CommandPalette";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <CommandPalette />
        <Toaster position="top-right" />
      </AuthProvider>
    </QueryClientProvider>
  );
}
