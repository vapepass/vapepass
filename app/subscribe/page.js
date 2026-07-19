'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CreditCard, CheckCircle2, AlertCircle, Lock } from 'lucide-react';
import AuthGuard from '@/components/AuthGuard';
import AuthLayout from '@/components/AuthLayout';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import { useAuth } from '@/context/AuthContext';
import {
  createCheckoutSession,
  createBillingPortal,
  getBillingInfo,
  confirmCheckoutSession,
} from '@/lib/billing-api';
import {
  getSubscriptionStatusLabel,
  isSubscriptionActive,
  canAccessDashboard,
} from '@/lib/subscription';
import { ApiError } from '@/lib/api';

export default function SubscribePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { store, user, refreshStore, logout, storeLoading, storeError } = useAuth();
  const [billingInfo, setBillingInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');
  const [successNote, setSuccessNote] = useState('');
  const confirmedRef = useRef(false);

  const status = store?.subscriptionStatus;
  const active = isSubscriptionActive(status);
  const hasDashboardAccess = Boolean(store) && canAccessDashboard(status);
  const billingFlag = searchParams.get('billing');
  const sessionId = searchParams.get('session_id');
  const checkingStatus = storeLoading || (!store && !storeError);

  useEffect(() => {
    getBillingInfo()
      .then(setBillingInfo)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (billingFlag !== 'success' || confirmedRef.current) return undefined;

    confirmedRef.current = true;
    setConfirming(true);
    setSuccessNote('Payment received. Unlocking your dashboard…');
    setError('');

    let cancelled = false;

    const confirm = async () => {
      try {
        // Stripe may need a brief moment after redirect before session is fully queryable
        await new Promise((resolve) => setTimeout(resolve, 800));
        await confirmCheckoutSession(sessionId || undefined);
        if (cancelled) return;
        await refreshStore();
        setSuccessNote('Subscription activated. Opening dashboard…');
      } catch (err) {
        if (cancelled) return;
        // Retry once without session id (looks up customer subscriptions)
        try {
          await confirmCheckoutSession();
          await refreshStore();
          setSuccessNote('Subscription activated. Opening dashboard…');
        } catch (retryErr) {
          setError(
            retryErr instanceof ApiError
              ? retryErr.message
              : err instanceof ApiError
                ? err.message
                : 'Payment succeeded, but activation is still pending. Click “Unlock dashboard” below.'
          );
          setSuccessNote('');
          confirmedRef.current = false;
        }
      } finally {
        if (!cancelled) setConfirming(false);
      }
    };

    confirm();
    return () => {
      cancelled = true;
    };
  }, [billingFlag, sessionId, refreshStore]);

  useEffect(() => {
    if (hasDashboardAccess) {
      router.replace('/dashboard');
    }
  }, [hasDashboardAccess, router]);

  const startCheckout = async () => {
    setLoading(true);
    setError('');
    try {
      const { url } = await createCheckoutSession();
      if (url) window.location.href = url;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to start checkout');
    } finally {
      setLoading(false);
    }
  };

  const unlockAfterPayment = async () => {
    setConfirming(true);
    setError('');
    try {
      await confirmCheckoutSession(sessionId || undefined);
      await refreshStore();
      setSuccessNote('Subscription activated. Opening dashboard…');
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Unable to activate subscription yet. Wait a few seconds and try again.'
      );
    } finally {
      setConfirming(false);
    }
  };

  const openPortal = async () => {
    setLoading(true);
    setError('');
    try {
      const { url } = await createBillingPortal();
      if (url) window.location.href = url;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to open billing portal');
    } finally {
      setLoading(false);
    }
  };

  const price = billingInfo?.monthlyPrice ?? 99;

  if (checkingStatus) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex flex-col items-center justify-center gap-3 gradient-mesh px-4">
          <Spinner size="lg" />
          <p className="text-sm text-[#6b7280]">Checking subscription status…</p>
        </div>
      </AuthGuard>
    );
  }

  if (storeError && !store) {
    return (
      <AuthGuard>
        <AuthLayout
          title="Unable to verify subscription"
          subtitle="We could not load your billing status from the server"
          footer={
            <button
              type="button"
              onClick={() => logout('/login')}
              className="text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              Sign out
            </button>
          }
        >
          <div className="space-y-4">
            <p
              className="text-sm text-danger-600 bg-danger-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-2"
              role="alert"
            >
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              {storeError}
            </p>
            <Button
              className="w-full"
              onClick={() => {
                refreshStore().catch(() => {});
              }}
            >
              Retry
            </Button>
          </div>
        </AuthLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <AuthLayout
        title="Activate your subscription"
        subtitle="Your dashboard stays locked until billing is active"
        footer={
          <button
            type="button"
            onClick={() => logout('/login')}
            className="text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            Sign out
          </button>
        }
      >
        <div className="space-y-5">
          {successNote && (
            <p className="text-sm text-success-700 bg-success-50 border border-green-200 rounded-xl px-4 py-3 flex items-start gap-2">
              <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
              {successNote}
            </p>
          )}

          {error && (
            <p className="text-sm text-danger-600 bg-danger-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-2" role="alert">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              {error}
            </p>
          )}

          <div className="rounded-2xl border border-line-subtle bg-canvas p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted mb-1">Store</p>
                <p className="font-semibold text-ink">{store?.name || 'Your store'}</p>
                <p className="text-sm text-muted mt-1">{user?.email}</p>
              </div>
              <Badge variant={active ? 'success' : status === 'paused' ? 'danger' : 'warning'}>
                {getSubscriptionStatusLabel(status)}
              </Badge>
            </div>

            <div className="rounded-xl bg-white border border-line-subtle p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                  <CreditCard size={18} className="text-brand-600" />
                </div>
                <div>
                  <p className="font-semibold text-ink">VapePass Pro</p>
                  <p className="text-sm text-muted">${price}/month · recurring billing</p>
                </div>
              </div>
            </div>

            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-center gap-2">
                <Lock size={14} className="text-brand-600" /> Dashboard unlock after payment
              </li>
              <li className="flex items-center gap-2">
                <Lock size={14} className="text-brand-600" /> Secure embed script for your website
              </li>
              <li className="flex items-center gap-2">
                <Lock size={14} className="text-brand-600" /> AI flavor recommendations for customers
              </li>
            </ul>
          </div>

          {(billingFlag === 'success' || store?.stripeCustomerId) && !active && (
            <Button onClick={unlockAfterPayment} disabled={confirming || loading} className="w-full">
              {confirming ? 'Unlocking…' : 'Unlock dashboard'}
            </Button>
          )}

          {!active && (
            <Button
              onClick={startCheckout}
              disabled={loading || confirming}
              variant={billingFlag === 'success' ? 'secondary' : 'primary'}
              className="w-full"
            >
              {loading ? 'Redirecting…' : billingFlag === 'success' ? 'Retry checkout' : `Subscribe — $${price}/mo`}
            </Button>
          )}

          {(status === 'past_due' || status === 'paused' || store?.stripeCustomerId) && (
            <Button variant="secondary" onClick={openPortal} disabled={loading || confirming} className="w-full">
              Update payment method
            </Button>
          )}
        </div>
      </AuthLayout>
    </AuthGuard>
  );
}
