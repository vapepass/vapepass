import Skeleton, { ContentReveal } from '@/components/ui/Skeleton';

function StatCardSkeleton() {
  return (
    <div className="bg-surface rounded-2xl border border-line p-5">
      <div className="flex items-start gap-4">
        <Skeleton className="w-11 h-11 rounded-xl flex-shrink-0" />
        <div className="min-w-0 flex-1 space-y-2.5 pt-0.5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-7 w-20" />
        </div>
      </div>
    </div>
  );
}

/**
 * Layout-matched skeleton for /dashboard
 */
export default function DashboardSkeleton() {
  return (
    <ContentReveal className="space-y-6" aria-label="Loading dashboard">
      {/* Page header */}
      <div className="space-y-2 mb-2">
        <Skeleton className="h-8 w-40 sm:w-48" />
        <Skeleton className="h-4 w-64 sm:w-80 max-w-full" />
      </div>

      {/* Embed script card */}
      <div className="bg-surface rounded-2xl border border-line p-5 sm:p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <Skeleton className="w-11 h-11 rounded-xl flex-shrink-0" />
            <div className="space-y-2 flex-1 min-w-0 pt-0.5">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3.5 w-full max-w-md" />
              <Skeleton className="h-3.5 w-3/4 max-w-sm" />
            </div>
          </div>
          <Skeleton className="h-9 w-20 rounded-xl flex-shrink-0 hidden sm:block" />
        </div>
        <Skeleton className="h-24 sm:h-28 w-full rounded-xl" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Two-column widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-surface rounded-2xl border border-line p-5 sm:p-6 space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-44" />
              <Skeleton className="h-3.5 w-56 max-w-full" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-2.5">
                <Skeleton className="w-4 h-4 rounded-full flex-shrink-0" />
                <Skeleton className="h-3.5 flex-1 max-w-xs" />
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 pt-1">
            <Skeleton className="h-10 w-44 rounded-xl" />
            <Skeleton className="h-10 w-36 rounded-xl" />
          </div>
        </div>

        <div className="bg-surface rounded-2xl border border-line p-5 sm:p-6 space-y-5">
          <div className="flex items-start gap-3">
            <Skeleton className="w-11 h-11 rounded-xl flex-shrink-0" />
            <div className="space-y-2 flex-1 pt-0.5">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-3.5 w-52 max-w-full" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-xl bg-canvas border border-line-subtle px-4 py-3.5 space-y-2"
              >
                <Skeleton className="h-2.5 w-14" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
          <Skeleton className="h-10 w-52 rounded-xl" />
        </div>
      </div>
    </ContentReveal>
  );
}
