'use client';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Users, UserCheck, Gift, TrendingUp, Stamp, UserPlus, Award, Key, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAuth } from '@/context/AuthContext';
import { getCustomerStats } from '@/lib/customer-api';
import { getActivity } from '@/lib/activity-api';
import { getDashboardAnalytics } from '@/lib/analytics-api';
import { mapActivity } from '@/lib/mappers';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="px-3 py-2.5 rounded-xl text-xs bg-surface border border-line shadow-lg">
        <p className="text-muted mb-1.5 font-medium">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }} className="font-semibold">{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

function StatCard({ icon: Icon, label, value, change, color }) {
  return (
    <Card hover className="!p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${color}12` }}
          >
            <Icon size={20} style={{ color }} aria-hidden="true" />
          </div>
          <div>
            <p className="text-muted text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
            <p className="text-ink text-2xl font-bold tracking-tight tabular-nums">{value}</p>
            {change && (
              <p className="text-xs mt-1.5 text-success-600 font-medium flex items-center gap-0.5">
                <ArrowUpRight size={12} aria-hidden="true" /> {change} this month
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function ActivityItem({ item }) {
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

  return (
    <div className="flex items-center gap-3 py-3.5 border-b border-line-subtle last:border-0">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${colors[item.icon]}`}>
        {icons[item.icon]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-ink text-sm font-medium">{item.customer}</p>
        <p className="text-body text-xs truncate mt-0.5">{item.detail}</p>
      </div>
      <p className="text-muted text-xs flex-shrink-0 tabular-nums">{item.time}</p>
    </div>
  );
}

export default function Dashboard() {
  const { store } = useAuth();
  const [stats, setStats] = useState({ total: 0, active: 0, rewarded: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [growth, setGrowth] = useState([]);
  const [visitActivity, setVisitActivity] = useState([]);

  useEffect(() => {
    getCustomerStats().then(setStats).catch(() => {});
    getActivity({ limit: 6 })
      .then((data) => setRecentActivity(data.activities.map(mapActivity)))
      .catch(() => {});
    getDashboardAnalytics()
      .then((data) => {
        setGrowth(data.growth || []);
        setVisitActivity(data.loyalty || []);
      })
      .catch(() => {});
  }, []);

  return (
    <DashboardLayout>
      <PageHeader
        title="Dashboard"
        description={store?.name ? `Here's what's happening at ${store.name}` : "Here's what's happening at your store"}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Users} label="Total Customers" value={stats.total} color="#7c3aed" />
        <StatCard icon={UserCheck} label="Active Members" value={stats.active} color="#3b82f6" />
        <StatCard icon={Gift} label="Rewards Ready" value={stats.rewarded} color="#f59e0b" />
        <StatCard icon={TrendingUp} label="Plan" value={store?.subscriptionStatus || 'trial'} color="#10b981" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <Card>
          <CardTitle>Customer Growth</CardTitle>
          <CardDescription>Total customers over time</CardDescription>
          <div className="mt-5 h-44 min-h-[176px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growth} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f5" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#9494a6', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9494a6', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="customers" stroke="#7c3aed" fill="url(#g1)" strokeWidth={2} dot={false} name="Customers" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardTitle>Visit Activity</CardTitle>
          <CardDescription>Stamps issued and rewards earned</CardDescription>
          <div className="mt-5 h-44 min-h-[176px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visitActivity} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f5" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#9494a6', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9494a6', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="stamps" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Stamps" />
                <Bar dataKey="rewards" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Rewards" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest customer interactions</CardDescription>
        <div className="mt-4">
          {recentActivity.length === 0 ? (
            <p className="text-sm text-body py-4">No recent activity yet.</p>
          ) : (
            recentActivity.map((a) => <ActivityItem key={a.id} item={a} />)
          )}
        </div>
      </Card>
    </DashboardLayout>
  );
}
