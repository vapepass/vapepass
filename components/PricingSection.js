'use client';

import { useState } from 'react';
import { Check, Calendar, ArrowRight } from 'lucide-react';
import AnimateIn from '@/components/AnimateIn';
import { Input, FormField } from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';

const FEATURES_LEFT = [
  'AI Flavor Sommelier',
  'Palate profiling',
  'Customer analytics',
];

const FEATURES_RIGHT = [
  'Compliance engine',
  'Live inventory sync',
  'Full dashboard access',
];

const STORAGE_KEY = 'vapepass_pricing_signups';

const initialForm = {
  storeName: '',
  ownerName: '',
  phone: '',
  startDate: '',
};

export default function PricingSection() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.storeName.trim()) next.storeName = 'Store name is required';
    if (!form.ownerName.trim()) next.ownerName = "Owner's name is required";
    if (!form.phone.trim()) next.phone = 'Phone number is required';
    if (!form.startDate.trim()) next.startDate = 'Please select when you want to start';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const entry = { ...form, submittedAt: new Date().toISOString() };
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, entry]));
      await new Promise((r) => setTimeout(r, 600));
      setSubmitted(true);
      setForm(initialForm);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#f9fafb] py-20 sm:py-24 md:py-28" aria-labelledby="pricing-heading">
      <div className="max-w-[560px] mx-auto px-6">
        <AnimateIn variant="slide-up" className="text-center mb-10 sm:mb-12">
          <h2
            id="pricing-heading"
            className="text-[1.75rem] sm:text-3xl md:text-[2.25rem] font-bold text-[#111827] tracking-[-0.02em] mb-3"
          >
            Simple pricing
          </h2>
          <p className="text-[#6b7280] text-base sm:text-lg">One plan. Everything included.</p>
        </AnimateIn>

        <AnimateIn variant="slide-up" delay={100}>
          <div className="rounded-[18px] sm:rounded-[20px] border border-brand-200 bg-white shadow-[0_4px_24px_rgba(124,58,237,0.08),0_2px_8px_rgba(12,12,18,0.04)] overflow-hidden">
            {/* Price header */}
            <div className="gradient-brand px-8 sm:px-10 py-9 sm:py-10 text-center">
              <div className="flex items-baseline justify-center gap-1 mb-2.5">
                <span className="text-[2.75rem] sm:text-5xl font-bold text-white tracking-[-0.02em]">$100</span>
                <span className="text-white/80 text-lg sm:text-xl font-medium">/month</span>
              </div>
              <p className="text-white/75 text-sm sm:text-[15px]">
                AI Sommelier · Compliance Engine · Full Dashboard
              </p>
            </div>

            {/* Features */}
            <div className="px-8 sm:px-10 py-8 sm:py-9 border-b border-[#f0f1f5]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3.5">
                <ul className="space-y-3.5">
                  {FEATURES_LEFT.map((item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <Check size={16} className="text-brand-600 flex-shrink-0" strokeWidth={2.5} aria-hidden="true" />
                      <span className="text-[#374151] text-[14px] sm:text-[15px]">{item}</span>
                    </li>
                  ))}
                </ul>
                <ul className="space-y-3.5">
                  {FEATURES_RIGHT.map((item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <Check size={16} className="text-brand-600 flex-shrink-0" strokeWidth={2.5} aria-hidden="true" />
                      <span className="text-[#374151] text-[14px] sm:text-[15px]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Signup form */}
            <div className="px-8 sm:px-10 py-8 sm:py-9">
              {submitted ? (
                <div className="text-center py-6 animate-fade-in" role="status">
                  <p className="text-lg font-bold text-[#111827] mb-2">You&apos;re on the list!</p>
                  <p className="text-[#6b7280] text-sm">We&apos;ll reach out shortly to get your store set up.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <h3 className="text-[17px] sm:text-lg font-bold text-[#111827] mb-6 sm:mb-7 tracking-[-0.01em]">
                    Get started — fill out your info
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                    <FormField label="Store Name" htmlFor="storeName" error={errors.storeName} required className="[&_label]:text-[13px] [&_label]:text-[#6b7280] [&_label]:font-normal [&_label]:mb-1.5">
                      <Input
                        id="storeName"
                        placeholder="Cloud Nine Vapes"
                        className="h-11 rounded-lg"
                        value={form.storeName}
                        onChange={set('storeName')}
                        error={Boolean(errors.storeName)}
                      />
                    </FormField>

                    <FormField label="Owner's Name" htmlFor="ownerName" error={errors.ownerName} required className="[&_label]:text-[13px] [&_label]:text-[#6b7280] [&_label]:font-normal [&_label]:mb-1.5">
                      <Input
                        id="ownerName"
                        autoComplete="name"
                        placeholder="Alex Johnson"
                        className="h-11 rounded-lg"
                        value={form.ownerName}
                        onChange={set('ownerName')}
                        error={Boolean(errors.ownerName)}
                      />
                    </FormField>

                    <FormField label="Phone Number" htmlFor="phone" error={errors.phone} required className="[&_label]:text-[13px] [&_label]:text-[#6b7280] [&_label]:font-normal [&_label]:mb-1.5">
                      <Input
                        id="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="(555) 000-0000"
                        className="h-11 rounded-lg"
                        value={form.phone}
                        onChange={set('phone')}
                        error={Boolean(errors.phone)}
                      />
                    </FormField>

                    <FormField label="When do you want to start?" htmlFor="startDate" error={errors.startDate} required className="[&_label]:text-[13px] [&_label]:text-[#6b7280] [&_label]:font-normal [&_label]:mb-1.5">
                      <div className="relative">
                        <Input
                          id="startDate"
                          type="date"
                          placeholder="dd/mm/yyyy"
                          className="h-11 rounded-lg pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                          value={form.startDate}
                          onChange={set('startDate')}
                          error={Boolean(errors.startDate)}
                        />
                        <Calendar
                          size={16}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6b7280] pointer-events-none"
                          aria-hidden="true"
                        />
                      </div>
                    </FormField>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={[
                      'w-full inline-flex items-center justify-center gap-2 h-12 px-6',
                      'text-[15px] font-semibold text-white rounded-full',
                      'gradient-brand shadow-brand',
                      'transition-all duration-200 hover:brightness-110 hover:shadow-lg',
                      'disabled:opacity-70 disabled:pointer-events-none',
                      'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-500/30',
                      'select-none touch-manipulation',
                    ].join(' ')}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="border-white/30 border-t-white" />
                        Submitting…
                      </>
                    ) : (
                      <>
                        Get Started — $100/mo
                        <ArrowRight size={16} aria-hidden="true" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
