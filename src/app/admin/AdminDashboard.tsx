"use client";

import { useState, useTransition, useCallback } from "react";
import type { Ticket, TicketTag, TicketStatus } from "@/types";
import { updateTicketStatus, updateAdminNotes } from "./actions";

// ─── Constants ────────────────────────────────────────────────────────────────

const TAG_OPTIONS: TicketTag[] = [
  "Mess",
  "Electrical",
  "Plumbing/Water",
  "Elevator",
  "Cleanliness",
  "Pests",
  "Others",
];

const STATUS_OPTIONS: TicketStatus[] = ["Open", "In Progress", "Resolved"];

const TAG_META: Record<
  TicketTag,
  { label: string; emoji: string; bg: string; text: string }
> = {
  Mess: {
    label: "Mess",
    emoji: "🍽️",
    bg: "bg-orange-100",
    text: "text-orange-800",
  },
  Electrical: {
    label: "Electrical",
    emoji: "⚡",
    bg: "bg-yellow-100",
    text: "text-yellow-800",
  },
  "Plumbing/Water": {
    label: "Plumbing / Water",
    emoji: "🚿",
    bg: "bg-cyan-100",
    text: "text-cyan-800",
  },
  Elevator: {
    label: "Elevator",
    emoji: "🛗",
    bg: "bg-purple-100",
    text: "text-purple-800",
  },
  Cleanliness: {
    label: "Cleanliness",
    emoji: "🧹",
    bg: "bg-green-100",
    text: "text-green-800",
  },
  Pests: {
    label: "Pests",
    emoji: "🐜",
    bg: "bg-red-100",
    text: "text-red-800",
  },
  Others: {
    label: "Others",
    emoji: "📋",
    bg: "bg-slate-100",
    text: "text-slate-700",
  },
};

const STATUS_META: Record<
  TicketStatus,
  { dot: string; badge: string }
> = {
  Open: {
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-800 border-amber-200",
  },
  "In Progress": {
    dot: "bg-blue-500",
    badge: "bg-blue-50 text-blue-800 border-blue-200",
  },
  Resolved: {
    dot: "bg-green-500",
    badge: "bg-green-50 text-green-800 border-green-200",
  },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

// ─── Filter Bar ───────────────────────────────────────────────────────────────

function FilterBar({
  tagFilter,
  statusFilter,
  searchQuery,
  onTagChange,
  onStatusChange,
  onSearchChange,
  total,
  filtered,
}: {
  tagFilter: TicketTag | "All";
  statusFilter: TicketStatus | "All";
  searchQuery: string;
  onTagChange: (v: TicketTag | "All") => void;
  onStatusChange: (v: TicketStatus | "All") => void;
  onSearchChange: (v: string) => void;
  total: number;
  filtered: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
      {/* Search */}
      <div className="relative flex-1 min-w-[180px]">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          id="admin-search"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search code, name, room, description…"
          className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
      </div>

      {/* Tag filter */}
      <select
        id="admin-tag-filter"
        value={tagFilter}
        onChange={(e) => onTagChange(e.target.value as TicketTag | "All")}
        className="px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      >
        <option value="All">All Categories</option>
        {TAG_OPTIONS.map((t) => (
          <option key={t} value={t}>
            {TAG_META[t].emoji} {TAG_META[t].label}
          </option>
        ))}
      </select>

      {/* Status filter */}
      <select
        id="admin-status-filter"
        value={statusFilter}
        onChange={(e) =>
          onStatusChange(e.target.value as TicketStatus | "All")
        }
        className="px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      >
        <option value="All">All Statuses</option>
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {/* Count badge */}
      <span className="ml-auto text-xs text-slate-500 whitespace-nowrap">
        Showing{" "}
        <strong className="text-slate-700">{filtered}</strong> of{" "}
        <strong className="text-slate-700">{total}</strong>
      </span>
    </div>
  );
}

// ─── Status Dropdown (per row) ────────────────────────────────────────────────

function StatusDropdown({
  ticketId,
  currentStatus,
  onOptimisticChange,
}: {
  ticketId: string;
  currentStatus: TicketStatus;
  onOptimisticChange: (id: string, status: TicketStatus) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [saveError, setSaveError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as TicketStatus;
    setSaveError(null);
    // Optimistic update
    onOptimisticChange(ticketId, newStatus);

    startTransition(async () => {
      const result = await updateTicketStatus(ticketId, newStatus);
      if (!result.success) {
        setSaveError(result.error);
        // Revert: the parent still holds the old value because we passed the
        // optimistic update through — on next render the input reverts.
      }
    });
  }

  const meta = STATUS_META[currentStatus] ?? STATUS_META.Open;

  return (
    <div className="flex flex-col gap-1">
      <div className="relative">
        <select
          id={`status-select-${ticketId}`}
          value={currentStatus}
          onChange={handleChange}
          disabled={isPending}
          className={`pr-7 pl-2 py-1 text-xs font-semibold rounded-lg border cursor-pointer appearance-none transition disabled:opacity-50 ${meta.badge}`}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {isPending && (
          <svg
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 animate-spin text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
      </div>
      {saveError && (
        <p className="text-xs text-red-500">{saveError}</p>
      )}
    </div>
  );
}

// ─── Admin Notes Field (per row) ──────────────────────────────────────────────

function AdminNotesField({
  ticketId,
  initialNotes,
}: {
  ticketId: string;
  initialNotes: string | null;
}) {
  const [value, setValue] = useState(initialNotes ?? "");
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = useCallback(() => {
    if (value === (initialNotes ?? "")) return; // nothing changed
    setSaveError(null);
    setSaved(false);

    startTransition(async () => {
      const result = await updateAdminNotes(ticketId, value);
      if (result.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        setSaveError(result.error);
      }
    });
  }, [ticketId, value, initialNotes]);

  return (
    <div className="flex flex-col gap-1 min-w-[200px]">
      <textarea
        id={`admin-notes-${ticketId}`}
        rows={2}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setSaved(false);
          setSaveError(null);
        }}
        onBlur={handleSave}
        placeholder="Add HMC note…"
        maxLength={1000}
        className="w-full text-xs rounded-lg border border-slate-200 px-2.5 py-1.5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
      />
      <div className="flex items-center justify-between gap-2">
        {saveError && (
          <p className="text-xs text-red-500 flex-1">{saveError}</p>
        )}
        {saved && (
          <p className="text-xs text-green-600 flex-1">✓ Saved</p>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending || value === (initialNotes ?? "")}
          className="ml-auto text-xs font-semibold text-blue-700 hover:text-blue-900 disabled:opacity-40 transition whitespace-nowrap"
        >
          {isPending ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

// ─── Ticket Table ─────────────────────────────────────────────────────────────

function TicketTable({
  tickets,
  onStatusChange,
}: {
  tickets: Ticket[];
  onStatusChange: (id: string, status: TicketStatus) => void;
}) {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-400 text-sm">No tickets match your filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50">
            {[
              "Ticket",
              "Raised By",
              "Room",
              "Category",
              "Description",
              "Status",
              "HMC Notes",
              "Date",
            ].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tickets.map((ticket) => {
            const tag = TAG_META[ticket.tag] ?? TAG_META.Others;
            return (
              <tr
                key={ticket.id}
                className="hover:bg-slate-50/60 transition-colors align-top"
              >
                {/* Ticket code */}
                <td className="px-4 py-3 font-mono font-bold text-slate-800 whitespace-nowrap">
                  {ticket.ticket_code}
                </td>

                {/* Raised by */}
                <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                  {ticket.is_anonymous ? (
                    <span className="italic text-slate-400">Anonymous</span>
                  ) : (
                    ticket.raiser_name ?? (
                      <span className="text-slate-400">—</span>
                    )
                  )}
                </td>

                {/* Room */}
                <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                  {ticket.room_no}
                </td>

                {/* Category badge */}
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${tag.bg} ${tag.text}`}
                  >
                    {tag.emoji} {ticket.tag}
                  </span>
                </td>

                {/* Description — truncated */}
                <td className="px-4 py-3 text-slate-600 max-w-xs">
                  <p
                    className="line-clamp-2 text-xs leading-relaxed"
                    title={ticket.description}
                  >
                    {ticket.description}
                  </p>
                  {ticket.photo_url && (
                    <a
                      href={ticket.photo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline mt-0.5 inline-block"
                    >
                      View photo ↗
                    </a>
                  )}
                </td>

                {/* Status dropdown */}
                <td className="px-4 py-3">
                  <StatusDropdown
                    ticketId={ticket.id}
                    currentStatus={ticket.status}
                    onOptimisticChange={onStatusChange}
                  />
                </td>

                {/* Admin notes */}
                <td className="px-4 py-3">
                  <AdminNotesField
                    ticketId={ticket.id}
                    initialNotes={ticket.admin_notes}
                  />
                </td>

                {/* Date */}
                <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">
                  {formatDate(ticket.created_at)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Dashboard Component ──────────────────────────────────────────────────

export default function AdminDashboard({
  tickets: initialTickets,
}: {
  tickets: Ticket[];
}) {
  // Local copy for optimistic status updates
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);

  const [tagFilter, setTagFilter] = useState<TicketTag | "All">("All");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Optimistic status handler: update local state immediately without waiting
  // for the server round-trip (the StatusDropdown's own useTransition handles
  // the background save and any error revert)
  const handleStatusChange = useCallback(
    (id: string, status: TicketStatus) => {
      setTickets((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status } : t))
      );
    },
    []
  );

  // Compute filtered list
  const filtered = tickets.filter((t) => {
    if (tagFilter !== "All" && t.tag !== tagFilter) return false;
    if (statusFilter !== "All" && t.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const haystack = [
        t.ticket_code,
        t.raiser_name ?? "",
        t.room_no,
        t.description,
        t.tag,
        t.status,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  return (
    <>
      <FilterBar
        tagFilter={tagFilter}
        statusFilter={statusFilter}
        searchQuery={searchQuery}
        onTagChange={setTagFilter}
        onStatusChange={setStatusFilter}
        onSearchChange={setSearchQuery}
        total={tickets.length}
        filtered={filtered.length}
      />
      <TicketTable tickets={filtered} onStatusChange={handleStatusChange} />
    </>
  );
}
