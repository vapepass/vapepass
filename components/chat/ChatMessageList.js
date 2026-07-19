import ChatBubble from './ChatBubble';
import ProductRecommendationCard from './ProductRecommendationCard';
import WelcomeBubble from './WelcomeBubble';
import { stripEmojis } from '@/lib/chat/icon-map';

/** Only age-gate buttons — the rest of the chat is free-text. */
function AgeActionButtons({ onYes, onNo, disabled }) {
  return (
    <div className="chat-widget-age-actions animate-fade-in max-w-[92%]">
      <button
        type="button"
        onClick={onYes}
        disabled={disabled}
        className="chat-widget-age-yes h-11 disabled:opacity-50"
      >
        Yes
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
  onAgeYes,
  onAgeNo,
}) {
  if (item.kind === 'welcome') {
    return (
      <div className="space-y-3">
        <WelcomeBubble legalAge={legalAge} />
        {item.ageActionsActive && showAgeActions ? (
          <AgeActionButtons onYes={onAgeYes} onNo={onAgeNo} disabled={sending} />
        ) : null}
      </div>
    );
  }

  const content = stripEmojis(item.content || '');
  if (!content) return null;

  return (
    <div className="space-y-2.5">
      <ChatBubble role={item.role} variant={item.variant}>
        {content.split('\n').map((line, i) =>
          line.trim() ? (
            <p key={i} className={i > 0 ? 'mt-2' : ''}>
              {line}
            </p>
          ) : (
            <span key={i} className="block h-1.5" aria-hidden="true" />
          )
        )}
      </ChatBubble>
    </div>
  );
}

export default function ChatMessageList({
  timeline,
  sending = false,
  legalAge = 19,
  showAgeActions = false,
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
              lookingFor={item.lookingFor}
              variants={item.variants}
              matchIntent={item.matchIntent}
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
            onAgeYes={onAgeYes}
            onAgeNo={onAgeNo}
          />
        );
      })}
    </>
  );
}
