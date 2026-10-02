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
        {/* Page header — clean, no pill badges, consistent heading */}
        <div className="mb-8">
          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{
              color: "var(--color-ink)",
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
            }}
          >
            Raise a Complaint Ticket
          </h1>
          <p
            className="mt-2 text-base leading-relaxed"
            style={{ color: "var(--color-ink-500)" }}
          >
            Submit your hostel complaint and receive an instant tracking code. The
            HMC maintenance team reviews and resolves issues according to urgency.
          </p>
        </div>

        {/* Form Card */}
        <div
          className="rounded border p-6 sm:p-8"
          style={{
            backgroundColor: "#ffffff",
            borderColor: "rgba(31,27,22,0.12)",
            boxShadow: "0 1px 3px rgba(31,27,22,0.05)",
          }}
        >
          <RaiseTicketForm />
        </div>

        {/* Advisory box */}
        <div
          className="mt-6 rounded border p-4 text-sm"
          style={{
            backgroundColor: "rgba(184,134,11,0.06)",
            borderColor: "rgba(184,134,11,0.22)",
            color: "var(--color-ink)",
          }}
        >
          <span className="font-semibold">Note:</span> Before submitting LAN or
          electrical complaints, consider reviewing the{" "}
          <Link
            href="/guides/lan"
            className="underline font-medium hover:text-amber-800"
            style={{ color: "var(--color-accent-primary-600)" }}
          >
            LAN Guide
          </Link>{" "}
          or{" "}
          <Link
            href="/guides/electrical"
            className="underline font-medium hover:text-amber-800"
            style={{ color: "var(--color-accent-primary-600)" }}
          >
            Electrical Guide
          </Link>{" "}
          for common self-resolvable steps.
        </div>
      </div>
    </main>
  );
}
