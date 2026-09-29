import type { Metadata } from "next";
import Link from "next/link";
import { getAllGalleryItems } from "@/lib/sanity/queries";
import GalleryGrid from "./GalleryGrid";

export const metadata: Metadata = {
  title: "Gallery — SV Bhavan HMC",
  description:
    "Photos and posters from hostel events at Swami Vivekanand Bhavan.",
};

export default async function GalleryPage() {
  const items = await getAllGalleryItems();
  const totalPhotos = items.reduce((acc, item) => acc + (item.images?.length ?? 0), 0);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-4">
            📸 Hostel Events
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Event Gallery
          </h1>
          <p className="mt-2 text-slate-600 text-base max-w-xl">
            Celebrations, competitions, posters, and memories from SV Bhavan.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {items.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🖼️</p>
            <p className="text-slate-500 text-base">No albums or photos yet.</p>
            <p className="text-slate-400 text-sm mt-1">
              HMC members can upload photos from Sanity Studio.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4 mb-6 text-sm text-slate-500">
              <p>
                {items.length} {items.length === 1 ? "album" : "albums"} • {totalPhotos}{" "}
                {totalPhotos === 1 ? "photo" : "photos"}
              </p>
            </div>
            <GalleryGrid items={items} />
          </>
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
