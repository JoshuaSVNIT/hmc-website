"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import { lookupTicket, type LookupResult } from "./actions";
import type { Ticket, TicketStatus, TicketTag } from "@/types";

// ─── Tag & Status helpers ─────────────────────────────────────────────────────

const TAG_META: Record<TicketTag, { label: string; emoji: string; bg: string; text: string }> = {
  Mess:            { label: "Mess",             emoji: "🍽️", bg: "bg-orange-100", text: "text-orange-800" },
  Electrical:      { label: "Electrical",        emoji: "⚡",  bg: "bg-yellow-100", text: "text-yellow-800" },
  "Plumbing/Water":{ label: "Plumbing / Water",  emoji: "🚿", bg: "bg-cyan-100",   text: "text-cyan-800"   },
  Elevator:        { label: "Elevator",           emoji: "🛗", bg: "bg-purple-100", text: "text-purple-800" },
  Cleanliness:     { label: "Cleanliness",        emoji: "🧹", bg: "bg-green-100",  text: "text-green-800"  },
  Pests:           { label: "Pests",              emoji: "🐜", bg: "bg-red-100",    text: "text-red-800"    },
  Others:          { label: "Others",             emoji: "📋", bg: "bg-slate-100",  text: "text-slate-700"  },
};

const STATUS_META: Record<TicketStatus, { label: string; dot: string; badge: string }> = {
  Open:          { label: "Open",        dot: "bg-amber-400",  badge: "bg-amber-50  text-amber-800  border-amber-300" },
  "In Progress": { label: "In Progress", dot: "bg-blue-500",   badge: "bg-blue-50   text-blue-800   border-blue-300" },
  Resolved:      { label: "Resolved",    dot: "bg-green-500",  badge: "bg-green-50  text-green-800  border-green-300" },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

// ─── Ticket Detail Card ───────────────────────────────────────────────────────

function TicketDetailCard({ ticket }: { ticket: Ticket }) {
  const tag    = TAG_META[ticket.tag]    ?? TAG_META.Others;
  const status = STATUS_META[ticket.status] ?? STATUS_META.Open;

  function handlePrint() {
    window.print();
  }

  return (
    <div className="mt-6 space-y-0">
      {/* Print-only header */}
      <div className="hidden print:block mb-6">
        <h1 className="text-2xl font-bold text-black">Swami Vivekanand Bhavan HMC</h1>
        <p className="text-sm text-gray-600 mt-0.5">Hostel Management Committee — Complaint Ticket</p>
        <hr className="my-3 border-black" />
      </div>

      {/* Detail card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Header row */}
        <div className="px-6 py-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-2xl font-extrabold tracking-widest text-slate-900 print:text-black">
              {ticket.ticket_code}
            </span>
            <span
              className={`print:hidden inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${status.badge}`}
            >
              <span className={`w-2 h-2 rounded-full ${status.dot}`} />
              {status.label}
            </span>
          </div>

          {/* Print-only status */}
          <div className="hidden print:block text-sm font-bold text-black">
            Status: {status.label}
          </div>

          {/* Print button — screen only */}
          <button
            id="print-ticket-btn"
            onClick={handlePrint}
            className="print:hidden flex items-center gap-2 px-3 py-1.5 text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Ticket
          </button>
        </div>

        {/* Fields */}
        <dl className="divide-y divide-slate-100">
          <Row label="Category">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-sm font-semibold ${tag.bg} ${tag.text}`}>
              {tag.emoji} {tag.label}
            </span>
          </Row>

          <Row label="Room No.">{ticket.room_no}</Row>

          <Row label="Description">
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
              {ticket.description}
            </p>
          </Row>

          {ticket.admin_notes && (
            <Row label="HMC Note">
              <div className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5 shrink-0">💬</span>
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {ticket.admin_notes}
                </p>
              </div>
            </Row>
          )}

          {ticket.photo_url && (
            <Row label="Attached Photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ticket.photo_url}
                alt="Ticket photo"
                className="h-40 rounded-xl border border-slate-200 object-cover shadow-sm"
              />
            </Row>
          )}

          <Row label="Submitted">
            {formatDate(ticket.created_at)}
          </Row>

          <Row label="Last Updated">
            {formatDate(ticket.updated_at)}
          </Row>

          <Row label="Submitted by">
            {ticket.is_anonymous
              ? <span className="text-slate-400 italic">Anonymous</span>
              : (ticket.raiser_name ?? <span className="text-slate-400 italic">—</span>)
            }
          </Row>
        </dl>
      </div>

      {/* Print-only footer */}
      <div className="hidden print:block mt-6 text-xs text-gray-500">
        <p>Track this ticket at <strong>svbhavan.in/track-ticket</strong> using code: <strong>{ticket.ticket_code}</strong></p>
        <p className="mt-1">Printed: {new Date().toLocaleString("en-IN")}</p>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="px-6 py-4 grid grid-cols-[140px_1fr] gap-4 items-start text-sm">
      <dt className="font-semibold text-slate-500 print:text-black">{label}</dt>
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
  // §7: Read localStorage ONLY inside useEffect — never during initial render
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
      // localStorage unavailable — silently hide section
    }
  }, []);

  // §7: Hide entirely when no recent codes (no empty state shown)
  if (recentCodes.length === 0) return null;

  return (
    <div className="mt-8 print:hidden">
      <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
        Recent Tickets (this device)
      </h2>
      <div className="flex flex-wrap gap-2">
        {recentCodes.map((code) => (
          <button
            key={code}
            id={`recent-ticket-${code}`}
            onClick={() => onSelect(code)}
            className="px-3 py-1.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-800 rounded-lg text-sm font-mono font-semibold transition-colors shadow-sm"
          >
            {code}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-400">
        These codes are saved only on this device. Tap one to look it up instantly.
      </p>
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

  // Sync when parent sets a code from recent-tickets click
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
        placeholder="e.g. HMC-1042"
        aria-label="Ticket code"
        spellCheck={false}
        autoComplete="off"
        className="flex-1 min-w-0 rounded-xl border border-slate-300 px-4 py-3 text-sm font-mono tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder:normal-case placeholder:tracking-normal placeholder:font-sans"
      />
      <button
        id="search-ticket-btn"
        type="submit"
        disabled={isPending || !value.trim()}
        className="px-5 py-3 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white rounded-xl font-semibold text-sm transition-colors flex items-center gap-2 shrink-0"
      >
        {isPending ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="hidden sm:inline">Looking up…</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="hidden sm:inline">Track</span>
          </>
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
    // Strip ALL internal whitespace then uppercase — e.g. "hmc- 1234" → "HMC-1234"
    const normalised = code.replace(/\s+/g, "").toUpperCase();
    setSearchCode(normalised);
    if (!normalised) return;

    startTransition(async () => {
      setResult(null);
      const res = await lookupTicket(normalised);
      // Log to BROWSER console so result is visible without opening the terminal
      console.log("Track-ticket result:", res);
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

      {/* Recent tickets — reads localStorage after mount only (§7) */}
      <RecentTickets onSelect={runLookup} />

      {/* Loading skeleton */}
      {isPending && (
        <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-6 animate-pulse">
          <div className="h-5 w-32 bg-slate-200 rounded mb-4" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-slate-100 rounded" />
            <div className="h-4 w-3/4 bg-slate-100 rounded" />
            <div className="h-4 w-1/2 bg-slate-100 rounded" />
          </div>
        </div>
      )}

      {/* Not found / error */}
      {!isPending && result && !result.found && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-4 text-sm text-red-800"
        >
          <svg className="w-5 h-5 shrink-0 mt-0.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-semibold">Ticket not found</p>
            <p className="mt-0.5 text-red-700">{result.error}</p>
          </div>
        </div>
      )}

      {/* Found ticket */}
      {!isPending && result?.found && (
        <TicketDetailCard ticket={result.ticket} />
      )}
    </div>
  );
}
