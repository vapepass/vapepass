'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Store, User, Phone, Globe, MapPin } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import GuestGuard from '@/components/GuestGuard';
import { Input, FormField, InputGroup, InputIcon } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { ApiError, fieldErrorsToMap } from '@/lib/api';
import { CANADIAN_PROVINCES, COUNTRY_OPTIONS } from '@/lib/store-utils';

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

const INITIAL = {
  storeName: '',
  ownerName: '',
  phone: '',
  email: '',
  websiteUrl: '',
  country: 'CA',
  province: 'BC',
  city: '',
  address: '',
  subscriptionPlan: 'pro',
  password: '',
  confirmPassword: '',
};

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.storeName.trim()) next.storeName = 'Store name is required';
    if (!form.ownerName.trim()) next.ownerName = 'Owner name is required';
    if (!form.phone.trim()) next.phone = 'Phone number is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address';
    if (!form.websiteUrl.trim()) next.websiteUrl = 'Website URL is required';
    if (!form.country.trim()) next.country = 'Country is required';
    if (form.country === 'CA' && !form.province.trim()) next.province = 'Province is required';
    if (!form.city.trim()) next.city = 'City is required';
    if (!form.address.trim()) next.address = 'Address is required';
    if (!form.password) next.password = 'Password is required';
    else if (form.password.length < 8) next.password = 'Password must be at least 8 characters';
    else if (!PASSWORD_RULE.test(form.password)) {
      next.password = 'Password must contain uppercase, lowercase, and a number';
    }
    if (!form.confirmPassword) next.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) next.confirmPassword = 'Passwords do not match';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      await register({
        storeName: form.storeName.trim(),
        ownerName: form.ownerName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        websiteUrl: form.websiteUrl.trim(),
        country: form.country,
        province: form.country === 'CA' ? form.province : null,
        city: form.city.trim(),
        address: form.address.trim(),
        subscriptionPlan: form.subscriptionPlan,
        password: form.password,
      });
      router.push('/subscribe');
    } catch (err) {
      if (err instanceof ApiError) {
        const fieldErrors = fieldErrorsToMap(err.errors);
        if (Object.keys(fieldErrors).length) setErrors(fieldErrors);
        else setErrors({ _form: err.message });
      } else {
        setErrors({ _form: 'Registration failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <GuestGuard redirectTo="/subscribe">
      <AuthLayout
        title="Create your store account"
        subtitle="Sign up, subscribe, then unlock your dashboard"
        footer={
          <p className="text-sm text-[#6b7280]">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
              Sign in
            </Link>
          </p>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {errors._form && (
            <p className="text-sm text-danger-600 bg-danger-50 border border-red-200 rounded-xl px-4 py-3" role="alert">
              {errors._form}
            </p>
          )}

          <FormField label="Store Name" htmlFor="storeName" error={errors.storeName}>
            <InputGroup>
              <InputIcon><Store size={16} /></InputIcon>
              <Input id="storeName" value={form.storeName} onChange={set('storeName')} placeholder="Vape City" hasIcon error={errors.storeName} />
            </InputGroup>
          </FormField>

          <FormField label="Owner Name" htmlFor="ownerName" error={errors.ownerName}>
            <InputGroup>
              <InputIcon><User size={16} /></InputIcon>
              <Input id="ownerName" value={form.ownerName} onChange={set('ownerName')} placeholder="Alex Smith" hasIcon error={errors.ownerName} />
            </InputGroup>
          </FormField>

          <FormField label="Phone Number" htmlFor="phone" error={errors.phone}>
            <InputGroup>
              <InputIcon><Phone size={16} /></InputIcon>
              <Input id="phone" type="tel" value={form.phone} onChange={set('phone')} placeholder="+1 604 555 0100" hasIcon error={errors.phone} />
            </InputGroup>
          </FormField>

          <FormField label="Email" htmlFor="email" error={errors.email}>
            <InputGroup>
              <InputIcon><Mail size={16} /></InputIcon>
              <Input id="email" type="email" autoComplete="email" value={form.email} onChange={set('email')} placeholder="you@store.com" hasIcon error={errors.email} />
            </InputGroup>
          </FormField>

          <FormField
            label="Website URL"
            htmlFor="websiteUrl"
            error={errors.websiteUrl}
            hint="Saved for your embed script domain. Inventory sync starts later from the dashboard."
          >
            <InputGroup>
              <InputIcon><Globe size={16} /></InputIcon>
              <Input id="websiteUrl" value={form.websiteUrl} onChange={set('websiteUrl')} placeholder="https://yourstore.com" hasIcon error={errors.websiteUrl} />
            </InputGroup>
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Country" htmlFor="country" error={errors.country}>
              <select
                id="country"
                value={form.country}
                onChange={set('country')}
                className="w-full h-11 rounded-xl border border-line bg-white px-3 text-sm text-ink"
              >
                {COUNTRY_OPTIONS.map((c) => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
            </FormField>

            {form.country === 'CA' ? (
              <FormField label="Province / Region" htmlFor="province" error={errors.province}>
                <select
                  id="province"
                  value={form.province}
                  onChange={set('province')}
                  className="w-full h-11 rounded-xl border border-line bg-white px-3 text-sm text-ink"
                >
                  {CANADIAN_PROVINCES.map((p) => (
                    <option key={p.code} value={p.code}>{p.label}</option>
                  ))}
                </select>
              </FormField>
            ) : (
              <FormField label="State / Region" htmlFor="province" error={errors.province}>
                <Input id="province" value={form.province} onChange={set('province')} placeholder="Optional" />
              </FormField>
            )}
          </div>

          <FormField label="City" htmlFor="city" error={errors.city}>
            <InputGroup>
              <InputIcon><MapPin size={16} /></InputIcon>
              <Input id="city" value={form.city} onChange={set('city')} placeholder="Vancouver" hasIcon error={errors.city} />
            </InputGroup>
          </FormField>

          <FormField label="Address" htmlFor="address" error={errors.address}>
            <Input id="address" value={form.address} onChange={set('address')} placeholder="123 Main Street" error={errors.address} />
          </FormField>

          <FormField label="Subscription Plan" htmlFor="subscriptionPlan">
            <select
              id="subscriptionPlan"
              value={form.subscriptionPlan}
              onChange={set('subscriptionPlan')}
              className="w-full h-11 rounded-xl border border-line bg-white px-3 text-sm text-ink"
            >
              <option value="pro">Pro — $99/month</option>
            </select>
          </FormField>

          <FormField label="Password" htmlFor="password" error={errors.password}>
            <InputGroup>
              <InputIcon><Lock size={16} /></InputIcon>
              <Input id="password" type="password" autoComplete="new-password" value={form.password} onChange={set('password')} hasIcon error={errors.password} />
            </InputGroup>
          </FormField>

          <FormField label="Confirm Password" htmlFor="confirmPassword" error={errors.confirmPassword}>
            <InputGroup>
              <InputIcon><Lock size={16} /></InputIcon>
              <Input id="confirmPassword" type="password" autoComplete="new-password" value={form.confirmPassword} onChange={set('confirmPassword')} hasIcon error={errors.confirmPassword} />
            </InputGroup>
          </FormField>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-full bg-brand-600 text-white font-semibold hover:bg-brand-700 disabled:opacity-60 transition-colors"
          >
            {loading ? 'Creating account…' : 'Continue to subscription'}
          </button>
        </form>
      </AuthLayout>
    </GuestGuard>
  );
}
