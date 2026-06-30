export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center px-4 py-12 sm:py-16">
      <div className="w-full max-w-[440px] animate-slide-up">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-[1.75rem] sm:text-[2rem] font-bold text-[#111827] tracking-[-0.02em] mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[#6b7280] text-base sm:text-[17px]">{subtitle}</p>
          )}
        </div>

        <div className="bg-white rounded-[18px] sm:rounded-[20px] border border-[#e8eaef] shadow-[0_2px_12px_rgba(12,12,18,0.04)] px-7 sm:px-8 py-8 sm:py-9">
          {children}
        </div>

        {footer && <div className="mt-6 text-center">{footer}</div>}
      </div>
    </div>
  );
}
