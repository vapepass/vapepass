'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowLeft,
  QrCode,
  Gift,
  Bell,
  Sparkles,
  Users,
  UserCheck,
  Stamp,
  TrendingUp,
  CheckCircle,
  Tag,
  Calendar,
  Bot,
  ShieldCheck,
} from 'lucide-react';
import Logo from '@/components/Logo';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Progress from '@/components/ui/Progress';
import {
  demoStore,
  demoStats,
  demoChartData,
  demoNotifications,
  demoSteps,
} from '@/data/demo';

const TOTAL = demoSteps.length;

function DemoProgressBar({ step }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-muted uppercase tracking-wider">
          Step {step} of {TOTAL}
        </span>
        <span className="text-xs font-medium text-brand-600">{demoSteps[step - 1]?.title}</span>
      </div>
      <div className="h-1.5 rounded-full bg-line overflow-hidden">
        <div
          className="h-full rounded-full gradient-brand transition-all duration-500 ease-[var(--ease-out)]"
          style={{ width: `${(step / TOTAL) * 100}%` }}
          role="progressbar"
          aria-valuenow={step}
          aria-valuemin={1}
          aria-valuemax={TOTAL}
        />
      </div>
      <div className="flex justify-center gap-2 mt-4" aria-hidden="true">
        {demoSteps.map((s) => (
          <div
            key={s.id}
            className={[
              'h-1.5 rounded-full transition-all duration-300',
              s.id === step ? 'w-6 bg-brand-600' : s.id < step ? 'w-1.5 bg-brand-300' : 'w-1.5 bg-line',
            ].join(' ')}
          />
        ))}
      </div>
    </div>
  );
}

function StepWelcome() {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-brand shadow-brand mb-6">
        <Sparkles size={28} className="text-white" aria-hidden="true" />
      </div>
      <h2 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight mb-4">
        See how VapePass works
      </h2>
      <p className="text-body text-lg max-w-lg mx-auto leading-relaxed">
        Take a quick tour and discover how vape shops use AI flavor recommendations
        and built-in compliance — no custom app required.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 text-left">
        {[
          { icon: Bot, label: 'AI Sommelier', desc: 'Personalized flavor recs from live inventory' },
          { icon: ShieldCheck, label: 'Compliance-ready', desc: 'Age gates and warnings built in' },
          { icon: Gift, label: 'Visit rewards', desc: 'Track visits and unlock rewards automatically' },
        ].map(({ icon: Icon, label, desc }) => (
          <div key={label} className="flex items-start gap-3 p-4 rounded-xl bg-brand-50/60 border border-brand-100">
            <div className="w-9 h-9 rounded-lg bg-brand-100 flex items-center justify-center flex-shrink-0">
              <Icon size={18} className="text-brand-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">{label}</p>
              <p className="text-xs text-body mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepQrScan() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-4">
          Customers scan a QR code at your store
        </h2>
        <p className="text-body leading-relaxed mb-6">
          Print a QR code and place it at checkout. When a customer scans it with their phone,
          they&apos;re instantly guided to join your rewards program — no app to download.
        </p>
        <ul className="space-y-3">
          {['Works on any smartphone camera', 'No app store download needed', 'Takes under 30 seconds'].map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-sm text-ink">
              <CheckCircle size={16} className="text-brand-600 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative flex justify-center">
        <div className="absolute inset-0 gradient-brand rounded-3xl blur-3xl opacity-15 scale-110" aria-hidden="true" />
        <Card className="relative w-full max-w-xs !p-8 text-center shadow-lg">
          <div className="relative mx-auto w-48 h-48 rounded-2xl bg-canvas border-2 border-line flex items-center justify-center mb-5">
            {[
              ['top-3 left-3', 'border-t-2 border-l-2'],
              ['top-3 right-3', 'border-t-2 border-r-2'],
              ['bottom-3 left-3', 'border-b-2 border-l-2'],
              ['bottom-3 right-3', 'border-b-2 border-r-2'],
            ].map(([pos, border]) => (
              <div key={pos} className={`absolute ${pos} w-6 h-6 ${border} rounded-sm border-brand-600`} aria-hidden="true" />
            ))}
            <svg viewBox="0 0 100 100" width="120" height="120" aria-label="Sample QR code">
              <rect x="5" y="5" width="30" height="30" rx="2" fill="none" stroke="#7c3aed" strokeWidth="5" />
              <rect x="14" y="14" width="12" height="12" fill="#7c3aed" />
              <rect x="65" y="5" width="30" height="30" rx="2" fill="none" stroke="#7c3aed" strokeWidth="5" />
              <rect x="74" y="14" width="12" height="12" fill="#7c3aed" />
              <rect x="5" y="65" width="30" height="30" rx="2" fill="none" stroke="#7c3aed" strokeWidth="5" />
              <rect x="14" y="74" width="12" height="12" fill="#7c3aed" />
              <rect x="50" y="50" width="6" height="6" fill="#7c3aed" />
              <rect x="60" y="50" width="6" height="6" fill="#7c3aed" />
              <rect x="70" y="50" width="6" height="6" fill="#7c3aed" />
              <rect x="80" y="50" width="6" height="6" fill="#7c3aed" />
              <rect x="50" y="60" width="6" height="6" fill="#7c3aed" />
              <rect x="70" y="60" width="6" height="6" fill="#7c3aed" />
              <rect x="50" y="70" width="6" height="6" fill="#7c3aed" />
              <rect x="60" y="70" width="6" height="6" fill="#7c3aed" />
              <rect x="80" y="70" width="6" height="6" fill="#7c3aed" />
              <rect x="50" y="80" width="6" height="6" fill="#7c3aed" />
              <rect x="70" y="80" width="6" height="6" fill="#7c3aed" />
              <rect x="80" y="80" width="6" height="6" fill="#7c3aed" />
            </svg>
            <div className="absolute inset-x-0 top-1/2 h-0.5 bg-brand-600/60 animate-pulse" aria-hidden="true" />
          </div>
          <p className="text-sm font-medium text-ink">{demoStore.name}</p>
          <p className="text-xs text-muted mt-1">Scan to join rewards program</p>
        </Card>
      </div>
    </div>
  );
}

function StepSommelier() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      <div className="order-2 lg:order-1 flex justify-center">
        <Card className="w-full max-w-sm !p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center">
              <Bot size={20} className="text-white" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">AI Flavor Sommelier</p>
              <p className="text-xs text-muted">Live inventory recommendations</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="rounded-2xl rounded-tl-md bg-canvas border border-line px-4 py-3 text-sm text-body">
              Looking for something fruity with ice?
            </div>
            <div className="rounded-2xl rounded-tr-md bg-brand-50 border border-brand-100 px-4 py-3 text-sm text-ink">
              From our current inventory, you might like: Mango Ice, Guava Frost, or Berry Blast.
            </div>
          </div>
          <p className="text-xs text-muted mt-4 text-center">Demo preview — recommendations use your store&apos;s products only.</p>
        </Card>
      </div>
      <div className="order-1 lg:order-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-4">
          AI Flavor Sommelier on your site
        </h2>
        <p className="text-body leading-relaxed mb-6">
          Embed the chatbot on your storefront. It asks the right questions, enforces age
          verification, and recommends products from your live inventory — never invented SKUs.
        </p>
        <ul className="space-y-3">
          {[
            'Age-gated before any product talk',
            'Synced to Shopify / WooCommerce inventory',
            'Compliant nicotine warnings every session',
          ].map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-sm text-ink">
              <CheckCircle size={16} className="text-brand-600 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StepRewards() {
  const [stamps, setStamps] = useState(6);

  useEffect(() => {
    const interval = setInterval(() => {
      setStamps((s) => (s >= demoStore.stampGoal ? 6 : s + 1));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const earned = stamps >= demoStore.stampGoal;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-4">
          Earn rewards automatically
        </h2>
        <p className="text-body leading-relaxed mb-6">
          Staff scan the customer&apos;s QR at checkout. Visits update in real-time —
          when they hit the goal, the reward unlocks instantly.
        </p>
        <div className="px-4 py-4 rounded-xl bg-brand-50 border border-brand-100 mb-6">
          <p className="text-sm font-semibold text-brand-700">
            Buy {demoStore.stampGoal} vapes, get 1 free
          </p>
          <p className="text-xs text-body mt-1">{demoStore.reward}</p>
        </div>
        <Progress value={stamps} max={demoStore.stampGoal} showLabel size="lg" />
        {earned && (
          <p className="text-sm font-semibold text-warning-600 mt-4 flex items-center gap-2 animate-fade-in">
            <Gift size={16} /> Reward unlocked! Customer gets their free juice.
          </p>
        )}
      </div>

      <Card className="!p-6">
        <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">Live visit counter</p>
        <div className="flex flex-wrap gap-2 mb-6" aria-live="polite" aria-label={`${stamps} of ${demoStore.stampGoal} visits`}>
          {Array.from({ length: demoStore.stampGoal }, (_, i) => (
            <div
              key={i}
              className={[
                'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500',
                i < stamps ? 'bg-brand-600 scale-100 shadow-sm' : 'bg-line-subtle scale-95',
              ].join(' ')}
            >
              {i < stamps && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                  <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 19.771l-7.416 3.642 1.48-8.279L0 9.306l8.332-1.151z" />
                </svg>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-body">Alex Johnson</span>
          <span className="font-bold text-ink tabular-nums">{stamps}/{demoStore.stampGoal}</span>
        </div>
      </Card>
    </div>
  );
}

const statIcons = { users: Users, members: UserCheck, gift: Gift, stamp: Stamp };

function StepAnalytics() {
  const maxCustomers = Math.max(...demoChartData.map((d) => d.customers));

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-3">
          Your analytics dashboard
        </h2>
        <p className="text-body max-w-xl mx-auto">
          Track customers, visits, and redemptions from one place. Demo data shown below — not connected to a real store.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
        {demoStats.map(({ label, value, change, icon }) => {
          const Icon = statIcons[icon] || TrendingUp;
          return (
            <Card key={label} className="!p-4 sm:!p-5" hover={false}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
                  <Icon size={15} className="text-brand-600" />
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-muted uppercase tracking-wide leading-tight">{label}</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-ink tabular-nums">{value}</p>
              <p className="text-xs text-success-600 font-medium mt-1 flex items-center gap-0.5">
                <TrendingUp size={11} /> {change}
              </p>
            </Card>
          );
        })}
      </div>

      <Card className="!p-5 sm:!p-6">
        <p className="text-sm font-semibold text-ink mb-1">Customer Growth</p>
        <p className="text-xs text-muted mb-5">Sample data — last 6 months</p>
        <div className="flex items-end justify-between gap-2 sm:gap-4 h-36">
          {demoChartData.map(({ month, customers }) => (
            <div key={month} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full max-w-[40px] rounded-t-lg gradient-brand transition-all duration-700"
                style={{ height: `${(customers / maxCustomers) * 100}%`, minHeight: '8px' }}
                aria-hidden="true"
              />
              <span className="text-[10px] sm:text-xs text-muted font-medium">{month}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

const notifIcons = { reward: Gift, offer: Tag, reminder: Calendar };

function StepNotifications() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-4">
          Keep customers engaged
        </h2>
        <p className="text-body leading-relaxed mb-6">
          VapePass helps you stay top-of-mind with reward alerts, special offers,
          and visit reminders — so customers come back.
        </p>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-brand-50 border border-brand-100">
          <Bell size={20} className="text-brand-600 flex-shrink-0" />
          <p className="text-sm text-body">
            Stay connected with customers without building a custom mobile app.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {demoNotifications.map((n) => {
          const Icon = notifIcons[n.type] || Bell;
          const styles = {
            reward: 'border-emerald-200 bg-emerald-50/50',
            offer: 'border-brand-200 bg-brand-50/50',
            reminder: 'border-amber-200 bg-amber-50/50',
          };
          return (
            <div
              key={n.id}
              className={[
                'flex gap-3 p-4 rounded-xl border shadow-xs animate-slide-up',
                styles[n.type] || 'border-line bg-surface',
              ].join(' ')}
              style={{ animationDelay: `${n.id * 80}ms` }}
            >
              <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center flex-shrink-0 shadow-xs">
                <Icon size={18} className="text-brand-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-ink">{n.title}</p>
                  <span className="text-[10px] text-muted flex-shrink-0">{n.time}</span>
                </div>
                <p className="text-xs text-body mt-0.5 leading-relaxed">{n.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepCta() {
  return (
    <div className="text-center py-4 sm:py-8">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-brand shadow-brand mb-6">
        <Sparkles size={28} className="text-white" aria-hidden="true" />
      </div>
      <h2 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight mb-4">
        Ready to launch your AI assistant?
      </h2>
      <p className="text-body text-lg max-w-lg mx-auto mb-10">
        Join vape shops using VapePass for compliant AI recommendations and customer rewards.
        Set up in under 10 minutes — no credit card required.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button as={Link} href="/register" size="lg">
          Start Free Trial <ArrowRight size={18} />
        </Button>
        <Button as="a" href="mailto:hello@vapepass.com?subject=Book%20a%20Demo" variant="secondary" size="lg">
          Book a Demo
        </Button>
      </div>
      <p className="text-xs text-muted mt-8">
        <Link href="/" className="text-brand-600 hover:text-brand-700 font-medium">
          ← Back to homepage
        </Link>
      </p>
    </div>
  );
}

const stepComponents = [
  StepWelcome,
  StepQrScan,
  StepSommelier,
  StepRewards,
  StepAnalytics,
  StepNotifications,
  StepCta,
];

export default function DemoTour() {
  const [step, setStep] = useState(1);
  const [animKey, setAnimKey] = useState(0);

  const goTo = (next) => {
    setAnimKey((k) => k + 1);
    setStep(next);
  };

  const next = () => goTo(Math.min(step + 1, TOTAL));
  const prev = () => goTo(Math.max(step - 1, 1));

  const StepContent = stepComponents[step - 1];
  const isFirst = step === 1;
  const isLast = step === TOTAL;

  return (
    <div className="min-h-screen gradient-mesh flex flex-col">
      <header className="sticky top-0 z-50 glass border-b border-line/60">
        <nav className="container-app flex items-center justify-between h-16 max-w-5xl" aria-label="Demo navigation">
          <Logo size={32} showText href="/" />
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs font-medium text-muted px-3 py-1.5 rounded-full bg-canvas border border-line">
              Interactive Demo
            </span>
            <Button as={Link} href="/register" size="sm">
              Get Started
            </Button>
          </div>
        </nav>
      </header>

      <main className="flex-1 container-app max-w-5xl py-8 sm:py-12 flex flex-col">
        <div className="mb-8 sm:mb-10">
          <DemoProgressBar step={step} />
        </div>

        <div
          key={animKey}
          className="flex-1 animate-fade-in"
          role="region"
          aria-label={`Demo step ${step}: ${demoSteps[step - 1]?.title}`}
        >
          <StepContent />
        </div>

        {!isLast && (
          <div className="flex items-center justify-between gap-4 mt-10 sm:mt-12 pt-6 border-t border-line">
            <Button
              variant="secondary"
              onClick={prev}
              disabled={isFirst}
              className={isFirst ? 'invisible' : ''}
            >
              <ArrowLeft size={16} /> Previous
            </Button>
            <Button onClick={next}>
              Next <ArrowRight size={16} />
            </Button>
          </div>
        )}

        {isLast && (
          <div className="flex justify-center mt-6">
            <Button variant="ghost" onClick={prev}>
              <ArrowLeft size={16} /> Back to tour
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
