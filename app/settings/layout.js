'use client';

import { Suspense } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import SettingsSkeleton from '@/components/skeletons/SettingsSkeleton';

export default function SettingsLayout({ children }) {
  return (
    <Suspense
      fallback={
        <DashboardLayout>
          <SettingsSkeleton />
        </DashboardLayout>
      }
    >
      {children}
    </Suspense>
  );
}
