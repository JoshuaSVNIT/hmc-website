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
        bg: "rgba(47,79,62,0.12)",
        text: "var(--color-accent-secondary)",
        border: "rgba(47,79,62,0.3)",
        dot: "var(--color-accent-secondary)",
      };
    case "In Progress":
      return {
        bg: "rgba(184,134,11,0.12)",
        text: "var(--color-accent-primary-600)",
        border: "rgba(184,134,11,0.3)",
        dot: "var(--color-accent-primary)",
      };
    case "Open":
    default:
      return {
        bg: "rgba(31,27,22,0.08)",
        text: "var(--color-ink)",
        border: "rgba(31,27,22,0.2)",
        dot: "var(--color-ink-500)",
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
      <div
        className="rounded border overflow-hidden"
        style={{
          backgroundColor: "#fff",
          borderColor: "rgba(31,27,22,0.12)",
        }}
      >
        {/* Header row */}
        <div
          className="px-5 py-4 border-b flex flex-wrap items-center justify-between gap-3"
          style={{ borderColor: "rgba(31,27,22,0.08)" }}
        >
          <div className="flex items-center gap-3">
            <span
              className="text-xl sm:text-2xl font-bold tracking-wider"
              style={{
                fontFamily: "var(--font-ibm-plex-mono), monospace",
                color: "var(--color-ink)",
              }}
            >
              {ticket.ticket_code}
            </span>
            <span
              className="print:hidden inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold border"
              style={{
                backgroundColor: statusStyle.bg,
                color: statusStyle.text,
                borderColor: statusStyle.border,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
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
            className="print:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border transition-colors"
            style={{
              borderColor: "rgba(31,27,22,0.2)",
              backgroundColor: "#fff",
              color: "var(--color-ink)",
            }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>
        </div>

        {/* Fields */}
        <dl className="divide-y" style={{ borderColor: "rgba(31,27,22,0.06)" }}>
          <Row label="Category">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium">
              <span>{tag.emoji}</span>
              <span>{tag.label}</span>
            </span>
          </Row>

          <Row label="Room Number">
            <span
              className="text-sm font-semibold"
              style={{ fontFamily: "var(--font-ibm-plex-mono), monospace" }}
            >
              {ticket.room_no || "—"}
            </span>
          </Row>

          <Row label="Description">
            <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--color-ink)" }}>
              {ticket.description}
            </p>
          </Row>

          {ticket.admin_notes && (
            <Row label="HMC Committee Note">
              <div
                className="p-3 rounded border text-sm"
                style={{
                  backgroundColor: "rgba(184,134,11,0.06)",
                  borderColor: "rgba(184,134,11,0.2)",
                  color: "var(--color-ink)",
                }}
              >
                <div className="font-semibold text-xs mb-1" style={{ color: "var(--color-accent-primary-600)" }}>
                  Update from Supervisor / Committee:
                </div>
                <p className="leading-relaxed whitespace-pre-wrap">{ticket.admin_notes}</p>
              </div>
            </Row>
          )}

          {ticket.photo_url && (
            <Row label="Attached Photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ticket.photo_url}
                alt="Ticket attachment"
                className="h-36 rounded border object-cover"
                style={{ borderColor: "rgba(31,27,22,0.15)" }}
              />
            </Row>
          )}

          <Row label="Logged At">
            <span
              className="text-xs"
              style={{
                fontFamily: "var(--font-ibm-plex-mono), monospace",
                color: "var(--color-ink-500)",
              }}
            >
              {formatDate(ticket.created_at)}
            </span>
          </Row>

          <Row label="Last Update">
            <span
              className="text-xs"
              style={{
                fontFamily: "var(--font-ibm-plex-mono), monospace",
                color: "var(--color-ink-500)",
              }}
            >
              {formatDate(ticket.updated_at)}
            </span>
          </Row>

          <Row label="Reported By">
            {ticket.is_anonymous ? (
              <span className="text-xs italic" style={{ color: "var(--color-ink-400)" }}>
                Anonymous resident
              </span>
            ) : (
              <span className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>
                {ticket.raiser_name ?? "—"}
              </span>
            )}
          </Row>

          {ticket.phone_no && !ticket.is_anonymous && (
            <Row label="Contact Phone">
              <span
                className="text-xs font-semibold"
                style={{
                  fontFamily: "var(--font-ibm-plex-mono), monospace",
                  color: "var(--color-ink)",
                }}
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
      <dt className="text-xs font-medium pt-0.5 print:text-black" style={{ color: "var(--color-ink-400)" }}>
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
    <div className="mt-6 pt-5 border-t print:hidden" style={{ borderColor: "rgba(31,27,22,0.08)" }}>
      <h2 className="text-xs font-medium mb-2.5" style={{ color: "var(--color-ink-400)" }}>
        Recent tickets on this device
      </h2>
      <div className="flex flex-wrap gap-2">
        {recentCodes.map((code) => (
          <button
            key={code}
            id={`recent-ticket-${code}`}
            type="button"
            onClick={() => onSelect(code)}
            className="px-2.5 py-1 bg-white border rounded text-xs font-semibold transition-colors cursor-pointer"
            style={{
              borderColor: "rgba(31,27,22,0.18)",
              fontFamily: "var(--font-ibm-plex-mono), monospace",
              color: "var(--color-ink)",
            }}
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
        placeholder="Enter code (e.g. HMC-1042)"
        aria-label="Ticket code"
        spellCheck={false}
        autoComplete="off"
        className="flex-1 min-w-0 rounded border px-3.5 py-2.5 text-sm uppercase tracking-wider transition focus:outline-none focus:ring-1"
        style={{
          borderColor: "rgba(31,27,22,0.2)",
          backgroundColor: "#fff",
          fontFamily: "var(--font-ibm-plex-mono), monospace",
          color: "var(--color-ink)",
        }}
      />
      <button
        id="search-ticket-btn"
        type="submit"
        disabled={isPending || !value.trim()}
        className="px-5 py-2.5 rounded font-semibold text-sm transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: "var(--color-accent-primary)",
          color: "var(--color-ink)",
          fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
        }}
      >
        {isPending ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
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
        <div className="mt-6 rounded border p-5 animate-pulse" style={{ borderColor: "rgba(31,27,22,0.1)" }}>
          <div className="h-4 w-28 bg-gray-200 rounded mb-4" />
          <div className="space-y-2.5">
            <div className="h-3 w-full bg-gray-100 rounded" />
            <div className="h-3 w-3/4 bg-gray-100 rounded" />
            <div className="h-3 w-1/2 bg-gray-100 rounded" />
          </div>
        </div>
      )}

      {/* Not found / error */}
      {!isPending && result && !result.found && (
        <div
          role="alert"
          className="mt-6 rounded border p-4 text-sm"
          style={{
            backgroundColor: "rgba(179,63,46,0.06)",
            borderColor: "rgba(179,63,46,0.25)",
            color: "var(--color-accent-urgent)",
          }}
        >
          <p className="font-semibold">Ticket not found</p>
          <p className="mt-1 text-xs" style={{ color: "var(--color-ink-500)" }}>{result.error}</p>
        </div>
      )}

      {/* Found ticket */}
      {!isPending && result?.found && (
        <TicketDetailCard ticket={result.ticket} />
      )}
    </div>
  );
}
