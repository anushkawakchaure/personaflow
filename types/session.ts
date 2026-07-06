export type EventType =
  | "view_product"
  | "view_reviews"
  | "search_product"
  | "compare_products"
  | "add_to_cart"
  | "checkout_started"
  | "remove_from_cart"
  | "purchase"
  | "repeat_purchase"
  | "wishlist"
  | "apply_coupon";

export type ShopperState =
  | "browser"
  | "comparer"
  | "discount_seeker"
  | "cart_abandoner"
  | "loyal_customer";

export interface SessionEvent {
  id: string;
  type: EventType;
  timestamp: string;
  label?: string;
  metadata?: Record<string, any>;
}

export interface Session {
  id: string;
  visitorId?: string;
  customerName?: string;
  isReturningCustomer?: boolean;
  startedAt: string;
  events: SessionEvent[];
  createdAt?: string;
}

export interface ClassificationResult {
  state: string;
  confidence: number;
  evidence: string[];
  recommendedAction: string;
  explanation: string;
  allScores: Record<string, number>;
}

export type RuleWeights = Record<
  string,
  Record<string, number>
>;
