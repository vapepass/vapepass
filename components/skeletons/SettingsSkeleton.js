import Skeleton, { ContentReveal } from '@/components/ui/Skeleton';

/**
 * Layout-matched skeleton for /settings (profile + tabs)
 */
export default function SettingsSkeleton({ tab = 'profile' }) {
  return (
    <ContentReveal aria-label="Loading settings">
      <div className="space-y-2 mb-6">
        <Skeleton className="h-8 w-52 sm:w-64" />
        <Skeleton className="h-4 w-72 sm:w-80 max-w-full" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto">
        <Skeleton className="h-10 w-36 rounded-xl flex-shrink-0" />
        <Skeleton className="h-10 w-24 rounded-xl flex-shrink-0" />
        <Skeleton className="h-10 w-24 rounded-xl flex-shrink-0" />
      </div>

      <div className="max-w-2xl">
        {tab === 'billing' ? <BillingSkeleton /> : <ProfileSkeleton />}
      </div>
    </ContentReveal>
  );
}

function ProfileSkeleton() {
  return (
    <div className="bg-surface rounded-2xl border border-line p-5 sm:p-6 space-y-6">
      <div className="flex items-center gap-4 pb-6 border-b border-line-subtle">
        <Skeleton className="w-16 h-16 rounded-2xl flex-shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-8 w-28 rounded-xl" />
        </div>
      </div>

      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      ))}

      <Skeleton className="h-11 w-full rounded-xl" />
    </div>
  );
}

function BillingSkeleton() {
  return (
    <div className="space-y-5">
      <div className="bg-surface rounded-2xl border border-line p-5 sm:p-6">
        <div className="flex items-start justify-between mb-6 gap-3">
          <div className="flex items-center gap-3">
            <Skeleton className="w-11 h-11 rounded-xl flex-shrink-0" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-3.5 w-28" />
            </div>
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="px-4 py-3.5 rounded-xl bg-canvas border border-line-subtle space-y-2"
            >
              <Skeleton className="h-2.5 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-9 w-40 rounded-xl" />
          <Skeleton className="h-9 w-40 rounded-xl" />
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-line p-5 sm:p-6 space-y-4">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>

      <div className="bg-surface rounded-2xl border border-line p-5 sm:p-6 space-y-3">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-3.5 w-full max-w-md" />
      </div>
    </div>
  );
}

export { ProfileSkeleton, BillingSkeleton };
