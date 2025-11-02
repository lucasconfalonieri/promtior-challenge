"use client";

import { useState } from "react";

export default function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (msg: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    onSend(value.trim());
    setValue("");
  }

  return (
      <form
        onSubmit={handleSubmit}
        className="
          flex
          items-end
          gap-2
          bg-surface/30
          rounded-xl
          p-3
          shadow-card
        "
      >
      <textarea
        className="flex-1 resize-none bg-transparent text-textPrimary placeholder-textPrimary/40 outline-none text-sm leading-relaxed max-h-32"
        placeholder="Ask something about Promtior..."
        rows={1}
        value={value}
        disabled={disabled}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        type="submit"
        disabled={disabled}
        className="rounded-xl bg-accent px-4 py-2 text-[0.8rem] font-semibold text-background hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        Send
      </button>
    </form>
  );
}
