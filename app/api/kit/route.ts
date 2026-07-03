import { NextResponse } from "next/server";
import { callLLM } from "@/lib/groq";
import { KIT_SYSTEM } from "@/lib/prompts";
import type { Angle, OfferInput } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const { offer, angle } = (await req.json()) as { offer: OfferInput; angle: Angle };
    if (!offer?.description?.trim() || !angle?.hook) {
      return NextResponse.json({ error: "Missing offer or angle." }, { status: 400 });
    }
    const user = `OFFER:\n${offer.description}\n\nVERTICAL: ${offer.vertical}\nAUDIENCE: ${offer.audience}\nPRIMARY PLATFORM: ${offer.primaryPlatform}\n\nCHOSEN ANGLE:\n${JSON.stringify(angle, null, 2)}`;
    const data = await callLLM(KIT_SYSTEM, user);
    if (!data?.ads?.meta || !data?.advertorial?.sections) {
      throw new Error("Bad shape");
    }
    return NextResponse.json({ angle, ...data });
  } catch (e: any) {
    const rateLimited = String(e?.message ?? "").includes("429") || e?.status === 429;
    return NextResponse.json(
      { error: rateLimited ? "rate_limited" : "generation_failed" },
      { status: rateLimited ? 429 : 500 }
    );
  }
}
