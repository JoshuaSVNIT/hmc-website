import type { Metadata } from "next";
import Link from "next/link";
import TrackTicketClient from "./TrackTicketClient";

export const metadata: Metadata = {
  title: "Track Ticket — SV Bhavan HMC",
  description:
    "Look up your complaint ticket status using your ticket code. No login required.",
};

export default function TrackTicketPage() {
  return (
    <main
      className="min-h-screen py-10 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--color-paper)" }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Page header — clean, no pill badges */}
        <div className="mb-8">
          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{
              color: "var(--color-ink)",
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
            }}
          >
            Track Your Ticket
          </h1>
          <p
            className="mt-2 text-base leading-relaxed"
            style={{ color: "var(--color-ink-500)" }}
          >
            Enter your ticket code (e.g.{" "}
            <code
              className="px-1.5 py-0.5 rounded text-sm font-semibold"
              style={{
                fontFamily: "var(--font-ibm-plex-mono), monospace",
                backgroundColor: "rgba(31,27,22,0.08)",
                color: "var(--color-ink)",
              }}
            >
              HMC-1042
            </code>
            ) to check current resolution status and updates from the committee.
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded border p-6 sm:p-8"
          style={{
            backgroundColor: "#ffffff",
            borderColor: "rgba(31,27,22,0.12)",
            boxShadow: "0 1px 3px rgba(31,27,22,0.05)",
          }}
        >
          <TrackTicketClient />
        </div>

        {/* Raise new ticket link */}
        <p className="mt-6 text-center text-sm" style={{ color: "var(--color-ink-500)" }}>
          Need to report a new issue?{" "}
          <Link
            href="/raise-ticket"
            className="underline font-medium hover:text-amber-800"
            style={{ color: "var(--color-accent-primary-600)" }}
          >
            Raise a ticket →
          </Link>
        </p>
      </div>
    </main>
  );
}
