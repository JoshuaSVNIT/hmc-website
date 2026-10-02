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
          <h1
            className="text-3xl sm:text-5xl font-bold tracking-tight"
            style={{
              color: "var(--color-ink)",
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
            }}
          >
            Hostel Events
          </h1>
          <p className="mt-2 text-base leading-relaxed" style={{ color: "var(--color-ink-500)" }}>
            Competitions, festivals, sports tournaments, and student activities. Register directly
            using the linked registration forms.
          </p>
        </div>

        <EventsList events={events} />

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
