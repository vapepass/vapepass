'use client';

import { Globe, Brain, Zap, Sparkles, AlertTriangle } from 'lucide-react';
import AnimateIn from '@/components/AnimateIn';

const features = [
  {
    icon: Brain,
    text: 'Daily inventory scrape — AI never recommends out-of-stock brands',
  },
  {
    icon: Zap,
    text: 'Palate profiling maps sweet, minty, heavy-ice preferences to exact SKUs',
  },
  {
    icon: Sparkles,
    text: 'Conversational AI guides every customer to their perfect flavor',
  },
];

function StorefrontChatCard() {
  return (
    <div className="bg-white rounded-[22px] sm:rounded-[24px] shadow-[0_8px_32px_rgba(12,12,18,0.08),0_2px_8px_rgba(12,12,18,0.04)] border border-[#f0f1f5] overflow-hidden">
      <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 flex items-center justify-between border-b border-[#f3f4f6]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
            <Sparkles size={15} className="text-brand-600" aria-hidden="true" />
          </div>
          <span className="text-[14px] sm:text-[15px] font-semibold text-[#111827]">Live on your storefront</span>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-emerald-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
          Active
        </span>
      </div>

      <div className="px-5 sm:px-6 py-5 sm:py-6 space-y-3.5">
        <div className="flex justify-start">
          <div className="max-w-[88%] rounded-2xl rounded-bl-md bg-[#f3f4f6] px-4 py-3">
            <p className="text-[#374151] text-[13px] sm:text-sm leading-relaxed">
              Hi! I&apos;m your VapePass Flavor Sommelier. What flavors are you into?
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="max-w-[82%] rounded-2xl rounded-br-md bg-brand-600 px-4 py-3">
            <p className="text-white text-[13px] sm:text-sm leading-relaxed">
              Something tropical but not too sweet, with ice.
            </p>
          </div>
        </div>

        <div className="flex justify-start">
          <div className="max-w-[90%] rounded-2xl rounded-bl-md bg-[#f3f4f6] px-4 py-3">
            <p className="text-[#374151] text-[13px] sm:text-sm leading-relaxed">
              Perfect — you&apos;d love Passion Fruit Iced or Guava Frost. Both are in stock right now.
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 sm:px-6 py-3.5 border-t border-[#f3f4f6] bg-[#fafafa]">
        <p className="flex items-center justify-center gap-1.5 text-[11px] sm:text-xs text-[#9ca3af] text-center leading-relaxed">
          <AlertTriangle size={12} className="text-amber-500 flex-shrink-0" aria-hidden="true" />
          Vaping products contain nicotine, which is addictive. 19+ only.
        </p>
      </div>
    </div>
  );
}

export default function SommelierFeatureSection() {
  return (
    <section className="bg-[#f9fafb] py-20 sm:py-24 md:py-28" aria-labelledby="sommelier-feature-heading">
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center">
          {/* Left column */}
          <AnimateIn variant="slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium mb-6 sm:mb-7 bg-[#f3e8ff] text-brand-700 border border-brand-200/60">
              <Globe size={14} className="text-brand-600 flex-shrink-0" aria-hidden="true" />
              AI Flavor Sommelier
            </div>

            <h2
              id="sommelier-feature-heading"
              className="text-[1.75rem] sm:text-[2rem] md:text-[2.35rem] font-bold text-[#111827] tracking-[-0.02em] leading-[1.15] mb-5 sm:mb-6"
            >
              Personalized recs, every customer, every visit
            </h2>

            <p className="text-[#4b5563] text-base sm:text-[17px] leading-relaxed mb-8 sm:mb-10">
              The sommelier learns each customer&apos;s palate — sweet, minty, fruity, heavy-ice — and maps it to your live inventory so you never recommend something that&apos;s out of stock.
            </p>

            <ul className="space-y-5 sm:space-y-6">
              {features.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon size={17} className="text-brand-600" strokeWidth={2} aria-hidden="true" />
                  </div>
                  <span className="text-[#4b5563] text-[15px] sm:text-base leading-relaxed pt-1.5">{text}</span>
                </li>
              ))}
            </ul>
          </AnimateIn>

          {/* Right column */}
          <AnimateIn variant="slide-up" delay={120}>
            <StorefrontChatCard />
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}
