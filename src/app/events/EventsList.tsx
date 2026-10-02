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
      className="rounded border overflow-hidden p-5 sm:p-6"
      style={{
        backgroundColor: "#fff",
        borderColor: "rgba(31,27,22,0.12)",
      }}
    >
      {/* Header */}
      <div className="pb-4 border-b" style={{ borderColor: "rgba(31,27,22,0.07)" }}>
        <div className="flex items-center gap-2 flex-wrap mb-1.5">
          {isPast ? (
            <span
              className="text-xs px-2 py-0.5 rounded-sm font-medium"
              style={{
                backgroundColor: "rgba(31,27,22,0.06)",
                color: "var(--color-ink-400)",
              }}
            >
              Past event
            </span>
          ) : (
            <span
              className="text-xs px-2 py-0.5 rounded-sm font-semibold"
              style={{
                backgroundColor: "rgba(47,79,62,0.1)",
                color: "var(--color-accent-secondary)",
              }}
            >
              Upcoming
            </span>
          )}
        </div>
        <h2
          className="text-lg sm:text-xl font-bold"
          style={{
            color: "var(--color-ink)",
            fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
          }}
        >
          {event.title}
        </h2>
        {event.date && (
          <time
            dateTime={event.date}
            className="text-xs block mt-1"
            style={{
              fontFamily: "var(--font-ibm-plex-mono), monospace",
              color: "var(--color-ink-400)",
            }}
          >
            {formatDate(event.date)}
          </time>
        )}

        {event.description && (
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--color-ink-500)" }}>
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
                className="px-4 py-2 rounded text-xs font-semibold transition-colors cursor-pointer"
                style={{
                  backgroundColor: "var(--color-accent-primary)",
                  color: "var(--color-ink)",
                  fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
                }}
              >
                {open ? "Hide Form" : "Register / View Form"}
              </button>

              <a
                href={event.googleFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded border text-xs font-medium transition-colors"
                style={{
                  borderColor: "rgba(31,27,22,0.2)",
                  backgroundColor: "#fff",
                  color: "var(--color-ink)",
                }}
              >
                Open in new tab ↗
              </a>
            </div>

            {open && (
              <div className="mt-4 space-y-2">
                <div
                  className="rounded overflow-hidden border"
                  style={{
                    borderColor: "rgba(31,27,22,0.15)",
                    backgroundColor: "rgba(31,27,22,0.02)",
                  }}
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
          <p className="text-xs italic" style={{ color: "var(--color-ink-400)" }}>
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
            className="text-base font-bold mb-3"
            style={{
              color: "var(--color-ink)",
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
            className="text-sm font-semibold mb-3"
            style={{
              color: "var(--color-ink-400)",
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
          className="text-center py-16 rounded border"
          style={{ backgroundColor: "#fff", borderColor: "rgba(31,27,22,0.12)" }}
        >
          <p className="text-sm" style={{ color: "var(--color-ink-500)" }}>
            No events scheduled right now. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
}
