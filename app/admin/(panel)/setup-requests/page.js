'use client';

import { useEffect, useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import { getAdminSetupRequests, updateSetupRequestStatus } from '@/lib/admin-api';
import { useToast } from '@/components/ui/Toast';

const STATUSES = ['all', 'Pending', 'Contacted', 'Scheduled', 'Completed', 'Cancelled'];

const STATUS_VARIANT = {
  Pending: 'warning',
  Contacted: 'default',
  Scheduled: 'default',
  Completed: 'success',
  Cancelled: 'danger',
};

function formatDate(value) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return '—';
  }
}

export default function AdminSetupRequestsPage() {
  const { toast } = useToast();
  const [status, setStatus] = useState('all');
  const [data, setData] = useState({ requests: [], total: 0 });
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getAdminSetupRequests({ status, limit: 50 })
      .then(setData)
      .catch(() => setData({ requests: [], total: 0 }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [status]);

  const changeStatus = async (requestId, nextStatus) => {
    try {
      await updateSetupRequestStatus(requestId, nextStatus);
      toast('Setup request status updated', 'success');
      load();
    } catch {
      toast('Failed to update status', 'error');
    }
  };

  return (
    <>
      <PageHeader
        title="Free Setup Requests"
        description={`${data.total} assistance request${data.total === 1 ? '' : 's'}`}
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
            {s === 'all' ? 'All' : s}
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
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase">Customer</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase">Store</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase">Contact</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase">Website</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase">Submitted</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-subtle">
                {data.requests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-body">
                      No setup requests found.
                    </td>
                  </tr>
                ) : (
                  data.requests.map((row) => (
                    <tr key={row.id}>
                      <td className="px-5 py-4">
                        <p className="font-medium text-ink">{row.fullName}</p>
                        {row.message ? (
                          <p className="text-xs text-muted mt-1 line-clamp-2 max-w-[220px]" title={row.message}>
                            {row.message}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-5 py-4 font-medium text-ink">{row.storeName}</td>
                      <td className="px-5 py-4 text-body">
                        <p>{row.email}</p>
                        <p className="text-xs text-muted mt-0.5">{row.phone}</p>
                      </td>
                      <td className="px-5 py-4">
                        <a
                          href={row.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-600 hover:underline break-all text-xs sm:text-sm"
                        >
                          {row.websiteUrl}
                        </a>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={STATUS_VARIANT[row.status] || 'default'}>
                          {row.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-body whitespace-nowrap">
                        {formatDate(row.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        <select
                          className="text-xs border border-line rounded-lg px-2 py-1.5 bg-surface"
                          value={row.status}
                          onChange={(e) => changeStatus(row.id, e.target.value)}
                          aria-label={`Update status for ${row.fullName}`}
                        >
                          {STATUSES.filter((s) => s !== 'all').map((s) => (
                            <option key={s} value={s}>{s}</option>
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
