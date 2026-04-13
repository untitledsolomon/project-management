import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  fallback: string;
  size?: "sm" | "md" | "lg";
}

const Avatar = ({
  src,
  fallback,
  size = "md",
  className,
  ...props
}: AvatarProps) => {
  const sizes = {
    sm: "h-6 w-6 text-[10px]",
    md: "h-8 w-8 text-xs",
    lg: "h-10 w-10 text-sm",
  };

  return (
    <div
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full bg-surface-3 font-medium text-secondary items-center justify-center border border-white",
        sizes[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt={fallback} className="aspect-square h-full w-full" />
      ) : (
        <span>{fallback}</span>
      )}
    </div>
  );
};

const AvatarGroup = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex -space-x-2", className)}>
      {children}
    </div>
  );
};

export { Avatar, AvatarGroup };
