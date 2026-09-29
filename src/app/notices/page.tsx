import type { Metadata } from "next";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { getAllNotices, type SanityNotice } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Notices — SV Bhavan HMC",
  description:
    "Official notices, circulars, and announcements from the Hostel Management Committee.",
};

// ─── Portable Text component overrides ───────────────────────────────────────
// Spec §5: supports bold text and bullet lists at minimum.

const ptComponents: PortableTextComponents = {
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold text-slate-900">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <u className="underline">{children}</u>,
    // Links in Portable Text (if HMC adds them)
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-700 underline hover:text-blue-900"
      >
        {children}
      </a>
    ),
  },
  block: {
    normal: ({ children }) => (
      <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="text-lg font-bold text-slate-900 mt-4 mb-1">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-base font-semibold text-slate-900 mt-3 mb-1">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-300 pl-4 italic text-slate-600 my-2">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside space-y-1 text-slate-700 text-sm sm:text-base">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-1 text-slate-700 text-sm sm:text-base">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ─── Single notice card ───────────────────────────────────────────────────────

function NoticeCard({ notice }: { notice: SanityNotice }) {
  return (
    <article
      className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-shadow hover:shadow-md ${
        notice.pinned ? "border-yellow-300" : "border-slate-200"
      }`}
    >
      {/* Card header */}
      <div
        className={`px-5 py-4 flex items-start justify-between gap-3 border-b ${
          notice.pinned
            ? "bg-yellow-50 border-yellow-200"
            : "bg-slate-50 border-slate-100"
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          {notice.pinned && (
            <span
              title="Pinned"
              className="text-yellow-500 text-base shrink-0"
              aria-label="Pinned notice"
            >
              📌
            </span>
          )}
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
            {notice.title}
          </h2>
        </div>
        <time
          dateTime={notice.date}
          className="shrink-0 text-xs text-slate-500 font-medium mt-0.5 whitespace-nowrap"
        >
          {formatDate(notice.date)}
        </time>
      </div>

      {/* Portable Text body */}
      {notice.body && notice.body.length > 0 ? (
        <div className="px-5 py-4 space-y-2">
          <PortableText value={notice.body} components={ptComponents} />
        </div>
      ) : (
        <p className="px-5 py-4 text-sm text-slate-400 italic">
          No body content.
        </p>
      )}
    </article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function NoticesPage() {
  const notices = await getAllNotices();

  const pinned = notices.filter((n) => n.pinned);
  const rest = notices.filter((n) => !n.pinned);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full mb-4">
            📢 Official Announcements
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Hostel Notices
          </h1>
          <p className="mt-2 text-slate-600 text-base max-w-xl">
            Circulars, maintenance alerts, and important updates from HMC.
            Pinned notices appear at the top.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {notices.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-slate-500 text-base">No notices yet.</p>
            <p className="text-slate-400 text-sm mt-1">
              HMC members can publish notices from Sanity Studio.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Pinned notices first */}
            {pinned.map((n) => (
              <NoticeCard key={n._id} notice={n} />
            ))}
            {/* Divider between pinned and regular */}
            {pinned.length > 0 && rest.length > 0 && (
              <div className="flex items-center gap-3 py-2">
                <hr className="flex-1 border-slate-200" />
                <span className="text-xs text-slate-400 font-medium">
                  Older notices
                </span>
                <hr className="flex-1 border-slate-200" />
              </div>
            )}
            {rest.map((n) => (
              <NoticeCard key={n._id} notice={n} />
            ))}
          </div>
        )}

        <div className="pt-10 border-t border-slate-200 mt-10">
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
