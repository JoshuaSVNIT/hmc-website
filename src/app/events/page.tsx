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

export default async function EventsPage() {
  if (process.env.NEXT_PUBLIC_SHOW_EVENTS !== "true") {
    notFound();
  }

  const events = await getAllEvents();

  return (
    <main
      className="min-h-screen py-10 sm:py-14 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--color-paper)" }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-blue-500/10 text-blue-800 border border-blue-500/20 mb-3 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            Hostel Activities
          </div>
          <h1
            className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900"
            style={{
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
            }}
          >
            Hostel Events
          </h1>
          <p className="mt-2 text-base leading-relaxed text-slate-600">
            Competitions, festivals, sports tournaments, and student activities. Register directly
            using the linked registration forms.
          </p>
        </div>

        <EventsList events={events} />

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
