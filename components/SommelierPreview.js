'use client';

import { Sparkles } from 'lucide-react';

export default function SommelierPreview() {
  return (
    <div className="hero-preview-shell rounded-[20px] sm:rounded-[24px] overflow-hidden">
      <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-6 sm:pb-7">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[rgba(167,139,250,0.35)] flex items-center justify-center flex-shrink-0">
              <Sparkles size={15} className="text-white" aria-hidden="true" />
            </div>
            <p className="text-white font-semibold text-[15px] sm:text-base tracking-[-0.01em]">
              AI Flavor Sommelier
            </p>
          </div>
          <span
            className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.55)] flex-shrink-0"
            aria-label="Online"
          />
        </div>

        {/* Chat */}
        <div className="space-y-3">
          <div className="flex justify-start">
            <div className="max-w-[90%] sm:max-w-[85%] rounded-2xl rounded-bl-sm hero-chat-bubble-ai px-4 py-3">
              <p className="text-white text-[13px] sm:text-sm leading-[1.55] font-normal">
                What flavor profiles does this customer usually enjoy?
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="max-w-[88%] sm:max-w-[75%] rounded-2xl rounded-br-sm hero-chat-bubble-user px-4 py-3">
              <p className="text-white text-[13px] sm:text-sm leading-[1.55] font-normal">
                They like fruity, something with a light ice finish.
              </p>
            </div>
          </div>

          <div className="flex justify-start">
            <div className="max-w-[92%] sm:max-w-[88%] rounded-2xl rounded-bl-sm hero-chat-bubble-ai px-4 py-3">
              <p className="text-white text-[13px] sm:text-sm leading-[1.55] font-normal">
                Try our Mango Lychee Frost or Watermelon Ice — both are in stock and match that palate perfectly. 🍉 🧊
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
