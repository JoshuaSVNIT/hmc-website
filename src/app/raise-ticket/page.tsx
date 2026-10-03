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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-blue-500/10 text-blue-800 border border-blue-500/20 mb-3 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
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
        <div className="mt-6 rounded-xl border border-blue-200/90 bg-gradient-to-r from-blue-50/80 to-blue-50/40 p-4 text-sm text-slate-800 shadow-2xs">
          <span className="font-bold text-blue-900">Note:</span> Before submitting LAN or
          electrical complaints, consider reviewing the{" "}
          <Link
            href="/guides/lan"
            className="underline font-bold text-blue-700 hover:text-blue-900"
          >
            LAN Guide
          </Link>{" "}
          or{" "}
          <Link
            href="/guides/electrical"
            className="underline font-bold text-blue-700 hover:text-blue-900"
          >
            Electrical Guide
          </Link>{" "}
          for common self-resolvable steps.
        </div>
      </div>
    </main>
  );
}
