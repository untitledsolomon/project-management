import { FolderOpen } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-surface-1 rounded-card border-2 border-dashed border-border">
      <div className="p-4 bg-white rounded-full shadow-sm mb-4">
        <FolderOpen className="text-muted" size={32} />
      </div>
      <h3 className="text-lg font-display text-primary mb-1">{title}</h3>
      <p className="text-secondary text-sm max-w-xs mb-6">{description}</p>
      {action}
    </div>
  );
}
