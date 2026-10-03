import type { Metadata } from "next";
import Link from "next/link";
import { getAllReforms } from "@/lib/sanity/queries";
import ReformsTimeline from "./ReformsTimeline";

export const metadata: Metadata = {
  title: "Our Reforms & Initiatives — SV Bhavan HMC",
  description:
    "Documented timeline of completed works, infrastructure upgrades, and hostel welfare initiatives delivered by the Hostel Management Committee.",
};

export default async function ReformsPage() {
  const reforms = await getAllReforms();

  return (
    <main
      className="min-h-screen py-10 sm:py-14 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--color-paper)" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-blue-500/10 text-blue-800 border border-blue-500/20 mb-3 shadow-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            HMC Progress &amp; Accountability
          </div>
          <h1
            className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900"
            style={{
              fontFamily: "var(--font-cormorant), system-ui, sans-serif",
            }}
          >
            Our Reforms &amp; Completed Works
          </h1>
          <p className="mt-3 text-base sm:text-lg leading-relaxed text-slate-600 max-w-2xl">
            A documented record of infrastructure improvements, common room
            renovations, mess enhancements, and resident welfare policies
            implemented across Swami Vivekanand Bhavan.
          </p>

          {reforms.length > 0 && (
            <div
              className="mt-4 flex items-center gap-3 text-xs font-semibold text-slate-500 font-mono"
            >
              <span>{reforms.length} {reforms.length === 1 ? "Initiative" : "Initiatives"} Documented</span>
              <span>·</span>
              <span>Sorted by priority sequence</span>
            </div>
          )}
        </div>

        {/* Vertical Timeline */}
        <ReformsTimeline reforms={reforms} />

        {/* Back Link */}
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
