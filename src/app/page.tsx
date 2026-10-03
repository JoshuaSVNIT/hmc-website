import Link from "next/link";
import { getHomepageContacts, getTodayMessMenu, type SanityContact, type SanityMessMenu } from "@/lib/sanity/queries";
import ContactAvatar from "@/components/ContactAvatar";
import { urlFor } from "@/sanity/lib/image";

function PhoneIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 4V3z" />
    </svg>
  );
}

export default async function HomePage() {
  let homepageContacts: SanityContact[] = [];
  try {
    homepageContacts = await getHomepageContacts();
  } catch (err) {
    console.error("Failed to load homepage contacts:", err);
  }

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDay = daysOfWeek[new Date().getDay()];
  let todayMenu: SanityMessMenu | null = null;
  try {
    todayMenu = await getTodayMessMenu(currentDay);
  } catch (err) {
    console.error("Failed to load today's mess menu:", err);
  }

  const bannerContacts = homepageContacts.filter(
    (c) =>
      !c.category?.toLowerCase().includes("hmc") &&
      (c.category?.toLowerCase().includes("emergency") ||
        c.category?.toLowerCase().includes("supervisor"))
  );

  return (
    <div className="flex flex-col w-full min-h-screen" style={{ backgroundColor: "var(--color-paper)" }}>

      {/* ── 1. HERO ── Left-aligned, deep obsidian background with optional image overlay & ambient gold light */}
      <section
        className="relative py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{ backgroundColor: "var(--color-ink)" }}
      >
        {/* Background Image Layer: replace public/hero-bg.jpg with any image */}
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-bg.jpg"
            alt="SV Bhavan Hostel Campus"
            className="w-full h-full object-cover object-center opacity-25"
          />
          {/* Ambient radial sapphire blue radiance + dark midnight navy gradient for rich depth */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 65% 55% at 85% 20%, rgba(37, 99, 235, 0.22) 0%, transparent 70%), linear-gradient(to right, rgba(10,17,40,0.98) 0%, rgba(10,17,40,0.88) 55%, rgba(10,17,40,0.68) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="max-w-2xl">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-blue-500/15 text-blue-200 border border-blue-400/30 mb-5 shadow-xs backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              Swami Vivekanand Bhavan Resident Portal
            </div>

            <h1
              className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-white"
              style={{
                fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
              }}
            >
              Hostel Management Committee
            </h1>
            <p
              className="mt-4 text-base sm:text-lg leading-relaxed text-slate-300"
            >
              Your centralized portal for complaint resolution, emergency
              assistance, electrical guides, and SV Bhavan updates. No login
              required for residents.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/raise-ticket"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded font-bold text-sm transition-all duration-150 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/35 hover:brightness-105 active:scale-[0.99]"
                style={{
                  backgroundColor: "var(--color-accent-primary)",
                  color: "#ffffff",
                  fontFamily: "var(--font-space-grotesk), system-ui",
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Raise a Ticket
              </Link>
              <Link
                href="/track-ticket"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded font-semibold text-sm transition-all duration-150 border border-white/20 text-white hover:bg-white/10 hover:border-blue-400/50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                Track Ticket
              </Link>
              <a
                href="#mess-menu"
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded text-sm transition-all border border-blue-400/30 bg-blue-500/10 text-blue-200 hover:bg-blue-500/20 hover:border-blue-400/50 sm:ml-auto"
              >
                🍽️ Today&apos;s Mess Menu ↓
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Sleek academic cobalt divider between Hero and Content */}
      <div className="h-0.5 w-full bg-gradient-to-r from-blue-700 via-blue-500 to-indigo-600 opacity-90" />

      {/* ── 2. EMERGENCY & SUPERVISORS — compact scannable directory ── */}
      <section
        id="emergency-banner"
        className="py-8 px-4 sm:px-6 lg:px-8"
        aria-label="Emergency and Supervisor Helplines"
      >
        <div
          className="max-w-2xl mx-auto rounded-xl border border-rose-200/90 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-rose-100">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 relative shrink-0">
                <span className="animate-emergency-pulse absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600" />
              </span>
              <h2
                className="text-sm font-bold text-rose-950"
                style={{
                  fontFamily: "var(--font-space-grotesk), system-ui",
                }}
              >
                Emergency &amp; Supervisors
                <span className="font-normal text-rose-600 text-xs ml-2">
                  tap to dial directly
                </span>
              </h2>
            </div>
            <Link
              href="/contacts"
              className="text-xs font-bold text-rose-700 hover:text-rose-900 transition-colors"
            >
              All contacts →
            </Link>
          </div>

          {bannerContacts.length === 0 ? (
            <p className="text-xs italic text-slate-500 py-1">
              Contact numbers will appear here once added in Sanity Studio.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {bannerContacts.map((contact) => {
                const telHref = `tel:${contact.phone.replace(/[\s\-().]/g, "")}`;
                const isEmergency = contact.category?.toLowerCase().includes("emergency");
                const photoUrl =
                  contact.photo?.asset?._ref
                    ? urlFor(contact.photo).width(64).height(64).fit("crop").auto("format").url()
                    : null;
                return (
                  <a
                    key={contact._id}
                    href={telHref}
                    className="flex items-center justify-between py-2.5 px-2 rounded-lg gap-4 group hover:bg-rose-50/60 transition-colors"
                    title={`Call ${contact.label}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <ContactAvatar
                        photoUrl={photoUrl}
                        icon={contact.icon}
                        defaultEmoji={isEmergency ? "🚨" : "👷"}
                        sizeClass="w-8 h-8"
                        fallbackBgClass={isEmergency ? "bg-rose-100 text-rose-700" : "bg-blue-100 text-blue-800"}
                        alt={contact.label}
                      />
                      <div className="min-w-0">
                        {contact.title && (
                          <div className="text-[11px] font-semibold text-blue-700">
                            {contact.title}
                          </div>
                        )}
                        <div className="text-sm font-semibold text-slate-900 truncate">
                          {contact.label}
                        </div>
                      </div>
                      {isEmergency && (
                        <span
                          className="text-[10px] px-2 py-0.5 rounded font-bold shrink-0 bg-rose-100 text-rose-700 border border-rose-200/60"
                        >
                          Urgent
                        </span>
                      )}
                    </div>
                    <div
                      className="flex items-center gap-2 shrink-0"
                    >
                      <span
                        className={`font-bold text-sm tracking-wide ${
                          isEmergency ? "text-rose-700 group-hover:text-rose-900" : "text-slate-700 group-hover:text-blue-700"
                        }`}
                        style={{ fontFamily: "var(--font-ibm-plex-mono), monospace" }}
                      >
                        {contact.phone}
                      </span>
                      <span className="opacity-0 group-hover:opacity-100 text-blue-600 transition-opacity">
                        <PhoneIcon />
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── 3. QUICK SERVICES ── */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="mb-6">
          <h2
            className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900"
            style={{
              fontFamily: "var(--font-space-grotesk), system-ui",
            }}
          >
            Quick Services
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Access essential hostel utilities and administrative services with one tap.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            {
              href: "/raise-ticket",
              emoji: "🛠️",
              title: "Raise a Ticket",
              desc: "LAN, electrical, plumbing & room complaints.",
              cta: "Submit complaint",
              iconBg: "bg-blue-100/90 text-blue-800 border border-blue-200/80",
              accentCls: "text-blue-700 group-hover:text-blue-800",
              hoverBorder: "hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10",
            },
            {
              href: "/track-ticket",
              emoji: "🔍",
              title: "Track Ticket",
              desc: "Live status & supervisor resolution updates.",
              cta: "Check status",
              iconBg: "bg-sky-100/90 text-sky-800 border border-sky-200/80",
              accentCls: "text-sky-700 group-hover:text-sky-800",
              hoverBorder: "hover:border-sky-400 hover:shadow-lg hover:shadow-sky-500/10",
            },
            {
              href: "/notices",
              emoji: "📢",
              title: "Hostel Notices",
              desc: "Circulars, maintenance schedules & timings.",
              cta: "Read circulars",
              iconBg: "bg-emerald-100/90 text-emerald-800 border border-emerald-200/80",
              accentCls: "text-emerald-700 group-hover:text-emerald-800",
              hoverBorder: "hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10",
            },
            {
              href: "/gallery",
              emoji: "📸",
              title: "Event Gallery",
              desc: "Celebrations, sports posters & memories.",
              cta: "View photos",
              iconBg: "bg-indigo-100/90 text-indigo-800 border border-indigo-200/80",
              accentCls: "text-indigo-700 group-hover:text-indigo-800",
              hoverBorder: "hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/10",
            },
          ].map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className={`group flex flex-col justify-between aspect-square p-4 sm:p-5 rounded-xl border border-slate-200/90 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${card.hoverBorder}`}
            >
              <div>
                <span className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl sm:text-2xl transition-transform group-hover:scale-110 duration-200 ${card.iconBg}`}>
                  {card.emoji}
                </span>
                <h3
                  className="mt-3 text-sm sm:text-base font-bold leading-snug text-slate-900"
                  style={{
                    fontFamily: "var(--font-space-grotesk), system-ui",
                  }}
                >
                  {card.title}
                </h3>
                <p className="text-[11px] sm:text-xs mt-1 text-slate-500 leading-relaxed">
                  {card.desc}
                </p>
              </div>
              <div
                className={`mt-3 pt-3 text-xs font-bold border-t border-slate-100 flex items-center justify-between ${card.accentCls}`}
              >
                <span>{card.cta}</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Guides highlight strip */}
        <div
          className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl border border-blue-200/90 bg-gradient-to-r from-blue-50/70 via-blue-50/30 to-white shadow-xs"
        >
          <div>
            <h4
              className="font-bold text-base text-slate-900"
              style={{
                fontFamily: "var(--font-space-grotesk), system-ui",
              }}
            >
              Experiencing LAN or electrical trouble in your room?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Check our official step-by-step troubleshooting guides before raising a ticket.
            </p>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
            <Link
              href="/guides/lan"
              className="flex-1 sm:flex-none text-center px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all border border-slate-300 bg-white hover:bg-slate-50 text-slate-900 shadow-xs"
            >
              LAN Guide
            </Link>
            <Link
              href="/guides/electrical"
              className="flex-1 sm:flex-none text-center px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-xs bg-slate-900 text-blue-300 hover:bg-slate-800 hover:text-white"
            >
              Electrical Guide
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. TODAY'S MESS MENU ── */}
      <section
        id="mess-menu"
        className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full mb-10"
        aria-label="Today's Mess Menu"
      >
        <div
          className="rounded-xl border border-blue-200/90 animate-mess-glow bg-gradient-to-b from-blue-50/50 via-white to-white p-6 sm:p-8 shadow-xs"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-blue-100 text-blue-900 border border-blue-200">🍽️</span>
              <div>
                <h2
                  className="text-xl font-bold text-slate-900"
                  style={{
                    fontFamily: "var(--font-space-grotesk), system-ui",
                  }}
                >
                  Today&apos;s Mess Menu
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Swami Vivekanand Bhavan Central Dining Hall
                </p>
              </div>
            </div>
            <span
              className="text-xs px-3 py-1 rounded-full font-bold bg-blue-100 text-blue-800 border border-blue-200/80"
              style={{ fontFamily: "var(--font-ibm-plex-mono), monospace" }}
            >
              Today: {currentDay}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                meal: "Breakfast",
                icon: "☀️",
                time: "7:30 – 9:30 AM",
                pillCls: "bg-blue-100 text-blue-800",
                menuText: todayMenu?.breakfast,
              },
              {
                meal: "Lunch",
                icon: "🍱",
                time: "12:30 – 2:30 PM",
                pillCls: "bg-indigo-100 text-indigo-800",
                menuText: todayMenu?.lunch,
              },
              {
                meal: "Dinner",
                icon: "🌙",
                time: "7:30 – 9:30 PM",
                pillCls: "bg-cyan-100 text-cyan-800",
                menuText: todayMenu?.dinner,
              },
            ].map(({ meal, icon, time, pillCls, menuText }) => (
              <div
                key={meal}
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs hover:border-blue-400 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-xs font-bold text-slate-900 flex items-center gap-1.5"
                    style={{
                      fontFamily: "var(--font-space-grotesk), system-ui",
                    }}
                  >
                    <span>{icon}</span> {meal}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded ${pillCls}`}
                    style={{
                      fontFamily: "var(--font-ibm-plex-mono), monospace",
                    }}
                  >
                    {time}
                  </span>
                </div>
                {menuText ? (
                  <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed font-medium">
                    {menuText}
                  </p>
                ) : (
                  <p className="text-xs italic text-slate-400">
                    Menu scheduled as per weekly hostel dining roster.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
