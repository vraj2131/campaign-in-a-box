import OpenAI from "openai";

let client: OpenAI | null = null;

// Lazily constructed so importing this module (e.g. during `next build`'s
// page-data collection) never throws when GROQ_API_KEY isn't set yet.
function getClient(): OpenAI {
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
  }
  return client;
}

export async function callLLM(
  system: string,
  user: string,
  model = "llama-3.3-70b-versatile"
): Promise<any> {
  const run = async () => {
    const res = await getClient().chat.completions.create({
      model,
      temperature: 0.8,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });
    const raw = res.choices[0]?.message?.content ?? "";
    const clean = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
    return JSON.parse(clean);
  };
  try {
    return await run();
  } catch {
    return await run(); // one retry covers a stray non-JSON response
  }
}
