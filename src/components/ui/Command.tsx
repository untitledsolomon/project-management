"use client";

import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { cn } from "@/lib/utils";

interface CommandDialogProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandDialog({ children, ...props }: CommandDialogProps) {
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

interface CommandInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function CommandInput({ className, ...props }: CommandInputProps) {
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

interface CommandListProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function CommandList({ className, ...props }: CommandListProps) {
  return (
    <div
      className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden p-2", className)}
      {...props}
    />
  );
}

export function CommandEmpty(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div className="py-6 text-center text-sm text-secondary" {...props} />;
}

interface CommandGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  heading?: string;
}

export function CommandGroup({ heading, ...props }: CommandGroupProps) {
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

interface CommandSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function CommandSeparator({ className, ...props }: CommandSeparatorProps) {
  return <div className={cn("-mx-1 h-px bg-border my-1", className)} {...props} />;
}

interface CommandItemProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  onSelect?: () => void;
}

export function CommandItem({ className, onSelect, ...props }: CommandItemProps) {
  return (
    <div
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-surface-2 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer",
        className
      )}
      onClick={onSelect}
      {...props}
    />
  );
}
