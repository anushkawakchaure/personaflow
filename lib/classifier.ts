import { SessionEvent, ClassificationResult, RuleWeights } from "@/types/session";

const STATE_NAMES = ["browser", "comparer", "discount_seeker", "cart_abandoner", "loyal_customer"];

const EVENT_WEIGHTS: Record<string, Record<string, number>> = {
  browser: { view_product: 1, view_reviews: 0.5, search_product: 0.2, compare_products: 0, add_to_cart: 0, checkout_started: 0, remove_from_cart: 0, purchase: 0, repeat_purchase: 0, wishlist: 0, apply_coupon: 0 },
  comparer: { view_product: 1, view_reviews: 2, search_product: 2, compare_products: 3, add_to_cart: 0, checkout_started: 0, remove_from_cart: 0, purchase: 0, repeat_purchase: 0, wishlist: 0, apply_coupon: 0 },
  discount_seeker: { view_product: 1, view_reviews: 0, search_product: 1, compare_products: 0.5, add_to_cart: 0, checkout_started: 0, remove_from_cart: 0, purchase: 0, repeat_purchase: 0, wishlist: 2, apply_coupon: 3 },
  cart_abandoner: { view_product: 1, view_reviews: 0, search_product: 0, compare_products: 0, add_to_cart: 3, checkout_started: 3, remove_from_cart: -1, purchase: 0, repeat_purchase: 0, wishlist: 1, apply_coupon: 0 },
  loyal_customer: { view_product: 1, view_reviews: 0.5, search_product: 0.5, compare_products: 0, add_to_cart: 1, checkout_started: 1, remove_from_cart: 0, purchase: 5, repeat_purchase: 3, wishlist: 0.5, apply_coupon: 0 }
};

const DEFAULT_WEIGHTS: RuleWeights = {
  browser: { view_product: 1, view_reviews: 0.5, search_product: 0.2, compare_products: 0, add_to_cart: 0, checkout_started: 0, remove_from_cart: 0, purchase: 0, repeat_purchase: 0, wishlist: 0, apply_coupon: 0 },
  comparer: { view_product: 1, view_reviews: 2, search_product: 2, compare_products: 3, add_to_cart: 0, checkout_started: 0, remove_from_cart: 0, purchase: 0, repeat_purchase: 0, wishlist: 0, apply_coupon: 0 },
  discount_seeker: { view_product: 1, view_reviews: 0, search_product: 1, compare_products: 0.5, add_to_cart: 0, checkout_started: 0, remove_from_cart: 0, purchase: 0, repeat_purchase: 0, wishlist: 2, apply_coupon: 3 },
  cart_abandoner: { view_product: 1, view_reviews: 0, search_product: 0, compare_products: 0, add_to_cart: 3, checkout_started: 3, remove_from_cart: -1, purchase: 0, repeat_purchase: 0, wishlist: 1, apply_coupon: 0 },
  loyal_customer: { view_product: 1, view_reviews: 0.5, search_product: 0.5, compare_products: 0, add_to_cart: 1, checkout_started: 1, remove_from_cart: 0, purchase: 5, repeat_purchase: 3, wishlist: 0.5, apply_coupon: 0 }
};

function scoreStates(events: SessionEvent[], weights: RuleWeights): Record<string, number> {
  const scores: Record<string, number> = {};
  const totals: Record<string, number> = {};

  for (const state of STATE_NAMES) {
    totals[state] = 0;
    for (const event of events) {
      const w = weights[state]?.[event.type] || 0;
      totals[state] += w;
    }
    // Normalize to 0-100
    const maxPossible = Object.values(weights[state] || {}).reduce((a, b) => a + Math.abs(b), 0) || 1;
    scores[state] = Math.max(0, Math.min(100, (totals[state] / maxPossible) * 100));
  }
  return scores;
}

function getEvidence(events: SessionEvent[], state: string, weights: RuleWeights): string[] {
  const evidence: string[] = [];
  const relevantEvents = events.filter(e => (weights[state]?.[e.type] || 0) !== 0);
  const counts: Record<string, number> = {};
  for (const e of relevantEvents) {
    counts[e.type] = (counts[e.type] || 0) + 1;
  }
  for (const [type, count] of Object.entries(counts)) {
    if (count > 0) {
      const label = type.replace(/_/g, " ");
      evidence.push(`${count} ${label}${count > 1 ? "s" : ""}`);
    }
  }
  return evidence.length > 0 ? evidence : ["No activity signals"];
}

function getRecommendedAction(state: string): string {
  const actions: Record<string, string> = {
    browser: "Show a lightweight welcome banner highlighting bestsellers or new arrivals.",
    comparer: "Surface a side-by-side comparison table and highlight key differentiators.",
    discount_seeker: "Offer a time-limited discount code to convert price sensitivity into a sale.",
    cart_abandoner: "Trigger a cart-recovery nudge, e.g. a reminder banner or limited-stock alert.",
    loyal_customer: "Enroll in a loyalty tier and recommend based on past purchase history.",
  };
  return actions[state] || "Continue monitoring engagement patterns.";
}

function getExplanation(state: string): string {
  const explanations: Record<string, string> = {
    browser: "Activity is limited to passive viewing with no strong purchase or comparison signals.",
    comparer: "Repeated comparisons, searches, and review reads suggest active evaluation between options.",
    discount_seeker: "Coupon and wishlist activity suggest price is the main blocker to purchase.",
    cart_abandoner: "Cart or checkout activity occurred but no purchase was completed.",
    loyal_customer: "Purchase history includes a completed or repeat purchase, indicating an established customer.",
  };
  return explanations[state] || "Behavior pattern detected.";
}

export function classifySession(
  events: SessionEvent[],
  weights?: RuleWeights
): ClassificationResult {
  const effectiveWeights = weights || DEFAULT_WEIGHTS;
  const allScores = scoreStates(events, effectiveWeights);

  // Find winner
  let winner = "browser";
  let maxScore = -Infinity;
  for (const [state, score] of Object.entries(allScores)) {
    if (score > maxScore) {
      maxScore = score;
      winner = state;
    }
  }

  const confidence = Math.round(maxScore);
  const evidence = getEvidence(events, winner, effectiveWeights);
  const recommendedAction = getRecommendedAction(winner);
  const explanation = getExplanation(winner);

  return {
    state: winner,
    confidence,
    evidence,
    recommendedAction,
    explanation,
    allScores,  // ✅ NEW: return all state scores
  };
}
