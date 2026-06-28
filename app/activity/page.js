'use client';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import { FilterPills } from '@/components/ui/Tabs';
import { getActivity } from '@/lib/activity-api';
import { mapActivity } from '@/lib/mappers';
import { Stamp, UserPlus, Award, Key, Filter } from 'lucide-react';

const FILTER_MAP = {
  all: 'all',
  stamp: 'stamp_added',
  join: 'customer_joined',
  reward: 'reward_earned',
  code: 'verification_code',
};

const filters = [
  { id: 'all', label: 'All' },
  { id: 'stamp', label: 'Stamps' },
  { id: 'join', label: 'Joins' },
  { id: 'reward', label: 'Rewards' },
  { id: 'code', label: 'Verification' },
];

export default function ActivityLog() {
  const [filter, setFilter] = useState('all');
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getActivity({ type: FILTER_MAP[filter], limit: 50 })
      .then((data) => setActivities(data.activities.map(mapActivity)))
      .catch(() => setActivities([]))
      .finally(() => setLoading(false));
  }, [filter]);

  const icons = {
    stamp: <Stamp size={15} className="text-brand-600" />,
    join: <UserPlus size={15} className="text-success-600" />,
    reward: <Award size={15} className="text-warning-600" />,
    code: <Key size={15} className="text-muted" />,
  };
  const colors = {
    stamp: 'bg-brand-50',
    join: 'bg-success-50',
    reward: 'bg-warning-50',
    code: 'bg-canvas',
  };

  const filtered = activities;

  return (
    <DashboardLayout>
      <PageHeader
        title="Activity Log"
        description="Compliance and loyalty event history"
      />

      <div className="flex items-center gap-2 mb-6">
        <Filter size={15} className="text-muted" aria-hidden="true" />
        <FilterPills options={filters} value={filter} onChange={setFilter} />
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : (
        <Card className="divide-y divide-line-subtle !p-0 overflow-hidden">
          {filtered.length === 0 ? (
            <p className="text-center text-body py-12">No activity yet.</p>
          ) : (
            filtered.map((a) => (
              <div key={a.id} className="flex items-start gap-4 px-5 py-4 hover:bg-canvas/40 transition-colors">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${colors[a.type] || 'bg-canvas'}`}>
                  {icons[a.type] || icons.stamp}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-ink">{a.customer}</p>
                    <span className="text-xs text-muted flex-shrink-0">{a.time}</span>
                  </div>
                  <p className="text-xs text-body mt-0.5">{a.detail}</p>
                </div>
              </div>
            ))
          )}
        </Card>
      )}
    </DashboardLayout>
  );
}
