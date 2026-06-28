'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Spinner from '@/components/ui/Spinner';

/** Redirect authenticated users away from admin login */
export default function AdminGuestGuard({ children }) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      if (user?.role === 'admin') {
        router.replace('/admin');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [loading, isAuthenticated, user, router]);

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
