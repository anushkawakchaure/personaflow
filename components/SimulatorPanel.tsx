import { Session } from "@/types/session";
import { useStore } from "@/lib/store";
import { useState } from "react";

const EVENT_TYPES = [
  "view_product",
  "view_reviews",
  "search_product",
  "compare_products",
  "add_to_cart",
  "checkout_started",
  "remove_from_cart",
  "purchase",
  "repeat_purchase",
  "wishlist",
  "apply_coupon",
];

interface SimulatorPanelProps {
  session: Session;
}

export default function SimulatorPanel({ session }: SimulatorPanelProps) {
  const { addEvent, removeEvent, resetSession } = useStore();
  const [selectedEvent, setSelectedEvent] = useState(EVENT_TYPES[0]);
  const [label, setLabel] = useState("");

  const handleAdd = async () => {
    await addEvent(session.id, selectedEvent, label || undefined);
    setLabel("");
  };

  const handleRemove = async (eventId: string) => {
    await removeEvent(session.id, eventId);
  };

  const handleReset = async () => {
    await resetSession(session.id);
  };

  return (
    <div className="bg-surface rounded-xl p-4 border border-border space-y-4">
      <h3 className="text-sm font-medium text-text-primary">Simulator</h3>

      {/* Row: select + Add button */}
      <div className="flex gap-2">
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="flex-1 bg-surface-hover border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
        >
          {EVENT_TYPES.map((type) => (
            <option key={type} value={type}>{type.replace("_", " ")}</option>
          ))}
        </select>
        <button
          onClick={handleAdd}
          className="px-5 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-dim transition-colors whitespace-nowrap"
        >
          Add
        </button>
      </div>

      {/* Label input (full width) */}
      <input
        type="text"
        placeholder="Label (optional)"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        className="w-full bg-surface-hover border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent"
      />

      {/* Reset button */}
      <button
        onClick={handleReset}
        className="w-full px-4 py-2 border border-border rounded-lg text-sm text-text-secondary hover:bg-surface-hover transition-colors"
      >
        Reset Session
      </button>

      {/* Recent events */}
      {session.events.length > 0 && (
        <div className="mt-2">
          <span className="text-2xs text-text-secondary">Recent events:</span>
          <ul className="text-2xs text-text-primary mt-1 space-y-1">
            {session.events.slice(-5).reverse().map((ev, idx) => (
              <li key={idx} className="flex items-center justify-between">
                <span>{ev.type.replace("_", " ")} {ev.label && `"${ev.label}"`}</span>
                <button
                  onClick={() => handleRemove(ev.id)}
                  className="text-red-400 hover:text-red-300 text-xs"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
