import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "LAN Complaint Guide — SV Bhavan HMC",
  description:
    "Official step-by-step guide for resolving and registering LAN and internet connectivity issues in Swami Vivekanand Bhavan.",
};

export default function LanGuidePage() {
  const pdfUrl = "/guides/lan-guide.pdf";

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full mb-3">
            🌐 IT &amp; Networking Guide
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            LAN Complaint Guide
          </h1>
          <p className="mt-2 text-slate-600 text-base max-w-2xl">
            Complete troubleshooting steps and escalation process for SV Bhavan hostel LAN connections.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Helper Note Above Embed */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3.5 sm:px-4 mb-4 text-xs sm:text-sm text-amber-900">
          <div className="flex items-center gap-2">
            <span>ℹ️</span>
            <span>If the guide doesn&apos;t load below, use the download link.</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-blue-700 hover:text-blue-900 hover:underline"
            >
              Open in new tab ↗
            </a>
            <span className="text-amber-300">|</span>
            <a
              href={pdfUrl}
              download="SVB-LAN-Complaint-Guide.pdf"
              className="inline-flex items-center gap-1 font-semibold text-blue-700 hover:text-blue-900 hover:underline"
            >
              Download PDF ↓
            </a>
          </div>
        </div>

        {/* Embedded PDF */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <iframe
            src={pdfUrl}
            title="LAN Complaint Guide PDF"
            className="w-full min-h-[80vh] h-[85vh] border-0"
          >
            <p className="p-6 text-center text-slate-600">
              Your browser does not support embedded PDFs. Please{" "}
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline font-semibold"
              >
                click here to download or open the PDF
              </a>
              .
            </p>
          </iframe>
        </div>

        {/* Fallback & Action Links Below Embed */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📄</span>
            <div>
              <p className="text-sm font-bold text-slate-900">SVB LAN Complaint Guide</p>
              <p className="text-xs text-slate-500">Official PDF reference document</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none text-center px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition-colors shadow-xs"
            >
              Open PDF in new tab ↗
            </a>
            <a
              href={pdfUrl}
              download="SVB-LAN-Complaint-Guide.pdf"
              className="flex-1 sm:flex-none text-center px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs sm:text-sm transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>Download PDF</span>
              <span>↓</span>
            </a>
          </div>
        </div>

        {/* Navigation & Help CTAs */}
        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm font-semibold text-blue-700 hover:text-blue-900 hover:underline"
          >
            ← Back to Home
          </Link>

          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-500">Still facing LAN issues?</span>
            <Link
              href="/raise-ticket"
              className="font-bold text-yellow-600 hover:text-yellow-700 hover:underline"
            >
              Raise a LAN Ticket &rarr;
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
