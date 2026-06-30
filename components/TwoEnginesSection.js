'use client';

import { Brain, ShieldCheck, Check } from 'lucide-react';
import AnimateIn from '@/components/AnimateIn';

const engines = [
  {
    title: 'AI Sommelier',
    accent: 'purple',
    icon: Brain,
    items: [
      'Palate profiling in real-time',
      'Matches preferences to live SKUs',
      'Personalized recs for every customer',
    ],
  },
  {
    title: 'Compliance Engine',
    accent: 'teal',
    icon: ShieldCheck,
    items: [
      'Age-gate intercept (19/21+)',
      'Vocabulary hard-stop on claims',
      'Federal warnings auto-injected',
    ],
  },
];

const accentStyles = {
  purple: {
    bar: 'bg-brand-500',
    icon: 'gradient-brand shadow-brand',
    check: 'text-brand-500',
  },
  teal: {
    bar: 'bg-emerald-500',
    icon: 'bg-emerald-500 shadow-[0_8px_20px_rgba(16,185,129,0.28)]',
    check: 'text-emerald-500',
  },
};

function EngineCard({ title, accent, icon: Icon, items, delay }) {
  const styles = accentStyles[accent];

  return (
    <AnimateIn variant="slide-up" delay={delay}>
      <div className="bg-white rounded-[18px] sm:rounded-[20px] shadow-[0_2px_12px_rgba(12,12,18,0.06),0_1px_3px_rgba(12,12,18,0.04)] overflow-hidden h-full transition-shadow duration-200 hover:shadow-[0_8px_24px_rgba(12,12,18,0.08)]">
        <div className={`h-1.5 ${styles.bar}`} aria-hidden="true" />
        <div className="p-7 sm:p-8">
          <div className="flex items-center gap-3.5 mb-6 sm:mb-7">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${styles.icon}`}>
              <Icon size={22} className="text-white" aria-hidden="true" />
            </div>
            <h3 className="text-[17px] sm:text-lg font-bold text-[#111827] tracking-[-0.01em]">{title}</h3>
          </div>
          <ul className="space-y-3.5">
            {items.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <Check size={16} className={`${styles.check} flex-shrink-0 mt-0.5`} strokeWidth={2.5} aria-hidden="true" />
                <span className="text-[#6b7280] text-[14px] sm:text-[15px] leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AnimateIn>
  );
}

export default function TwoEnginesSection() {
  return (
    <section className="bg-[#f9fafb] py-20 sm:py-24 md:py-28" aria-labelledby="two-engines-heading">
      <div className="max-w-[960px] mx-auto px-6">
        <AnimateIn variant="slide-up" className="text-center mb-12 sm:mb-14 md:mb-16">
          <h2
            id="two-engines-heading"
            className="text-[1.75rem] sm:text-3xl md:text-[2.25rem] font-bold text-[#111827] tracking-[-0.02em] mb-3 sm:mb-4"
          >
            Two engines. One platform.
          </h2>
          <p className="text-[#6b7280] text-base sm:text-lg leading-relaxed max-w-[560px] mx-auto">
            Everything a modern vape shop needs — AI recommendations and compliance — unified.
          </p>
        </AnimateIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {engines.map((engine, i) => (
            <EngineCard key={engine.title} {...engine} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}
