import { classifySession } from "@/lib/classifier";

const DEFAULT_WEIGHTS = {
  browser: { view_product: 1, view_reviews: 0.5, search_product: 0.2, compare_products: 0, add_to_cart: 0, checkout_started: 0, remove_from_cart: 0, purchase: 0, repeat_purchase: 0, wishlist: 0, apply_coupon: 0 },
  comparer: { view_product: 1, view_reviews: 2, search_product: 2, compare_products: 3, add_to_cart: 0, checkout_started: 0, remove_from_cart: 0, purchase: 0, repeat_purchase: 0, wishlist: 0, apply_coupon: 0 },
  discount_seeker: { view_product: 1, view_reviews: 0, search_product: 1, compare_products: 0.5, add_to_cart: 0, checkout_started: 0, remove_from_cart: 0, purchase: 0, repeat_purchase: 0, wishlist: 2, apply_coupon: 3 },
  cart_abandoner: { view_product: 1, view_reviews: 0, search_product: 0, compare_products: 0, add_to_cart: 3, checkout_started: 3, remove_from_cart: -1, purchase: 0, repeat_purchase: 0, wishlist: 1, apply_coupon: 0 },
  loyal_customer: { view_product: 1, view_reviews: 0.5, search_product: 0.5, compare_products: 0, add_to_cart: 1, checkout_started: 1, remove_from_cart: 0, purchase: 5, repeat_purchase: 3, wishlist: 0.5, apply_coupon: 0 }
};

function makeEvent(type, label) {
  return {
    id: `evt_${Date.now()}_${Math.random()}`,
    type: type,
    timestamp: new Date().toISOString(),
    label: label,
  };
}

describe("classifySession", () => {
  it("should classify an empty session as browser", () => {
    const result = classifySession([], DEFAULT_WEIGHTS);
    expect(result.state).toBe("browser");
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.evidence).toContain("No activity signals");
  });

  it("should classify a loyal customer correctly", () => {
    const events = [
      makeEvent("purchase"),
      makeEvent("repeat_purchase"),
      makeEvent("view_product"),
    ];
    const result = classifySession(events, DEFAULT_WEIGHTS);
    expect(result.state).toBe("loyal_customer");
    expect(result.confidence).toBeGreaterThan(50);
  });

  it("should classify a cart abandoner correctly", () => {
    const events = [
      makeEvent("add_to_cart"),
      makeEvent("add_to_cart"),
      makeEvent("checkout_started"),
    ];
    const result = classifySession(events, DEFAULT_WEIGHTS);
    expect(result.state).toBe("cart_abandoner");
    expect(result.confidence).toBeGreaterThan(50);
  });

  it("should classify a comparer correctly", () => {
    const events = [
      makeEvent("compare_products"),
      makeEvent("compare_products"),
      makeEvent("view_reviews"),
      makeEvent("search_product"),
    ];
    const result = classifySession(events, DEFAULT_WEIGHTS);
    expect(result.state).toBe("comparer");
    expect(result.confidence).toBeGreaterThan(50);
  });

  it("should classify a discount seeker correctly", () => {
    const events = [
      makeEvent("apply_coupon"),
      makeEvent("apply_coupon"),
      makeEvent("wishlist"),
    ];
    const result = classifySession(events, DEFAULT_WEIGHTS);
    expect(result.state).toBe("discount_seeker");
    expect(result.confidence).toBeGreaterThan(50);
  });

  it("should classify as cart_abandoner when both cart and purchase exist (current behavior)", () => {
    const events = [
      makeEvent("add_to_cart"),
      makeEvent("checkout_started"),
      makeEvent("purchase"),
    ];
    const result = classifySession(events, DEFAULT_WEIGHTS);
    expect(result.state).toBe("cart_abandoner");
  });

  it("should return all scores in the result", () => {
    const events = [makeEvent("view_product"), makeEvent("view_product")];
    const result = classifySession(events, DEFAULT_WEIGHTS);
    expect(result.allScores).toBeDefined();
    expect(Object.keys(result.allScores)).toContain("browser");
    expect(Object.keys(result.allScores)).toContain("comparer");
    expect(Object.keys(result.allScores)).toContain("discount_seeker");
    expect(Object.keys(result.allScores)).toContain("cart_abandoner");
    expect(Object.keys(result.allScores)).toContain("loyal_customer");
  });

  it("should have evidence for the winning state", () => {
    const events = [
      makeEvent("view_product"),
      makeEvent("view_product"),
      makeEvent("view_product"),
    ];
    const result = classifySession(events, DEFAULT_WEIGHTS);
    expect(result.evidence).toBeDefined();
    expect(result.evidence.length).toBeGreaterThan(0);
  });
});
