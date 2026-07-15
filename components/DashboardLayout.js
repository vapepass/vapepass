'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import AuthGuard from '@/components/AuthGuard';
import SubscriptionGuard from '@/components/SubscriptionGuard';
import { isRouteTemporarilyHidden } from '@/lib/nav-visibility';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const routeHidden = isRouteTemporarilyHidden(pathname);

  useEffect(() => {
    if (routeHidden) {
      router.replace('/dashboard');
    }
  }, [routeHidden, router]);

  if (routeHidden) return null;

  return (
    <AuthGuard>
      <SubscriptionGuard>
        <div className="flex h-screen overflow-hidden bg-canvas">
          {sidebarOpen && (
            <button
              className="fixed inset-0 bg-ink/30 backdrop-blur-sm z-30 lg:hidden animate-fade-in"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close navigation menu"
            />
          )}

          <div
            className={[
              'fixed lg:static inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-[var(--ease-out)] flex-shrink-0',
              sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
            ].join(' ')}
          >
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>

          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            <Navbar onMenuClick={() => setSidebarOpen(true)} />
            <main className="flex-1 overflow-y-auto">
              <div className="container-app py-6 sm:py-8 max-w-7xl animate-fade-in">
                {children}
              </div>
            </main>
          </div>
        </div>
      </SubscriptionGuard>
    </AuthGuard>
  );
}
