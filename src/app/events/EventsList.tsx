"use client";

import { useState } from "react";
import type { SanityEvent } from "@/lib/sanity/queries";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function EventCard({ event }: { event: SanityEvent }) {
  const [open, setOpen] = useState(false);
  const isPast = event.date ? new Date(event.date) < new Date() : false;

  return (
    <article
      className="rounded-xl border border-slate-200/90 bg-white overflow-hidden p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-colors"
    >
      {/* Header */}
      <div className="pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 flex-wrap mb-1.5">
          {isPast ? (
            <span
              className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-slate-100 text-slate-500"
            >
              Past event
            </span>
          ) : (
            <span
              className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
            >
              Upcoming
            </span>
          )}
        </div>
        <h2
          className="text-lg sm:text-xl font-bold text-slate-900"
          style={{
            fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
          }}
        >
          {event.title}
        </h2>
        {event.date && (
          <time
            dateTime={event.date}
            className="text-xs block mt-1 text-slate-500"
            style={{
              fontFamily: "var(--font-ibm-plex-mono), monospace",
            }}
          >
            {formatDate(event.date)}
          </time>
        )}

        {event.description && (
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {event.description}
          </p>
        )}
      </div>

      {/* Registration */}
      <div className="pt-4">
        {event.googleFormUrl ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                id={`event-register-${event._id}`}
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 hover:brightness-105"
                style={{
                  backgroundColor: "var(--color-accent-primary)",
                  color: "#0B0F17",
                  fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
                }}
              >
                {open ? "Hide Form" : "Register / View Form"}
              </button>

              <a
                href={event.googleFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold transition-colors"
              >
                Open in new tab ↗
              </a>
            </div>

            {open && (
              <div className="mt-4 space-y-2">
                <div
                  className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50"
                >
                  <iframe
                    src={event.googleFormUrl}
                    title={`Registration form for ${event.title}`}
                    className="w-full"
                    style={{ height: "650px", border: "none" }}
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs italic text-slate-400">
            Registration details will be posted soon.
          </p>
        )}
      </div>
    </article>
  );
}

export default function EventsList({ events }: { events: SanityEvent[] }) {
  const upcoming = events.filter((e) => !e.date || new Date(e.date) >= new Date());
  const past = events.filter((e) => e.date && new Date(e.date) < new Date());

  return (
    <div className="space-y-8">
      {upcoming.length > 0 && (
        <section>
          <h2
            className="text-base font-bold mb-3 text-slate-900"
            style={{
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
            }}
          >
            Upcoming Activities
          </h2>
          <div className="space-y-4">
            {upcoming.map((e) => (
              <EventCard key={e._id} event={e} />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2
            className="text-sm font-semibold mb-3 text-slate-500"
            style={{
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
            }}
          >
            Past Activities
          </h2>
          <div className="space-y-4 opacity-75">
            {past.map((e) => (
              <EventCard key={e._id} event={e} />
            ))}
          </div>
        </section>
      )}

      {upcoming.length === 0 && past.length === 0 && (
        <div
          className="text-center py-16 rounded-xl border border-slate-200 bg-white shadow-xs"
        >
          <p className="text-sm text-slate-500">
            No events scheduled right now. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
}
