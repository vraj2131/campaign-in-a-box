# Campaign in a Box

One input, a full campaign starting point. Paste an offer and an audience, get five distinct marketing angles, pick one, and receive a complete kit built around that angle: ad copy for Meta, Taboola native, and TikTok, a native advertorial pre-lander with a live styled preview, and the email and SMS opt-in copy that feeds the list.

Built for the It's Today Media Marketing Development Engineer build challenge.

## Stack

- Next.js (App Router) + TypeScript + Tailwind — one repo, frontend and API together
- Groq API via the OpenAI SDK (`llama-3.3-70b-versatile`, fallback `llama-3.1-8b-instant`)
- No database, no auth, no paid services

## Run locally

```bash
npm install
cp .env.example .env.local   # add your GROQ_API_KEY
npm run dev
```

## Deploy

1. Push to GitHub, import the repo in Vercel.
2. Add env var `GROQ_API_KEY`.
3. Deploy and test the full path on the live URL.

## Architecture

Two LLM calls per run, not a dozen:

1. `POST /api/angles` — offer info → 5 angles (one small JSON call)
2. `POST /api/kit` — offer + chosen angle → the entire kit (one structured JSON call)

`POST /api/fetch-offer` optionally fetches a URL server-side and extracts readable text, with paste as the fallback.

The advertorial is never generated as raw HTML. The model returns structured content (headline, subhead, sections, cta) and `AdvertorialPreview` renders it into a styled native-article template. That keeps the demo reliable and the preview always well-formed.

## File map

```
/app
  page.tsx                 main UI: form, angle cards, kit view, all states
  /api
    /angles/route.ts       POST: offer info -> 5 angles (JSON)
    /kit/route.ts          POST: offer + chosen angle -> full kit (JSON)
    /fetch-offer/route.ts  POST: fetch URL, extract readable text
/lib
  groq.ts                  Groq client + callLLM() helper with JSON parsing + 1 retry
  prompts.ts               system prompts (angles, kit)
  types.ts                 shared TS types
  sample.ts                preloaded sample offer + vertical list
/components
  OfferForm.tsx
  AngleCard.tsx
  KitView.tsx              tabs: Ads | Advertorial | Capture
  AdvertorialPreview.tsx   styled native-article preview from structured content
  CopyButton.tsx
```

## Design notes

The UI is a tool a media buyer opens every day, not a chatbot. Warm paper background, ink text, one persimmon accent, flat editorial surfaces, hard offset shadows for the tactile primary actions — no gradients. The single deliberate contrast: sans-serif app chrome (Instrument Sans), serif advertorial preview (Newsreader) so the pre-lander reads like a published article. Every generated asset renders lightly flavored like the platform it will live on: Meta as a feed ad card, Taboola as a native headline with a thumbnail slot, TikTok as ordered script beats on dark, email as a mini opt-in form, SMS as a message bubble.
