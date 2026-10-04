"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandMark from "@/components/BrandMark";
import { InstallAppButton } from "@/components/InstallPrompt";
import {
  HomeIcon,
  InfoIcon,
  BuildingIcon,
  UtensilsIcon,
  BellIcon,
  GridIcon,
  ImageIcon,
  PhoneIcon,
  ChevronDownIcon,
  CloseIcon,
  WrenchIcon,
  TrackIcon,
  DocIcon,
  GameIcon,
  CalendarIcon,
  ReformsIcon,
  SparkIcon,
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
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

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
    { href: "/reforms", label: "Our Reforms", icon: <ReformsIcon size={18} /> },
    { href: "/facilities", label: "Facilities", icon: <BuildingIcon size={18} /> },
    { href: "/mess-menu", label: "Mess & Menu", icon: <UtensilsIcon size={18} /> },
    { href: "/room-cleaning", label: "Room Cleaning", icon: <SparkIcon size={18} /> },
    { href: "/notices", label: "Notices", icon: <BellIcon size={18} /> },
    {
      href: "/raise-ticket",
      label: "Services",
      icon: <GridIcon size={18} />,
      children: servicesChildren,
    },
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
          <Link href="/" onClick={onClose} aria-label="HMC — Swami Vivekanand Bhavan, home">
            <BrandMark />
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

        {/* Bottom identity note & install button */}
        <div className="mt-auto px-5 pb-5 pt-3 border-t border-white/8 space-y-2.5">
          <InstallAppButton className="text-xs text-white/60 hover:text-white transition-colors" />
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
