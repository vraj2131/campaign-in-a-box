"use client";

import { useState } from "react";

// Copy-to-clipboard with inline confirmation. Used on every kit block + Copy All.
export default function CopyButton({
  text,
  label = "Copy",
  className = "",
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      onClick={copy}
      className={`rounded-[7px] border px-2.5 py-[5px] font-mono text-[9.5px] uppercase tracking-[.08em] transition-all hover:border-ink ${
        copied
          ? "border-moss bg-moss text-white"
          : "border-[#D8D2BF] bg-transparent text-muted"
      } ${className}`}
    >
      {copied ? "Copied ✓" : label}
    </button>
  );
}
