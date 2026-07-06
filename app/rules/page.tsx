"use client";

import { useStore } from "@/lib/store";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { RuleWeights } from "@/types/session";
import { classifySession } from "@/lib/classifier";

const FIELD_DEFS: Record<string, Array<{ key: string; label: string }>> = {
  browser: [
    { key: "view_product", label: "View Product" },
    { key: "view_reviews", label: "View Reviews" },
    { key: "search_product", label: "Search Product" },
    { key: "compare_products", label: "Compare Products" },
  ],
  comparer: [
    { key: "view_product", label: "View Product" },
    { key: "view_reviews", label: "View Reviews" },
    { key: "search_product", label: "Search Product" },
    { key: "compare_products", label: "Compare Products" },
  ],
  discount_seeker: [
    { key: "view_product", label: "View Product" },
    { key: "wishlist", label: "Wishlist" },
    { key: "apply_coupon", label: "Apply Coupon" },
  ],
  cart_abandoner: [
    { key: "add_to_cart", label: "Add to Cart" },
    { key: "checkout_started", label: "Checkout Started" },
    { key: "remove_from_cart", label: "Remove from Cart" },
    { key: "wishlist", label: "Wishlist" },
  ],
  loyal_customer: [
    { key: "purchase", label: "Purchase" },
    { key: "repeat_purchase", label: "Repeat Purchase" },
    { key: "add_to_cart", label: "Add to Cart" },
    { key: "checkout_started", label: "Checkout Started" },
  ],
};

const STATE_COLORS: Record<string, string> = {
  browser: "#7C8AA5",
  comparer: "#4FA8D8",
  discount_seeker: "#E0A93E",
  cart_abandoner: "#D8654F",
  loyal_customer: "#4FBF8B",
};

const STATE_LABELS: Record<string, string> = {
  browser: "Browser",
  comparer: "Comparer",
  discount_seeker: "Discount",
  cart_abandoner: "Abandoner",
  loyal_customer: "Loyal",
};

export default function RulesPage() {
  const { sessions, weights, setWeights } = useStore();
  const [localWeights, setLocalWeights] = useState<RuleWeights>(weights);

  useEffect(() => {
    setLocalWeights(weights);
  }, [weights]);

  const handleChange = (stateKey: string, fieldKey: string, value: number) => {
    const newWeights = {
      ...localWeights,
      [stateKey]: {
        ...localWeights[stateKey],
        [fieldKey]: value,
      },
    };
    setLocalWeights(newWeights);
    setWeights(newWeights);
  };

  const stateNames = Object.keys(FIELD_DEFS);

  // Compute distribution with current weights
  const distribution: Record<string, number> = {};
  sessions.forEach(session => {
    const result = classifySession(session.events, localWeights);
    const state = result.state;
    distribution[state] = (distribution[state] || 0) + 1;
  });
  const totalSessions = sessions.length;

  return (
    <div className="h-screen flex flex-col">
      <Header title="Classifier Rules" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm text-text-secondary mb-6">
            Every weight feeds directly into the live classifier — drag a slider and every session in Dashboard, Sessions, and Insights recalculates instantly.
          </p>

          <div className="flex gap-6">
            {/* Left: Sliders */}
            <div className="flex-1 space-y-6">
              {stateNames.map((stateKey) => (
                <div key={stateKey} className="bg-surface rounded-xl p-4 border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: STATE_COLORS[stateKey] + "20",
                          border: `1px solid ${STATE_COLORS[stateKey]}40`,
                          color: STATE_COLORS[stateKey],
                        }}
                      >
                        <span className="w-2 h-2 rounded-full" style={{ background: STATE_COLORS[stateKey] }} />
                        {STATE_LABELS[stateKey] || stateKey}
                      </span>
                    </div>
                    <span className="text-2xs text-text-tertiary">
                      {distribution[stateKey] || 0} sessions
                    </span>
                  </div>
                  <div className="space-y-4">
                    {FIELD_DEFS[stateKey].map((field) => {
                      const value = localWeights[stateKey]?.[field.key] ?? 0;
                      const max = 5;
                      const percent = Math.max(0, Math.min(100, (value / max) * 100));
                      return (
                        <div key={field.key}>
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-xs text-text-primary">{field.label}</span>
                            <span className="font-mono text-xs text-text-secondary">{value.toFixed(1)}</span>
                          </div>
                          <div className="relative h-2 bg-surface-hover rounded-full">
                            <div
                              className="absolute h-full rounded-full bg-accent transition-all duration-100"
                              style={{ width: `${percent}%` }}
                            />
                            <input
                              type="range"
                              min="-2"
                              max="5"
                              step="0.1"
                              value={value}
                              onChange={(e) => handleChange(stateKey, field.key, parseFloat(e.target.value))}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div
                              className="absolute top-1/2 w-3 h-3 rounded-full bg-accent border-2 border-bg -translate-y-1/2 transition-all duration-100 pointer-events-none"
                              style={{ left: `calc(${percent}% - 6px)` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Live distribution panel */}
            <div className="w-64 flex-shrink-0 space-y-6">
              <div className="bg-surface border border-border rounded-xl p-4">
                <h3 className="text-2xs font-medium uppercase tracking-wider text-text-tertiary mb-4">
                  Live distribution ({totalSessions} sessions)
                </h3>
                <div className="space-y-3">
                  {Object.keys(STATE_COLORS).map((state) => {
                    const count = distribution[state] || 0;
                    const percentage = totalSessions ? Math.round((count / totalSessions) * 100) : 0;
                    return (
                      <div key={state} className="flex items-center gap-3">
                        <span className="text-xs text-text-secondary w-16 truncate">
                          {STATE_LABELS[state]}
                        </span>
                        <div className="flex-1 h-2 bg-surface-hover rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%`, background: STATE_COLORS[state] }}
                          />
                        </div>
                        <span className="font-mono text-xs text-text-secondary">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-surface border border-accent/20 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <span className="text-accent text-sm">💡</span>
                  <p className="text-2xs text-text-secondary leading-relaxed">
                    Drag "Checkout started" up and watch the distribution change here in real time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
