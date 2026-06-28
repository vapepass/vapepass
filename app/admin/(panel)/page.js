'use client';

import { useEffect, useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import { getAdminOverview } from '@/lib/admin-api';
import { Building2, Users, Wallet, Activity } from 'lucide-react';

const STATUS_LABELS = {
  trial: 'Trial',
  active: 'Active',
  paused: 'Paused',
  past_due: 'Past due',
  cancelled: 'Cancelled',
};

export default function AdminOverviewPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminOverview()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  }

  if (!data) {
    return <p className="text-body">Unable to load admin overview.</p>;
  }

  return (
    <>
      <PageHeader title="Admin Overview" description="Platform-wide metrics and activity" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { icon: Building2, label: 'Total Stores', value: data.totalStores, color: '#7c3aed' },
          { icon: Users, label: 'Store Owners', value: data.totalOwners, color: '#3b82f6' },
          { icon: Wallet, label: 'Total Customers', value: data.totalCustomers, color: '#10b981' },
        ].map(({ icon: Icon, label, value, color }) => (
          <Card key={label} className="!p-5">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${color}12` }}>
                <Icon size={20} style={{ color }} />
              </div>
              <div>
                <p className="text-xs text-muted uppercase tracking-wider">{label}</p>
                <p className="text-2xl font-bold text-ink tabular-nums">{value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mb-6">
        <h2 className="text-sm font-semibold text-ink mb-4">Subscription status</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Object.entries(data.subscriptionCounts).map(([status, count]) => (
            <div key={status} className="rounded-xl bg-canvas border border-line px-4 py-3 text-center">
              <p className="text-2xl font-bold text-ink tabular-nums">{count}</p>
              <p className="text-xs text-muted mt-1">{STATUS_LABELS[status] || status}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold text-ink mb-4 flex items-center gap-2">
          <Activity size={16} /> Recent platform activity
        </h2>
        {data.recentActivity.length === 0 ? (
          <p className="text-sm text-body">No activity yet.</p>
        ) : (
          <ul className="divide-y divide-line-subtle">
            {data.recentActivity.map((item) => (
              <li key={item.id} className="py-3 text-sm">
                <p className="font-medium text-ink">{item.customerName}</p>
                <p className="text-body text-xs mt-0.5">{item.detail} · {item.storeName}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
