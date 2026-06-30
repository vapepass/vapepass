'use client';

import { Shield, Lock, Ban, FileWarning } from 'lucide-react';
import AnimateIn from '@/components/AnimateIn';

const features = [
  {
    icon: Lock,
    title: 'Age-Gate Intercept',
    description: 'Widget is hidden until the visitor clears the Over-19/21 barrier. No exceptions.',
  },
  {
    icon: Ban,
    title: 'Vocabulary Hard-Stop',
    description: 'Bans illegal lifestyle claims and cessation advice at the model layer — not post-processing.',
  },
  {
    icon: FileWarning,
    title: 'Mandatory Warnings',
    description: 'Federal nicotine health warnings are baked into every chat window and pass.',
  },
];

function ComplianceCard({ icon: Icon, title, description, delay }) {
  return (
    <AnimateIn variant="slide-up" delay={delay}>
      <div className="bg-white rounded-[18px] sm:rounded-[20px] border border-[#e8eaef] p-7 sm:p-8 h-full transition-all duration-200 hover:shadow-[0_8px_24px_rgba(12,12,18,0.06)] hover:border-[#dfe1e8]">
        <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-5 sm:mb-6">
          <Icon size={20} className="text-emerald-600" strokeWidth={2} aria-hidden="true" />
        </div>
        <h3 className="text-[17px] sm:text-lg font-bold text-[#111827] tracking-[-0.01em] mb-2.5">
          {title}
        </h3>
        <p className="text-[#6b7280] text-[14px] sm:text-[15px] leading-relaxed">
          {description}
        </p>
      </div>
    </AnimateIn>
  );
}

export default function ComplianceShieldSection() {
  return (
    <section className="bg-[#f9fafb] py-20 sm:py-24 md:py-28" aria-labelledby="compliance-shield-heading">
      <div className="max-w-[1080px] mx-auto px-6">
        <AnimateIn variant="slide-up" className="text-center mb-12 sm:mb-14 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium mb-6 sm:mb-7 bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Shield size={14} className="text-emerald-600 flex-shrink-0" aria-hidden="true" />
            Compliance Shield
          </div>

          <h2
            id="compliance-shield-heading"
            className="text-[1.65rem] sm:text-3xl md:text-[2.15rem] font-bold text-[#111827] tracking-[-0.02em] mb-3 sm:mb-4"
          >
            Engineered for TVPA • FDA • Health Canada
          </h2>
          <p className="text-[#6b7280] text-base sm:text-lg leading-relaxed max-w-[520px] mx-auto">
            We&apos;ve baked every regulatory requirement into the platform so you never have to think about it.
          </p>
        </AnimateIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {features.map((feature, i) => (
            <ComplianceCard key={feature.title} {...feature} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}
