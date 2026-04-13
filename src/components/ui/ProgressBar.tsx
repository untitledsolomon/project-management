import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0 to 100
  className?: string;
  height?: number;
}

const ProgressBar = ({ value, className, height = 4 }: ProgressBarProps) => {
  return (
    <div
      className={cn(
        "w-full bg-border-base rounded-full overflow-hidden",
        className
      )}
      style={{ height: `${height}px` }}
    >
      <div
        className="bg-accent h-full transition-all duration-300 ease-in-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
};

export { ProgressBar };
