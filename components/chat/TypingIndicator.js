export default function TypingIndicator() {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="chat-widget-bubble-bot px-4 py-3.5">
        <div className="flex items-center gap-1.5 h-[18px]">
          <span className="chat-widget-typing-dot" />
          <span className="chat-widget-typing-dot" />
          <span className="chat-widget-typing-dot" />
        </div>
      </div>
    </div>
  );
}
