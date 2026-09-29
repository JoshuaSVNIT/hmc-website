import type { Metadata } from "next";
import RaiseTicketForm from "./RaiseTicketForm";

export const metadata: Metadata = {
  title: "Raise a Ticket — SV Bhavan HMC",
  description:
    "Report a complaint to the Hostel Management Committee — no account required.",
};

export default function RaiseTicketPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Page header */}
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            No Login Required
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Raise a Complaint Ticket
          </h1>
          <p className="mt-2 text-slate-600 text-base">
            Submit your hostel complaint and get an instant ticket code. HMC
            will review and update the status.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <RaiseTicketForm />
        </div>

        {/* Tip box */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl px-4 py-4 text-sm text-amber-900">
          <strong>💡 Tip:</strong> If your issue is a LAN or electrical problem,
          check our{" "}
          <a
            href="/guides/lan"
            className="underline font-semibold hover:text-amber-700"
          >
            LAN Guide
          </a>{" "}
          or{" "}
          <a
            href="/guides/electrical"
            className="underline font-semibold hover:text-amber-700"
          >
            Electrical Guide
          </a>{" "}
          first — you might be able to fix it yourself!
        </div>
      </div>
    </main>
  );
}
