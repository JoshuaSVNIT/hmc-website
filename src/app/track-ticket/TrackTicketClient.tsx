"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import { lookupTicket, type LookupResult } from "./actions";
import type { Ticket, TicketStatus, TicketTag } from "@/types";

// ─── Tag & Status helpers ─────────────────────────────────────────────────────

const TAG_META: Record<TicketTag, { label: string; emoji: string }> = {
  Mess:            { label: "Mess",             emoji: "🍽️" },
  Electrical:      { label: "Electrical",        emoji: "⚡" },
  "Plumbing/Water":{ label: "Plumbing / Water",  emoji: "🚿" },
  Elevator:        { label: "Elevator",          emoji: "🛗" },
  Cleanliness:     { label: "Cleanliness",       emoji: "🧹" },
  Pests:           { label: "Pests",              emoji: "🐜" },
  Others:          { label: "Others",             emoji: "📋" },
};

function getStatusStyle(status: TicketStatus) {
  switch (status) {
    case "Resolved":
      return {
        bg: "#ecfdf5",
        text: "#065f46",
        border: "#a7f3d0",
        dot: "#059669",
      };
    case "In Progress":
      return {
        bg: "#fffbeb",
        text: "#92400e",
        border: "#fde68a",
        dot: "#f59e0b",
      };
    case "Open":
    default:
      return {
        bg: "#f1f5f9",
        text: "#334155",
        border: "#cbd5e1",
        dot: "#64748b",
      };
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

// ─── Ticket Detail Card ───────────────────────────────────────────────────────

function TicketDetailCard({ ticket }: { ticket: Ticket }) {
  const tag = TAG_META[ticket.tag] ?? TAG_META.Others;
  const statusStyle = getStatusStyle(ticket.status);

  function handlePrint() {
    window.print();
  }

  return (
    <div className="mt-6 space-y-0">
      {/* Print-only header */}
      <div className="hidden print:block mb-6">
        <h1 className="text-xl font-bold text-black font-heading">Swami Vivekanand Bhavan HMC</h1>
        <p className="text-xs text-gray-600 mt-0.5">Hostel Management Committee — Complaint Ticket</p>
        <hr className="my-3 border-black" />
      </div>

      {/* Detail card */}
      <div className="rounded-xl border border-slate-200/90 bg-white overflow-hidden shadow-sm">
        {/* Header row */}
        <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <span
              className="text-xl sm:text-2xl font-bold tracking-wider text-slate-900"
              style={{ fontFamily: "var(--font-ibm-plex-mono), monospace" }}
            >
              {ticket.ticket_code}
            </span>
            <span
              className="print:hidden inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-2xs"
              style={{
                backgroundColor: statusStyle.bg,
                color: statusStyle.text,
                borderColor: statusStyle.border,
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: statusStyle.dot }}
              />
              {ticket.status}
            </span>
          </div>

          {/* Print-only status */}
          <div className="hidden print:block text-xs font-bold text-black">
            Status: {ticket.status}
          </div>

          {/* Print button */}
          <button
            id="print-ticket-btn"
            onClick={handlePrint}
            className="print:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 transition-colors shadow-2xs cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>
        </div>

        {/* Fields */}
        <dl className="divide-y divide-slate-100">
          <Row label="Category">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-800">
              <span>{tag.emoji}</span>
              <span>{tag.label}</span>
            </span>
          </Row>

          <Row label="Room Number">
            <span
              className="text-sm font-bold text-slate-900"
              style={{ fontFamily: "var(--font-ibm-plex-mono), monospace" }}
            >
              {ticket.room_no || "—"}
            </span>
          </Row>

          <Row label="Description">
            <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-800">
              {ticket.description}
            </p>
          </Row>

          {ticket.admin_notes && (
            <Row label="HMC Committee Note">
              <div className="p-3.5 rounded-lg border border-amber-300/80 bg-gradient-to-r from-amber-50/80 to-amber-50/40 text-sm text-slate-900 shadow-2xs">
                <div className="font-bold text-xs mb-1 text-amber-950 flex items-center gap-1.5">
                  <span>💬</span> Update from Supervisor / Committee:
                </div>
                <p className="leading-relaxed whitespace-pre-wrap text-slate-800">{ticket.admin_notes}</p>
              </div>
            </Row>
          )}

          {ticket.photo_url && (
            <Row label="Attached Photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ticket.photo_url}
                alt="Ticket attachment"
                className="h-36 rounded-lg border border-slate-200 object-cover shadow-2xs"
              />
            </Row>
          )}

          <Row label="Logged At">
            <span
              className="text-xs text-slate-500 font-medium"
              style={{ fontFamily: "var(--font-ibm-plex-mono), monospace" }}
            >
              {formatDate(ticket.created_at)}
            </span>
          </Row>

          <Row label="Last Update">
            <span
              className="text-xs text-slate-500 font-medium"
              style={{ fontFamily: "var(--font-ibm-plex-mono), monospace" }}
            >
              {formatDate(ticket.updated_at)}
            </span>
          </Row>

          <Row label="Reported By">
            {ticket.is_anonymous ? (
              <span className="text-xs italic text-slate-400">
                Anonymous resident
              </span>
            ) : (
              <span className="text-sm font-semibold text-slate-900">
                {ticket.raiser_name ?? "—"}
              </span>
            )}
          </Row>

          {ticket.phone_no && !ticket.is_anonymous && (
            <Row label="Contact Phone">
              <span
                className="text-xs font-bold text-slate-900"
                style={{ fontFamily: "var(--font-ibm-plex-mono), monospace" }}
              >
                {ticket.phone_no}
              </span>
            </Row>
          )}
        </dl>
      </div>

      {/* Print-only footer */}
      <div className="hidden print:block mt-6 text-xs text-gray-500">
        <p>Track this ticket at <strong>svbhavan.in/track-ticket</strong> with code: <strong>{ticket.ticket_code}</strong></p>
        <p className="mt-1">Printed: {new Date().toLocaleString("en-IN")}</p>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="px-5 py-3.5 grid grid-cols-[130px_1fr] gap-3 items-start text-sm">
      <dt className="text-xs font-semibold pt-0.5 text-slate-500 print:text-black">
        {label}
      </dt>
      <dd className="text-slate-900 print:text-black">{children}</dd>
    </div>
  );
}

// ─── Recent Tickets Section ───────────────────────────────────────────────────

function RecentTickets({
  onSelect,
}: {
  onSelect: (code: string) => void;
}) {
  const [recentCodes, setRecentCodes] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("hmc_recent_tickets");
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecentCodes(parsed.filter((x): x is string => typeof x === "string"));
        }
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  if (recentCodes.length === 0) return null;

  return (
    <div className="mt-6 pt-5 border-t border-slate-200 print:hidden">
      <h2 className="text-xs font-semibold mb-2.5 text-slate-500 uppercase tracking-wider">
        Recent tickets on this device
      </h2>
      <div className="flex flex-wrap gap-2">
        {recentCodes.map((code) => (
          <button
            key={code}
            id={`recent-ticket-${code}`}
            type="button"
            onClick={() => onSelect(code)}
            className="px-2.5 py-1 bg-slate-50 hover:bg-amber-50 border border-slate-300 hover:border-amber-400 rounded-lg text-xs font-bold transition-colors cursor-pointer text-slate-800"
            style={{ fontFamily: "var(--font-ibm-plex-mono), monospace" }}
          >
            {code}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Search Bar ───────────────────────────────────────────────────────────────

function SearchBar({
  initialValue,
  onSearch,
  isPending,
}: {
  initialValue: string;
  onSearch: (code: string) => void;
  isPending: boolean;
}) {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSearch(value);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full print:hidden">
      <input
        ref={inputRef}
        id="ticket-code-input"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value.toUpperCase())}
        placeholder="Enter ticket code (e.g. HMC-1042)"
        aria-label="Ticket code"
        spellCheck={false}
        autoComplete="off"
        className="flex-1 min-w-0 rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm uppercase tracking-wider text-slate-900 placeholder:text-slate-400 placeholder:normal-case placeholder:tracking-normal transition focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
        style={{ fontFamily: "var(--font-ibm-plex-mono), monospace" }}
      />
      <button
        id="search-ticket-btn"
        type="submit"
        disabled={isPending || !value.trim()}
        className="px-6 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 hover:brightness-105 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: "var(--color-accent-primary)",
          color: "#0B0F17",
          fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
        }}
      >
        {isPending ? (
          <>
            <svg className="animate-spin w-4 h-4 text-slate-950" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>Checking…</span>
          </>
        ) : (
          "Track"
        )}
      </button>
    </form>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function TrackTicketClient() {
  const [searchCode, setSearchCode] = useState("");
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<LookupResult | null>(null);

  function runLookup(code: string) {
    const normalised = code.replace(/\s+/g, "").toUpperCase();
    setSearchCode(normalised);
    if (!normalised) return;

    startTransition(async () => {
      setResult(null);
      const res = await lookupTicket(normalised);
      setResult(res);
    });
  }

  return (
    <div>
      {/* Search bar */}
      <SearchBar
        initialValue={searchCode}
        onSearch={runLookup}
        isPending={isPending}
      />

      {/* Recent tickets */}
      <RecentTickets onSelect={runLookup} />

      {/* Loading skeleton */}
      {isPending && (
        <div className="mt-6 rounded-xl border border-slate-200 p-5 bg-white animate-pulse shadow-xs">
          <div className="h-4 w-28 bg-slate-200 rounded mb-4" />
          <div className="space-y-2.5">
            <div className="h-3 w-full bg-slate-100 rounded" />
            <div className="h-3 w-3/4 bg-slate-100 rounded" />
            <div className="h-3 w-1/2 bg-slate-100 rounded" />
          </div>
        </div>
      )}

      {/* Not found / error */}
      {!isPending && result && !result.found && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-800"
        >
          <p className="font-bold">Ticket not found</p>
          <p className="mt-1 text-xs text-rose-700">{result.error}</p>
        </div>
      )}

      {/* Found ticket */}
      {!isPending && result?.found && (
        <TicketDetailCard ticket={result.ticket} />
      )}
    </div>
  );
}
