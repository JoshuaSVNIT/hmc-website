import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  IBM_Plex_Sans,
  IBM_Plex_Mono,
} from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
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

export const metadata: Metadata = {
  title: "Swami Vivekanand Bhavan — HMC",
  description:
    "Hostel Management Committee portal for Swami Vivekanand Bhavan, SVNIT. Raise tickets, track complaints, view contacts and notices.",
  icons: {
    icon: "/HMC_logo.svg",
    apple: "/HMC_logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col selection:bg-gold/30 selection:text-ink"
        style={{
          fontFamily: "var(--font-ibm-plex-sans), system-ui, sans-serif",
          backgroundColor: "var(--color-paper)",
          color: "var(--color-ink)",
        }}
      >
        {children}
      </body>
    </html>
  );
}
