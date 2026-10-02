import Link from "next/link";
import { getHomepageContacts, type SanityContact } from "@/lib/sanity/queries";
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

  const bannerContacts = homepageContacts.filter(
    (c) =>
      !c.category?.toLowerCase().includes("hmc") &&
      (c.category?.toLowerCase().includes("emergency") ||
        c.category?.toLowerCase().includes("supervisor"))
  );

  return (
    <div className="flex flex-col w-full min-h-screen" style={{ backgroundColor: "var(--color-paper)" }}>

      {/* ── 1. HERO ── left-aligned, ink background with optional image overlay */}
      <section
        className="relative py-14 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{ backgroundColor: "var(--color-ink)" }}
      >
        {/* Background Image Layer: replace public/hero-bg.jpg with any image */}
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-bg.jpg"
            alt="SV Bhavan Hostel"
            className="w-full h-full object-cover object-center opacity-30"
          />
          {/* Ink overlay ensures all text passes AAA contrast */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(31,27,22,0.96) 0%, rgba(31,27,22,0.88) 55%, rgba(31,27,22,0.78) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="max-w-2xl">
            <h1
              className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight"
              style={{
                color: "var(--color-paper)",
                fontFamily: "var(--font-space-grotesk), system-ui",
              }}
            >
              Hostel Management Committee
            </h1>
            <p
              className="mt-4 text-base sm:text-lg leading-relaxed"
              style={{ color: "rgba(243,241,235,0.65)" }}
            >
              Your centralized portal for complaint resolution, emergency
              assistance, electrical guides, and SV Bhavan updates. No login
              required for residents.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/raise-ticket"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded font-semibold text-sm transition-colors"
                style={{
                  backgroundColor: "var(--color-accent-primary)",
                  color: "var(--color-ink)",
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
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded font-semibold text-sm transition-colors border"
                style={{
                  borderColor: "rgba(243,241,235,0.2)",
                  color: "rgba(243,241,235,0.8)",
                  backgroundColor: "transparent",
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                Track Ticket
              </Link>
              <a
                href="#mess-menu"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded text-sm transition-colors border sm:ml-auto"
                style={{
                  borderColor: "rgba(243,241,235,0.1)",
                  color: "rgba(243,241,235,0.45)",
                }}
              >
                🍽️ Today&apos;s Mess Menu ↓
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. EMERGENCY & SUPERVISORS — compact directory format ── */}
      <section
        id="emergency-banner"
        className="border-b py-6 px-4 sm:px-6 lg:px-8"
        aria-label="Emergency and Supervisor Helplines"
        style={{
          backgroundColor: "#fdf7f6",
          borderColor: "rgba(179,63,46,0.18)",
        }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between gap-2 mb-4 pb-2 border-b" style={{ borderColor: "rgba(179,63,46,0.15)" }}>
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-2 w-2 relative shrink-0"
              >
                <span
                  className="animate-emergency-pulse absolute inline-flex h-full w-full rounded-full"
                  style={{ backgroundColor: "var(--color-accent-urgent)", opacity: 0.6 }}
                />
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ backgroundColor: "var(--color-accent-urgent)" }}
                />
              </span>
              <h2
                className="text-sm font-semibold"
                style={{
                  color: "var(--color-accent-urgent-700)",
                  fontFamily: "var(--font-space-grotesk), system-ui",
                }}
              >
                Emergency &amp; Supervisors
                <span className="font-normal ml-2" style={{ color: "var(--color-accent-urgent-500)", fontSize: "12px" }}>
                  tap to dial
                </span>
              </h2>
            </div>
            <Link
              href="/contacts"
              className="text-xs font-semibold transition-colors"
              style={{ color: "var(--color-accent-urgent-600)" }}
            >
              All contacts →
            </Link>
          </div>

          {bannerContacts.length === 0 ? (
            <p className="text-sm italic" style={{ color: "var(--color-accent-urgent-500)" }}>
              Contact numbers will appear here once added in Sanity Studio.
            </p>
          ) : (
            <div className="divide-y" style={{ borderColor: "rgba(179,63,46,0.1)" }}>
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
                    className="flex items-center justify-between py-2.5 px-2 rounded-sm gap-4 group hover:bg-red-50/60 transition-colors"
                    title={`Call ${contact.label}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <ContactAvatar
                        photoUrl={photoUrl}
                        icon={contact.icon}
                        defaultEmoji={isEmergency ? "🚨" : "👷"}
                        sizeClass="w-8 h-8"
                        fallbackBgClass={isEmergency ? "bg-red-100" : "bg-amber-100"}
                        alt={contact.label}
                      />
                      <div className="min-w-0">
                        {contact.title && (
                          <div className="text-[11px]" style={{ color: "var(--color-accent-secondary)" }}>
                            {contact.title}
                          </div>
                        )}
                        <div
                          className="text-sm font-medium truncate"
                          style={{ color: "var(--color-ink)" }}
                        >
                          {contact.label}
                        </div>
                      </div>
                      {isEmergency && (
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded-sm font-semibold shrink-0"
                          style={{
                            backgroundColor: "rgba(179,63,46,0.1)",
                            color: "var(--color-accent-urgent)",
                          }}
                        >
                          Emergency
                        </span>
                      )}
                    </div>
                    <div
                      className="flex items-center gap-2 shrink-0"
                      style={{ color: isEmergency ? "var(--color-accent-urgent)" : "var(--color-ink-500)" }}
                    >
                      <span
                        className="font-semibold text-sm"
                        style={{ fontFamily: "var(--font-ibm-plex-mono), monospace" }}
                      >
                        {contact.phone}
                      </span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
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
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <h2
          className="text-2xl sm:text-3xl font-bold mb-2"
          style={{
            color: "var(--color-ink)",
            fontFamily: "var(--font-space-grotesk), system-ui",
          }}
        >
          Quick Services
        </h2>
        <p className="text-sm mb-7" style={{ color: "var(--color-ink-500)" }}>
          Access essential hostel utilities and information with one tap.
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            {
              href: "/raise-ticket",
              emoji: "🛠️",
              title: "Raise a Ticket",
              desc: "LAN, electrical, plumbing & room complaints.",
              cta: "Submit",
              accentColor: "var(--color-accent-primary)",
            },
            {
              href: "/track-ticket",
              emoji: "🔍",
              title: "Track Ticket",
              desc: "Live status & supervisor updates.",
              cta: "Check",
              accentColor: "var(--color-ink-500)",
            },
            {
              href: "/notices",
              emoji: "📢",
              title: "Notices",
              desc: "Circulars, maintenance & timings.",
              cta: "Read",
              accentColor: "var(--color-accent-secondary)",
            },
            {
              href: "/gallery",
              emoji: "📸",
              title: "Gallery",
              desc: "Celebrations, event posters & memories.",
              cta: "View",
              accentColor: "var(--color-ink-400)",
            },
          ].map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group flex flex-col justify-between aspect-square p-4 sm:p-5 border rounded transition-shadow hover:shadow-md"
              style={{
                backgroundColor: "#fff",
                borderColor: "rgba(31,27,22,0.1)",
              }}
            >
              <div>
                <span className="text-2xl sm:text-3xl">{card.emoji}</span>
                <h3
                  className="mt-3 text-sm sm:text-base font-semibold leading-snug"
                  style={{
                    color: "var(--color-ink)",
                    fontFamily: "var(--font-space-grotesk), system-ui",
                  }}
                >
                  {card.title}
                </h3>
                <p className="text-[11px] sm:text-xs mt-1 leading-relaxed" style={{ color: "var(--color-ink-400)" }}>
                  {card.desc}
                </p>
              </div>
              <div
                className="mt-3 pt-3 text-xs font-semibold border-t"
                style={{
                  color: card.accentColor,
                  borderColor: "rgba(31,27,22,0.07)",
                }}
              >
                {card.cta} →
              </div>
            </Link>
          ))}
        </div>

        {/* Guides highlight */}
        <div
          className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 border rounded"
          style={{
            backgroundColor: "rgba(184,134,11,0.05)",
            borderColor: "rgba(184,134,11,0.2)",
          }}
        >
          <div>
            <h4
              className="font-semibold text-base"
              style={{
                color: "var(--color-ink)",
                fontFamily: "var(--font-space-grotesk), system-ui",
              }}
            >
              LAN or Electrical trouble in your room?
            </h4>
            <p className="text-sm mt-0.5" style={{ color: "var(--color-ink-500)" }}>
              Check our step-by-step troubleshooting guides before raising a ticket.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
            <Link
              href="/guides/lan"
              className="flex-1 sm:flex-none text-center px-4 py-2 rounded text-sm font-semibold transition-colors border"
              style={{
                borderColor: "rgba(31,27,22,0.2)",
                color: "var(--color-ink)",
                backgroundColor: "#fff",
              }}
            >
              LAN Guide
            </Link>
            <Link
              href="/guides/electrical"
              className="flex-1 sm:flex-none text-center px-4 py-2 rounded text-sm font-semibold transition-colors"
              style={{
                backgroundColor: "var(--color-ink)",
                color: "var(--color-paper)",
              }}
            >
              Electrical Guide
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. TODAY'S MESS MENU ── */}
      <section
        id="mess-menu"
        className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
        aria-label="Today's Mess Menu"
      >
        <div
          className="border rounded p-6 sm:p-8 animate-mess-glow"
          style={{
            backgroundColor: "rgba(184,134,11,0.04)",
            borderColor: "rgba(184,134,11,0.2)",
          }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🍽️</span>
              <div>
                <h2
                  className="text-xl font-bold"
                  style={{
                    color: "var(--color-ink)",
                    fontFamily: "var(--font-space-grotesk), system-ui",
                  }}
                >
                  Today&apos;s Mess Menu
                </h2>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-accent-primary-600)" }}>
                  Dynamic Sanity CMS integration — Coming in Phase 8
                </p>
              </div>
            </div>
            <span
              className="text-xs px-2.5 py-1 rounded-sm font-medium"
              style={{
                backgroundColor: "rgba(184,134,11,0.12)",
                color: "var(--color-accent-primary-600)",
              }}
            >
              Placeholder
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { meal: "Breakfast", time: "7:30 – 9:30 AM" },
              { meal: "Lunch", time: "12:30 – 2:30 PM" },
              { meal: "Dinner", time: "7:30 – 9:30 PM" },
            ].map(({ meal, time }) => (
              <div
                key={meal}
                className="border rounded p-4"
                style={{
                  backgroundColor: "#fff",
                  borderColor: "rgba(184,134,11,0.15)",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-xs font-semibold"
                    style={{
                      color: "var(--color-accent-primary-600)",
                      fontFamily: "var(--font-space-grotesk), system-ui",
                    }}
                  >
                    {meal}
                  </span>
                  <span
                    className="text-xs"
                    style={{
                      color: "var(--color-ink-400)",
                      fontFamily: "var(--font-ibm-plex-mono), monospace",
                    }}
                  >
                    {time}
                  </span>
                </div>
                <p className="text-sm italic" style={{ color: "var(--color-ink-400)" }}>
                  Menu details will appear here from Sanity CMS.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
