import { Session } from "@/types/session";
import { ClassificationResult } from "@/types/session";
import { cn } from "@/lib/utils";
import StateBadge from "./StateBadge";

interface SessionCardProps {
  session: Session;
  classification: ClassificationResult;
  isSelected?: boolean;
  onSelect?: () => void;
}

function getInitials(name: string): string {
  if (!name || name === "Anonymous shopper") return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function formatTimeAgo(dateString: string): string {
  if (!dateString) return "just now";
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}

export default function SessionCard({ session, classification, isSelected = false, onSelect }: SessionCardProps) {
  const displayName = session.visitorId || session.customerName || "Anonymous shopper";
  const initials = getInitials(displayName);
  const isReturning = session.isReturningCustomer || false;
  const eventsCount = session.events.length;
  const startTime = session.startedAt || session.createdAt || new Date().toISOString();
  const timeAgo = formatTimeAgo(startTime);

  return (
    <div
      onClick={onSelect}
      className={cn(
        "cursor-pointer rounded-xl p-3 transition-all duration-200 border",
        isSelected
          ? "bg-surface-raised border-accent ring-1 ring-accent/20"
          : "bg-surface border-border hover:bg-surface-hover"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0",
            isSelected
              ? "bg-accent/20 text-accent"
              : "bg-surface-hover text-text-secondary border border-border"
          )}
        >
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-primary truncate">{displayName}</span>
            {isReturning && (
              <span className="text-2xs text-text-tertiary bg-surface-hover px-2 py-0.5 rounded-full border border-border">
                Returning
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-2xs text-text-tertiary font-mono">{session.id}</span>
            <span className="text-2xs text-text-tertiary">·</span>
            <span className="text-2xs text-text-tertiary">started {timeAgo}</span>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <StateBadge state={classification.state} />
            <span className="text-2xs text-text-tertiary">{classification.confidence}%</span>
            <span className="text-2xs text-text-tertiary">·</span>
            <span className="text-2xs text-text-tertiary">{eventsCount} events</span>
          </div>
        </div>
      </div>
    </div>
  );
}
