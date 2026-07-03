"use client";

import { useRef, useState } from "react";
import type { Angle, Kit, OfferInput } from "@/lib/types";
import OfferForm from "@/components/OfferForm";
import AngleCard from "@/components/AngleCard";
import KitView from "@/components/KitView";

type Phase = "input" | "loadingAngles" | "angles" | "loadingKit" | "kit" | "error";

const LOAD_MSGS = [
  "Reading the offer…",
  "Profiling the audience…",
  "Mining for five distinct psychologies…",
  "Writing the hooks…",
];

const KIT_STEPS = [
  "Meta primary text + headline",
  "Taboola native headline",
  "TikTok hook + script beats",
  "Advertorial pre-lander",
  "Email + SMS capture copy",
];

const BoxMark = ({ size = 26, floating = false }: { size?: number; floating?: boolean }) => (
  <svg
    width={size}
    height={(size * 28) / 26}
    viewBox="0 0 26 28"
    className={floating ? "animate-floatBox" : ""}
  >
    <polygon points="13,1 25,7.5 13,14 1,7.5" fill="#E8501A" />
    <polygon points="1,7.5 13,14 13,27 1,20.5" fill="#17150F" />
    <polygon points="25,7.5 13,14 13,27 25,20.5" fill="#57503E" />
  </svg>
);

export default function Home() {
  const [phase, setPhase] = useState<Phase>("input");
  const [offer, setOffer] = useState<OfferInput | null>(null);
  const [angles, setAngles] = useState<Angle[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [kit, setKit] = useState<Kit | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const [loadIdx, setLoadIdx] = useState(0);
  const [kitStep, setKitStep] = useState(0);
  const errorFrom = useRef<"angles" | "kit">("angles");
  const timers = useRef<ReturnType<typeof setInterval>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearInterval);
    timers.current = [];
  };

  const fail = (from: "angles" | "kit", is429: boolean) => {
    clearTimers();
    errorFrom.current = from;
    setRateLimited(is429);
    setPhase("error");
  };

  const generateAngles = async (input: OfferInput, mode: "desc" | "url", url: string) => {
    clearTimers();
    let finalInput = input;

    setPhase("loadingAngles");
    setLoadIdx(0);
    timers.current.push(setInterval(() => setLoadIdx((i) => (i + 1) % LOAD_MSGS.length), 850));

    try {
      if (mode === "url" && url) {
        const r = await fetch("/api/fetch-offer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        const j = await r.json();
        if (!r.ok) throw Object.assign(new Error(j.error), { soft: true });
        finalInput = { ...input, description: j.text };
      }
      setOffer(finalInput);

      const res = await fetch("/api/angles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalInput),
      });
      const data = await res.json();
      if (!res.ok) return fail("angles", res.status === 429);
      clearTimers();
      setAngles(data.angles.slice(0, 5));
      setSelected(null);
      setPhase("angles");
    } catch {
      fail("angles", false);
    }
  };

  const generateKit = async () => {
    if (selected == null || !offer) return;
    clearTimers();
    setPhase("loadingKit");
    setKitStep(0);
    // Cosmetic progress — the kit is one LLM call; the checklist paces the wait.
    timers.current.push(
      setInterval(() => setKitStep((s) => Math.min(s + 1, KIT_STEPS.length - 1)), 1400)
    );
    try {
      const res = await fetch("/api/kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offer, angle: angles[selected] }),
      });
      const data = await res.json();
      if (!res.ok) return fail("kit", res.status === 429);
      clearTimers();
      setKit(data as Kit);
      setPhase("kit");
    } catch {
      fail("kit", false);
    }
  };

  const retry = () => (errorFrom.current === "kit" && offer ? generateKit() : setPhase("input"));

  const offerShort = offer
    ? offer.description.length > 92
      ? offer.description.slice(0, 92).trimEnd() + "…"
      : offer.description
    : "";

  const stepColor = (on: boolean) => (on ? "text-ink" : "text-dust");

  return (
    <div className="flex min-h-screen flex-col">
      {/* top bar */}
      <header className="flex items-center justify-between border-b border-line px-7 py-4">
        <button className="flex items-center gap-[11px]" onClick={() => setPhase("input")}>
          <BoxMark />
          <span className="flex flex-col items-start gap-px">
            <span className="text-[14.5px] font-bold tracking-[-0.01em]">Campaign in a Box</span>
            <span className="font-mono text-[9px] uppercase tracking-[.12em] text-faint">
              offer → angles → full kit
            </span>
          </span>
        </button>
        <nav className="hidden items-center gap-3.5 font-mono text-[10.5px] uppercase tracking-[.08em] sm:flex">
          <span className={stepColor(phase === "input" || phase === "loadingAngles")}>01 Offer</span>
          <span className="text-[#D8D2BF]">—</span>
          <span className={stepColor(phase === "angles")}>02 Angles</span>
          <span className="text-[#D8D2BF]">—</span>
          <span className={stepColor(phase === "loadingKit" || phase === "kit")}>03 Kit</span>
        </nav>
      </header>

      {/* sticky offer context bar */}
      {offer && (phase === "angles" || phase === "kit") && (
        <div className="sticky top-0 z-40 flex items-center gap-3.5 border-b border-line bg-paper/95 px-7 py-[11px] backdrop-blur">
          <span className="flex-none font-mono text-[9.5px] uppercase tracking-[.12em] text-accent">
            {phase === "kit" ? "Kit" : "Offer"}
          </span>
          {phase === "kit" && kit && (
            <span className="whitespace-nowrap text-[12.5px] font-semibold">{kit.angle.name}</span>
          )}
          <span className="truncate text-[12.5px] font-medium text-ink">{offerShort}</span>
          <span className="hidden flex-none whitespace-nowrap font-mono text-[10.5px] text-faint md:inline">
            {offer.vertical} · {offer.audience || "—"} · {offer.primaryPlatform}
          </span>
          <button
            onClick={() => setPhase(phase === "kit" ? "angles" : "input")}
            className="ml-auto flex-none border-b border-linedash pb-px font-mono text-[10.5px] uppercase tracking-[.08em] text-muted transition-colors hover:text-accent"
          >
            {phase === "kit" ? "↩ Angles" : "Edit"}
          </button>
        </div>
      )}

      {phase === "input" && <OfferForm onSubmit={generateAngles} />}

      {phase === "loadingAngles" && (
        <main className="mx-auto w-full max-w-[1180px] animate-fadeUp px-7 pb-20 pt-7">
          <div className="flex items-center gap-3 px-1 pb-[22px] pt-3.5">
            <svg width="16" height="16" viewBox="0 0 16 16" className="animate-spin">
              <circle cx="8" cy="8" r="6.5" fill="none" stroke="#E3DDCC" strokeWidth="2.5" />
              <path d="M8 1.5 A6.5 6.5 0 0 1 14.5 8" fill="none" stroke="#E8501A" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-sm font-semibold">{LOAD_MSGS[loadIdx]}</span>
            <span className="ml-auto font-mono text-[10.5px] text-faint">llama-3.3-70b · groq</span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="animate-fadeUp rounded-[14px] border border-line bg-white p-[22px]"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <div className="skeleton h-[15px] w-[55%] rounded-md" />
                <div className="skeleton mt-3 h-5 w-[34%] rounded-full" />
                <div className="skeleton mt-3.5 h-3 w-[80%] rounded-md" />
                <div className="skeleton mt-4 h-4 w-[92%] rounded-md" />
                <div className="skeleton mt-2 h-4 w-[64%] rounded-md" />
              </div>
            ))}
          </div>
        </main>
      )}

      {phase === "angles" && (
        <main className="mx-auto w-full max-w-[1180px] px-7 pb-[130px] pt-[30px]">
          <div className="mb-5 flex flex-wrap items-baseline gap-3">
            <h2 className="text-[21px] font-bold tracking-[-0.02em]">
              Five angles. Five different reasons to click.
            </h2>
            <span className="text-[13px] text-faint">Pick the one worth a budget.</span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {angles.map((a, i) => (
              <AngleCard
                key={a.id || i}
                angle={a}
                index={i}
                selected={selected === i}
                onSelect={() => setSelected(selected === i ? null : i)}
              />
            ))}
          </div>
          {selected != null && (
            <div className="pointer-events-none fixed bottom-[26px] left-0 right-0 z-50 flex justify-center">
              <button
                onClick={generateKit}
                className="pointer-events-auto flex animate-fadeUp items-center gap-2.5 rounded-xl bg-ink px-[26px] py-[15px] text-[15px] font-bold text-paper shadow-pop transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#E8501A]"
              >
                Generate the full kit
                <span className="font-normal text-dust">·</span>
                <span className="text-[#F0A487]">{angles[selected].name}</span>
                <span>→</span>
              </button>
            </div>
          )}
        </main>
      )}

      {phase === "loadingKit" && selected != null && (
        <main className="flex animate-fadeUp flex-col items-center px-6 py-20">
          <span className="mb-[22px]">
            <BoxMark size={44} floating />
          </span>
          <h2 className="mb-1 text-xl font-bold tracking-[-0.02em]">Packing the box</h2>
          <p className="mb-[30px] text-[13px] text-faint">
            Every asset written against <strong className="text-muted">{angles[selected].name}</strong> — one
            pass, fully consistent.
          </p>
          <div className="w-full max-w-[400px] rounded-[14px] border border-line bg-white px-5 py-2.5">
            {KIT_STEPS.map((label, i) => {
              const done = i < kitStep;
              const active = i === kitStep;
              return (
                <div key={label} className="flex items-center gap-3 border-b border-[#F1EDE0] py-[11px] last:border-0">
                  {done ? (
                    <span className="flex h-[18px] w-[18px] flex-none animate-popIn items-center justify-center rounded-full bg-moss">
                      <svg width="9" height="8" viewBox="0 0 11 9">
                        <path d="M1 4.5 L4 7.5 L10 1" stroke="#FFF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  ) : active ? (
                    <svg width="18" height="18" viewBox="0 0 16 16" className="flex-none animate-spin">
                      <circle cx="8" cy="8" r="6" fill="none" stroke="#E3DDCC" strokeWidth="2.5" />
                      <path d="M8 2 A6 6 0 0 1 14 8" fill="none" stroke="#E8501A" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <span className="h-[18px] w-[18px] flex-none rounded-full border-[1.5px] border-dashed border-linedash" />
                  )}
                  <span className={`text-[13.5px] ${active ? "font-semibold text-ink" : done ? "text-ink" : "text-dust"}`}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </main>
      )}

      {phase === "kit" && kit && <KitView kit={kit} brand={offer?.description.split(/[\s,:—-]+/)[0] || "Brand"} />}

      {phase === "error" && (
        <main className="flex animate-fadeUp flex-col items-center px-6 py-[90px]">
          <div className="w-full max-w-[480px] rounded-2xl border border-line bg-white px-9 py-[38px] text-center shadow-card">
            <p className="mb-1.5 font-mono text-[9.5px] uppercase tracking-[.14em] text-faint">
              {rateLimited ? "429 · Rate limited" : "Generation hiccup"}
            </p>
            <h2 className="mb-2.5 text-[21px] font-bold tracking-[-0.02em]">
              {rateLimited ? "The model is catching its breath" : "That one didn't come back clean"}
            </h2>
            <p className="mb-6 text-[13.5px] leading-[1.55] text-muted [text-wrap:pretty]">
              {rateLimited
                ? "Groq throttled us mid-generation. Nothing is lost — your offer and chosen angle are saved. Retrying usually clears it in a few seconds."
                : "Nothing is lost — your offer and chosen angle are saved. Hit retry and it almost always comes back."}
            </p>
            <div className="flex justify-center gap-2.5">
              <button
                onClick={retry}
                className="rounded-[10px] bg-ink px-[22px] py-3 text-sm font-bold text-paper shadow-pop-sm transition-all hover:translate-x-[1.5px] hover:translate-y-[1.5px] hover:shadow-[1.5px_1.5px_0_#E8501A]"
              >
                Retry generation
              </button>
              <button
                onClick={() => setPhase(angles.length ? "angles" : "input")}
                className="rounded-[10px] border border-linedash px-[22px] py-3 text-sm font-semibold text-muted transition-all hover:border-ink hover:text-ink"
              >
                {angles.length ? "Back to angles" : "Back to the offer"}
              </button>
            </div>
          </div>
        </main>
      )}

      <footer className="mt-auto flex items-center justify-center border-t border-linesoft p-[18px]">
        <span className="font-mono text-[9.5px] uppercase tracking-[.1em] text-dust">
          Built for It&apos;s Today Media · Groq · Next.js · zero cost
        </span>
      </footer>
    </div>
  );
}
