"use client";

import { useState, useRef, useEffect } from "react";
import ChatBubble, { ChatBubbleProps } from "../components/ChatBubble";
import ChatInput from "../components/ChatInput";
import { askQuestion } from "../lib/api";

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
    const newUserMessage: ChatBubbleProps = {
      role: "user",
      text: userText,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setLoading(true);

    const answer = await askQuestion(userText);

    const assistantMessage: ChatBubbleProps = {
      role: "assistant",
      text: answer,
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setLoading(false);
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl flex flex-col gap-4">
        <header className="text-center">
          <div className="text-xs font-semibold tracking-wide text-accent mb-1">
            PROMTIOR • AI ASSISTANT
          </div>
          <h1 className="text-xl font-semibold text-textPrimary">
            Ask about Promtior
          </h1>
          <p className="text-[0.8rem] text-textPrimary/60">
            Retrieval-Augmented Generation using Promtior knowledge.
          </p>
        </header>

        <section
          ref={scrollRef}
          className="flex-1 min-h-[360px] max-h-[400px] overflow-y-auto rounded-xl border border-borderColor/40 bg-surface/30 shadow-card p-4 flex flex-col gap-4"
        >
          {messages.map((m, i) => (
            <ChatBubble key={i} role={m.role} text={m.text} />
          ))}

          {loading && (
            <div className="text-[0.7rem] text-textPrimary/50 italic">
              Thinking...
            </div>
          )}
        </section>

        <ChatInput onSend={handleSend} disabled={loading} />

        <footer className="text-center text-[0.7rem] text-textPrimary/40">
          <div>Powered by RAG • LangChain • FAISS • OpenAI</div>
          <div className="text-textPrimary/30">
            Answers are based only on Promtior internal & public sources.
          </div>
        </footer>
      </div>
    </main>
  );
}
