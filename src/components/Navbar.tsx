"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Read feature toggles from env vars (Section 6 of PROJECT_SPEC.md)
  // Conditionally omit nav links entirely when corresponding var is "false"
  const showLeaderboard =
    process.env.NEXT_PUBLIC_SHOW_LEADERBOARD !== "false" &&
    process.env.NEXT_PUBLIC_SHOW_LEADERBOARD === "true";

  const showEvents =
    process.env.NEXT_PUBLIC_SHOW_EVENTS !== "false" &&
    process.env.NEXT_PUBLIC_SHOW_EVENTS === "true";

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/raise-ticket", label: "Raise Ticket", highlight: true },
    { href: "/track-ticket", label: "Track Ticket" },
    { href: "/contacts", label: "Contacts", urgent: true },
    { href: "/guides/lan", label: "LAN Guide" },
    { href: "/guides/electrical", label: "Electrical Guide" },
    { href: "/notices", label: "Notices" },
    { href: "/gallery", label: "Gallery" },
    ...(showEvents ? [{ href: "/events", label: "Events" }] : []),
    ...(showLeaderboard ? [{ href: "/leaderboard", label: "Leaderboard" }] : []),
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="no-print sticky top-0 z-50 bg-slate-900 text-white shadow-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link
            href="/"
            className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-lg bg-[#255168] flex items-center justify-center font-bold text-lg text-white shadow-inner border border-[#1d3f54]">
              SV
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base sm:text-lg leading-tight tracking-tight text-white">
                HMC
              </span>
              <span className="text-[11px] text-slate-300 font-medium tracking-wide">
                Swami Vivekanand Bhavan
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              if (link.highlight) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-colors duration-150 shadow-sm ${
                      active
                        ? "bg-yellow-500 text-slate-950"
                        : "bg-yellow-400 hover:bg-yellow-500 text-slate-950"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              }
              if (link.urgent) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 flex items-center gap-1.5 ${
                      active
                        ? "bg-red-600/30 text-red-300 border border-red-500/50"
                        : "text-red-400 hover:text-red-300 hover:bg-red-950/40"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    {link.label}
                  </Link>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ${
                    active
                      ? "bg-[#1d3f54] text-white font-semibold"
                      : "text-slate-300 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Admin Portal Link */}
            <Link
              href="/admin"
              className={`ml-2 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors duration-150 ${
                isActive("/admin")
                  ? "border-[#4e869e] text-[#7da8be] bg-[#09151f]/60"
                  : "border-slate-700 text-slate-400 hover:text-white hover:border-slate-600"
              }`}
            >
              HMC Admin
            </Link>
          </div>

          {/* Mobile Right Controls: Hamburger Menu */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-400"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
              id="mobile-menu-button"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer/Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-3 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                  link.highlight
                    ? "bg-yellow-400 text-slate-950 font-bold"
                    : link.urgent
                    ? "text-red-400 bg-red-950/30 flex items-center justify-between"
                    : active
                    ? "bg-[#1d3f54] text-white font-semibold"
                    : "text-slate-200 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span>{link.label}</span>
                {link.urgent && (
                  <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full font-bold">
                    Emergency
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-2 border-t border-slate-800/80">
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800"
            >
              🔒 HMC Member Login / Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
