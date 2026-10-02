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
        description: "Direct lines for immediate medical, security, and urgent safety assistance.",
        badgeBg: "#fee2e2",
        badgeText: "#991b1b",
        borderColor: "border-rose-200/90 border-l-4 border-l-rose-500",
        btnCls: "bg-rose-600 hover:bg-rose-700 text-white shadow-xs shadow-rose-600/20",
        phoneColor: "text-rose-700",
      };
    case "Supervisor":
      return {
        title: "Hostel Supervisors & Caretakers",
        description: "Facility maintenance, block supervisors, and night assistance.",
        badgeBg: "#fef3c7",
        badgeText: "#92400e",
        borderColor: "border-amber-200/90 border-l-4 border-l-amber-500",
        btnCls: "bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-xs shadow-amber-500/20",
        phoneColor: "text-amber-800",
      };
    case "HMC Member":
      return {
        title: "Hostel Management Committee",
        description: "Elected student representatives and wardens overseeing student welfare.",
        badgeBg: "#d1fae5",
        badgeText: "#065f46",
        borderColor: "border-emerald-200/90 border-l-4 border-l-emerald-500",
        btnCls: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs shadow-emerald-600/20",
        phoneColor: "text-emerald-800",
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-amber-500/10 text-amber-800 border border-amber-500/20 mb-3 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            SV Bhavan Helplines
          </div>
          <h1
            className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900"
            style={{
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
            }}
          >
            Directory &amp; Helplines
          </h1>
          <p className="mt-2 text-base leading-relaxed text-slate-600">
            Direct contact numbers for hostel administration, emergency services,
            and HMC representatives. Tap any number to call immediately.
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
                <div className="pb-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-4">
                  <div>
                    <h2
                      id={`heading-${category}`}
                      className="text-lg sm:text-xl font-bold text-slate-900"
                      style={{
                        fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
                      }}
                    >
                      {cfg.title}
                    </h2>
                    <p className="text-xs sm:text-sm mt-0.5 text-slate-500">
                      {cfg.description}
                    </p>
                  </div>
                  <span
                    className="self-start sm:self-auto text-xs px-2.5 py-0.5 rounded-full font-mono font-bold"
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
                  <p className="text-xs italic text-slate-400 py-3">
                    No contacts configured in this category yet.
                  </p>
                ) : (
                  <div
                    className={`rounded-xl border ${cfg.borderColor} bg-white overflow-hidden shadow-xs divide-y divide-slate-100`}
                  >
                    {list.map((contact) => {
                      const telHref = `tel:${contact.phone.replace(/[\s\-().]/g, "")}`;
                      const photoUrl = contact.photo?.asset?._ref
                        ? urlFor(contact.photo).width(64).height(64).fit("crop").auto("format").url()
                        : null;

                      return (
                        <div
                          key={contact._id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 gap-3 transition-colors hover:bg-slate-50/80"
                        >
                          {/* Name & Title */}
                          <div className="flex items-center gap-3 min-w-0">
                            <ContactAvatar
                              photoUrl={photoUrl}
                              icon={contact.icon}
                              defaultEmoji={isUrgent ? "🚨" : category === "Supervisor" ? "👷" : "🏛️"}
                              sizeClass="w-9 h-9"
                              fallbackBgClass={isUrgent ? "bg-rose-100 text-rose-700" : category === "Supervisor" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}
                              alt={contact.label}
                            />
                            <div className="min-w-0">
                              <div className="text-sm font-bold text-slate-900 truncate">
                                {contact.label}
                              </div>
                              {contact.title && (
                                <div className={`text-xs font-semibold ${cfg.phoneColor}`}>
                                  {contact.title}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Phone & CTA */}
                          <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                            <a
                              href={telHref}
                              className={`font-bold text-sm sm:text-base tracking-wide hover:underline inline-flex items-center gap-1.5 ${cfg.phoneColor}`}
                              style={{
                                fontFamily: "var(--font-ibm-plex-mono), monospace",
                              }}
                            >
                              <span>{contact.phone}</span>
                            </a>
                            <a
                              href={telHref}
                              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs hover:brightness-105 inline-flex items-center gap-1.5 ${cfg.btnCls}`}
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
        <div className="mt-12 pt-6 border-t border-slate-200">
          <Link
            href="/"
            className="text-sm font-semibold text-slate-600 hover:text-slate-900 hover:underline inline-flex items-center gap-1.5"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
