import { NextResponse } from "next/server";
import { callLLM } from "@/lib/groq";
import { ANGLES_SYSTEM } from "@/lib/prompts";
import type { OfferInput } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const offer = (await req.json()) as OfferInput;
    if (!offer?.description?.trim()) {
      return NextResponse.json({ error: "Missing offer description." }, { status: 400 });
    }
    const user = `OFFER:\n${offer.description}\n\nVERTICAL: ${offer.vertical}\nAUDIENCE: ${offer.audience}\nPRIMARY PLATFORM: ${offer.primaryPlatform}`;
    const data = await callLLM(ANGLES_SYSTEM, user);
    if (!Array.isArray(data?.angles) || data.angles.length === 0) {
      throw new Error("Bad shape");
    }
    return NextResponse.json(data);
  } catch (e: any) {
    const rateLimited = String(e?.message ?? "").includes("429") || e?.status === 429;
    return NextResponse.json(
      { error: rateLimited ? "rate_limited" : "generation_failed" },
      { status: rateLimited ? 429 : 500 }
    );
  }
}
