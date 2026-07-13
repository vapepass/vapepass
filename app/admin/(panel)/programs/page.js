'use client';

import { useEffect, useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import { getAdminPrograms } from '@/lib/admin-api';

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminPrograms()
      .then((data) => setPrograms(data.programs || []))
      .catch(() => setPrograms([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader title="Programs" description="Rewards programs across all stores" />

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : programs.length === 0 ? (
        <Card><p className="text-body text-sm">No programs yet.</p></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {programs.map((p) => (
            <Card key={p.id} className="!p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-semibold text-ink">{p.storeName}</p>
                  <p className="text-xs text-muted mt-1">{p.customerCount} customers</p>
                </div>
                <Badge variant={p.subscriptionStatus === 'active' ? 'success' : 'default'}>
                  {p.subscriptionStatus}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-4 rounded-full" style={{ background: p.brandColor }} />
                <p className="text-sm text-body">{p.stampGoal} stamps → {p.rewardDescription}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
