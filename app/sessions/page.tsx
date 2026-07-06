"use client";

import { useStore } from "@/lib/store";
import Header from "@/components/Header";
import { useState } from "react";
import { classifySession } from "@/lib/classifier";
import StateBadge from "@/components/StateBadge";  // ✅ default import

export default function SessionsPage() {
  const { sessions } = useStore();
  const [filterState, setFilterState] = useState<string | null>(null);

  const filteredSessions = sessions.filter(session => {
    if (!filterState) return true;
    const classification = classifySession(session.events);
    return classification.state === filterState;
  });

  return (
    <div className="h-screen flex flex-col">
      <Header title="All Sessions" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-4 flex gap-2 flex-wrap">
            <button onClick={() => setFilterState(null)} className="px-3 py-1 text-xs rounded-full bg-surface-hover text-text-secondary hover:bg-surface-raised">All</button>
            <button onClick={() => setFilterState("browser")} className="px-3 py-1 text-xs rounded-full bg-surface-hover text-text-secondary hover:bg-surface-raised">Browser</button>
            <button onClick={() => setFilterState("comparer")} className="px-3 py-1 text-xs rounded-full bg-surface-hover text-text-secondary hover:bg-surface-raised">Comparer</button>
            <button onClick={() => setFilterState("discount_seeker")} className="px-3 py-1 text-xs rounded-full bg-surface-hover text-text-secondary hover:bg-surface-raised">Discount Seeker</button>
            <button onClick={() => setFilterState("cart_abandoner")} className="px-3 py-1 text-xs rounded-full bg-surface-hover text-text-secondary hover:bg-surface-raised">Cart Abandoner</button>
            <button onClick={() => setFilterState("loyal_customer")} className="px-3 py-1 text-xs rounded-full bg-surface-hover text-text-secondary hover:bg-surface-raised">Loyal Customer</button>
          </div>

          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr className="text-text-secondary text-2xs">
                <th className="py-2 text-left font-medium">Shopper</th>
                <th className="py-2 text-left font-medium">State</th>
                <th className="py-2 text-left font-medium">Confidence</th>
                <th className="py-2 text-left font-medium">Events</th>
                <th className="py-2 text-left font-medium">Last Activity</th>
                <th className="py-2 text-left font-medium">Session ID</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map((session) => {
                const classification = classifySession(session.events);
                const lastEvent = session.events[session.events.length - 1];
                return (
                  <tr key={session.id} className="border-b border-border hover:bg-surface-hover">
                    <td className="py-3 text-text-primary">{session.visitorId || "Anonymous shopper"}</td>
                    <td className="py-3"><StateBadge state={classification.state} /></td>
                    <td className="py-3 text-text-primary">{classification.confidence}%</td>
                    <td className="py-3 text-text-primary">{session.events.length}</td>
                    <td className="py-3 text-text-secondary">{lastEvent ? new Date(lastEvent.timestamp).toLocaleString() : "N/A"}</td>
                    <td className="py-3 text-text-secondary text-2xs">{session.id.slice(0, 12)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
