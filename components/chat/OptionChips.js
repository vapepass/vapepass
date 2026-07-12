export default function OptionChips({ options, onSelect, disabled = false, columns = 2 }) {
  if (!options?.length) return null;

  return (
    <div
      className={`grid gap-2 ${columns === 1 ? 'grid-cols-1' : 'grid-cols-2'} animate-fade-in`}
      role="group"
    >
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onSelect(option)}
          disabled={disabled}
          className="chat-widget-option-chip flex items-center justify-center gap-1.5 min-h-[44px] px-3 py-2.5 text-[13px] font-medium text-[#374151] disabled:opacity-50"
        >
          {option.emoji && <span className="text-base leading-none" aria-hidden="true">{option.emoji}</span>}
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
}
