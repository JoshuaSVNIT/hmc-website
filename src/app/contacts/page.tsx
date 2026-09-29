import type { Metadata } from "next";
import Link from "next/link";
import { getAllContacts, type SanityContact, type ContactCategory } from "@/lib/sanity/queries";
import ContactAvatar from "@/components/ContactAvatar";
import { urlFor } from "@/sanity/lib/image";

export const metadata: Metadata = {
  title: "Contacts — SV Bhavan HMC",
  description:
    "Emergency numbers, supervisor contacts, and HMC member directory for Swami Vivekanand Bhavan.",
};

// ─── Category display config ──────────────────────────────────────────────────

const CATEGORY_META: Record<
  ContactCategory,
  { heading: string; description: string; cardBorder: string; phoneCls: string; badgeCls: string; iconBg: string }
> = {
  Emergency: {
    heading: "🚨 Emergency",
    description: "Tap a number to dial immediately.",
    cardBorder: "border-red-200 hover:border-red-400",
    phoneCls: "text-red-700",
    badgeCls: "bg-red-100 text-red-800",
    iconBg: "bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white",
  },
  Supervisor: {
    heading: "👷 Supervisors",
    description: "Hostel maintenance and night supervisors.",
    cardBorder: "border-amber-200 hover:border-amber-400",
    phoneCls: "text-amber-800",
    badgeCls: "bg-amber-100 text-amber-800",
    iconBg: "bg-amber-100 text-amber-600 group-hover:bg-amber-500 group-hover:text-white",
  },
  "HMC Member": {
    heading: "🏛️ HMC Members",
    description: "Hostel Management Committee representatives.",
    cardBorder: "border-blue-200 hover:border-blue-400",
    phoneCls: "text-blue-800",
    badgeCls: "bg-blue-100 text-blue-800",
    iconBg: "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
  },
};

const CATEGORY_ORDER: ContactCategory[] = ["Emergency", "Supervisor", "HMC Member"];

// ─── Phone icon SVG ───────────────────────────────────────────────────────────

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 4V3z" />
    </svg>
  );
}

// ─── Single contact card ──────────────────────────────────────────────────────

function ContactCard({
  contact,
  meta,
}: {
  contact: SanityContact;
  meta: typeof CATEGORY_META[ContactCategory];
}) {
  // Normalise the phone for the tel: link — strip spaces/dashes for dialling
  const telHref = `tel:${contact.phone.replace(/[\s\-().]/g, "")}`;

  // Build the Sanity CDN URL when a photo asset exists; null otherwise.
  const photoUrl =
    contact.photo?.asset?._ref
      ? urlFor(contact.photo).width(80).height(80).fit("crop").auto("format").url()
      : null;

  return (
    <a
      href={telHref}
      className={`group bg-white rounded-2xl p-4 sm:p-5 border-2 ${meta.cardBorder} shadow-sm hover:shadow-md transition-all duration-150 flex items-center justify-between gap-4 active:scale-[0.99]`}
      title={`Tap to call ${contact.label}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Photo or emoji fallback */}
        <ContactAvatar
          photoUrl={photoUrl}
          icon={contact.icon}
          defaultEmoji="📞"
          sizeClass="w-10 h-10 sm:w-12 sm:h-12"
          fallbackBgClass={meta.iconBg.split(" ").find((c) => c.startsWith("bg-")) ?? "bg-slate-100"}
          alt={contact.label}
        />

        <div className="min-w-0">
          {/* Optional title — shown only when populated */}
          {contact.title && (
            <div className="text-[15px] font-medium text-red-700 leading-none mb-0.5 truncate">
              {contact.title}
            </div>
          )}
          <div className="text-xs sm:text-sm font-bold text-slate-900 leading-tight truncate">
            {contact.label}
          </div>
          <div className={`text-sm sm:text-base font-black ${meta.phoneCls} tracking-wide mt-0.5`}>
            {contact.phone}
          </div>
        </div>
      </div>

      {/* Call button */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${meta.iconBg}`}
        aria-hidden="true"
      >
        <PhoneIcon className="w-5 h-5" />
      </div>
    </a>
  );
}

// ─── Category section ──────────────────────────────────────────────────────────

function CategorySection({
  category,
  contacts,
}: {
  category: ContactCategory;
  contacts: SanityContact[];
}) {
  const meta = CATEGORY_META[category];

  return (
    <section aria-labelledby={`section-${category.replace(/\s+/g, "-")}`}>
      <div className="mb-4">
        <h2
          id={`section-${category.replace(/\s+/g, "-")}`}
          className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight"
        >
          {meta.heading}
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">{meta.description}</p>
      </div>

      {contacts.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center">
          <p className="text-sm text-slate-500">
            {category === "HMC Member"
              ? "HMC member contacts will appear here once added in Sanity Studio."
              : "No contacts listed for this category yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {contacts.map((c) => (
            <ContactCard key={c._id} contact={c} meta={meta} />
          ))}
        </div>
      )}
    </section>
  );
}

function getCategoryGroup(cat: string): ContactCategory {
  const lower = (cat || "").toLowerCase();
  if (lower.includes("emergency")) return "Emergency";
  if (lower.includes("supervisor")) return "Supervisor";
  return "HMC Member";
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ContactsPage() {
  const contacts = await getAllContacts();

  // Group by category, preserving schema order field within each group
  // (GROQ already orders by `order asc`, so we just partition)
  const grouped = CATEGORY_ORDER.reduce<Record<ContactCategory, SanityContact[]>>(
    (acc, cat) => {
      acc[cat] = contacts.filter((c) => getCategoryGroup(c.category) === cat);
      return acc;
    },
    { Emergency: [], Supervisor: [], "HMC Member": [] }
  );

  const hasAny = contacts.length > 0;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Page header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full mb-4">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
            </span>
            Emergency numbers — tap to call
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Emergency &amp; Important Contacts
          </h1>
          <p className="mt-2 text-slate-600 text-base max-w-2xl">
            All phone numbers are managed live by HMC in Sanity. Tap any card
            to dial directly from your phone. HMC committee representatives are listed below.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {!hasAny ? (
          /* Empty state */
          <div className="text-center py-20">
            <p className="text-4xl mb-4">📭</p>
            <p className="text-slate-500 text-base">
              No contacts have been added yet.
            </p>
            <p className="text-slate-400 text-sm mt-1">
              HMC members can add contacts in Sanity Studio.
            </p>
          </div>
        ) : (
          CATEGORY_ORDER.map((cat) => (
            <CategorySection
              key={cat}
              category={cat}
              contacts={grouped[cat]}
            />
          ))
        )}

        {/* Back link */}
        <div className="pt-4 border-t border-slate-200">
          <Link
            href="/"
            className="text-sm font-semibold text-blue-700 hover:text-blue-900 hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
