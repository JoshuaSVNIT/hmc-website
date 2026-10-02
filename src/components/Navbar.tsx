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
        <div className="flex items-center justify-between h-15">
          {/* Logo / Brand */}
          <Link
            href="/"
            className="flex items-center gap-3 py-3 focus:outline-none focus-visible:ring-2 rounded"
            style={{ color: "var(--color-paper)" }}
          >
            <div
              className="w-9 h-9 rounded flex items-center justify-center font-bold text-sm shrink-0"
              style={{
                backgroundColor: "var(--color-accent-primary)",
                color: "var(--color-ink)",
                fontFamily: "var(--font-ibm-plex-mono), monospace",
              }}
            >
              SV
            </div>
            <div className="flex flex-col leading-none">
              <span
                className="font-bold text-base tracking-tight"
                style={{
                  fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
                  color: "var(--color-paper)",
                }}
              >
                HMC SVB
              </span>
              <span
                className="text-[11px] mt-0.5"
                style={{ color: "rgba(243,241,235,0.55)" }}
              >
                Swami Vivekanand Bhavan
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              if (link.highlight) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-3.5 py-1.5 rounded text-sm font-semibold transition-colors duration-150"
                    style={{
                      backgroundColor: active
                        ? "var(--color-accent-primary-600)"
                        : "var(--color-accent-primary)",
                      color: "var(--color-ink)",
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
                    className="px-3 py-1.5 rounded text-sm font-medium transition-colors duration-150 flex items-center gap-1.5"
                    style={{
                      color: active
                        ? "var(--color-accent-urgent-300)"
                        : "var(--color-accent-urgent-300)",
                      backgroundColor: active
                        ? "rgba(179,63,46,0.15)"
                        : "transparent",
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
                  className="px-3 py-1.5 rounded text-sm font-medium transition-colors duration-150"
                  style={{
                    color: active
                      ? "var(--color-paper)"
                      : "rgba(243,241,235,0.65)",
                    backgroundColor: active
                      ? "rgba(243,241,235,0.1)"
                      : "transparent",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Admin link */}
            <Link
              href="/admin"
              className="ml-2 px-3 py-1.5 rounded text-xs font-medium transition-colors duration-150 border"
              style={{
                borderColor: isActive("/admin")
                  ? "rgba(243,241,235,0.3)"
                  : "rgba(243,241,235,0.15)",
                color: isActive("/admin")
                  ? "rgba(243,241,235,0.9)"
                  : "rgba(243,241,235,0.4)",
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
              className="inline-flex items-center justify-center p-2 rounded transition-colors"
              style={{ color: "rgba(243,241,235,0.7)" }}
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
          className="lg:hidden border-t px-3 pt-2 pb-4 space-y-0.5"
          id="mobile-menu"
          style={{
            backgroundColor: "var(--color-ink-950)",
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
                className="block px-3 py-2.5 rounded text-base font-medium transition-colors"
                style={{
                  backgroundColor: link.highlight
                    ? "var(--color-accent-primary)"
                    : active
                    ? "rgba(243,241,235,0.08)"
                    : "transparent",
                  color: link.highlight
                    ? "var(--color-ink)"
                    : link.urgent
                    ? "var(--color-accent-urgent-300)"
                    : active
                    ? "var(--color-paper)"
                    : "rgba(243,241,235,0.7)",
                  fontFamily: link.highlight
                    ? "var(--font-space-grotesk), system-ui"
                    : undefined,
                }}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded text-sm font-medium"
              style={{ color: "rgba(243,241,235,0.4)" }}
            >
              HMC Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
