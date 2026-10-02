import type { Metadata } from "next";
import Link from "next/link";
import RaiseTicketForm from "./RaiseTicketForm";

export const metadata: Metadata = {
  title: "Raise a Ticket — SV Bhavan HMC",
  description:
    "Report a complaint to the Hostel Management Committee — no account required.",
};

export default function RaiseTicketPage() {
  return (
    <main
      className="min-h-screen py-10 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--color-paper)" }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-amber-500/10 text-amber-800 border border-amber-500/20 mb-3 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Resident Support Portal
          </div>
          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900"
            style={{
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
            }}
          >
            Raise a Complaint Ticket
          </h1>
          <p
            className="mt-2 text-base leading-relaxed text-slate-600"
          >
            Submit your hostel complaint and receive an instant tracking code. The
            HMC maintenance team reviews and resolves issues according to urgency.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
          <RaiseTicketForm />
        </div>

        {/* Advisory box */}
        <div className="mt-6 rounded-xl border border-amber-300/80 bg-gradient-to-r from-amber-50/80 to-amber-50/40 p-4 text-sm text-slate-800 shadow-2xs">
          <span className="font-bold text-amber-900">Note:</span> Before submitting LAN or
          electrical complaints, consider reviewing the{" "}
          <Link
            href="/guides/lan"
            className="underline font-bold text-amber-800 hover:text-amber-950"
          >
            LAN Guide
          </Link>{" "}
          or{" "}
          <Link
            href="/guides/electrical"
            className="underline font-bold text-amber-800 hover:text-amber-950"
          >
            Electrical Guide
          </Link>{" "}
          for common self-resolvable steps.
        </div>
      </div>
    </main>
  );
}
