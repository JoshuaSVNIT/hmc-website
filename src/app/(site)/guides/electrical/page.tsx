import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Electrical Complaint Guide — SV Bhavan HMC",
  description:
    "Official guide and safety procedures for resolving and registering electrical complaints in Swami Vivekanand Bhavan.",
};

export default function ElectricalGuidePage() {
  const pdfUrl = "/guides/electrical-guide.pdf";

  return (
    <main
      className="min-h-screen py-10 sm:py-14 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--color-paper)" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-blue-500/10 text-blue-800 border border-blue-500/20 mb-3 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            Safety Protocols
          </div>
          <h1
            className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900"
            style={{
              fontFamily: "var(--font-cormorant), system-ui, sans-serif",
            }}
          >
            Electrical Complaint &amp; Safety Guide
          </h1>
          <p className="mt-2 text-base leading-relaxed text-slate-600">
            Standard procedures, safety checks, and official reporting steps for room and common-area
            electrical maintenance.
          </p>
        </div>

        {/* Notice strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-blue-200/90 bg-blue-50/70 p-3.5 sm:px-4 mb-5 text-xs sm:text-sm text-slate-900 shadow-2xs">
          <span>If the embedded PDF document does not render in your browser, use the direct links.</span>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-bold text-blue-700 hover:text-blue-900"
            >
              Open in new tab ↗
            </a>
            <span className="text-blue-300">|</span>
            <a
              href={pdfUrl}
              download="SVB-Electrical-Complaint-Guide.pdf"
              className="underline font-bold text-blue-700 hover:text-blue-900"
            >
              Download PDF ↓
            </a>
          </div>
        </div>

        {/* Embedded PDF */}
        <div className="rounded-xl border border-slate-200/90 bg-white overflow-hidden shadow-sm">
          <iframe
            src={pdfUrl}
            title="Electrical Complaint Guide PDF"
            className="w-full min-h-[75vh] h-[80vh] border-0"
          >
            <p className="p-6 text-center text-sm text-slate-600">
              Your browser does not support embedded PDFs. Please{" "}
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-bold text-blue-700"
              >
                open the PDF in a new tab
              </a>
              .
            </p>
          </iframe>
        </div>

        {/* Document action bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-slate-200/90 bg-white shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <p className="text-sm font-bold text-slate-900">
                SVB Electrical Maintenance Guide
              </p>
              <p className="text-xs text-slate-500">
                Official SVNIT Estate section safety protocol
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none text-center px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-colors shadow-2xs"
            >
              Open new tab ↗
            </a>
            <a
              href={pdfUrl}
              download="SVB-Electrical-Complaint-Guide.pdf"
              className="flex-1 sm:flex-none text-center px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-xs bg-slate-900 hover:bg-slate-800 text-blue-300 hover:text-white"
            >
              Download PDF ↓
            </a>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm font-semibold text-slate-600 hover:text-slate-900 hover:underline inline-flex items-center gap-1.5"
          >
            ← Back to Home
          </Link>

          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-500">Urgent electrical hazard or issue?</span>
            <Link
              href="/raise-ticket"
              className="font-bold underline text-blue-700 hover:text-blue-800"
            >
              Raise an electrical ticket →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
