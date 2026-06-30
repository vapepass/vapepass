'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import GuestGuard from '@/components/GuestGuard';
import { Input, FormField, InputGroup, InputIcon } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { ApiError, fieldErrorsToMap } from '@/lib/api';

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

function deriveNameFromEmail(email) {
  const local = email.split('@')[0] || 'User';
  const parts = local.split(/[._-]/).filter(Boolean);
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

  if (parts.length >= 2) {
    return { firstName: capitalize(parts[0]), lastName: capitalize(parts[1]) };
  }
  return { firstName: capitalize(parts[0] || 'User'), lastName: 'Owner' };
}

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address';
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

    const { firstName, lastName } = deriveNameFromEmail(form.email.trim());

    try {
      await register({
        firstName,
        lastName,
        email: form.email.trim(),
        password: form.password,
      });
      router.push('/setup');
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
    <GuestGuard>
      <AuthLayout
        title="Create your account"
        subtitle="Sign up to get started"
        footer={
          <p className="text-sm text-[#6b7280]">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
              Sign in
            </Link>
          </p>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {errors._form && (
            <p className="text-sm text-danger-600 bg-danger-50 border border-red-200 rounded-xl px-4 py-3" role="alert">
              {errors._form}
            </p>
          )}

          <FormField
            label="Email"
            htmlFor="email"
            error={errors.email}
            required
            className="[&_label]:font-semibold [&_label]:text-[#111827]"
          >
            <InputGroup>
              <InputIcon><Mail size={16} /></InputIcon>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="pl-10 h-12 rounded-xl"
                value={form.email}
                onChange={set('email')}
                error={Boolean(errors.email)}
              />
            </InputGroup>
          </FormField>

          <FormField
            label="Password"
            htmlFor="password"
            error={errors.password}
            required
            className="[&_label]:font-semibold [&_label]:text-[#111827]"
          >
            <InputGroup>
              <InputIcon><Lock size={16} /></InputIcon>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                className="pl-10 h-12 rounded-xl"
                value={form.password}
                onChange={set('password')}
                error={Boolean(errors.password)}
              />
            </InputGroup>
          </FormField>

          <FormField
            label="Confirm Password"
            htmlFor="confirmPassword"
            error={errors.confirmPassword}
            required
            className="[&_label]:font-semibold [&_label]:text-[#111827]"
          >
            <InputGroup>
              <InputIcon><Lock size={16} /></InputIcon>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                className="pl-10 h-12 rounded-xl"
                value={form.confirmPassword}
                onChange={set('confirmPassword')}
                error={Boolean(errors.confirmPassword)}
              />
            </InputGroup>
          </FormField>

          <button
            type="submit"
            disabled={loading}
            className={[
              'w-full h-12 mt-2 text-[15px] font-semibold text-white rounded-xl',
              'bg-brand-600 hover:bg-brand-700 transition-colors duration-200',
              'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-500/30',
              'disabled:opacity-60 disabled:pointer-events-none',
              'select-none touch-manipulation',
            ].join(' ')}
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
      </AuthLayout>
    </GuestGuard>
  );
}
