"use client";

import { useStore } from "@/lib/store";
import Header from "@/components/Header";
import { classifySession } from "@/lib/classifier";
import { useEffect, useState } from "react";
import { Users, Activity, Gauge, Crown } from "lucide-react";

export default function InsightsPage() {
  const { sessions, weights } = useStore();
  const [stats, setStats] = useState({
    distribution: {} as Record<string, number>,
    funnel: { views: 0, carts: 0, checkout: 0, purchases: 0 },
    eventCounts: {} as Record<string, number>,
    totalEvents: 0,
    avgConfidence: 0,
    mostCommonState: "",
    mostCommonCount: 0,
  });

  useEffect(() => {
    const distribution: Record<string, number> = {};
    const funnel = { views: 0, carts: 0, checkout: 0, purchases: 0 };
    const eventCounts: Record<string, number> = {};
    let totalEvents = 0;
    let totalConfidence = 0;

    sessions.forEach((session) => {
      const classification = classifySession(session.events, weights);
      distribution[classification.state] = (distribution[classification.state] || 0) + 1;
      totalConfidence += classification.confidence;

      session.events.forEach((event) => {
        eventCounts[event.type] = (eventCounts[event.type] || 0) + 1;
        totalEvents++;
        if (event.type === "view_product") funnel.views++;
        if (event.type === "add_to_cart") funnel.carts++;
        if (event.type === "checkout_started") funnel.checkout++;
        if (event.type === "purchase" || event.type === "repeat_purchase") funnel.purchases++;
      });
    });

    const avgConfidence = sessions.length ? Math.round(totalConfidence / sessions.length) : 0;

    let mostCommonState = "None";
    let mostCommonCount = 0;
    for (const [state, count] of Object.entries(distribution)) {
      if (count > mostCommonCount) {
        mostCommonCount = count;
        mostCommonState = state.replace("_", " ");
      }
    }

    setStats({
      distribution,
      funnel,
      eventCounts,
      totalEvents,
      avgConfidence,
      mostCommonState,
      mostCommonCount,
    });
  }, [sessions, weights]);

  const stateLabels: Record<string, string> = {
    browser: "Browser",
    comparer: "Comparer",
    discount_seeker: "Discount",
    cart_abandoner: "Abandoner",
    loyal_customer: "Loyal",
  };

  const stateColors: Record<string, string> = {
    browser: "#7C8AA5",
    comparer: "#4FA8D8",
    discount_seeker: "#E0A93E",
    cart_abandoner: "#D8654F",
    loyal_customer: "#4FBF8B",
  };

  const totalSessions = sessions.length;

  return (
    <div className="h-screen flex flex-col">
      <Header title="Insights" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-surface border border-border rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-2xs font-medium uppercase tracking-wider text-text-tertiary">Total sessions</span>
                <Users className="w-5 h-5 text-accent/70" />
              </div>
              <p className="text-2xl font-mono font-medium text-text-primary mt-2">{totalSessions}</p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-2xs font-medium uppercase tracking-wider text-text-tertiary">Total events</span>
                <Activity className="w-5 h-5 text-state-comparer/70" />
              </div>
              <p className="text-2xl font-mono font-medium text-text-primary mt-2">{stats.totalEvents}</p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-2xs font-medium uppercase tracking-wider text-text-tertiary">Avg. confidence</span>
                <Gauge className="w-5 h-5 text-state-loyal/70" />
              </div>
              <p className="text-2xl font-mono font-medium text-text-primary mt-2">{stats.avgConfidence}%</p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-2xs font-medium uppercase tracking-wider text-text-tertiary">Most common</span>
                <Crown className="w-5 h-5 text-state-discount/70" />
              </div>
              <p className="text-lg font-medium text-text-primary mt-2">{stats.mostCommonState}</p>
              <p className="text-2xs text-text-secondary">{stats.mostCommonCount} of {totalSessions} sessions</p>
            </div>
          </div>

          {/* Distribution & Funnel */}
          <div className="grid grid-cols-2 gap-6">
            {/* Distribution */}
            <div className="bg-surface border border-border rounded-xl p-4">
              <h3 className="text-2xs font-medium uppercase tracking-wider text-text-tertiary mb-4">Shopper state distribution</h3>
              <div className="space-y-3">
                {Object.entries(stats.distribution).map(([state, count]) => {
                  const percentage = totalSessions ? Math.round((count / totalSessions) * 100) : 0;
                  return (
                    <div key={state} className="flex items-center gap-3">
                      <span className="text-xs text-text-secondary w-20 truncate">{stateLabels[state] || state}</span>
                      <div className="flex-1 h-2 bg-surface-hover rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%`, background: stateColors[state] || "#5B8DEF" }}
                        />
                      </div>
                      <span className="font-mono text-xs text-text-secondary">{count} · {percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Funnel */}
            <div className="bg-surface border border-border rounded-xl p-4">
              <h3 className="text-2xs font-medium uppercase tracking-wider text-text-tertiary mb-4">Conversion funnel</h3>
              {(() => {
                const steps = [
                  { label: "Viewed a product", key: "views", value: stats.funnel.views, color: "#5B8DEF" },
                  { label: "Added to cart", key: "carts", value: stats.funnel.carts, color: "#4FA8D8" },
                  { label: "Started checkout", key: "checkout", value: stats.funnel.checkout, color: "#E0A93E" },
                  { label: "Purchased", key: "purchases", value: stats.funnel.purchases, color: "#4FBF8B" },
                ];
                const max = Math.max(...steps.map(s => s.value), 1);
                let prevValue = max;
                return steps.map((step, idx) => {
                  const percentage = Math.round((step.value / max) * 100);
                  const dropoff = idx > 0 ? Math.round(((prevValue - step.value) / prevValue) * 100) : 0;
                  prevValue = step.value;
                  return (
                    <div key={step.key} className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-text-secondary">{step.label}</span>
                        <span className="font-mono text-text-tertiary">{step.value} · {percentage}%</span>
                      </div>
                      <div className="h-2 bg-surface-hover rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%`, background: step.color }}
                        />
                      </div>
                      {idx < steps.length - 1 && dropoff > 0 && (
                        <div className="flex items-center gap-1 text-text-tertiary text-2xs mt-0.5 ml-1">
                          <span>▼</span> {dropoff}% drop-off
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
