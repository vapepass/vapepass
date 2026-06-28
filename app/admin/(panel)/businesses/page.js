'use client';

import { useEffect, useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import { getAdminBusinesses, updateBusinessSubscription } from '@/lib/admin-api';
import { useToast } from '@/components/ui/Toast';

const STATUSES = ['all', 'trial', 'active', 'paused', 'past_due', 'cancelled'];

const STATUS_VARIANT = {
  trial: 'default',
  active: 'success',
  paused: 'warning',
  past_due: 'warning',
  cancelled: 'danger',
};

export default function AdminBusinessesPage() {
  const { toast } = useToast();
  const [status, setStatus] = useState('all');
  const [data, setData] = useState({ businesses: [], total: 0 });
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getAdminBusinesses({ status, limit: 50 })
      .then(setData)
      .catch(() => setData({ businesses: [], total: 0 }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [status]);

  const changeStatus = async (storeId, subscriptionStatus) => {
    try {
      await updateBusinessSubscription(storeId, subscriptionStatus);
      toast('Subscription status updated', 'success');
      load();
    } catch {
      toast('Failed to update status', 'error');
    }
  };

  return (
    <>
      <PageHeader
        title="Businesses"
        description={`${data.total} registered stores`}
      />

      <div className="flex flex-wrap gap-2 mb-5">
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            className={[
              'px-3 py-1.5 rounded-lg text-xs font-semibold capitalize',
              status === s ? 'bg-brand-600 text-white' : 'bg-canvas text-body border border-line',
            ].join(' ')}
          >
            {s === 'all' ? 'All' : s.replace('_', ' ')}
          </button>
        ))}
      </div>

      <Card padding={false} className="overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase">Store</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase">Owner</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase">Customers</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-subtle">
                {data.businesses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-body">No businesses found.</td>
                  </tr>
                ) : (
                  data.businesses.map((b) => (
                    <tr key={b.id}>
                      <td className="px-5 py-4 font-medium text-ink">{b.name}</td>
                      <td className="px-5 py-4 text-body">{b.owner?.email || '—'}</td>
                      <td className="px-5 py-4 text-body tabular-nums">{b.customerCount}</td>
                      <td className="px-5 py-4">
                        <Badge variant={STATUS_VARIANT[b.subscriptionStatus] || 'default'}>
                          {b.subscriptionStatus.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          className="text-xs border border-line rounded-lg px-2 py-1.5 bg-surface"
                          value={b.subscriptionStatus}
                          onChange={(e) => changeStatus(b.id, e.target.value)}
                          aria-label={`Update subscription for ${b.name}`}
                        >
                          {STATUSES.filter((s) => s !== 'all').map((s) => (
                            <option key={s} value={s}>{s.replace('_', ' ')}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
