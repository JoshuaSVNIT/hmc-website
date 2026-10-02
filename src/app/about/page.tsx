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
      <strong className="font-semibold" style={{ color: "var(--color-ink)" }}>
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
        className="underline font-medium"
        style={{ color: "var(--color-accent-primary-600)" }}
      >
        {children}
      </a>
    ),
  },
  block: {
    normal: ({ children }) => (
      <p className="text-sm leading-relaxed mb-2" style={{ color: "var(--color-ink-500)" }}>
        {children}
      </p>
    ),
    h3: ({ children }) => (
      <h3
        className="text-base font-bold mt-3 mb-1"
        style={{
          color: "var(--color-ink)",
          fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
        }}
      >
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote
        className="border-l-2 pl-3 italic my-2 text-sm"
        style={{
          borderColor: "var(--color-accent-primary)",
          color: "var(--color-ink-400)",
        }}
      >
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside space-y-1 text-sm mb-2" style={{ color: "var(--color-ink-500)" }}>
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-1 text-sm mb-2" style={{ color: "var(--color-ink-500)" }}>
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
          <h1
            className="text-3xl sm:text-5xl font-bold tracking-tight"
            style={{
              color: "var(--color-ink)",
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
            }}
          >
            About the HMC
          </h1>
          <p
            className="mt-3 text-base sm:text-lg leading-relaxed"
            style={{ color: "var(--color-ink-500)" }}
          >
            The Hostel Management Committee of Swami Vivekanand Bhavan is
            dedicated to maintaining student welfare, transparent administration,
            and rapid resolution of hostel infrastructure needs.
          </p>
        </div>

        {/* Mission statement strip */}
        <div
          className="rounded border p-5 sm:p-6 mb-10"
          style={{
            backgroundColor: "#fff",
            borderColor: "rgba(31,27,22,0.1)",
          }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2
                className="text-lg font-bold"
                style={{
                  color: "var(--color-ink)",
                  fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
                }}
              >
                Resident Representation &amp; Governance
              </h2>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--color-ink-500)" }}>
                From mess supervision and sports facilities to LAN network
                stability and electrical upkeep, committee members actively
                collaborate with SVNIT administration on behalf of all residents.
              </p>
            </div>
            <Link
              href="/raise-ticket"
              className="shrink-0 px-4 py-2.5 rounded text-xs font-semibold transition-colors"
              style={{
                backgroundColor: "var(--color-accent-primary)",
                color: "var(--color-ink)",
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
            className="text-xl sm:text-2xl font-bold mb-1"
            style={{
              color: "var(--color-ink)",
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
            }}
          >
            Committee Members
          </h2>
          <p className="text-sm" style={{ color: "var(--color-ink-400)" }}>
            Current serving members of the SV Bhavan Hostel Management Committee.
          </p>
        </div>

        {members.length === 0 ? (
          <div
            className="rounded border p-8 text-center"
            style={{
              backgroundColor: "#fff",
              borderColor: "rgba(31,27,22,0.1)",
            }}
          >
            <p className="text-sm" style={{ color: "var(--color-ink-500)" }}>
              No team members listed yet. Profiles added in Sanity Studio will
              appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {members.map((member) => (
              <article
                key={member._id}
                className="rounded border p-5 flex flex-col justify-between transition-shadow hover:shadow-sm"
                style={{
                  backgroundColor: "#fff",
                  borderColor: "rgba(31,27,22,0.1)",
                }}
              >
                <div>
                  {/* Position badge */}
                  <div
                    className="inline-block px-2.5 py-1 rounded-sm text-xs font-medium mb-3"
                    style={{
                      backgroundColor: "rgba(47,79,62,0.1)",
                      color: "var(--color-accent-secondary)",
                    }}
                  >
                    {member.position}
                  </div>

                  {/* Name */}
                  <h3
                    className="text-lg font-bold tracking-tight mb-2"
                    style={{
                      color: "var(--color-ink)",
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
                    <p className="text-xs italic" style={{ color: "var(--color-ink-400)" }}>
                      Hostel Management Committee representative.
                    </p>
                  )}
                </div>

                <div
                  className="mt-4 pt-3 border-t text-xs flex items-center justify-between"
                  style={{
                    borderColor: "rgba(31,27,22,0.07)",
                    color: "var(--color-ink-400)",
                  }}
                >
                  <span>SV Bhavan, SVNIT</span>
                  <Link
                    href="/contacts"
                    className="hover:underline font-medium"
                    style={{ color: "var(--color-accent-secondary)" }}
                  >
                    Contact →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

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
