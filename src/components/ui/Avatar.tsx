import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  fallback: string;
  size?: "xs" | "sm" | "md" | "lg";
}

export function Avatar({ src, fallback, size = "md", className, ...props }: AvatarProps) {
  const sizes = {
    xs: "h-6 w-6 text-[10px]",
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  return (
    <div
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full bg-surface-2 border border-border items-center justify-center font-medium text-secondary uppercase",
        sizes[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt={fallback} className="h-full w-full object-cover" />
      ) : (
        fallback.substring(0, 2)
      )}
    </div>
  );
}

export function AvatarGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex -space-x-2 overflow-hidden", className)}>
      {children}
    </div>
  );
}
