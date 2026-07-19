'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Download,
  FileText,
  Handshake,
  Loader2,
  Sparkles,
} from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Input, FormField } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import {
  markHandoverDownloaded,
  openHandoverDocument,
  shouldShowWelcomeOnboarding,
  submitSetupAssistanceRequest,
  updateOnboardingState,
} from '@/lib/onboarding';
import { ApiError, fieldErrorsToMap } from '@/lib/api';

const VIEWS = {
  WELCOME: 'welcome',
  SETUP: 'setup',
  SUCCESS: 'success',
};

function buildDefaultForm(user, store) {
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim();
  return {
    name: name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    storeName: store?.name || '',
    websiteUrl: store?.websiteUrl || store?.productPageUrl || '',
    message: '',
  };
}

function validateForm(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Name is required';
  if (!form.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Enter a valid email address';
  }
  if (!form.phone.trim()) errors.phone = 'Phone number is required';
  if (!form.storeName.trim()) errors.storeName = 'Store name is required';
  if (!form.websiteUrl.trim()) {
    errors.websiteUrl = 'Website URL is required';
  } else {
    try {
      const raw = form.websiteUrl.trim();
      const url = raw.startsWith('http') ? raw : `https://${raw}`;
      if (!new URL(url).hostname) {
        errors.websiteUrl = 'Enter a valid website URL';
      }
    } catch {
      errors.websiteUrl = 'Enter a valid website URL';
    }
  }
  return errors;
}

function OptionCard({ icon: Icon, title, description, children, accent }) {
  return (
    <div className="group relative flex flex-col rounded-2xl border border-line bg-canvas/60 p-5 sm:p-6 transition-all duration-[var(--duration-normal)] hover:border-brand-200 hover:bg-surface hover:shadow-md">
      <div
        className={[
          'mb-4 flex h-12 w-12 items-center justify-center rounded-xl',
          accent === 'brand' ? 'gradient-brand text-white shadow-brand' : 'bg-brand-50 text-brand-600',
        ].join(' ')}
      >
        <Icon size={22} aria-hidden="true" />
      </div>
      <h3 className="font-display text-base font-semibold tracking-tight text-ink sm:text-[17px]">
        {title}
      </h3>
      <div className="mt-2 flex-1 space-y-2 text-sm leading-relaxed text-body">{description}</div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

/**
 * Post-subscription welcome onboarding modal.
 * Mount on the dashboard; visibility is controlled by per-store local state.
 */
export default function WelcomeOnboarding() {
  const { user, store } = useAuth();
  const storeId = store?._id;

  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(VIEWS.WELCOME);
  const [form, setForm] = useState(() => buildDefaultForm(null, null));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!storeId) {
      setReady(true);
      setOpen(false);
      return;
    }

    const show = shouldShowWelcomeOnboarding(storeId, {
      subscriptionStatus: store?.subscriptionStatus,
    });

    // Slight delay so the dashboard paints first — feels premium, not interruptive.
    const timer = setTimeout(() => {
      if (show) {
        setView(VIEWS.WELCOME);
        setOpen(true);
      } else {
        setOpen(false);
      }
      setReady(true);
    }, 380);

    return () => clearTimeout(timer);
  }, [storeId, store?.subscriptionStatus]);

  useEffect(() => {
    if (open && view === VIEWS.SETUP) {
      setForm(buildDefaultForm(user, store));
      setErrors({});
      setSubmitError('');
    }
  }, [open, view, user, store]);

  const modalTitle = useMemo(() => {
    if (view === VIEWS.SETUP) return 'Request Free Setup';
    return null;
  }, [view]);

  const handleClose = () => {
    if (submitting) return;
    // Hide for this Dashboard view only — reappears on next load.
    setOpen(false);
  };

  const handleDownloadHandover = () => {
    openHandoverDocument();
    if (storeId) markHandoverDownloaded(storeId);
  };

  const handleFieldChange = (field) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmitSetup = async (event) => {
    event.preventDefault();
    const nextErrors = validateForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    setSubmitError('');

    try {
      const result = await submitSetupAssistanceRequest({
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        storeName: form.storeName.trim(),
        websiteUrl: form.websiteUrl.trim(),
        message: form.message.trim(),
        storeId,
      });

      if (storeId) {
        updateOnboardingState(storeId, {
          setupRequestedAt: new Date().toISOString(),
          setupRequestId: result.requestId,
          ticketStatus: result.status || 'Pending',
          lastStep: 'setup_request',
        });
      }

      setForm(buildDefaultForm(user, store));
      setErrors({});
      setView(VIEWS.SUCCESS);
    } catch (err) {
      if (err instanceof ApiError && err.errors?.length) {
        setErrors(fieldErrorsToMap(err.errors));
      }
      setSubmitError(err?.message || 'Unable to submit your request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!ready || !open) return null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={modalTitle || undefined}
      description={
        view === VIEWS.SETUP
          ? 'Share a few details and our team will help install VapePass on your website — free of charge.'
          : undefined
      }
      size={view === VIEWS.WELCOME ? '3xl' : 'lg'}
    >
      {view === VIEWS.WELCOME && (
        <div className="-mt-1">
          <div className="relative overflow-hidden rounded-2xl gradient-brand px-5 py-6 sm:px-7 sm:py-7 text-white mb-6 pr-12">
            <div
              className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-white/10 blur-2xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-12 -left-6 h-28 w-28 rounded-full bg-violet-300/20 blur-2xl"
              aria-hidden="true"
            />
            <div className="relative flex items-start gap-3">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                <Sparkles size={22} aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/75">
                  VapePass
                </p>
                <h2 className="font-display mt-1 text-2xl font-bold tracking-tight sm:text-[1.75rem]">
                  Welcome to VapePass!
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/90 sm:text-[15px]">
                  Your subscription has been activated successfully.
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-body sm:text-[15px]">
            You&apos;re now ready to install the VapePass AI Assistant on your website.
            Choose one of the following options to continue.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <OptionCard
              icon={FileText}
              title="Get the Handover Document"
              accent="soft"
              description={
                <>
                  <p>
                    If you already have an in-house developer or web agency, simply download our
                    integration guide and share it with them.
                  </p>
                  <p>
                    The document contains everything needed to install the VapePass chatbot on your
                    website.
                  </p>
                </>
              }
            >
              <Button variant="secondary" className="w-full" onClick={handleDownloadHandover}>
                <Download size={16} /> Download Handover Document
              </Button>
            </OptionCard>

            <OptionCard
              icon={Handshake}
              title="Request Free Setup Assistance"
              accent="brand"
              description={
                <>
                  <p>Don&apos;t have a developer? No problem.</p>
                  <p>
                    Our team will help you install the chatbot on your website completely free of
                    charge.
                  </p>
                  <p>
                    During business hours, one of our support representatives will respond, schedule
                    a meeting if needed, and guide you through the installation process.
                  </p>
                </>
              }
            >
              <Button className="w-full" onClick={() => setView(VIEWS.SETUP)}>
                <Handshake size={16} /> Request Free Setup
              </Button>
            </OptionCard>
          </div>

          <div className="mt-5 flex justify-center">
            <button
              type="button"
              onClick={handleClose}
              className="text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              I&apos;ll do this later
            </button>
          </div>
        </div>
      )}

      {view === VIEWS.SETUP && (
        <form onSubmit={handleSubmitSetup} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Name" htmlFor="setup-name" required error={errors.name}>
              <Input
                id="setup-name"
                name="name"
                autoComplete="name"
                value={form.name}
                onChange={handleFieldChange('name')}
                error={Boolean(errors.name)}
                placeholder="Your full name"
                disabled={submitting}
              />
            </FormField>
            <FormField label="Email" htmlFor="setup-email" required error={errors.email}>
              <Input
                id="setup-email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleFieldChange('email')}
                error={Boolean(errors.email)}
                placeholder="you@store.com"
                disabled={submitting}
              />
            </FormField>
            <FormField label="Phone Number" htmlFor="setup-phone" required error={errors.phone}>
              <Input
                id="setup-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={handleFieldChange('phone')}
                error={Boolean(errors.phone)}
                placeholder="+1 (555) 000-0000"
                disabled={submitting}
              />
            </FormField>
            <FormField
              label="Store Name"
              htmlFor="setup-store"
              required
              error={errors.storeName}
            >
              <Input
                id="setup-store"
                name="storeName"
                value={form.storeName}
                onChange={handleFieldChange('storeName')}
                error={Boolean(errors.storeName)}
                placeholder="Your store name"
                disabled={submitting}
              />
            </FormField>
          </div>

          <FormField
            label="Website URL"
            htmlFor="setup-website"
            required
            error={errors.websiteUrl}
          >
            <Input
              id="setup-website"
              name="websiteUrl"
              type="url"
              inputMode="url"
              value={form.websiteUrl}
              onChange={handleFieldChange('websiteUrl')}
              error={Boolean(errors.websiteUrl)}
              placeholder="https://yourstore.com"
              disabled={submitting}
            />
          </FormField>

          <FormField
            label="Message"
            htmlFor="setup-message"
            hint="Optional — share CMS details, preferred meeting times, or access notes."
          >
            <textarea
              id="setup-message"
              name="message"
              rows={3}
              value={form.message}
              onChange={handleFieldChange('message')}
              disabled={submitting}
              placeholder="Anything that will help us prepare for your install…"
              className={[
                'w-full resize-y rounded-xl border bg-surface px-3.5 py-3 text-sm text-ink',
                'placeholder:text-muted transition-all duration-[var(--duration-fast)]',
                'focus:outline-none focus:ring-[3px]',
                'border-line focus:border-brand-500 focus:ring-brand-500/15',
                'disabled:opacity-50',
              ].join(' ')}
            />
          </FormField>

          {submitError && (
            <p className="rounded-xl border border-red-200 bg-danger-50 px-4 py-3 text-sm text-danger-600" role="alert">
              {submitError}
            </p>
          )}

          <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-between sm:items-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setView(VIEWS.WELCOME)}
              disabled={submitting}
              className="!min-h-10"
            >
              Back
            </Button>
            <Button type="submit" disabled={submitting} className="sm:min-w-[180px]">
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Submitting…
                </>
              ) : (
                'Submit Request'
              )}
            </Button>
          </div>
        </form>
      )}

      {view === VIEWS.SUCCESS && (
        <div className="py-2 text-center sm:py-4">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={28} aria-hidden="true" />
          </div>
          <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
            Your setup request has been submitted successfully.
          </h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-body sm:text-[15px]">
            A confirmation email has been sent to your email address.
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-body sm:text-[15px]">
            Our team will contact you during business hours.
          </p>
          <div className="mt-7 flex justify-center">
            <Button onClick={handleClose}>Continue to Dashboard</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
