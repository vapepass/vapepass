'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import {
  Bot, Package, Link2, Sparkles, Settings, CreditCard, ArrowRight, CheckCircle2, AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getAssistantStatus } from '@/lib/assistant-api';
import { ApiError } from '@/lib/api';

function statusVariant(status) {
  switch (status) {
    case 'success':
    case 'active':
      return 'success';
    case 'error':
    case 'inactive':
      return 'danger';
    case 'syncing':
    case 'pending':
      return 'warning';
    default:
      return 'default';
  }
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <Card hover className="!p-5">
      <div className="flex items-start gap-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}12` }}
        >
          <Icon size={20} style={{ color }} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-muted text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
          <p className="text-ink text-2xl font-bold tracking-tight tabular-nums truncate">{value}</p>
        </div>
      </div>
    </Card>
  );
}

function ChecklistItem({ ok, label }) {
  return (
    <li className="flex items-center gap-2.5 text-sm">
      {ok ? (
        <CheckCircle2 size={16} className="text-success-600 flex-shrink-0" aria-hidden="true" />
      ) : (
        <AlertCircle size={16} className="text-muted flex-shrink-0" aria-hidden="true" />
      )}
      <span className={ok ? 'text-ink' : 'text-muted'}>{label}</span>
    </li>
  );
}

export default function Dashboard() {
  const { store } = useAuth();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const assistantStatus = await getAssistantStatus();
      setStatus(assistantStatus);
      setError('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to load assistant status');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const planLabel = (store?.subscriptionStatus || 'trial').replace('_', ' ');
  const syncLabel = status?.inventorySyncStatus || 'idle';
  const productCount = status?.inventoryProductCount ?? 0;
  const assistantLive = Boolean(status?.assistantEnabled);

  return (
    <DashboardLayout>
      <PageHeader
        title="Dashboard"
        description={
          store?.name
            ? `AI Flavor Sommelier overview for ${store.name}`
            : 'AI Flavor Sommelier overview for your store'
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Bot}
          label="AI Assistant"
          value={loading ? '…' : assistantLive ? 'Live' : 'Setup needed'}
          color="#7c3aed"
        />
        <StatCard
          icon={Package}
          label="Products Synced"
          value={loading ? '…' : productCount}
          color="#3b82f6"
        />
        <StatCard
          icon={Link2}
          label="Inventory Sync"
          value={loading ? '…' : syncLabel}
          color="#f59e0b"
        />
        <StatCard
          icon={CreditCard}
          label="Plan"
          value={planLabel}
          color="#10b981"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <Card className="space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle>AI Flavor Sommelier</CardTitle>
              <CardDescription className="mt-1">
                Compliant chatbot powered by your live store inventory
              </CardDescription>
            </div>
            <Badge variant={statusVariant(assistantLive ? 'success' : 'inactive')}>
              {assistantLive ? 'Live' : 'Inactive'}
            </Badge>
          </div>

          {error ? (
            <p className="text-sm text-danger-600 bg-danger-50 border border-red-200 rounded-xl px-4 py-3">
              {error}
            </p>
          ) : (
            <ul className="space-y-3">
              <ChecklistItem ok={Boolean(status?.productPageUrl)} label="Store website URL connected" />
              <ChecklistItem
                ok={status?.inventorySyncStatus === 'success'}
                label="Inventory synced to MongoDB"
              />
              <ChecklistItem
                ok={(status?.recommendableProductCount || 0) > 0}
                label="Products available for recommendations"
              />
              <ChecklistItem ok={assistantLive} label="Assistant live on embed widget" />
            </ul>
          )}

          <div className="flex flex-wrap gap-3 pt-1">
            <Button as={Link} href="/assistant">
              Manage AI Assistant <ArrowRight size={16} />
            </Button>
            <Button as={Link} href="/settings" variant="secondary">
              <Settings size={15} /> Store Settings
            </Button>
          </div>
        </Card>

        <Card className="space-y-5">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl gradient-brand flex items-center justify-center flex-shrink-0">
              <Sparkles size={20} className="text-white" aria-hidden="true" />
            </div>
            <div>
              <CardTitle>Store & subscription</CardTitle>
              <CardDescription className="mt-1">
                Business profile, billing, and plan status
              </CardDescription>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl bg-canvas border border-line-subtle px-4 py-3.5">
              <p className="text-[11px] text-muted uppercase tracking-wider mb-1">Store</p>
              <p className="text-sm font-semibold text-ink truncate">{store?.name || '—'}</p>
            </div>
            <div className="rounded-xl bg-canvas border border-line-subtle px-4 py-3.5">
              <p className="text-[11px] text-muted uppercase tracking-wider mb-1">Plan</p>
              <p className="text-sm font-semibold text-ink capitalize">{planLabel}</p>
            </div>
            <div className="rounded-xl bg-canvas border border-line-subtle px-4 py-3.5">
              <p className="text-[11px] text-muted uppercase tracking-wider mb-1">Products</p>
              <p className="text-sm font-semibold text-ink tabular-nums">{productCount}</p>
            </div>
            <div className="rounded-xl bg-canvas border border-line-subtle px-4 py-3.5">
              <p className="text-[11px] text-muted uppercase tracking-wider mb-1">Last sync</p>
              <p className="text-sm font-semibold text-ink">
                {status?.lastInventorySyncAt
                  ? new Date(status.lastInventorySyncAt).toLocaleDateString()
                  : '—'}
              </p>
            </div>
          </div>

          <Button as={Link} href="/settings" variant="secondary" className="w-full sm:w-auto">
            <CreditCard size={15} /> Manage billing & profile
          </Button>
        </Card>
      </div>

      {status?.productPageUrl && (
        <Card>
          <CardTitle>Connected storefront</CardTitle>
          <CardDescription className="mt-1">
            Inventory is scraped from this URL for AI recommendations
          </CardDescription>
          <p className="mt-4 text-sm text-ink break-all font-medium">{status.productPageUrl}</p>
          {status.detectedPlatform && (
            <p className="text-xs text-muted mt-2 capitalize">Platform: {status.detectedPlatform}</p>
          )}
        </Card>
      )}
    </DashboardLayout>
  );
}
