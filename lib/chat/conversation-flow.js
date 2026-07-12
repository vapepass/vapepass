export const FLOW_STEPS = {
  AGE_VERIFY: 'age_verify',
  CATEGORY: 'category',
  SUBCATEGORY: 'subcategory',
  ICE: 'ice',
  INTENSITY: 'intensity',
  FETCHING_REC: 'fetching_rec',
  RECOMMENDATION: 'recommendation',
  CART_PROMPT: 'cart_prompt',
  FINAL_AGE: 'final_age',
  ADD_TO_CART: 'add_to_cart',
  FREE_CHAT: 'free_chat',
  LOCKED: 'locked',
};

export function getWelcomeMessage(legalAge = 19) {
  return {
    greeting: "👋 Hey! I'm the VapePass Flavor Sommelier.",
    intro: 'I can help you find your perfect vape flavor profile based on your taste preferences.',
    question: `Are you ${legalAge} or older?`,
    note: '(This service is for adults only)',
  };
}

/** @deprecated Use getWelcomeMessage(legalAge) */
export const WELCOME_MESSAGE = getWelcomeMessage(19);

export const NICOTINE_DISCLAIMER =
  'Please note that vaping products contain nicotine, which is addictive.';

export const FLAVOR_CATEGORIES = [
  { id: 'fruity', label: 'Fruity', emoji: '🍓', value: 'fruity flavors' },
  { id: 'minty', label: 'Minty', emoji: '🌿', value: 'minty flavors' },
  { id: 'menthol', label: 'Menthol', emoji: '🧊', value: 'menthol flavors' },
  { id: 'dessert', label: 'Dessert / Sweet', emoji: '🍰', value: 'dessert and sweet flavors' },
  { id: 'tobacco', label: 'Tobacco', emoji: '🚬', value: 'tobacco-style flavors' },
];

export const SUBCATEGORIES = {
  fruity: [
    { id: 'tropical', label: 'Tropical', emoji: '🍍', value: 'tropical fruity' },
    { id: 'berries', label: 'Berries', emoji: '🫐', value: 'berry fruity' },
    { id: 'citrus', label: 'Citrus', emoji: '🍊', value: 'citrus fruity' },
    { id: 'apple', label: 'Apple', emoji: '🍎', value: 'apple fruity' },
    { id: 'grape', label: 'Grape', emoji: '🍇', value: 'grape fruity' },
  ],
  minty: [
    { id: 'spearmint', label: 'Spearmint', emoji: '🌿', value: 'spearmint' },
    { id: 'peppermint', label: 'Peppermint', emoji: '🍃', value: 'peppermint' },
    { id: 'wintergreen', label: 'Wintergreen', emoji: '❄️', value: 'wintergreen mint' },
  ],
  menthol: [
    { id: 'crisp', label: 'Crisp Menthol', emoji: '❄️', value: 'crisp menthol' },
    { id: 'menthol-fruit', label: 'Menthol + Fruit', emoji: '🍓', value: 'menthol with fruit' },
    { id: 'menthol-candy', label: 'Menthol + Candy', emoji: '🍬', value: 'menthol candy' },
  ],
  dessert: [
    { id: 'cream', label: 'Creamy', emoji: '🍦', value: 'creamy dessert' },
    { id: 'bakery', label: 'Bakery', emoji: '🧁', value: 'bakery dessert' },
    { id: 'candy', label: 'Candy', emoji: '🍬', value: 'candy sweet' },
  ],
  tobacco: [
    { id: 'classic', label: 'Classic Tobacco', emoji: '🍂', value: 'classic tobacco' },
    { id: 'rich', label: 'Rich & Bold', emoji: '☕', value: 'rich bold tobacco' },
    { id: 'smooth', label: 'Smooth Blend', emoji: '🌾', value: 'smooth tobacco blend' },
  ],
};

export const ICE_OPTIONS = [
  { id: 'light', label: 'Light Ice', emoji: '❄️', value: 'light ice' },
  { id: 'heavy', label: 'Heavy Ice', emoji: '🧊', value: 'heavy ice' },
  { id: 'none', label: 'No Ice', emoji: '✨', value: 'no ice' },
];

export const INTENSITY_OPTIONS = [
  { id: 'sweet', label: 'Sweet', emoji: '🍬', value: 'sweet profile' },
  { id: 'fresh', label: 'Fresh', emoji: '🌿', value: 'fresh profile' },
  { id: 'smooth', label: 'Smooth', emoji: '💫', value: 'smooth profile' },
  { id: 'strong', label: 'Strong', emoji: '💪', value: 'strong profile' },
];

export const APPRECIATION = {
  fruity: { headline: 'Nice choice! 🍓', body: 'Fruity profiles are always a crowd favorite.' },
  minty: { headline: 'Great choice! 🌿', body: 'Minty lovers enjoy that clean, refreshing finish.' },
  menthol: { headline: 'Great choice! 🧊', body: 'Menthol lovers usually enjoy refreshing cooling sensations.' },
  dessert: { headline: 'Excellent pick! 🍰', body: 'Dessert profiles are perfect when you want something indulgent.' },
  tobacco: { headline: "You're heading in the right direction! 🚬", body: 'Tobacco-style profiles offer a classic, satisfying experience.' },
};

export const CATEGORY_PROMPT = 'What kind of flavor profile are you in the mood for?';
export const SUBCATEGORY_PROMPT = 'Let\'s narrow it down — which style sounds best to you?';
export const ICE_PROMPT = 'How much ice do you usually prefer?';
export const INTENSITY_PROMPT = 'And what kind of finish do you enjoy most?';
export const CART_PROMPT = 'Would you like to add this product to your cart?';

export function getFinalAgePrompt(legalAge = 19) {
  return `Please confirm once again that you are ${legalAge} years of age or older.`;
}

/** @deprecated Use getFinalAgePrompt(legalAge) */
export const FINAL_AGE_PROMPT = getFinalAgePrompt(19);

export function getAgeYesLabel(legalAge = 19) {
  return `Yes, I'm ${legalAge}+`;
}

export function getAppreciation(categoryId) {
  return APPRECIATION[categoryId] || {
    headline: 'Nice choice!',
    body: "That's one of our most popular profiles!",
  };
}

export function buildRecommendationQuery(preferences) {
  const parts = [];
  if (preferences.category?.value) parts.push(preferences.category.value);
  if (preferences.subcategory?.value) parts.push(preferences.subcategory.value);
  if (preferences.ice?.value) parts.push(preferences.ice.value);
  if (preferences.intensity?.value) parts.push(preferences.intensity.value);

  const profile = parts.join(', ');
  return `I'm looking for ${profile}. What would you recommend from your current inventory?`;
}

export function formatUserChoice(option) {
  if (!option) return '';
  return option.emoji ? `${option.emoji} ${option.label}` : option.label;
}
