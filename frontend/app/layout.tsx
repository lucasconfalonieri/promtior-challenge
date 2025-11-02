import "../styles/globals.css";

export const metadata = {
  title: "Promtior AI Assistant",
  description: "RAG chatbot powered by LangChain, FAISS, and OpenAI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-textPrimary min-h-screen">
        {children}
      </body>
    </html>
  );
}
