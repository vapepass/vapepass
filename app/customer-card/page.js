'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import StoreBrandPreview from '@/components/StoreBrandPreview';
import QrCodeImage from '@/components/QrCodeImage';
import Spinner from '@/components/ui/Spinner';
import { PartyPopper } from 'lucide-react';
import { getCustomerCard } from '@/lib/public-api';

function CustomerCardContent() {
  const searchParams = useSearchParams();
  const customerId = searchParams.get('id');

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!customerId) {
      setError('Invalid member link');
      setLoading(false);
      return;
    }

    getCustomerCard(customerId)
      .then(setData)
      .catch(() => setError('Unable to load your member profile'))
      .finally(() => setLoading(false));
  }, [customerId]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !data) {
    return <p className="text-center text-body">{error || 'Member profile not found'}</p>;
  }

  const { customer, store } = data;

  return (
    <>
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-success-50 text-success-600 mb-5">
        <PartyPopper size={28} aria-hidden="true" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-2">You&apos;re in!</h1>
      <p className="text-body mb-8">
        Show your QR code at checkout to track visits and earn rewards at {store.name}.
      </p>

      <StoreBrandPreview
        store={{
          name: store.name,
          color: store.brandColor,
          stampGoal: customer.stampGoal,
          reward: store.rewardDescription,
          stamps: customer.stamps,
          customerName: customer.fullName,
        }}
      />

      <div className="mt-6 flex flex-col items-center">
        <p className="text-xs text-muted mb-3">Show this QR to staff at checkout</p>
        <QrCodeImage
          value={`vapepass:${customer.passIdentifier}`}
          size={180}
          alt="Customer checkout QR code"
        />
      </div>

      <p className="text-xs text-muted mt-4 font-mono break-all">
        Member ID: vapepass:{customer.passIdentifier}
      </p>

      <p className="text-xs text-muted mt-6">
        Keep this page handy, or show the QR code whenever you visit the store.
      </p>
    </>
  );
}

export default function CustomerCard() {
  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center px-4 py-12 sm:py-16">
      <div className="w-full max-w-md text-center animate-slide-up">
        <Suspense fallback={<Spinner size="lg" />}>
          <CustomerCardContent />
        </Suspense>
      </div>
    </div>
  );
}
