import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductBySlug } from "../lib/api";
import type { Product } from "../types";
import { formatBnNumber, formatBnTaka, unitLabel, unitShort } from "../lib/bn";
import PriceChangeBadge from "../components/PriceChangeBadge";
import EmptyState from "../components/EmptyState";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    setProduct(undefined);
    if (!slug) return;
    getProductBySlug(slug)
      .then((p) => {
        if (!cancelled) setProduct(p ?? null);
      })
      .catch(() => {
        if (!cancelled) setProduct(null);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const stats = useMemo(() => {
    if (!product || !product.markets?.length) return null;
    const mins = product.markets.map((m) => m.min);
    const maxes = product.markets.map((m) => m.max);
    const minPrice = Math.min(...mins);
    const maxPrice = Math.max(...maxes);
    const avgPrice =
      product.markets.reduce((sum, m) => sum + (m.min + m.max) / 2, 0) / product.markets.length;
    const sortedMarkets = [...product.markets].sort(
      (a, b) => (a.min + a.max) / 2 - (b.min + b.max) / 2
    );
    return { minPrice, maxPrice, avgPrice, sortedMarkets };
  }, [product]);

  if (product === undefined) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 sm:py-10">
        <div className="skeleton-shimmer h-6 w-48 rounded" />
        <div className="skeleton-shimmer h-40 w-full rounded-2xl" />
        <div className="skeleton-shimmer h-48 w-full rounded-2xl" />
      </div>
    );
  }

  if (product === null) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <EmptyState
          emoji="❓"
          title="৪০৪ — পণ্যটি খুঁজে পাওয়া যায়নি"
          subtitle="এই পণ্যটি বিদ্যমান নেই বা সরিয়ে ফেলা হয়েছে।"
        />
      </div>
    );
  }

  const diff = product.today - product.yesterday;
  const diffText =
    diff === 0 ? "অপরিবর্তিত আছে" : diff > 0 ? "বেড়েছে" : "কমেছে";

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 sm:py-10">
      <div className="flex flex-wrap items-center gap-1.5 text-sm text-base-content/55">
        <Link to="/" className="hover:text-primary">
          হোম
        </Link>
        <span>›</span>
        <Link to={`/category/${product.category}`} className="hover:text-primary">
          {product.categoryNameBn}
        </Link>
        <span>›</span>
        <span className="text-base-content">{product.nameBn}</span>
      </div>

      <div className="flex flex-col gap-6 rounded-2xl border border-base-content/10 bg-base-100 p-5 sm:p-7 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-base-200 text-4xl sm:h-20 sm:w-20 sm:text-5xl">
            {product.image || product.categoryIcon}
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-base-content sm:text-3xl">{product.nameBn}</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-base-content/60">
              <span className="rounded-full bg-base-200 px-2.5 py-0.5 text-xs font-medium">
                {product.categoryNameBn}
              </span>
              <span>{unitLabel(product.unit)}</span>
            </div>
            <p className="text-sm text-base-content/55">
              গতকালের তুলনায় আজ দাম{" "}
              <span
                className={
                  diff > 0 ? "font-semibold text-error" : diff < 0 ? "font-semibold text-success" : "font-semibold"
                }
              >
                {diffText}
              </span>{" "}
              {diff !== 0 && `· ${formatBnTaka(Math.abs(diff))}`}
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-base-200 px-6 py-4 text-center md:min-w-[180px]">
          <p className="text-xs text-base-content/55">আজকের দাম</p>
          <p className="text-3xl font-extrabold text-primary">{formatBnNumber(product.today)}</p>
          <p className="text-xs text-base-content/55">টাকা / {unitShort(product.unit)}</p>
          <div className="mt-2 flex justify-center">
            <PriceChangeBadge change={product.change} />
          </div>
        </div>
      </div>

      {stats && (
        <>
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-base-content sm:text-xl">দামের সারসংক্ষেপ</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-base-content/10 bg-base-100 p-5">
                <p className="text-xs text-base-content/55">সর্বনিম্ন দাম</p>
                <p className="text-2xl font-bold text-success">{formatBnTaka(stats.minPrice)}</p>
                <p className="mt-1 text-xs text-base-content/45">সবচেয়ে কম দামের বাজার</p>
              </div>
              <div className="rounded-2xl border border-base-content/10 bg-base-100 p-5">
                <p className="text-xs text-base-content/55">সর্বাধিক দাম</p>
                <p className="text-2xl font-bold text-error">{formatBnTaka(stats.maxPrice)}</p>
                <p className="mt-1 text-xs text-base-content/45">সবচেয়ে বেশি দামের বাজার</p>
              </div>
              <div className="rounded-2xl border border-base-content/10 bg-base-100 p-5">
                <p className="text-xs text-base-content/55">গড় দাম</p>
                <p className="text-2xl font-bold text-base-content">{formatBnTaka(stats.avgPrice)}</p>
                <p className="mt-1 text-xs text-base-content/45">প্রতি {unitShort(product.unit)}-এর হিসাবে</p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-base-content sm:text-xl">বাজারভিত্তিক আজকের দাম</h2>
            <div className="overflow-x-auto rounded-2xl border border-base-content/10 bg-base-100">
              <table className="table w-full text-sm">
                <thead>
                  <tr className="text-xs text-base-content/55">
                    <th className="font-medium">বাজার</th>
                    <th className="font-medium">বিভাগ</th>
                    <th className="font-medium text-right">সর্বনিম্ন</th>
                    <th className="font-medium text-right">সর্বাধিক</th>
                    <th className="font-medium text-right">গড়</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.sortedMarkets.map((m, i) => (
                    <tr key={`${m.market}-${i}`} className="border-t border-base-content/10">
                      <td className="font-medium text-base-content">{m.market}</td>
                      <td className="text-base-content/60">{m.division}</td>
                      <td className="text-right">{formatBnTaka(m.min)}</td>
                      <td className="text-right">{formatBnTaka(m.max)}</td>
                      <td className="text-right font-semibold">{formatBnTaka((m.min + m.max) / 2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
