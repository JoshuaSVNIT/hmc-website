"use client";

import { useState, useEffect, useCallback } from "react";
import type { SanityGalleryItem } from "@/lib/sanity/queries";
import { urlFor } from "@/sanity/lib/image";
import { ImageIcon, VideoIcon } from "@/components/icons";

export function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  try {
    const trimmed = url.trim();
    const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch && shortMatch[1]) {
      return `https://www.youtube-nocookie.com/embed/${shortMatch[1]}`;
    }
    const longMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
    if (longMatch && longMatch[1]) {
      return `https://www.youtube-nocookie.com/embed/${longMatch[1]}`;
    }
    const parsed = new URL(trimmed);
    const vParam = parsed.searchParams.get("v");
    if (vParam && vParam.length === 11) {
      return `https://www.youtube-nocookie.com/embed/${vParam}`;
    }
  } catch {
    if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) {
      return `https://www.youtube-nocookie.com/embed/${url.trim()}`;
    }
  }
  return null;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface ActiveLightbox {
  item: SanityGalleryItem;
  photoIndex: number;
}

export default function GalleryGrid({ items }: { items: SanityGalleryItem[] }) {
  const [activeLightbox, setActiveLightbox] = useState<ActiveLightbox | null>(null);

  const images = activeLightbox?.item.images ?? [];
  const currentPhoto = activeLightbox ? images[activeLightbox.photoIndex] : null;

  const handlePrev = useCallback(() => {
    setActiveLightbox((prev) => {
      if (!prev || !prev.item.images?.length) return null;
      const count = prev.item.images.length;
      return {
        ...prev,
        photoIndex: (prev.photoIndex - 1 + count) % count,
      };
    });
  }, []);

  const handleNext = useCallback(() => {
    setActiveLightbox((prev) => {
      if (!prev || !prev.item.images?.length) return null;
      const count = prev.item.images.length;
      return {
        ...prev,
        photoIndex: (prev.photoIndex + 1) % count,
      };
    });
  }, []);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!activeLightbox) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveLightbox(null);
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeLightbox, handlePrev, handleNext]);

  return (
    <>
      <div className="space-y-8">
        {items.map((item) => {
          const itemImages = item.images ?? [];
          const itemVideos = (item.videos ?? []).filter((v) => Boolean(v?.videoUrl?.trim()));
          const count = itemImages.length;
          const videoCount = itemVideos.length;

          return (
            <article
              key={item._id}
              id={item._id}
              className="scroll-mt-24 rounded-2xl border border-slate-200/90 bg-white overflow-hidden p-5 sm:p-7 shadow-xs hover:border-slate-300 transition-colors"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    {item.eventName && (
                      <span className="text-xs sm:text-sm font-bold px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {item.eventName}
                      </span>
                    )}
                    {item.date && (
                      <time
                        dateTime={item.date}
                        className="text-xs sm:text-sm text-slate-500 font-normal"
                        style={{ fontFamily: "var(--font-ibm-plex-mono), monospace" }}
                      >
                        {formatDate(item.date)}
                      </time>
                    )}
                  </div>
                  {item.title && (
                    <h2
                      className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight"
                      style={{
                        fontFamily: "var(--font-cormorant), system-ui, sans-serif",
                      }}
                    >
                      {item.title}
                    </h2>
                  )}
                </div>

                <div
                  className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-500 shrink-0"
                  style={{ fontFamily: "var(--font-ibm-plex-mono), monospace" }}
                >
                  {count > 0 && <span>{count} {count === 1 ? "photo" : "photos"}</span>}
                  {count > 0 && videoCount > 0 && <span className="text-slate-300">·</span>}
                  {videoCount > 0 && <span>{videoCount} {videoCount === 1 ? "video" : "videos"}</span>}
                </div>
              </div>

              {/* ── SECTION 1: PHOTOS ── */}
              <div>
                {videoCount > 0 && (
                  <div className="flex items-center gap-2 mb-3.5 text-slate-700">
                    <ImageIcon size={18} className="text-slate-500" />
                    <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-600">
                      Photos ({count})
                    </h3>
                  </div>
                )}

                {count === 0 ? (
                  <div className="aspect-[3/1] rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-sm text-slate-400">
                    No photos uploaded for this album.
                  </div>
                ) : count === 1 ? (
                  <div
                    onClick={() => setActiveLightbox({ item, photoIndex: 0 })}
                    className="aspect-[16/9] sm:aspect-[21/9] max-h-96 rounded-xl overflow-hidden cursor-pointer relative group bg-slate-100"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={urlFor(itemImages[0]).width(400).auto("format").quality(75).url()}
                      alt={item.title ?? "Gallery photo"}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/80 text-white text-xs font-bold px-3 py-1.5 rounded shadow">
                        View full size
                      </span>
                    </div>
                  </div>
                ) : count === 2 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {itemImages.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActiveLightbox({ item, photoIndex: idx })}
                        className="aspect-[4/3] rounded-xl overflow-hidden cursor-pointer relative group bg-slate-100"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={urlFor(img).width(400).auto("format").quality(75).url()}
                          alt={`${item.title ?? "Gallery photo"} - ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/80 text-white text-xs font-bold px-2.5 py-1 rounded shadow">
                            Expand
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
                    {itemImages.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActiveLightbox({ item, photoIndex: idx })}
                        className="aspect-[4/3] rounded-xl overflow-hidden cursor-pointer relative group bg-slate-100"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={urlFor(img).width(400).auto("format").quality(75).url()}
                          alt={`${item.title ?? "Gallery photo"} - ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/80 text-white text-xs font-bold px-2 py-0.5 rounded shadow">
                            View
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── SECTION 2: VIDEOS ── */}
              {videoCount > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-2 mb-4 text-slate-900">
                    <div className="p-1 rounded-md bg-red-100/70 text-red-600">
                      <VideoIcon size={16} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold tracking-tight text-slate-800">
                        Event Videos ({videoCount})
                      </h3>
                    </div>
                  </div>

                  <div className={`grid gap-4 ${videoCount === 1 ? "grid-cols-1 max-w-3xl" : "grid-cols-1 md:grid-cols-2"}`}>
                    {itemVideos.map((vid, vIdx) => {
                      const embedUrl = getYouTubeEmbedUrl(vid.videoUrl);
                      if (!embedUrl) {
                        return (
                          <div
                            key={vid._key || vIdx}
                            className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3"
                          >
                            <span className="text-sm font-normal text-slate-700 truncate">
                              Video {vIdx + 1}
                            </span>
                            <a
                              href={vid.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs sm:text-sm font-bold text-accent-primary hover:underline shrink-0"
                            >
                              Watch on YouTube →
                            </a>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={vid._key || vIdx}
                          className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-200 shadow-xs"
                        >
                          <iframe
                            src={embedUrl}
                            title={`${item.title ?? "Event"} - Video ${vIdx + 1}`}
                            className="absolute inset-0 w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            loading="lazy"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {activeLightbox && currentPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 flex flex-col justify-between p-4 sm:p-6"
          onClick={() => setActiveLightbox(null)}
        >
          {/* Top Bar */}
          <div
            className="flex items-center justify-between text-white max-w-6xl mx-auto w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h3 className="text-sm sm:text-base font-bold font-heading">
                {activeLightbox.item.title ?? activeLightbox.item.eventName ?? "Gallery"}
              </h3>
              <p
                className="text-xs text-slate-400"
                style={{ fontFamily: "var(--font-ibm-plex-mono), monospace" }}
              >
                Photo {activeLightbox.photoIndex + 1} of {images.length}
              </p>
            </div>

            <button
              onClick={() => setActiveLightbox(null)}
              className="p-2 rounded bg-white/10 hover:bg-white/20 text-white transition-colors text-sm w-8 h-8 flex items-center justify-center cursor-pointer"
              aria-label="Close lightbox"
            >
              ✕
            </button>
          </div>

          {/* Image Display */}
          <div
            className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {images.length > 1 && (
              <button
                onClick={handlePrev}
                className="absolute left-2 sm:left-4 z-10 p-3 rounded bg-black/60 hover:bg-black/80 text-white transition-colors text-lg w-10 h-10 flex items-center justify-center cursor-pointer shadow-lg"
                aria-label="Previous photo"
              >
                ‹
              </button>
            )}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={activeLightbox.photoIndex}
              src={urlFor(currentPhoto).width(1200).auto("format").url()}
              alt={`${activeLightbox.item.title ?? "Photo"} - ${activeLightbox.photoIndex + 1}`}
              className="max-h-[75vh] max-w-[90vw] object-contain rounded shadow-2xl"
            />

            {images.length > 1 && (
              <button
                onClick={handleNext}
                className="absolute right-2 sm:right-4 z-10 p-3 rounded bg-black/60 hover:bg-black/80 text-white transition-colors text-lg w-10 h-10 flex items-center justify-center cursor-pointer shadow-lg"
                aria-label="Next photo"
              >
                ›
              </button>
            )}
          </div>

          {/* Bottom Thumbnails */}
          {images.length > 1 && (
            <div
              className="flex items-center justify-center gap-2 overflow-x-auto max-w-3xl mx-auto w-full py-2 px-4"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    setActiveLightbox((prev) => (prev ? { ...prev, photoIndex: idx } : null))
                  }
                  className={`w-12 h-12 rounded overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    idx === activeLightbox.photoIndex
                      ? "border-blue-400 scale-105"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={urlFor(img).width(100).height(100).fit("crop").auto("format").url()}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
