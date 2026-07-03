"use client";

import { scanCompliance } from "@/lib/compliance";

// Silent unless the heuristic scan finds something — reuses the same warm-red
// tint AngleCard uses for "loss/fear" drivers, so no new color enters the system.
export default function ComplianceBadge({ text, className = "" }: { text: string; className?: string }) {
  const flags = scanCompliance(text);
  if (flags.length === 0) return null;
  return (
    <span
      title={`Possible compliance flags: ${flags.join(", ")}`}
      className={`rounded-full bg-[#F9DCD2] px-2 py-[3px] font-mono text-[9px] uppercase tracking-[.08em] text-[#9C2E0C] ${className}`}
    >
      ⚠ {flags.length} flag{flags.length > 1 ? "s" : ""}
    </span>
  );
}
