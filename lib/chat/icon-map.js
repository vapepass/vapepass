/**
 * Map API / legacy emoji markers to Lucide icons for consistent UI.
 * Prefer icons over emoji characters in all customer-facing surfaces.
 */

import {
  Apple,
  Cherry,
  Citrus,
  Flame,
  Grape,
  Hand,
  Leaf,
  Snowflake,
  Sparkles,
  Star,
  Droplets,
  Candy,
  Coffee,
  IceCreamCone,
  CircleDot,
  Wheat,
  CupSoda,
  Anvil,
  Sandwich,
  Cookie,
  Cigarette,
  PartyPopper,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Heart,
  Lock,
  Unlock,
  Mail,
  Phone,
  Globe,
  ShoppingCart,
  Search,
  Settings,
  Store,
  User,
  Bot,
  Zap,
} from 'lucide-react';

/** @type {Record<string, import('lucide-react').LucideIcon>} */
export const EMOJI_TO_ICON = {
  '✨': Sparkles,
  '💫': Sparkles,
  '⭐': Star,
  '🌟': Star,
  '👋': Hand,
  '❄️': Snowflake,
  '🧊': Snowflake,
  '🌿': Leaf,
  '🍃': Leaf,
  '🌱': Leaf,
  '🌾': Wheat,
  '🔥': Flame,
  '💧': Droplets,
  '🍬': Candy,
  '🍭': Candy,
  '🍰': Cookie,
  '🧁': Cookie,
  '🍪': Cookie,
  '☕': Coffee,
  '🍦': IceCreamCone,
  '🍨': IceCreamCone,
  '🍇': Grape,
  '🫐': Grape,
  '🍉': Citrus,
  '🍋': Citrus,
  '🍊': Citrus,
  '🍍': Citrus,
  '🍓': Cherry,
  '🍎': Apple,
  '🍏': Apple,
  '🍂': Leaf,
  '🚬': Cigarette,
  '💪': Anvil,
  '🥤': CupSoda,
  '🥪': Sandwich,
  '🎉': PartyPopper,
  '✅': CheckCircle2,
  '❌': XCircle,
  '⚠️': AlertTriangle,
  'ℹ️': Info,
  '❤️': Heart,
  '🔒': Lock,
  '🔓': Unlock,
  '📧': Mail,
  '📞': Phone,
  '🌐': Globe,
  '🛒': ShoppingCart,
  '🔍': Search,
  '⚙️': Settings,
  '🏪': Store,
  '👤': User,
  '🧠': Bot,
  '⚡': Zap,
  '•': CircleDot,
};

/**
 * Strip emoji / pictograph characters from a string (for clean message text).
 */
export function stripEmojis(value) {
  return String(value || '')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu, '')
    .replace(/[→👉💨⚡🔒]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Resolve a Lucide icon for a chatbot option chip.
 * Uses API emoji when mapped; otherwise light label heuristics.
 */
export function resolveOptionIcon(option) {
  if (!option) return null;

  const emoji = String(option.emoji || '').trim();
  if (emoji && EMOJI_TO_ICON[emoji]) {
    return EMOJI_TO_ICON[emoji];
  }

  // Multi-codepoint / variation-selector safe: try first grapheme via Array.from
  if (emoji) {
    const first = Array.from(emoji)[0];
    if (first && EMOJI_TO_ICON[first]) return EMOJI_TO_ICON[first];
  }

  const label = String(option.label || option.value || '').toLowerCase();
  if (/\b(ice|cool|frost|menthol|freeze)\b/.test(label)) return Snowflake;
  if (/\b(no ice|room temp|warm)\b/.test(label)) return Leaf;
  if (/\b(fruit|berry|citrus|tropical|mango|grape|melon)\b/.test(label)) return Grape;
  if (/\b(sweet|candy|dessert)\b/.test(label)) return Candy;
  if (/\b(coffee|tobacco|rich)\b/.test(label)) return Coffee;
  if (/\b(another|recommend|again|spark)\b/.test(label)) return Sparkles;
  if (emoji) return Sparkles;

  return null;
}
