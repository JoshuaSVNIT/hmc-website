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
        {/* Header — clean, no pill badges */}
        <div className="mb-8">
          <h1
            className="text-3xl sm:text-5xl font-bold tracking-tight"
            style={{
              color: "var(--color-ink)",
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
            }}
          >
            Electrical Complaint &amp; Safety Guide
          </h1>
          <p className="mt-2 text-base leading-relaxed" style={{ color: "var(--color-ink-500)" }}>
            Standard procedures, safety checks, and official reporting steps for room and common-area
            electrical maintenance.
          </p>
        </div>

        {/* Notice strip */}
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded border p-3.5 sm:px-4 mb-5 text-xs sm:text-sm"
          style={{
            backgroundColor: "rgba(184,134,11,0.06)",
            borderColor: "rgba(184,134,11,0.25)",
            color: "var(--color-ink)",
          }}
        >
          <span>If the embedded PDF document does not render in your browser, use the direct links.</span>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold hover:text-amber-800"
              style={{ color: "var(--color-accent-primary-600)" }}
            >
              Open in new tab ↗
            </a>
            <span style={{ color: "rgba(31,27,22,0.2)" }}>|</span>
            <a
              href={pdfUrl}
              download="SVB-Electrical-Complaint-Guide.pdf"
              className="underline font-semibold hover:text-amber-800"
              style={{ color: "var(--color-accent-primary-600)" }}
            >
              Download PDF ↓
            </a>
          </div>
        </div>

        {/* Embedded PDF */}
        <div
          className="rounded border overflow-hidden shadow-xs"
          style={{
            backgroundColor: "#fff",
            borderColor: "rgba(31,27,22,0.12)",
          }}
        >
          <iframe
            src={pdfUrl}
            title="Electrical Complaint Guide PDF"
            className="w-full min-h-[75vh] h-[80vh] border-0"
          >
            <p className="p-6 text-center text-sm" style={{ color: "var(--color-ink-500)" }}>
              Your browser does not support embedded PDFs. Please{" "}
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold"
                style={{ color: "var(--color-accent-primary-600)" }}
              >
                open the PDF in a new tab
              </a>
              .
            </p>
          </iframe>
        </div>

        {/* Document action bar */}
        <div
          className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded border"
          style={{
            backgroundColor: "#fff",
            borderColor: "rgba(31,27,22,0.1)",
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">⚡</span>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--color-ink)" }}>
                SVB Electrical Maintenance Guide
              </p>
              <p className="text-xs" style={{ color: "var(--color-ink-400)" }}>
                Official SVNIT Estate section procedure
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none text-center px-4 py-2 rounded border text-xs font-semibold transition-colors"
              style={{
                borderColor: "rgba(31,27,22,0.2)",
                backgroundColor: "#fff",
                color: "var(--color-ink)",
              }}
            >
              Open new tab ↗
            </a>
            <a
              href={pdfUrl}
              download="SVB-Electrical-Complaint-Guide.pdf"
              className="flex-1 sm:flex-none text-center px-4 py-2 rounded text-xs font-semibold transition-colors"
              style={{
                backgroundColor: "var(--color-ink)",
                color: "var(--color-paper)",
              }}
            >
              Download PDF ↓
            </a>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: "rgba(31,27,22,0.1)" }}>
          <Link
            href="/"
            className="text-sm font-medium hover:underline inline-flex items-center gap-1.5"
            style={{ color: "var(--color-ink-600)" }}
          >
            ← Back to Home
          </Link>

          <div className="flex items-center gap-3 text-sm">
            <span style={{ color: "var(--color-ink-400)" }}>Urgent electrical hazard or issue?</span>
            <Link
              href="/raise-ticket"
              className="font-semibold underline"
              style={{ color: "var(--color-accent-primary-600)" }}
            >
              Raise an electrical ticket →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
