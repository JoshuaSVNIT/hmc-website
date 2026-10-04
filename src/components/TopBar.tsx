"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  SearchIcon,
  AlertIcon,
  UserIcon,
  MenuIcon,
  CloseIcon,
} from "@/components/icons";
import type { SearchItem } from "@/app/api/search/route";

type TopBarProps = {
  onMenuOpen: () => void;
};

// Module-level cache so we only fetch search index once per session
let cachedSearchIndex: SearchItem[] | null = null;

function getCategoryBadge(category: SearchItem["category"]) {
  switch (category) {
    case "Notice":
      return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    case "Contact":
      return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    case "Emergency":
      return "bg-rose-500/20 text-rose-300 border-rose-500/30";
    case "Dining":
      return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    case "Guide":
      return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
    case "Service":
      return "bg-purple-500/20 text-purple-300 border-purple-500/30";
    default:
      return "bg-slate-500/20 text-slate-300 border-slate-500/30";
  }
}

export default function TopBar({ onMenuOpen }: TopBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchIndex, setSearchIndex] = useState<SearchItem[]>(
    cachedSearchIndex || []
  );

  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  // Close mobile search on route navigation
  useEffect(() => {
    setMobileSearchOpen(false);
    setQuery("");
    setFocused(false);
  }, [pathname]);

  // Load real search index from API
  const loadSearchIndex = async () => {
    if (cachedSearchIndex) {
      setSearchIndex(cachedSearchIndex);
      return;
    }
    try {
      const res = await fetch("/api/search");
      if (res.ok) {
        const data = await res.json();
        if (data.items) {
          cachedSearchIndex = data.items;
          setSearchIndex(data.items);
        }
      }
    } catch (err) {
      console.error("Failed to load search index:", err);
    }
  };

  // Eagerly prefetch search index on mount
  useEffect(() => {
    loadSearchIndex();
  }, []);

  // Filter search results against real site content
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return searchIndex
      .filter((item) => {
        const titleMatch = item.title.toLowerCase().includes(q);
        const subMatch = item.subtitle?.toLowerCase().includes(q);
        const catMatch = item.category.toLowerCase().includes(q);
        const keyMatch = item.keywords?.some((k) =>
          k.toLowerCase().includes(q)
        );
        return titleMatch || subMatch || catMatch || keyMatch;
      })
      .slice(0, 7);
  }, [query, searchIndex]);

  const handleSelect = (href: string) => {
    router.push(href);
    setQuery("");
    setFocused(false);
    setMobileSearchOpen(false);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (results[0]) {
      handleSelect(results[0].href);
    }
  };

  // Focus mobile input when mobile search opens
  useEffect(() => {
    if (mobileSearchOpen) {
      setTimeout(() => {
        mobileInputRef.current?.focus();
      }, 50);
    }
  }, [mobileSearchOpen]);

  // Handle Escape key to close search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileSearchOpen(false);
        setFocused(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header
      className={`no-print z-30 px-4 sm:px-6 lg:px-8 transition-colors ${
        isHome
          ? "absolute top-0 inset-x-0 pt-4"
          : "sticky top-0 bg-[#0B1424]/95 backdrop-blur-md border-b border-white/8 py-3"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left: Mobile hamburger menu button + Brand */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onMenuOpen}
            className="lg:hidden shrink-0 p-2.5 rounded-xl bg-black/35 text-white backdrop-blur-md border border-white/15 hover:bg-black/45 transition-colors"
            aria-label="Open navigation menu"
          >
            <MenuIcon size={18} />
          </button>
          <Link href="/" className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/95 border border-white/20 p-0.5 flex items-center justify-center shrink-0 shadow-xs">
              <img src="/HMC_logo.svg" alt="HMC Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-sm text-white tracking-wide">HMC</span>
          </Link>
        </div>

        {/* ── DESKTOP SEARCH BAR (>= md): Full width input as-is ── */}
        <div className="hidden md:flex flex-1 max-w-xl mx-auto">
          <form
            onSubmit={onSubmit}
            className="relative w-full"
            role="search"
          >
            <div
              className={`flex items-center gap-2.5 rounded-full px-4 py-2.5 border transition-all ${
                focused
                  ? "bg-black/60 border-white/30 shadow-lg"
                  : "bg-black/35 border-white/15 hover:border-white/25"
              } backdrop-blur-md`}
            >
              <SearchIcon size={16} className="text-white/55 shrink-0" />
              <input
                ref={desktopInputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => {
                  setFocused(true);
                  loadSearchIndex();
                }}
                onBlur={() => setTimeout(() => setFocused(false), 200)}
                placeholder="Search notices, contacts, facilities, mess menu..."
                className="w-full bg-transparent text-sm text-white placeholder:text-white/45 outline-none"
                aria-label="Search site content"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-white/40 hover:text-white p-0.5"
                  aria-label="Clear search"
                >
                  <CloseIcon size={14} />
                </button>
              )}
            </div>

            {/* Desktop Results Dropdown */}
            {focused && query.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-[#0B1424]/98 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden z-50 max-h-[420px] overflow-y-auto">
                {results.length > 0 ? (
                  <ul className="divide-y divide-white/5" role="listbox">
                    {results.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          className="w-full text-left px-4 py-3 text-sm hover:bg-white/10 transition-colors flex items-start gap-3"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleSelect(item.href)}
                        >
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border shrink-0 mt-0.5 ${getCategoryBadge(
                              item.category
                            )}`}
                          >
                            {item.category}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-white truncate">
                              {item.title}
                            </div>
                            {item.subtitle && (
                              <div className="text-xs text-white/50 truncate mt-0.5">
                                {item.subtitle}
                              </div>
                            )}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-xs text-white/50">
                    No matching results for &ldquo;{query}&rdquo;
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        {/* Right actions: Mobile search button + Emergency + Login */}
        <div className="flex items-center gap-2 shrink-0">
          {/* ── MOBILE SEARCH BUTTON (< md): Icon-only magnifying glass ── */}
          <button
            type="button"
            onClick={() => {
              setMobileSearchOpen(true);
              loadSearchIndex();
            }}
            className="md:hidden shrink-0 p-2.5 rounded-xl bg-black/35 text-white backdrop-blur-md border border-white/15 hover:bg-black/45 transition-colors"
            aria-label="Search site"
          >
            <SearchIcon size={18} />
          </button>

          {/* Emergency Helpline CTA */}
          <Link
            href="/#emergency-banner"
            onClick={(e) => {
              if (pathname === "/") {
                e.preventDefault();
                const el = document.getElementById("emergency-banner");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
                  window.history.replaceState(null, "", "/#emergency-banner");
                  window.dispatchEvent(new CustomEvent("trigger-emergency-highlight"));
                }
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold text-white bg-black/40 border border-red-400/40 hover:bg-red-500/20 transition-colors"
            aria-label="Emergency contacts"
          >
            <AlertIcon size={14} className="text-red-400" />
            <span className="hidden sm:inline">Emergency</span>
          </Link>

          {/* HMC Admin Portal Link */}
          <Link
            href="/admin/login"
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold bg-gold text-ink hover:brightness-105 transition-all shadow-md shadow-black/20"
          >
            <UserIcon size={14} />
            HMC Login
          </Link>
        </div>
      </div>

      {/* ── MOBILE SEARCH EXPANDED OVERLAY (< md) ── */}
      {mobileSearchOpen && (
        <div className="md:hidden absolute inset-0 z-50 bg-[#0B1424] px-4 py-2.5 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200 shadow-xl border-b border-white/15">
          <form
            onSubmit={onSubmit}
            className="flex-1 flex items-center gap-2 bg-black/45 rounded-xl px-3 py-2 border border-white/20"
            role="search"
          >
            <SearchIcon size={16} className="text-white/60 shrink-0" />
            <input
              ref={mobileInputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search notices, contacts, services..."
              className="w-full bg-transparent text-sm text-white placeholder:text-white/45 outline-none"
              aria-label="Search query"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-white/40 hover:text-white p-1"
                aria-label="Clear input"
              >
                <CloseIcon size={14} />
              </button>
            )}
          </form>

          <button
            type="button"
            onClick={() => {
              setMobileSearchOpen(false);
              setQuery("");
            }}
            className="text-xs font-bold text-white/80 hover:text-white px-2.5 py-2 rounded-lg transition-colors shrink-0"
          >
            Cancel
          </button>

          {/* Mobile Results Dropdown */}
          {query.trim() && (
            <div className="absolute top-full left-0 right-0 max-h-[75vh] overflow-y-auto bg-[#0B1424]/98 backdrop-blur-2xl border-b border-white/10 shadow-2xl divide-y divide-white/5 z-50">
              {results.length > 0 ? (
                <ul role="listbox">
                  {results.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        className="w-full text-left px-4 py-3.5 hover:bg-white/10 transition-colors flex items-start gap-3"
                        onClick={() => handleSelect(item.href)}
                      >
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border shrink-0 mt-0.5 ${getCategoryBadge(
                            item.category
                          )}`}
                        >
                          {item.category}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-sm text-white truncate">
                            {item.title}
                          </div>
                          {item.subtitle && (
                            <div className="text-xs text-white/50 truncate mt-0.5">
                              {item.subtitle}
                            </div>
                          )}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-5 text-center text-xs text-white/50">
                  No results found for &ldquo;{query}&rdquo;
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
