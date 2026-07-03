"use client";

import { useMemo, useState } from "react";
import type { Kit } from "@/lib/types";
import CopyButton from "./CopyButton";
import AdvertorialPreview from "./AdvertorialPreview";

type Tab = "ads" | "adv" | "cap";

const monoLabel = "font-mono text-[10.5px] uppercase tracking-[.1em] text-muted";

function ImgSlot({ caption, className = "" }: { caption: string; className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-[6px] bg-[#EFEBDD] ${className}`}>
      <svg width="24" height="20" viewBox="0 0 26 22">
        <rect x="1" y="1" width="24" height="20" rx="3" fill="none" stroke="#B9B29C" strokeWidth="1.5" strokeDasharray="4 3" />
        <circle cx="8.5" cy="8" r="2.4" fill="#B9B29C" />
        <path d="M3 18 L10 11 L15 15 L19 12 L23 15" fill="none" stroke="#B9B29C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="font-mono text-[9px] uppercase tracking-[.1em] text-faint">{caption}</span>
    </div>
  );
}

export function kitToText(kit: Kit): string {
  const { ads, advertorial, capture } = kit;
  return [
    `META — PRIMARY TEXT\n${ads.meta.primaryText}\n\nHEADLINE: ${ads.meta.headline}\nDESCRIPTION: ${ads.meta.description}`,
    `TABOOLA — HEADLINE\n${ads.taboola.headline}\n\nTHUMBNAIL CONCEPT: ${ads.taboola.thumbnailConcept}`,
    `TIKTOK — HOOK\n"${ads.tiktok.hook}"\n\nBEATS\n${ads.tiktok.scriptBeats.map((b, i) => `${String(i + 1).padStart(2, "0")} ${b}`).join("\n")}`,
    `ADVERTORIAL\nHEADLINE: ${advertorial.headline}\nSUBHEAD: ${advertorial.subhead}\n\n${advertorial.sections.map((s) => `${s.heading.toUpperCase()}\n${s.body}`).join("\n\n")}\n\nCTA: ${advertorial.cta}`,
    `EMAIL OPT-IN\nHEADLINE: ${capture.emailOptin.headline}\nSUB: ${capture.emailOptin.sub}\nBUTTON: ${capture.emailOptin.button}`,
    `SMS OPT-IN\n${capture.smsOptin.message}`,
  ].join("\n\n————————\n\n");
}

export default function KitView({ kit, brand = "Your brand" }: { kit: Kit; brand?: string }) {
  const [tab, setTab] = useState<Tab>("ads");
  const { ads, advertorial, capture } = kit;
  const allText = useMemo(() => kitToText(kit), [kit]);

  const tabs: [Tab, string][] = [
    ["ads", "Ads"],
    ["adv", "Advertorial"],
    ["cap", "Capture"],
  ];

  return (
    <div className="mx-auto max-w-[1180px] animate-fadeUp px-7 pb-[90px] pt-2">
      {/* tab bar */}
      <div className="mb-[26px] flex items-center border-b border-line">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`-mb-px mr-[30px] border-b-2 py-[15px] text-sm transition-all hover:text-ink ${
              tab === id ? "border-accent font-bold text-ink" : "border-transparent font-medium text-faint"
            }`}
          >
            {label}
          </button>
        ))}
        <CopyButton text={allText} label="Copy all" className="ml-auto !px-3.5 !py-2 !text-[10.5px]" />
      </div>

      {/* ADS */}
      {tab === "ads" && (
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
          {/* Meta */}
          <section className="animate-fadeUp" style={{ animationDelay: "50ms" }}>
            <div className="mb-2.5 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#1877F2]" />
              <span className={monoLabel}>Meta · Feed</span>
              <CopyButton
                className="ml-auto"
                text={`${ads.meta.primaryText}\n\nHEADLINE: ${ads.meta.headline}\nDESCRIPTION: ${ads.meta.description}`}
              />
            </div>
            <div className="overflow-hidden rounded-xl border border-line bg-white">
              <div className="flex items-center gap-2.5 px-4 py-[13px]">
                <span className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full bg-ink text-[15px] font-bold text-paper">
                  {brand.charAt(0).toUpperCase()}
                </span>
                <div className="flex flex-col gap-px">
                  <span className="text-[13px] font-semibold">{brand}</span>
                  <span className="text-[11px] text-faint">Sponsored · 🌐</span>
                </div>
                <span className="ml-auto font-bold tracking-[2px] text-faint">···</span>
              </div>
              <div className="flex flex-col gap-[9px] px-4 pb-[13px] text-[13.5px] leading-normal">
                {ads.meta.primaryText.split(/\n+/).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <ImgSlot caption="Drop creative · 1080 × 1080" className="h-[170px] border-y border-line" />
              <div className="flex items-center gap-3 bg-[#F8F5EC] px-4 py-3">
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="font-mono text-[9px] tracking-[.08em] text-faint">
                    {brand.replace(/\s+/g, "").toUpperCase()}.COM
                  </span>
                  <span className="text-[13.5px] font-bold tracking-[-0.01em]">{ads.meta.headline}</span>
                  <span className="text-[11.5px] text-muted">{ads.meta.description}</span>
                </div>
                <span className="ml-auto flex-none rounded-[7px] border border-linedash bg-white px-[13px] py-2 text-xs font-semibold">
                  Learn more
                </span>
              </div>
            </div>
            <p className="mx-0.5 mt-2 font-mono text-[10px] text-faint">
              headline {ads.meta.headline.length}/40 · description {ads.meta.description.length}/30
            </p>
          </section>

          <section className="flex flex-col gap-5">
            {/* Taboola */}
            <div className="animate-fadeUp" style={{ animationDelay: "120ms" }}>
              <div className="mb-2.5 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#004B93]" />
                <span className={monoLabel}>Taboola · Native</span>
                <CopyButton
                  className="ml-auto"
                  text={`${ads.taboola.headline}\n\nTHUMBNAIL CONCEPT: ${ads.taboola.thumbnailConcept}`}
                />
              </div>
              <div className="flex gap-3.5 rounded-xl border border-line bg-white p-3.5">
                <ImgSlot caption="THUMB SLOT" className="h-24 w-[132px] flex-none rounded-lg border-[1.5px] border-dashed border-linedash !bg-[#EFEBDD]" />
                <div className="flex min-w-0 flex-col justify-center gap-1.5">
                  <span className="text-[15px] font-semibold leading-[1.35] tracking-[-0.01em] [text-wrap:pretty]">
                    {ads.taboola.headline}
                  </span>
                  <span className="text-[11px] text-faint">{brand} · Sponsored</span>
                </div>
              </div>
              <p className="mx-0.5 mt-2 text-xs leading-normal text-muted">
                <span className="font-mono text-[9px] uppercase tracking-[.1em] text-faint">Thumbnail concept — </span>
                <em>{ads.taboola.thumbnailConcept}</em>
              </p>
              <p className="mx-0.5 mt-1 font-mono text-[10px] text-faint">headline {ads.taboola.headline.length}/90</p>
            </div>

            {/* TikTok */}
            <div className="animate-fadeUp" style={{ animationDelay: "190ms" }}>
              <div className="mb-2.5 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-ink shadow-[-2px_0_0_#25F4EE,2px_0_0_#FE2C55]" />
                <span className={monoLabel}>TikTok · Script</span>
                <CopyButton
                  className="ml-auto"
                  text={`"${ads.tiktok.hook}"\n\n${ads.tiktok.scriptBeats.map((b, i) => `${String(i + 1).padStart(2, "0")} ${b}`).join("\n")}`}
                />
              </div>
              <div className="rounded-xl bg-[#161616] p-5 text-[#F2F2F2]">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-[9.5px] uppercase tracking-[.12em] text-[#8A8A8A]">
                    Hook · first 3 seconds
                  </span>
                  <span className="font-mono text-[9.5px] text-[#8A8A8A]">
                    ~{ads.tiktok.scriptBeats.length * 6}s total
                  </span>
                </div>
                <p
                  className="mb-[18px] text-[16.5px] font-bold leading-[1.4] tracking-[-0.01em]"
                  style={{ textShadow: "-1.5px 0 0 rgba(37,244,238,.55), 1.5px 0 0 rgba(254,44,85,.55)" }}
                >
                  &ldquo;{ads.tiktok.hook}&rdquo;
                </p>
                <ol className="flex flex-col gap-2.5">
                  {ads.tiktok.scriptBeats.map((b, i) => {
                    const last = i === ads.tiktok.scriptBeats.length - 1;
                    return (
                      <li key={i} className={`flex gap-3 text-[12.5px] leading-normal ${last ? "font-semibold text-white" : "text-[#D8D8D8]"}`}>
                        <span className={`flex-none pt-0.5 font-mono text-[10px] ${last ? "text-[#FE2C55]" : "text-[#25F4EE]"}`}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {b}
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ADVERTORIAL */}
      {tab === "adv" && (
        <div className="animate-fadeUp">
          <div className="mx-auto mb-3 flex max-w-[760px] items-center gap-2">
            <span className={monoLabel}>Pre-lander · live preview</span>
            <CopyButton
              className="ml-auto"
              text={`HEADLINE: ${advertorial.headline}\nSUBHEAD: ${advertorial.subhead}\n\n${advertorial.sections.map((s) => `${s.heading.toUpperCase()}\n${s.body}`).join("\n\n")}\n\nCTA: ${advertorial.cta}`}
            />
          </div>
          <AdvertorialPreview advertorial={advertorial} />
        </div>
      )}

      {/* CAPTURE */}
      {tab === "cap" && (
        <div className="mx-auto grid max-w-[900px] animate-fadeUp grid-cols-1 items-start gap-5 md:grid-cols-2">
          <section>
            <div className="mb-2.5 flex items-center gap-2">
              <span className={monoLabel}>✉ Email opt-in</span>
              <CopyButton
                className="ml-auto"
                text={`HEADLINE: ${capture.emailOptin.headline}\nSUB: ${capture.emailOptin.sub}\nBUTTON: ${capture.emailOptin.button}`}
              />
            </div>
            <div className="flex flex-col gap-2 rounded-xl border border-line bg-white px-8 py-[34px]">
              <h3 className="text-center text-[21px] font-bold tracking-[-0.02em]">{capture.emailOptin.headline}</h3>
              <p className="mb-3 text-center text-[13.5px] leading-normal text-muted [text-wrap:pretty]">
                {capture.emailOptin.sub}
              </p>
              <span className="rounded-[9px] border border-line bg-cream px-3.5 py-3 text-[13.5px] text-[#A69F8C]">
                you@email.com
              </span>
              <span className="cursor-pointer rounded-[9px] bg-ink py-[13px] text-center text-sm font-bold text-paper shadow-pop-sm transition-all hover:translate-x-[1.5px] hover:translate-y-[1.5px] hover:shadow-[1.5px_1.5px_0_#E8501A]">
                {capture.emailOptin.button}
              </span>
              <p className="mt-1.5 text-center text-[10.5px] text-faint">No spam. Unsubscribe whenever you like.</p>
            </div>
          </section>

          <section>
            <div className="mb-2.5 flex items-center gap-2">
              <span className={monoLabel}>💬 SMS opt-in</span>
              <CopyButton className="ml-auto" text={capture.smsOptin.message} />
            </div>
            <div className="rounded-xl border border-line bg-white px-7 pb-[22px] pt-[26px]">
              <p className="mb-3.5 text-center font-mono text-[9.5px] uppercase tracking-[.1em] text-faint">
                Today 4:02 PM
              </p>
              <p className="max-w-[280px] rounded-[18px] rounded-bl-[5px] bg-[#EBE7DA] px-4 py-3 text-sm leading-normal">
                {capture.smsOptin.message}
              </p>
              <p className="mt-4 text-center font-mono text-[10px] text-faint">
                {capture.smsOptin.message.length} chars ·{" "}
                {Math.ceil(capture.smsOptin.message.length / 160)} segment
                {capture.smsOptin.message.length > 160 ? "s" : ""} ·{" "}
                {/stop/i.test(capture.smsOptin.message) ? "STOP included" : "⚠ add STOP"}
              </p>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
