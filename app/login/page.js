'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, Mail, Lock } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import GuestGuard from '@/components/GuestGuard';
import Button from '@/components/ui/Button';
import { Input, FormField, InputGroup, InputIcon } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { ApiError, fieldErrorsToMap } from '@/lib/api';

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

      router.replace('/dashboard');
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
        icon={LogIn}
        title="Welcome back"
        subtitle="Sign in to manage your loyalty program"
      >
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {errors._form && (
            <p className="text-sm text-danger-600 bg-danger-50 border border-red-200 rounded-xl px-4 py-3" role="alert">
              {errors._form}
            </p>
          )}

          <FormField label="Email" htmlFor="email" error={errors.email} required>
            <InputGroup>
              <InputIcon><Mail size={16} /></InputIcon>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@store.com"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={Boolean(errors.email)}
              />
            </InputGroup>
          </FormField>

          <FormField label="Password" htmlFor="password" error={errors.password} required>
            <InputGroup>
              <InputIcon><Lock size={16} /></InputIcon>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={Boolean(errors.password)}
              />
            </InputGroup>
          </FormField>

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>

          <p className="text-center text-sm text-body pt-2">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold text-brand-600 hover:text-brand-700">
              Get started
            </Link>
          </p>
        </form>
      </AuthLayout>
    </GuestGuard>
  );
}
