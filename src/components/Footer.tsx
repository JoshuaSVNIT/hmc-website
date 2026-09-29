import Link from "next/link";

export default function Footer() {
  const showLeaderboard =
    process.env.NEXT_PUBLIC_SHOW_LEADERBOARD !== "false" &&
    process.env.NEXT_PUBLIC_SHOW_LEADERBOARD === "true";

  const showEvents =
    process.env.NEXT_PUBLIC_SHOW_EVENTS !== "false" &&
    process.env.NEXT_PUBLIC_SHOW_EVENTS === "true";

  return (
    <footer className="no-print bg-slate-950 text-slate-400 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: About & Manifesto */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-[#255168] flex items-center justify-center font-bold text-sm text-white">
                SV
              </div>
              <span className="font-bold text-lg text-white">
                SV Bhavan HMC
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Swami Vivekanand Bhavan Hostel Management Committee.
              Dedicated to serving hostel residents with prompt complaint
              resolution and community updates.
            </p>
            <div className="inline-block bg-slate-900 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-yellow-400 font-semibold">
              Hostel Management Committee • SVB
            </div>
          </div>

          {/* Col 2: Complaint Ticketing */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-3">
              Complaint Services
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/raise-ticket"
                  className="hover:text-yellow-400 transition-colors"
                >
                  Raise a Ticket
                </Link>
              </li>
              <li>
                <Link
                  href="/track-ticket"
                  className="hover:text-yellow-400 transition-colors"
                >
                  Track Ticket Status
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/lan"
                  className="hover:text-yellow-400 transition-colors"
                >
                  LAN Troubleshooting Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/electrical"
                  className="hover:text-yellow-400 transition-colors"
                >
                  Electrical Complaint Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Hostel Life & Notices */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-3">
              Hostel Life
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/notices"
                  className="hover:text-yellow-400 transition-colors"
                >
                  Important Notices
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="hover:text-yellow-400 transition-colors"
                >
                  Event Photo Gallery
                </Link>
              </li>
              {showEvents && (
                <li>
                  <Link
                    href="/events"
                    className="hover:text-yellow-400 transition-colors"
                  >
                    Upcoming Events & Reg
                  </Link>
                </li>
              )}
              {showLeaderboard && (
                <li>
                  <Link
                    href="/leaderboard"
                    className="hover:text-yellow-400 transition-colors"
                  >
                    Gaming Leaderboard
                  </Link>
                </li>
              )}
              <li>
                <Link
                  href="/contacts"
                  className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 font-medium"
                >
                  Emergency Contacts List
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: HMC Administration */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-3">
              HMC Administration
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Restricted portal for authorized Hostel Management Committee members.
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/admin"
                  className="hover:text-white transition-colors"
                >
                  Admin Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/login"
                  className="hover:text-white transition-colors"
                >
                  Member Login
                </Link>
              </li>
            </ul>
            <div className="mt-4 pt-3 border-t border-slate-900">
              <span className="text-xs text-slate-500 block">
                SVNIT Surat, Gujarat - 395007
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} Swami Vivekanand Bhavan HMC. All rights reserved.</p>
          <p>Technical Secretary Project • Built with Next.js, Supabase & Sanity</p>
        </div>
      </div>
    </footer>
  );
}
