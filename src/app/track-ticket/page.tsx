import type { Metadata } from "next";
import TrackTicketClient from "./TrackTicketClient";

export const metadata: Metadata = {
  title: "Track Ticket — SV Bhavan HMC",
  description:
    "Look up your complaint ticket status using your ticket code. No login required.",
};

export default function TrackTicketPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Page header */}
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            No Login Required
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Track Your Ticket
          </h1>
          <p className="mt-2 text-slate-600 text-base">
            Enter your ticket code (e.g.{" "}
            <code className="font-mono font-semibold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">
              HMC-1042
            </code>
            ) to check its current status and any updates from HMC.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <TrackTicketClient />
        </div>

        {/* Raise new ticket link */}
        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have a ticket yet?{" "}
          <a
            href="/raise-ticket"
            className="text-blue-700 font-semibold hover:underline"
          >
            Raise one here &rarr;
          </a>
        </p>
      </div>
    </main>
  );
}
