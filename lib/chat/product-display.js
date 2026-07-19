/**
 * Derive a clean product title + variant label for recommendation cards.
 * Scraped variants are often stored as "Parent - Variant" with variantName set;
 * this avoids showing the flavor twice in the title.
 */
export function resolveRecommendationDisplay(product = {}) {
  const rawName = String(product.name || '').trim();
  const variant = String(product.variantName || product.flavor || '').trim();

  let title = rawName || 'Recommended product';

  if (variant && rawName) {
    const escaped = variant.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const stripped = rawName
      .replace(new RegExp(`\\s*[-–|/:]\\s*${escaped}\\s*$`, 'i'), '')
      .trim();

    if (stripped && stripped.length >= 2 && stripped.toLowerCase() !== rawName.toLowerCase()) {
      title = stripped;
    }
  }

  // Don't repeat the variant if it is the entire title
  const showVariant =
    Boolean(variant) && variant.toLowerCase() !== title.toLowerCase();

  return {
    title,
    variant: showVariant ? variant : null,
  };
}

const MARKETING_CUT_RE =
  /\b(why choose|technical specifications?|important notice|warning:|shop .{0,40} online|explore more|premium quality you can trust|device compatibility|ideal for|available in a convenient)\b/i;

/**
 * Turn long scraped product-page copy into a short card blurb.
 * Presentation only — does not change recommendation selection.
 */
export function summarizeProductBlurb(text, maxLen = 140) {
  if (!text) return null;

  let cleaned = String(text)
    .replace(/<[^>]+>/g, ' ')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, ' ')
    .replace(/[→👉💨⚡🔒]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) return null;

  const cutAt = cleaned.search(MARKETING_CUT_RE);
  if (cutAt > 48) {
    cleaned = cleaned.slice(0, cutAt).trim().replace(/[|·•\-–—:\s]+$/g, '');
  }

  const sentences = cleaned.match(/[^.!?]+[.!?]+/g);
  if (sentences?.length) {
    let blurb = sentences[0].trim();
    if (blurb.length < 70 && sentences[1]) {
      blurb = `${blurb} ${sentences[1].trim()}`;
    }
    cleaned = blurb;
  }

  if (cleaned.length > maxLen) {
    cleaned = `${cleaned.slice(0, maxLen - 1).replace(/\s+\S*$/, '').trim()}…`;
  }

  return cleaned || null;
}

/**
 * Short assistant intro for recommendation cards — keep the recommend line,
 * drop appended marketing copy and duplicate nicotine warnings.
 */
export function summarizeRecommendationIntro(intro) {
  if (!intro) return null;
  let text = String(intro)
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, ' ')
    .replace(/[→👉💨⚡🔒]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!text) return null;

  text = text
    .replace(/\s*Please note that vaping products contain nicotine[^.]*\./gi, '')
    .trim();

  const recommendMatch = text.match(
    /^(Based on what you told me,\s*I'd recommend[^.]*\.)/i
  );
  if (recommendMatch) {
    return recommendMatch[1];
  }

  const firstSentence = text.match(/^[^.!?]+[.!?]/);
  if (firstSentence && firstSentence[0].length <= 220) {
    return firstSentence[0].trim();
  }

  if (text.length > 180) {
    return `${text.slice(0, 179).replace(/\s+\S*$/, '').trim()}…`;
  }
  return text;
}
