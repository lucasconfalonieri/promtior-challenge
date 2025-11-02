export async function askQuestion(question: string): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";
  const res = await fetch(`${baseUrl}/rag/invoke`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      input: question
    })
  });

  if (!res.ok) {
    return "Error: the assistant could not answer right now.";
  }

  const data = await res.json();
  return data.output ?? "No response.";
}
