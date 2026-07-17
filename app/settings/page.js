'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardTitle } from '@/components/ui/Card';
import Tabs from '@/components/ui/Tabs';
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
import { getSubscriptionBadgeVariant, getSubscriptionStatusLabel } from '@/lib/subscription';
import AutoSubscriptionSettings from '@/components/settings/AutoSubscriptionSettings';

export default function Settings() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const { user, store, updateStore, updateProfile } = useAuth();
  const initialTab = searchParams.get('tab') === 'billing' ? 'billing' : 'profile';
  const [tab, setTab] = useState(initialTab);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    websiteUrl: '',
    country: 'CA',
    province: '',
  });
  const [logoFile, setLogoFile] = useState(null);
  const [billingInfo, setBillingInfo] = useState(null);
  const [billingLoading, setBillingLoading] = useState(false);

  useEffect(() => {
    if (store && user) {
      setProfile({
        name: store.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: store.address || '',
        city: store.city || '',
        websiteUrl: store.websiteUrl || store.productPageUrl || '',
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
      await Promise.all([
        updateStore({
          name: profile.name,
          address: profile.address,
          city: profile.city,
          websiteUrl: profile.websiteUrl,
          productPageUrl: profile.websiteUrl,
          country: profile.country,
          province: profile.province,
        }, logoFile),
        updateProfile({ phone: profile.phone }),
      ]);
      setLogoFile(null);
      setSaved(true);
      toast('Settings saved successfully', 'success');
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      const message = err instanceof ApiError
        ? fieldErrorsToMap(err.errors).name || fieldErrorsToMap(err.errors).phone || err.message
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

            <FormField label="Phone" htmlFor="phone" hint="Business contact phone">
              <Input
                id="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                placeholder="+1 604 555 0100"
              />
            </FormField>

            <FormField
              label="Website URL"
              htmlFor="websiteUrl"
              hint="Embed script is authorized for this domain only"
            >
              <Input
                id="websiteUrl"
                value={profile.websiteUrl}
                onChange={(e) => setProfile((p) => ({ ...p, websiteUrl: e.target.value }))}
                placeholder="https://yourstore.com"
              />
            </FormField>

            <FormField label="Address" htmlFor="address">
              <Input
                id="address"
                value={profile.address}
                onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))}
                placeholder="1234 Main St"
              />
            </FormField>

            <FormField label="City" htmlFor="city">
              <Input
                id="city"
                value={profile.city}
                onChange={(e) => setProfile((p) => ({ ...p, city: e.target.value }))}
                placeholder="Vancouver"
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

            {profile.country === 'CA' ? (
              <FormField label="Province / Region" htmlFor="province" hint="Used to determine the legal purchasing age for your AI assistant">
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
            ) : (
              <FormField label="State / Region" htmlFor="province">
                <Input
                  id="province"
                  value={profile.province}
                  onChange={(e) => setProfile((p) => ({ ...p, province: e.target.value }))}
                  placeholder="Optional"
                />
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
                <Badge variant={getSubscriptionBadgeVariant(store?.subscriptionStatus)}>
                  {getSubscriptionStatusLabel(store?.subscriptionStatus)}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {[
                  { label: 'Billing provider', value: billingInfo?.configured ? 'Stripe' : 'Not configured' },
                  { label: 'Status', value: getSubscriptionStatusLabel(store?.subscriptionStatus) },
                  {
                    label: 'Renewal date',
                    value: billingInfo?.nextBillingDate || store?.nextBillingDate
                      ? new Date(billingInfo?.nextBillingDate || store.nextBillingDate).toLocaleDateString()
                      : '—',
                  },
                  {
                    label: 'Subscription end',
                    value: billingInfo?.subscriptionEndDate || store?.subscriptionEndDate
                      ? new Date(billingInfo?.subscriptionEndDate || store.subscriptionEndDate).toLocaleDateString()
                      : '—',
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="px-4 py-3.5 rounded-xl bg-canvas border border-line-subtle">
                    <p className="text-muted text-xs mb-1">{label}</p>
                    <p className="text-ink text-sm font-semibold">{value}</p>
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

            <AutoSubscriptionSettings
              billingInfo={billingInfo}
              onUpdated={(result) => {
                setBillingInfo((prev) =>
                  prev
                    ? {
                        ...prev,
                        autoRenew: result.autoRenew !== false,
                        autoRenewUpdatedAt: result.autoRenewUpdatedAt || prev.autoRenewUpdatedAt,
                        nextBillingDate: result.nextBillingDate || prev.nextBillingDate,
                        subscriptionEndDate: result.subscriptionEndDate || prev.subscriptionEndDate,
                      }
                    : prev
                );
              }}
            />

            <Card>
              <CardTitle>Billing History</CardTitle>
              <p className="text-sm text-body mt-3">
                Invoice history is available in the Stripe customer portal after you subscribe.
              </p>
            </Card>
          </div>
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
