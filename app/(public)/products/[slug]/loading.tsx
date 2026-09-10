export default function ProductLoading() {
  return (
    <div className="px-6 md:px-10 lg:px-16 py-12 max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <div className="h-3 w-48 bg-[#e0d9cc] animate-pulse mb-10 rounded" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Gallery skeleton */}
        <div className="space-y-3">
          <div className="aspect-square bg-[#e0d9cc] animate-pulse rounded" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-16 h-16 bg-[#e0d9cc] animate-pulse rounded" />
            ))}
          </div>
        </div>
        {/* Details skeleton */}
        <div className="space-y-4">
          <div className="h-3 w-24 bg-[#e0d9cc] animate-pulse rounded" />
          <div className="h-8 w-3/4 bg-[#e0d9cc] animate-pulse rounded" />
          <div className="h-6 w-32 bg-[#e0d9cc] animate-pulse rounded" />
          <div className="h-px bg-[#e0d9cc] my-4" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-3 bg-[#e0d9cc] animate-pulse rounded" style={{ width: `${70 + i * 5}%` }} />
            ))}
          </div>
          <div className="h-12 w-full bg-[#e0d9cc] animate-pulse rounded mt-6" />
        </div>
      </div>
    </div>
  );
}
