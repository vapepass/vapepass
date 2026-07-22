import Link from 'next/link';
import { Sparkles, Shield, Package } from 'lucide-react';
import Logo from '@/components/Logo';

const BENEFITS = [
  {
    icon: Sparkles,
    title: 'AI Flavor Sommelier',
    text: 'Personalized recommendations tied to your live inventory.',
  },
  {
    icon: Shield,
    title: 'Compliance built in',
    text: 'Age gates and region-aware messaging by design.',
  },
  {
    icon: Package,
    title: 'Dashboard & embed',
    text: 'Sync products, then drop the assistant on your storefront.',
  },
];

/**
 * Branded split shell for store registration only.
 * Login and other auth pages keep using AuthLayout.
 */
export default function RegisterLayout({ children, footer }) {
  return (
    <div className="register-page min-h-screen flex flex-col bg-[#f6f7fb]">
      <header className="sticky top-0 z-40 border-b border-[#e8e9ef]/90 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Logo showText variant="sparkle" landing size={36} />
          <Link
            href="/login"
            className="inline-flex h-9 items-center rounded-full border border-brand-200 bg-brand-50 px-4 text-sm font-semibold text-brand-800 transition-colors hover:bg-brand-100"
          >
            Sign in
          </Link>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[0.92fr_1.18fr] lg:gap-7 lg:py-7 lg:items-start">
        <aside
          className="register-page-aside relative hidden overflow-hidden rounded-3xl text-white lg:sticky lg:top-[5.25rem] lg:block lg:min-h-[calc(100vh-7.5rem)]"
          aria-label="Why join VapePass"
        >
          <div className="relative z-[1] flex h-full flex-col gap-5 p-8 xl:p-9">
            <p className="inline-flex items-center gap-2 self-start rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-violet-100">
              <Sparkles size={14} aria-hidden="true" />
              For vape retailers
            </p>
            <h1 className="font-display text-[clamp(1.65rem,2.2vw,2.15rem)] font-bold leading-tight tracking-tight text-white">
              Launch your AI shopping assistant in minutes
            </h1>
            <p className="text-[0.95rem] leading-relaxed text-violet-200">
              Create your store account, subscribe, then unlock the dashboard — the same
              experience customers see on VapePass.
            </p>
            <ul className="mt-1 flex list-none flex-col gap-3.5 p-0">
              {BENEFITS.map(({ icon: Icon, title, text }) => (
                <li
                  key={title}
                  className="flex items-start gap-3.5 rounded-2xl border border-white/10 bg-white/10 px-3.5 py-3.5"
                >
                  <span
                    className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white/15 text-violet-100"
                    aria-hidden="true"
                  >
                    <Icon size={18} strokeWidth={2} />
                  </span>
                  <div>
                    <p className="mb-0.5 text-sm font-semibold text-white">{title}</p>
                    <p className="m-0 text-[0.8rem] leading-snug text-violet-300">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="min-w-0 w-full">
          <div className="register-page-mobile-intro mb-4 rounded-2xl p-5 text-white shadow-[0_10px_28px_rgba(76,29,149,0.22)] lg:hidden">
            <p className="inline-flex items-center gap-2 self-start rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-violet-100">
              <Sparkles size={14} aria-hidden="true" />
              For vape retailers
            </p>
            <p className="font-display mt-2.5 text-xl font-bold leading-snug tracking-tight">
              Launch your AI shopping assistant in minutes
            </p>
          </div>

          <div className="animate-slide-up rounded-[1.25rem] border border-[#e8e9ef] bg-white p-5 shadow-[0_4px_24px_rgba(124,58,237,0.06),0_2px_8px_rgba(12,12,18,0.04)] sm:rounded-[1.35rem] sm:p-7">
            <div className="mb-5">
              <h2 className="font-display m-0 mb-1.5 text-[clamp(1.35rem,2vw,1.65rem)] font-bold tracking-tight text-ink">
                Create your store account
              </h2>
              <p className="m-0 text-[0.95rem] leading-snug text-body">
                Sign up, subscribe, then unlock your dashboard
              </p>
            </div>
            {children}
            {footer ? (
              <div className="mt-5 border-t border-line-subtle pt-4 text-center">{footer}</div>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}
