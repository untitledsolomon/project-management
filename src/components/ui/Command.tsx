"use client";

import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { cn } from "@/lib/utils";

export function CommandDialog({ children, ...props }: any) {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-2xl max-w-2xl">
        <div className="flex h-full w-full flex-col overflow-hidden rounded-md bg-white">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function CommandInput({ className, ...props }: any) {
  return (
    <div className="flex items-center border-b px-3">
      <input
        className={cn(
          "flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  );
}

export function CommandList({ className, ...props }: any) {
  return (
    <div
      className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden p-2", className)}
      {...props}
    />
  );
}

export function CommandEmpty(props: any) {
  return <div className="py-6 text-center text-sm text-secondary" {...props} />;
}

export function CommandGroup({ heading, ...props }: any) {
  return (
    <div className="px-2 py-1.5">
      {heading && (
        <div className="px-2 py-1.5 text-xs font-medium text-muted uppercase tracking-wider">
          {heading}
        </div>
      )}
      <div {...props} />
    </div>
  );
}

export function CommandSeparator({ className, ...props }: any) {
  return <div className={cn("-mx-1 h-px bg-border my-1", className)} {...props} />;
}

export function CommandItem({ className, onSelect, ...props }: any) {
  return (
    <div
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-surface-2 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      onClick={onSelect}
      {...props}
    />
  );
}
