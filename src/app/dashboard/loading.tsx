function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-xl bg-white/5 ${className ?? ""}`} />
  );
}

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Header skeleton */}
      <div className="mb-8 flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      {/* Personality card skeleton */}
      <Skeleton className="mb-6 h-52 w-full rounded-3xl" />

      {/* Charts row */}
      <div className="mb-6 grid gap-6 md:grid-cols-2">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>

      {/* Heatmap */}
      <Skeleton className="mb-6 h-48 w-full" />

      {/* Artists + tracks */}
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
}
