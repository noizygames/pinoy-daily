type ChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
};

export async function generateWithGPT(prompt: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("INVALID_KEY");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a funny Filipino content generator. Always respond in casual Filipino or Tagalog. Always return valid JSON arrays when asked with no extra text.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 800,
      temperature: 0.9,
    }),
  });

  if (response.status === 429 || response.status === 402) {
    throw new Error("QUOTA_EXCEEDED");
  }

  if (response.status === 401) {
    throw new Error("INVALID_KEY");
  }

  if (!response.ok) {
    throw new Error("AI_FAILED");
  }

  const data = (await response.json()) as ChatCompletionResponse;
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("AI_FAILED");
  }

  return content;
}

export function parseJsonFromAI(input: string): unknown[] {
  let cleaned = input
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .replace(/`/g, "")
    .trim();

  try {
    const parsed: unknown = JSON.parse(cleaned);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // fall through
  }

  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");

  if (start !== -1 && end > start) {
    try {
      const parsed: unknown = JSON.parse(cleaned.slice(start, end + 1));
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      // fall through
    }
  }

  const lines = cleaned
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  return lines.length > 0 ? lines : [];
}
