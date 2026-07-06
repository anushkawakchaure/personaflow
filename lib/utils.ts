import { clsx, type ClassValue } from "clsx";
import type { EventType, ShopperState } from "@/types/session";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const EVENT_LABELS: Record<EventType, string> = {
  view_product: "Viewed product",
  view_reviews: "Viewed reviews",
  search_product: "Searched product",
  compare_products: "Compared products",
  add_to_cart: "Added to cart",
  checkout_started: "Started checkout",
  remove_from_cart: "Removed from cart",
  purchase: "Purchased",
  repeat_purchase: "Repeat purchase",
  wishlist: "Added to wishlist",
  apply_coupon: "Applied coupon",
};

export const STATE_LABELS: Record<ShopperState, string> = {
  browser: "Browser",
  comparer: "Comparer",
  discount_seeker: "Discount Seeker",
  cart_abandoner: "Cart Abandoner",
  loyal_customer: "Loyal Customer",
};

export const STATE_COLORS: Record<ShopperState, string> = {
  browser: "#7C8AA5",
  comparer: "#4FA8D8",
  discount_seeker: "#E0A93E",
  cart_abandoner: "#D8654F",
  loyal_customer: "#4FBF8B",
};

export function formatTimeAgo(dateString: string): string {
  if (!dateString) return "just now";
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}
