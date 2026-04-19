import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning' | 'priority';
  color?: string;
}

export function Badge({ children, variant = 'default', color, className, style, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    outline: 'border border-border text-primary',
    destructive: 'bg-p1 text-white',
    success: 'bg-emerald-500 text-white',
    warning: 'bg-amber-500 text-white',
    priority: '',
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-badge px-2 py-0.5 text-xs font-semibold transition-colors",
        variant === 'priority' ? 'h-1.5 w-6 rounded-full' : variants[variant],
        className
      )}
      style={{
        backgroundColor: variant === 'priority' ? color : undefined,
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
}
