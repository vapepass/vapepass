import { Hand } from 'lucide-react';
import { getWelcomeMessage } from '@/lib/chat/conversation-flow';
import ChatBubble from './ChatBubble';

export default function WelcomeBubble({ legalAge = 19 }) {
  const welcome = getWelcomeMessage(legalAge);

  return (
    <ChatBubble role="assistant">
      <p className="flex items-start gap-2">
        <Hand
          size={16}
          className="mt-0.5 flex-shrink-0 text-brand-600"
          aria-hidden="true"
        />
        <span>
          {welcome.greeting} {welcome.intro}
        </span>
      </p>
      <p className="mt-3 font-semibold text-[#111827]">{welcome.question}</p>
      <p className="text-[12px] text-[#6b7280] italic mt-1">{welcome.note}</p>
    </ChatBubble>
  );
}
