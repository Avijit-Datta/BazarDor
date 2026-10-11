import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useData } from "../context/DataContext";
import ProductCard from "../components/ProductCard";
import { ProductGridSkeleton } from "../components/Skeletons";
import EmptyState from "../components/EmptyState";

type SortOption = "default" | "asc" | "desc";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { products, categories, loading } = useData();
  const [sort, setSort] = useState<SortOption>("default");

  const category = useMemo(() => categories.find((c) => c.slug === slug), [categories, slug]);

  const items = useMemo(() => {
    const filtered = products.filter((p) => p.category === slug);
    if (sort === "asc") return [...filtered].sort((a, b) => a.today - b.today);
    if (sort === "desc") return [...filtered].sort((a, b) => b.today - a.today);
    return filtered;
  }, [products, slug, sort]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 sm:py-10">
        <div className="skeleton-shimmer h-24 w-full rounded-2xl" />
        <ProductGridSkeleton count={8} />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <EmptyState
          emoji="🔍"
          title="৪০৪ — এই ক্যাটাগরি খুঁজে পাওয়া যায়নি"
          subtitle="আপনি যে ক্যাটাগরিটি খুঁজছেন সেটি বিদ্যমান নেই বা সরানো হয়েছে।"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 sm:py-10">
      <div className="flex items-center gap-4 rounded-2xl border border-base-content/10 bg-base-100 p-5 sm:p-6">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-base-200 text-3xl">
          {category.icon}
        </div>
        <div>
          <h1 className="text-xl font-bold text-base-content sm:text-2xl">{category.nameBn}</h1>
          <p className="text-sm text-base-content/55">{items.length}টি পণ্যের আজকের দাম ও পরিবর্তন</p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 rounded-2xl border border-base-content/10 bg-base-100 px-4 py-3 sm:px-5">
        <label htmlFor="sort" className="text-sm text-base-content/60">
          সাজান
        </label>
        <div className="relative">
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="select select-bordered select-sm appearance-none pr-8 sm:select-md"
          >
            <option value="default">ডিফল্ট</option>
            <option value="asc">দাম: কম থেকে বেশি</option>
            <option value="desc">দাম: বেশি থেকে কম</option>
          </select>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState
          emoji="📦"
          title="এই ক্যাটাগরিতে কোনো পণ্য নেই"
          subtitle="অন্য কোনো ক্যাটাগরি থেকে পণ্য দেখুন।"
        />
      ) : (
        <>
          <p className="text-sm text-base-content/55">মোট {items.length}টি পণ্য দেখানো হচ্ছে</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
