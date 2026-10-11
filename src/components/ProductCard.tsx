import { Link } from "react-router-dom";
import type { Product } from "../types";
import { formatBnTaka, unitLabel } from "../lib/bn";
import PriceChangeBadge from "./PriceChangeBadge";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/product/${product.slug}`}
      className="group flex flex-col gap-4 rounded-2xl border border-base-content/10 bg-base-100 p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 sm:p-5"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-base-200 text-2xl sm:h-14 sm:w-14 sm:text-3xl">
          <span>{product.image || product.categoryIcon}</span>
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-base-content group-hover:text-primary sm:text-lg">
            {product.nameBn}
          </h3>
          <p className="text-xs text-base-content/60 sm:text-sm">{unitLabel(product.unit)}</p>
        </div>
      </div>

      <div className="flex items-end justify-between gap-2 border-t border-base-content/10 pt-3">
        <div>
          <p className="text-[11px] text-base-content/50 sm:text-xs">আজকের দাম</p>
          <p className="text-lg font-bold text-base-content sm:text-xl">{formatBnTaka(product.today)}</p>
        </div>
        <PriceChangeBadge change={product.change} />
      </div>
    </Link>
  );
}
