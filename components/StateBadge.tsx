import { cn } from "@/lib/utils";

const STATE_COLORS: Record<string, string> = {
  browser: "bg-state-browser/20 text-state-browser",
  comparer: "bg-state-comparer/20 text-state-comparer",
  discount_seeker: "bg-state-discount/20 text-state-discount",
  cart_abandoner: "bg-state-abandoner/20 text-state-abandoner",
  loyal_customer: "bg-state-loyal/20 text-state-loyal",
};

const STATE_LABELS: Record<string, string> = {
  browser: "Browser",
  comparer: "Comparer",
  discount_seeker: "Discount Seeker",
  cart_abandoner: "Cart Abandoner",
  loyal_customer: "Loyal Customer",
};

interface StateBadgeProps {
  state: string;
}

export default function StateBadge({ state }: StateBadgeProps) {
  const colorClass = STATE_COLORS[state] || "bg-surface-hover text-text-secondary";
  const label = STATE_LABELS[state] || state;
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-2xs font-medium", colorClass)}>
      {label}
    </span>
  );
}
