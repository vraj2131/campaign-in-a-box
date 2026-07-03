export type Angle = {
  id: string;
  name: string; // e.g. "The Overlooked Cause"
  driver: string; // emotional driver: curiosity, loss aversion, aspiration...
  audience: string; // who this resonates with
  hook: string; // the one-line hook the angle is built on
};

export type AdCopy = {
  meta: { primaryText: string; headline: string; description: string };
  taboola: { headline: string; thumbnailConcept: string };
  tiktok: { hook: string; scriptBeats: string[] };
  google?: { headlines: string[]; descriptions: string[] }; // stretch
};

export type Advertorial = {
  headline: string;
  subhead: string;
  sections: { heading: string; body: string }[];
  cta: string;
};

export type CaptureCopy = {
  emailOptin: { headline: string; sub: string; button: string };
  smsOptin: { message: string };
};

export type Kit = {
  angle: Angle;
  ads: AdCopy;
  advertorial: Advertorial;
  capture: CaptureCopy;
};

export type OfferInput = {
  description: string; // pasted or extracted from URL
  vertical: string;
  audience: string;
  primaryPlatform: "meta" | "taboola" | "tiktok";
};
