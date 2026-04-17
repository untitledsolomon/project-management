"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export function Dialog({ open, onOpenChange, children }: any) {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50 animate-in zoom-in-95 duration-200">
        {children}
      </div>
    </div>,
    document.body
  );
}

export function DialogContent({ className, children }: any) {
  return (
    <div className={cn("bg-white rounded-card shadow-lg p-6 max-w-lg w-full", className)}>
      {children}
    </div>
  );
}

export function DialogHeader({ className, ...props }: any) {
  return (
    <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left mb-4", className)} {...props} />
  );
}

export function DialogTitle({ className, ...props }: any) {
  return (
    <h2 className={cn("text-lg font-display font-semibold leading-none tracking-tight", className)} {...props} />
  );
}
