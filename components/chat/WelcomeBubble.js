import { getWelcomeMessage } from '@/lib/chat/conversation-flow';
import ChatBubble from './ChatBubble';

export default function WelcomeBubble({ legalAge = 19 }) {
  const welcome = getWelcomeMessage(legalAge);

  return (
    <ChatBubble role="assistant">
      <p>
        {welcome.greeting} {welcome.intro}
      </p>
      <p className="mt-3 font-semibold text-[#111827]">{welcome.question}</p>
      <p className="text-[12px] text-[#6b7280] italic mt-1">{welcome.note}</p>
    </ChatBubble>
  );
}
