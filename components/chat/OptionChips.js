import { resolveOptionIcon } from '@/lib/chat/icon-map';

export default function OptionChips({ options, onSelect, disabled = false, columns = 2 }) {
  if (!options?.length) return null;

  return (
    <div
      className={`grid gap-2 ${columns === 1 ? 'grid-cols-1' : 'grid-cols-2'} animate-fade-in`}
      role="group"
    >
      {options.map((option) => {
        const Icon = resolveOptionIcon(option);
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option)}
            disabled={disabled}
            className="chat-widget-option-chip flex items-center justify-center gap-1.5 min-h-[44px] px-3 py-2.5 text-[13px] font-medium text-[#374151] disabled:opacity-50"
          >
            {Icon ? <Icon size={15} className="flex-shrink-0 text-brand-600" aria-hidden="true" /> : null}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
