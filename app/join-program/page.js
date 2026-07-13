'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Phone, Mail, KeyRound, ShieldCheck } from 'lucide-react';
import Logo from '@/components/Logo';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { Card } from '@/components/ui/Card';
import { Input, InputGroup, InputIcon, FormField } from '@/components/ui/Input';
import { joinProgram, getPublicStore } from '@/lib/public-api';
import { ApiError, fieldErrorsToMap } from '@/lib/api';

function JoinProgramContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeId = searchParams.get('store');

  const [store, setStore] = useState(null);
  const [loadingStore, setLoadingStore] = useState(true);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', phone: '', email: '', code: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (!storeId) {
      setLoadingStore(false);
      return;
    }
    getPublicStore(storeId)
      .then(setStore)
      .catch(() => setStore(null))
      .finally(() => setLoadingStore(false));
  }, [storeId]);

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!form.code.trim()) {
      setErrors({ code: 'Verification code is required' });
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const data = await joinProgram(storeId, {
        code: form.code.trim(),
        fullName: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
      });
      router.push(`/customer-card?id=${data.customer._id}`);
    } catch (err) {
      if (err instanceof ApiError) {
        const fieldErrors = fieldErrorsToMap(err.errors);
        setErrors(Object.keys(fieldErrors).length ? fieldErrors : { _form: err.message });
      } else {
        setErrors({ _form: 'Unable to join program. Please try again.' });
      }
      setSubmitting(false);
    }
  };

  if (loadingStore) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!storeId || !store) {
    return (
      <Card>
        <p className="text-center text-body text-sm">
          Invalid join link. Ask the store for their rewards program QR code or link.
        </p>
      </Card>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center text-center mb-8">
        <Logo size={48} />
        <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight mt-6 mb-2">{store.name}</h1>
        <p className="text-body">Join our rewards program</p>
      </div>

      <Card>
        {errors._form && (
          <p className="text-sm text-danger-600 bg-danger-50 border border-red-200 rounded-xl px-4 py-3 mb-5" role="alert">
            {errors._form}
          </p>
        )}

        {step === 1 && (
          <form
            className="space-y-5 animate-fade-in"
            onSubmit={(e) => {
              e.preventDefault();
              const next = {};
              if (!form.name.trim()) next.name = 'Name is required';
              if (!form.phone.trim()) next.phone = 'Phone is required';
              if (Object.keys(next).length) {
                setErrors(next);
                return;
              }
              setErrors({});
              setStep(2);
            }}
          >
            <div className="px-4 py-3.5 rounded-xl text-sm flex items-center gap-3 bg-brand-50 text-brand-700 border border-brand-100">
              <ShieldCheck size={18} className="flex-shrink-0" aria-hidden="true" />
              Your ID must be verified by staff. Ask for a 6-digit code before continuing.
            </div>

            <FormField label="Full Name" htmlFor="name" error={errors.name} required>
              <InputGroup>
                <InputIcon><User size={16} /></InputIcon>
                <Input id="name" className="pl-10" placeholder="Alex Johnson" value={form.name} onChange={(e) => set('name', e.target.value)} />
              </InputGroup>
            </FormField>

            <FormField label="Phone Number" htmlFor="phone" error={errors.phone} required>
              <InputGroup>
                <InputIcon><Phone size={16} /></InputIcon>
                <Input id="phone" className="pl-10" placeholder="(604) 555-0123" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
              </InputGroup>
            </FormField>

            <FormField label="Email (optional)" htmlFor="email">
              <InputGroup>
                <InputIcon><Mail size={16} /></InputIcon>
                <Input id="email" className="pl-10" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => set('email', e.target.value)} />
              </InputGroup>
            </FormField>

            <Button type="submit" className="w-full">Continue</Button>
          </form>
        )}

        {step === 2 && (
          <form className="space-y-5 animate-fade-in" onSubmit={handleJoin}>
            <p className="text-sm text-body text-center">
              Enter the one-time code your cashier gave you. It expires in 10 minutes.
            </p>

            <FormField label="Verification Code" htmlFor="code" error={errors.code} required>
              <InputGroup>
                <InputIcon><KeyRound size={16} /></InputIcon>
                <Input
                  id="code"
                  className="pl-10 text-center font-mono text-lg tracking-[0.3em]"
                  placeholder="000000"
                  maxLength={6}
                  inputMode="numeric"
                  value={form.code}
                  onChange={(e) => set('code', e.target.value.replace(/\D/g, ''))}
                />
              </InputGroup>
            </FormField>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Creating your card…' : 'Get My Card'}
            </Button>
            <Button type="button" variant="secondary" className="w-full" onClick={() => setStep(1)}>Back</Button>
          </form>
        )}
      </Card>
    </>
  );
}

export default function JoinProgram() {
  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center px-4 py-12 sm:py-16">
      <div className="w-full max-w-md animate-slide-up">
        <Suspense fallback={<div className="flex justify-center py-20"><Spinner size="lg" /></div>}>
          <JoinProgramContent />
        </Suspense>
      </div>
    </div>
  );
}
