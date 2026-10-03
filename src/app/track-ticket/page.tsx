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
        {/* Page header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-blue-500/10 text-blue-800 border border-blue-500/20 mb-3 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            Live Resolution Status
          </div>
          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900"
            style={{
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
            }}
          >
            Track Your Ticket
          </h1>
          <p className="mt-2 text-base leading-relaxed text-slate-600">
            Enter your ticket code (e.g.{" "}
            <code
              className="px-2 py-0.5 rounded text-sm font-bold bg-slate-100 border border-slate-200 text-slate-900"
              style={{ fontFamily: "var(--font-ibm-plex-mono), monospace" }}
            >
              HMC-1042
            </code>
            ) to check current resolution status and updates from the committee.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
          <TrackTicketClient />
        </div>

        {/* Raise new ticket link */}
        <p className="mt-6 text-center text-sm text-slate-500">
          Need to report a new issue?{" "}
          <Link
            href="/raise-ticket"
            className="underline font-bold text-blue-700 hover:text-blue-800"
          >
            Raise a ticket →
          </Link>
        </p>
      </div>
    </main>
  );
}
