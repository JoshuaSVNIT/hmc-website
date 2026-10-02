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
      className="no-print border-t mt-auto"
      style={{
        backgroundColor: "var(--color-ink)",
        borderColor: "rgba(255,255,255,0.07)",
        color: "rgba(243,241,235,0.5)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: About */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded flex items-center justify-center font-bold text-sm shrink-0"
                style={{
                  backgroundColor: "var(--color-accent-primary)",
                  color: "var(--color-ink)",
                  fontFamily: "var(--font-ibm-plex-mono), monospace",
                }}
              >
                SV
              </div>
              <span
                className="font-bold text-base"
                style={{
                  color: "var(--color-paper)",
                  fontFamily: "var(--font-space-grotesk), system-ui",
                }}
              >
                SV Bhavan HMC
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Swami Vivekanand Bhavan Hostel Management Committee, SVNIT Surat.
              Dedicated to prompt complaint resolution and transparent
              communication with hostel residents.
            </p>
            <p className="text-xs" style={{ color: "rgba(243,241,235,0.3)" }}>
              SVNIT Surat, Gujarat — 395007
            </p>
          </div>

          {/* Col 2: Complaint Services */}
          <div>
            <h3
              className="text-sm font-semibold mb-3"
              style={{
                color: "var(--color-paper)",
                fontFamily: "var(--font-space-grotesk), system-ui",
              }}
            >
              Complaint Services
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/raise-ticket", label: "Raise a Ticket" },
                { href: "/track-ticket", label: "Track Ticket Status" },
                { href: "/guides/lan", label: "LAN Troubleshooting Guide" },
                { href: "/guides/electrical", label: "Electrical Complaint Guide" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="transition-colors hover:text-white"
                    style={{ color: "rgba(243,241,235,0.55)" }}
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
              className="text-sm font-semibold mb-3"
              style={{
                color: "var(--color-paper)",
                fontFamily: "var(--font-space-grotesk), system-ui",
              }}
            >
              Hostel Life
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/notices"
                  className="transition-colors hover:text-white"
                  style={{ color: "rgba(243,241,235,0.55)" }}
                >
                  Important Notices
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="transition-colors hover:text-white"
                  style={{ color: "rgba(243,241,235,0.55)" }}
                >
                  Event Photo Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="transition-colors hover:text-white"
                  style={{ color: "rgba(243,241,235,0.55)" }}
                >
                  About the HMC Team
                </Link>
              </li>
              {showEvents && (
                <li>
                  <Link
                    href="/events"
                    className="transition-colors hover:text-white"
                    style={{ color: "rgba(243,241,235,0.55)" }}
                  >
                    Upcoming Events
                  </Link>
                </li>
              )}
              {showLeaderboard && (
                <li>
                  <Link
                    href="/leaderboard"
                    className="transition-colors hover:text-white"
                    style={{ color: "rgba(243,241,235,0.55)" }}
                  >
                    Gaming Leaderboard
                  </Link>
                </li>
              )}
              <li>
                <Link
                  href="/contacts"
                  className="transition-colors font-medium"
                  style={{ color: "var(--color-accent-urgent-300)" }}
                >
                  Emergency Contacts
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: HMC Administration */}
          <div>
            <h3
              className="text-sm font-semibold mb-3"
              style={{
                color: "var(--color-paper)",
                fontFamily: "var(--font-space-grotesk), system-ui",
              }}
            >
              HMC Administration
            </h3>
            <p className="text-xs mb-3" style={{ color: "rgba(243,241,235,0.35)" }}>
              Restricted portal for authorized HMC members only.
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/admin"
                  className="transition-colors hover:text-white"
                  style={{ color: "rgba(243,241,235,0.55)" }}
                >
                  Admin Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/login"
                  className="transition-colors hover:text-white"
                  style={{ color: "rgba(243,241,235,0.55)" }}
                >
                  Member Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between text-xs gap-3"
          style={{
            borderColor: "rgba(255,255,255,0.06)",
            color: "rgba(243,241,235,0.3)",
          }}
        >
          <p>© {new Date().getFullYear()} Swami Vivekanand Bhavan HMC. All rights reserved.</p>
          <p>Technical Secretary Project — Built with Next.js, Supabase &amp; Sanity</p>
        </div>
      </div>
    </footer>
  );
}
