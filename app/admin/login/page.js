'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Mail, Lock } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import AdminGuestGuard from '@/components/AdminGuestGuard';
import Button from '@/components/ui/Button';
import { Input, FormField, InputGroup, InputIcon } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { ApiError, fieldErrorsToMap } from '@/lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, logout } = useAuth();
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

      if (data.user?.role !== 'admin') {
        await logout('/login');
        setErrors({
          _form: 'This account is not an admin. Please use the store sign-in page instead.',
        });
        return;
      }

      router.replace('/admin');
    } catch (err) {
      if (err instanceof ApiError) {
        const fieldErrors = fieldErrorsToMap(err.errors);
        if (Object.keys(fieldErrors).length) setErrors(fieldErrors);
        else setErrors({ _form: err.message });
      } else {
        setErrors({ _form: 'Unable to sign in. Please try again.' });
      }
      setLoading(false);
    }
  };

  return (
    <AdminGuestGuard>
      <AuthLayout
        icon={Shield}
        title="Admin sign in"
        subtitle="Platform administration for VapePass"
      >
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {errors._form && (
            <p className="text-sm text-danger-600 bg-danger-50 border border-red-200 rounded-xl px-4 py-3" role="alert">
              {errors._form}
            </p>
          )}

          <FormField label="Admin email" htmlFor="admin-email" error={errors.email} required>
            <InputGroup>
              <InputIcon><Mail size={16} /></InputIcon>
              <Input
                id="admin-email"
                type="email"
                autoComplete="email"
                placeholder="admin@vapepass.com"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={Boolean(errors.email)}
              />
            </InputGroup>
          </FormField>

          <FormField label="Password" htmlFor="admin-password" error={errors.password} required>
            <InputGroup>
              <InputIcon><Lock size={16} /></InputIcon>
              <Input
                id="admin-password"
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

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in to Admin'}
          </Button>

          <p className="text-center text-sm text-body pt-2">
            Store owner?{' '}
            <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-700">
              Sign in here
            </Link>
          </p>
        </form>
      </AuthLayout>
    </AdminGuestGuard>
  );
}
