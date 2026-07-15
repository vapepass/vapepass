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
import { canAccessDashboard } from '@/lib/subscription';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next = {};
    if (!email.trim()) next.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Enter a valid email address';
    if (!password) next.password = 'Password is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const data = await login(email.trim(), password);

      if (data.user?.role === 'admin') {
        router.replace('/admin');
        return;
      }

      const status = data.store?.subscriptionStatus;
      router.replace(canAccessDashboard(status) ? '/dashboard' : '/subscribe');
    } catch (err) {
      if (err instanceof ApiError) {
        const fieldErrors = fieldErrorsToMap(err.errors);
        if (Object.keys(fieldErrors).length) setErrors(fieldErrors);
        else setErrors({ _form: err.message });
      } else {
        setErrors({ _form: 'Unable to sign in. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <GuestGuard>
      <AuthLayout
        title="Sign in to your account"
        subtitle="Welcome back — sign in to continue"
        footer={
          <p className="text-sm text-[#6b7280]">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
              Create account
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                autoComplete="current-password"
                placeholder="••••••••"
                className="pl-10 h-12 rounded-xl"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={Boolean(errors.password)}
              />
            </InputGroup>
          </FormField>

          <div className="flex justify-end -mt-1">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={[
              'w-full h-12 mt-1 text-[15px] font-semibold text-white rounded-xl',
              'bg-brand-600 hover:bg-brand-700 transition-colors duration-200',
              'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-500/30',
              'disabled:opacity-60 disabled:pointer-events-none',
              'select-none touch-manipulation',
            ].join(' ')}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </AuthLayout>
    </GuestGuard>
  );
}
