'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Bot, Copy, CheckCircle, RefreshCw, Link2, Package, AlertTriangle, Code2,
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Toggle from '@/components/ui/Toggle';
import { Input, FormField } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { ApiError } from '@/lib/api';
import {
  getAssistantStatus,
  setProductPageUrl,
  syncInventory,
  getInventory,
  setPriorityPromotion,
} from '@/lib/assistant-api';

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

function formatDate(value) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return '—';
  }
}

export default function AssistantPage() {
  const { toast } = useToast();
  const [status, setStatus] = useState(null);
  const [products, setProducts] = useState([]);
  const [productPageUrl, setProductPageUrlInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const load = useCallback(async () => {
    try {
      const [assistantStatus, inventory] = await Promise.all([
        getAssistantStatus(),
        getInventory(false).catch(() => []),
      ]);
      setStatus(assistantStatus);
      setProductPageUrlInput(assistantStatus.productPageUrl || '');
      setProducts(inventory);
    } catch (err) {
      toast(err instanceof ApiError ? err.message : 'Failed to load assistant status', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const pollStatus = async (attempts = 8) => {
    for (let i = 0; i < attempts; i += 1) {
      await new Promise((r) => setTimeout(r, 3000));
      try {
        const [assistantStatus, inventory] = await Promise.all([
          getAssistantStatus(),
          getInventory(false).catch(() => []),
        ]);
        setStatus(assistantStatus);
        setProducts(inventory);
        if (['success', 'error'].includes(assistantStatus.inventorySyncStatus)) {
          if (assistantStatus.inventorySyncStatus === 'success') {
            toast(`Inventory synced — ${assistantStatus.inventoryProductCount} products`, 'success');
          } else if (assistantStatus.inventorySyncError) {
            toast(assistantStatus.inventorySyncError, 'error');
          }
          return;
        }
      } catch {
        /* keep polling */
      }
    }
  };

  const saveUrl = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await setProductPageUrl(productPageUrl.trim(), true);
      setStatus(data.status);
      toast('Store URL saved. Scraping inventory…', 'success');
      pollStatus(10);
    } catch (err) {
      toast(err instanceof ApiError ? err.message : 'Failed to save store URL', 'error');
    } finally {
      setSaving(false);
    }
  };

  const runSync = async () => {
    setSyncing(true);
    try {
      const data = await syncInventory();
      setStatus(data.status);
      toast('Inventory sync started', 'success');
      await pollStatus(10);
    } catch (err) {
      toast(err instanceof ApiError ? err.message : 'Inventory sync failed', 'error');
      await load();
    } finally {
      setSyncing(false);
    }
  };

  const togglePriority = async (product) => {
    const next = !product.isPriorityPromotion;
    setTogglingId(product._id);

    // Optimistic update — no page refresh
    setProducts((prev) =>
      prev.map((p) =>
        p._id === product._id ? { ...p, isPriorityPromotion: next } : p
      )
    );

    try {
      const updated = await setPriorityPromotion(product._id, next);
      setProducts((prev) =>
        prev.map((p) => (p._id === updated._id ? { ...p, ...updated } : p))
      );
    } catch (err) {
      // Revert on failure
      setProducts((prev) =>
        prev.map((p) =>
          p._id === product._id ? { ...p, isPriorityPromotion: !next } : p
        )
      );
      toast(err instanceof ApiError ? err.message : 'Failed to update promotion', 'error');
    } finally {
      setTogglingId(null);
    }
  };

  const copyEmbed = async () => {
    if (!status?.embedCode) return;
    try {
      await navigator.clipboard.writeText(status.embedCode);
      setCopied(true);
      toast('Embed code copied', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast('Unable to copy embed code', 'error');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <PageHeader title="AI Assistant" description="Loading…" />
      </DashboardLayout>
    );
  }

  const isSyncing = syncing || saving || ['syncing', 'pending'].includes(status?.inventorySyncStatus);

  return (
    <DashboardLayout>
      <PageHeader
        title="VapePass Assistant"
        description="Scrape your store inventory and power a compliant AI chatbot"
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                <Link2 size={20} className="text-brand-600" />
              </div>
              <div>
                <CardTitle>Store website URL</CardTitle>
                <CardDescription className="mt-1">
                  Enter your store homepage. We auto-detect Shopify and WooCommerce and import all active products.
                </CardDescription>
              </div>
            </div>

            <form onSubmit={saveUrl} className="space-y-4">
              <FormField
                label="Store website URL"
                htmlFor="productPageUrl"
                hint="Examples: https://thevapefather.com or https://shophootz.ca"
                required
              >
                <Input
                  id="productPageUrl"
                  type="url"
                  value={productPageUrl}
                  onChange={(e) => setProductPageUrlInput(e.target.value)}
                  placeholder="https://yourstore.com"
                  required
                  disabled={isSyncing}
                />
              </FormField>

              <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={saving || !productPageUrl.trim() || isSyncing}>
                  {saving || status?.inventorySyncStatus === 'syncing'
                    ? 'Scraping…'
                    : 'Save & Scrape Inventory'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={runSync}
                  disabled={syncing || !status?.productPageUrl || isSyncing}
                >
                  <RefreshCw size={15} className={isSyncing ? 'animate-spin' : ''} />
                  {syncing ? 'Syncing…' : 'Sync Now'}
                </Button>
              </div>

              {status?.inventorySyncError && (
                <p className="text-sm text-danger-600 bg-danger-50 border border-red-200 rounded-xl px-4 py-3">
                  {status.inventorySyncError}
                </p>
              )}
            </form>
          </Card>

          <Card className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                <Code2 size={20} className="text-brand-600" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle>Embed code</CardTitle>
                <CardDescription className="mt-1">
                  Paste on your site. The widget stays hidden until your website age gate is passed, then runs its own age check.
                </CardDescription>
              </div>
            </div>

            <pre className="text-xs sm:text-sm bg-canvas border border-line-subtle rounded-xl p-4 overflow-x-auto text-ink whitespace-pre-wrap break-all">
              {status?.embedCode || 'Save a store URL to generate your embed code.'}
            </pre>

            <Button variant="secondary" onClick={copyEmbed} disabled={!status?.embedCode}>
              {copied ? <CheckCircle size={15} /> : <Copy size={15} />}
              {copied ? 'Copied' : 'Copy embed code'}
            </Button>
          </Card>

          <Card>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <Package size={18} className="text-brand-600" />
                <div>
                  <CardTitle>Store inventory</CardTitle>
                  <CardDescription className="mt-0.5">
                    Products scraped into MongoDB for this store only
                  </CardDescription>
                </div>
              </div>
              <Badge variant={statusVariant(status?.inventorySyncStatus)}>
                {status?.inventorySyncStatus || 'idle'}
              </Badge>
            </div>

            {products.length === 0 ? (
              <p className="text-sm text-body">
                No products yet. Enter your store website URL and run a scrape.
              </p>
            ) : (
              <div className="overflow-x-auto -mx-1">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted border-b border-line-subtle">
                      <th className="py-2 pr-3 font-medium">Product name</th>
                      <th className="py-2 pr-3 font-medium">Status</th>
                      <th className="py-2 pr-3 font-medium">Last updated</th>
                      <th className="py-2 font-medium min-w-[180px]">Push to Customers This Month</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => {
                      const productStatus = p.isActive === false || p.status === 'inactive'
                        ? 'inactive'
                        : 'active';
                      return (
                        <tr key={p._id} className="border-b border-line-subtle/70">
                          <td className="py-3 pr-3 text-ink font-medium">
                            <div>{p.name}</div>
                            {p.brand && (
                              <div className="text-xs text-muted font-normal mt-0.5">{p.brand}</div>
                            )}
                          </td>
                          <td className="py-3 pr-3">
                            <Badge variant={statusVariant(productStatus)}>
                              {productStatus}
                            </Badge>
                          </td>
                          <td className="py-3 pr-3 text-body whitespace-nowrap">
                            {formatDate(p.updatedAt || p.lastSeenAt)}
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <Toggle
                                id={`priority-${p._id}`}
                                checked={Boolean(p.isPriorityPromotion)}
                                onChange={() => togglePriority(p)}
                                label="Push to Customers This Month"
                              />
                              {togglingId === p._id && (
                                <span className="text-xs text-muted">Saving…</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl gradient-brand flex items-center justify-center">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <CardTitle>Status</CardTitle>
                <p className="text-xs text-body mt-0.5">Live readiness checklist</p>
              </div>
            </div>

            <ul className="space-y-3 text-sm">
              {[
                { ok: Boolean(status?.productPageUrl), label: 'Store website URL submitted' },
                {
                  ok: status?.inventorySyncStatus === 'success',
                  label: 'Inventory scraped to MongoDB',
                },
                {
                  ok: (status?.recommendableProductCount || 0) > 0,
                  label: 'Compliant products available',
                },
                { ok: Boolean(status?.embedCode), label: 'Embed code ready' },
                { ok: status?.assistantEnabled, label: 'Assistant live on widget' },
              ].map(({ ok, label }) => (
                <li key={label} className="flex items-center gap-2">
                  <span
                    className={[
                      'w-2 h-2 rounded-full flex-shrink-0',
                      ok ? 'bg-success-600' : 'bg-line',
                    ].join(' ')}
                  />
                  <span className={ok ? 'text-ink' : 'text-muted'}>{label}</span>
                </li>
              ))}
            </ul>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-xl bg-canvas border border-line-subtle px-3 py-3">
                <p className="text-[11px] text-muted uppercase tracking-wider">Products</p>
                <p className="text-lg font-bold text-ink tabular-nums">
                  {status?.inventoryProductCount ?? 0}
                </p>
              </div>
              <div className="rounded-xl bg-canvas border border-line-subtle px-3 py-3">
                <p className="text-[11px] text-muted uppercase tracking-wider">Priority</p>
                <p className="text-lg font-bold text-ink tabular-nums">
                  {products.filter((p) => p.isPriorityPromotion).length}
                </p>
              </div>
            </div>

            {status?.detectedPlatform && (
              <p className="text-xs text-muted capitalize">
                Platform: {status.detectedPlatform}
              </p>
            )}

            {status?.lastInventorySyncAt && (
              <p className="text-xs text-muted">
                Last sync: {formatDate(status.lastInventorySyncAt)}
              </p>
            )}
          </Card>

          <Card className="space-y-3 border-warning-200 bg-warning-50/40">
            <div className="flex items-center gap-2 text-warning-700">
              <AlertTriangle size={16} />
              <CardTitle className="!text-warning-800">Compliance</CardTitle>
            </div>
            <ul className="text-xs text-body space-y-2 list-disc pl-4">
              <li>Widget hidden until website age gate is passed</li>
              <li>Chatbot runs its own age check before recommendations</li>
              <li>Underage tripwires permanently lock the session</li>
              <li>Only this store&apos;s MongoDB inventory is recommended</li>
              <li>Priority products are recommended first</li>
            </ul>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
