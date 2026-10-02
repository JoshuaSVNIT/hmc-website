import type { Metadata } from "next";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { getAllNotices, type SanityNotice } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Notices & Circulars — SV Bhavan HMC",
  description:
    "Official notices, circulars, and announcements from the Hostel Management Committee.",
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
        className="underline font-medium hover:text-amber-800"
        style={{ color: "var(--color-accent-primary-600)" }}
      >
        {children}
      </a>
    ),
  },
  block: {
    normal: ({ children }) => (
      <p className="leading-relaxed text-sm sm:text-base mb-2" style={{ color: "var(--color-ink-500)" }}>
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2
        className="text-lg font-bold mt-4 mb-1"
        style={{
          color: "var(--color-ink)",
          fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
        }}
      >
        {children}
      </h2>
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
      <ul className="list-disc list-inside space-y-1 text-sm sm:text-base mb-2" style={{ color: "var(--color-ink-500)" }}>
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-1 text-sm sm:text-base mb-2" style={{ color: "var(--color-ink-500)" }}>
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function NoticeCard({ notice }: { notice: SanityNotice }) {
  return (
    <article
      className="rounded border overflow-hidden transition-shadow"
      style={{
        backgroundColor: "#fff",
        borderColor: notice.pinned
          ? "rgba(184,134,11,0.35)"
          : "rgba(31,27,22,0.12)",
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-3.5 flex items-start justify-between gap-3 border-b"
        style={{
          backgroundColor: notice.pinned ? "rgba(184,134,11,0.06)" : "#faf9f6",
          borderColor: notice.pinned
            ? "rgba(184,134,11,0.2)"
            : "rgba(31,27,22,0.07)",
        }}
      >
        <div className="flex items-center gap-2 min-w-0">
          {notice.pinned && (
            <span
              className="text-xs px-2 py-0.5 rounded-sm font-semibold shrink-0"
              style={{
                backgroundColor: "rgba(184,134,11,0.15)",
                color: "var(--color-accent-primary-600)",
              }}
            >
              Pinned
            </span>
          )}
          <h2
            className="text-base sm:text-lg font-bold leading-snug truncate"
            style={{
              color: "var(--color-ink)",
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
            }}
          >
            {notice.title}
          </h2>
        </div>
        <time
          dateTime={notice.date}
          className="shrink-0 text-xs mt-0.5 whitespace-nowrap"
          style={{
            fontFamily: "var(--font-ibm-plex-mono), monospace",
            color: "var(--color-ink-400)",
          }}
        >
          {formatDate(notice.date)}
        </time>
      </div>

      {/* Body */}
      {notice.body && notice.body.length > 0 ? (
        <div className="p-5">
          <PortableText value={notice.body} components={ptComponents} />
        </div>
      ) : (
        <p className="p-5 text-xs italic" style={{ color: "var(--color-ink-400)" }}>
          No body content.
        </p>
      )}
    </article>
  );
}

export default async function NoticesPage() {
  const notices = await getAllNotices();
  const pinned = notices.filter((n) => n.pinned);
  const rest = notices.filter((n) => !n.pinned);

  return (
    <main
      className="min-h-screen py-10 sm:py-14 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--color-paper)" }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1
            className="text-3xl sm:text-5xl font-bold tracking-tight"
            style={{
              color: "var(--color-ink)",
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
            }}
          >
            Notices &amp; Circulars
          </h1>
          <p className="mt-2 text-base leading-relaxed" style={{ color: "var(--color-ink-500)" }}>
            Official announcements, maintenance schedules, and administrative notices
            from the Hostel Management Committee.
          </p>
        </div>

        {notices.length === 0 ? (
          <div
            className="rounded border p-12 text-center"
            style={{ backgroundColor: "#fff", borderColor: "rgba(31,27,22,0.12)" }}
          >
            <p className="text-base" style={{ color: "var(--color-ink-500)" }}>
              No notices published yet.
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--color-ink-400)" }}>
              New circulars published in Sanity Studio will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pinned.map((n) => (
              <NoticeCard key={n._id} notice={n} />
            ))}
            {pinned.length > 0 && rest.length > 0 && (
              <div className="py-2 text-xs font-semibold" style={{ color: "var(--color-ink-400)" }}>
                Earlier notices
              </div>
            )}
            {rest.map((n) => (
              <NoticeCard key={n._id} notice={n} />
            ))}
          </div>
        )}

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
