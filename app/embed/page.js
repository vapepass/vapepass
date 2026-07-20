'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import LandingChatWidget from '@/components/LandingChatWidget';

function resolveOrigin(value) {
  try {
    if (!value) return null;
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function EmbedChat() {
  const searchParams = useSearchParams();

  const storeId = useMemo(() => {
    const raw =
      searchParams.get('storeId') ||
      searchParams.get('assistantStoreId') ||
      '';
    return raw.trim() || null;
  }, [searchParams]);

  const queryParentOrigin = useMemo(
    () => resolveOrigin(searchParams.get('parentOrigin') || ''),
    [searchParams]
  );

  const [parentOrigin, setParentOrigin] = useState(queryParentOrigin);

  // Prefer document.referrer (actual framing page) when available.
  useEffect(() => {
    setParentOrigin(queryParentOrigin);
    const fromReferrer = resolveOrigin(
      typeof document !== 'undefined' ? document.referrer : ''
    );
    if (fromReferrer) setParentOrigin(fromReferrer);
  }, [queryParentOrigin]);

  if (!storeId) {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-4 text-center text-sm text-[#6b7280] bg-white">
        Missing storeId. Embed with ?storeId=YOUR_STORE_ID
      </div>
    );
  }

  return (
    <LandingChatWidget
      storeId={storeId}
      embedMode
      parentOrigin={parentOrigin}
    />
  );
}

export default function EmbedPage() {
  return (
    <Suspense fallback={null}>
      <EmbedChat />
    </Suspense>
  );
}
