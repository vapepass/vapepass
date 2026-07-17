'use client';

import { useEffect, useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Card, CardTitle } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { ApiError } from '@/lib/api';
import { updateAutoRenew } from '@/lib/billing-api';

/**
 * Auto Subscription toggle for Billing settings.
 * Default ON. Disabling requires confirmation. Failed saves roll back the UI.
 */
export default function AutoSubscriptionSettings({ billingInfo, onUpdated }) {
  const { toast } = useToast();
  const [enabled, setEnabled] = useState(billingInfo?.autoRenew !== false);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const inFlight = useRef(false);

  useEffect(() => {
    setEnabled(billingInfo?.autoRenew !== false);
  }, [billingInfo?.autoRenew]);

  const canManage = Boolean(billingInfo?.canManageAutoRenew);
  const renewalLabel = billingInfo?.nextBillingDate
    ? new Date(billingInfo.nextBillingDate).toLocaleDateString()
    : null;

  const persist = async (nextValue) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setSaving(true);
    const previous = enabled;
    setEnabled(nextValue);

    try {
      const result = await updateAutoRenew(nextValue);
      setEnabled(result.autoRenew !== false);
      onUpdated?.(result);
      toast(
        result.message ||
          (nextValue
            ? 'Auto Subscription has been enabled successfully.'
            : 'Auto Subscription has been disabled.'),
        'success'
      );
    } catch (err) {
      setEnabled(previous);
      toast(
        err instanceof ApiError ? err.message : 'Unable to update Auto Subscription. Please try again.',
        'error'
      );
    } finally {
      setSaving(false);
      inFlight.current = false;
    }
  };

  const handleToggleClick = () => {
    if (!canManage || saving || inFlight.current) return;
    if (enabled) {
      setConfirmOpen(true);
      return;
    }
    persist(true);
  };

  const confirmDisable = async () => {
    setConfirmOpen(false);
    await persist(false);
  };

  return (
    <>
      <Card>
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center flex-shrink-0">
            <RefreshCw size={18} className="text-brand-600" />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="mb-1">Auto Subscription</CardTitle>
            <p className="text-sm text-body leading-relaxed">
              When enabled, your Pro plan renews automatically each billing cycle so your chatbot
              stays live without interruption.
            </p>
          </div>
        </div>

        <div
          className={[
            'flex items-center justify-between gap-4 rounded-xl border px-4 py-3.5',
            enabled ? 'bg-brand-50/60 border-brand-100' : 'bg-canvas border-line-subtle',
          ].join(' ')}
        >
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink">
              {enabled ? 'Auto renew is on' : 'Auto renew is off'}
            </p>
            <p className="text-xs text-body mt-0.5">
              {!canManage
                ? 'Subscribe to manage Auto Subscription.'
                : enabled
                  ? renewalLabel
                    ? `Next renewal on ${renewalLabel}.`
                    : 'Your subscription will renew automatically.'
                  : renewalLabel
                    ? `Access continues until ${renewalLabel}, then the chatbot turns off.`
                    : 'Your chatbot will turn off when the current period ends.'}
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            aria-label="Auto Subscription"
            disabled={!canManage || saving}
            onClick={handleToggleClick}
            className={[
              'relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-colors duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-2',
              enabled ? 'bg-brand-600' : 'bg-[#d4d4dc]',
              (!canManage || saving) && 'opacity-60 cursor-not-allowed',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <span
              className={[
                'inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200',
                enabled ? 'translate-x-6' : 'translate-x-1',
                saving && 'opacity-80',
              ]
                .filter(Boolean)
                .join(' ')}
            />
          </button>
        </div>

        {saving && (
          <p className="text-xs text-muted mt-3" aria-live="polite">
            Saving preference…
          </p>
        )}
      </Card>

      <Modal
        open={confirmOpen}
        onClose={() => !saving && setConfirmOpen(false)}
        title="Disable Auto Subscription?"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-body leading-relaxed">
            Are you sure you want to disable Auto Subscription?
          </p>
          <p className="text-sm text-body leading-relaxed">
            If Auto Subscription is turned off, your subscription will not renew automatically. Once
            your current subscription expires, your chatbot will be deactivated and removed from your
            website until you purchase a new subscription.
          </p>
          <p className="text-sm text-body leading-relaxed">
            You can enable Auto Subscription again at any time before your subscription expires.
          </p>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setConfirmOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={confirmDisable} disabled={saving}>
              Yes, Disable Auto Subscription
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
