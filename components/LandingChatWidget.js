'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Sparkles, X, Send, AlertTriangle, Minimize2 } from 'lucide-react';
import {
  getAssistantWidgetConfig,
  startAssistantSession,
  sendAssistantMessage,
} from '@/lib/assistant-public-api';
import {
  FLOW_STEPS,
  ANOTHER_REC_PROMPT,
  getAgeYesLabel,
  formatUserChoice,
  detectsRecommendationRestart,
  normalizeOptions,
} from '@/lib/chat/conversation-flow';
import TypingIndicator from '@/components/chat/TypingIndicator';
import ChatMessageList from '@/components/chat/ChatMessageList';

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
  return [{ id: nextId(), kind: 'welcome', role: 'assistant', ageActionsActive: true }];
}

function deactivateInteractiveActions(timeline) {
  return timeline.map((item) => {
    if (!item.optionsActive && !item.ageActionsActive) return item;
    return {
      ...item,
      optionsActive: false,
      ageActionsActive: false,
    };
  });
}

function productFromApi(product) {
  if (!product) return null;
  const productUrl =
    (typeof product.productUrl === 'string' && product.productUrl.trim()) ||
    (typeof product.originalProductUrl === 'string' && product.originalProductUrl.trim()) ||
    '';
  return {
    name: product.name,
    brand: product.brand,
    flavor: product.flavor || null,
    variantName: product.variantName || null,
    description: product.description || null,
    imageUrl: product.imageUrl,
    productUrl,
  };
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
  const [currentOptions, setCurrentOptions] = useState([]);
  const [recommendedProduct, setRecommendedProduct] = useState(null);

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
        JSON.stringify({ step: flowStep, timeline, recommendedProduct, currentOptions })
      );
    } catch {
      /* ignore */
    }
  }, [guidedKey, flowStep, timeline, recommendedProduct, currentOptions]);

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
        setCurrentOptions([]);
      }
    },
    [storageKey]
  );

  const applyGuidedReply = useCallback(
    (session, { appendAssistantText = true } = {}) => {
      const options = normalizeOptions(session.options);
      const replyType = session.replyType || 'text';
      const reply = session.reply || '';

      if (replyType === 'options' && options.length) {
        setTimeline((prev) => {
          const cleared = deactivateInteractiveActions(prev);
          if (appendAssistantText && reply) {
            return [
              ...cleared,
              {
                id: nextId(),
                kind: 'text',
                role: 'assistant',
                content: reply,
                options,
                optionsActive: true,
              },
            ];
          }
          // Attach options to the latest assistant text if we didn't append a new reply
          const next = [...cleared];
          for (let i = next.length - 1; i >= 0; i -= 1) {
            if (next[i].role === 'assistant' && next[i].kind === 'text') {
              next[i] = {
                ...next[i],
                options,
                optionsActive: true,
              };
              break;
            }
          }
          return next;
        });
        setCurrentOptions(options);
        setFlowStep(FLOW_STEPS.OPTIONS);
        setRecommendedProduct(null);
        return;
      }

      if (replyType === 'recommendation' || (Array.isArray(session.products) && session.products.length)) {
        const apiProduct = session.products?.[0];
        const product = productFromApi(apiProduct);
        const followUpOptions =
          options.length > 0
            ? options
            : [
                {
                  id: 'another',
                  label: 'Get Another Recommendation',
                  value: 'I want another recommendation',
                },
              ];

        setTimeline((prev) => {
          const cleared = deactivateInteractiveActions(prev);
          const items = [...cleared];
          if (product) {
            items.push({
              id: nextId(),
              kind: 'product',
              role: 'assistant',
              intro: reply,
              product,
              disclaimer: null,
            });
            items.push({
              id: nextId(),
              kind: 'text',
              role: 'assistant',
              content: ANOTHER_REC_PROMPT,
              options: followUpOptions,
              optionsActive: true,
            });
          } else if (reply) {
            items.push({
              id: nextId(),
              kind: 'text',
              role: 'assistant',
              content: reply,
              options: followUpOptions,
              optionsActive: true,
            });
          }
          return items;
        });

        setRecommendedProduct(product);
        setCurrentOptions(followUpOptions);
        setFlowStep(FLOW_STEPS.RECOMMENDATION);
        return;
      }

      setTimeline((prev) => {
        const cleared = deactivateInteractiveActions(prev);
        if (!(appendAssistantText && reply)) return cleared;
        return [
          ...cleared,
          {
            id: nextId(),
            kind: 'text',
            role: 'assistant',
            content: reply,
            options: options.length ? options : undefined,
            optionsActive: options.length > 0,
          },
        ];
      });
      setCurrentOptions(options);
      setFlowStep(session.locked ? FLOW_STEPS.LOCKED : FLOW_STEPS.FREE_CHAT);
    },
    []
  );

  const bootstrap = useCallback(async () => {
    if (!storeId) {
      setError(
        'Set NEXT_PUBLIC_DEMO_STORE_ID in frontend/.env.local or add ?storeId=YOUR_STORE_ID to the URL.'
      );
      bootstrappedRef.current = true;
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const widgetConfig = await getAssistantWidgetConfig(storeId);
      setConfig(widgetConfig);

      if (!widgetConfig.enabled) {
        const reason = widgetConfig.disabledReason;
        setError(
          reason === 'unauthorized_domain'
            ? 'This demo chatbot is not authorized for this domain. Set CLIENT_URL on the API to your Vercel URL (e.g. https://projectclient-zeta.vercel.app).'
            : reason === 'no_inventory'
              ? 'No recommendable products are available yet. Sync E-Liquid inventory in the dashboard.'
              : 'Assistant is not live for this store yet. Complete setup, sync inventory, and ensure your subscription is active.'
        );
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

      let restoredGuided = false;
      if (guidedKey) {
        try {
          const saved = sessionStorage.getItem(guidedKey);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.timeline?.length) {
              let restored = parsed.timeline;
              if (session.ageVerified) {
                restored = restored.map((item) => ({ ...item, ageActionsActive: false }));
              }
              // Only the most recent option group stays interactive
              let lastOptionsIdx = -1;
              restored.forEach((item, idx) => {
                if (item.optionsActive) lastOptionsIdx = idx;
              });
              restored = restored.map((item, idx) => ({
                ...item,
                optionsActive: idx === lastOptionsIdx,
              }));

              setTimeline(restored);
              setRecommendedProduct(parsed.recommendedProduct || null);
              setCurrentOptions(parsed.currentOptions || []);
              if (!session.locked) {
                setFlowStep(parsed.step || FLOW_STEPS.OPTIONS);
              }
              restoredGuided = true;
            }
          }
        } catch {
          /* ignore */
        }
      }

      if (!restoredGuided && session.ageVerified && !session.locked) {
        setTimeline((prev) => deactivateInteractiveActions(prev));
        setFlowStep(FLOW_STEPS.FREE_CHAT);
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to VapePass Assistant');
    } finally {
      bootstrappedRef.current = true;
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
  }, [timeline, open, minimized, sending, flowStep, currentOptions]);

  const submitMessage = useCallback(
    async (text, { silent = false } = {}) => {
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
        if (!session.locked) {
          applyGuidedReply(session);
        } else {
          const lockContent =
            session.reply ||
            session.messages?.[session.messages.length - 1]?.content ||
            'This conversation has ended.';
          setTimeline((prev) => [
            ...deactivateInteractiveActions(prev),
            {
              id: nextId(),
              kind: 'text',
              role: 'assistant',
              content: lockContent,
              variant: 'locked',
            },
          ]);
          setFlowStep(FLOW_STEPS.LOCKED);
          setCurrentOptions([]);
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
    [locked, sending, storeId, sessionKey, applySession, appendTimeline, applyGuidedReply]
  );

  const legalAge = config?.legalAge ?? 19;
  const ageYesLabel = config?.ageYesLabel ?? getAgeYesLabel(legalAge);

  const handleAgeYes = async () => {
    setTimeline((prev) => [
      ...deactivateInteractiveActions(prev),
      {
        id: nextId(),
        kind: 'text',
        role: 'user',
        content: ageYesLabel,
      },
    ]);
    setSending(true);
    try {
      const session = await sendAssistantMessage(storeId, sessionKey, ageYesLabel);
      applySession(session);
      if (!session.locked) {
        applyGuidedReply(session);
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
    setTimeline((prev) => [
      ...deactivateInteractiveActions(prev),
      {
        id: nextId(),
        kind: 'text',
        role: 'user',
        content: 'No',
      },
    ]);
    setSending(true);
    try {
      const session = await sendAssistantMessage(storeId, sessionKey, 'No');
      applySession(session);
      if (session.locked) {
        setFlowStep(FLOW_STEPS.LOCKED);
        const lockContent =
          session.reply ||
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

  const handleOptionSelect = async (option) => {
    setTimeline((prev) => [
      ...deactivateInteractiveActions(prev),
      {
        id: nextId(),
        kind: 'text',
        role: 'user',
        content: formatUserChoice(option),
      },
    ]);
    setCurrentOptions([]);
    setFlowStep(FLOW_STEPS.FETCHING);

    if (option.id === 'another') {
      setRecommendedProduct(null);
      setSending(true);
      try {
        const session = await sendAssistantMessage(
          storeId,
          sessionKey,
          option.value || 'I want another recommendation'
        );
        applySession(session);
        applyGuidedReply(session);
      } catch (err) {
        appendTimeline({
          id: nextId(),
          kind: 'text',
          role: 'assistant',
          content: err.message || 'Something went wrong. Please try again.',
        });
        setFlowStep(FLOW_STEPS.FREE_CHAT);
      } finally {
        setSending(false);
      }
      return;
    }

    // Prefer structured option id so backend matching is reliable
    await submitMessage(`::option::${option.id}`, { silent: true });
  };

  const handleAnotherRecommendation = async () => {
    setRecommendedProduct(null);
    setCurrentOptions([]);
    setTimeline((prev) => [
      ...deactivateInteractiveActions(prev),
      {
        id: nextId(),
        kind: 'text',
        role: 'user',
        content: 'I want another recommendation',
      },
    ]);
    setSending(true);
    try {
      const session = await sendAssistantMessage(
        storeId,
        sessionKey,
        'I want another recommendation'
      );
      applySession(session);
      applyGuidedReply(session);
    } catch (err) {
      appendTimeline({
        id: nextId(),
        kind: 'text',
        role: 'assistant',
        content: err.message || 'Something went wrong. Please try again.',
      });
      setFlowStep(FLOW_STEPS.FREE_CHAT);
    } finally {
      setSending(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    if (detectsRecommendationRestart(text)) {
      setInput('');
      await handleAnotherRecommendation();
      return;
    }

    setCurrentOptions([]);
    setTimeline((prev) => deactivateInteractiveActions(prev));
    await submitMessage(text);
  };

  const healthWarning =
    config?.healthWarning ||
    `Vaping products contain nicotine, which is addictive. For adults ${legalAge}+ only.`;

  const showAgeGate =
    flowStep === FLOW_STEPS.AGE_VERIFY && !ageVerified && !locked && !loading && !error && sessionKey;

  const showComposer =
    (flowStep === FLOW_STEPS.FREE_CHAT ||
      flowStep === FLOW_STEPS.RECOMMENDATION ||
      flowStep === FLOW_STEPS.LOCKED ||
      flowStep === FLOW_STEPS.OPTIONS ||
      flowStep === FLOW_STEPS.FETCHING) &&
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
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[min(380px,calc(100vw-2rem))] bg-white rounded-[24px] chat-widget-panel flex flex-col overflow-hidden animate-fade-in h-[min(560px,calc(100vh-7rem))] max-h-[min(560px,calc(100vh-7rem))]"
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
                {(config?.regionLabel || config?.legalAge) && (
                  <p className="text-[11px] text-purple-100/90 mt-0.5 leading-tight">
                    {[config?.regionLabel, config?.legalAge ? `Minimum Age: ${config.legalAge}+` : null]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                )}
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
            <AlertTriangle
              size={13}
              className="text-amber-600 flex-shrink-0 mt-0.5"
              strokeWidth={2.25}
              aria-hidden="true"
            />
            <span>{healthWarning}</span>
          </div>

          {error && (
            <div className="mx-4 mt-3 px-3 py-2.5 rounded-xl bg-danger-50 border border-red-200 text-danger-600 text-xs flex gap-2 items-start flex-shrink-0">
              <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div
            className="chat-widget-messages overflow-y-auto px-4 py-4 bg-white space-y-3 flex-1"
            role="log"
            aria-live="polite"
          >
            {loading && (
              <p className="text-center text-sm text-[#9ca3af] py-8">Loading live assistant…</p>
            )}
            {!loading && (
              <ChatMessageList
                timeline={timeline}
                sending={sending}
                legalAge={legalAge}
                showAgeActions={showAgeGate}
                onOptionSelect={handleOptionSelect}
                onAgeYes={handleAgeYes}
                onAgeNo={handleAgeNo}
              />
            )}
            {sending && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

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
