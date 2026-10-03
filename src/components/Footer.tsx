import Link from "next/link";

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

        <div className="relative px-6 sm:px-8 lg:px-10 py-10 lg:py-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-gold-soft tracking-tight">
                A Better Hostel Life Together
              </h2>
              <p className="mt-2 text-sm text-white/55">
                Discipline. Friendship. Growth. Always.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 lg:gap-8">
              {[
                { title: "Community Events", desc: "& Activities" },
                { title: "Student", desc: "Representation" },
                { title: "Continuous", desc: "Improvement" },
                { title: "Your Feedback", desc: "Matters" },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-2.5">
                  <span className="mt-0.5 w-8 h-8 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0">
                    <span className="w-2 h-2 rounded-full bg-gold" />
                  </span>
                  <div>
                    <div className="text-xs font-semibold text-white/90 leading-snug">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-white/45">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Compact link row */}
      <div className="bg-[#070e1a] border-t border-white/6 px-6 sm:px-8 lg:px-10 py-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-white/40">
          <div className="flex flex-wrap gap-x-4 gap-y-2">
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
            <Link href="/admin" className="hover:text-gold transition-colors">
              Admin
            </Link>
          </div>
          <p>© {new Date().getFullYear()} SV Bhavan HMC · SVNIT Surat</p>
        </div>
      </div>
    </footer>
  );
}
