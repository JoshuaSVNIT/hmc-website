import type { Metadata } from "next";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { getAllTeamMembers, type SanityTeamMember } from "@/lib/sanity/queries";
import { urlFor } from "@/sanity/lib/image";

export const metadata: Metadata = {
  title: "About Us — Swami Vivekanand Bhavan HMC",
  description:
    "Learn about the Hostel Management Committee (HMC) team, wardens, and secretaries serving SV Bhavan at SVNIT Surat.",
};

const ptComponents: PortableTextComponents = {
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold text-slate-900">
        {children}
      </strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <u className="underline">{children}</u>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline font-bold text-blue-700 hover:text-blue-800"
      >
        {children}
      </a>
    ),
  },
  block: {
    normal: ({ children }) => (
      <p className="text-sm leading-relaxed mb-2 text-slate-600">
        {children}
      </p>
    ),
    h3: ({ children }) => (
      <h3
        className="text-base font-bold mt-3 mb-1 text-slate-900"
        style={{
          fontFamily: "var(--font-cormorant), system-ui, sans-serif",
        }}
      >
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500 pl-3 italic my-2 text-sm text-slate-600 bg-blue-50/50 py-1 rounded-r">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside space-y-1 text-sm mb-2 text-slate-600">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-1 text-sm mb-2 text-slate-600">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
};

export default async function AboutPage() {
  const members = await getAllTeamMembers();

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

        {/* Team Section */}
        <div className="mb-6">
          <h2
            className="text-xl sm:text-2xl font-bold mb-1 text-slate-900"
            style={{
              fontFamily: "var(--font-cormorant), system-ui, sans-serif",
            }}
          >
            Committee Members
          </h2>
          <p className="text-sm text-slate-500">
            Current serving members of the SV Bhavan Hostel Management Committee.
          </p>
        </div>

        {members.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-xs">
            <p className="text-sm font-semibold text-slate-600">
              No team members listed yet. Profiles added in Sanity Studio will
              appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {members.map((member) => {
              const photoUrl = member.photo?.asset
                ? urlFor(member.photo).width(300).height(300).fit("crop").auto("format").url()
                : null;
              const initials = member.name
                ? member.name
                    .split(" ")
                    .filter(Boolean)
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()
                : "HM";

              return (
                <article
                  key={member._id}
                  className="rounded-xl border border-slate-200/90 bg-white p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-blue-400 shadow-xs"
                >
                  <div>
                    {/* Header with Photo/Avatar and Role/Name */}
                    <div className="flex items-start gap-3.5 mb-4">
                      {photoUrl ? (
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-200 shadow-xs bg-slate-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photoUrl}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div
                          className="w-14 h-14 rounded-xl shrink-0 border border-blue-200/80 bg-blue-50 text-blue-900 flex items-center justify-center font-bold text-base shadow-xs"
                          style={{
                            fontFamily: "var(--font-cormorant), system-ui, sans-serif",
                          }}
                        >
                          {initials}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        {/* Position badge */}
                        <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold mb-1 bg-blue-50 text-blue-800 border border-blue-200/80">
                          {member.position}
                        </div>

                        {/* Name */}
                        <h3
                          className="text-base font-bold tracking-tight text-slate-900 truncate"
                          style={{
                            fontFamily: "var(--font-cormorant), system-ui, sans-serif",
                          }}
                          title={member.name}
                        >
                          {member.name}
                        </h3>
                      </div>
                    </div>

                    {/* Bio (Portable Text) */}
                    {member.bio && member.bio.length > 0 ? (
                      <div className="mt-2 text-sm text-slate-600">
                        <PortableText value={member.bio} components={ptComponents} />
                      </div>
                    ) : (
                      <p className="text-xs italic text-slate-400">
                        Hostel Management Committee representative.
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs flex items-center justify-between text-slate-500">
                    <span>SV Bhavan, SVNIT</span>
                    <Link
                      href="/contacts"
                      className="hover:underline font-bold text-blue-600 hover:text-blue-800"
                    >
                      Contact →
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
