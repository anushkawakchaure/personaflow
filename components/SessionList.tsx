import { Session } from "@/types/session";
import { classifySession } from "@/lib/classifier";
import { useStore } from "@/lib/store";
import SessionCard from "./SessionCard";
import { useState } from "react";

interface SessionListProps {
  sessions: Session[];
  searchQuery?: string;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}

export default function SessionList({ sessions, searchQuery = "", selectedId = null, onSelect }: SessionListProps) {
  const { isLoading, error } = useStore();
  const [filterState, setFilterState] = useState<string | null>(null);

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.visitorId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          session.id.toLowerCase().includes(searchQuery.toLowerCase());
    if (!filterState) return matchesSearch;
    const classification = classifySession(session.events);
    return matchesSearch && classification.state === filterState;
  });

  if (isLoading) {
    return <div className="p-4 text-text-secondary">Loading sessions...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-400">Error: {error}</div>;
  }

  if (sessions.length === 0) {
    return <div className="p-4 text-text-secondary">No sessions found.</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setFilterState(null)} className="px-3 py-1 text-xs rounded-full bg-surface-hover text-text-secondary hover:bg-surface-raised">All</button>
          <button onClick={() => setFilterState("browser")} className="px-3 py-1 text-xs rounded-full bg-surface-hover text-text-secondary hover:bg-surface-raised">Browser</button>
          <button onClick={() => setFilterState("comparer")} className="px-3 py-1 text-xs rounded-full bg-surface-hover text-text-secondary hover:bg-surface-raised">Comparer</button>
          <button onClick={() => setFilterState("discount_seeker")} className="px-3 py-1 text-xs rounded-full bg-surface-hover text-text-secondary hover:bg-surface-raised">Discount Seeker</button>
          <button onClick={() => setFilterState("cart_abandoner")} className="px-3 py-1 text-xs rounded-full bg-surface-hover text-text-secondary hover:bg-surface-raised">Cart Abandoner</button>
          <button onClick={() => setFilterState("loyal_customer")} className="px-3 py-1 text-xs rounded-full bg-surface-hover text-text-secondary hover:bg-surface-raised">Loyal Customer</button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredSessions.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            classification={classifySession(session.events)}
            isSelected={session.id === selectedId}
            onSelect={() => onSelect?.(session.id)}
          />
        ))}
      </div>
    </div>
  );
}
