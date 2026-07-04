"use client";

import type { Angle } from "@/lib/types";

// Flat tints keyed by common emotional drivers; unknown drivers get the neutral tint.
const DRIVER_TINTS: [RegExp, [string, string]][] = [
  [/loss|fear|fomo|scarcity/i, ["#F9DCD2", "#9C2E0C"]],
  [/relief|ease|comfort/i, ["#DCEDE0", "#1D6B4C"]],
  [/curio|novel|intrigue/i, ["#F6E3B4", "#7A5300"]],
  [/aspir|status|pride|hope/i, ["#DCE7F7", "#1D4E9C"]],
  [/recogni|belong|identity|validat/i, ["#D9ECE9", "#0F5F58"]],
];

function tint(driver: string): [string, string] {
  for (const [re, t] of DRIVER_TINTS) if (re.test(driver)) return t;
  return ["#ECE7D8", "#57503E"];
}

export default function AngleCard({
  angle,
  selected,
  onSelect,
  index,
  compareChecked = false,
  onToggleCompare,
  compareDisabled = false,
}: {
  angle: Angle;
  selected: boolean;
  onSelect: () => void;
  index: number;
  compareChecked?: boolean;
  onToggleCompare?: () => void;
  compareDisabled?: boolean;
}) {
  const [pillBg, pillFg] = tint(angle.driver);
  return (
    <div
      onClick={onSelect}
      style={{
        animationDelay: `${index * 60}ms`,
        boxShadow: selected ? "4px 4px 0 #E8501A" : "0 1px 0 rgba(23,21,15,0.04)",
      }}
      className={`relative animate-fadeUp cursor-pointer rounded-[14px] border-[1.5px] bg-white p-[22px] transition-all hover:-translate-y-0.5 ${
        selected ? "border-ink" : "border-line"
      }`}
    >
      {selected && (
        <span className="absolute right-4 top-4 flex h-[22px] w-[22px] animate-popIn items-center justify-center rounded-full bg-accent">
          <svg width="11" height="9" viewBox="0 0 11 9">
            <path
              d="M1 4.5 L4 7.5 L10 1"
              stroke="#FFF"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
      <div className="flex flex-wrap items-center gap-2 pr-[26px]">
        <span className="text-[15px] font-semibold tracking-[-0.01em]">{angle.name}</span>
        <span
          className="rounded-full px-[9px] py-[3.5px] font-mono text-[9.5px] uppercase tracking-[.09em]"
          style={{ background: pillBg, color: pillFg }}
        >
          {angle.driver}
        </span>
      </div>
      <p className="mt-[9px] text-[12.5px] leading-[1.45] text-faint">{angle.audience}</p>
      <p className="mt-[13px] text-[16.5px] font-medium leading-[1.42] tracking-[-0.01em] [text-wrap:pretty]">
        &ldquo;{angle.hook}&rdquo;
      </p>
      {onToggleCompare && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare();
            }}
            disabled={!compareChecked && compareDisabled}
            className={`rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[.08em] transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
              compareChecked
                ? "border-ink bg-ink text-paper"
                : "border-linedash bg-transparent text-faint hover:border-ink hover:text-ink"
            }`}
          >
            {compareChecked ? "✓ Comparing" : "+ Compare"}
          </button>
        </div>
      )}
    </div>
  );
}
