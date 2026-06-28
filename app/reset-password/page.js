'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, CheckCircle } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import GuestGuard from '@/components/GuestGuard';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { Input, FormField, InputGroup, InputIcon } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { resetPassword } from '@/lib/auth-api';
import { ApiError, fieldErrorsToMap, setToken } from '@/lib/api';

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

function ResetPasswordForm() {
  const router = useRouter();
  const { reloadSession } = useAuth();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next = {};
    if (!password) next.password = 'Password is required';
    else if (password.length < 8) next.password = 'Password must be at least 8 characters';
    else if (!PASSWORD_RULE.test(password)) {
      next.password = 'Password must contain uppercase, lowercase, and a number';
    }
    if (password !== confirmPassword) next.confirmPassword = 'Passwords do not match';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const data = await resetPassword(token, password);
      if (data.accessToken) setToken(data.accessToken);
      await reloadSession();
      setDone(true);
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (err) {
      if (err instanceof ApiError) {
        const fieldErrors = fieldErrorsToMap(err.errors);
        if (Object.keys(fieldErrors).length) setErrors(fieldErrors);
        else setErrors({ _form: err.message });
      } else {
        setErrors({ _form: 'Unable to reset password. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <p className="text-body text-sm">
          This reset link is invalid or has expired. Request a new one from the sign-in page.
        </p>
        <Link
          href="/forgot-password"
          className="inline-block text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          Request new reset link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-success-50 flex items-center justify-center mx-auto">
          <CheckCircle size={24} className="text-success-600" aria-hidden="true" />
        </div>
        <p className="font-semibold text-ink">Password updated</p>
        <p className="text-sm text-body">Redirecting you to the dashboard…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {errors._form && (
        <p className="text-sm text-danger-600 bg-danger-50 border border-red-200 rounded-xl px-4 py-3" role="alert">
          {errors._form}
        </p>
      )}

      <FormField label="New password" htmlFor="password" error={errors.password} required>
        <InputGroup>
          <InputIcon><Lock size={16} /></InputIcon>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            className="pl-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={Boolean(errors.password)}
          />
        </InputGroup>
      </FormField>

      <FormField label="Confirm password" htmlFor="confirmPassword" error={errors.confirmPassword} required>
        <InputGroup>
          <InputIcon><Lock size={16} /></InputIcon>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            className="pl-10"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={Boolean(errors.confirmPassword)}
          />
        </InputGroup>
      </FormField>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Updating…' : 'Reset Password'}
      </Button>
    </form>
  );
}

export default function ResetPassword() {
  return (
    <GuestGuard>
      <AuthLayout
        icon={Lock}
        title="Set new password"
        subtitle="Choose a strong password for your account"
      >
        <Suspense
          fallback={
            <div className="flex justify-center py-8">
              <Spinner size="lg" />
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </AuthLayout>
    </GuestGuard>
  );
}
