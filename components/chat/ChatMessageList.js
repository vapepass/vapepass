import ChatBubble from './ChatBubble';
import ProductRecommendationCard from './ProductRecommendationCard';
import WelcomeBubble from './WelcomeBubble';
import OptionChips from './OptionChips';
import { stripEmojis } from '@/lib/chat/icon-map';

function AgeActionButtons({ legalAge, onYes, onNo, disabled }) {
  return (
    <div className="chat-widget-age-actions animate-fade-in max-w-[92%]">
      <button
        type="button"
        onClick={onYes}
        disabled={disabled}
        className="chat-widget-age-yes h-11 disabled:opacity-50"
      >
        Yes, I&apos;m {legalAge}+
      </button>
      <button
        type="button"
        onClick={onNo}
        disabled={disabled}
        className="chat-widget-age-no h-11 disabled:opacity-50"
      >
        No
      </button>
    </div>
  );
}

function TextTimelineItem({
  item,
  legalAge,
  sending,
  showAgeActions,
  onOptionSelect,
  onAgeYes,
  onAgeNo,
}) {
  if (item.kind === 'welcome') {
    return (
      <div className="space-y-2.5">
        <WelcomeBubble legalAge={legalAge} />
        {item.ageActionsActive && showAgeActions ? (
          <AgeActionButtons
            legalAge={legalAge}
            onYes={onAgeYes}
            onNo={onAgeNo}
            disabled={sending}
          />
        ) : null}
      </div>
    );
  }

  const content = stripEmojis(item.content || '');
  if (!content && !item.options?.length) return null;

  const hasOptions = Array.isArray(item.options) && item.options.length > 0;
  const optionsInteractive = Boolean(item.optionsActive) && !sending;

  return (
    <div className="space-y-2.5">
      {content ? (
        <ChatBubble role={item.role} variant={item.variant}>
          {content.split('\n').map((line, i) => (
            <p key={i} className={i > 0 ? 'mt-2' : ''}>
              {line}
            </p>
          ))}
        </ChatBubble>
      ) : null}

      {hasOptions && item.role === 'assistant' ? (
        <div className="max-w-[92%]">
          <OptionChips
            options={item.options}
            onSelect={onOptionSelect}
            disabled={!optionsInteractive}
            columns={2}
          />
        </div>
      ) : null}
    </div>
  );
}

export default function ChatMessageList({
  timeline,
  sending = false,
  legalAge = 19,
  showAgeActions = false,
  onOptionSelect,
  onAgeYes,
  onAgeNo,
}) {
  return (
    <>
      {timeline.map((item) => {
        if (item.kind === 'product') {
          return (
            <ProductRecommendationCard
              key={item.id}
              intro={item.intro}
              product={item.product}
              disclaimer={item.disclaimer}
            />
          );
        }
        return (
          <TextTimelineItem
            key={item.id}
            item={item}
            legalAge={legalAge}
            sending={sending}
            showAgeActions={showAgeActions}
            onOptionSelect={onOptionSelect}
            onAgeYes={onAgeYes}
            onAgeNo={onAgeNo}
          />
        );
      })}
    </>
  );
}
