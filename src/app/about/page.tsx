import type { Metadata } from "next";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { getAllTeamMembers, type SanityTeamMember } from "@/lib/sanity/queries";

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
        className="underline font-bold text-amber-700 hover:text-amber-800"
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
          fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
        }}
      >
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-amber-400 pl-3 italic my-2 text-sm text-slate-600 bg-amber-50/50 py-1 rounded-r">
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-amber-500/10 text-amber-800 border border-amber-500/20 mb-3 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Council &amp; Leadership
          </div>
          <h1
            className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900"
            style={{
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
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
                  fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
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
              className="shrink-0 px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 hover:brightness-105"
              style={{
                backgroundColor: "var(--color-accent-primary)",
                color: "#0B0F17",
                fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
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
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
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
            {members.map((member) => (
              <article
                key={member._id}
                className="rounded-xl border border-slate-200/90 bg-white p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-amber-400 shadow-xs"
              >
                <div>
                  {/* Position badge */}
                  <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold mb-3 bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {member.position}
                  </div>

                  {/* Name */}
                  <h3
                    className="text-lg font-bold tracking-tight mb-2 text-slate-900"
                    style={{
                      fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
                    }}
                  >
                    {member.name}
                  </h3>

                  {/* Bio (Portable Text) */}
                  {member.bio && member.bio.length > 0 ? (
                    <div className="mt-2 text-sm">
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
                    className="hover:underline font-bold text-emerald-700"
                  >
                    Contact →
                  </Link>
                </div>
              </article>
            ))}
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
