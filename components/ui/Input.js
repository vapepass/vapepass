'use client';

export function Input({ className = '', error = false, hasIcon = false, ...props }) {
  return (
    <input
      className={[
        'w-full h-11 text-sm text-ink bg-surface',
        hasIcon ? 'pl-10 pr-3.5' : 'px-3.5',
        'border rounded-xl transition-all duration-[var(--duration-fast)]',
        'placeholder:text-muted',
        'focus:outline-none focus:ring-[3px]',
        error
          ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/20'
          : 'border-line focus:border-brand-500 focus:ring-brand-500/15',
        className,
      ].join(' ')}
      {...props}
    />
  );
}

export function InputGroup({ children, className = '' }) {
  return <div className={`relative ${className}`}>{children}</div>;
}

export function InputIcon({ children, className = '' }) {
  return (
    <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none ${className}`}>
      {children}
    </span>
  );
}

export function InputToggle({ onClick, label, children, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg',
        'text-muted hover:text-ink transition-colors',
        className,
      ].join(' ')}
      aria-label={label}
    >
      {children}
    </button>
  );
}

export function Label({ children, htmlFor, className = '', required = false }) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-ink mb-2 ${className}`}
    >
      {children}
      {required && <span className="text-danger-500 ml-0.5" aria-hidden="true">*</span>}
    </label>
  );
}

export function FormField({ label, htmlFor, error, hint, required, children, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label htmlFor={htmlFor} required={required}>
          {label}
        </Label>
      )}
      {children}
      {error && (
        <p className="text-xs text-danger-600" role="alert">{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs text-muted">{hint}</p>
      )}
    </div>
  );
}
