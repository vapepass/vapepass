import { QrCode, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Logo({
  size = 32,
  showText = false,
  href = '/',
  variant = 'qr',
  landing = false,
}) {
  const Icon = variant === 'sparkle' ? Sparkles : QrCode;

  const content = (
    <>
      <div
        className={`flex items-center justify-center flex-shrink-0 ${
          landing ? 'w-9 h-9 rounded-xl bg-brand-600' : 'rounded-[10px] gradient-brand shadow-sm'
        }`}
        style={landing ? undefined : { width: size, height: size }}
      >
        <Icon size={landing ? 20 : size * 0.5} className="text-white" aria-hidden="true" />
      </div>
      {showText && (
        <span
          className={`font-display font-bold text-xl tracking-tight ${
            landing ? 'text-[hsl(250_25%_10%)]' : 'text-ink'
          }`}
        >
          VapePass
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`flex items-center focus-visible:rounded-xl ${landing ? 'gap-2' : 'gap-2.5'}`}
        aria-label="VapePass home"
      >
        {content}
      </Link>
    );
  }

  return <div className={`flex items-center ${landing ? 'gap-2' : 'gap-3'}`}>{content}</div>;
}
