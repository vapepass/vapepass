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
 * Shopping-assistant intro after age verification.
 * Invites free-form preference typing — never brand knowledge.
 */
export function getShoppingWelcomeMessage(storeName = null) {
  const storeLine = storeName
    ? `I can help you discover the best products from ${storeName} based on your taste and preferences.`
    : 'I can help you discover the best products from this store based on your taste and preferences.';

  return [
    'Welcome!',
    '',
    "I'm your VapePass AI Shopping Assistant.",
    '',
    storeLine,
    '',
    "Just tell me what you're looking for — fruity, menthol, dessert, heavy ice, a disposable, or something you've enjoyed before. I'll match you to the best option in stock.",
  ].join('\n');
}

/** @deprecated Use getWelcomeMessage(legalAge) */
export const WELCOME_MESSAGE = getWelcomeMessage(19);

export const NICOTINE_DISCLAIMER =
  'Please note that vaping products contain nicotine, which is addictive.';

export const ANOTHER_REC_PROMPT =
  'Want something different? Tell me what to change — sweeter, less ice, another product type, or a different flavor — and I\'ll refine the recommendation.';

export function getAgeYesLabel(legalAge = 19) {
  return `Yes, I'm ${legalAge}+`;
}

export function detectsRecommendationRestart(message) {
  const text = String(message || '').trim().toLowerCase();
  if (!text) return false;
  return (
    /\b(another recommendation|different (flavor|recommendation|one|product)|something else|start over|new recommendation)\b/i.test(
      text
    ) || /\bi want (another|a different|something else)\b/i.test(text)
  );
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

/** Detect brand-selection questions that should never be shown to customers. */
export function isBrandQuestion(text) {
  return /\b(which brand|what brand|preferred brand|select a brand|choose a brand|brand are you|manufacturer|which vendor)\b/i.test(
    String(text || '')
  );
}

/**
 * Rewrite brand prompts into preference-driven consultant copy.
 * Used as a UI safety net if an older funnel reply still mentions brands.
 */
export function rewriteBrandQuestion(text) {
  if (!isBrandQuestion(text)) return formatAssistantContent(text);
  return formatAssistantContent(
    "No need to know brands — I'll pick the best match from this store's inventory. Tell me more about what you like: fruit, dessert, menthol, heavy ice, sweetness, or a product type like disposable or e-liquid."
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
