import type { Metadata } from "next";
import Link from "next/link";
import { getAllGalleryItems } from "@/lib/sanity/queries";
import GalleryGrid from "./GalleryGrid";

export const metadata: Metadata = {
  title: "Event Gallery — SV Bhavan HMC",
  description:
    "Photos and posters from hostel celebrations, cultural events, and activities at Swami Vivekanand Bhavan.",
};

export default async function GalleryPage() {
  const items = await getAllGalleryItems();
  const totalPhotos = items.reduce((acc, item) => acc + (item.images?.length ?? 0), 0);

  return (
    <main
      className="min-h-screen py-10 sm:py-14 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--color-paper)" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1
            className="text-3xl sm:text-5xl font-bold tracking-tight"
            style={{
              color: "var(--color-ink)",
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
            }}
          >
            Hostel Photo Gallery
          </h1>
          <p className="mt-2 text-base leading-relaxed" style={{ color: "var(--color-ink-500)" }}>
            Celebrations, sports competitions, cultural gatherings, and campus
            memories from Swami Vivekanand Bhavan.
          </p>
        </div>

        {items.length === 0 ? (
          <div
            className="rounded border p-12 text-center"
            style={{ backgroundColor: "#fff", borderColor: "rgba(31,27,22,0.12)" }}
          >
            <p className="text-base" style={{ color: "var(--color-ink-500)" }}>
              No photo albums published yet.
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--color-ink-400)" }}>
              Albums uploaded via Sanity Studio will appear here.
            </p>
          </div>
        ) : (
          <>
            <div
              className="flex items-center justify-between gap-4 mb-6 text-xs"
              style={{
                fontFamily: "var(--font-ibm-plex-mono), monospace",
                color: "var(--color-ink-500)",
              }}
            >
              <p>
                {items.length} {items.length === 1 ? "album" : "albums"},{" "}
                {totalPhotos} {totalPhotos === 1 ? "photo" : "photos"}
              </p>
            </div>
            <GalleryGrid items={items} />
          </>
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
