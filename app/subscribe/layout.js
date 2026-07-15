'use client';

import { Suspense } from 'react';
import Spinner from '@/components/ui/Spinner';

export default function SubscribeLayout({ children }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-canvas">
          <Spinner size="lg" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
