import type { Metadata } from "next";
import { getAllCommonRooms } from "@/lib/sanity/queries";
import FacilitiesClient from "./FacilitiesClient";

export const metadata: Metadata = {
  title: "Facilities & Common Rooms — SV Bhavan HMC",
  description:
    "Student common rooms, TV lounges, study areas, and facilities across wings A, B, and C on floors 2 through 8 at Swami Vivekanand Bhavan.",
};

export const dynamic = "force-dynamic";

export default async function FacilitiesPage() {
  const commonRooms = await getAllCommonRooms();

  return (
    <main
      className="min-h-screen py-10 sm:py-14 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--color-paper)" }}
    >
      <div className="max-w-6xl mx-auto space-y-8 sm:space-y-10">
        {/* Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-blue-500/10 text-blue-800 border border-blue-500/20 mb-3 shadow-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            Hostel Infrastructure
          </div>
          <h1
            className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900"
            style={{
              fontFamily: "var(--font-cormorant), system-ui, sans-serif",
            }}
          >
            Common Rooms &amp; Facilities
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Swami Vivekanand Bhavan features dedicated common spaces on every floor (2nd through 8th)
            across Wings A, B, and C for recreation, peer study, and group meetings.
          </p>
        </div>

        {/* Interactive Client Component with Filters & Responsive Layout */}
        <FacilitiesClient commonRooms={commonRooms} />
      </div>
    </main>
  );
}
