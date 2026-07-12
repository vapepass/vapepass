import { NICOTINE_DISCLAIMER } from '@/lib/chat/conversation-flow';

export default function ProductRecommendationCard({ product, intro, disclaimer }) {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="chat-widget-product-card w-full max-w-[92%]">
        {intro && (
          <p className="text-[13px] text-[#374151] leading-relaxed mb-3">{intro}</p>
        )}
        <div className="rounded-2xl border border-[#e5e7eb] bg-gradient-to-br from-white to-[#faf9ff] p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f3e8ff] flex items-center justify-center flex-shrink-0 text-lg">
              ✨
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-[15px] font-semibold text-[#111827] tracking-[-0.01em]">
                {product.name}
              </h4>
              {product.description && (
                <p className="text-[13px] text-[#4b5563] leading-relaxed mt-1.5">
                  {product.description}
                </p>
              )}
            </div>
          </div>
        </div>
        <p className="chat-widget-disclaimer mt-3 text-[11px] leading-relaxed">
          {disclaimer || NICOTINE_DISCLAIMER}
        </p>
      </div>
    </div>
  );
}
