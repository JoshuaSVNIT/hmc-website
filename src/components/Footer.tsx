import Link from "next/link";
import BrandMark from "@/components/BrandMark";
import { InstallAppButton } from "@/components/InstallPrompt";

export default function Footer() {
  const showLeaderboard = process.env.NEXT_PUBLIC_SHOW_LEADERBOARD === "true";
  const showEvents = process.env.NEXT_PUBLIC_SHOW_EVENTS === "true";

  return (
    <footer className="no-print mt-auto">
      {/* Brand banner */}
      <div className="relative overflow-hidden bg-[#0B1424] text-white">
        <div className="absolute inset-0 opacity-30 pointer-events-none" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-bg.jpg"
            alt=""
            className="w-full h-full object-cover blur-sm scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1424] via-[#0B1424]/92 to-[#0B1424]/75" />
        </div>

        <div className="relative px-6 sm:px-8 lg:px-10 py-8 lg:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <BrandMark />
            <p className="max-w-md text-sm text-white/55 leading-relaxed">
              Hostel Management Committee, Swami Vivekanand Bhavan, SVNIT Surat.
              Raise and track complaints, find contacts and read notices.
            </p>
          </div>
        </div>
      </div>

      {/* Compact link row */}
      <div className="bg-[#070e1a] border-t border-white/6 px-6 sm:px-8 lg:px-10 py-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-white/40">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link href="/raise-ticket" className="hover:text-gold transition-colors">
              Raise Ticket
            </Link>
            <Link href="/track-ticket" className="hover:text-gold transition-colors">
              Track Ticket
            </Link>
            <Link href="/contacts" className="hover:text-gold transition-colors">
              Contacts
            </Link>
            <Link href="/notices" className="hover:text-gold transition-colors">
              Notices
            </Link>
            <Link href="/gallery" className="hover:text-gold transition-colors">
              Gallery
            </Link>
            <Link href="/about" className="hover:text-gold transition-colors">
              About
            </Link>
            {showEvents && (
              <Link href="/events" className="hover:text-gold transition-colors">
                Events
              </Link>
            )}
            {showLeaderboard && (
              <Link href="/leaderboard" className="hover:text-gold transition-colors">
                Leaderboard
              </Link>
            )}
            <span className="text-white/20">|</span>
            <InstallAppButton className="hover:text-gold transition-colors text-white/50" />
          </div>
          <p>© {new Date().getFullYear()} SV Bhavan HMC · SVNIT Surat</p>
        </div>
      </div>
    </footer>
  );
}
