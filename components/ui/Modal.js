'use client';
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

export default function Modal({ open, onClose, title, description, children, size = 'md', contentClassName = '' }) {
  const overlayRef = useRef(null);
  const hasHeaderCopy = Boolean(title || description);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
  };

  const closeButton = onClose ? (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClose}
      aria-label="Close dialog"
      className="min-h-9 h-9 w-9"
    >
      <X size={18} />
    </Button>
  ) : null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      onClick={(e) => e.target === overlayRef.current && onClose?.()}
    >
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-md animate-fade-in" aria-hidden="true" />
      <div
        className={[
          'relative w-full bg-surface rounded-2xl border border-line shadow-xl',
          'animate-scale-in max-h-[90vh] overflow-y-auto',
          sizes[size] || sizes.md,
        ].join(' ')}
        onClick={(e) => e.stopPropagation()}
      >
        {hasHeaderCopy ? (
          <div className="flex items-start justify-between gap-4 p-6 pb-0">
            <div>
              {title && (
                <h2 id="modal-title" className="text-lg font-semibold text-ink tracking-tight">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-sm text-body mt-1">{description}</p>
              )}
            </div>
            {closeButton && <div className="-mr-2 -mt-1">{closeButton}</div>}
          </div>
        ) : (
          closeButton && (
            <div className="absolute right-3 top-3 z-10">{closeButton}</div>
          )
        )}
        <div className={['p-6', contentClassName].filter(Boolean).join(' ')}>{children}</div>
      </div>
    </div>
  );
}
