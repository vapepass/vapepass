'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Building2, Gift, Settings, LogOut, Handshake } from 'lucide-react';
import Logo from '@/components/Logo';
import AdminGuard from '@/components/AdminGuard';
import { useAuth } from '@/context/AuthContext';

const nav = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/businesses', label: 'Businesses', icon: Building2 },
  { href: '/admin/setup-requests', label: 'Free Setup', icon: Handshake },
  { href: '/admin/programs', label: 'Programs', icon: Gift },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminPanelLayout({ children }) {
  const path = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = () => logout('/admin/login');

  return (
    <AdminGuard>
      <div className="flex h-screen bg-canvas overflow-hidden">
        <aside className="hidden lg:flex w-64 flex-col bg-surface border-r border-line">
          <div className="px-5 h-16 flex items-center border-b border-line">
            <Logo size={32} showText href="/admin" />
          </div>
          <div className="mx-4 mt-5 mb-2 px-4 py-3 rounded-xl bg-brand-50 border border-brand-100">
            <p className="text-[11px] font-semibold text-brand-600 uppercase tracking-wider mb-0.5">Admin</p>
            <p className="text-sm font-semibold text-ink truncate">{user?.firstName} {user?.lastName}</p>
          </div>
          <nav className="flex-1 px-3 py-3 space-y-1" aria-label="Admin navigation">
            {nav.map(({ href, label, icon: Icon }) => {
              const active = href === '/admin' ? path === href : path === href || path.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={[
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium min-h-[44px]',
                    active
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-body hover:text-ink hover:bg-canvas',
                  ].join(' ')}
                >
                  <Icon size={18} aria-hidden="true" />
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-line">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-body hover:text-ink w-full px-3 py-2 rounded-xl hover:bg-canvas"
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="lg:hidden flex items-center justify-between px-4 h-16 bg-surface border-b border-line">
            <Logo size={28} showText href="/admin" />
          </header>
          <main className="flex-1 overflow-y-auto">
            <div className="container-app py-6 sm:py-8">{children}</div>
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
