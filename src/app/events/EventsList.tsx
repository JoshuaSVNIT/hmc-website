"use client";

import { useState } from "react";
import type { SanityEvent } from "@/lib/sanity/queries";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

// ─── Google Form embed (per-event detail view) ────────────────────────────────

function EventCard({ event }: { event: SanityEvent }) {
  const [open, setOpen] = useState(false);

  const isPast = event.date ? new Date(event.date) < new Date() : false;

  return (
    <article className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {isPast ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">
                  Past event
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Upcoming
                </span>
              )}
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 leading-snug">
              {event.title}
            </h2>
            {event.date && (
              <time
                dateTime={event.date}
                className="text-xs text-slate-500 font-medium mt-1 block"
              >
                📅 {formatDate(event.date)}
              </time>
            )}
          </div>
        </div>

        {event.description && (
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            {event.description}
          </p>
        )}
      </div>

      {/* Registration / form section */}
      <div className="px-5 py-4">
        {event.googleFormUrl ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <button
                id={`event-register-${event._id}`}
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-semibold text-sm transition-colors shadow-xs"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {open ? "Hide Form" : "Register / Open Form"}
              </button>

              <a
                href={event.googleFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl font-semibold text-sm transition-colors shadow-xs"
              >
                <span>Open form in new tab</span>
                <span>↗</span>
              </a>
            </div>

            {/* Inline Google Form iframe — rendered when open */}
            {open && (
              <div className="mt-4 space-y-2">
                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-50">
                  <iframe
                    src={event.googleFormUrl}
                    title={`Registration form for ${event.title}`}
                    className="w-full"
                    style={{ height: "680px", border: "none" }}
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Form not loading?{" "}
                  <a
                    href={event.googleFormUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 underline font-medium hover:text-blue-900"
                  >
                    Click here to open the form in a new tab
                  </a>
                  .
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-slate-400 italic">
            No registration form linked yet.
          </p>
        )}
      </div>
    </article>
  );
}

export default function EventsList({ events }: { events: SanityEvent[] }) {
  const upcoming = events.filter(
    (e) => !e.date || new Date(e.date) >= new Date()
  );
  const past = events.filter((e) => e.date && new Date(e.date) < new Date());

  return (
    <div className="space-y-10">
      {/* Upcoming */}
      {upcoming.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Upcoming Events
          </h2>
          <div className="space-y-5">
            {upcoming.map((e) => (
              <EventCard key={e._id} event={e} />
            ))}
          </div>
        </section>
      )}

      {/* Past */}
      {past.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-slate-500 mb-4">
            Past Events
          </h2>
          <div className="space-y-5 opacity-75">
            {past.map((e) => (
              <EventCard key={e._id} event={e} />
            ))}
          </div>
        </section>
      )}

      {upcoming.length === 0 && past.length === 0 && (
        <div className="text-center py-24">
          <p className="text-5xl mb-4">🗓️</p>
          <p className="text-slate-500 text-base">No events yet.</p>
          <p className="text-slate-400 text-sm mt-1">
            HMC members can add events from Sanity Studio.
          </p>
        </div>
      )}
    </div>
  );
}
