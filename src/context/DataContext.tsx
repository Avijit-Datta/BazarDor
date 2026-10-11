import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Category, Product } from "../types";
import { getAllCategories, getAllProducts } from "../lib/api";

interface DataContextValue {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  risers: Product[];
  fallers: Product[];
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([getAllProducts(), getAllCategories()])
      .then(([p, c]) => {
        if (cancelled) return;
        setProducts(Array.isArray(p) ? p : []);
        setCategories(Array.isArray(c) ? c : []);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.message ?? "তথ্য লোড করতে সমস্যা হয়েছে।");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  const risers = useMemo(
    () =>
      [...products]
        .filter((p) => p.change?.dir === "up")
        .sort((a, b) => b.change.pct - a.change.pct)
        .slice(0, 6),
    [products]
  );

  const fallers = useMemo(
    () =>
      [...products]
        .filter((p) => p.change?.dir === "down")
        .sort((a, b) => a.change.pct - b.change.pct)
        .slice(0, 6),
    [products]
  );

  const value = useMemo(
    () => ({ products, categories, loading, error, refetch, risers, fallers }),
    [products, categories, loading, error, refetch, risers, fallers]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
