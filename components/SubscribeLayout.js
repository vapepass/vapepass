import Link from 'next/link';
import {
  Sparkles,
  LayoutDashboard,
  Bot,
  ShieldCheck,
} from 'lucide-react';
import Logo from '@/components/Logo';

const HIGHLIGHTS = [
  {
    icon: LayoutDashboard,
    title: 'Unlock your dashboard',
    text: 'Manage inventory sync, embed settings, and assistant controls in one place.',
  },
  {
    icon: Bot,
    title: 'AI Flavor Sommelier',
    text: 'Personalized recommendations tied to your live product catalog.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Stripe billing',
    text: 'Cancel anytime. Update payment details from your account when you need to.',
  },
];

/**
 * Branded shell for subscription activation — matches Register/Login visual language.
 * Does not own payment logic; only layout and branding.
 */
export default function SubscribeLayout({
  children,
  footer,
  title = 'Activate your subscription',
  subtitle = 'Your dashboard stays locked until billing is active',
}) {
  return (
    <div className="login-page register-page min-h-screen flex flex-col bg-[#f6f7fb]">
      <header className="sticky top-0 z-40 border-b border-[#e8e9ef]/90 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Logo showText variant="sparkle" landing size={36} />
          <Link
            href="/"
            className="text-sm font-semibold text-body transition-colors hover:text-ink"
          >
            Back to home
          </Link>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[1fr_1fr] lg:gap-7 lg:py-10 lg:items-center">
        <aside
          className="register-page-aside relative hidden overflow-hidden rounded-3xl text-white lg:block lg:min-h-[32rem]"
          aria-label="Why subscribe to VapePass"
        >
          <div className="relative z-[1] flex h-full min-h-[32rem] flex-col justify-center gap-6 p-8 xl:p-10">
            <p className="inline-flex items-center gap-2 self-start rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-violet-100">
              <Sparkles size={14} aria-hidden="true" />
              VapePass for retailers
            </p>
            <h1 className="font-display text-[clamp(1.75rem,2.4vw,2.35rem)] font-bold leading-tight tracking-tight text-white">
              One plan. Full AI shopping assistant.
            </h1>
            <p className="max-w-md text-[0.95rem] leading-relaxed text-violet-200">
              Activate billing to unlock your store dashboard, embed script, and live
              flavor recommendations for customers.
            </p>
            <ul className="mt-2 flex list-none flex-col gap-3.5 p-0">
              {HIGHLIGHTS.map(({ icon: Icon, title: itemTitle, text }) => (
                <li
                  key={itemTitle}
                  className="flex items-start gap-3.5 rounded-2xl border border-white/10 bg-white/10 px-3.5 py-3.5"
                >
                  <span
                    className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white/15 text-violet-100"
                    aria-hidden="true"
                  >
                    <Icon size={18} strokeWidth={2} />
                  </span>
                  <div>
                    <p className="mb-0.5 text-sm font-semibold text-white">{itemTitle}</p>
                    <p className="m-0 text-[0.8rem] leading-snug text-violet-300">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="mx-auto w-full min-w-0 max-w-md lg:mx-0 lg:max-w-none">
          <div className="register-page-mobile-intro mb-4 rounded-2xl p-5 text-white shadow-[0_10px_28px_rgba(76,29,149,0.22)] lg:hidden">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-violet-100">
              <Sparkles size={14} aria-hidden="true" />
              VapePass for retailers
            </p>
            <p className="font-display mt-2.5 text-xl font-bold leading-snug tracking-tight">
              Activate your plan to unlock the dashboard
            </p>
          </div>

          <div className="animate-slide-up rounded-[1.25rem] border border-[#e8e9ef] bg-white p-6 shadow-[0_4px_24px_rgba(124,58,237,0.06),0_2px_8px_rgba(12,12,18,0.04)] sm:rounded-[1.35rem] sm:p-8">
            <div className="mb-6">
              <h2 className="font-display m-0 mb-1.5 text-[clamp(1.4rem,2vw,1.7rem)] font-bold tracking-tight text-ink">
                {title}
              </h2>
              {subtitle ? (
                <p className="m-0 text-[0.95rem] leading-snug text-body">{subtitle}</p>
              ) : null}
            </div>
            {children}
            {footer ? (
              <div className="mt-6 border-t border-line-subtle pt-5 text-center">{footer}</div>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}
