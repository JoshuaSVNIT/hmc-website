"use client";

import { useState } from "react";
import type { SanityEvent } from "@/lib/sanity/queries";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

const ptComponents: PortableTextComponents = {
  marks: {
    strong: ({ children }) => <strong className="font-bold text-slate-900">{children}</strong>,
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
    normal: ({ children }) => <p className="mb-2 leading-relaxed text-slate-700 text-sm sm:text-base">{children}</p>,
    h3: ({ children }) => <h3 className="font-bold text-base sm:text-lg mt-3 mb-1 text-slate-900">{children}</h3>,
    h4: ({ children }) => <h4 className="font-bold text-sm sm:text-base mt-2 mb-1 text-slate-900">{children}</h4>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc list-inside space-y-1 my-2 text-slate-700 text-sm sm:text-base">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-2 text-slate-700 text-sm sm:text-base">{children}</ol>,
  },
};

function EventCard({ event }: { event: SanityEvent }) {
  const [open, setOpen] = useState(false);
  const isPast = event.date ? new Date(event.date) < new Date() : false;
  const imageUrl = event.image?.asset?._ref
    ? urlFor(event.image).width(900).height(450).fit("crop").auto("format").url()
    : null;
  const iconEmoji = event.icon?.trim() || null;

  return (
    <article
      className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs hover:border-slate-300 transition-colors"
    >
      {/* Event Cover Image or Fallback Emoji Icon Banner */}
      {imageUrl ? (
        <div className="relative w-full h-48 sm:h-64 bg-slate-900/5 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : iconEmoji ? (
        <div className="w-full h-24 sm:h-28 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 flex items-center justify-center">
          <span className="text-4xl select-none" role="img" aria-label="Event icon">
            {iconEmoji}
          </span>
        </div>
      ) : null}

      <div className="p-5 sm:p-6">
        {/* Header & Status */}
        <div className="pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {isPast ? (
              <span className="text-xs sm:text-sm px-3 py-0.5 rounded-full font-medium bg-slate-100 text-slate-500">
                Past event
              </span>
            ) : (
              <span className="text-xs sm:text-sm px-3 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Upcoming
              </span>
            )}
            {iconEmoji && imageUrl && (
              <span className="text-base select-none" role="img" aria-label="Event icon">
                {iconEmoji}
              </span>
            )}
          </div>

          <h2
            className="text-xl sm:text-2xl font-bold text-slate-900"
            style={{
              fontFamily: "var(--font-cormorant), system-ui, sans-serif",
            }}
          >
            {event.title}
          </h2>

          {event.date && (
            <time
              dateTime={event.date}
              className="text-xs sm:text-sm block mt-1 text-slate-500 font-mono"
            >
              {formatDate(event.date)}
            </time>
          )}

          {/* Portable Text Description */}
          {event.description && (
            <div className="mt-3">
              {Array.isArray(event.description) ? (
                <PortableText value={event.description} components={ptComponents} />
              ) : typeof event.description === "string" ? (
                <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-600 whitespace-pre-line">
                  {event.description}
                </p>
              ) : null}
            </div>
          )}
        </div>

        {/* Registration Form */}
        <div className="pt-4">
          {event.googleFormUrl ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  id={`event-register-${event._id}`}
                  type="button"
                  onClick={() => setOpen((v) => !v)}
                  className="px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-md shadow-blue-600/20 hover:shadow-blue-600/30 hover:brightness-105"
                  style={{
                    backgroundColor: "var(--color-accent-primary)",
                    color: "#ffffff",
                    fontFamily: "var(--font-cormorant), system-ui, sans-serif",
                  }}
                >
                  {open ? "Hide Form" : "Register / View Form"}
                </button>

                <a
                  href={event.googleFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold transition-colors"
                >
                  Open in new tab ↗
                </a>
              </div>

              {open && (
                <div className="mt-4 space-y-2">
                  <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
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
              fontFamily: "var(--font-cormorant), system-ui, sans-serif",
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
              fontFamily: "var(--font-cormorant), system-ui, sans-serif",
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
        <div className="text-center py-16 rounded-xl border border-slate-200 bg-white shadow-xs">
          <p className="text-sm text-slate-500">
            No events scheduled right now. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
}
