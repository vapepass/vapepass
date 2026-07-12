'use client';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardTitle } from '@/components/ui/Card';
import Tabs from '@/components/ui/Tabs';
import Toggle from '@/components/ui/Toggle';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import { Input, FormField } from '@/components/ui/Input';
import { Save, CheckCircle, CreditCard, Zap } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/context/AuthContext';
import { storeToForm, CANADIAN_PROVINCES, COUNTRY_OPTIONS } from '@/lib/store-utils';
import { ApiError, fieldErrorsToMap } from '@/lib/api';
import { getBillingInfo, createCheckoutSession, createBillingPortal } from '@/lib/billing-api';

export default function Settings() {
  const { toast } = useToast();
  const { user, store, updateStore } = useAuth();
  const [tab, setTab] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notifs, setNotifs] = useState({ reward: true, join: true, stamp: false, weekly: true });
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', address: '', country: 'CA', province: '' });
  const [logoFile, setLogoFile] = useState(null);
  const [billingInfo, setBillingInfo] = useState(null);
  const [billingLoading, setBillingLoading] = useState(false);

  useEffect(() => {
    if (store && user) {
      setProfile({
        name: store.name || '',
        email: user.email || '',
        phone: '',
        address: store.address || '',
        country: store.country || 'CA',
        province: store.province || '',
      });
    }
  }, [store, user]);

  useEffect(() => {
    if (tab === 'billing') {
      getBillingInfo().then(setBillingInfo).catch(() => {});
    }
  }, [tab]);

  const startCheckout = async () => {
    setBillingLoading(true);
    try {
      const { url } = await createCheckoutSession();
      if (url) window.location.href = url;
    } catch (err) {
      toast(err instanceof ApiError ? err.message : 'Unable to start checkout', 'error');
    } finally {
      setBillingLoading(false);
    }
  };

  const openPortal = async () => {
    setBillingLoading(true);
    try {
      const { url } = await createBillingPortal();
      if (url) window.location.href = url;
    } catch (err) {
      toast(err instanceof ApiError ? err.message : 'Unable to open billing portal', 'error');
    } finally {
      setBillingLoading(false);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await updateStore({
        name: profile.name,
        address: profile.address,
        country: profile.country,
        province: profile.province,
      }, logoFile);
      setLogoFile(null);
      setSaved(true);
      toast('Settings saved successfully', 'success');
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      const message = err instanceof ApiError
        ? fieldErrorsToMap(err.errors).name || err.message
        : 'Failed to save settings';
      toast(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const save = () => {
    if (tab === 'profile') {
      saveProfile();
      return;
    }
    setSaved(true);
    toast('Settings saved successfully', 'success');
    setTimeout(() => setSaved(false), 2500);
  };

  const tabs = [
    { id: 'profile', label: 'Business Profile' },
    { id: 'billing', label: 'Billing' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'security', label: 'Security' },
  ];

  const storeForm = storeToForm(store);

  return (
    <DashboardLayout>
      <PageHeader
        title="Business Settings"
        description="Manage your store account, plan, and preferences"
      />

      <Tabs tabs={tabs} active={tab} onChange={setTab} className="mb-8" />

      <div className="max-w-2xl">
        {tab === 'profile' && (
          <Card className="animate-fade-in space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-line-subtle">
              {storeForm.logo ? (
                <img src={storeForm.logo} alt="" className="w-16 h-16 rounded-2xl object-cover" />
              ) : (
                <Avatar name={profile.name} size="xl" />
              )}
              <div>
                <p className="font-bold text-ink text-lg tracking-tight">{profile.name}</p>
                <label className="mt-2 inline-block cursor-pointer">
                  <Button variant="secondary" size="sm" as="span">Change Logo</Button>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    aria-label="Upload logo"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setLogoFile(file);
                    }}
                  />
                </label>
                {logoFile && <p className="text-xs text-muted mt-1">{logoFile.name}</p>}
              </div>
            </div>

            <FormField label="Store Name" htmlFor="store-name">
              <Input
                id="store-name"
                value={profile.name}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              />
            </FormField>

            <FormField label="Email" htmlFor="email" hint="Account email — contact support to change">
              <Input id="email" type="email" value={profile.email} readOnly className="bg-canvas" />
            </FormField>

            <FormField label="Phone" htmlFor="phone">
              <Input
                id="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                placeholder="Not yet synced to server"
              />
            </FormField>

            <FormField label="Address" htmlFor="address">
              <Input
                id="address"
                value={profile.address}
                onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))}
                placeholder="1234 Main St, Vancouver, BC"
              />
            </FormField>

            <FormField label="Country" htmlFor="country">
              <select
                id="country"
                value={profile.country}
                onChange={(e) => setProfile((p) => ({ ...p, country: e.target.value, province: '' }))}
                className="w-full h-11 px-3 rounded-xl border border-line-subtle bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {COUNTRY_OPTIONS.map(({ code, label }) => (
                  <option key={code} value={code}>{label}</option>
                ))}
              </select>
            </FormField>

            {profile.country === 'CA' && (
              <FormField label="Province / Territory" htmlFor="province" hint="Used to determine the legal purchasing age for your AI assistant">
                <select
                  id="province"
                  value={profile.province}
                  onChange={(e) => setProfile((p) => ({ ...p, province: e.target.value }))}
                  className="w-full h-11 px-3 rounded-xl border border-line-subtle bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">Select province…</option>
                  {CANADIAN_PROVINCES.map(({ code, label }) => (
                    <option key={code} value={code}>{label}</option>
                  ))}
                </select>
              </FormField>
            )}

            {storeForm.legalAge && (
              <p className="text-xs text-muted bg-canvas border border-line-subtle rounded-xl px-4 py-3">
                Legal purchasing age at your location: <strong>{storeForm.legalAge}+</strong> (auto-calculated)
              </p>
            )}

            <Button onClick={save} className="w-full" disabled={saving}>
              {saving ? 'Saving…' : saved ? <><CheckCircle size={15} /> Saved</> : <><Save size={15} /> Save Changes</>}
            </Button>
          </Card>
        )}

        {tab === 'billing' && (
          <div className="space-y-5 animate-fade-in">
            <Card className="border-brand-200 ring-1 ring-brand-100">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl gradient-brand flex items-center justify-center shadow-sm">
                    <Zap size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-ink">Pro Plan</p>
                    <p className="text-body text-sm">${billingInfo?.monthlyPrice ?? 99} / month</p>
                  </div>
                </div>
                <Badge variant="success">{store?.subscriptionStatus || 'trial'}</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {[
                  { label: 'Billing provider', value: billingInfo?.configured ? 'Stripe' : 'Not configured' },
                  { label: 'Status', value: store?.subscriptionStatus || 'trial' },
                ].map(({ label, value }) => (
                  <div key={label} className="px-4 py-3.5 rounded-xl bg-canvas border border-line-subtle">
                    <p className="text-muted text-xs mb-1">{label}</p>
                    <p className="text-ink text-sm font-semibold capitalize">{value}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" size="sm" onClick={startCheckout} disabled={billingLoading}>
                  <CreditCard size={14} /> Subscribe — $99/mo
                </Button>
                <Button variant="secondary" size="sm" onClick={openPortal} disabled={billingLoading}>
                  Manage Subscription
                </Button>
              </div>
            </Card>

            <Card>
              <CardTitle>Billing History</CardTitle>
              <p className="text-sm text-body mt-3">
                Invoice history is available in the Stripe customer portal after you subscribe.
              </p>
            </Card>
          </div>
        )}

        {tab === 'notifications' && (
          <Card className="animate-fade-in divide-y divide-line-subtle">
            {[
              { key: 'reward', title: 'Reward Earned', desc: 'Notify when a customer hits their stamp goal' },
              { key: 'join', title: 'New Customer Joined', desc: 'Notify when a customer joins your program' },
              { key: 'stamp', title: 'Stamp Added', desc: 'Notify on every stamp scan' },
              { key: 'weekly', title: 'Weekly Summary', desc: 'Weekly report with customer and stamp stats' },
            ].map(({ key, title, desc }) => (
              <div key={key} className="flex items-center justify-between py-5 first:pt-0 last:pb-0 gap-4">
                <div>
                  <p className="text-ink text-sm font-medium">{title}</p>
                  <p className="text-body text-xs mt-0.5">{desc}</p>
                </div>
                <Toggle
                  checked={notifs[key]}
                  onChange={(v) => setNotifs((n) => ({ ...n, [key]: v }))}
                  label={title}
                  id={`notif-${key}`}
                />
              </div>
            ))}
          </Card>
        )}

        {tab === 'security' && (
          <Card className="animate-fade-in space-y-6">
            <div>
              <h3 className="font-semibold text-ink mb-2">Change Password</h3>
              <p className="text-body text-xs mb-5">
                Use the{' '}
                <a href="/forgot-password" className="text-brand-600 hover:text-brand-700 font-medium">
                  forgot password
                </a>{' '}
                flow to reset your password via email.
              </p>
            </div>

            <div className="pt-6 border-t border-line-subtle">
              <h3 className="font-semibold text-ink mb-2">Two-Factor Authentication</h3>
              <p className="text-body text-xs mb-4">Add an extra layer of security to your account.</p>
              <Button variant="secondary" size="sm" disabled>Enable 2FA</Button>
            </div>

            <div className="pt-6 border-t border-line-subtle">
              <h3 className="font-semibold text-danger-600 mb-2">Danger Zone</h3>
              <p className="text-body text-xs mb-4">Permanently delete your account and all associated data.</p>
              <Button variant="danger" size="sm" disabled>Delete Account</Button>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
