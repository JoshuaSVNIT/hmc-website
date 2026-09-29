import Link from "next/link";
import { getHomepageContacts, type SanityContact } from "@/lib/sanity/queries";
import ContactAvatar from "@/components/ContactAvatar";
import { urlFor } from "@/sanity/lib/image";

// Phone icon — same SVG used in the hardcoded cards, extracted to avoid
// repeating it for every dynamically-rendered contact entry.
function PhoneIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4 sm:w-5 sm:h-5"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 4V3z" />
    </svg>
  );
}

export default async function HomePage() {
  // Fetch Emergency + Supervisor contacts from Sanity (§5).
  // HMC contacts are displayed on the /contacts page.
  let homepageContacts: SanityContact[] = [];
  try {
    homepageContacts = await getHomepageContacts();
  } catch (err) {
    console.error("Failed to load homepage contacts:", err);
  }

  // Only Emergency and Supervisor categories are to be displayed in the home page banner
  const bannerContacts = homepageContacts.filter(
    (c) =>
      !c.category?.toLowerCase().includes("hmc") &&
      (c.category?.toLowerCase().includes("emergency") ||
        c.category?.toLowerCase().includes("supervisor"))
  );

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* 1. HERO SECTION (Compact on mobile so Emergency Helplines are visible without scrolling) */}
      {/* bg-image sits behind a gradient overlay via inline style; fallback is pure gradient */}
      <section
        className="relative text-white py-6 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#0f2030] shadow-inner overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(9,21,31,0.82) 0%, rgba(21,46,62,0.78) 60%, rgba(37,81,104,0.90) 100%), url('/hero-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-5xl mx-auto text-center space-y-3 sm:space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] sm:text-sm text-yellow-300 font-medium">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-400"></span>
            Hostel Management Committee • SV Bhavan
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight text-white leading-tight">
            HMC <span className="text-yellow-400">SVB</span>
          </h1>

          {/* Subheading */}
          <p className="max-w-2xl mx-auto text-xs sm:text-base lg:text-lg text-slate-200 font-normal leading-relaxed line-clamp-2 sm:line-clamp-none">
            Your centralized portal for swift complaint resolution, emergency
            assistance, electrical guides, and SV Bhavan updates. No login required for
            residents.
          </p>

          {/* CTAs: Side-by-side on mobile to save vertical space */}
          <div className="pt-1 sm:pt-2 grid grid-cols-2 gap-2.5 sm:flex sm:flex-row items-center justify-center sm:gap-4 max-w-sm sm:max-w-none mx-auto">
            <Link
              href="/raise-ticket"
              className="px-3.5 py-2.5 sm:px-6 sm:py-3.5 bg-yellow-400 hover:bg-yellow-500 text-slate-950 rounded-xl font-bold text-xs sm:text-base transition-all duration-150 transform hover:-translate-y-0.5 shadow-md flex items-center justify-center gap-1.5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 sm:w-5 sm:h-5 shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Raise Ticket</span>
            </Link>

            <Link
              href="/track-ticket"
              className="px-3.5 py-2.5 sm:px-6 sm:py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-xl font-semibold text-xs sm:text-base transition-all duration-150 flex items-center justify-center gap-1.5 shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 sm:w-5 sm:h-5 shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Track Ticket</span>
            </Link>
          </div>

          {/* Quick jump to Mess Menu */}
          <div className="pt-1.5 flex items-center justify-center">
            <a
              href="#mess-menu"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 text-xs sm:text-sm text-yellow-300 font-medium transition-all duration-150 transform hover:scale-105 active:scale-95 shadow-sm"
            >
              <span>🍽️</span>
              <span>Today&apos;s Mess Menu</span>
              <span className="text-yellow-400 font-bold">&darr;</span>
            </a>
          </div>

          {/* Value Props Pills: Shown on tablet/desktop, hidden on mobile */}
          <div className="hidden sm:grid pt-3 grid-cols-3 gap-3 max-w-2xl mx-auto text-xs text-slate-300">
            <div className="flex items-center justify-center gap-1.5 bg-white/8 border border-white/15 rounded-lg py-2 px-3">
              <span className="text-yellow-400 font-bold">✓</span> Direct HMC Escalation
            </div>
            <div className="flex items-center justify-center gap-1.5 bg-white/8 border border-white/15 rounded-lg py-2 px-3">
              <span className="text-yellow-400 font-bold">✓</span> Zero Login Required
            </div>
            <div className="flex items-center justify-center gap-1.5 bg-white/8 border border-white/15 rounded-lg py-2 px-3">
              <span className="text-yellow-400 font-bold">✓</span> Instant Ticket Code
            </div>
          </div>
        </div>
      </section>

      {/* 2. EMERGENCY & SUPERVISORS BANNER (TAP TO CALL - Visible above fold on mobile) */}
      <section
        id="emergency-banner"
        className="bg-red-50/95 border-b border-red-200 py-3 sm:py-5 px-3.5 sm:px-6 lg:px-8"
        aria-label="Emergency and Supervisor Helplines"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
              </span>
              <h2 className="text-xs sm:text-base font-extrabold text-red-950 flex items-center gap-1.5">
                🚨 Emergency &amp; Supervisors:
                <span className="text-[11px] text-red-700 font-normal">
                  (Tap number to dial)
                </span>
              </h2>
            </div>

            <Link
              href="/contacts"
              className="text-xs sm:text-sm font-bold text-red-800 hover:text-red-950 hover:underline shrink-0"
            >
              All Contacts &amp; HMC Directory &rarr;
            </Link>
          </div>

          {/* Emergency + Supervisor contacts — fetched live from Sanity (§5) */}
          {bannerContacts.length === 0 ? (
            <p className="text-sm text-red-700 italic">
              Emergency &amp; supervisor contact numbers will appear here once added in Sanity Studio.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
              {bannerContacts.map((contact) => {
                const telHref = `tel:${contact.phone.replace(/[\s\-().]/g, "")}`;
                const isEmergency = contact.category?.toLowerCase().includes("emergency");
                // Build CDN URL when a photo asset exists; null otherwise.
                const photoUrl =
                  contact.photo?.asset?._ref
                    ? urlFor(contact.photo).width(80).height(80).fit("crop").auto("format").url()
                    : null;
                return (
                  <a
                    key={contact._id}
                    href={telHref}
                    className={`group bg-white rounded-2xl p-3 sm:p-4 border-2 ${
                      isEmergency
                        ? "border-red-200 hover:border-red-400 hover:bg-red-50/50"
                        : "border-amber-200 hover:border-amber-400 hover:bg-amber-50/50"
                    } shadow-sm hover:shadow-md transition-all duration-150 flex items-center justify-between gap-3 active:scale-[0.99]`}
                    title={`Tap to call ${contact.label}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <ContactAvatar
                        photoUrl={photoUrl}
                        icon={contact.icon}
                        defaultEmoji={isEmergency ? "🚨" : "👷"}
                        sizeClass="w-9 h-9 sm:w-11 sm:h-11"
                        fallbackBgClass={isEmergency ? "bg-red-100" : "bg-amber-100"}
                        alt={contact.label}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <div className="min-w-0">
                            {contact.title && (
                              <div className="text-[10px] font-medium text-teal-700 leading-none mb-0.5 truncate">
                                {contact.title}
                              </div>
                            )}
                            <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight truncate block">
                              {contact.label}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                              isEmergency
                                ? "bg-red-100 text-red-800 border border-red-200"
                                : "bg-amber-100 text-amber-800 border border-amber-200"
                            }`}
                          >
                            {isEmergency ? "Emergency" : "Supervisor"}
                          </span>
                        </div>
                        <div
                          className={`text-sm sm:text-base font-black ${
                            isEmergency
                              ? "text-red-700 group-hover:text-red-800"
                              : "text-amber-800 group-hover:text-amber-900"
                          } underline tracking-tight mt-0.5`}
                        >
                          {contact.phone}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full ${
                        isEmergency
                          ? "bg-red-100 text-red-700 group-hover:bg-red-600 group-hover:text-white"
                          : "bg-amber-100 text-amber-700 group-hover:bg-amber-600 group-hover:text-white"
                      } flex items-center justify-center shrink-0 transition-colors`}
                      aria-hidden="true"
                    >
                      <PhoneIcon />
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 3. QUICK-LINK CARDS (Square tiles in 2-column mobile layout) */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center sm:text-left mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Quick Services
          </h2>
          <p className="text-xs sm:text-base text-slate-600 mt-1">
            Access essential hostel utilities and information with one tap.
          </p>
        </div>

        {/* 2 columns on mobile, 4 columns on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {/* Card 1: Raise a Ticket */}
          <Link
            href="/raise-ticket"
            className="group bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all duration-200 aspect-square flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl sm:text-2xl mb-2 sm:mb-3 group-hover:scale-105 transition-transform">
                🛠️
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                Raise a Ticket
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                LAN, electrical, plumbing &amp; room complaints.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center text-[11px] sm:text-xs font-semibold text-blue-700">
              Submit &rarr;
            </div>
          </Link>

          {/* Card 2: Track a Ticket */}
          <Link
            href="/track-ticket"
            className="group bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all duration-200 aspect-square flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl sm:text-2xl mb-2 sm:mb-3 group-hover:scale-105 transition-transform">
                🔍
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                Track Ticket
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                Live status &amp; supervisor updates.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center text-[11px] sm:text-xs font-semibold text-amber-700">
              Check &rarr;
            </div>
          </Link>

          {/* Card 3: Notices */}
          <Link
            href="/notices"
            className="group bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all duration-200 aspect-square flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-xl sm:text-2xl mb-2 sm:mb-3 group-hover:scale-105 transition-transform">
                📢
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                Notices
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                Circulars, maintenance &amp; timings.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center text-[11px] sm:text-xs font-semibold text-purple-700">
              Read &rarr;
            </div>
          </Link>

          {/* Card 4: Gallery */}
          <Link
            href="/gallery"
            className="group bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all duration-200 aspect-square flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl sm:text-2xl mb-2 sm:mb-3 group-hover:scale-105 transition-transform">
                📸
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                Gallery
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                Celebrations, event posters &amp; memories.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center text-[11px] sm:text-xs font-semibold text-emerald-700">
              View &rarr;
            </div>
          </Link>
        </div>

        {/* Self-Service Guides Highlight Row */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl shrink-0">
              💡
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">
                Having LAN or Electrical Trouble in your room?
              </h4>
              <p className="text-sm text-slate-600">
                Check our official step-by-step troubleshooting guides before
                raising a ticket.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/guides/lan"
              className="flex-1 sm:flex-none text-center px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-semibold text-sm rounded-lg transition-colors"
            >
              LAN Guide
            </Link>
            <Link
              href="/guides/electrical"
              className="flex-1 sm:flex-none text-center px-4 py-2 bg-[#255168] hover:bg-[#1d3f54] text-white font-semibold text-sm rounded-lg transition-colors"
            >
              Electrical Guide
            </Link>
          </div>
        </div>
      </section>

      {/* 4. PLACEHOLDER SECTION: TODAY'S MESS MENU */}
      <section
        id="mess-menu"
        className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
        aria-label="Today's Mess Menu"
      >
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border animate-mess-glow rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🍽️</span>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Today&apos;s Mess Menu
                </h2>
                <p className="text-xs sm:text-sm text-amber-800 font-medium">
                  Dynamic Sanity CMS integration — Coming in Phase 8
                </p>
              </div>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-200 text-amber-900">
              Placeholder • Menu will show daily meals
            </span>
          </div>

          {/* Meals Preview Cards Placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/90 border border-amber-200/80 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                  Breakfast
                </span>
                <span className="text-xs text-slate-400">7:30 - 9:30 AM</span>
              </div>
              <p className="text-sm text-slate-600 italic">
                Menu details for the day will appear here automatically from
                Sanity CMS.
              </p>
            </div>

            <div className="bg-white/90 border border-amber-200/80 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                  Lunch
                </span>
                <span className="text-xs text-slate-400">12:30 - 2:30 PM</span>
              </div>
              <p className="text-sm text-slate-600 italic">
                Menu details for the day will appear here automatically from
                Sanity CMS.
              </p>
            </div>

            <div className="bg-white/90 border border-amber-200/80 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                  Dinner
                </span>
                <span className="text-xs text-slate-400">7:30 - 9:30 PM</span>
              </div>
              <p className="text-sm text-slate-600 italic">
                Menu details for the day will appear here automatically from
                Sanity CMS.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
