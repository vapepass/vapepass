import { resolveOptionIcon } from '@/lib/chat/icon-map';

/**
 * Interactive option chips / category buttons.
 * Renders only what the API provides — never invents inventory types.
 */
export default function OptionChips({
  options,
  onSelect,
  disabled = false,
  columns = 2,
  variant = 'chip',
}) {
  if (!options?.length) return null;

  const isCategory = variant === 'category';

  return (
    <div
      className={[
        'grid gap-2 animate-fade-in',
        columns === 1 ? 'grid-cols-1' : 'grid-cols-2',
      ].join(' ')}
      role="group"
      aria-disabled={disabled || undefined}
    >
      {options.map((option) => {
        const Icon = resolveOptionIcon(option);
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect?.(option)}
            disabled={disabled}
            className={[
              'chat-widget-option-chip flex items-center gap-2 min-h-[44px] px-3.5 py-2.5 text-left text-[13px] font-medium text-[#374151] transition-all duration-200',
              isCategory ? 'justify-start font-semibold' : 'justify-center',
              disabled
                ? 'opacity-55 cursor-default'
                : 'hover:border-brand-300 hover:bg-brand-50/80 hover:text-brand-800 active:scale-[0.98]',
            ].join(' ')}
          >
            {Icon ? (
              <Icon
                size={isCategory ? 16 : 15}
                className="flex-shrink-0 text-brand-600"
                aria-hidden="true"
              />
            ) : null}
            <span className="leading-snug">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
