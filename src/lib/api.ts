import type { Category, Product } from "../types";

const BASE_URLS = [
  "https://openapi.programming-hero.com/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

async function fetchWithFallback<T>(path: string): Promise<T> {
  let lastError: unknown = null;
  for (const base of BASE_URLS) {
    try {
      const res = await fetch(`${base}${path}`, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      // Some endpoints wrap payload as { status, data }
      if (data && typeof data === "object" && "data" in data) {
        return (data as { data: T }).data;
      }
      return data as T;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError ?? new Error("Failed to fetch data");
}

export function getAllProducts(): Promise<Product[]> {
  return fetchWithFallback<Product[]>("/products");
}

export function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  return fetchWithFallback<Product[]>(`/products?category=${encodeURIComponent(categorySlug)}`);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  // The public API keys single-product lookup by numeric id, so we fetch
  // the full list and resolve by slug for robustness.
  const all = await getAllProducts();
  return all.find((p) => p.slug === slug || String(p.id) === slug);
}

export function getAllCategories(): Promise<Category[]> {
  return fetchWithFallback<Category[]>("/categories");
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const all = await getAllCategories();
  return all.find((c) => c.slug === slug);
}
