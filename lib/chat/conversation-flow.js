export const FLOW_STEPS = {
  AGE_VERIFY: 'age_verify',
  OPTIONS: 'options',
  FETCHING: 'fetching',
  RECOMMENDATION: 'recommendation',
  FREE_CHAT: 'free_chat',
  LOCKED: 'locked',
};

/**
 * Age-gate welcome (first message). Compliance copy only — backend still verifies age.
 */
export function getWelcomeMessage(legalAge = 19) {
  return {
    greeting: 'Welcome!',
    intro: `Are you of the legal age required to purchase vaping products in your region?`,
    question: `You must be ${legalAge}+ to continue.`,
    note: 'This assistant is for adults only.',
  };
}

/**
 * Short branding line after age — the backend open prompt asks what they want.
 */
export function getShoppingWelcomeMessage(storeName = null) {
  const storeLine = storeName
    ? `I'm your VapePass AI Shopping Assistant for ${storeName}.`
    : "I'm your VapePass AI Shopping Assistant.";

  return ['Welcome!', '', storeLine].join('\n');
}

/** @deprecated Use getWelcomeMessage(legalAge) */
export const WELCOME_MESSAGE = getWelcomeMessage(19);

export const NICOTINE_DISCLAIMER =
  'Please note that vaping products contain nicotine, which is addictive.';

export const ANOTHER_REC_PROMPT =
  'Want something different? Tell me what to change — sweeter, less ice, another product type, or a different flavor — and I\'ll refine the recommendation. Or say you want another recommendation to start fresh. If you\'re all set, just say thanks!';

export function getAgeYesLabel(legalAge = 19) {
  return `Yes, I'm ${legalAge}+`;
}

/** Polite closing / "I'm done" — not a product request */
export function normalizeConversationEndText(message) {
  let text = String(message || '')
    .toLowerCase()
    .replace(/\s*\([^)]*\)\s*$/g, '')
    .replace(/[“”"']/g, '')
    .replace(/[!?.,;:]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!text) return '';

  text = text
    .replace(/\bthankyou\b/g, 'thank you')
    .replace(/\bthank\s*u\b/g, 'thank you')
    .replace(/\bthank\s*ya\b/g, 'thank you')
    .replace(/\bthx\b/g, 'thanks')
    .replace(/\bty\b/g, 'thanks')
    .replace(/\btysm\b/g, 'thanks')
    .replace(/\bthank\s+you\b/g, 'thank you');

  return text;
}

export function detectsConversationEnd(message) {
  const raw = String(message || '').trim();
  if (!raw) return false;

  const text = normalizeConversationEndText(raw);
  if (!text) return false;

  if (
    /\b(another recomm\w*|something else|start over|start fresh|show me another|looking for|more ice|less ice|sweeter|different flavor|disposable|e-?liquid|fruity|menthol)\b/i.test(
      text
    )
  ) {
    return false;
  }
  if (/\brecommend (another|something|a |an |me )\b/i.test(text)) {
    return false;
  }

  if (
    /^(ok|okay|alright|all right|cool|great|perfect|awesome|nice|yes|yeah|yep)?\s*(thanks|thank you)(\s+(so much|a lot|very much))?$/.test(
      text
    )
  ) {
    return true;
  }
  if (/\b(thanks|thank you)(\s+(so much|a lot|very much))?\b/.test(text) && text.split(/\s+/).length <= 8) {
    return true;
  }
  if (/\b(appreciate it|appreciated|many thanks)\b/.test(text)) {
    return true;
  }
  if (/\b(no thanks|no thank you|nah thanks|nope thanks)\b/.test(text)) {
    return true;
  }
  if (/^(no|nope|nah)\s+(thanks|thank you)$/.test(text)) {
    return true;
  }
  if (
    /\b(that'?s (all|it|perfect|great|fine|enough)|that is (all|it|perfect)|i'?m (good|done|all set|fine)|that will be all|all good|all set|i'?m all set)\b/.test(
      text
    )
  ) {
    return true;
  }
  if (/\b(goodbye|good bye|bye bye|bye|see you( later)?|take care|have a (good|great) (day|one))\b/.test(text)) {
    return true;
  }
  if (/^(perfect|awesome|great|sounds good|sounds perfect|all good)(\s+(thanks|thank you))?$/.test(text)) {
    return true;
  }

  return false;
}

/** Explicit restart / brand-new recommendation request */
export function detectsRecommendationRestart(message) {
  const text = String(message || '').trim().toLowerCase();
  if (!text) return false;
  if (detectsConversationEnd(text)) return false;
  return (
    /\b(another recomm\w*|different (recommendation|product)|something else|start over|start fresh|new recomm\w*|show me another product|recommend another vape|completely different|for my friend)\b/i.test(
      text
    ) ||
    /\bi want (another|a different|something else)\b/i.test(text) ||
    /\bget another recomm\w*\b/i.test(text) ||
    /\bnow i want\b/i.test(text) ||
    /\blet'?s start (over|again|fresh)\b/i.test(text) ||
    /\bstart fresh\b/i.test(text)
  );
}

/** Relative tweaks to the current recommendation — do not clear Looking For */
export function detectsRecommendationRefine(message) {
  const text = String(message || '').trim().toLowerCase();
  if (!text) return false;
  return /\b(more ice|less ice|extra ice|heavy ice|less cooling|more cooling|sweeter|less sweet|smoother|milder|another (flavor|variant|option)|different (flavor|variant|option)|something similar|don'?t like (this|that|the) flavor|make it (sweeter|icier|cooler|less sweet)|suggest another (variant|option|flavor))\b/i.test(
    text
  );
}

/**
 * True when the user is starting a fresh shopping pass (new product type / full ask)
 * rather than refining the current card.
 */
export function detectsNewRecommendationPass(message, previousIntent = null) {
  const text = String(message || '').trim();
  if (!text) return false;
  if (detectsRecommendationRestart(text)) return true;
  if (detectsRecommendationRefine(text)) return false;

  // Lazy import avoidance — product-type switch detected via simple keywords
  const lower = text.toLowerCase();
  const typeMatchers = [
    { key: 'disposable', re: /\bdisposables?\b/i },
    { key: 'e-liquid', re: /\b(e-?liquids?|e-?juice|eliquid|vape juice)\b/i },
    { key: 'pod', re: /\b(pods?|pod system)\b/i },
    { key: 'device', re: /\b(devices?|mods?|kits?)\b/i },
  ];
  const found = typeMatchers.find((t) => t.re.test(lower));
  if (found && previousIntent?.productType) {
    const prev = String(previousIntent.productType).toLowerCase();
    if (found.key === 'disposable' && !prev.includes('disposable')) return true;
    if (found.key === 'e-liquid' && !prev.includes('liquid') && !prev.includes('juice')) return true;
    if (found.key === 'pod' && !prev.includes('pod')) return true;
    if (found.key === 'device' && !prev.includes('device') && !prev.includes('mod')) return true;
  }

  // Fresh shopping opener after a recommendation
  if (
    /\b(i'?m looking for|i want|recommend|show me)\b/i.test(lower) &&
    (found || /\b(fruity|menthol|candy|dessert|citrus|mango|berry|ice|no ice)\b/i.test(lower))
  ) {
    return true;
  }

  return false;
}

export function formatUserChoice(option) {
  if (!option) return '';
  return option.label || option.value || '';
}

/**
 * Normalize API options (kept for compatibility).
 * The text-first UI no longer renders these as buttons.
 */
export function normalizeOptions(options = []) {
  if (!Array.isArray(options)) return [];
  return options
    .map((opt, idx) => ({
      id: String(opt.id || `opt_${idx}`),
      label: String(opt.label || opt.value || 'Option'),
      emoji: opt.emoji || '',
      value: opt.value || opt.label || '',
    }))
    .filter((o) => o.label);
}

/** Soften multi-line assistant replies for chat bubbles */
export function formatAssistantContent(text) {
  return String(text || '')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Pass through assistant text — brand preference questions are intentional. */
export function rewriteBrandQuestion(text) {
  return formatAssistantContent(text);
}

/**
 * @deprecated Brand questions are part of the preference flow now.
 */
export function isBrandQuestion(text) {
  return /\b(which brand|what brand|preferred brand|select a brand|choose a brand|brand are you|manufacturer|which vendor)\b/i.test(
    String(text || '')
  );
}

/**
 * Strip interactive option chips from a restored timeline.
 * Age Yes/No is handled separately via welcome.ageActionsActive.
 */
export function stripInteractiveOptions(timeline = []) {
  return timeline.map((item) => {
    if (!item || typeof item !== 'object') return item;
    if (!item.options && !item.optionsActive) return item;
    const next = { ...item, optionsActive: false };
    delete next.options;
    return next;
  });
}
