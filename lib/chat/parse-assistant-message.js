import { NICOTINE_DISCLAIMER } from './conversation-flow';

const DISCLAIMER_PATTERNS = [
  /please note that vaping products contain nicotine[^.!?]*[.!?]?/gi,
  /vaping products contain nicotine[^.!?]*[.!?]?/gi,
  /nicotine is highly addictive[^.!?]*[.!?]?/gi,
  /warning:\s*vaping products[^.!?]*[.!?]?/gi,
];

const PRODUCT_INTRO_PATTERNS = [
  /(?:you might like|try|recommend|suggest|from our (?:current )?inventory)[:\s]+(.+)/i,
  /(?:i'd suggest|great option[s]?)[:\s]+(.+)/i,
];

function stripDisclaimer(text) {
  let body = text;
  let disclaimer = null;

  for (const pattern of DISCLAIMER_PATTERNS) {
    const match = body.match(pattern);
    if (match) {
      disclaimer = match[0].trim();
      body = body.replace(pattern, '').trim();
    }
  }

  return { body, disclaimer: disclaimer || NICOTINE_DISCLAIMER };
}

function splitProductNames(segment) {
  return segment
    .split(/\s*(?:,|\bor\b|\band\b)\s*/i)
    .map((s) => s.replace(/^[\s:—-]+|[\s.!?]+$/g, '').trim())
    .filter((s) => s.length > 2 && !/^(the|a|an|our|your)$/i.test(s));
}

function extractProducts(body) {
  const products = [];

  for (const pattern of PRODUCT_INTRO_PATTERNS) {
    const match = body.match(pattern);
    if (match?.[1]) {
      const names = splitProductNames(match[1]);
      for (const name of names.slice(0, 3)) {
        if (name.length >= 3) {
          products.push({ name, description: '' });
        }
      }
      if (products.length) break;
    }
  }

  if (!products.length) {
    const capitalized = body.match(/\b([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){0,3})\b/g);
    if (capitalized) {
      const filtered = capitalized.filter(
        (n) =>
          !/^(From|Try|You|I|The|Our|Thanks|Please|Great|Nice|Excellent)/.test(n) &&
          n.length >= 4
      );
      for (const name of filtered.slice(0, 2)) {
        products.push({ name, description: '' });
      }
    }
  }

  return products;
}

function buildDescriptions(body, products) {
  const sentences = body.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [body];

  return products.map((product) => {
    const related = sentences.find((s) =>
      s.toLowerCase().includes(product.name.toLowerCase())
    );
    if (related) {
      return {
        ...product,
        description: related.replace(new RegExp(product.name, 'i'), '').replace(/^[\s,:-]+/, '').trim(),
      };
    }

    const generic = sentences.find(
      (s) =>
        !PRODUCT_INTRO_PATTERNS.some((p) => p.test(s)) &&
        s.length > 20 &&
        !s.toLowerCase().includes('inventory')
    );

    return {
      ...product,
      description: generic?.trim() || 'A great match based on your flavor preferences.',
    };
  });
}

/**
 * Parse an AI assistant reply into displayable recommendation content.
 */
export function parseAssistantMessage(content) {
  if (!content || typeof content !== 'string') {
    return { type: 'text', body: content || '', products: [], disclaimer: NICOTINE_DISCLAIMER };
  }

  const { body, disclaimer } = stripDisclaimer(content);
  const products = extractProducts(body);

  if (products.length === 0) {
    return { type: 'text', body: content, products: [], disclaimer: null };
  }

  const enriched = buildDescriptions(body, products);
  const intro = body
    .replace(PRODUCT_INTRO_PATTERNS[0], '')
    .replace(/you might like[^.]*\.?/i, '')
    .trim();

  return {
    type: 'recommendation',
    intro: intro.length > 10 ? intro : 'Based on your preferences, here\'s what I\'d suggest:',
    products: enriched,
    disclaimer,
  };
}

export function isRecommendationMessage(content) {
  return parseAssistantMessage(content).type === 'recommendation';
}
