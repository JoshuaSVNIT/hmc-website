"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  SearchIcon,
  CalendarIcon,
  PhoneIcon,
  AlertIcon,
  UserIcon,
  MenuIcon,
} from "@/components/icons";

const SEARCH_INDEX: { keywords: string[]; href: string; label: string }[] = [
  { keywords: ["notice", "circular", "announcement"], href: "/notices", label: "Notices" },
  { keywords: ["mess", "menu", "food", "dining", "dues"], href: "/#mess-menu", label: "Mess Menu" },
  { keywords: ["ticket", "complaint", "raise", "lan", "electrical", "plumbing"], href: "/raise-ticket", label: "Raise Ticket" },
  { keywords: ["track", "status"], href: "/track-ticket", label: "Track Ticket" },
  { keywords: ["contact", "phone", "emergency", "supervisor"], href: "/contacts", label: "Contacts" },
  { keywords: ["gallery", "photo", "album"], href: "/gallery", label: "Gallery" },
  { keywords: ["about", "team", "hmc", "people"], href: "/about", label: "About HMC" },
  { keywords: ["event", "fest", "sports"], href: "/events", label: "Events" },
  { keywords: ["guide", "lan"], href: "/guides/lan", label: "LAN Guide" },
  { keywords: ["guide", "electrical"], href: "/guides/electrical", label: "Electrical Guide" },
];

type TopBarProps = {
  onMenuOpen: () => void;
};

export default function TopBar({ onMenuOpen }: TopBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return SEARCH_INDEX.filter(
      (item) =>
        item.keywords.some((k) => k.includes(q) || q.includes(k)) ||
        item.label.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [query]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (suggestions[0]) {
      router.push(suggestions[0].href);
      setQuery("");
      setFocused(false);
    }
  };

  return (
    <header
      className={`no-print z-30 px-4 sm:px-6 lg:px-8 ${
        isHome
          ? "absolute top-0 inset-x-0 pt-4"
          : "sticky top-0 bg-[#0B1424]/95 backdrop-blur-md border-b border-white/8 py-3"
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuOpen}
          className="lg:hidden shrink-0 p-2.5 rounded-xl bg-black/35 text-white backdrop-blur-md border border-white/15 hover:bg-black/45 transition-colors"
          aria-label="Open menu"
        >
          <MenuIcon size={18} />
        </button>

        <form
          onSubmit={onSubmit}
          className="relative flex-1 max-w-xl mx-auto"
          role="search"
        >
          <div
            className={`flex items-center gap-2.5 rounded-full px-4 py-2.5 border transition-all ${
              focused
                ? "bg-black/55 border-white/30 shadow-lg"
                : "bg-black/35 border-white/15"
            } backdrop-blur-md`}
          >
            <SearchIcon size={16} className="text-white/55 shrink-0" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              placeholder="Search notices, facilities, mess menu, services..."
              className="w-full bg-transparent text-sm text-white placeholder:text-white/45 outline-none"
              aria-label="Search site"
            />
          </div>

          {focused && suggestions.length > 0 && (
            <ul className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-[#0B1424]/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden z-50">
              {suggestions.map((s) => (
                <li key={s.href + s.label}>
                  <button
                    type="button"
                    className="w-full text-left px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      router.push(s.href);
                      setQuery("");
                      setFocused(false);
                    }}
                  >
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </form>

        <div className="hidden md:flex items-center gap-1.5 shrink-0">
          <Link
            href="/notices"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <CalendarIcon size={14} />
            <span className="hidden xl:inline">Notices &amp; Calendar</span>
          </Link>
          <Link
            href="/contacts"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <PhoneIcon size={14} />
            <span className="hidden xl:inline">Important Contacts</span>
          </Link>
          <Link
            href="/contacts"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold text-white bg-black/40 border border-red-400/40 hover:bg-red-500/20 transition-colors"
          >
            <AlertIcon size={14} className="text-red-400" />
            Emergency
          </Link>
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold bg-gold text-ink hover:brightness-105 transition-all shadow-md shadow-black/20"
          >
            <UserIcon size={14} />
            HMC Login
          </Link>
        </div>
      </div>
    </header>
  );
}
