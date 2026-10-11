import { formatBnPercent } from "../lib/bn";
import type { PriceChange } from "../types";

export default function PriceChangeBadge({ change, size = "md" }: { change: PriceChange; size?: "sm" | "md" }) {
  const dir = change?.dir ?? "flat";
  const pct = change?.pct ?? 0;

  const styles =
    dir === "up"
      ? "bg-error/15 text-error"
      : dir === "down"
      ? "bg-success/15 text-success"
      : "bg-base-content/10 text-base-content/60";

  const arrow = dir === "up" ? "▲" : dir === "down" ? "▼" : "—";
  const padding = size === "sm" ? "px-1.5 py-0.5 text-[11px]" : "px-2 py-1 text-xs";

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-semibold ${padding} ${styles}`}>
      <span>{arrow}</span>
      <span>{formatBnPercent(pct)}</span>
    </span>
  );
}
