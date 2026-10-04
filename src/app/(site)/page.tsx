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
import EmergencySectionWrapper from "@/components/EmergencySectionWrapper";
import {
  ArrowRightIcon,
  BuildingIcon,
  UtensilsIcon,
  WrenchIcon,
  ChevronRightIcon,
  DocIcon,
  PhoneIcon,
  ImageIcon,
  CalendarIcon,
  ReformsIcon,
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

const QUICK_LINKS = [
  { href: "/about", label: "Hostel Rules & About", icon: <BuildingIcon size={16} /> },
  { href: "/reforms", label: "Our Reforms & Completed Works", icon: <ReformsIcon size={16} /> },
  { href: "/contacts", label: "Important Contacts", icon: <PhoneIcon size={16} /> },
  { href: "/#mess-menu", label: "Today's Mess Menu", icon: <UtensilsIcon size={16} /> },
  { href: "/guides/lan", label: "LAN Guide", icon: <DocIcon size={16} /> },
  { href: "/guides/electrical", label: "Electrical Guide", icon: <DocIcon size={16} /> },
  { href: "/raise-ticket", label: "Raise a Ticket", icon: <WrenchIcon size={16} /> },
  { href: "/gallery", label: "Photo Gallery", icon: <ImageIcon size={16} /> },
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

  const galleryPreview = gallery.slice(0, 4);

  return (
    <div className="flex flex-col w-full min-h-screen bg-paper">
      {/* ── HERO ── */}
      <section className="relative flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-bg.jpg"
            alt=""
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1424]/92 via-[#0B1424]/78 to-[#0B1424]/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1424]/85 via-transparent to-[#0B1424]/45" />
        </div>

        <div className="relative z-10 px-5 sm:px-8 lg:px-12 pt-16 pb-6 sm:pt-24 sm:pb-10 lg:pt-28 lg:pb-12">
          <div className="max-w-3xl">
            <p className="animate-hero-fade text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-gold-soft/90 mb-2 sm:mb-3">
              Swami Vivekanand Bhavan · SVNIT
            </p>
            <h1 className="animate-hero-fade animate-hero-fade-delay-1 font-display text-3xl sm:text-5xl lg:text-6xl font-semibold text-white leading-[1.1] tracking-tight">
              Hostel Management Committee
            </h1>
            <p className="animate-hero-fade animate-hero-fade-delay-2 mt-3 max-w-xl text-xs sm:text-sm md:text-base text-white/75 leading-relaxed">
              Raise and track complaints, find emergency contacts, read notices
              and check today&apos;s mess menu. No login required for residents.
            </p>

            <div className="animate-hero-fade animate-hero-fade-delay-3 mt-6 sm:mt-7 flex flex-wrap items-center gap-2.5 sm:gap-3">
              <Link
                href="/raise-ticket"
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-gold text-ink text-xs sm:text-sm font-bold hover:brightness-105 transition-all shadow-lg shadow-black/25"
              >
                Raise a Ticket
                <ArrowRightIcon size={15} />
              </Link>
              <Link
                href="/track-ticket"
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-gold text-ink text-xs sm:text-sm font-bold hover:brightness-105 transition-all shadow-lg shadow-black/25"
              >
                Track Ticket
                <ArrowRightIcon size={15} />
              </Link>
              {/* Same-page anchor: smooth-scrolls to the mess menu section below (no navigation). */}
              <a
                href="#mess-menu"
                className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full border border-white/35 text-white/90 text-xs sm:text-sm font-medium hover:bg-white/10 transition-all"
              >
                <UtensilsIcon size={14} />
                Today&apos;s Mess Menu
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. EMERGENCY & SUPERVISORS ── (Directly below hero, visible above fold without scrolling) */}
      <section
        id="emergency-banner"
        className="relative z-10 px-4 sm:px-6 lg:px-8 -mt-4 sm:-mt-6 pb-6 sm:pb-8"
        aria-label="Emergency and Supervisor Helplines"
      >
        <div className="max-w-[1400px] mx-auto">
          <EmergencySectionWrapper>
            <div className="flex items-center justify-between gap-2 pb-3 mb-3.5 border-b border-rose-100">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-emergency-pulse absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600" />
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-semibold text-rose-950">
                  Emergency &amp; Supervisors
                </h2>
              </div>
              <Link href="/contacts" className="text-xs font-bold text-rose-700 hover:text-rose-900 transition-colors">
                All contacts →
              </Link>
            </div>

            {bannerContacts.length === 0 ? (
              <p className="text-xs italic text-ink-400 py-2">
                Contact numbers will appear here once added in Sanity Studio.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
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
                      className="flex items-center justify-between p-2.5 gap-3 group bg-paper/50 hover:bg-rose-50/70 border border-ink/5 hover:border-rose-200 rounded-xl transition-all"
                      title={`Call ${contact.label}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <ContactAvatar
                          photoUrl={photoUrl}
                          icon={contact.icon}
                          defaultEmoji={isEmergency ? "🚨" : "👷"}
                          sizeClass="w-9 h-9"
                          fallbackBgClass={
                            isEmergency ? "bg-rose-100 text-rose-700" : "bg-blue-100 text-blue-800"
                          }
                          alt={contact.label}
                        />
                        <div className="min-w-0">
                          {contact.title && (
                            <div className="text-xs font-semibold text-blue-700 truncate">{contact.title}</div>
                          )}
                          <div className="text-base font-bold text-ink truncate">{contact.label}</div>
                        </div>
                      </div>
                      <span
                        className={`font-bold text-sm tracking-wide font-mono shrink-0 ${
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
          </EmergencySectionWrapper>
        </div>
      </section>

      {/* ── 3. TODAY'S MESS MENU ── */}
      <section
        id="mess-menu"
        className="relative z-10 px-4 sm:px-6 lg:px-8 pb-8 scroll-mt-6"
        aria-label="Today's Mess Menu"
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="card-surface p-5 sm:p-6 animate-mess-glow border border-gold/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-xl flex items-center justify-center bg-gold/15 text-amber-800 border border-gold/30">
                  <UtensilsIcon size={20} />
                </span>
                <div>
                  <h2 className="font-display text-xl sm:text-2xl font-semibold text-ink">Today&apos;s Mess Menu</h2>
                  <p className="text-sm text-ink-500 mt-0.5">SV Bhavan Central Dining Hall</p>
                </div>
              </div>
              <span className="text-xs sm:text-sm px-3.5 py-1 rounded-full font-bold bg-gold/15 text-amber-900 border border-gold/30 font-mono">
                Today: {currentDay}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {[
                { meal: "Breakfast", time: "7:30 – 9:30 AM", menuText: todayMenu?.breakfast, tone: "bg-amber-50 text-amber-800" },
                { meal: "Lunch", time: "12:30 – 2:30 PM", menuText: todayMenu?.lunch, tone: "bg-orange-50 text-orange-800" },
                { meal: "Dinner", time: "7:30 – 9:30 PM", menuText: todayMenu?.dinner, tone: "bg-rose-50 text-rose-800" },
              ].map(({ meal, time, menuText, tone }) => (
                <div key={meal} className="rounded-2xl border border-ink/5 bg-paper/70 p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-2.5 gap-2">
                    <span className="text-base font-bold text-ink">{meal}</span>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full font-mono ${tone}`}>
                      {time}
                    </span>
                  </div>
                  {menuText ? (
                    <p className="text-sm text-ink-700 whitespace-pre-line leading-relaxed">{menuText}</p>
                  ) : (
                    <p className="text-sm italic text-ink-400">Menu as per weekly dining roster.</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR REFORMS & INITIATIVES FEATURE CARD ── */}
      <section
        id="our-reforms"
        className="relative z-10 px-4 sm:px-6 lg:px-8 pb-8"
        aria-label="Our Reforms & Completed Works"
      >
        <div className="max-w-[1400px] mx-auto">
          <Link
            href="/reforms"
            className="group block card-surface p-5 sm:p-7 border border-blue-200/90 bg-gradient-to-r from-blue-50/80 via-white to-amber-50/30 hover:border-blue-400 hover:shadow-md transition-all rounded-2xl relative overflow-hidden"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
              <div className="flex items-start sm:items-center gap-4">
                <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center bg-blue-600 text-white shadow-md shadow-blue-600/20 shrink-0 group-hover:scale-105 transition-transform">
                  <ReformsIcon size={24} />
                </span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-mono">
                      Accountability &amp; Progress
                    </span>
                    <span className="text-xs font-semibold text-slate-500 font-mono">
                      Completed Initiatives
                    </span>
                  </div>
                  <h2
                    className="font-display text-2xl sm:text-3xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors"
                  >
                    Our Reforms &amp; Completed Works
                  </h2>
                  <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                    Explore the documented record of hostel infrastructure upgrades, common room
                    renovations, mess enhancements, and resident welfare policies delivered across Swami Vivekanand Bhavan.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-blue-600 text-white text-xs sm:text-sm font-bold shadow-sm group-hover:bg-blue-700 group-hover:gap-3 transition-all">
                  <span>View Timeline &amp; Photos</span>
                  <ArrowRightIcon size={14} />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ── 4. GALLERY PREVIEW ── */}
      <section
        id="life-at-hmc"
        className="relative z-10 px-4 sm:px-6 lg:px-8 pb-8"
        aria-label="Gallery preview"
      >
        <div id="gallery" className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
            <div className={`${showEvents ? "xl:col-span-8" : "xl:col-span-12"} card-surface p-5 sm:p-6`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-display text-2xl font-semibold text-ink">Life at Swami Vivekanand Bhavan</h2>
                  <p className="text-xs text-ink-500 mt-0.5">Moments and celebrations captured across the hostel</p>
                </div>
                <Link href="/gallery" className="text-xs font-semibold text-accent-primary hover:underline">
                  Open gallery →
                </Link>
              </div>

              {galleryPreview.length === 0 ? (
                <div className="py-12 text-center text-sm text-ink-400 italic">
                  Gallery albums published in Sanity Studio will appear here.
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {galleryPreview.map((item) => {
                    const displayTitle = item.title || item.eventName || "Gallery Album";
                    const photoCount = item.images?.length ?? 0;
                    const videoCount = (item.videos ?? []).filter((v) => Boolean(v?.videoUrl?.trim())).length;
                    const coverUrl = item.images?.[0]
                      ? urlFor(item.images[0]).width(640).height(480).fit("crop").auto("format").url()
                      : "/hero-bg.jpg";

                    return (
                      <Link
                        key={item._id}
                        href="/gallery"
                        className="group relative overflow-hidden rounded-2xl aspect-[4/5] bg-ink shadow-sm"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={coverUrl}
                          alt={displayTitle}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-85 group-hover:opacity-95"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-3.5">
                          <div className="flex items-end justify-between gap-2">
                            <div className="min-w-0">
                              {item.date && (
                                <span className="block text-xs font-mono text-gold-soft mb-1 font-semibold">
                                  {formatNoticeDate(item.date)}
                                </span>
                              )}
                              <h3 className="text-sm sm:text-base font-bold text-white leading-snug line-clamp-2">
                                {displayTitle}
                              </h3>
                              {(photoCount > 0 || videoCount > 0) && (
                                <p className="text-xs text-white/70 mt-1 font-medium">
                                  {photoCount > 0 && `${photoCount} ${photoCount === 1 ? "photo" : "photos"}`}
                                  {photoCount > 0 && videoCount > 0 && " · "}
                                  {videoCount > 0 && `${videoCount} ${videoCount === 1 ? "video" : "videos"}`}
                                </p>
                              )}
                            </div>
                            <span className="shrink-0 w-7 h-7 rounded-full bg-gold text-ink flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                              <ArrowRightIcon size={13} />
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {showEvents && (
              <div className="xl:col-span-4 card-surface p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-2xl font-semibold text-ink">Upcoming Events</h2>
                  <Link href="/events" className="text-xs font-semibold text-accent-primary hover:underline">
                    All events
                  </Link>
                </div>

                {upcomingEvents.length === 0 ? (
                  <p className="text-sm text-ink-400 italic py-4">No upcoming events published yet.</p>
                ) : (
                  <ul className="space-y-4">
                    {upcomingEvents.map((event, idx) => {
                      const tag = eventTag(event.title);
                      const dots = ["bg-orange-400", "bg-fuchsia-400", "bg-teal-400"];
                      return (
                        <li key={event._id} className="flex gap-3">
                          <div className="w-14 shrink-0 text-right">
                            <div className="text-xs font-bold text-ink-600 font-mono leading-tight">
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
                              <span className="text-base font-bold text-ink">{event.title}</span>
                              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${tag.className}`}>
                                {tag.label}
                              </span>
                            </div>
                            {event.description && (
                              <p className="mt-1 text-sm text-ink-600 line-clamp-2 leading-relaxed">
                                {typeof event.description === "string"
                                  ? event.description
                                  : Array.isArray(event.description)
                                  ? portableTextExcerpt(event.description, 120)
                                  : ""}
                              </p>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 5. LATEST NOTICES PREVIEW ── */}
      <section
        className="relative z-10 px-4 sm:px-6 lg:px-8 pb-12"
        aria-label="Latest Notices"
      >
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-5">
          <div className="xl:col-span-8 card-surface p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-2xl font-semibold text-ink">Latest Notices</h2>
              <Link href="/notices" className="text-xs sm:text-sm font-semibold text-accent-primary hover:underline">
                View all notices →
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
                      <div className="w-14 shrink-0 text-right">
                        <div className="text-xs font-bold text-ink-600 font-mono leading-tight">
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
                            className="text-base font-bold text-ink hover:text-accent-primary transition-colors"
                          >
                            {notice.title}
                          </Link>
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${tag.className}`}>
                            {tag.label}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-ink-600 leading-relaxed">
                          {portableTextExcerpt(notice.body) || "Official hostel circular."}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="xl:col-span-4 card-surface p-5 sm:p-6">
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
      </section>
    </div>
  );
}
