import type { Metadata } from "next";
import Link from "next/link";
import { getHMCMembers, type SanityContact } from "@/lib/sanity/queries";
import ContactAvatar from "@/components/ContactAvatar";
import { urlFor } from "@/sanity/lib/image";

export const metadata: Metadata = {
  title: "About Us — Swami Vivekanand Bhavan HMC",
  description:
    "Learn about the Hostel Management Committee (HMC) representatives, secretaries, and wardens serving Swami Vivekanand Bhavan at SVNIT Surat.",
};

export default async function AboutPage() {
  const members: SanityContact[] = await getHMCMembers();

  return (
    <main
      className="min-h-screen py-10 sm:py-14 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--color-paper)" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="max-w-2xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-blue-500/10 text-blue-800 border border-blue-500/20 mb-3 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            Council &amp; Leadership
          </div>
          <h1
            className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900"
            style={{
              fontFamily: "var(--font-cormorant), system-ui, sans-serif",
            }}
          >
            About the HMC
          </h1>
          <p className="mt-3 text-base sm:text-lg leading-relaxed text-slate-600">
            The Hostel Management Committee of Swami Vivekanand Bhavan is
            dedicated to maintaining student welfare, transparent administration,
            and rapid resolution of hostel infrastructure needs.
          </p>
        </div>

        {/* Mission statement strip */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 mb-10 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2
                className="text-lg font-bold text-slate-900"
                style={{
                  fontFamily: "var(--font-cormorant), system-ui, sans-serif",
                }}
              >
                Resident Representation &amp; Governance
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                From mess supervision and sports facilities to LAN network
                stability and electrical upkeep, committee members actively
                collaborate with SVNIT administration on behalf of all residents.
              </p>
            </div>
            <Link
              href="/raise-ticket"
              className="shrink-0 px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-md shadow-blue-600/20 hover:shadow-blue-600/30 hover:brightness-105"
              style={{
                backgroundColor: "var(--color-accent-primary)",
                color: "#ffffff",
                fontFamily: "var(--font-cormorant), system-ui, sans-serif",
              }}
            >
              Raise a Request →
            </Link>
          </div>
        </div>

        {/* Committee Members Section */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <h2
              className="text-xl sm:text-2xl font-bold mb-1 text-slate-900"
              style={{
                fontFamily: "var(--font-cormorant), system-ui, sans-serif",
              }}
            >
              Committee Members
            </h2>
            <p className="text-sm text-slate-500">
              Current serving student representatives of the SV Bhavan Hostel Management Committee.
            </p>
          </div>
          {members.length > 0 && (
            <span className="self-start sm:self-auto text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200/80">
              {members.length} {members.length === 1 ? "representative" : "representatives"}
            </span>
          )}
        </div>

        {members.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-xs">
            <p className="text-sm font-normal text-slate-600">
              No committee members listed yet. Contacts added in Sanity Studio under category &ldquo;HMC Member&rdquo; will
              appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {members.map((member) => {
              const photoUrl = member.photo?.asset?._ref || member.photo?.asset
                ? urlFor(member.photo).width(100).auto("format").url()
                : null;

              // Parse name and role if formatted like "Name (Role)" in label
              const parenMatch = member.label.match(/^(.*?)\s*\((.*?)\)$/);
              const displayName = parenMatch ? parenMatch[1].trim() : member.label;
              const displayRole = parenMatch
                ? parenMatch[2].trim()
                : member.title || "HMC Member";
              const secondaryTitle = parenMatch && member.title ? member.title : null;

              const cleanPhone = member.phone.replace(/[\s\-().]/g, "");
              const telHref = `tel:${cleanPhone}`;

              return (
                <article
                  key={member._id}
                  className="rounded-xl border border-slate-200/90 bg-white p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-blue-400 shadow-xs"
                >
                  <div>
                    {/* Header with Photo/Avatar and Role/Name */}
                    <div className="flex items-start gap-3.5 mb-4">
                      <ContactAvatar
                        photoUrl={photoUrl}
                        icon={member.icon}
                        defaultEmoji="🏛️"
                        sizeClass="w-14 h-14"
                        fallbackBgClass="bg-blue-50 text-blue-900 border border-blue-200/80 text-xl font-bold"
                        alt={displayName}
                      />

                      <div className="min-w-0 flex-1">
                        {/* Position badge(s) */}
                        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200/80">
                            {displayRole}
                          </span>
                          {secondaryTitle && (
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                              {secondaryTitle}
                            </span>
                          )}
                        </div>

                        {/* Name */}
                        <h3
                          className="text-lg font-bold tracking-tight text-slate-900 truncate"
                          style={{
                            fontFamily: "var(--font-cormorant), system-ui, sans-serif",
                          }}
                          title={displayName}
                        >
                          {displayName}
                        </h3>
                      </div>
                    </div>

                    {/* Phone Contact Details */}
                    <div className="mt-2 flex items-center justify-between pt-3 border-t border-slate-100">
                      <a
                        href={telHref}
                        className="text-sm sm:text-base font-mono font-bold text-blue-700 hover:text-blue-900 hover:underline inline-flex items-center gap-1.5"
                      >
                        <svg
                          className="w-4 h-4 text-blue-600 shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span>{member.phone}</span>
                      </a>
                      <a
                        href={telHref}
                        className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 inline-flex items-center gap-1 shadow-2xs hover:shadow-xs"
                      >
                        Call
                      </a>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs flex items-center justify-between text-slate-500">
                    <span>SV Bhavan, SVNIT</span>
                    <Link
                      href="/contacts"
                      className="hover:underline font-bold text-blue-600 hover:text-blue-800"
                    >
                      Directory →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

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
