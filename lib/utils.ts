import { clsx, type ClassValue } from "clsx";
import type { EventType, ShopperState, ShopperStateMeta } from "@/types/session";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Static display metadata for each shopper state, kept in one place so
 * badges, timeline dots, and card accents always stay visually consistent. */
export const SHOPPER_STATE_META: Record<ShopperState, ShopperStateMeta> = {
  browser: {
    label: "Browser",
    description: "Casually exploring, no strong intent signals yet.",
    colorClass: "text-state-browser",
    bgClass: "bg-state-browser/10",
    dotClass: "bg-state-browser",
    borderClass: "border-state-browser/30",
  },
  comparer: {
    label: "Comparer",
    description: "Actively weighing options across products.",
    colorClass: "text-state-comparer",
    bgClass: "bg-state-comparer/10",
    dotClass: "bg-state-comparer",
    borderClass: "border-state-comparer/30",
  },
  discount_seeker: {
    label: "Discount Seeker",
    description: "Price-sensitive, looking for a reason to buy now.",
    colorClass: "text-state-discount",
    bgClass: "bg-state-discount/10",
    dotClass: "bg-state-discount",
    borderClass: "border-state-discount/30",
  },
  cart_abandoner: {
    label: "Cart Abandoner",
    description: "Had purchase intent but stalled before completing.",
    colorClass: "text-state-abandoner",
    bgClass: "bg-state-abandoner/10",
    dotClass: "bg-state-abandoner",
    borderClass: "border-state-abandoner/30",
  },
  loyal_customer: {
    label: "Loyal Customer",
    description: "Repeat buyer with an established purchase pattern.",
    colorClass: "text-state-loyal",
    bgClass: "bg-state-loyal/10",
    dotClass: "bg-state-loyal",
    borderClass: "border-state-loyal/30",
  },
};

/** Display metadata for rendering each event type in the timeline. */
export const EVENT_TYPE_META: Record<EventType, { label: string }> = {
  view_product: { label: "Viewed product" },
  view_reviews: { label: "Viewed reviews" },
  compare_products: { label: "Compared products" },
  search_product: { label: "Searched" },
  apply_coupon: { label: "Applied coupon" },
  wishlist: { label: "Added to wishlist" },
  add_to_cart: { label: "Added to cart" },
  remove_from_cart: { label: "Removed from cart" },
  checkout_started: { label: "Started checkout" },
  purchase: { label: "Purchased" },
  repeat_purchase: { label: "Repeat purchase" },
};

/** Formats an ISO timestamp as a short relative time string, e.g. "4m ago". */
export function formatRelativeTime(iso: string, now: Date = new Date()): string {
  const diffMs = now.getTime() - new Date(iso).getTime();
  const diffSec = Math.round(diffMs / 1000);

  if (diffSec < 5) return "just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.round(diffHr / 24);
  return `${diffDay}d ago`;
}

/** Formats an ISO timestamp as a short clock time, e.g. "2:41 PM". */
export function formatClockTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}
