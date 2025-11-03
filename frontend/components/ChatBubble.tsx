import clsx from "clsx";

export interface ChatBubbleProps {
  role: "user" | "assistant";
  text: string;
}

export default function ChatBubble({ role, text }: ChatBubbleProps) {
  const isUser = role === "user";

  return (
    <div
      className={clsx(
        "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-card",
        isUser
          ? "ml-auto bubble-user text-white"
          : "mr-auto bubble-assistant text-textPrimary"
      )}
    >
      {!isUser && (
        <div className="assistant-kicker text-[0.7rem] font-semibold mb-1">
          Promtior AI Assistant
        </div>
      )}

      {isUser && (
        <div className="text-[0.7rem] font-semibold text-white/80 mb-1">
          You
        </div>
      )}

      <div className="whitespace-pre-wrap break-words">{text}</div>
    </div>
  );
}
