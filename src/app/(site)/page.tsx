import Link from "next/link";
import {
  getHomepageContacts,
  getTodayMessMenu,
  getLatestNotices,
  getAllGalleryItems,
  getAllEvents,
  type SanityContact,
  type SanityMessMenu,
  type SanityNotice,
  type SanityGalleryItem,
  type SanityEvent,
} from "@/lib/sanity/queries";
import { urlFor } from "@/sanity/lib/image";
import ContactAvatar from "@/components/ContactAvatar";
import {
  ArrowRightIcon,
  PlayIcon,
  ShieldIcon,
  UsersIcon,
  BuildingIcon,
  CheckCircleIcon,
  BedIcon,
  UtensilsIcon,
  WrenchIcon,
  TrackIcon,
  BellIcon,
  GridIcon,
  ChevronRightIcon,
  DocIcon,
  PhoneIcon,
  ImageIcon,
  CalendarIcon,
} from "@/components/icons";

function portableTextExcerpt(body: SanityNotice["body"], max = 90): string {
  if (!body || !Array.isArray(body)) return "";
  const text = body
    .filter((block) => block?._type === "block")
    .map((block) =>
      Array.isArray(block.children)
        ? block.children.map((c: { text?: string }) => c.text ?? "").join("")
        : ""
    )
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}

function formatNoticeDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  } catch {
    return iso;
  }
}

function noticeTag(notice: SanityNotice): { label: string; className: string } {
  if (notice.pinned) {
    return { label: "Important", className: "bg-rose-100 text-rose-700" };
  }
  const title = notice.title.toLowerCase();
  if (title.includes("mess") || title.includes("fee") || title.includes("due") || title.includes("finance")) {
    return { label: "Finance", className: "bg-amber-100 text-amber-800" };
  }
  if (title.includes("maintain") || title.includes("repair") || title.includes("water") || title.includes("electric")) {
    return { label: "Maintenance", className: "bg-sky-100 text-sky-800" };
  }
  if (title.includes("event") || title.includes("fest") || title.includes("cultural")) {
    return { label: "Event", className: "bg-emerald-100 text-emerald-800" };
  }
  return { label: "Notice", className: "bg-indigo-100 text-indigo-800" };
}

function eventTag(title: string): { label: string; className: string } {
  const t = title.toLowerCase();
  if (t.includes("sport") || t.includes("fest") || t.includes("game")) {
    return { label: "Sports", className: "bg-orange-100 text-orange-800" };
  }
  if (t.includes("cultural") || t.includes("night") || t.includes("music")) {
    return { label: "Cultural", className: "bg-fuchsia-100 text-fuchsia-800" };
  }
  return { label: "Wellness", className: "bg-teal-100 text-teal-800" };
}

const ACTION_CARDS = [
  {
    href: "/track-ticket",
    title: "Track Ticket",
    desc: "Check live complaint status",
    icon: <TrackIcon size={20} />,
    tone: "bg-blue-50 text-blue-700",
  },
  {
    href: "/#mess-menu",
    title: "Mess & Menu",
    desc: "Today's dining schedule",
    icon: <UtensilsIcon size={20} />,
    tone: "bg-emerald-50 text-emerald-700",
  },
  {
    href: "/raise-ticket",
    title: "Raise a Complaint",
    desc: "LAN, electrical & more",
    icon: <WrenchIcon size={20} />,
    tone: "bg-orange-50 text-orange-700",
  },
  {
    href: "/guides/lan",
    title: "LAN Guide",
    desc: "Troubleshoot room network",
    icon: <DocIcon size={20} />,
    tone: "bg-violet-50 text-violet-700",
  },
  {
    href: "/notices",
    title: "Notices",
    desc: "Circulars & announcements",
    icon: <BellIcon size={20} />,
    tone: "bg-indigo-50 text-indigo-700",
  },
  {
    href: "/contacts",
    title: "Student Services",
    desc: "Contacts & helplines",
    icon: <GridIcon size={20} />,
    tone: "bg-cyan-50 text-cyan-700",
  },
];

const QUICK_LINKS = [
  { href: "/about", label: "Hostel Rules & About", icon: <BuildingIcon size={16} /> },
  { href: "/contacts", label: "Important Contacts", icon: <PhoneIcon size={16} /> },
  { href: "/#mess-menu", label: "Today's Mess Menu", icon: <UtensilsIcon size={16} /> },
  { href: "/guides/lan", label: "LAN Guide", icon: <DocIcon size={16} /> },
  { href: "/guides/electrical", label: "Electrical Guide", icon: <DocIcon size={16} /> },
  { href: "/raise-ticket", label: "Raise a Ticket", icon: <WrenchIcon size={16} /> },
  { href: "/gallery", label: "Photo Gallery", icon: <ImageIcon size={16} /> },
];

const LIFE_FALLBACK = [
  {
    title: "Our Home",
    desc: "Shared spaces that feel like home beyond classrooms.",
    image: "/hero-bg.jpg",
  },
  {
    title: "Mess Facility",
    desc: "Daily meals planned for the hostel community.",
    image: "/hero-bg.jpg",
  },
  {
    title: "Fitness & Recreation",
    desc: "Courts, games, and evenings that bring residents together.",
    image: "/hero-bg.jpg",
  },
  {
    title: "Common Rooms",
    desc: "Study corners, hangouts, and student-driven spaces.",
    image: "/hero-bg.jpg",
  },
];

export default async function HomePage() {
  let homepageContacts: SanityContact[] = [];
  let notices: SanityNotice[] = [];
  let gallery: SanityGalleryItem[] = [];
  let events: SanityEvent[] = [];
  let todayMenu: SanityMessMenu | null = null;

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDay = daysOfWeek[new Date().getDay()];
  const showEvents = process.env.NEXT_PUBLIC_SHOW_EVENTS === "true";

  try {
    [homepageContacts, notices, gallery, todayMenu] = await Promise.all([
      getHomepageContacts(),
      getLatestNotices(),
      getAllGalleryItems(),
      getTodayMessMenu(currentDay),
    ]);
  } catch (err) {
    console.error("Failed to load homepage data:", err);
  }

  if (showEvents) {
    try {
      events = await getAllEvents();
    } catch (err) {
      console.error("Failed to load events:", err);
    }
  }

  const upcomingEvents = events
    .filter((e) => {
      if (!e.date) return true;
      const dayMs = 86400000;
      const cutoff = new Date();
      cutoff.setHours(0, 0, 0, 0);
      cutoff.setTime(cutoff.getTime() - dayMs);
      return new Date(e.date).getTime() >= cutoff.getTime();
    })
    .slice(0, 3);

  const bannerContacts = homepageContacts.filter(
    (c) =>
      !c.category?.toLowerCase().includes("hmc") &&
      (c.category?.toLowerCase().includes("emergency") ||
        c.category?.toLowerCase().includes("supervisor"))
  );

  const lifeCards = LIFE_FALLBACK.map((fallback, i) => {
    const item = gallery[i];
    const img = item?.images?.[0]
      ? urlFor(item.images[0]).width(640).height(400).fit("crop").auto("format").url()
      : fallback.image;
    return {
      title: item?.eventName || item?.title || fallback.title,
      desc: fallback.desc,
      image: img,
      href: "/gallery",
    };
  });

  return (
    <div className="flex flex-col w-full min-h-screen bg-paper">
      {/* ── HERO ── */}
      <section className="relative min-h-[78vh] lg:min-h-[86vh] flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-bg.jpg"
            alt=""
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1424]/92 via-[#0B1424]/72 to-[#0B1424]/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1424]/85 via-transparent to-[#0B1424]/45" />
        </div>

        <div className="relative z-10 px-5 sm:px-8 lg:px-12 pb-12 pt-28 lg:pb-16 lg:pt-32">
          <div className="max-w-3xl">
            <p className="animate-hero-fade font-script text-2xl sm:text-3xl text-gold-soft/90 mb-3">
              More Than a Hostel
            </p>
            <h1 className="animate-hero-fade animate-hero-fade-delay-1 font-display text-4xl sm:text-6xl lg:text-7xl font-semibold text-gold-soft leading-[1.05] tracking-tight">
              A Home Beyond Classrooms
            </h1>
            <p className="animate-hero-fade animate-hero-fade-delay-2 mt-4 max-w-xl text-sm sm:text-base text-white/75 leading-relaxed">
              Where friendships grow, ideas thrive and everyday life becomes an
              unforgettable journey at Swami Vivekanand Bhavan.
            </p>

            <div className="animate-hero-fade animate-hero-fade-delay-3 mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gold text-ink text-sm font-bold hover:brightness-105 transition-all shadow-lg shadow-black/25"
              >
                Explore HMC
                <ArrowRightIcon size={16} />
              </Link>
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/35 text-white text-sm font-semibold hover:bg-white/10 transition-all"
              >
                <PlayIcon size={16} />
                Virtual Tour
              </Link>
            </div>
          </div>

          <div className="mt-10 lg:mt-0 lg:absolute lg:right-12 lg:bottom-16 flex flex-wrap lg:flex-col gap-4 lg:gap-5">
            {[
              { icon: <ShieldIcon size={18} />, label: "Safe & Secure Living" },
              { icon: <UsersIcon size={18} />, label: "Vibrant Community" },
              { icon: <BuildingIcon size={18} />, label: "Modern Facilities" },
              { icon: <CheckCircleIcon size={18} />, label: "Student-Driven Governance" },
            ].map((b, i) => (
              <div
                key={b.label}
                className={`flex items-center gap-3 text-white/90 ${i % 2 === 1 ? "animate-float-soft" : ""}`}
                style={i % 2 === 1 ? { animationDelay: `${i * 0.4}s` } : undefined}
              >
                <span className="w-10 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-gold-soft shrink-0">
                  {b.icon}
                </span>
                <span className="text-xs sm:text-sm font-medium">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DASHBOARD ── */}
      <section className="relative -mt-6 z-10 px-4 sm:px-6 lg:px-8 pb-10">
        <div className="max-w-[1400px] mx-auto space-y-5">
          {/* Action cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            {ACTION_CARDS.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="card-surface group p-4 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)] transition-all duration-200"
              >
                <span className={`inline-flex w-10 h-10 rounded-xl items-center justify-center ${card.tone}`}>
                  {card.icon}
                </span>
                <h3 className="mt-3 text-sm font-bold text-ink leading-snug">{card.title}</h3>
                <p className="mt-1 text-[11px] text-ink-500 leading-relaxed">{card.desc}</p>
                <span className="mt-3 inline-flex text-ink-400 group-hover:text-accent-primary transition-colors">
                  <ChevronRightIcon size={16} />
                </span>
              </Link>
            ))}
          </div>

          {/* Overview + Notices + Quick links */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
            <div className="xl:col-span-4 card-surface p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-2xl font-semibold text-ink">Live Overview</h2>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  Updated
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    value: "600+",
                    label: "Total Residents",
                    icon: <UsersIcon size={18} />,
                    tone: "bg-violet-50 text-violet-700",
                  },
                  {
                    value: "96%",
                    label: "Room Occupancy",
                    icon: <BedIcon size={18} />,
                    tone: "bg-emerald-50 text-emerald-700",
                  },
                  {
                    value: "3×",
                    label: "Daily Mess Meals",
                    icon: <UtensilsIcon size={18} />,
                    tone: "bg-amber-50 text-amber-700",
                  },
                  {
                    value: "24×7",
                    label: "Complaint Portal",
                    icon: <WrenchIcon size={18} />,
                    tone: "bg-rose-50 text-rose-700",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-ink/5 bg-paper/60 p-3.5"
                  >
                    <span className={`inline-flex w-9 h-9 rounded-xl items-center justify-center ${stat.tone}`}>
                      {stat.icon}
                    </span>
                    <div className="mt-2 font-display text-2xl font-semibold text-ink leading-none">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-[11px] text-ink-500 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="xl:col-span-5 card-surface p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-2xl font-semibold text-ink">Latest Notices</h2>
                <Link href="/notices" className="text-xs font-semibold text-accent-primary hover:underline">
                  View all
                </Link>
              </div>
              {notices.length === 0 ? (
                <p className="text-sm text-ink-400 italic py-6">
                  Notices published in Sanity Studio will appear here.
                </p>
              ) : (
                <ul className="space-y-4">
                  {notices.map((notice, idx) => {
                    const tag = noticeTag(notice);
                    const dots = ["bg-amber-400", "bg-sky-400", "bg-rose-400", "bg-emerald-400"];
                    return (
                      <li key={notice._id} className="flex gap-3">
                        <div className="w-12 shrink-0 text-right">
                          <div className="text-[11px] font-bold text-ink-600 font-mono leading-tight">
                            {formatNoticeDate(notice.date)}
                          </div>
                        </div>
                        <div className="relative flex flex-col items-center">
                          <span className={`w-2.5 h-2.5 rounded-full ${dots[idx % dots.length]} ring-4 ring-white`} />
                          {idx < notices.length - 1 && (
                            <span className="w-px flex-1 bg-ink/10 mt-1" />
                          )}
                        </div>
                        <div className="min-w-0 pb-1">
                          <div className="flex items-start gap-2 flex-wrap">
                            <Link
                              href="/notices"
                              className="text-sm font-semibold text-ink hover:text-accent-primary transition-colors"
                            >
                              {notice.title}
                            </Link>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tag.className}`}>
                              {tag.label}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs text-ink-500 leading-relaxed">
                            {portableTextExcerpt(notice.body) || "Official hostel circular."}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="xl:col-span-3 card-surface p-5 sm:p-6">
              <h2 className="font-display text-2xl font-semibold text-ink mb-4">Quick Links</h2>
              <ul className="space-y-1">
                {QUICK_LINKS.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm text-ink-700 hover:bg-paper transition-colors group"
                    >
                      <span className="w-8 h-8 rounded-lg bg-paper flex items-center justify-center text-ink-500 group-hover:text-accent-primary transition-colors">
                        {link.icon}
                      </span>
                      <span className="flex-1 font-medium">{link.label}</span>
                      <ChevronRightIcon size={14} className="text-ink-300 group-hover:text-accent-primary" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Life at HMC + Events */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
            <div id="life-at-hmc" className="xl:col-span-8 card-surface p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-display text-2xl font-semibold text-ink">Life at HMC</h2>
                  <p className="text-xs text-ink-500 mt-0.5">Moments and spaces that shape hostel life</p>
                </div>
                <Link href="/gallery" className="text-xs font-semibold text-accent-primary hover:underline">
                  Open gallery
                </Link>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {lifeCards.map((card) => (
                  <Link
                    key={card.title}
                    href={card.href}
                    className="group relative overflow-hidden rounded-2xl aspect-[4/5] bg-ink"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={card.image}
                      alt={card.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-3">
                      <div className="flex items-end justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-bold text-white">{card.title}</h3>
                          <p className="text-[10px] text-white/70 mt-0.5 line-clamp-2">{card.desc}</p>
                        </div>
                        <span className="shrink-0 w-8 h-8 rounded-full bg-gold text-ink flex items-center justify-center shadow-md">
                          <ArrowRightIcon size={14} />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="xl:col-span-4 card-surface p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-2xl font-semibold text-ink">Upcoming Events</h2>
                {showEvents && (
                  <Link href="/events" className="text-xs font-semibold text-accent-primary hover:underline">
                    All events
                  </Link>
                )}
              </div>

              {!showEvents ? (
                <div className="rounded-2xl bg-paper border border-ink/5 p-4">
                  <div className="flex items-center gap-2 text-ink-600 mb-2">
                    <CalendarIcon size={16} />
                    <span className="text-sm font-semibold">Events coming soon</span>
                  </div>
                  <p className="text-xs text-ink-500 leading-relaxed">
                    Hostel events will show here when the events page is enabled.
                    Meanwhile, check notices for the latest updates.
                  </p>
                  <Link
                    href="/notices"
                    className="inline-flex items-center gap-1 mt-3 text-xs font-bold text-accent-primary"
                  >
                    Browse notices <ChevronRightIcon size={14} />
                  </Link>
                </div>
              ) : upcomingEvents.length === 0 ? (
                <p className="text-sm text-ink-400 italic py-4">No upcoming events published yet.</p>
              ) : (
                <ul className="space-y-4">
                  {upcomingEvents.map((event, idx) => {
                    const tag = eventTag(event.title);
                    const dots = ["bg-orange-400", "bg-fuchsia-400", "bg-teal-400"];
                    return (
                      <li key={event._id} className="flex gap-3">
                        <div className="w-12 shrink-0 text-right">
                          <div className="text-[11px] font-bold text-ink-600 font-mono leading-tight">
                            {event.date ? formatNoticeDate(event.date) : "TBA"}
                          </div>
                        </div>
                        <div className="relative flex flex-col items-center">
                          <span className={`w-2.5 h-2.5 rounded-full ${dots[idx % dots.length]} ring-4 ring-white`} />
                          {idx < upcomingEvents.length - 1 && (
                            <span className="w-px flex-1 bg-ink/10 mt-1" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-start gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-ink">{event.title}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tag.className}`}>
                              {tag.label}
                            </span>
                          </div>
                          {event.description && (
                            <p className="mt-0.5 text-xs text-ink-500 line-clamp-2">{event.description}</p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* Emergency + Mess */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div
              id="emergency-banner"
              className="card-surface p-5 sm:p-6 border border-rose-100"
              aria-label="Emergency and Supervisor Helplines"
            >
              <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-rose-100">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="animate-emergency-pulse absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600" />
                  </span>
                  <h2 className="font-display text-xl font-semibold text-rose-950">
                    Emergency &amp; Supervisors
                  </h2>
                </div>
                <Link href="/contacts" className="text-xs font-bold text-rose-700 hover:text-rose-900">
                  All contacts →
                </Link>
              </div>

              {bannerContacts.length === 0 ? (
                <p className="text-xs italic text-ink-400 py-2">
                  Contact numbers will appear here once added in Sanity Studio.
                </p>
              ) : (
                <div className="divide-y divide-ink/5">
                  {bannerContacts.map((contact) => {
                    const telHref = `tel:${contact.phone.replace(/[\s\-().]/g, "")}`;
                    const isEmergency = contact.category?.toLowerCase().includes("emergency");
                    const photoUrl = contact.photo?.asset?._ref
                      ? urlFor(contact.photo).width(64).height(64).fit("crop").auto("format").url()
                      : null;
                    return (
                      <a
                        key={contact._id}
                        href={telHref}
                        className="flex items-center justify-between py-2.5 px-1 gap-4 group hover:bg-rose-50/60 rounded-lg transition-colors"
                        title={`Call ${contact.label}`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <ContactAvatar
                            photoUrl={photoUrl}
                            icon={contact.icon}
                            defaultEmoji={isEmergency ? "🚨" : "👷"}
                            sizeClass="w-8 h-8"
                            fallbackBgClass={
                              isEmergency ? "bg-rose-100 text-rose-700" : "bg-blue-100 text-blue-800"
                            }
                            alt={contact.label}
                          />
                          <div className="min-w-0">
                            {contact.title && (
                              <div className="text-[11px] font-semibold text-blue-700">{contact.title}</div>
                            )}
                            <div className="text-sm font-semibold text-ink truncate">{contact.label}</div>
                          </div>
                        </div>
                        <span
                          className={`font-bold text-sm tracking-wide font-mono ${
                            isEmergency ? "text-rose-700" : "text-ink-700"
                          }`}
                        >
                          {contact.phone}
                        </span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            <div
              id="mess-menu"
              className="card-surface p-5 sm:p-6 animate-mess-glow border border-gold/30"
              aria-label="Today's Mess Menu"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-xl flex items-center justify-center bg-gold/15 text-amber-800 border border-gold/30">
                    <UtensilsIcon size={20} />
                  </span>
                  <div>
                    <h2 className="font-display text-xl font-semibold text-ink">Today&apos;s Mess Menu</h2>
                    <p className="text-xs text-ink-500 mt-0.5">SV Bhavan Central Dining Hall</p>
                  </div>
                </div>
                <span className="text-xs px-3 py-1 rounded-full font-bold bg-gold/15 text-amber-900 border border-gold/30 font-mono">
                  Today: {currentDay}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { meal: "Breakfast", time: "7:30 – 9:30 AM", menuText: todayMenu?.breakfast, tone: "bg-amber-50 text-amber-800" },
                  { meal: "Lunch", time: "12:30 – 2:30 PM", menuText: todayMenu?.lunch, tone: "bg-orange-50 text-orange-800" },
                  { meal: "Dinner", time: "7:30 – 9:30 PM", menuText: todayMenu?.dinner, tone: "bg-rose-50 text-rose-800" },
                ].map(({ meal, time, menuText, tone }) => (
                  <div key={meal} className="rounded-2xl border border-ink/5 bg-paper/70 p-3.5">
                    <div className="flex items-center justify-between mb-2 gap-2">
                      <span className="text-xs font-bold text-ink">{meal}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full font-mono ${tone}`}>
                        {time}
                      </span>
                    </div>
                    {menuText ? (
                      <p className="text-xs text-ink-700 whitespace-pre-line leading-relaxed">{menuText}</p>
                    ) : (
                      <p className="text-xs italic text-ink-400">Menu as per weekly dining roster.</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
