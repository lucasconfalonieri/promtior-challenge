"use client";

type Props = { onPick: (q: string) => void };

const SUGGESTIONS = [
  "What services does Promtior offer?",
  "When was the company founded?",
  "Summarize Promtior’s mission.",
  "How does Promtior use RAG?",
  "Complete the sentence: “We help companies to achieve…”",
  "¿En qué contexto nació Promtior?"
];

export default function Suggestions({ onPick }: Props) {
  return (
    <div className="w-full max-w-3xl mx-auto mt-6">
      <h3 className="text-textPrimary/80 text-sm mb-2">Try asking:</h3>
      <div className="grid gap-2 sm:grid-cols-2">
        {SUGGESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => onPick(q)}
            className="text-left text-sm bg-surface/30 hover:bg-surface/50 rounded-lg px-3 py-2 transition border border-transparent hover:border-accent/30"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
