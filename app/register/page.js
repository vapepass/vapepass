'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus, Mail, Lock, User, Store, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import GuestGuard from '@/components/GuestGuard';
import Button from '@/components/ui/Button';
import { Input, FormField, InputGroup, InputIcon, InputToggle } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { ApiError, fieldErrorsToMap } from '@/lib/api';

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

function PasswordField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  show,
  onToggle,
  autoComplete,
}) {
  return (
    <FormField label={label} htmlFor={id} error={error} required hint={hint}>
      <InputGroup>
        <InputIcon><Lock size={16} /></InputIcon>
        <Input
          id={id}
          type={show ? 'text' : 'password'}
          autoComplete={autoComplete}
          placeholder="••••••••"
          className="pl-10 pr-11"
          value={value}
          onChange={onChange}
          error={Boolean(error)}
        />
        <InputToggle
          onClick={onToggle}
          label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </InputToggle>
      </InputGroup>
    </FormField>
  );
}

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    storeName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.firstName.trim()) next.firstName = 'First name is required';
    if (!form.lastName.trim()) next.lastName = 'Last name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address';
    if (!form.password) next.password = 'Password is required';
    else if (form.password.length < 8) next.password = 'Password must be at least 8 characters';
    else if (!PASSWORD_RULE.test(form.password)) {
      next.password = 'Password must contain uppercase, lowercase, and a number';
    }
    if (!form.confirmPassword) next.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) next.confirmPassword = 'Passwords do not match';
    if (!form.storeName.trim()) next.storeName = 'Store name is required';
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
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
        storeName: form.storeName.trim(),
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
        icon={UserPlus}
        title="Create your account"
        subtitle="Start your free trial — set up in under 10 minutes"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {errors._form && (
            <p className="text-sm text-danger-600 bg-danger-50 border border-red-200 rounded-xl px-4 py-3" role="alert">
              {errors._form}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="First name" htmlFor="firstName" error={errors.firstName} required>
              <InputGroup>
                <InputIcon><User size={16} /></InputIcon>
                <Input
                  id="firstName"
                  autoComplete="given-name"
                  placeholder="Jane"
                  className="pl-10"
                  value={form.firstName}
                  onChange={set('firstName')}
                  error={Boolean(errors.firstName)}
                />
              </InputGroup>
            </FormField>

            <FormField label="Last name" htmlFor="lastName" error={errors.lastName} required>
              <Input
                id="lastName"
                autoComplete="family-name"
                placeholder="Doe"
                value={form.lastName}
                onChange={set('lastName')}
                error={Boolean(errors.lastName)}
              />
            </FormField>
          </div>

          <FormField label="Email" htmlFor="email" error={errors.email} required>
            <InputGroup>
              <InputIcon><Mail size={16} /></InputIcon>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@store.com"
                className="pl-10"
                value={form.email}
                onChange={set('email')}
                error={Boolean(errors.email)}
              />
            </InputGroup>
          </FormField>

          <PasswordField
            id="password"
            label="Password"
            value={form.password}
            onChange={set('password')}
            error={errors.password}
            hint="At least 8 characters with uppercase, lowercase, and a number"
            show={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
            autoComplete="new-password"
          />

          <PasswordField
            id="confirmPassword"
            label="Confirm password"
            value={form.confirmPassword}
            onChange={set('confirmPassword')}
            error={errors.confirmPassword}
            show={showConfirmPassword}
            onToggle={() => setShowConfirmPassword((v) => !v)}
            autoComplete="new-password"
          />

          <FormField label="Store name" htmlFor="storeName" error={errors.storeName} required>
            <InputGroup>
              <InputIcon><Store size={16} /></InputIcon>
              <Input
                id="storeName"
                placeholder="Cloud Nine Vapes"
                className="pl-10"
                value={form.storeName}
                onChange={set('storeName')}
                error={Boolean(errors.storeName)}
              />
            </InputGroup>
          </FormField>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </Button>

          <p className="text-center text-sm text-body pt-2">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-700">
              Sign in
            </Link>
          </p>
        </form>
      </AuthLayout>
    </GuestGuard>
  );
}
