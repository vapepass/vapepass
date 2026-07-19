import ChatBubble from './ChatBubble';
import ProductRecommendationCard from './ProductRecommendationCard';
import WelcomeBubble from './WelcomeBubble';
import { stripEmojis } from '@/lib/chat/icon-map';

function TextTimelineItem({ item, legalAge }) {
  if (item.kind === 'welcome') return <WelcomeBubble legalAge={legalAge} />;

  const content = stripEmojis(item.content || '');
  if (!content) return null;

  return (
    <ChatBubble role={item.role} variant={item.variant}>
      {content.split('\n').map((line, i) => (
        <p key={i} className={i > 0 ? 'mt-2' : ''}>
          {line}
        </p>
      ))}
    </ChatBubble>
  );
}

export default function ChatMessageList({ timeline, sending, legalAge = 19 }) {
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
        return <TextTimelineItem key={item.id} item={item} legalAge={legalAge} />;
      })}
    </>
  );
}
