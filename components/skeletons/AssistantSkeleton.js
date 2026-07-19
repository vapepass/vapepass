import Skeleton, { ContentReveal } from '@/components/ui/Skeleton';

export function InventoryTableSkeleton({ rows = 6 }) {
  return (
    <div className="overflow-x-auto -mx-1" aria-label="Loading inventory">
      <div className="min-w-[640px] space-y-0">
        <div className="flex gap-3 border-b border-line-subtle py-2 mb-1">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-36 ml-auto" />
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 border-b border-line-subtle/70 py-3"
          >
            <div className="space-y-1.5 flex-1 min-w-[140px]">
              <Skeleton className="h-3.5 w-40 max-w-full" />
              <Skeleton className="h-2.5 w-24" />
            </div>
            <Skeleton className="h-3 w-16 flex-shrink-0" />
            <Skeleton className="h-5 w-14 rounded-full flex-shrink-0" />
            <Skeleton className="h-3 w-20 flex-shrink-0" />
            <Skeleton className="h-6 w-28 rounded-full flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Layout-matched skeleton for /assistant
 */
export default function AssistantSkeleton() {
  return (
    <ContentReveal aria-label="Loading AI Assistant">
      <div className="space-y-2 mb-6">
        <Skeleton className="h-8 w-52 sm:w-64" />
        <Skeleton className="h-4 w-72 sm:w-96 max-w-full" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* Store URL card */}
          <div className="bg-surface rounded-2xl border border-line p-5 sm:p-6 space-y-5">
            <div className="flex items-start gap-3">
              <Skeleton className="w-11 h-11 rounded-xl flex-shrink-0" />
              <div className="space-y-2 flex-1 pt-0.5">
                <Skeleton className="h-5 w-44" />
                <Skeleton className="h-3.5 w-full max-w-lg" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-11 w-full rounded-xl" />
              <Skeleton className="h-3 w-56" />
            </div>
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-10 w-44 rounded-xl" />
              <Skeleton className="h-10 w-40 rounded-xl" />
            </div>
          </div>

          {/* Embed code card */}
          <div className="bg-surface rounded-2xl border border-line p-5 sm:p-6 space-y-4">
            <div className="flex items-start gap-3">
              <Skeleton className="w-11 h-11 rounded-xl flex-shrink-0" />
              <div className="space-y-2 flex-1 pt-0.5">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-3.5 w-full max-w-md" />
              </div>
            </div>
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-10 w-40 rounded-xl" />
          </div>

          {/* Go live card */}
          <div className="bg-surface rounded-2xl border border-line p-5 sm:p-6 space-y-4">
            <div className="flex items-start gap-3">
              <Skeleton className="w-11 h-11 rounded-xl flex-shrink-0" />
              <div className="space-y-2 flex-1 pt-0.5">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-3.5 w-full max-w-lg" />
              </div>
            </div>
            <Skeleton className="h-10 w-48 rounded-xl" />
          </div>

          {/* Inventory card */}
          <div className="bg-surface rounded-2xl border border-line p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-3">
                <Skeleton className="w-5 h-5 rounded" />
                <div className="space-y-1.5">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <InventoryTableSkeleton rows={5} />
          </div>
        </div>

        {/* Sidebar column */}
        <div className="space-y-6">
          <div className="bg-surface rounded-2xl border border-line p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-11 h-11 rounded-xl flex-shrink-0" />
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="w-2 h-2 rounded-full flex-shrink-0" />
                  <Skeleton className="h-3.5 flex-1" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-xl bg-canvas border border-line-subtle px-3 py-3 space-y-2">
                <Skeleton className="h-2.5 w-16" />
                <Skeleton className="h-6 w-10" />
              </div>
              <div className="rounded-xl bg-canvas border border-line-subtle px-3 py-3 space-y-2">
                <Skeleton className="h-2.5 w-14" />
                <Skeleton className="h-6 w-8" />
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-2xl border border-line p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4 rounded" />
              <Skeleton className="h-5 w-28" />
            </div>
            <div className="space-y-2 pl-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-3 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </ContentReveal>
  );
}
