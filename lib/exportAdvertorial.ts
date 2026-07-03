import type { Advertorial } from "./types";

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Injects the model's structured advertorial content into a static HTML template
// string (never asks the model to emit HTML directly) so the export is always
// well-formed, matching the design tokens the in-app preview uses.
export function buildAdvertorialHtml(advertorial: Advertorial, brand = "Sponsored"): string {
  const sections = advertorial.sections
    .map((s) => `    <section>\n      <h3>${escapeHtml(s.heading)}</h3>\n      <p>${escapeHtml(s.body)}</p>\n    </section>`)
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(advertorial.headline)}</title>
<style>
  body { margin: 0; background: #F4F1E9; font-family: Georgia, "Times New Roman", serif; color: #2A2620; }
  article { max-width: 760px; margin: 0 auto; background: #FFFDF9; padding: 54px 68px; box-sizing: border-box; }
  .tag { display: inline-block; border: 1px solid #E8501A; color: #E8501A; font-family: "Courier New", monospace; font-size: 9px; letter-spacing: .16em; text-transform: uppercase; padding: 3px 7px; border-radius: 3px; }
  h1 { font-size: 40px; line-height: 1.12; letter-spacing: -0.015em; margin: 14px 0 10px; }
  .subhead { font-size: 19px; font-style: italic; color: #57503E; margin: 0 0 22px; }
  .byline { display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #E3DDCC; padding-bottom: 22px; margin-bottom: 28px; font-family: -apple-system, sans-serif; font-size: 12.5px; color: #6E6858; }
  .avatar { width: 30px; height: 30px; flex: none; border-radius: 50%; background: #E8501A; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: bold; font-family: -apple-system, sans-serif; font-size: 12px; }
  h3 { font-size: 23px; margin: 0 0 10px; }
  p { font-size: 17.5px; line-height: 1.68; margin: 0 0 26px; }
  .cta-wrap { text-align: center; background: #F4F1E9; border-radius: 10px; padding: 28px; margin-top: 8px; }
  .cta { display: inline-block; background: #E8501A; color: #fff; font-family: -apple-system, sans-serif; font-weight: bold; font-size: 15px; padding: 14px 30px; border-radius: 9px; text-decoration: none; box-shadow: 3px 3px 0 #17150F; }
  .disclaimer { text-align: center; font-family: -apple-system, sans-serif; font-size: 10.5px; color: #98917F; margin-top: 26px; }
  @media (max-width: 640px) { article { padding: 40px 24px; } h1 { font-size: 30px; } }
</style>
</head>
<body>
  <article>
    <div class="tag">Advertorial</div>
    <h1>${escapeHtml(advertorial.headline)}</h1>
    <p class="subhead">${escapeHtml(advertorial.subhead)}</p>
    <div class="byline">
      <span class="avatar">${escapeHtml(brand.slice(0, 2).toUpperCase())}</span>
      <span>By <strong>The Editorial Desk</strong> &middot; Sponsored feature</span>
    </div>
${sections}
    <div class="cta-wrap"><a class="cta" href="#">${escapeHtml(advertorial.cta)}</a></div>
    <p class="disclaimer">This is a sponsored article. Individual results vary.</p>
  </article>
</body>
</html>
`;
}

export function downloadAdvertorialHtml(advertorial: Advertorial, brand = "Sponsored") {
  const html = buildAdvertorialHtml(advertorial, brand);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "advertorial.html";
  a.click();
  URL.revokeObjectURL(url);
}
