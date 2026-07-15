'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { canAccessDashboard } from '@/lib/subscription';
import Spinner from '@/components/ui/Spinner';

/**
 * Locks the retailer dashboard until billing allows access.
 * Active and Payment Failed (past_due / retry window) may enter the dashboard.
 * Trial / Paused / Expired redirect to /subscribe.
 */
export default function SubscriptionGuard({ children }) {
  const { user, store, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  const needsSubscription =
    isAuthenticated &&
    user?.role !== 'admin' &&
    store &&
    !canAccessDashboard(store.subscriptionStatus);

  useEffect(() => {
    if (!loading && needsSubscription) {
      router.replace('/subscribe');
    }
  }, [loading, needsSubscription, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <Spinner size="lg" />
      </div>
    );
  }

  if (needsSubscription) return null;

  return children;
}
