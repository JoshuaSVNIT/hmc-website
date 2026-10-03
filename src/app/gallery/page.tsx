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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-blue-500/10 text-blue-800 border border-blue-500/20 mb-3 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            Campus Life &amp; Events
          </div>
          <h1
            className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900"
            style={{
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
            }}
          >
            Hostel Photo Gallery
          </h1>
          <p className="mt-2 text-base leading-relaxed text-slate-600">
            Celebrations, sports competitions, cultural gatherings, and campus
            memories from Swami Vivekanand Bhavan.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-xs">
            <p className="text-base font-semibold text-slate-600">
              No photo albums published yet.
            </p>
            <p className="text-xs mt-1 text-slate-400">
              Albums uploaded via Sanity Studio will appear here.
            </p>
          </div>
        ) : (
          <>
            <div
              className="flex items-center justify-between gap-4 mb-6 text-xs text-slate-600 font-semibold"
              style={{
                fontFamily: "var(--font-ibm-plex-mono), monospace",
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
