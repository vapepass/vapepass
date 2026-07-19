export const FLOW_STEPS = {
  AGE_VERIFY: 'age_verify',
  OPTIONS: 'options',
  FETCHING: 'fetching',
  RECOMMENDATION: 'recommendation',
  FREE_CHAT: 'free_chat',
  LOCKED: 'locked',
};

export function getWelcomeMessage(legalAge = 19) {
  return {
    greeting: "Hey! I'm the VapePass Flavor Sommelier.",
    intro: 'I can help you find your perfect vape flavor profile based on your taste preferences.',
    question: `Are you ${legalAge} or older?`,
    note: '(This service is for adults only)',
  };
}

/** @deprecated Use getWelcomeMessage(legalAge) */
export const WELCOME_MESSAGE = getWelcomeMessage(19);

export const NICOTINE_DISCLAIMER =
  'Please note that vaping products contain nicotine, which is addictive.';

export const ANOTHER_REC_PROMPT =
  'Want a different flavor? Tap below or tell me what you prefer next.';

export function getAgeYesLabel(legalAge = 19) {
  return `Yes, I'm ${legalAge}+`;
}

export function detectsRecommendationRestart(message) {
  const text = String(message || '').trim().toLowerCase();
  if (!text) return false;
  return (
    /\b(another recommendation|different (flavor|recommendation|one)|something else|start over|new recommendation)\b/i.test(
      text
    ) || /\bi want (another|a different|something else)\b/i.test(text)
  );
}

export function formatUserChoice(option) {
  if (!option) return '';
  return option.label || option.value || '';
}

/**
 * Normalize API options into chip-friendly objects.
 * Frontend never invents categories — it only renders what the API returns.
 * Emoji markers are kept only for icon mapping (never rendered as characters).
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
