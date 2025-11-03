"use client";

import { useState, useRef, useEffect } from "react";
import ChatBubble, { ChatBubbleProps } from "../components/ChatBubble";
import ChatInput from "../components/ChatInput";
import { askQuestion } from "../lib/api";
import Suggestions from "../components/Suggestions";
import { RepoBadge } from "../components/RepoBadge";

export default function HomePage() {
  const [messages, setMessages] = useState<ChatBubbleProps[]>([
    {
      role: "assistant",
      text: "Hi, I'm the Promtior AI Assistant. Ask me about Promtior’s services or history.",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  async function handleSend(userText: string) {
    const newUserMessage: ChatBubbleProps = { role: "user", text: userText };
    setMessages((prev) => [...prev, newUserMessage]);
    setLoading(true);

    try {
      const answer = await askQuestion(userText);
      const assistantMessage: ChatBubbleProps = {
        role: "assistant",
        text: answer,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <main
      className="
        h-screen w-screen text-textPrimary bg-[rgb(21,29,89)]
        flex justify-center
      "
      style={{ display: "grid", gridTemplateRows: "auto 1fr auto" }}
    >
      <RepoBadge />

      <header
        className="
          px-4 py-4 flex flex-col items-center text-center
          max-w-4xl w-full mx-auto
        "
      >
        <div className="text-[0.7rem] font-semibold tracking-wide text-accent mb-1">
          PROMTIOR • AI ASSISTANT
        </div>
        <h1 className="text-lg font-semibold text-textPrimary">Ask about Promtior</h1>
        <p className="text-[0.75rem] text-textPrimary/60">
          Retrieval-Augmented Generation using Promtior knowledge.
        </p>
      </header>

      <section
        ref={scrollRef}
        className="
          overflow-y-auto px-12 py-4 flex flex-col gap-8
          max-w-4xl w-full mx-auto scroll-area
        "
      >
        {messages.map((m, i) => (
          <ChatBubble key={i} role={m.role} text={m.text} />
        ))}

        {loading && (
          <div className="text-[0.7rem] text-textPrimary/50 italic">Thinking...</div>
        )}

        {messages.length === 1 && !loading && (
          <Suggestions onPick={(q) => handleSend(q)} />
        )}
      </section>

      <div
        className="
          border-t border-borderColor/40 px-4 py-4 flex flex-col gap-3
          max-w-4xl w-full mx-auto
        "
      >
        <ChatInput onSend={handleSend} disabled={loading} />

        <footer className="text-center text-[0.65rem] leading-snug text-textPrimary/40">
          <div>Powered by RAG • LangChain • FAISS • OpenAI</div>
          <div className="text-textPrimary/30">
            Answers are based only on Promtior internal &amp; public sources.
          </div>
        </footer>
      </div>
    </main>
  );
}
