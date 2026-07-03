import { NextResponse } from "next/server";

// POST { url } -> { text } — fetch a page server-side and extract readable text.
// Best effort: if it fails, the client falls back to "paste description" mode.
export async function POST(req: Request) {
  try {
    const { url } = (await req.json()) as { url: string };
    if (!url || !/^https?:\/\//i.test(url)) {
      return NextResponse.json({ error: "Invalid URL." }, { status: 400 });
    }
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; CampaignInABox/1.0)" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`fetch ${res.status}`);
    const html = await res.text();
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&[a-z#0-9]+;/gi, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 4000);
    if (text.length < 80) throw new Error("too_little_text");
    return NextResponse.json({ text });
  } catch {
    return NextResponse.json(
      { error: "Could not read that page. Paste the offer description instead." },
      { status: 422 }
    );
  }
}
