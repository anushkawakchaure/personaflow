import type { EventType, Session, SessionEvent } from "@/types/session";

const now = Date.now();
const minutesAgo = (n: number) => new Date(now - n * 60_000).toISOString();
const hoursAgo = (n: number) => new Date(now - n * 3_600_000).toISOString();

let eventCounter = 0;
function ev(type: EventType, when: string, label?: string): SessionEvent {
  eventCounter += 1;
  return { id: `evt_${eventCounter.toString().padStart(3, "0")}`, type, timestamp: when, label };
}

export const MOCK_SESSIONS: Session[] = [
  {
    id: "sess_7f2a91",
    customerName: "Ava Martinez",
    isReturningCustomer: true,
    startedAt: hoursAgo(1.2),
    events: [
      ev("view_product", hoursAgo(1.2), "Trail Running Shoes"),
      ev("view_product", hoursAgo(1.1), "Trail Running Shoes — Alt Colorway"),
      ev("compare_products", hoursAgo(1.0), "Trail Runner vs Road Runner"),
      ev("view_reviews", hoursAgo(0.9)),
      ev("search_product", hoursAgo(0.8), "waterproof trail shoes"),
      ev("compare_products", hoursAgo(0.6)),
      ev("view_reviews", minutesAgo(28)),
      ev("compare_products", minutesAgo(14)),
    ],
  },
  {
    id: "sess_c81d4e",
    customerName: undefined,
    isReturningCustomer: false,
    startedAt: minutesAgo(46),
    events: [
      ev("view_product", minutesAgo(46), "Wool Blend Overcoat"),
      ev("wishlist", minutesAgo(41)),
      ev("view_product", minutesAgo(37), "Wool Blend Overcoat — Navy"),
      ev("apply_coupon", minutesAgo(30), "WELCOME10"),
      ev("wishlist", minutesAgo(24)),
      ev("apply_coupon", minutesAgo(12), "WINTER15"),
    ],
  },
  {
    id: "sess_9b30f7",
    customerName: "Daniel Cho",
    isReturningCustomer: true,
    startedAt: hoursAgo(3),
    events: [
      ev("view_product", hoursAgo(3), "Espresso Machine"),
      ev("add_to_cart", hoursAgo(2.8)),
      ev("view_product", hoursAgo(2.6), "Burr Grinder"),
      ev("add_to_cart", hoursAgo(2.4)),
      ev("checkout_started", hoursAgo(2.1)),
      ev("remove_from_cart", hoursAgo(1.9), "Burr Grinder"),
    ],
  },
  {
    id: "sess_1a55c2",
    customerName: "Priya Nair",
    isReturningCustomer: true,
    startedAt: hoursAgo(5),
    events: [
      ev("view_product", hoursAgo(5), "Ceramic Cookware Set"),
      ev("purchase", hoursAgo(4.7), "Ceramic Cookware Set"),
      ev("view_product", hoursAgo(0.5), "Cast Iron Skillet"),
      ev("repeat_purchase", minutesAgo(20), "Cast Iron Skillet"),
    ],
  },
  {
    id: "sess_e40b18",
    customerName: undefined,
    isReturningCustomer: false,
    startedAt: minutesAgo(9),
    events: [
      ev("view_product", minutesAgo(9), "Ceramic Desk Lamp"),
      ev("view_product", minutesAgo(6), "Ceramic Desk Lamp — Small"),
      ev("view_reviews", minutesAgo(4)),
      ev("view_product", minutesAgo(2), "Matching Side Table"),
    ],
  },
  {
    id: "sess_5d92a0",
    customerName: "Liam O'Connor",
    isReturningCustomer: false,
    startedAt: hoursAgo(2),
    events: [
      ev("search_product", hoursAgo(2), "noise cancelling headphones"),
      ev("compare_products", hoursAgo(1.8)),
      ev("apply_coupon", hoursAgo(1.5), "STUDENT20"),
      ev("compare_products", hoursAgo(1.2)),
      ev("apply_coupon", minutesAgo(40), "STUDENT20"),
    ],
  },
  {
    id: "sess_336fbb",
    customerName: undefined,
    isReturningCustomer: false,
    startedAt: minutesAgo(18),
    events: [
      ev("view_product", minutesAgo(18), "Weighted Blanket"),
      ev("add_to_cart", minutesAgo(15)),
      ev("add_to_cart", minutesAgo(11), "Blanket Duvet Cover"),
      ev("checkout_started", minutesAgo(7)),
      ev("checkout_started", minutesAgo(3)),
    ],
  },
  {
    id: "sess_a217e9",
    customerName: "Sofia Rossi",
    isReturningCustomer: true,
    startedAt: hoursAgo(30),
    events: [
      ev("view_product", hoursAgo(30), "Organic Skincare Bundle"),
      ev("purchase", hoursAgo(29.5)),
      ev("view_product", hoursAgo(6), "Vitamin C Serum"),
      ev("purchase", hoursAgo(5.6)),
      ev("repeat_purchase", hoursAgo(5.5)),
    ],
  },
  {
    id: "sess_f902c4",
    customerName: undefined,
    isReturningCustomer: false,
    startedAt: minutesAgo(2),
    events: [ev("view_product", minutesAgo(2), "Ceramic Mug Set")],
  },
];
