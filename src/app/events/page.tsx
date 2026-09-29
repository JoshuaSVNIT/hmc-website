import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllEvents } from "@/lib/sanity/queries";
import EventsList from "./EventsList";

export const metadata: Metadata = {
  title: "Events — SV Bhavan HMC",
  description:
    "Upcoming hostel events and competitions at Swami Vivekanand Bhavan. Register via Google Forms.",
};

/**
 * Feature-gated page per §7.
 * NEXT_PUBLIC_SHOW_EVENTS="true"  → render the page.
 * NEXT_PUBLIC_SHOW_EVENTS="false" (or unset) → call notFound() so Next.js
 * returns a 404 and the Navbar omits the link entirely.
 */
export default async function EventsPage() {
  if (process.env.NEXT_PUBLIC_SHOW_EVENTS !== "true") {
    notFound();
  }

  const events = await getAllEvents();

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full mb-4">
            🎉 Hostel Events
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Upcoming Events
          </h1>
          <p className="mt-2 text-slate-600 text-base max-w-xl">
            Competitions, fests, and hostel activities. Tap{" "}
            <strong>Register</strong> on any event to open the Google Form
            inline.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <EventsList events={events} />

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
