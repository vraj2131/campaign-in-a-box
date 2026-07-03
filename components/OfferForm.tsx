"use client";

import { useState } from "react";
import type { OfferInput } from "@/lib/types";
import { SAMPLE_OFFER, VERTICALS } from "@/lib/sample";

const PLATFORMS: { id: OfferInput["primaryPlatform"]; label: string; dot: string }[] = [
  { id: "meta", label: "Meta", dot: "#1877F2" },
  { id: "taboola", label: "Taboola", dot: "#004B93" },
  { id: "tiktok", label: "TikTok", dot: "#17150F" },
];

export default function OfferForm({
  onSubmit,
  busy,
}: {
  onSubmit: (offer: OfferInput, mode: "desc" | "url", url: string) => void;
  busy?: boolean;
}) {
  const [mode, setMode] = useState<"desc" | "url">("desc");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [vertical, setVertical] = useState(VERTICALS[0]);
  const [audience, setAudience] = useState("");
  const [platform, setPlatform] = useState<OfferInput["primaryPlatform"]>("meta");

  const hasOffer = mode === "desc" ? description.trim().length > 0 : url.trim().length > 0;
  const empty = description.trim() === "" && url.trim() === "";

  const submit = () => {
    if (!hasOffer || busy) return;
    onSubmit(
      { description: description.trim(), vertical, audience: audience.trim(), primaryPlatform: platform },
      mode,
      url.trim()
    );
  };

  const loadSample = () => {
    setMode("desc");
    setDescription(SAMPLE_OFFER.description);
    setVertical(SAMPLE_OFFER.vertical);
    setAudience(SAMPLE_OFFER.audience);
    setPlatform(SAMPLE_OFFER.primaryPlatform);
  };

  const label = "mb-[7px] block font-mono text-[10px] uppercase tracking-[.12em] text-faint";
  const field =
    "w-full rounded-[10px] border border-line bg-cream px-3.5 py-[11px] text-[13.5px] text-ink transition-colors";

  return (
    <main className="flex animate-fadeUp flex-col items-center px-6 pb-20 pt-[60px]">
      <h1 className="mx-auto mb-2.5 max-w-[640px] text-center text-4xl font-bold tracking-[-0.025em] [text-wrap:pretty]">
        Paste an offer. Leave with a campaign.
      </h1>
      <p className="mb-9 max-w-[520px] text-center text-[15px] leading-[1.55] text-muted [text-wrap:pretty]">
        Five distinct angles, ad copy for three platforms, a native pre-lander, and the
        capture copy that builds the list. One input.
      </p>

      <div className="w-full max-w-[620px] rounded-2xl border border-line bg-white p-7 shadow-card">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[.12em] text-faint">The offer</span>
          <div className="flex overflow-hidden rounded-lg border border-line">
            {(["desc", "url"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1.5 text-[11.5px] font-semibold transition-all ${
                  mode === m ? "bg-ink text-paper" : "bg-transparent text-muted"
                }`}
              >
                {m === "desc" ? "Describe it" : "Paste a URL"}
              </button>
            ))}
          </div>
        </div>

        {mode === "desc" ? (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's the product, what does it cost, what makes it worth clicking?"
            className={`${field} min-h-[132px] resize-y text-[14.5px] leading-[1.55]`}
          />
        ) : (
          <>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://the-offer-page.com"
              className={`${field} font-mono text-[13.5px]`}
            />
            <p className="mt-2 text-xs text-faint">
              We&apos;ll fetch the page and extract the offer. If the fetch fails, you can paste instead.
            </p>
          </>
        )}

        <div className="mt-[18px] grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div>
            <label className={label}>Vertical</label>
            <select value={vertical} onChange={(e) => setVertical(e.target.value)} className={`${field} cursor-pointer`}>
              {VERTICALS.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Audience</label>
            <input
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g. busy parents, 28–45, US"
              className={field}
            />
          </div>
        </div>

        <div className="mt-[18px]">
          <label className={label}>Primary platform</label>
          <div className="grid grid-cols-3 gap-2">
            {PLATFORMS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                className={`flex items-center justify-center gap-2 rounded-[10px] border px-2 py-[11px] text-[13px] transition-all ${
                  platform === p.id
                    ? "border-ink bg-ink font-bold text-paper"
                    : "border-line bg-cream font-medium text-ink"
                }`}
              >
                <span className="h-2 w-2 flex-none rounded-full" style={{ background: p.dot }} />
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={submit}
          disabled={!hasOffer || busy}
          className="mt-6 w-full rounded-[11px] bg-ink py-[15px] text-[15px] font-bold tracking-[-0.01em] text-paper shadow-pop transition-all enabled:hover:translate-x-[2px] enabled:hover:translate-y-[2px] enabled:hover:shadow-[2px_2px_0_#E8501A] disabled:cursor-not-allowed disabled:opacity-45"
        >
          {busy ? "Working…" : "Generate 5 angles →"}
        </button>
      </div>

      {empty && (
        <button
          onClick={loadSample}
          className="mt-[22px] flex w-full max-w-[620px] animate-fadeUp items-center gap-2.5 rounded-xl border-[1.5px] border-dashed border-linedash bg-transparent px-[18px] py-[13px] text-left transition-all hover:border-accent hover:bg-accent/5"
          style={{ animationDelay: "150ms" }}
        >
          <svg width="18" height="20" viewBox="0 0 26 28" className="flex-none">
            <polygon points="13,1 25,7.5 13,14 1,7.5" fill="#E8501A" />
            <polygon points="1,7.5 13,14 13,27 1,20.5" fill="#B9B29C" />
            <polygon points="25,7.5 13,14 13,27 25,20.5" fill="#8F8871" />
          </svg>
          <span className="text-[13px] leading-[1.45] text-muted">
            <strong className="font-semibold text-ink">No offer handy? Load the sample</strong> — PrepKit,
            a meal-planning app that works backwards from your fridge.
          </span>
          <span className="ml-auto flex-none font-mono text-[11px] text-accent">TRY IT →</span>
        </button>
      )}
    </main>
  );
}
