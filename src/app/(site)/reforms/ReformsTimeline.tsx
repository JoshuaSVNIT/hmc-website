"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { SanityReform } from "@/lib/sanity/queries";
import { urlFor } from "@/sanity/lib/image";
import { ImageIcon, CloseIcon, CalendarIcon } from "@/components/icons";

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

const ptComponents: PortableTextComponents = {
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold text-slate-900">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <u className="underline">{children}</u>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline font-bold text-blue-700 hover:text-blue-900 transition-colors"
      >
        {children}
      </a>
    ),
  },
  block: {
    normal: ({ children }) => (
      <p className="leading-relaxed font-normal text-sm sm:text-base mb-3 text-slate-700">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2
        className="text-lg sm:text-xl font-bold mt-5 mb-2 text-slate-900"
        style={{ fontFamily: "var(--font-cormorant), system-ui, sans-serif" }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        className="text-base sm:text-lg font-bold mt-4 mb-2 text-slate-900"
        style={{ fontFamily: "var(--font-cormorant), system-ui, sans-serif" }}
      >
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500 pl-3 italic my-3 text-sm text-slate-700 bg-blue-50/50 py-1.5 rounded-r">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside space-y-1.5 text-sm sm:text-base mb-3 text-slate-700">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-1.5 text-sm sm:text-base mb-3 text-slate-700">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
};

interface LightboxState {
  photos: any[];
  index: number;
  reformTitle: string;
}

export default function ReformsTimeline({ reforms }: { reforms: SanityReform[] }) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const handlePrevPhoto = useCallback(() => {
    setLightbox((prev) => {
      if (!prev || !prev.photos.length) return null;
      return {
        ...prev,
        index: (prev.index - 1 + prev.photos.length) % prev.photos.length,
      };
    });
  }, []);

  const handleNextPhoto = useCallback(() => {
    setLightbox((prev) => {
      if (!prev || !prev.photos.length) return null;
      return {
        ...prev,
        index: (prev.index + 1) % prev.photos.length,
      };
    });
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      else if (e.key === "ArrowLeft") handlePrevPhoto();
      else if (e.key === "ArrowRight") handleNextPhoto();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, handlePrevPhoto, handleNextPhoto]);

  if (reforms.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
        <span className="text-4xl mb-3 block" role="img" aria-label="Timeline icon">
          🏛️
        </span>
        <h2
          className="text-2xl font-bold text-slate-900 mb-2"
          style={{ fontFamily: "var(--font-cormorant), system-ui, sans-serif" }}
        >
          No Reforms Published Yet
        </h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Completed initiatives, infrastructural upgrades, and policy improvements
          published in Sanity Studio will appear in this timeline.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        {reforms.map((reform, idx) => {
          const isLast = idx === reforms.length - 1;
          const hasImageError = imageErrors[reform._id];
          const hasCover = Boolean(reform.coverPhoto?.asset?._ref) && !hasImageError;
          const coverUrl = hasCover
            ? urlFor(reform.coverPhoto)
                .width(600)
                .auto("format")
                .url()
            : null;
          const iconEmoji = reform.icon?.trim() || null;
          const galleryItem = reform.galleryLink;
          const extraPhotos = (reform.photos ?? []).filter((p) => Boolean(p?.asset?._ref));

          // Full set of media for lightbox viewing
          const allPhotos = [
            ...(hasCover ? [reform.coverPhoto] : []),
            ...extraPhotos,
          ];
          const displayPosition = idx + 1;

          return (
            <div
              key={reform._id}
              className="relative pl-7 sm:pl-12 pb-12 last:pb-2"
            >
              {/* Continuous vertical line down ONE side only */}
              {!isLast && (
                <div
                  className="absolute left-[15px] sm:left-[21px] top-6 bottom-0 w-0.5 bg-blue-200/90"
                  aria-hidden="true"
                />
              )}

              {/* Timeline sequence node */}
              <div
                className="absolute left-0 sm:left-1 top-4 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs sm:text-sm ring-4 ring-[#FAF8F5] shadow-xs select-none"
                style={{ fontFamily: "var(--font-ibm-plex-mono), monospace" }}
                title={`Timeline sequence #${displayPosition}`}
              >
                {displayPosition}
              </div>

              {/* Layout: [Timeline Line] → [Text Card] → [Cover Photo or Emoji (Outside / Right)] */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6 items-start">
                {/* 1. Text Card — always sits at consistent, fixed distance from timeline line */}
                <article className="md:col-span-8 rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs hover:border-slate-300 transition-all p-5 sm:p-7">
                  {/* Header Row: Prominent Date Badge + Sequence / Gallery Tags */}
                  <div className="flex items-center justify-between gap-3 flex-wrap mb-4 pb-3.5 border-b border-slate-100">
                    {/* Prominent Date Display */}
                    {reform.date && (
                      <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl bg-slate-900 text-white shadow-xs font-mono text-xs sm:text-sm font-bold tracking-tight">
                        <CalendarIcon size={14} className="text-amber-400 shrink-0" />
                        <time dateTime={reform.date}>
                          {formatDate(reform.date)}
                        </time>
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200/80 font-mono">
                        Initiative #{displayPosition}
                      </span>
                      {galleryItem && (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center gap-1 font-mono">
                          <ImageIcon size={13} />
                          Gallery Album
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h2
                    className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-3.5"
                    style={{ fontFamily: "var(--font-cormorant), system-ui, sans-serif" }}
                  >
                    {reform.title}
                  </h2>

                  {/* Portable Text Body */}
                  {reform.body && reform.body.length > 0 && (
                    <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed mb-4">
                      <PortableText value={reform.body} components={ptComponents} />
                    </div>
                  )}

                  {/* Gallery Link Button */}
                  {galleryItem && (
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
                      <Link
                        href={`/gallery#${galleryItem._id}`}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-xs hover:shadow-md"
                      >
                        <ImageIcon size={16} />
                        <span>
                          View &ldquo;{galleryItem.title || galleryItem.eventName || "Related Album"}&rdquo; in Gallery →
                        </span>
                      </Link>
                      <span className="text-xs text-slate-400 font-mono">
                        Linked to Photo Album
                      </span>
                    </div>
                  )}

                  {/* Additional Photos Thumbnail Grid */}
                  {extraPhotos.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 font-mono">
                        Documentation Photos ({extraPhotos.length})
                      </h3>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                        {extraPhotos.map((photo, pIdx) => {
                          const thumbUrl = urlFor(photo)
                            .width(300)
                            .height(300)
                            .fit("crop")
                            .auto("format")
                            .url();
                          const photoIndex = hasCover ? pIdx + 1 : pIdx;
                          return (
                            <button
                              key={pIdx}
                              type="button"
                              onClick={() =>
                                setLightbox({
                                  photos: allPhotos,
                                  index: photoIndex,
                                  reformTitle: reform.title,
                                })
                              }
                              className="group relative aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-100 hover:border-blue-500 transition-all cursor-pointer shadow-2xs"
                              aria-label={`View photo ${pIdx + 1} for ${reform.title}`}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={thumbUrl}
                                alt=""
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-bold bg-black/60 px-2 py-0.5 rounded-full">
                                  🔍
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </article>

                {/* 2. Visual Accent — Positioned to the right/outside of the text card */}
                {coverUrl ? (
                  <div className="md:col-span-4 w-full">
                    <div
                      onClick={() =>
                        setLightbox({
                          photos: allPhotos,
                          index: 0,
                          reformTitle: reform.title,
                        })
                      }
                      className="group relative rounded-2xl overflow-hidden border border-slate-200/90 bg-white shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer"
                      title="Click to view full cover photo"
                    >
                      <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={coverUrl}
                          alt={reform.title}
                          onError={() => handleImageError(reform._id)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-bold bg-black/60 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm transition-opacity">
                            🔍 Zoom
                          </span>
                        </div>
                      </div>
                      <div className="px-3 py-2 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                        <span className="flex items-center gap-1">
                          <ImageIcon size={12} className="text-blue-600" />
                          Feature Photo
                        </span>
                        <span className="text-blue-600 font-semibold group-hover:underline">
                          View full ↗
                        </span>
                      </div>
                    </div>
                  </div>
                ) : iconEmoji ? (
                  <div className="md:col-span-4 flex items-start">
                    <div
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-50/80 shadow-2xs flex items-center justify-center text-3xl sm:text-4xl select-none hover:scale-105 transition-transform"
                      title={`Initiative icon: ${iconEmoji}`}
                    >
                      <span role="img" aria-label="Reform icon">
                        {iconEmoji}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal for Additional Photos */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="w-full flex items-center justify-between text-white pb-3 px-2">
              <span className="text-sm font-semibold truncate max-w-md">
                {lightbox.reformTitle} ({lightbox.index + 1} / {lightbox.photos.length})
              </span>
              <button
                type="button"
                onClick={() => setLightbox(null)}
                className="p-2 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close photo preview"
              >
                <CloseIcon size={20} />
              </button>
            </div>

            {/* Main Image */}
            <div className="relative w-full flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={urlFor(lightbox.photos[lightbox.index])
                  .width(1600)
                  .height(1200)
                  .fit("max")
                  .auto("format")
                  .url()}
                alt=""
                className="max-h-[75vh] w-auto max-w-full rounded-lg shadow-2xl object-contain"
              />

              {lightbox.photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevPhoto();
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white text-lg font-bold shadow-lg transition-colors cursor-pointer"
                    aria-label="Previous photo"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextPhoto();
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white text-lg font-bold shadow-lg transition-colors cursor-pointer"
                    aria-label="Next photo"
                  >
                    ›
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
