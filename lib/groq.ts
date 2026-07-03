import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function callLLM(
  system: string,
  user: string,
  model = "llama-3.3-70b-versatile"
): Promise<any> {
  const run = async () => {
    const res = await client.chat.completions.create({
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
