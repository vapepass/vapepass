'use client';

import { Sparkles } from 'lucide-react';

export default function SommelierPreview() {
  const size = 'min(400px, calc(100vw - 3rem))';

  return (
    <div
      className="hero-preview-shell rounded-[32px] overflow-hidden flex flex-col mx-auto"
      style={{ width: size, height: size }}
    >
      <div className="flex flex-col h-full px-5 sm:px-6 pt-5 sm:pt-6 pb-5 sm:pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <Sparkles size={15} className="text-white sm:hidden" aria-hidden="true" />
              <Sparkles size={16} className="text-white hidden sm:block" aria-hidden="true" />
            </div>
            <p className="text-white font-semibold font-display text-[14px] sm:text-[15px] tracking-[-0.01em] leading-tight">
              AI Flavor Sommelier
            </p>
          </div>
          <span
            className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0"
            aria-label="Online"
          />
        </div>

        {/* Chat */}
        <div className="flex flex-col justify-center gap-3 flex-1 min-h-0">
          <div className="flex justify-start">
            <div className="max-w-[84%] rounded-xl hero-chat-bubble-ai px-3.5 py-2.5 sm:px-4 sm:py-3">
              <p className="text-[12.5px] sm:text-[13px] leading-[1.5] font-normal">
                What flavor profiles does this customer usually enjoy?
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="max-w-[80%] rounded-xl hero-chat-bubble-user px-3.5 py-2.5 sm:px-4 sm:py-3">
              <p className="text-[12.5px] sm:text-[13px] leading-[1.5] font-normal">
                They like fruity, something with a light ice finish.
              </p>
            </div>
          </div>

          <div className="flex justify-start">
            <div className="max-w-[90%] rounded-xl hero-chat-bubble-ai px-3.5 py-2.5 sm:px-4 sm:py-3">
              <p className="text-[12.5px] sm:text-[13px] leading-[1.5] font-normal">
                Try our Mango Lychee Frost or Watermelon Ice — both are in stock and match that palate perfectly. 🍉 🧊
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
