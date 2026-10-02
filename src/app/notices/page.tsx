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
      <p className="leading-relaxed text-sm sm:text-base mb-2 text-slate-700">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2
        className="text-lg font-bold mt-4 mb-1 text-slate-900"
        style={{
          fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
        }}
      >
        {children}
      </h2>
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
      <blockquote
        className="border-l-4 border-amber-400 pl-3 italic my-2 text-sm text-slate-600 bg-amber-50/50 py-1 rounded-r"
      >
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside space-y-1 text-sm sm:text-base mb-2 text-slate-700">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-1 text-sm sm:text-base mb-2 text-slate-700">
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
      className={`rounded-xl border overflow-hidden transition-all bg-white shadow-xs ${
        notice.pinned
          ? "border-amber-300/90 border-l-4 border-l-amber-500 shadow-sm"
          : "border-slate-200/90 hover:border-slate-300"
      }`}
    >
      {/* Header */}
      <div
        className={`px-5 py-3.5 flex items-start justify-between gap-3 border-b ${
          notice.pinned
            ? "bg-gradient-to-r from-amber-50/80 to-amber-50/30 border-amber-200/80"
            : "bg-slate-50/70 border-slate-100"
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          {notice.pinned && (
            <span
              className="text-xs px-2.5 py-0.5 rounded-full font-bold shrink-0 bg-amber-100 text-amber-950 border border-amber-300"
            >
              📌 Pinned
            </span>
          )}
          <h2
            className="text-base sm:text-lg font-bold leading-snug truncate text-slate-900"
            style={{
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
            }}
          >
            {notice.title}
          </h2>
        </div>
        <time
          dateTime={notice.date}
          className="shrink-0 text-xs mt-0.5 whitespace-nowrap text-slate-500 font-medium"
          style={{
            fontFamily: "var(--font-ibm-plex-mono), monospace",
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
        <p className="p-5 text-xs italic text-slate-400">
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-amber-500/10 text-amber-800 border border-amber-500/20 mb-3 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Official Circulars
          </div>
          <h1
            className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900"
            style={{
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
            }}
          >
            Notices &amp; Circulars
          </h1>
          <p className="mt-2 text-base leading-relaxed text-slate-600">
            Official announcements, maintenance schedules, and administrative notices
            from the Hostel Management Committee.
          </p>
        </div>

        {notices.length === 0 ? (
          <div
            className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-xs"
          >
            <p className="text-base font-semibold text-slate-600">
              No notices published yet.
            </p>
            <p className="text-xs mt-1 text-slate-400">
              New circulars published in Sanity Studio will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pinned.map((n) => (
              <NoticeCard key={n._id} notice={n} />
            ))}
            {pinned.length > 0 && rest.length > 0 && (
              <div className="py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Earlier notices
              </div>
            )}
            {rest.map((n) => (
              <NoticeCard key={n._id} notice={n} />
            ))}
          </div>
        )}

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
