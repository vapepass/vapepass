'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Store, Gift, Palette, Link2, MapPin } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import AuthGuard from '@/components/AuthGuard';
import Button from '@/components/ui/Button';
import { Input, FormField } from '@/components/ui/Input';
import WalletPassPreview from '@/components/WalletPassPreview';
import { useAuth } from '@/context/AuthContext';
import { formToStorePayload, CANADIAN_PROVINCES, COUNTRY_OPTIONS } from '@/lib/store-utils';
import { ApiError, fieldErrorsToMap } from '@/lib/api';

const BRAND_COLORS = ['#6C3CE1', '#2563EB', '#059669', '#DC2626', '#D97706', '#111827'];

export default function Setup() {
  const router = useRouter();
  const { store, updateStore } = useAuth();
  const [form, setForm] = useState({
    storeName: '',
    brandColor: '#6C3CE1',
    rewardDescription: '',
    stampGoal: '10',
    productPageUrl: '',
    country: 'CA',
    province: 'BC',
    address: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (store) {
      setForm({
        storeName: store.name || '',
        brandColor: store.brandColor || '#6C3CE1',
        rewardDescription: store.rewardDescription || '',
        stampGoal: String(store.stampGoal ?? 10),
        productPageUrl: store.productPageUrl || '',
        country: store.country || 'CA',
        province: store.province || 'BC',
        address: store.address || '',
      });
    }
  }, [store]);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await updateStore(formToStorePayload(form));
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof ApiError) {
        const fieldErrors = fieldErrorsToMap(err.errors);
        if (Object.keys(fieldErrors).length) setErrors(fieldErrors);
        else setErrors({ _form: err.message });
      } else {
        setErrors({ _form: 'Unable to save store settings. Please try again.' });
      }
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <AuthLayout
        icon={Store}
        title="Set up your store"
        subtitle="Customize your loyalty card and connect your product page for the AI Assistant"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors._form && (
            <p className="text-sm text-danger-600 bg-danger-50 border border-red-200 rounded-xl px-4 py-3" role="alert">
              {errors._form}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <FormField label="Store name" htmlFor="storeName" error={errors.name} required>
                <Input
                  id="storeName"
                  value={form.storeName}
                  onChange={set('storeName')}
                  error={Boolean(errors.name)}
                />
              </FormField>

              <FormField label="Brand color" htmlFor="brandColor" error={errors.brandColor}>
                <div className="flex flex-wrap gap-2 mb-3">
                  {BRAND_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, brandColor: color }))}
                      className={[
                        'w-9 h-9 rounded-full border-2 transition-transform hover:scale-110',
                        form.brandColor === color ? 'border-ink ring-2 ring-offset-2 ring-brand-500' : 'border-transparent',
                      ].join(' ')}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
                <Input
                  id="brandColor"
                  value={form.brandColor}
                  onChange={set('brandColor')}
                  placeholder="#6C3CE1"
                  error={Boolean(errors.brandColor)}
                />
              </FormField>

              <FormField label="Reward description" htmlFor="rewardDescription" error={errors.rewardDescription} required>
                <Input
                  id="rewardDescription"
                  value={form.rewardDescription}
                  onChange={set('rewardDescription')}
                  error={Boolean(errors.rewardDescription)}
                />
              </FormField>

              <FormField label="Stamps to earn reward" htmlFor="stampGoal" error={errors.stampGoal} required>
                <Input
                  id="stampGoal"
                  type="number"
                  min={1}
                  max={50}
                  value={form.stampGoal}
                  onChange={set('stampGoal')}
                  error={Boolean(errors.stampGoal)}
                />
              </FormField>

              <FormField
                label="Store website URL"
                htmlFor="productPageUrl"
                error={errors.productPageUrl}
                hint="We scrape Shopify/WooCommerce inventory for the AI Assistant"
              >
                <div className="relative">
                  <Link2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                  <Input
                    id="productPageUrl"
                    type="url"
                    className="pl-9"
                    value={form.productPageUrl}
                    onChange={set('productPageUrl')}
                    placeholder="https://yourstore.com"
                    error={Boolean(errors.productPageUrl)}
                  />
                </div>
              </FormField>

              <FormField label="Store location" htmlFor="country" hint="Determines the legal age for your AI assistant">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select
                    id="country"
                    value={form.country}
                    onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value, province: '' }))}
                    className="w-full h-11 px-3 rounded-xl border border-line-subtle bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {COUNTRY_OPTIONS.map(({ code, label }) => (
                      <option key={code} value={code}>{label}</option>
                    ))}
                  </select>
                  {form.country === 'CA' ? (
                    <select
                      id="province"
                      value={form.province}
                      onChange={set('province')}
                      className="w-full h-11 px-3 rounded-xl border border-line-subtle bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      {CANADIAN_PROVINCES.map(({ code, label }) => (
                        <option key={code} value={code}>{label}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="flex items-center gap-2 text-sm text-muted px-1">
                      <MapPin size={14} /> Legal age: 21+
                    </p>
                  )}
                </div>
              </FormField>
            </div>

            <div className="flex flex-col items-center justify-center">
              <p className="text-xs font-medium text-muted uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Palette size={12} /> Live preview
              </p>
              <WalletPassPreview
                store={{
                  name: form.storeName,
                  color: form.brandColor,
                  reward: form.rewardDescription,
                  stampGoal: parseInt(form.stampGoal, 10) || 10,
                  stamps: 3,
                  customerName: 'Alex Johnson',
                }}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Saving…' : (
              <>
                <Gift size={16} /> Launch Dashboard
              </>
            )}
          </Button>
        </form>
      </AuthLayout>
    </AuthGuard>
  );
}
