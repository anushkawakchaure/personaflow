"use client";

import { useStore } from "@/lib/store";
import { useTheme } from "@/lib/theme";
import Header from "@/components/Header";
import { useState } from "react";

export default function SettingsPage() {
  const { weights, setWeights } = useStore();
  const { theme, toggleTheme } = useTheme();
  const [autoSave, setAutoSave] = useState(true);

  return (
    <div className="h-screen flex flex-col">
      <Header title="Settings" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* General */}
          <div className="bg-surface rounded-xl p-4 border border-border">
            <h3 className="text-sm font-medium text-text-primary mb-3">General</h3>
            <div className="space-y-4">
              {/* Theme toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-text-primary">Theme</span>
                  <p className="text-2xs text-text-secondary">Switch between dark and light mode</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-accent text-white hover:bg-accent-dim"
                >
                  {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
                </button>
              </div>

              {/* Auto-save toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div>
                  <span className="text-sm text-text-primary">Auto‑save rule weights</span>
                  <p className="text-2xs text-text-secondary">Save changes to your browser storage</p>
                </div>
                <button
                  onClick={() => setAutoSave(!autoSave)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    autoSave ? "bg-accent text-white" : "bg-surface-hover text-text-secondary"
                  }`}
                >
                  {autoSave ? "On" : "Off"}
                </button>
              </div>

              {/* Reset weights */}
              <div className="pt-2 border-t border-border">
                <button
                  onClick={() => {
                    localStorage.removeItem("ruleWeights");
                    setWeights({
                      browser: { view_product: 1, view_reviews: 0.5, search_product: 0.2, compare_products: 0, add_to_cart: 0, checkout_started: 0, remove_from_cart: 0, purchase: 0, repeat_purchase: 0, wishlist: 0, apply_coupon: 0 },
                      comparer: { view_product: 1, view_reviews: 2, search_product: 2, compare_products: 3, add_to_cart: 0, checkout_started: 0, remove_from_cart: 0, purchase: 0, repeat_purchase: 0, wishlist: 0, apply_coupon: 0 },
                      discount_seeker: { view_product: 1, view_reviews: 0, search_product: 1, compare_products: 0.5, add_to_cart: 0, checkout_started: 0, remove_from_cart: 0, purchase: 0, repeat_purchase: 0, wishlist: 2, apply_coupon: 3 },
                      cart_abandoner: { view_product: 1, view_reviews: 0, search_product: 0, compare_products: 0, add_to_cart: 3, checkout_started: 3, remove_from_cart: -1, purchase: 0, repeat_purchase: 0, wishlist: 1, apply_coupon: 0 },
                      loyal_customer: { view_product: 1, view_reviews: 0.5, search_product: 0.5, compare_products: 0, add_to_cart: 1, checkout_started: 1, remove_from_cart: 0, purchase: 5, repeat_purchase: 3, wishlist: 0.5, apply_coupon: 0 }
                    });
                  }}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  Reset all weights to defaults
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
