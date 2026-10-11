export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-base-content/10 bg-base-100 p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <div className="skeleton-shimmer h-12 w-12 rounded-xl sm:h-14 sm:w-14" />
        <div className="flex-1 space-y-2">
          <div className="skeleton-shimmer h-4 w-3/4 rounded" />
          <div className="skeleton-shimmer h-3 w-1/2 rounded" />
        </div>
      </div>
      <div className="flex items-end justify-between gap-2 border-t border-base-content/10 pt-3">
        <div className="space-y-2">
          <div className="skeleton-shimmer h-3 w-14 rounded" />
          <div className="skeleton-shimmer h-5 w-20 rounded" />
        </div>
        <div className="skeleton-shimmer h-6 w-14 rounded-full" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function MarqueeSkeleton() {
  return <div className="skeleton-shimmer h-9 w-full" />;
}
