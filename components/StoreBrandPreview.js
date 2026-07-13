'use client';
import { Gift } from 'lucide-react';

/** Store branding + visit progress preview for setup and member screens. */
export default function StoreBrandPreview({ store = {} }) {
  const {
    name = 'Your Store',
    color = '#7c3aed',
    stampGoal = 10,
    reward = 'Free reward',
    stamps = 3,
    customerName = 'Alex Johnson',
  } = store;

  const remaining = Math.max(stampGoal - stamps, 0);
  const earned = stamps >= stampGoal;

  return (
    <div
      className="rounded-3xl p-7 relative overflow-hidden w-full max-w-sm mx-auto shadow-xl"
      style={{
        background: `linear-gradient(145deg, ${color} 0%, ${color}dd 50%, ${color}bb 100%)`,
        contain: 'layout style paint',
      }}
    >
      <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
      <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-xl" aria-hidden="true" />

      <div className="flex items-start justify-between mb-6 relative">
        <div>
          <p className="text-white font-bold text-xl tracking-tight">{name}</p>
          <p className="text-white/70 text-sm mt-0.5">Member rewards</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-white/20 backdrop-blur-sm flex-shrink-0">
          <Gift size={13} aria-hidden="true" />
          {earned ? '1 reward' : `${remaining} to go`}
        </div>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap relative" aria-label={`${stamps} of ${stampGoal} visits`}>
        {Array.from({ length: stampGoal }, (_, i) => (
          <div
            key={i}
            className={[
              'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300',
              i < stamps ? 'bg-white shadow-sm scale-100' : 'bg-white/20 scale-95',
            ].join(' ')}
          >
            {i < stamps && (
              <svg width="15" height="15" viewBox="0 0 24 24" fill={color} aria-hidden="true">
                <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 19.771l-7.416 3.642 1.48-8.279L0 9.306l8.332-1.151z" />
              </svg>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-end justify-between relative">
        <div>
          <p className="text-white/70 text-sm tabular-nums">{stamps} / {stampGoal} visits</p>
          <p className="text-white font-bold text-lg mt-0.5 tracking-tight">{customerName}</p>
        </div>
        <div className="w-20 h-20 rounded-xl bg-white p-2 flex-shrink-0 shadow-sm" aria-hidden="true">
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <rect x="5" y="5" width="30" height="30" rx="2" fill="none" stroke="black" strokeWidth="7" />
            <rect x="14" y="14" width="12" height="12" fill="black" />
            <rect x="65" y="5" width="30" height="30" rx="2" fill="none" stroke="black" strokeWidth="7" />
            <rect x="74" y="14" width="12" height="12" fill="black" />
            <rect x="5" y="65" width="30" height="30" rx="2" fill="none" stroke="black" strokeWidth="7" />
            <rect x="14" y="74" width="12" height="12" fill="black" />
            <rect x="50" y="50" width="8" height="8" fill="black" />
            <rect x="62" y="50" width="8" height="8" fill="black" />
            <rect x="74" y="50" width="8" height="8" fill="black" />
            <rect x="86" y="50" width="8" height="8" fill="black" />
            <rect x="50" y="62" width="8" height="8" fill="black" />
            <rect x="74" y="62" width="8" height="8" fill="black" />
            <rect x="50" y="74" width="8" height="8" fill="black" />
            <rect x="62" y="74" width="8" height="8" fill="black" />
            <rect x="86" y="74" width="8" height="8" fill="black" />
            <rect x="50" y="86" width="8" height="8" fill="black" />
            <rect x="74" y="86" width="8" height="8" fill="black" />
            <rect x="86" y="86" width="8" height="8" fill="black" />
          </svg>
        </div>
      </div>

      {earned && (
        <div className="mt-5 px-4 py-3 rounded-xl bg-white/15 backdrop-blur-sm relative">
          <p className="text-white/70 text-xs font-medium uppercase tracking-wider">Reward</p>
          <p className="text-white text-sm font-semibold truncate mt-0.5">{reward}</p>
        </div>
      )}
    </div>
  );
}
