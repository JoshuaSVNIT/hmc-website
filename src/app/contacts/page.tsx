import type { Metadata } from "next";
import Link from "next/link";
import { getAllContacts, type SanityContact, type ContactCategory } from "@/lib/sanity/queries";
import ContactAvatar from "@/components/ContactAvatar";
import { urlFor } from "@/sanity/lib/image";

export const metadata: Metadata = {
  title: "Contacts Directory — SV Bhavan HMC",
  description:
    "Emergency numbers, supervisor helplines, and HMC member directory for Swami Vivekanand Bhavan.",
};

const CATEGORY_ORDER: ContactCategory[] = ["Emergency", "Supervisor", "HMC Member"];

function getCategoryConfig(category: ContactCategory) {
  switch (category) {
    case "Emergency":
      return {
        title: "Emergency Helplines",
        description: "Direct lines for immediate medical, security, and urgent assistance.",
        badgeBg: "rgba(179,63,46,0.1)",
        badgeText: "var(--color-accent-urgent)",
        accentColor: "var(--color-accent-urgent)",
      };
    case "Supervisor":
      return {
        title: "Hostel Supervisors & Caretakers",
        description: "Facility maintenance, block supervisors, and night assistance.",
        badgeBg: "rgba(184,134,11,0.12)",
        badgeText: "var(--color-accent-primary-600)",
        accentColor: "var(--color-accent-primary-600)",
      };
    case "HMC Member":
      return {
        title: "Hostel Management Committee",
        description: "Elected student representatives and wardens overseeing student welfare.",
        badgeBg: "rgba(47,79,62,0.1)",
        badgeText: "var(--color-accent-secondary)",
        accentColor: "var(--color-accent-secondary)",
      };
  }
}

function getCategoryGroup(cat: string): ContactCategory {
  const lower = (cat || "").toLowerCase();
  if (lower.includes("emergency")) return "Emergency";
  if (lower.includes("supervisor")) return "Supervisor";
  return "HMC Member";
}

export default async function ContactsPage() {
  const contacts = await getAllContacts();

  const grouped = CATEGORY_ORDER.reduce<Record<ContactCategory, SanityContact[]>>(
    (acc, cat) => {
      acc[cat] = contacts.filter((c) => getCategoryGroup(c.category) === cat);
      return acc;
    },
    { Emergency: [], Supervisor: [], "HMC Member": [] }
  );

  return (
    <main
      className="min-h-screen py-10 sm:py-14 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--color-paper)" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1
            className="text-3xl sm:text-5xl font-bold tracking-tight"
            style={{
              color: "var(--color-ink)",
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
            }}
          >
            Directory &amp; Helplines
          </h1>
          <p className="mt-2 text-base leading-relaxed" style={{ color: "var(--color-ink-500)" }}>
            Direct contact numbers for hostel administration, emergency services,
            and HMC representatives. Tap any number to call.
          </p>
        </div>

        {/* Directory Categories */}
        <div className="space-y-10">
          {CATEGORY_ORDER.map((category) => {
            const list = grouped[category];
            const cfg = getCategoryConfig(category);
            const isUrgent = category === "Emergency";

            return (
              <section key={category} aria-labelledby={`heading-${category}`}>
                {/* Category Header */}
                <div className="pb-3 border-b flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-3" style={{ borderColor: "rgba(31,27,22,0.15)" }}>
                  <div>
                    <h2
                      id={`heading-${category}`}
                      className="text-lg sm:text-xl font-bold"
                      style={{
                        color: isUrgent ? "var(--color-accent-urgent)" : "var(--color-ink)",
                        fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
                      }}
                    >
                      {cfg.title}
                    </h2>
                    <p className="text-xs sm:text-sm mt-0.5" style={{ color: "var(--color-ink-500)" }}>
                      {cfg.description}
                    </p>
                  </div>
                  <span
                    className="self-start sm:self-auto text-xs px-2 py-0.5 rounded font-mono font-medium"
                    style={{
                      backgroundColor: cfg.badgeBg,
                      color: cfg.badgeText,
                    }}
                  >
                    {list.length} {list.length === 1 ? "contact" : "contacts"}
                  </span>
                </div>

                {/* Directory Table / List */}
                {list.length === 0 ? (
                  <p className="text-xs italic py-3" style={{ color: "var(--color-ink-400)" }}>
                    No contacts configured in this category yet.
                  </p>
                ) : (
                  <div
                    className="rounded border overflow-hidden divide-y"
                    style={{
                      backgroundColor: "#fff",
                      borderColor: isUrgent ? "rgba(179,63,46,0.2)" : "rgba(31,27,22,0.12)",
                    }}
                  >
                    {list.map((contact) => {
                      const telHref = `tel:${contact.phone.replace(/[\s\-().]/g, "")}`;
                      const photoUrl = contact.photo?.asset?._ref
                        ? urlFor(contact.photo).width(64).height(64).fit("crop").auto("format").url()
                        : null;

                      return (
                        <div
                          key={contact._id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 gap-3 transition-colors hover:bg-black/[0.015]"
                          style={{
                            borderColor: isUrgent ? "rgba(179,63,46,0.1)" : "rgba(31,27,22,0.06)",
                          }}
                        >
                          {/* Name & Title */}
                          <div className="flex items-center gap-3 min-w-0">
                            <ContactAvatar
                              photoUrl={photoUrl}
                              icon={contact.icon}
                              defaultEmoji={isUrgent ? "🚨" : category === "Supervisor" ? "👷" : "🏛️"}
                              sizeClass="w-9 h-9"
                              fallbackBgClass={isUrgent ? "bg-red-100" : "bg-stone-100"}
                              alt={contact.label}
                            />
                            <div className="min-w-0">
                              <div className="text-sm font-semibold truncate" style={{ color: "var(--color-ink)" }}>
                                {contact.label}
                              </div>
                              {contact.title && (
                                <div className="text-xs" style={{ color: cfg.accentColor }}>
                                  {contact.title}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Phone & CTA */}
                          <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-black/5">
                            <a
                              href={telHref}
                              className="font-bold text-sm tracking-wide hover:underline inline-flex items-center gap-1.5"
                              style={{
                                fontFamily: "var(--font-ibm-plex-mono), monospace",
                                color: isUrgent ? "var(--color-accent-urgent)" : "var(--color-ink)",
                              }}
                            >
                              <span>{contact.phone}</span>
                            </a>
                            <a
                              href={telHref}
                              className="px-3 py-1 rounded text-xs font-semibold border transition-colors inline-flex items-center gap-1.5"
                              style={{
                                borderColor: isUrgent ? "var(--color-accent-urgent)" : "rgba(31,27,22,0.2)",
                                backgroundColor: isUrgent ? "var(--color-accent-urgent)" : "transparent",
                                color: isUrgent ? "#fff" : "var(--color-ink)",
                              }}
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              Call
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* Back Link */}
        <div className="mt-12 pt-6 border-t" style={{ borderColor: "rgba(31,27,22,0.1)" }}>
          <Link
            href="/"
            className="text-sm font-medium hover:underline inline-flex items-center gap-1.5"
            style={{ color: "var(--color-ink-600)" }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
