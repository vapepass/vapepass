'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { canAccessDashboard } from '@/lib/subscription';
import Spinner from '@/components/ui/Spinner';

/** Redirect authenticated users away from login/register pages */
export default function GuestGuard({ children, redirectTo }) {
  const { user, store, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      let destination = redirectTo;
      if (!destination) {
        if (user?.role === 'admin') destination = '/admin';
        else if (!canAccessDashboard(store?.subscriptionStatus)) destination = '/subscribe';
        else destination = '/dashboard';
      }
      router.replace(destination);
    }
  }, [loading, isAuthenticated, user, store, router, redirectTo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-mesh">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isAuthenticated) return null;

  return children;
}
