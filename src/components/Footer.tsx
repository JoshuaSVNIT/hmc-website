import Link from "next/link";

export default function Footer() {
  const showLeaderboard =
    process.env.NEXT_PUBLIC_SHOW_LEADERBOARD !== "false" &&
    process.env.NEXT_PUBLIC_SHOW_LEADERBOARD === "true";

  const showEvents =
    process.env.NEXT_PUBLIC_SHOW_EVENTS !== "false" &&
    process.env.NEXT_PUBLIC_SHOW_EVENTS === "true";

  return (
    <footer
      className="no-print border-t mt-auto text-slate-400"
      style={{
        backgroundColor: "var(--color-ink)",
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: About */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 shadow-xs"
                style={{
                  backgroundColor: "var(--color-accent-primary)",
                  color: "#0B0F17",
                  fontFamily: "var(--font-ibm-plex-mono), monospace",
                }}
              >
                SV
              </div>
              <span
                className="font-bold text-base text-white tracking-tight"
                style={{ fontFamily: "var(--font-space-grotesk), system-ui" }}
              >
                SV Bhavan HMC
              </span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-400">
              Swami Vivekanand Bhavan Hostel Management Committee, SVNIT Surat.
              Dedicated to prompt complaint resolution and transparent
              communication with hostel residents.
            </p>
            <p className="text-xs text-slate-500">
              SVNIT Surat, Gujarat — 395007
            </p>
          </div>

          {/* Col 2: Complaint Services */}
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3"
              style={{ fontFamily: "var(--font-space-grotesk), system-ui" }}
            >
              Complaint Services
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              {[
                { href: "/raise-ticket", label: "Raise a Ticket" },
                { href: "/track-ticket", label: "Track Ticket Status" },
                { href: "/guides/lan", label: "LAN Troubleshooting Guide" },
                { href: "/guides/electrical", label: "Electrical Complaint Guide" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-slate-300 hover:text-amber-400 transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Hostel Life */}
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3"
              style={{ fontFamily: "var(--font-space-grotesk), system-ui" }}
            >
              Hostel Life
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link
                  href="/notices"
                  className="text-slate-300 hover:text-amber-400 transition-colors"
                >
                  Important Notices
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="text-slate-300 hover:text-amber-400 transition-colors"
                >
                  Event Photo Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-slate-300 hover:text-amber-400 transition-colors"
                >
                  About the HMC Team
                </Link>
              </li>
              {showEvents && (
                <li>
                  <Link
                    href="/events"
                    className="text-slate-300 hover:text-amber-400 transition-colors"
                  >
                    Upcoming Events
                  </Link>
                </li>
              )}
              {showLeaderboard && (
                <li>
                  <Link
                    href="/leaderboard"
                    className="text-slate-300 hover:text-amber-400 transition-colors"
                  >
                    Gaming Leaderboard
                  </Link>
                </li>
              )}
              <li>
                <Link
                  href="/contacts"
                  className="text-rose-400 hover:text-rose-300 font-semibold transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                  Emergency Contacts
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: HMC Administration */}
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3"
              style={{ fontFamily: "var(--font-space-grotesk), system-ui" }}
            >
              HMC Administration
            </h3>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Restricted portal for authorized committee members and wardens.
            </p>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link
                  href="/admin"
                  className="text-slate-300 hover:text-amber-400 transition-colors"
                >
                  Admin Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/login"
                  className="text-slate-300 hover:text-amber-400 transition-colors"
                >
                  Member Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <p>© {new Date().getFullYear()} Swami Vivekanand Bhavan HMC. All rights reserved.</p>
          <p>Technical Secretary Portal — SVNIT Surat</p>
        </div>
      </div>
    </footer>
  );
}
