"use client";

import { useEffect, useRef, useState } from "react";

export default function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (msg: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const send = () => {
    const v = value.trim();
    if (!v) return;
    onSend(v);
    setValue("");
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    send();
  }

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";             
    el.style.height = el.scrollHeight + "px";
  }, [value]);

  return (
    <form
      onSubmit={handleSubmit}
      className="
        flex items-end gap-2 bg-surface/30 rounded-xl p-3 shadow-card
      "
    >
      <textarea
        ref={textareaRef}
        className="
          flex-1 bg-transparent text-textPrimary placeholder-textPrimary/40
          outline-none text-sm leading-relaxed resize-none
          max-h-48 overflow-y-auto
        "
        placeholder="Ask something about Promtior..."
        rows={1}
        value={value}
        disabled={disabled}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
          }
        }}
      />
      <button
        type="submit"
        disabled={disabled}
        className="
          rounded-xl bg-accent px-4 py-2 text-[0.8rem] font-semibold
          text-background hover:opacity-90 disabled:opacity-50
          disabled:cursor-not-allowed transition
        "
      >
        Send
      </button>
    </form>
  );
}
