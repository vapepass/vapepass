'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, ChevronRight } from 'lucide-react';
import Logo from '@/components/Logo';
import AnimateIn from '@/components/AnimateIn';
import BetaApplicationSection from '@/components/BetaApplicationSection';
import SommelierPreview from '@/components/SommelierPreview';
import TwoEnginesSection from '@/components/TwoEnginesSection';
import ComplianceShieldSection from '@/components/ComplianceShieldSection';
import SommelierFeatureSection from '@/components/SommelierFeatureSection';
import PricingSection from '@/components/PricingSection';

const steps = [
  { n: '01', title: 'Create Program', desc: 'Set up your loyalty program with custom rewards and rules.' },
  { n: '02', title: 'Customers Scan', desc: 'Print your QR code. Customers scan to get their digital card.' },
  { n: '03', title: 'Track & Reward', desc: 'Scan customers at checkout. Rewards are tracked automatically.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <AnimateIn
        as="header"
        variant="slide-down"
        immediate
        className="sticky top-0 z-50 bg-[#ede9fe]/95 backdrop-blur-sm border-b border-[#ddd6fe]/60"
      >
        <nav
          className="flex items-center justify-between px-6 md:px-10 lg:px-12 py-3 max-w-[1280px] mx-auto"
          aria-label="Main navigation"
        >
          <Logo size={34} showText variant="sparkle" />
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/login"
              className="text-xs font-medium text-ink hover:text-brand-600 transition-colors duration-150"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-full transition-all duration-200 shadow-sm hover:shadow-brand"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </AnimateIn>

      {/* Hero */}
      <section className="hero-gradient relative overflow-visible pb-0">
        <div className="relative max-w-[800px] w-full mx-auto px-6 pt-12 sm:pt-14 md:pt-16 pb-0 text-center">
          <AnimateIn variant="slide-up" immediate delay={0}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8 sm:mb-9 bg-white/10 text-white border border-white/25">
              <Sparkles size={14} className="text-white flex-shrink-0" aria-hidden="true" />
              The AI-powered vape shop platform
            </div>
          </AnimateIn>

          <AnimateIn variant="slide-up" immediate delay={80}>
            <h1 className="text-[2.5rem] sm:text-[3rem] md:text-[3.5rem] lg:text-[4rem] font-bold leading-[1.1] mb-3 text-white tracking-[-0.03em]">
              Your AI Flavor Sommelier
            </h1>
          </AnimateIn>

          <AnimateIn variant="slide-up" immediate delay={120}>
            <p className="text-[1.375rem] sm:text-[1.625rem] md:text-[1.875rem] lg:text-[2rem] font-semibold leading-[1.2] mb-6 sm:mb-7 text-[#c4b5fd] tracking-[-0.02em]">
              Built for vape retail
            </p>
          </AnimateIn>

          <AnimateIn variant="slide-up" immediate delay={160}>
            <p className="text-white/90 text-[15px] sm:text-base md:text-[17px] max-w-[580px] mx-auto mb-9 sm:mb-10 leading-[1.7] font-normal">
              Give every customer a personalized flavor recommendation the moment they walk in — compliant by design, powered by AI, and connected to your live inventory.
            </p>
          </AnimateIn>

          <AnimateIn variant="slide-up" immediate delay={240}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-10 sm:mb-12 md:mb-14">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 px-7 py-3 text-[15px] font-semibold text-[#6d28d9] bg-white hover:bg-white/95 rounded-full transition-all duration-200 shadow-[0_4px_16px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.14)] min-w-[190px]"
              >
                Start Free Trial
                <ArrowRight size={16} strokeWidth={2} className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
              <Link
                href="/demo"
                className="group inline-flex items-center justify-center gap-2 text-[15px] font-normal text-white hover:text-white/90 transition-colors duration-200"
              >
                <Sparkles size={14} className="text-white" aria-hidden="true" />
                Try the Sommelier now
                <ChevronRight size={16} strokeWidth={2} className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>
          </AnimateIn>

          <AnimateIn variant="slide-up" immediate delay={320} className="relative w-full max-w-[620px] mx-auto text-left">
            <SommelierPreview />
          </AnimateIn>
        </div>

        {/* Spacer so card extends below fold on purple background */}
        <div className="h-16 sm:h-24 md:h-32" aria-hidden="true" />
      </section>

      {/* Floating action button */}
      <Link
        href="/demo"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-brand hero-fab flex items-center justify-center text-white transition-all duration-200 hover:scale-105 hover:brightness-110 active:scale-100"
        aria-label="Try the Sommelier"
      >
        <Sparkles size={22} aria-hidden="true" />
      </Link>

      <TwoEnginesSection />

      <ComplianceShieldSection />

      <SommelierFeatureSection />

      <PricingSection />

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
