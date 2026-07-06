"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Session, RuleWeights } from "@/types/session";

export const DEFAULT_RULE_WEIGHTS: RuleWeights = {
  browser: { view_product: 1, view_reviews: 0.5, search_product: 0.2, compare_products: 0, add_to_cart: 0, checkout_started: 0, remove_from_cart: 0, purchase: 0, repeat_purchase: 0, wishlist: 0, apply_coupon: 0 },
  comparer: { view_product: 1, view_reviews: 2, search_product: 2, compare_products: 3, add_to_cart: 0, checkout_started: 0, remove_from_cart: 0, purchase: 0, repeat_purchase: 0, wishlist: 0, apply_coupon: 0 },
  discount_seeker: { view_product: 1, view_reviews: 0, search_product: 1, compare_products: 0.5, add_to_cart: 0, checkout_started: 0, remove_from_cart: 0, purchase: 0, repeat_purchase: 0, wishlist: 2, apply_coupon: 3 },
  cart_abandoner: { view_product: 1, view_reviews: 0, search_product: 0, compare_products: 0, add_to_cart: 3, checkout_started: 3, remove_from_cart: -1, purchase: 0, repeat_purchase: 0, wishlist: 1, apply_coupon: 0 },
  loyal_customer: { view_product: 1, view_reviews: 0.5, search_product: 0.5, compare_products: 0, add_to_cart: 1, checkout_started: 1, remove_from_cart: 0, purchase: 5, repeat_purchase: 3, wishlist: 0.5, apply_coupon: 0 }
};

interface StoreContextType {
  sessions: Session[];
  selectedSessionId: string | null;
  setSelectedSessionId: (id: string | null) => void;
  addEvent: (sessionId: string, eventType: string, label?: string) => Promise<void>;
  removeEvent: (sessionId: string, eventId: string) => Promise<void>;
  resetSession: (sessionId: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  refreshSessions: () => Promise<void>;
  weights: RuleWeights;
  setWeights: (weights: RuleWeights) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weights, setWeightsState] = useState<RuleWeights>(DEFAULT_RULE_WEIGHTS);

  // Load weights from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("ruleWeights");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setWeightsState(parsed);
      } catch (e) {
        console.warn("Failed to parse stored weights", e);
      }
    }
  }, []);

  // Save weights to localStorage whenever they change
  const setWeights = (newWeights: RuleWeights) => {
    setWeightsState(newWeights);
    localStorage.setItem("ruleWeights", JSON.stringify(newWeights));
  };

  const fetchSessions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/sessions");
      if (!res.ok) throw new Error("Failed to fetch sessions");
      const data = await res.json();
      setSessions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Fetch sessions error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const addEvent = async (sessionId: string, eventType: string, label?: string) => {
    try {
      const res = await fetch(`/api/sessions/${sessionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: { type: eventType, metadata: { label: label || "" } } })
      });
      if (!res.ok) throw new Error("Failed to add event");
      await fetchSessions();
    } catch (err) {
      console.error("Add event error:", err);
      setError(err instanceof Error ? err.message : "Failed to add event");
    }
  };

  const removeEvent = async (sessionId: string, eventId: string) => {
    try {
      const res = await fetch(`/api/sessions/${sessionId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_id: eventId })
      });
      if (!res.ok) throw new Error("Failed to remove event");
      await fetchSessions();
    } catch (err) {
      console.error("Remove event error:", err);
      setError(err instanceof Error ? err.message : "Failed to remove event");
    }
  };

  const resetSession = async () => {
    await fetchSessions();
  };

  const refreshSessions = fetchSessions;

  return (
    <StoreContext.Provider value={{
      sessions,
      selectedSessionId,
      setSelectedSessionId,
      addEvent,
      removeEvent,
      resetSession,
      isLoading,
      error,
      refreshSessions,
      weights,
      setWeights,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
