import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Plus_Jakarta_Sans,
  IBM_Plex_Mono,
  Great_Vibes,
} from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Swami Vivekanand Bhavan — HMC",
  description:
    "Hostel Management Committee portal for Swami Vivekanand Bhavan, SVNIT. Raise tickets, track complaints, view contacts and notices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${plusJakarta.variable} ${ibmPlexMono.variable} ${greatVibes.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col selection:bg-gold/30 selection:text-ink"
        style={{
          fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif",
          backgroundColor: "var(--color-paper)",
          color: "var(--color-ink)",
        }}
      >
        {children}
      </body>
    </html>
  );
}
