import { Session } from "@/types/session";
import { classifySession } from "@/lib/classifier";
import { useStore } from "@/lib/store";
import { useState } from "react";
import StateBadge from "./StateBadge";
import ConfidenceRing from "./ConfidenceRing";

const STATE_LABELS: Record<string, string> = {
  browser: "Browser",
  comparer: "Comparer",
  discount_seeker: "Discount Seeker",
  cart_abandoner: "Cart Abandoner",
  loyal_customer: "Loyal Customer",
};

const STATE_COLORS: Record<string, string> = {
  browser: "bg-state-browser",
  comparer: "bg-state-comparer",
  discount_seeker: "bg-state-discount",
  cart_abandoner: "bg-state-abandoner",
  loyal_customer: "bg-state-loyal",
};

interface ClassificationPanelProps {
  session: Session;
}

export default function ClassificationPanel({ session }: ClassificationPanelProps) {
  const { weights } = useStore();
  const classification = classifySession(session.events, weights);
  const [story, setStory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          events: session.events,
          classification,
        }),
      });
      const data = await res.json();
      if (data.story) {
        setStory(data.story);
      } else if (data.error) {
        setError(data.error);
      } else {
        setError("No story generated");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch story");
    } finally {
      setLoading(false);
    }
  };

  // Get sorted scores for the bar chart
  const sortedScores = Object.entries(classification.allScores || {})
    .sort((a, b) => b[1] - a[1]);

  const maxScore = sortedScores.length > 0 ? sortedScores[0][1] : 100;

  return (
    <div className="bg-surface rounded-xl p-4 border border-border space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-text-primary">Classification</h3>
          <div className="mt-1">
            <StateBadge state={classification.state} />
          </div>
        </div>
        <ConfidenceRing confidence={classification.confidence} size={56} />
      </div>

      {/* ✅ Score Transparency – Bar Chart */}
      <div className="pt-2 border-t border-border">
        <span className="text-2xs text-text-secondary block mb-2">All state scores</span>
        <div className="space-y-1.5">
          {sortedScores.map(([state, score]) => (
            <div key={state} className="flex items-center gap-2">
              <span className="text-2xs text-text-secondary w-24 truncate">
                {STATE_LABELS[state] || state}
              </span>
              <div className="flex-1 h-1.5 bg-surface-hover rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${STATE_COLORS[state] || "bg-accent"}`}
                  style={{ width: `${Math.max(0, (score / maxScore) * 100)}%` }}
                />
              </div>
              <span className="text-2xs text-text-primary w-8 text-right">
                {Math.round(score)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-2xs text-text-secondary">{classification.explanation}</p>
        <div>
          <span className="text-2xs text-text-secondary block mb-1">Evidence:</span>
          <ul className="list-disc list-inside text-2xs text-text-secondary space-y-0.5">
            {classification.evidence.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="pt-2 border-t border-border">
          <span className="text-2xs text-accent block">Recommended Action:</span>
          <p className="text-2xs text-text-primary">{classification.recommendedAction}</p>
        </div>
      </div>

      {/* AI Story */}
      <div className="pt-2 border-t border-border">
        <button
          onClick={fetchStory}
          disabled={loading}
          className="text-2xs text-accent hover:underline disabled:opacity-50"
        >
          {loading ? "Thinking..." : "✨ Generate AI Story"}
        </button>
        {error && <div className="mt-2 text-2xs text-red-400">{error}</div>}
        {story && (
          <div className="mt-2 p-3 bg-surface-hover rounded-lg text-2xs text-text-secondary">
            {story}
          </div>
        )}
      </div>
    </div>
  );
}
