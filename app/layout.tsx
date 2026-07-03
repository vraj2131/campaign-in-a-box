import type { Metadata } from "next";
import { Instrument_Sans, Newsreader, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});
const serif = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Campaign in a Box",
  description:
    "One offer in, a full campaign out: five angles, ad copy for Meta / Taboola / TikTok, a native advertorial pre-lander, and email + SMS capture copy.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${sans.variable} ${serif.variable} ${mono.variable} font-sans bg-paper text-ink antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
