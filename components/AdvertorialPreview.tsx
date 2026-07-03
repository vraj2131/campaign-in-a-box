import type { Advertorial } from "@/lib/types";

// Renders structured advertorial content as a styled native article.
// Serif type on purpose — it should read like a published piece, not app UI.
export default function AdvertorialPreview({ advertorial }: { advertorial: Advertorial }) {
  return (
    <article className="mx-auto max-w-[760px] rounded border border-line bg-page px-8 py-12 font-serif shadow-[0_3px_0_rgba(23,21,15,0.06)] sm:px-[68px] sm:pb-[60px] sm:pt-[54px]">
      <div className="mb-[26px] flex items-center gap-2.5">
        <span className="rounded-[3px] border border-accent px-[7px] py-[3px] font-mono text-[9px] uppercase tracking-[.16em] text-accent">
          Advertorial
        </span>
        <span className="h-px flex-1 bg-line" />
        <span className="font-mono text-[9px] uppercase tracking-[.12em] text-faint">Sponsored feature</span>
      </div>

      <h1 className="mb-3.5 text-[32px] font-semibold leading-[1.12] tracking-[-0.015em] [text-wrap:pretty] sm:text-[40px]">
        {advertorial.headline}
      </h1>
      <p className="mb-[22px] text-[19px] italic leading-[1.45] text-[#57503E] [text-wrap:pretty]">
        {advertorial.subhead}
      </p>

      <div className="mb-7 flex items-center gap-2.5 border-b border-line pb-[22px]">
        <span className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-full bg-accent font-sans text-xs font-bold text-white">
          MD
        </span>
        <span className="font-sans text-[12.5px] text-muted">
          By <strong className="text-ink">The Editorial Desk</strong> · Updated today ·{" "}
          {Math.max(2, Math.round(advertorial.sections.length * 1.2))} min read
        </span>
      </div>

      {advertorial.sections.map((s, i) => (
        <section key={i}>
          <h3 className="mb-2.5 text-[23px] font-semibold tracking-[-0.01em]">{s.heading}</h3>
          <p className="mb-[26px] text-[17.5px] leading-[1.68] text-body">{s.body}</p>
        </section>
      ))}

      <div className="mt-2 flex flex-col items-center gap-2.5 rounded-[10px] bg-paper p-7">
        <button className="rounded-[9px] bg-accent px-[30px] py-3.5 font-sans text-[15px] font-bold text-white shadow-pop-ink transition-all hover:translate-x-[1.5px] hover:translate-y-[1.5px] hover:shadow-[1.5px_1.5px_0_#17150F]">
          {advertorial.cta}
        </button>
      </div>
      <p className="mt-[26px] text-center font-sans text-[10.5px] text-faint">
        This is a sponsored article. Individual results vary.
      </p>
    </article>
  );
}
