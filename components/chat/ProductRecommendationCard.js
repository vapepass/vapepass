import { ExternalLink, Sparkles } from 'lucide-react';
import { NICOTINE_DISCLAIMER } from '@/lib/chat/conversation-flow';
import {
  resolveRecommendationDisplay,
  summarizeProductBlurb,
  summarizeRecommendationIntro,
} from '@/lib/chat/product-display';

export default function ProductRecommendationCard({ product, intro, disclaimer }) {
  const productUrl =
    (typeof product?.productUrl === 'string' && product.productUrl.trim()) ||
    (typeof product?.originalProductUrl === 'string' && product.originalProductUrl.trim()) ||
    '';

  const { title, variant } = resolveRecommendationDisplay(product);
  const blurb = summarizeProductBlurb(product.description);
  const introText = summarizeRecommendationIntro(intro);

  return (
    <div className="flex justify-start animate-fade-in">
      <div className="chat-widget-product-card w-full max-w-[94%]">
        {introText && (
          <div className="chat-widget-bubble-bot mb-3 px-4 py-3.5 text-[13px] leading-[1.6] text-[#374151]">
            {introText}
          </div>
        )}
        <div className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
          <div className="bg-gradient-to-br from-brand-50 via-white to-[#faf9ff] px-4 pt-4 pb-3">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-600">
              Recommended for you
            </p>
            <div className="flex items-start gap-3.5">
              {product.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.imageUrl}
                  alt=""
                  className="h-16 w-16 flex-shrink-0 rounded-2xl object-cover bg-white ring-1 ring-[#e5e7eb]"
                />
              ) : (
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                  <Sparkles size={22} aria-hidden="true" />
                </div>
              )}
              <div className="min-w-0 flex-1 pt-0.5">
                <h4 className="text-[15px] font-semibold leading-snug tracking-[-0.01em] text-[#111827]">
                  {title}
                </h4>
                {variant && (
                  <p className="chat-widget-variant mt-1.5">
                    <span className="chat-widget-variant-label">Variant</span>
                    <span className="chat-widget-variant-name">{variant}</span>
                  </p>
                )}
                {product.brand && (
                  <p className="mt-1 text-[12px] font-medium text-[#6b7280]">{product.brand}</p>
                )}
              </div>
            </div>
          </div>

          {blurb && (
            <p className="border-t border-[#f3f4f6] px-4 py-3 text-[13px] leading-relaxed text-[#4b5563]">
              {blurb}
            </p>
          )}

          {productUrl ? (
            <div className="border-t border-[#f3f4f6] p-3">
              <a
                href={productUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="chat-widget-view-product inline-flex h-11 w-full items-center justify-center gap-2 px-4 text-[13px] font-semibold text-white no-underline"
              >
                <ExternalLink size={14} aria-hidden="true" />
                View Product
              </a>
            </div>
          ) : null}
        </div>
        <p className="chat-widget-disclaimer mt-3 text-[11px] leading-relaxed">
          {disclaimer || NICOTINE_DISCLAIMER}
        </p>
      </div>
    </div>
  );
}
