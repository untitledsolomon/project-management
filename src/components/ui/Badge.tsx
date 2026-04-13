import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "outline" | "filled" | "status" | "priority";
  color?: string; // For priority dots
}

const Badge = ({
  className,
  variant = "filled",
  children,
  ...props
}: BadgeProps) => {
  const variants = {
    filled: "bg-surface-3 text-primary",
    outline: "border border-border-base text-secondary",
    status: "", // To be customized by parent
    priority: "flex items-center gap-1.5",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-badge px-2 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {variant === "priority" && (
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: props.color }}
        />
      )}
      {children}
    </div>
  );
};

export { Badge };
