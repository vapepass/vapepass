'use client';

import Link from 'next/link';
import { QrCode, Smartphone, Gift, Zap, ArrowRight, Star } from 'lucide-react';
import Logo from '@/components/Logo';
import { Card } from '@/components/ui/Card';
import AnimateIn from '@/components/AnimateIn';
import BetaApplicationSection from '@/components/BetaApplicationSection';

const features = [
  { icon: QrCode, title: 'QR Scan to Join', desc: 'Customers scan a code and instantly get their digital loyalty card. No app download needed.' },
  { icon: Smartphone, title: 'Wallet Integration', desc: 'Cards live in Apple Wallet and Google Wallet. Always accessible, never lost.' },
  { icon: Gift, title: 'Automatic Rewards', desc: 'Track visits or points automatically. Customers see progress update in real-time.' },
  { icon: Zap, title: 'Setup in Minutes', desc: 'Create your loyalty program and start scanning customers in under 10 minutes.' },
];

const steps = [
  { n: '01', title: 'Create Program', desc: 'Set up your loyalty program with custom rewards and rules.' },
  { n: '02', title: 'Customers Scan', desc: 'Print your QR code. Customers scan to get their digital card.' },
  { n: '03', title: 'Track & Reward', desc: 'Scan customers at checkout. Rewards are tracked automatically.' },
];

const FILLED_STAMPS = 7;
const TOTAL_STAMPS = 10;

function QrPlaceholder() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">
      <rect x="5" y="5" width="30" height="30" rx="2" fill="none" stroke="black" strokeWidth="7" />
      <rect x="14" y="14" width="12" height="12" fill="black" />
      <rect x="65" y="5" width="30" height="30" rx="2" fill="none" stroke="black" strokeWidth="7" />
      <rect x="74" y="14" width="12" height="12" fill="black" />
      <rect x="5" y="65" width="30" height="30" rx="2" fill="none" stroke="black" strokeWidth="7" />
      <rect x="14" y="74" width="12" height="12" fill="black" />
      <rect x="50" y="50" width="8" height="8" fill="black" />
      <rect x="62" y="50" width="8" height="8" fill="black" />
      <rect x="74" y="50" width="8" height="8" fill="black" />
      <rect x="86" y="50" width="8" height="8" fill="black" />
      <rect x="50" y="62" width="8" height="8" fill="black" />
      <rect x="74" y="62" width="8" height="8" fill="black" />
      <rect x="50" y="74" width="8" height="8" fill="black" />
      <rect x="62" y="74" width="8" height="8" fill="black" />
      <rect x="86" y="74" width="8" height="8" fill="black" />
      <rect x="50" y="86" width="8" height="8" fill="black" />
      <rect x="74" y="86" width="8" height="8" fill="black" />
      <rect x="86" y="86" width="8" height="8" fill="black" />
    </svg>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Sticky header — outside hero so it spans full scroll */}
      <AnimateIn as="header" variant="slide-down" immediate className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#e8e9ef]">
        <nav
          className="flex items-center justify-between px-6 md:px-10 py-3 max-w-7xl mx-auto"
          aria-label="Main navigation"
        >
          <Logo size={32} showText />
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href="/login"
              className="text-xs font-medium text-ink hover:text-brand-600 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-full transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </AnimateIn>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-12 md:pt-16 pb-14 text-center">
        <AnimateIn variant="slide-up" immediate delay={0}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8 bg-[#f0ebfd] text-brand-600">
            <Star size={14} fill="#7c3aed" color="#7c3aed" aria-hidden="true" />
            Digital loyalty cards for vape shops
          </div>
        </AnimateIn>

        <AnimateIn variant="slide-up" immediate delay={80}>
          <h1 className="text-[2.75rem] sm:text-5xl md:text-[3.5rem] font-extrabold leading-[1.1] mb-7 text-ink tracking-tight">
            Replace paper punch cards
            <br />
            <span className="text-brand-600">with digital passes</span>
          </h1>
        </AnimateIn>

        <AnimateIn variant="slide-up" immediate delay={160}>
          <p className="text-body text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Customers scan a QR code, add a loyalty card to their phone wallet, and track rewards — no app download required. Set up in under 10 minutes.
          </p>
        </AnimateIn>

        <AnimateIn variant="slide-up" immediate delay={240}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-[26px] py-3 text-[15px] font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-full transition-colors shadow-sm min-w-[200px]"
            >
              Start Free Trial <ArrowRight size={16} />
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center justify-center px-[26px] py-3 text-[15px] font-semibold text-ink bg-white border-[1.5px] border-[#e5e5ec] hover:bg-[#fafafa] hover:border-[#d4d4dc] rounded-full transition-colors min-w-[200px]"
            >
              See Demo
            </Link>
          </div>
        </AnimateIn>
      </section>

      {/* Wallet preview + features intro */}
      <section className="bg-[#f9fafb] pt-2 pb-20 sm:pb-24">
        <div className="max-w-[480px] mx-auto px-6 mb-14 sm:mb-16">
          <AnimateIn variant="scale-in">
            <div
              className="relative rounded-[24px] p-5 sm:p-6 text-left overflow-hidden shadow-[0_20px_40px_rgba(91,33,182,0.16),0_6px_12px_rgba(91,33,182,0.08)]"
              style={{ background: 'linear-gradient(145deg, #9f7aea 0%, #7c3aed 45%, #5b21b6 100%)' }}
            >
              <div className="absolute -top-14 -left-14 w-36 h-36 rounded-full bg-white/10" aria-hidden="true" />
              <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-white/[0.07]" aria-hidden="true" />
              <div className="absolute top-6 right-6 w-24 h-24 rounded-full bg-white/[0.06]" aria-hidden="true" />

              <div className="flex items-start justify-between mb-4 relative">
                <div>
                  <p className="text-white font-bold text-base sm:text-lg tracking-tight">Cloud Nine Vapes</p>
                  <p className="text-white/70 text-xs mt-0.5">VIP Loyalty Card</p>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold text-white bg-white/20">
                  <Gift size={11} aria-hidden="true" /> 1 reward
                </div>
              </div>

              <div className="flex justify-between mb-5 relative" aria-hidden="true">
                {Array.from({ length: TOTAL_STAMPS }, (_, i) => (
                  <AnimateIn
                    key={i}
                    variant="scale-in"
                    delay={120 + i * 40}
                    className={[
                      'w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0',
                      i < FILLED_STAMPS
                        ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.55),0_0_6px_rgba(124,58,237,0.35)]'
                        : 'bg-purple-400/25',
                    ].join(' ')}
                  >
                    {i < FILLED_STAMPS && (
                      <Star size={13} fill="#7c3aed" color="#7c3aed" aria-hidden="true" />
                    )}
                  </AnimateIn>
                ))}
              </div>

              <div className="flex items-end justify-between relative">
                <div>
                  <p className="text-white/70 text-xs">7 / 10 visits</p>
                  <p className="text-white font-bold text-base mt-0.5">Alex Johnson</p>
                </div>
                <div className="w-[72px] h-[72px] rounded-xl bg-white p-1.5 flex-shrink-0">
                  <QrPlaceholder />
                </div>
              </div>
            </div>
          </AnimateIn>
        </div>

        <AnimateIn variant="slide-up" className="text-center px-6 max-w-3xl mx-auto mb-14 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] tracking-tight mb-4">
            Everything you need, nothing you don&apos;t
          </h2>
          <p className="text-[#6b7280] text-lg leading-relaxed">
            The simplest way to run a loyalty program. No complexity, no learning curve.
          </p>
        </AnimateIn>

        <div className="container-app max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <AnimateIn key={title} variant="slide-up" delay={i * 80}>
                <Card hover className="group bg-white h-full">
                  <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center mb-5 group-hover:bg-brand-100 transition-colors">
                    <Icon size={20} className="text-brand-600" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-lg text-ink mb-2 tracking-tight">{title}</h3>
                  <p className="text-body text-sm leading-relaxed">{desc}</p>
                </Card>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      <div className="gradient-mesh">
        {/* How it works */}
        <section className="py-24 sm:py-28 bg-[#f9fafb]">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <AnimateIn variant="slide-up">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] tracking-tight mb-14 sm:mb-16">
                How it works
              </h2>
            </AnimateIn>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-14 md:gap-20">
              {steps.map(({ n, title, desc }, i) => (
                <AnimateIn key={n} variant="slide-up" delay={i * 100}>
                  <div>
                    <div className="w-14 h-14 rounded-xl bg-[#7c3aed] flex items-center justify-center mx-auto mb-5 font-bold text-base text-white">
                      {n}
                    </div>
                    <h3 className="font-bold text-lg text-[#111827] mb-3 tracking-tight">{title}</h3>
                    <p className="text-[#6b7280] text-sm leading-relaxed max-w-[210px] mx-auto">{desc}</p>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>

        {/* Member Portal / Early Access */}
        <BetaApplicationSection />

        {/* CTA */}
        <section className="container-app max-w-7xl pb-20">
          <AnimateIn variant="slide-up">
            <div className="rounded-3xl gradient-brand p-10 sm:p-14 text-center text-white shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" aria-hidden="true" />
              <div className="relative">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Ready to go digital?</h2>
                <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">
                  Join hundreds of vape shops replacing paper cards with wallet passes.
                </p>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 text-base font-semibold rounded-xl bg-white text-brand-700 hover:bg-white/90 border-0 transition-all select-none touch-manipulation min-h-[44px]"
                >
                  Start your free trial <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </AnimateIn>
        </section>

        {/* Footer */}
        <AnimateIn as="footer" variant="fade-in" className="border-t border-line bg-surface">
          <div className="container-app max-w-7xl py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Logo size={28} showText />
            <p className="text-body text-sm">© 2025 VapePass. All rights reserved.</p>
          </div>
        </AnimateIn>
      </div>
    </div>
  );
}
