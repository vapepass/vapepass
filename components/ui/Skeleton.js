/**
 * Skeleton loaders — soft shimmer placeholders matching page layouts.
 * Uses the existing canvas/surface design tokens (light SaaS theme).
 */

export default function Skeleton({ className = '', ...props }) {
  return (
    <div
      className={[
        'skeleton-bone rounded-lg',
        className,
      ].join(' ')}
      aria-hidden="true"
      {...props}
    />
  );
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`bg-surface rounded-2xl border border-line p-6 space-y-4 ${className}`}>
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full rounded-xl" />
      ))}
    </div>
  );
}

/** Soft fade wrapper for skeleton ↔ content swaps (avoids hard cuts). */
export function ContentReveal({ children, className = '' }) {
  return (
    <div className={`animate-fade-in ${className}`} role="status" aria-live="polite">
      {children}
    </div>
  );
}
