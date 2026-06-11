/**
 * Skeleton card — shimmer loading placeholder for product cards.
 * Matches the aspect ratio and layout of ProductCard.
 */
export default function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] skeleton rounded-sm" />
      <div className="pt-3 space-y-2">
        <div className="h-4 skeleton rounded w-3/4" />
        <div className="h-3 skeleton rounded w-1/2" />
        <div className="h-4 skeleton rounded w-1/3 mt-2" />
      </div>
    </div>
  );
}

/**
 * Skeleton grid — renders a grid of skeleton cards.
 * @param {number} count - Number of skeleton cards (default 8)
 */
export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton row — horizontal scroll skeleton for carousels.
 * @param {number} count - Number of skeleton cards (default 6)
 */
export function SkeletonRow({ count = 6 }) {
  return (
    <div className="flex gap-6 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="shrink-0 w-[280px] sm:w-[300px]">
          <SkeletonCard />
        </div>
      ))}
    </div>
  );
}

/**
 * Adorzia loading spinner — minimal luxury monogram spinner.
 */
export function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border border-stone-200" />
        <div className="absolute inset-0 rounded-full border-t border-charcoal-900 animate-spin" />
      </div>
    </div>
  );
}
