'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { canAccessDashboard } from '@/lib/subscription';
import Spinner from '@/components/ui/Spinner';

/** Redirect authenticated users away from login/register pages */
export default function GuestGuard({ children, redirectTo }) {
  const { user, store, isAuthenticated, loading, storeLoading, storeError } = useAuth();
  const router = useRouter();

  const needsStore = isAuthenticated && user?.role !== 'admin';
  const awaitingStore = needsStore && !store && !storeError;

  useEffect(() => {
    if (loading || storeLoading || awaitingStore) return;
    if (!isAuthenticated) return;

    // Do not route to /subscribe when subscription status failed to load
    if (needsStore && storeError) return;

    let destination = redirectTo;
    if (!destination) {
      if (user?.role === 'admin') destination = '/admin';
      else if (!store) return;
      else if (!canAccessDashboard(store.subscriptionStatus)) destination = '/subscribe';
      else destination = '/dashboard';
    }
    router.replace(destination);
  }, [
    loading,
    storeLoading,
    awaitingStore,
    isAuthenticated,
    needsStore,
    user,
    store,
    storeError,
    router,
    redirectTo,
  ]);

  if (loading || storeLoading || awaitingStore) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-mesh">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isAuthenticated && !(needsStore && storeError)) return null;

  return children;
}
