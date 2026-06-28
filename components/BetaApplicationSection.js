'use client';

import { useState } from 'react';
import { Bot, Wallet, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input, FormField } from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import AnimateIn from '@/components/AnimateIn';

const STORAGE_KEY = 'vapepass_beta_applications';

const benefits = [
  {
    icon: Bot,
    title: 'AI Flavor Sommelier',
    desc: 'A chatbot that lives on your website and knows your exact inventory. Customers tell it what they usually get and it recommends similar flavors you actually carry. Your store sells products customers never would have found on their own.',
  },
  {
    icon: Wallet,
    title: 'Unlimited Digital Loyalty Cards',
    desc: 'Every customer gets a branded loyalty card in their Apple Wallet. You set the rules — buy 5 get 1 free, buy 8 get 1 free, your choice. No paper. No app. Just scan.',
  },
];

const initialForm = {
  ownerName: '',
  storeName: '',
  phone: '',
  email: '',
  city: '',
  storeAddress: '',
  startDate: '',
};

export default function BetaApplicationSection() {
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
    if (!form.ownerName.trim()) next.ownerName = 'Owner/manager name is required';
    if (!form.storeName.trim()) next.storeName = 'Store name is required';
    if (!form.phone.trim()) next.phone = 'Phone number is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address';
    if (!form.city.trim()) next.city = 'City is required';
    if (!form.storeAddress.trim()) next.storeAddress = 'Store address is required';
    if (!form.startDate.trim()) next.startDate = 'Please tell us when you want to start';
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
      await new Promise((r) => setTimeout(r, 800));
      setSubmitted(true);
      setForm(initialForm);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="early-access" className="py-20 sm:py-24 bg-white" aria-labelledby="beta-heading">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section header */}
        <AnimateIn variant="slide-up" className="text-center mb-14 sm:mb-16">
          <h2
            id="beta-heading"
            className="text-3xl sm:text-4xl font-bold text-[#111827] tracking-tight mb-4 max-w-3xl mx-auto leading-tight"
          >
            Apply for a 10-Day Free Beta Placement — Limited Spots Only
          </h2>
          <p className="text-[#6b7280] text-lg leading-relaxed max-w-2xl mx-auto">
            We&apos;re accepting a small number of founding stores right now. One store per area. Exclusive early access only.
          </p>
        </AnimateIn>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10 sm:mb-12">
          {benefits.map(({ icon: Icon, title, desc }, i) => (
            <AnimateIn key={title} variant="slide-up" delay={i * 100}>
              <Card hover className="h-full bg-white shadow-sm">
                <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center mb-5 shadow-brand">
                  <Icon size={22} className="text-white" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-lg text-ink mb-2 tracking-tight">{title}</h3>
                <p className="text-body text-sm leading-relaxed">{desc}</p>
              </Card>
            </AnimateIn>
          ))}
        </div>

        {/* Guarantee */}
        <AnimateIn variant="fade-in" delay={120}>
          <div className="rounded-2xl bg-brand-50 border border-brand-200 p-6 sm:p-7 mb-10 sm:mb-12">
            <div className="flex gap-4 items-start">
              <div className="w-11 h-11 rounded-xl bg-brand-100 flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={22} className="text-brand-600" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-ink mb-2 tracking-tight">Our Guarantee</h3>
                <p className="text-body text-sm sm:text-base leading-relaxed">
                  Try VapePass free for 10 days. After that it&apos;s $99/month. If you don&apos;t love it after your first month you don&apos;t pay. Zero risk.
                </p>
              </div>
            </div>
          </div>
        </AnimateIn>

        {/* Application form */}
        <AnimateIn variant="scale-in" delay={160}>
          <div className="rounded-2xl border border-line bg-white p-6 sm:p-8 shadow-sm">
            {submitted ? (
              <div className="text-center py-10 sm:py-12 animate-fade-in" role="status">
                <div className="w-14 h-14 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 size={28} className="text-brand-600" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-ink mb-2 tracking-tight">Application received!</h3>
                <p className="text-body text-sm sm:text-base max-w-md mx-auto">
                  Thank you for applying. We&apos;ll review your store and reach out shortly about your exclusive beta placement.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField label="Owner/Manager Name" htmlFor="ownerName" error={errors.ownerName} required>
                    <Input
                      id="ownerName"
                      autoComplete="name"
                      placeholder="Alex Johnson"
                      className="h-12 text-base"
                      value={form.ownerName}
                      onChange={set('ownerName')}
                      error={Boolean(errors.ownerName)}
                    />
                  </FormField>

                  <FormField label="Store Name" htmlFor="storeName" error={errors.storeName} required>
                    <Input
                      id="storeName"
                      placeholder="Cloud Nine Vapes"
                      className="h-12 text-base"
                      value={form.storeName}
                      onChange={set('storeName')}
                      error={Boolean(errors.storeName)}
                    />
                  </FormField>

                  <FormField label="Phone Number" htmlFor="phone" error={errors.phone} required>
                    <Input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="(555) 123-4567"
                      className="h-12 text-base"
                      value={form.phone}
                      onChange={set('phone')}
                      error={Boolean(errors.phone)}
                    />
                  </FormField>

                  <FormField label="Email" htmlFor="email" error={errors.email} required>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@store.com"
                      className="h-12 text-base"
                      value={form.email}
                      onChange={set('email')}
                      error={Boolean(errors.email)}
                    />
                  </FormField>

                  <FormField label="City" htmlFor="city" error={errors.city} required>
                    <Input
                      id="city"
                      autoComplete="address-level2"
                      placeholder="Austin"
                      className="h-12 text-base"
                      value={form.city}
                      onChange={set('city')}
                      error={Boolean(errors.city)}
                    />
                  </FormField>

                  <FormField label="When Do You Want To Start" htmlFor="startDate" error={errors.startDate} required>
                    <Input
                      id="startDate"
                      placeholder="e.g. ASAP, March 2026"
                      className="h-12 text-base"
                      value={form.startDate}
                      onChange={set('startDate')}
                      error={Boolean(errors.startDate)}
                    />
                  </FormField>
                </div>

                <FormField label="Store Address" htmlFor="storeAddress" error={errors.storeAddress} required>
                  <Input
                    id="storeAddress"
                    autoComplete="street-address"
                    placeholder="123 Main St, Suite 100"
                    className="h-12 text-base"
                    value={form.storeAddress}
                    onChange={set('storeAddress')}
                    error={Boolean(errors.storeAddress)}
                  />
                </FormField>

                <button
                  type="submit"
                  disabled={loading}
                  className={[
                    'w-full inline-flex items-center justify-center gap-2 h-12 px-6',
                    'text-[15px] font-semibold text-white rounded-full',
                    'gradient-brand shadow-brand',
                    'transition-all duration-[var(--duration-normal)] ease-[var(--ease-out)]',
                    'hover:brightness-110 hover:shadow-lg hover:-translate-y-0.5',
                    'active:translate-y-0 active:brightness-100',
                    'disabled:opacity-70 disabled:pointer-events-none disabled:transform-none',
                    'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-500/30',
                    'select-none touch-manipulation min-h-[44px]',
                  ].join(' ')}
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" className="border-white/30 border-t-white" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      Apply for Exclusive Beta Access
                      <ArrowRight size={18} aria-hidden="true" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
