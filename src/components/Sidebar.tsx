"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  InfoIcon,
  BuildingIcon,
  UtensilsIcon,
  BellIcon,
  GridIcon,
  UsersIcon,
  ImageIcon,
  PhoneIcon,
  ChevronDownIcon,
  InstagramIcon,
  LinkedInIcon,
  YouTubeIcon,
  SunIcon,
  MoonIcon,
  CloseIcon,
  WrenchIcon,
  TrackIcon,
  DocIcon,
  GameIcon,
  CalendarIcon,
} from "@/components/icons";

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
  children?: { href: string; label: string; icon: ReactNode }[];
  match?: "exact" | "prefix";
};

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [servicesOpen, setServicesOpen] = useState(false);

  const showLeaderboard =
    process.env.NEXT_PUBLIC_SHOW_LEADERBOARD === "true";
  const showEvents = process.env.NEXT_PUBLIC_SHOW_EVENTS === "true";

  useEffect(() => {
    const stored = window.localStorage.getItem("hmc-theme");
    if (stored === "dark" || stored === "light") {
      document.documentElement.setAttribute("data-theme", stored);
    }
  }, []);

  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggleTheme = () => {
    const current =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "dark"
        : "light";
    const next = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    window.localStorage.setItem("hmc-theme", next);
  };

  const isActive = (href: string, match: "exact" | "prefix" = "prefix") => {
    if (href.startsWith("/#")) return false;
    if (href === "/" || match === "exact") return pathname === href;
    return pathname.startsWith(href);
  };

  const servicesChildren = [
    { href: "/raise-ticket", label: "Raise a Ticket", icon: <WrenchIcon size={16} /> },
    { href: "/track-ticket", label: "Track Ticket", icon: <TrackIcon size={16} /> },
    { href: "/guides/lan", label: "LAN Guide", icon: <DocIcon size={16} /> },
    { href: "/guides/electrical", label: "Electrical Guide", icon: <DocIcon size={16} /> },
    ...(showLeaderboard
      ? [{ href: "/leaderboard", label: "Leaderboard", icon: <GameIcon size={16} /> }]
      : []),
  ];

  const navItems: NavItem[] = [
    { href: "/", label: "Home", icon: <HomeIcon size={18} />, match: "exact" },
    { href: "/about", label: "About HMC", icon: <InfoIcon size={18} /> },
    { href: "/#life-at-hmc", label: "Facilities", icon: <BuildingIcon size={18} /> },
    { href: "/#mess-menu", label: "Mess & Menu", icon: <UtensilsIcon size={18} /> },
    { href: "/notices", label: "Notices", icon: <BellIcon size={18} /> },
    {
      href: "/raise-ticket",
      label: "Services",
      icon: <GridIcon size={18} />,
      children: servicesChildren,
    },
    { href: "/track-ticket", label: "Student Portal", icon: <UsersIcon size={18} /> },
    { href: "/gallery", label: "Gallery", icon: <ImageIcon size={18} /> },
    ...(showEvents
      ? [{ href: "/events", label: "Events", icon: <CalendarIcon size={18} /> }]
      : []),
    { href: "/contacts", label: "Contact", icon: <PhoneIcon size={18} /> },
  ];

  const linkClass = (active: boolean) =>
    [
      "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200",
      active
        ? "bg-[#3B6FD9] text-white font-semibold shadow-md shadow-blue-900/30"
        : "text-white/70 hover:text-white hover:bg-white/8",
    ].join(" ");

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden={!open}
      />

      <aside
        className={`no-print fixed top-0 left-0 z-50 flex h-dvh w-[var(--sidebar-width)] flex-col bg-[#0B1424] text-white transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Main navigation"
      >
        {/* Brand */}
        <div className="flex items-start justify-between gap-2 px-5 pt-6 pb-4">
          <Link href="/" className="flex items-center gap-3 group" onClick={onClose}>
            <div className="relative w-11 h-11 shrink-0 rounded-xl border border-white/15 bg-white/5 flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 48 48" className="w-8 h-8 text-white/90" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M6 38V18l10-8 8 6 8-6 10 8v20" />
                <path d="M14 38V24h8v14M26 38V20h8v18" />
                <path d="M4 38h40" />
              </svg>
            </div>
            <div className="leading-tight">
              <div className="text-[13px] font-bold tracking-tight text-white group-hover:text-gold-200 transition-colors">
                HMC Boys Hostel
              </div>
              <div className="text-[11px] text-white/45 mt-0.5">SVNIT, Surat</div>
            </div>
          </Link>
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10"
            onClick={onClose}
            aria-label="Close menu"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-0.5">
          {navItems.map((item) => {
            if (item.children) {
              const childActive = item.children.some((c) => isActive(c.href));
              const expanded = servicesOpen || childActive;
              return (
                <div key={item.label}>
                  <button
                    type="button"
                    onClick={() => setServicesOpen((v) => !v)}
                    className={`${linkClass(false)} w-full ${childActive ? "text-white" : ""}`}
                  >
                    <span className="opacity-80">{item.icon}</span>
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronDownIcon
                      size={16}
                      className={`opacity-50 transition-transform ${expanded ? "rotate-180" : ""}`}
                    />
                  </button>
                  {expanded && (
                    <div className="mt-0.5 ml-3 pl-3 border-l border-white/10 space-y-0.5">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={linkClass(isActive(child.href))}
                        >
                          <span className="opacity-70">{child.icon}</span>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={`${item.label}-${item.href}`}
                href={item.href}
                className={linkClass(isActive(item.href, item.match))}
              >
                <span className="opacity-80">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom brand strip */}
        <div className="mt-auto px-5 pb-5 pt-3 border-t border-white/8">
          <div className="relative mb-4 overflow-hidden rounded-xl bg-gradient-to-br from-white/8 to-transparent p-4">
            <svg
              viewBox="0 0 200 60"
              className="absolute inset-x-0 bottom-0 w-full h-14 text-white/10"
              fill="currentColor"
              aria-hidden
            >
              <path d="M0 60V28l18-14 16 10 14-12 20 14 18-10 22 16 20-12 22 14 30-18V60H0Z" />
            </svg>
            <p className="relative font-script text-2xl text-white/90 leading-none">
              Same Walls New Stories.
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon size={16} />
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedInIcon size={16} />
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="YouTube"
              >
                <YouTubeIcon size={16} />
              </a>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className="theme-toggle flex items-center gap-1 p-1 rounded-full bg-white/8 border border-white/10"
              aria-label="Toggle theme"
            >
              <span className="theme-sun p-1.5 rounded-full text-white/50 transition-colors">
                <SunIcon size={14} />
              </span>
              <span className="theme-moon p-1.5 rounded-full text-white/50 transition-colors">
                <MoonIcon size={14} />
              </span>
            </button>
          </div>

          <p className="text-[10px] leading-relaxed text-white/35">
            Hostel Management Committee
            <br />
            Swami Vivekanand Bhavan · SVNIT
          </p>
        </div>
      </aside>
    </>
  );
}
