'use client';

import { Suspense } from 'react';
import Spinner from '@/components/ui/Spinner';

export default function SettingsLayout({ children }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-[40vh] flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
