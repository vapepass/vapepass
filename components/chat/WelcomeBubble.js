import { Hand } from 'lucide-react';
import { getWelcomeMessage } from '@/lib/chat/conversation-flow';
import ChatBubble from './ChatBubble';

export default function WelcomeBubble({ legalAge = 19 }) {
  const welcome = getWelcomeMessage(legalAge);

  return (
    <ChatBubble role="assistant">
      <p className="flex items-start gap-2.5">
        <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <Hand size={15} aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block text-[15px] font-semibold tracking-tight text-[#111827]">
            {welcome.greeting}
          </span>
          <span className="mt-1.5 block text-[13px] leading-relaxed text-[#374151]">
            {welcome.intro}
          </span>
        </span>
      </p>
      <p className="mt-3 text-[13px] font-semibold text-[#111827]">{welcome.question}</p>
      <p className="mt-1 text-[12px] italic text-[#6b7280]">{welcome.note}</p>
    </ChatBubble>
  );
}
