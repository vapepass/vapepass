'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Spinner from '@/components/ui/Spinner';

/** Redirect authenticated users away from login/register pages */
export default function GuestGuard({ children, redirectTo }) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      const destination =
        redirectTo ??
        (user?.role === 'admin' ? '/admin' : '/dashboard');
      router.replace(destination);
    }
  }, [loading, isAuthenticated, user, router, redirectTo]);

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
