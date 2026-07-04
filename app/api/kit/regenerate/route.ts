import { NextResponse } from "next/server";
import { callLLM } from "@/lib/groq";
import { REGENERATE_SYSTEM } from "@/lib/prompts";
import type { Angle, Kit, OfferInput, RegenTarget } from "@/lib/types";

const TARGET_SHAPES: Record<RegenTarget, string> = {
  meta: `{ "primaryText": "", "headline": "", "description": "" }`,
  taboola: `{ "headline": "", "thumbnailConcept": "" }`,
  tiktok: `{ "hook": "", "scriptBeats": [] }`,
  google: `{ "headlines": [], "descriptions": [] }`,
  advertorial: `{ "headline": "", "subhead": "", "sections": [ { "heading": "", "body": "" } ], "cta": "" }`,
  emailOptin: `{ "headline": "", "sub": "", "button": "" }`,
  smsOptin: `{ "message": "" }`,
};

const TARGET_LABELS: Record<RegenTarget, string> = {
  meta: "the Meta ad (ads.meta)",
  taboola: "the Taboola native ad (ads.taboola)",
  tiktok: "the TikTok script (ads.tiktok)",
  google: "the Google RSA copy (ads.google)",
  advertorial: "the advertorial pre-lander (advertorial)",
  emailOptin: "the email opt-in (capture.emailOptin)",
  smsOptin: "the SMS opt-in (capture.smsOptin)",
};

export async function POST(req: Request) {
  try {
    const { offer, angle, kit, target } = (await req.json()) as {
      offer: OfferInput;
      angle: Angle;
      kit: Kit;
      target: RegenTarget;
    };
    if (!offer?.description?.trim() || !angle?.hook || !kit || !TARGET_SHAPES[target]) {
      return NextResponse.json({ error: "Missing offer, angle, kit, or a valid target." }, { status: 400 });
    }

    const user = `OFFER:\n${offer.description}\n\nVERTICAL: ${offer.vertical}\nAUDIENCE: ${offer.audience}\n\nCHOSEN ANGLE:\n${JSON.stringify(angle, null, 2)}\n\nEXISTING KIT (context only — stay consistent with it, do not repeat it back):\n${JSON.stringify(kit, null, 2)}\n\nRegenerate ONLY ${TARGET_LABELS[target]}. Return ONLY valid JSON in exactly this shape:\n${TARGET_SHAPES[target]}`;

    const data = await callLLM(REGENERATE_SYSTEM, user);
    return NextResponse.json({ target, data });
  } catch (e: any) {
    const rateLimited = String(e?.message ?? "").includes("429") || e?.status === 429;
    return NextResponse.json(
      { error: rateLimited ? "rate_limited" : "generation_failed" },
      { status: rateLimited ? 429 : 500 }
    );
  }
}
