"use client";

import { useState, useEffect, useCallback } from "react";
import type { SanityGalleryItem } from "@/lib/sanity/queries";
import { urlFor } from "@/sanity/lib/image";

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
          const count = itemImages.length;

          return (
            <article
              key={item._id}
              className="rounded border overflow-hidden p-5 sm:p-6"
              style={{
                backgroundColor: "#fff",
                borderColor: "rgba(31,27,22,0.12)",
              }}
            >
              {/* Header */}
              <div
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b"
                style={{ borderColor: "rgba(31,27,22,0.07)" }}
              >
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {item.eventName && (
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-sm"
                        style={{
                          backgroundColor: "rgba(47,79,62,0.1)",
                          color: "var(--color-accent-secondary)",
                        }}
                      >
                        {item.eventName}
                      </span>
                    )}
                    {item.date && (
                      <time
                        dateTime={item.date}
                        className="text-xs"
                        style={{
                          fontFamily: "var(--font-ibm-plex-mono), monospace",
                          color: "var(--color-ink-400)",
                        }}
                      >
                        {formatDate(item.date)}
                      </time>
                    )}
                  </div>
                  {item.title && (
                    <h2
                      className="text-lg sm:text-xl font-bold"
                      style={{
                        color: "var(--color-ink)",
                        fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
                      }}
                    >
                      {item.title}
                    </h2>
                  )}
                </div>

                <div
                  className="text-xs font-medium shrink-0"
                  style={{
                    fontFamily: "var(--font-ibm-plex-mono), monospace",
                    color: "var(--color-ink-400)",
                  }}
                >
                  {count} {count === 1 ? "photo" : "photos"}
                </div>
              </div>

              {/* Photos Grid */}
              {count === 0 ? (
                <div
                  className="aspect-[3/1] rounded flex items-center justify-center text-xs"
                  style={{
                    backgroundColor: "rgba(31,27,22,0.04)",
                    color: "var(--color-ink-400)",
                  }}
                >
                  No images uploaded for this item.
                </div>
              ) : count === 1 ? (
                <div
                  onClick={() => setActiveLightbox({ item, photoIndex: 0 })}
                  className="aspect-[16/9] sm:aspect-[21/9] max-h-96 rounded overflow-hidden cursor-pointer relative group"
                  style={{ backgroundColor: "rgba(31,27,22,0.04)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={urlFor(itemImages[0]).width(1200).height(600).fit("crop").auto("format").url()}
                    alt={item.title ?? "Gallery photo"}
                    className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-200"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white text-xs font-medium px-3 py-1.5 rounded">
                      View full size
                    </span>
                  </div>
                </div>
              ) : count === 2 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {itemImages.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveLightbox({ item, photoIndex: idx })}
                      className="aspect-[4/3] rounded overflow-hidden cursor-pointer relative group"
                      style={{ backgroundColor: "rgba(31,27,22,0.04)" }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={urlFor(img).width(800).height(600).fit("crop").auto("format").url()}
                        alt={`${item.title ?? "Gallery photo"} - ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-200"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white text-xs font-medium px-2.5 py-1 rounded">
                          Expand
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {itemImages.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveLightbox({ item, photoIndex: idx })}
                      className="aspect-[4/3] rounded overflow-hidden cursor-pointer relative group"
                      style={{ backgroundColor: "rgba(31,27,22,0.04)" }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={urlFor(img).width(600).height(450).fit("crop").auto("format").url()}
                        alt={`${item.title ?? "Gallery photo"} - ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-200"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white text-xs font-medium px-2 py-0.5 rounded">
                          View
                        </span>
                      </div>
                    </div>
                  ))}
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
                className="text-xs text-stone-400"
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
                className="absolute left-2 sm:left-4 z-10 p-3 rounded bg-black/50 hover:bg-black/80 text-white transition-colors text-lg w-10 h-10 flex items-center justify-center cursor-pointer"
                aria-label="Previous photo"
              >
                ‹
              </button>
            )}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={activeLightbox.photoIndex}
              src={urlFor(currentPhoto).width(1600).auto("format").url()}
              alt={`${activeLightbox.item.title ?? "Photo"} - ${activeLightbox.photoIndex + 1}`}
              className="max-h-[75vh] max-w-[90vw] object-contain rounded"
            />

            {images.length > 1 && (
              <button
                onClick={handleNext}
                className="absolute right-2 sm:right-4 z-10 p-3 rounded bg-black/50 hover:bg-black/80 text-white transition-colors text-lg w-10 h-10 flex items-center justify-center cursor-pointer"
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
                      ? "border-amber-500 scale-105"
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
