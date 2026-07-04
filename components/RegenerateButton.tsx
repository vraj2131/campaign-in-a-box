"use client";

// Same mono ghost-chip language as CopyButton / the advertorial "Export HTML" button.
export default function RegenerateButton({
  onClick,
  loading,
  className = "",
}: {
  onClick: () => void;
  loading?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`rounded-[7px] border border-[#D8D2BF] px-2.5 py-[5px] font-mono text-[9.5px] uppercase tracking-[.08em] text-muted transition-all hover:border-ink disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {loading ? "Regenerating…" : "↻ Regenerate"}
    </button>
  );
}
