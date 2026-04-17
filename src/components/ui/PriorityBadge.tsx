import { Badge } from "./Badge";

type Priority = 'urgent' | 'high' | 'medium' | 'low' | 'none';

export function PriorityBadge({ priority }: { priority: Priority }) {
  const config = {
    urgent: { label: 'Urgent', variant: 'destructive' as const },
    high: { label: 'High', variant: 'warning' as const },
    medium: { label: 'Medium', variant: 'default' as const },
    low: { label: 'Low', variant: 'secondary' as const },
    none: { label: 'None', variant: 'outline' as const },
  };

  const { label, variant } = config[priority] || config.none;

  return <Badge variant={variant}>{label}</Badge>;
}
