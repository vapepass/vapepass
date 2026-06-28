export function Table({ children, className = '' }) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function TableHead({ children }) {
  return <thead>{children}</thead>;
}

export function TableHeader({ children, className = '', sortable = false, sorted = null }) {
  return (
    <th
      scope="col"
      className={[
        'text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider',
        sortable && 'cursor-pointer select-none hover:text-ink transition-colors',
        className,
      ].filter(Boolean).join(' ')}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {sorted === 'asc' && <span aria-hidden="true">↑</span>}
        {sorted === 'desc' && <span aria-hidden="true">↓</span>}
      </span>
    </th>
  );
}

export function TableBody({ children }) {
  return <tbody className="divide-y divide-line-subtle">{children}</tbody>;
}

export function TableRow({ children, onClick, className = '' }) {
  return (
    <tr
      onClick={onClick}
      className={[
        'transition-colors duration-[var(--duration-fast)]',
        onClick && 'cursor-pointer hover:bg-canvas/80',
        className,
      ].filter(Boolean).join(' ')}
    >
      {children}
    </tr>
  );
}

export function TableCell({ children, className = '' }) {
  return <td className={`px-5 py-4 text-ink ${className}`}>{children}</td>;
}
