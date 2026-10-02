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
  { label: string; emoji: string }
> = {
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
      };
    case "In Progress":
      return {
        bg: "#fffbeb",
        text: "#92400e",
        border: "#fde68a",
      };
    case "Open":
    default:
      return {
        bg: "#f1f5f9",
        text: "#334155",
        border: "#cbd5e1",
      };
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    dateStyle: "short",
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
    <div className="flex flex-wrap items-center gap-3 mb-6 p-3 sm:p-4 rounded-xl border border-slate-200/90 bg-white shadow-xs">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <input
          id="admin-search"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search ticket code, raiser, room, or problem…"
          className="w-full pl-3 pr-3 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 transition focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
        />
      </div>

      {/* Tag filter */}
      <select
        id="admin-tag-filter"
        value={tagFilter}
        onChange={(e) => onTagChange(e.target.value as TicketTag | "All")}
        className="px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white text-slate-800 transition focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
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
        className="px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white text-slate-800 transition focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
      >
        <option value="All">All Statuses</option>
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {/* Count badge */}
      <span
        className="ml-auto text-xs shrink-0 text-slate-500"
        style={{
          fontFamily: "var(--font-ibm-plex-mono), monospace",
        }}
      >
        Showing <strong className="text-slate-900">{filtered}</strong> of{" "}
        <strong className="text-slate-900">{total}</strong>
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
    onOptimisticChange(ticketId, newStatus);

    startTransition(async () => {
      const result = await updateTicketStatus(ticketId, newStatus);
      if (!result.success) {
        setSaveError(result.error);
      }
    });
  }

  const style = getStatusStyle(currentStatus);

  return (
    <div className="flex flex-col gap-1">
      <div className="relative inline-block">
        <select
          id={`status-select-${ticketId}`}
          value={currentStatus}
          onChange={handleChange}
          disabled={isPending}
          className="pr-6 pl-2.5 py-1 text-xs font-bold rounded-lg border cursor-pointer transition disabled:opacity-50"
          style={{
            backgroundColor: style.bg,
            color: style.text,
            borderColor: style.border,
          }}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      {saveError && (
        <p className="text-[11px] text-rose-600 font-medium">
          {saveError}
        </p>
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
    if (value === (initialNotes ?? "")) return;
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
    <div className="flex flex-col gap-1 min-w-[180px]">
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
        placeholder="Add resolution or update notes…"
        maxLength={1000}
        className="w-full text-xs rounded-lg border border-slate-300 bg-white px-2 py-1 text-slate-800 resize-none transition focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
      />
      <div className="flex items-center justify-between gap-2 text-[11px]">
        {saveError && (
          <p className="flex-1 text-rose-600 font-medium">{saveError}</p>
        )}
        {saved && (
          <p className="flex-1 font-bold text-emerald-700">Saved</p>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending || value === (initialNotes ?? "")}
          className="ml-auto font-bold text-amber-700 hover:text-amber-900 disabled:opacity-40 transition cursor-pointer"
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
      <div className="text-center py-16 rounded-xl border border-slate-200 bg-white shadow-xs">
        <p className="text-sm font-medium text-slate-500">
          No tickets match your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white shadow-sm overflow-x-auto">
      <table className="min-w-full text-xs sm:text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80">
            {[
              "Ticket",
              "Raised by",
              "Room",
              "Phone",
              "Category",
              "Description",
              "Status",
              "HMC notes",
              "Logged",
            ].map((h) => (
              <th
                key={h}
                className="px-3.5 py-3 text-left text-xs font-bold text-slate-700 whitespace-nowrap"
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
                className="hover:bg-amber-50/20 transition-colors align-top"
              >
                {/* Ticket code */}
                <td
                  className="px-3.5 py-3 font-bold whitespace-nowrap text-slate-900"
                  style={{
                    fontFamily: "var(--font-ibm-plex-mono), monospace",
                  }}
                >
                  {ticket.ticket_code}
                </td>

                {/* Raised by */}
                <td className="px-3.5 py-3 whitespace-nowrap text-slate-800">
                  {ticket.is_anonymous ? (
                    <span className="italic text-xs text-slate-400">
                      Anonymous
                    </span>
                  ) : (
                    <span className="font-medium">{ticket.raiser_name ?? "—"}</span>
                  )}
                </td>

                {/* Room */}
                <td
                  className="px-3.5 py-3 font-bold whitespace-nowrap text-slate-900"
                  style={{
                    fontFamily: "var(--font-ibm-plex-mono), monospace",
                  }}
                >
                  {ticket.room_no || "—"}
                </td>

                {/* Phone */}
                <td
                  className="px-3.5 py-3 whitespace-nowrap text-xs font-bold text-slate-800"
                  style={{
                    fontFamily: "var(--font-ibm-plex-mono), monospace",
                  }}
                >
                  {ticket.phone_no ? (
                    <a
                      href={`tel:${ticket.phone_no.replace(/[\s\-().]/g, "")}`}
                      className="hover:underline text-amber-700 font-bold"
                    >
                      {ticket.phone_no}
                    </a>
                  ) : (
                    <span className="text-slate-300 font-normal">—</span>
                  )}
                </td>

                {/* Category */}
                <td className="px-3.5 py-3 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-800">
                    <span>{tag.emoji}</span>
                    <span>{tag.label}</span>
                  </span>
                </td>

                {/* Description */}
                <td className="px-3.5 py-3 max-w-xs text-slate-600">
                  <p className="line-clamp-2 text-xs leading-relaxed" title={ticket.description}>
                    {ticket.description}
                  </p>
                  {ticket.photo_url && (
                    <a
                      href={ticket.photo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs hover:underline mt-0.5 inline-block font-bold text-amber-700"
                    >
                      View photo ↗
                    </a>
                  )}
                </td>

                {/* Status dropdown */}
                <td className="px-3.5 py-3">
                  <StatusDropdown
                    ticketId={ticket.id}
                    currentStatus={ticket.status}
                    onOptimisticChange={onStatusChange}
                  />
                </td>

                {/* Admin notes */}
                <td className="px-3.5 py-3">
                  <AdminNotesField
                    ticketId={ticket.id}
                    initialNotes={ticket.admin_notes}
                  />
                </td>

                {/* Date */}
                <td
                  className="px-3.5 py-3 text-xs whitespace-nowrap text-slate-500 font-medium"
                  style={{
                    fontFamily: "var(--font-ibm-plex-mono), monospace",
                  }}
                >
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

// ─── Main Admin Dashboard Component ───────────────────────────────────────────

export default function AdminDashboard({ tickets }: { tickets: Ticket[] }) {
  const [ticketList, setTicketList] = useState<Ticket[]>(tickets);
  const [tagFilter, setTagFilter] = useState<TicketTag | "All">("All");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");

  const handleStatusChange = useCallback((id: string, newStatus: TicketStatus) => {
    setTicketList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  }, []);

  const filtered = ticketList.filter((t) => {
    if (tagFilter !== "All" && t.tag !== tagFilter) return false;
    if (statusFilter !== "All" && t.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCode = t.ticket_code.toLowerCase().includes(q);
      const matchRaiser = (t.raiser_name ?? "").toLowerCase().includes(q);
      const matchRoom = (t.room_no ?? "").toLowerCase().includes(q);
      const matchPhone = (t.phone_no ?? "").toLowerCase().includes(q);
      const matchDesc = (t.description ?? "").toLowerCase().includes(q);
      if (!matchCode && !matchRaiser && !matchRoom && !matchPhone && !matchDesc) return false;
    }
    return true;
  });

  return (
    <div>
      <FilterBar
        tagFilter={tagFilter}
        statusFilter={statusFilter}
        searchQuery={searchQuery}
        onTagChange={setTagFilter}
        onStatusChange={setStatusFilter}
        onSearchChange={setSearchQuery}
        total={ticketList.length}
        filtered={filtered.length}
      />

      <TicketTable
        tickets={filtered}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
