'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Spinner from '@/components/ui/Spinner';

export default function AdminGuard({ children }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/admin/login');
    } else if (!loading && user && user.role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') return null;

  return children;
}
