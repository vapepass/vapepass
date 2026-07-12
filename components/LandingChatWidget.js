'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Sparkles, X, Send, AlertTriangle, Minimize2, ShoppingCart } from 'lucide-react';
import {
  getAssistantWidgetConfig,
  startAssistantSession,
  sendAssistantMessage,
} from '@/lib/assistant-public-api';
import {
  FLOW_STEPS,
  FLAVOR_CATEGORIES,
  SUBCATEGORIES,
  ICE_OPTIONS,
  INTENSITY_OPTIONS,
  CATEGORY_PROMPT,
  SUBCATEGORY_PROMPT,
  ICE_PROMPT,
  INTENSITY_PROMPT,
  CART_PROMPT,
  getFinalAgePrompt,
  getAgeYesLabel,
  getAppreciation,
  buildRecommendationQuery,
  formatUserChoice,
} from '@/lib/chat/conversation-flow';
import { parseAssistantMessage } from '@/lib/chat/parse-assistant-message';
import TypingIndicator from '@/components/chat/TypingIndicator';
import ChatMessageList from '@/components/chat/ChatMessageList';
import OptionChips from '@/components/chat/OptionChips';

const SESSION_KEY_PREFIX = 'vapepass_landing_session_';
const GUIDED_KEY_PREFIX = 'vapepass_guided_state_';

let msgId = 0;
function nextId() {
  msgId += 1;
  return `msg-${msgId}-${Date.now()}`;
}

function resolveStoreId(searchParams) {
  const fromUrl = searchParams.get('storeId') || searchParams.get('assistantStoreId');
  if (fromUrl) return fromUrl.trim();
  return (process.env.NEXT_PUBLIC_DEMO_STORE_ID || '').trim() || null;
}

function createWelcomeTimeline() {
  return [{ id: nextId(), kind: 'welcome', role: 'assistant' }];
}

export default function LandingChatWidget() {
  const searchParams = useSearchParams();
  const storeId = resolveStoreId(searchParams);

  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [config, setConfig] = useState(null);
  const [sessionKey, setSessionKey] = useState(null);
  const [ageVerified, setAgeVerified] = useState(false);
  const [locked, setLocked] = useState(false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [flowStep, setFlowStep] = useState(FLOW_STEPS.AGE_VERIFY);
  const [timeline, setTimeline] = useState(createWelcomeTimeline);
  const [preferences, setPreferences] = useState({});
  const [recommendedProduct, setRecommendedProduct] = useState(null);
  const [cartAdded, setCartAdded] = useState(false);

  const messagesEndRef = useRef(null);
  const bootstrappedRef = useRef(false);

  const storageKey = storeId ? `${SESSION_KEY_PREFIX}${storeId}` : null;
  const guidedKey = storeId ? `${GUIDED_KEY_PREFIX}${storeId}` : null;

  const appendTimeline = useCallback((items) => {
    setTimeline((prev) => [...prev, ...(Array.isArray(items) ? items : [items])]);
  }, []);

  useEffect(() => {
    if (!guidedKey || !bootstrappedRef.current) return;
    try {
      sessionStorage.setItem(
        guidedKey,
        JSON.stringify({ step: flowStep, preferences, timeline, recommendedProduct })
      );
    } catch {
      /* ignore */
    }
  }, [guidedKey, flowStep, preferences, timeline, recommendedProduct]);

  const applySession = useCallback(
    (session) => {
      setSessionKey(session.sessionKey);
      if (storageKey) {
        try {
          sessionStorage.setItem(storageKey, session.sessionKey);
        } catch {
          /* ignore */
        }
      }
      setAgeVerified(Boolean(session.ageVerified));
      setLocked(Boolean(session.locked));

      if (session.locked) {
        setFlowStep(FLOW_STEPS.LOCKED);
        const lockMsg =
          [...(session.messages || [])].reverse().find((m) => m.role === 'assistant')?.content;
        if (lockMsg) {
          setTimeline((prev) => [
            ...prev.filter((t) => t.kind !== 'welcome'),
            { id: nextId(), kind: 'text', role: 'assistant', content: lockMsg, variant: 'locked' },
          ]);
        }
      }
    },
    [storageKey]
  );

  const bootstrap = useCallback(async () => {
    if (!storeId) {
      setError('Set NEXT_PUBLIC_DEMO_STORE_ID in frontend/.env.local or add ?storeId=YOUR_STORE_ID to the URL.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const widgetConfig = await getAssistantWidgetConfig(storeId);
      setConfig(widgetConfig);

      if (!widgetConfig.enabled) {
        setError(
          'Assistant is not live for this store yet. Add a store URL, sync inventory, and ensure products are available in the dashboard.'
        );
        setLoading(false);
        return;
      }

      let existingKey = null;
      if (storageKey) {
        try {
          existingKey = sessionStorage.getItem(storageKey);
        } catch {
          /* ignore */
        }
      }

      const session = await startAssistantSession(storeId, existingKey || undefined);
      applySession(session);

      if (guidedKey) {
        try {
          const saved = sessionStorage.getItem(guidedKey);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.timeline?.length) {
              setTimeline(parsed.timeline);
              setPreferences(parsed.preferences || {});
              setRecommendedProduct(parsed.recommendedProduct || null);
              if (!session.locked) {
                setFlowStep(parsed.step || FLOW_STEPS.CATEGORY);
              }
            }
          }
        } catch {
          /* ignore */
        }
      }

      if (session.ageVerified && !session.locked) {
        setFlowStep((step) => {
          if (step === FLOW_STEPS.AGE_VERIFY) {
            setTimeline((prev) => {
              if (prev.some((t) => t.kind === 'welcome') && !prev.some((t) => t.content === CATEGORY_PROMPT)) {
                return [
                  ...prev,
                  { id: nextId(), kind: 'text', role: 'assistant', content: CATEGORY_PROMPT },
                ];
              }
              return prev;
            });
            return FLOW_STEPS.CATEGORY;
          }
          return step;
        });
      }

      bootstrappedRef.current = true;
    } catch (err) {
      setError(err.message || 'Unable to connect to VapePass Assistant');
    } finally {
      setLoading(false);
    }
  }, [storeId, storageKey, guidedKey, applySession]);

  useEffect(() => {
    if (open && !bootstrappedRef.current && !loading) {
      bootstrap();
    }
  }, [open, bootstrap, loading]);

  useEffect(() => {
    if (open && !minimized) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [timeline, open, minimized, sending, flowStep]);

  const addAssistantReply = useCallback(
    (session) => {
      const lastAssistant = [...(session.messages || [])]
        .reverse()
        .find((m) => m.role === 'assistant');
      if (!lastAssistant?.content) return;

      const parsed = parseAssistantMessage(lastAssistant.content);
      if (parsed.type === 'recommendation' && parsed.products.length) {
        const primary = parsed.products[0];
        setRecommendedProduct(primary);
        appendTimeline([
          {
            id: nextId(),
            kind: 'product',
            role: 'assistant',
            intro: parsed.intro,
            product: primary,
            disclaimer: parsed.disclaimer,
          },
          { id: nextId(), kind: 'text', role: 'assistant', content: CART_PROMPT },
        ]);
        setFlowStep(FLOW_STEPS.CART_PROMPT);
      } else {
        appendTimeline({
          id: nextId(),
          kind: 'text',
          role: 'assistant',
          content: lastAssistant.content,
        });
      }
    },
    [appendTimeline]
  );

  const submitMessage = useCallback(
    async (text, { silent = false, skipAssistantReply = false } = {}) => {
      const trimmed = text.trim();
      if (!trimmed || locked || sending || !storeId || !sessionKey) return null;

      setSending(true);
      setInput('');

      if (!silent) {
        appendTimeline({
          id: nextId(),
          kind: 'text',
          role: 'user',
          content: trimmed,
        });
      }

      try {
        const session = await sendAssistantMessage(storeId, sessionKey, trimmed);
        applySession(session);
        if (!skipAssistantReply && !session.locked) {
          addAssistantReply(session);
        }
        return session;
      } catch (err) {
        appendTimeline({
          id: nextId(),
          kind: 'text',
          role: 'assistant',
          content: err.message || 'Something went wrong. Please try again.',
        });
        return null;
      } finally {
        setSending(false);
      }
    },
    [locked, sending, storeId, sessionKey, applySession, appendTimeline, addAssistantReply]
  );

  const legalAge = config?.legalAge ?? 19;
  const ageYesLabel = config?.ageYesLabel ?? getAgeYesLabel(legalAge);

  const handleAgeYes = async () => {
    appendTimeline({
      id: nextId(),
      kind: 'text',
      role: 'user',
      content: ageYesLabel,
    });
    setSending(true);
    try {
      const session = await sendAssistantMessage(storeId, sessionKey, ageYesLabel);
      applySession(session);
      if (!session.locked) {
        setFlowStep(FLOW_STEPS.CATEGORY);
        appendTimeline({
          id: nextId(),
          kind: 'text',
          role: 'assistant',
          content: CATEGORY_PROMPT,
        });
      }
    } catch (err) {
      appendTimeline({
        id: nextId(),
        kind: 'text',
        role: 'assistant',
        content: err.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setSending(false);
    }
  };

  const handleAgeNo = async () => {
    appendTimeline({
      id: nextId(),
      kind: 'text',
      role: 'user',
      content: 'No',
    });
    setSending(true);
    try {
      const session = await sendAssistantMessage(storeId, sessionKey, 'No');
      applySession(session);
      if (session.locked) {
        setFlowStep(FLOW_STEPS.LOCKED);
        const lockContent =
          session.messages?.[session.messages.length - 1]?.content ||
          'This conversation has ended.';
        appendTimeline({
          id: nextId(),
          kind: 'text',
          role: 'assistant',
          content: lockContent,
          variant: 'locked',
        });
        setTimeout(() => setOpen(false), 1200);
      }
    } catch (err) {
      appendTimeline({
        id: nextId(),
        kind: 'text',
        role: 'assistant',
        content: err.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setSending(false);
    }
  };

  const handleCategorySelect = (category) => {
    const prefs = { ...preferences, category };
    setPreferences(prefs);
    const appreciation = getAppreciation(category.id);

    appendTimeline([
      { id: nextId(), kind: 'text', role: 'user', content: formatUserChoice(category) },
      {
        id: nextId(),
        kind: 'text',
        role: 'assistant',
        content: `${appreciation.headline}\n${appreciation.body}`,
      },
      { id: nextId(), kind: 'text', role: 'assistant', content: SUBCATEGORY_PROMPT },
    ]);
    setFlowStep(FLOW_STEPS.SUBCATEGORY);
  };

  const handleSubcategorySelect = (subcategory) => {
    const prefs = { ...preferences, subcategory };
    setPreferences(prefs);
    appendTimeline([
      { id: nextId(), kind: 'text', role: 'user', content: formatUserChoice(subcategory) },
      { id: nextId(), kind: 'text', role: 'assistant', content: ICE_PROMPT },
    ]);
    setFlowStep(FLOW_STEPS.ICE);
  };

  const handleIceSelect = (ice) => {
    const prefs = { ...preferences, ice };
    setPreferences(prefs);
    appendTimeline([
      { id: nextId(), kind: 'text', role: 'user', content: formatUserChoice(ice) },
      { id: nextId(), kind: 'text', role: 'assistant', content: INTENSITY_PROMPT },
    ]);
    setFlowStep(FLOW_STEPS.INTENSITY);
  };

  const handleIntensitySelect = async (intensity) => {
    const prefs = { ...preferences, intensity };
    setPreferences(prefs);
    appendTimeline({ id: nextId(), kind: 'text', role: 'user', content: formatUserChoice(intensity) });
    setFlowStep(FLOW_STEPS.FETCHING_REC);

    const query = buildRecommendationQuery(prefs);
    const session = await submitMessage(query, { silent: true, skipAssistantReply: true });

    if (session && !session.locked) {
      const lastAssistant = [...(session.messages || [])]
        .reverse()
        .find((m) => m.role === 'assistant');
      const parsed = parseAssistantMessage(lastAssistant?.content || '');

      if (parsed.type === 'recommendation' && parsed.products.length) {
        const primary = parsed.products[0];
        setRecommendedProduct(primary);
        appendTimeline({
          id: nextId(),
          kind: 'product',
          role: 'assistant',
          intro: parsed.intro,
          product: primary,
          disclaimer: parsed.disclaimer,
        });
        appendTimeline({
          id: nextId(),
          kind: 'text',
          role: 'assistant',
          content: CART_PROMPT,
        });
        setFlowStep(FLOW_STEPS.CART_PROMPT);
      } else {
        appendTimeline({
          id: nextId(),
          kind: 'text',
          role: 'assistant',
          content: lastAssistant?.content || 'Let me know if you\'d like to explore other options.',
        });
        setFlowStep(FLOW_STEPS.FREE_CHAT);
      }
    }
  };

  const handleCartYes = () => {
    appendTimeline({ id: nextId(), kind: 'text', role: 'user', content: 'Yes, add to cart' });
    appendTimeline({
      id: nextId(),
      kind: 'text',
      role: 'assistant',
      content: getFinalAgePrompt(legalAge),
    });
    setFlowStep(FLOW_STEPS.FINAL_AGE);
  };

  const handleCartNo = () => {
    appendTimeline({ id: nextId(), kind: 'text', role: 'user', content: 'Not right now' });
    appendTimeline({
      id: nextId(),
      kind: 'text',
      role: 'assistant',
      content: 'No problem! Feel free to explore other profiles or ask me anything else.',
    });
    setFlowStep(FLOW_STEPS.FREE_CHAT);
  };

  const handleFinalAgeYes = () => {
    appendTimeline({ id: nextId(), kind: 'text', role: 'user', content: ageYesLabel });
    appendTimeline({
      id: nextId(),
      kind: 'text',
      role: 'assistant',
      content: 'Perfect — you\'re all set to add this to your cart.',
    });
    setFlowStep(FLOW_STEPS.ADD_TO_CART);
  };

  const handleFinalAgeNo = () => {
    appendTimeline({ id: nextId(), kind: 'text', role: 'user', content: 'No' });
    setFlowStep(FLOW_STEPS.FREE_CHAT);
    setTimeout(() => setOpen(false), 1200);
  };

  const handleAddToCart = () => {
    setCartAdded(true);
    appendTimeline({
      id: nextId(),
      kind: 'text',
      role: 'assistant',
      content: `🎉 ${recommendedProduct?.name || 'Product'} has been added to your cart!`,
    });
    setFlowStep(FLOW_STEPS.FREE_CHAT);
  };

  const handleSend = (e) => {
    e.preventDefault();
    submitMessage(input);
  };

  const currentOptions = useMemo(() => {
    switch (flowStep) {
      case FLOW_STEPS.CATEGORY:
        return FLAVOR_CATEGORIES;
      case FLOW_STEPS.SUBCATEGORY:
        return SUBCATEGORIES[preferences.category?.id] || [];
      case FLOW_STEPS.ICE:
        return ICE_OPTIONS;
      case FLOW_STEPS.INTENSITY:
        return INTENSITY_OPTIONS;
      default:
        return null;
    }
  }, [flowStep, preferences.category?.id]);

  const handleOptionSelect = (option) => {
    if (flowStep === FLOW_STEPS.CATEGORY) handleCategorySelect(option);
    else if (flowStep === FLOW_STEPS.SUBCATEGORY) handleSubcategorySelect(option);
    else if (flowStep === FLOW_STEPS.ICE) handleIceSelect(option);
    else if (flowStep === FLOW_STEPS.INTENSITY) handleIntensitySelect(option);
  };

  const healthWarning =
    config?.healthWarning ||
    `Vaping products contain nicotine, which is addictive. For adults ${legalAge}+ only.`;

  const showAgeButtons =
    flowStep === FLOW_STEPS.AGE_VERIFY && !ageVerified && !locked && !loading && !error && sessionKey;

  const showOptionChips = currentOptions?.length > 0 && !sending && !locked;

  const showCartButtons = flowStep === FLOW_STEPS.CART_PROMPT && !sending;
  const showFinalAgeButtons = flowStep === FLOW_STEPS.FINAL_AGE && !sending;
  const showAddToCartButton = flowStep === FLOW_STEPS.ADD_TO_CART && !cartAdded;

  const showComposer =
    (flowStep === FLOW_STEPS.FREE_CHAT || flowStep === FLOW_STEPS.LOCKED) &&
    (ageVerified || locked);

  const handleOpen = () => {
    setOpen(true);
    setMinimized(false);
  };

  const handleClose = () => {
    setOpen(false);
    setMinimized(false);
  };

  return (
    <>
      {open && minimized && (
        <div
          className="fixed bottom-24 right-4 sm:right-6 z-50 chat-widget-header chat-widget-panel w-[min(380px,calc(100vw-2rem))] px-4 py-3.5 flex items-center justify-between gap-3 rounded-[24px] animate-fade-in"
          role="region"
          aria-label="Minimized chat"
        >
          <button
            type="button"
            onClick={() => setMinimized(false)}
            className="flex items-center gap-3 min-w-0 flex-1 text-left"
            aria-label="Restore chat"
          >
            <div className="w-8 h-8 rounded-full chat-widget-header-icon flex items-center justify-center flex-shrink-0">
              <Sparkles size={15} className="text-white" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-[15px] text-white tracking-[-0.01em] truncate">
                AI Flavor Sommelier
              </p>
              <p className="text-[11px] text-white/75 truncate">Powered by VapePass</p>
            </div>
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center text-white/90 hover:text-white transition-colors flex-shrink-0"
            aria-label="Close chat"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {open && !minimized && (
        <div
          className={`fixed bottom-24 right-4 sm:right-6 z-50 w-[min(380px,calc(100vw-2rem))] bg-white rounded-[24px] chat-widget-panel flex flex-col overflow-hidden animate-fade-in ${
            showAgeButtons
              ? 'h-fit max-h-none'
              : 'h-[min(560px,calc(100vh-7rem))] max-h-[min(560px,calc(100vh-7rem))]'
          }`}
          role="dialog"
          aria-label="AI Flavor Sommelier"
        >
          <div className="chat-widget-header px-4 py-3.5 flex items-center justify-between gap-3 flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full chat-widget-header-icon flex items-center justify-center flex-shrink-0">
                <Sparkles size={17} className="text-white" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-[15px] text-white tracking-[-0.01em] leading-tight">
                  AI Flavor Sommelier
                </p>
                <p className="text-[12px] text-purple-200 mt-0.5 leading-tight">Powered by VapePass</p>
              </div>
            </div>
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <button
                type="button"
                onClick={() => setMinimized(true)}
                className="w-8 h-8 flex items-center justify-center text-white/90 hover:text-white transition-colors"
                aria-label="Minimize chat"
              >
                <Minimize2 size={17} strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center text-white/90 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>
          </div>

          <div
            className="chat-widget-warning px-4 py-2.5 flex items-start gap-2 text-[12px] leading-snug font-medium flex-shrink-0"
            role="note"
          >
            <span className="flex items-center gap-0.5 flex-shrink-0 mt-0.5" aria-hidden="true">
              <AlertTriangle size={13} className="text-amber-600" strokeWidth={2.25} />
              <AlertTriangle size={13} className="text-amber-500 fill-amber-400" strokeWidth={2} />
            </span>
            <span>{healthWarning}</span>
          </div>

          {error && (
            <div className="mx-4 mt-3 px-3 py-2.5 rounded-xl bg-danger-50 border border-red-200 text-danger-600 text-xs flex gap-2 items-start flex-shrink-0">
              <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div
            className={`chat-widget-messages overflow-y-auto px-4 py-4 bg-white space-y-3 ${
              showAgeButtons ? 'flex-none' : 'flex-1'
            }`}
            role="log"
            aria-live="polite"
          >
            {loading && (
              <p className="text-center text-sm text-[#9ca3af] py-8">Loading live assistant…</p>
            )}
            {!loading && <ChatMessageList timeline={timeline} legalAge={legalAge} />}
            {sending && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {showAgeButtons && (
            <div className="px-4 pb-5 pt-2 flex-shrink-0 animate-fade-in bg-white">
              <div className="chat-widget-age-actions">
                <button
                  type="button"
                  onClick={handleAgeYes}
                  disabled={sending}
                  className="chat-widget-age-yes h-11 disabled:opacity-50"
                >
                  Yes, I&apos;m {legalAge}+
                </button>
                <button
                  type="button"
                  onClick={handleAgeNo}
                  disabled={sending}
                  className="chat-widget-age-no h-11 disabled:opacity-50"
                >
                  No
                </button>
              </div>
            </div>
          )}

          {showOptionChips && (
            <div className="px-4 pb-4 pt-1 flex-shrink-0">
              <OptionChips
                options={currentOptions}
                onSelect={handleOptionSelect}
                disabled={sending}
                columns={flowStep === FLOW_STEPS.CATEGORY ? 2 : 2}
              />
            </div>
          )}

          {showCartButtons && (
            <div className="px-4 pb-4 pt-1 flex gap-2.5 flex-shrink-0 animate-fade-in">
              <button
                type="button"
                onClick={handleCartYes}
                className="chat-widget-age-yes flex-1 h-11 text-[14px]"
              >
                Yes, add to cart
              </button>
              <button
                type="button"
                onClick={handleCartNo}
                className="chat-widget-age-no flex-1 h-11 text-[14px]"
              >
                Not now
              </button>
            </div>
          )}

          {showFinalAgeButtons && (
            <div className="px-4 pb-5 pt-2 flex-shrink-0 animate-fade-in bg-white">
              <div className="chat-widget-age-actions">
                <button
                  type="button"
                  onClick={handleFinalAgeYes}
                  className="chat-widget-age-yes h-11"
                >
                  Yes, I&apos;m {legalAge}+
                </button>
                <button
                  type="button"
                  onClick={handleFinalAgeNo}
                  className="chat-widget-age-no h-11"
                >
                  No
                </button>
              </div>
            </div>
          )}

          {showAddToCartButton && (
            <div className="px-4 pb-4 pt-1 flex-shrink-0 animate-fade-in">
              <button
                type="button"
                onClick={handleAddToCart}
                className="chat-widget-add-cart w-full h-12 flex items-center justify-center gap-2 text-[14px] font-semibold text-white"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>
            </div>
          )}

          {showComposer && (
            <>
              <p className="px-4 py-2 text-[11px] text-[#9ca3af] border-t border-[#f3f4f6] bg-white flex-shrink-0">
                {locked
                  ? 'Conversation locked'
                  : `Recommendations from ${config?.storeName || 'store'} inventory only`}
              </p>
              <form
                onSubmit={handleSend}
                className="flex gap-2 px-4 pb-4 pt-1 bg-white flex-shrink-0"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={locked ? 'Conversation ended' : 'Type a message…'}
                  disabled={locked || sending || loading || Boolean(error) || !sessionKey}
                  maxLength={2000}
                  className="chat-widget-input flex-1 h-11 px-4 text-[13px] text-[#1f2937] placeholder:text-[#9ca3af] disabled:bg-[#f9fafb] disabled:text-[#9ca3af]"
                />
                <button
                  type="submit"
                  disabled={
                    locked || sending || loading || Boolean(error) || !input.trim() || !sessionKey
                  }
                  className="chat-widget-send h-11 w-11 flex items-center justify-center text-white disabled:opacity-50"
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </form>
            </>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => (open ? handleClose() : handleOpen())}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full chat-widget-header hero-fab flex items-center justify-center text-white transition-all duration-200 hover:scale-105 hover:brightness-110 active:scale-100"
        aria-label={open ? 'Close AI Flavor Sommelier' : 'Open AI Flavor Sommelier'}
        aria-expanded={open}
      >
        {open ? <X size={22} aria-hidden="true" /> : <Sparkles size={22} aria-hidden="true" />}
      </button>
    </>
  );
}
