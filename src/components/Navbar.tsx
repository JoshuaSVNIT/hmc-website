"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

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
    { href: "/about", label: "About Us" },
    ...(showEvents ? [{ href: "/events", label: "Events" }] : []),
    ...(showLeaderboard ? [{ href: "/leaderboard", label: "Leaderboard" }] : []),
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="no-print sticky top-0 z-50 border-b shadow-sm"
      style={{
        backgroundColor: "var(--color-ink)",
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link
            href="/"
            className="flex items-center gap-3 py-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded"
          >
            <div
              className="w-9 h-9 rounded flex items-center justify-center font-bold text-sm shrink-0 transition-transform group-hover:scale-105 shadow-sm"
              style={{
                backgroundColor: "var(--color-accent-primary)",
                color: "#ffffff",
                fontFamily: "var(--font-ibm-plex-mono), monospace",
              }}
            >
              SV
            </div>
            <div className="flex flex-col leading-none">
              <span
                className="font-bold text-base tracking-tight text-white group-hover:text-blue-300 transition-colors"
                style={{
                  fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
                }}
              >
                HMC SVB
              </span>
              <span className="text-[11px] mt-0.5 text-slate-400">
                Swami Vivekanand Bhavan
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);

              if (link.highlight) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="ml-1 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 shadow-xs hover:shadow-md hover:brightness-105"
                    style={{
                      backgroundColor: "var(--color-accent-primary)",
                      color: "#ffffff",
                      fontFamily: "var(--font-space-grotesk), system-ui",
                    }}
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
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-150 flex items-center gap-1.5"
                    style={{
                      color: active ? "#ffffff" : "var(--color-accent-urgent-300)",
                      backgroundColor: active
                        ? "rgba(239,68,68,0.25)"
                        : "rgba(239,68,68,0.12)",
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-emergency-pulse shrink-0"
                      style={{ backgroundColor: "var(--color-accent-urgent)" }}
                    />
                    {link.label}
                  </Link>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150"
                  style={{
                    color: active ? "#60A5FA" : "rgba(255,255,255,0.75)",
                    backgroundColor: active ? "rgba(37,99,235,0.12)" : "transparent",
                    fontWeight: active ? 700 : 500,
                  }}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Admin link */}
            <Link
              href="/admin"
              className="ml-2 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors duration-150 border"
              style={{
                borderColor: isActive("/admin")
                  ? "rgba(37,99,235,0.6)"
                  : "rgba(255,255,255,0.18)",
                color: isActive("/admin") ? "#60A5FA" : "rgba(255,255,255,0.6)",
                backgroundColor: isActive("/admin") ? "rgba(37,99,235,0.12)" : "transparent",
              }}
            >
              Admin
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
              id="mobile-menu-button"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div
          className="lg:hidden border-t px-3 pt-2 pb-4 space-y-1 shadow-lg"
          id="mobile-menu"
          style={{
            backgroundColor: "var(--color-ink)",
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: link.highlight
                    ? "var(--color-accent-primary)"
                    : active
                    ? "rgba(37,99,235,0.15)"
                    : "transparent",
                  color: link.highlight
                    ? "#ffffff"
                    : link.urgent
                    ? "#fca5a5"
                    : active
                    ? "#60A5FA"
                    : "rgba(255,255,255,0.75)",
                  fontFamily: link.highlight
                    ? "var(--font-space-grotesk), system-ui"
                    : undefined,
                  fontWeight: active ? 700 : 500,
                }}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-white/10">
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
            >
              HMC Admin Portal
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
