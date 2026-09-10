export default function CollectionLoading() {
  return (
    <div className="px-6 md:px-10 lg:px-16 py-12">
      {/* Breadcrumb skeleton */}
      <div className="h-3 w-40 bg-[#e0d9cc] animate-pulse mb-6 rounded" />
      {/* Title skeleton */}
      <div className="h-8 w-64 bg-[#e0d9cc] animate-pulse mb-2 rounded" />
      <div className="h-4 w-32 bg-[#e0d9cc] animate-pulse mb-10 rounded" />
      {/* Filters skeleton */}
      <div className="flex gap-4 mb-10">
        <div className="h-9 w-40 bg-[#e0d9cc] animate-pulse rounded" />
        <div className="h-9 w-32 bg-[#e0d9cc] animate-pulse rounded" />
      </div>
      {/* Grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-square bg-[#e0d9cc] animate-pulse mb-3 rounded" />
            <div className="h-4 w-3/4 bg-[#e0d9cc] animate-pulse mb-1.5 rounded" />
            <div className="h-3 w-1/2 bg-[#e0d9cc] animate-pulse rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
