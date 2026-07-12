export default function ChatBubble({ role, children, variant = 'default', className = '' }) {
  const isUser = role === 'user';
  const isLocked = variant === 'locked';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in ${className}`}>
      <div
        className={`max-w-[88%] px-4 py-3.5 text-[13px] leading-[1.6] ${
          isUser
            ? 'chat-widget-bubble-user'
            : isLocked
              ? 'chat-widget-bubble-locked'
              : 'chat-widget-bubble-bot'
        }`}
      >
        {children}
      </div>
    </div>
  );
}
