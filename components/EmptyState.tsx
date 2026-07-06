import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

/** Generic empty state used across the dashboard wherever a list or panel has nothing to show. */
export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface-raised">
        <Icon className="h-5 w-5 text-text-tertiary" strokeWidth={1.75} />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-text-primary">{title}</p>
        <p className="max-w-xs text-sm text-text-secondary">{description}</p>
      </div>
      {action}
    </div>
  );
}
