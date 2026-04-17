import { format, isPast, isToday, isTomorrow } from "date-fns";
import { Badge } from "./Badge";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

export function DueDateBadge({ dueDate }: { dueDate: string | Date }) {
  const date = new Date(dueDate);

  let label = format(date, "MMM d");
  let variant: 'outline' | 'destructive' | 'warning' = 'outline';

  if (isToday(date)) {
    label = "Today";
    variant = 'warning';
  } else if (isTomorrow(date)) {
    label = "Tomorrow";
  } else if (isPast(date)) {
    variant = 'destructive';
  }

  return (
    <Badge variant={variant} className="gap-1 px-1.5">
      <CalendarIcon size={12} />
      {label}
    </Badge>
  );
}
