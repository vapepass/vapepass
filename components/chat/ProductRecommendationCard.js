import { ExternalLink } from 'lucide-react';
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
      <div className="chat-widget-product-card w-full max-w-[92%]">
        {introText && (
          <p className="text-[13px] text-[#374151] leading-relaxed mb-3">{introText}</p>
        )}
        <div className="rounded-2xl border border-[#e5e7eb] bg-gradient-to-br from-white to-[#faf9ff] p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#7c3aed] mb-2">
            Recommended Product
          </p>
          <div className="flex items-start gap-3">
            {product.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.imageUrl}
                alt=""
                className="w-12 h-12 rounded-xl object-cover flex-shrink-0 bg-[#f3e8ff]"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-[#f3e8ff] flex items-center justify-center flex-shrink-0 text-lg">
                ✨
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h4 className="text-[15px] font-semibold text-[#111827] tracking-[-0.01em] leading-snug">
                {title}
              </h4>
              {variant && (
                <p className="chat-widget-variant mt-1.5">
                  <span className="chat-widget-variant-label">Variant</span>
                  <span className="chat-widget-variant-name">{variant}</span>
                </p>
              )}
              {product.brand && (
                <p className="text-[12px] text-[#6b7280] mt-1">{product.brand}</p>
              )}
              {blurb && (
                <p className="text-[13px] text-[#4b5563] leading-relaxed mt-1.5">
                  {blurb}
                </p>
              )}
            </div>
          </div>

          {productUrl ? (
            <a
              href={productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="chat-widget-view-product mt-3 w-full h-10 px-4 inline-flex items-center justify-center gap-2 text-[13px] font-semibold text-white no-underline"
            >
              <ExternalLink size={14} aria-hidden="true" />
              View Product
            </a>
          ) : null}
        </div>
        <p className="chat-widget-disclaimer mt-3 text-[11px] leading-relaxed">
          {disclaimer || NICOTINE_DISCLAIMER}
        </p>
      </div>
    </div>
  );
}
