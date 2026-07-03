// Client-side heuristic scan for copy that risks getting an ad account flagged.
// This lowers risk by surfacing likely problem phrases; it does not guarantee
// platform compliance and is not a substitute for a real review.
const FLAG_PATTERNS: [RegExp, string][] = [
  [/\bguarantee(d|s)?\b/i, "guaranteed outcome"],
  [/\bcure(d|s)?\b/i, "cure claim"],
  [/\brisk[- ]free\b/i, "risk-free claim"],
  [/\bno risk\b/i, "no risk claim"],
  [/\bclinically proven\b/i, "clinically proven claim"],
  [/\b\d{1,3}%\s*(off|guaranteed|results?)\b/i, "specific numeric claim"],
  [/\blose \d+\s*(lbs?|pounds?|kg)\b/i, "specific health claim"],
  [/\bmiracle\b/i, "miracle claim"],
  [/\bget rich\b/i, "income claim"],
  [/\bmake \$?\d+[kK]?\b/i, "income claim"],
  [/\b100%\s*(guaranteed|safe|effective)\b/i, "absolute claim"],
  [/\bFDA[- ]approved\b/i, "regulatory claim"],
];

export function scanCompliance(text: string): string[] {
  if (!text) return [];
  const hits: string[] = [];
  for (const [re, label] of FLAG_PATTERNS) {
    if (re.test(text) && !hits.includes(label)) hits.push(label);
  }
  return hits;
}
