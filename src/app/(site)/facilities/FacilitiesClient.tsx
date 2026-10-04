"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { SanityCommonRoom } from "@/lib/sanity/queries";
import { urlFor } from "@/sanity/lib/image";
import { BuildingIcon, WrenchIcon, PhoneIcon } from "@/components/icons";

export type FacilityCategory = "All" | "Laundry" | "Sports" | "Study Room";

const FLOORS = [2, 3, 4, 5, 6, 7, 8];
const WINGS = ["A", "B", "C"];

const FILTERS: { id: FacilityCategory; label: string }[] = [
  { id: "All", label: "All" },
  { id: "Laundry", label: "Laundry" },
  { id: "Sports", label: "Sports" },
  { id: "Study Room", label: "Study Room" },
];

export function getRoomCategory(
  label?: string | null
): "Laundry" | "Study Room" | "Sports" | "Unassigned" {
  if (!label || label.trim().length === 0) {
    return "Unassigned";
  }
  const lower = label.trim().toLowerCase();
  if (lower.includes("laundry")) {
    return "Laundry";
  }
  if (lower.includes("study")) {
    return "Study Room";
  }
  // Any other NON-EMPTY label is classified as Sports (catch-all default category)
  return "Sports";
}

export function matchesFilter(
  room: SanityCommonRoom | undefined,
  filter: FacilityCategory
): boolean {
  if (filter === "All") return true;
  // An EMPTY label ("not yet allotted") is never shown when any specific filter is active
  if (!room?.label || room.label.trim().length === 0) return false;
  return getRoomCategory(room.label) === filter;
}

export default function FacilitiesClient({
  commonRooms,
}: {
  commonRooms: SanityCommonRoom[];
}) {
  const [activeFilter, setActiveFilter] = useState<FacilityCategory>("All");

  // Create a fast lookup map: `${floor}-${wing}` -> SanityCommonRoom
  const roomMap = useMemo(() => {
    const map = new Map<string, SanityCommonRoom>();
    for (const room of commonRooms) {
      if (room.floor != null && room.wing) {
        map.set(`${Number(room.floor)}-${room.wing.trim().toUpperCase()}`, room);
      }
    }
    return map;
  }, [commonRooms]);

  // Calculate counts for each filter category
  const counts = useMemo(() => {
    const result: Record<FacilityCategory, number> = {
      All: 0,
      Laundry: 0,
      Sports: 0,
      "Study Room": 0,
    };

    for (const floor of FLOORS) {
      for (const wing of WINGS) {
        const room = roomMap.get(`${floor}-${wing}`);
        result.All += 1;
        if (room?.label && room.label.trim().length > 0) {
          const category = getRoomCategory(room.label);
          if (category === "Laundry") result.Laundry += 1;
          else if (category === "Study Room") result["Study Room"] += 1;
          else if (category === "Sports") result.Sports += 1;
        }
      }
    }

    return result;
  }, [roomMap]);

  // Filter floors based on whether they contain any matching rooms
  const matchingFloors = useMemo(() => {
    return FLOORS.filter((floor) => {
      if (activeFilter === "All") return true;
      return WINGS.some((wing) => {
        const room = roomMap.get(`${floor}-${wing}`);
        return matchesFilter(room, activeFilter);
      });
    });
  }, [activeFilter, roomMap]);

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* ── Category Filters (Visible on mobile and desktop) ── */}
      <div className="flex items-center gap-2 flex-wrap">
        {FILTERS.map((f) => {
          const active = activeFilter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFilter(f.id)}
              className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
                active
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                  : "bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border-slate-200/90 shadow-2xs"
              }`}
            >
              <span>{f.label}</span>
              <span
                className={`text-[11px] font-mono px-1.5 py-0.5 rounded-md ${
                  active
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {counts[f.id]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Empty State when no rooms match filter */}
      {matchingFloors.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
          <span className="text-4xl mb-3 block" role="img" aria-label="No facilities icon">
            🔍
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mb-1">
            No &ldquo;{activeFilter}&rdquo; facilities found
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto mb-4">
            There are currently no common rooms categorized as {activeFilter} across Swami Vivekanand Bhavan.
          </p>
          <button
            type="button"
            onClick={() => setActiveFilter("All")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
          >
            Show All Facilities
          </button>
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-8">
          {/* Desktop Wing Legend Bar (Hidden on Mobile) */}
          <div className="hidden sm:grid grid-cols-12 gap-4 pb-2 border-b border-ink/10 text-xs font-bold uppercase tracking-wider text-ink-500 font-mono">
            <div className="col-span-3 lg:col-span-2">Floor</div>
            <div className="col-span-3 lg:col-span-3">Wing A</div>
            <div className="col-span-3 lg:col-span-3">Wing B</div>
            <div className="col-span-3 lg:col-span-4">Wing C</div>
          </div>

          {/* Floors List */}
          {matchingFloors.map((floor) => {
            const floorWings =
              activeFilter === "All"
                ? WINGS
                : WINGS.filter((wing) =>
                    matchesFilter(roomMap.get(`${floor}-${wing}`), activeFilter)
                  );

            return (
              <section
                key={floor}
                className="card-surface p-4 sm:p-6 border border-ink/5 shadow-xs"
                aria-label={`Floor ${floor} Common Rooms`}
              >
                {/* ── DESKTOP & TABLET VIEW (sm+) — Existing Grid of Cards ── */}
                <div className="hidden sm:flex sm:flex-col lg:flex-row lg:items-start gap-5">
                  {/* Floor Label Badge */}
                  <div className="lg:w-36 shrink-0 flex items-center lg:flex-col lg:items-start justify-between border-b lg:border-b-0 lg:border-r border-ink/5 pb-3 lg:pb-0 lg:pr-4">
                    <div>
                      <span className="inline-block text-xs font-bold font-mono text-accent-primary bg-accent-primary-50 border border-accent-primary-100 px-2.5 py-0.5 rounded-full mb-1">
                        Level {floor}
                      </span>
                      <h2 className="font-display text-xl sm:text-2xl font-bold text-ink">
                        Floor {floor}
                      </h2>
                    </div>
                    <span className="text-xs text-ink-500 font-medium font-mono">
                      {floorWings.length} {floorWings.length === 1 ? "Wing" : "Wings"}
                    </span>
                  </div>

                  {/* Wings Grid */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {floorWings.map((wing) => {
                      const room = roomMap.get(`${floor}-${wing}`);
                      const hasLabel = Boolean(room?.label && room.label.trim().length > 0);
                      const label = hasLabel ? room!.label.trim() : "Not yet allotted";
                      const imageUrl = (room?.image?.asset?._ref || room?.image?.asset)
                        ? urlFor(room.image).width(150).auto("format").url()
                        : null;
                      const iconEmoji = room?.icon?.trim() || null;
                      const hasContact = Boolean(room?.contactName?.trim() || room?.contactPhone?.trim());

                      return (
                        <div
                          key={wing}
                          className={`flex flex-col rounded-xl overflow-hidden transition-all ${
                            hasLabel
                              ? "border border-ink/10 bg-paper/50 hover:border-accent-primary/40 hover:bg-paper shadow-2xs"
                              : "border border-dashed border-slate-200 bg-slate-50/50"
                          }`}
                        >
                          {/* Image or Icon Banner */}
                          <div className="relative h-28 sm:h-32 w-full bg-slate-900/5 flex items-center justify-center overflow-hidden">
                            {imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={imageUrl}
                                alt={`${label} (Floor ${floor}, Wing ${wing})`}
                                className="w-full h-full object-cover"
                              />
                            ) : iconEmoji ? (
                              <div className="flex flex-col items-center justify-center p-3 text-center">
                                <span className="text-3xl select-none" role="img" aria-label="Room icon">
                                  {iconEmoji}
                                </span>
                                <span className="text-xs text-ink-500 mt-1 uppercase tracking-wider font-mono font-medium">
                                  Wing {wing}
                                </span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center p-3 text-center">
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    hasLabel ? "bg-accent-primary/10 text-accent-primary" : "bg-slate-200/60 text-slate-400"
                                  }`}
                                >
                                  <BuildingIcon size={20} />
                                </div>
                                <span
                                  className={`text-xs mt-1.5 uppercase tracking-wider font-mono font-normal ${
                                    hasLabel ? "text-ink-500" : "text-slate-400"
                                  }`}
                                >
                                  Wing {wing}
                                </span>
                              </div>
                            )}

                            {/* Wing Badge Overlay */}
                            <span
                              className={`absolute top-2 left-2 backdrop-blur-xs text-xs font-bold px-2.5 py-0.5 rounded font-mono ${
                                hasLabel ? "bg-slate-900/80 text-white" : "bg-slate-800/60 text-slate-200"
                              }`}
                            >
                              Wing {wing}
                            </span>
                          </div>

                          {/* Body */}
                          <div className="p-4 flex-1 flex flex-col justify-between gap-2.5">
                            <div>
                              <h3
                                className={`text-base font-bold leading-snug ${
                                  hasLabel ? "text-ink" : "text-slate-400 italic font-medium"
                                }`}
                              >
                                {label}
                              </h3>
                              <p
                                className={`text-xs mt-1 font-normal ${
                                  hasLabel ? "text-ink-500" : "text-slate-400 font-mono"
                                }`}
                              >
                                Floor {floor} · Wing {wing}
                              </p>
                            </div>

                            {/* Contact info if present */}
                            {hasContact && (
                              <div className="pt-2.5 border-t border-ink/5 text-xs space-y-1 text-ink-600">
                                {room?.contactName?.trim() && (
                                  <div className="font-normal text-ink truncate">
                                    Incharge: {room.contactName.trim()}
                                  </div>
                                )}
                                {room?.contactPhone?.trim() && (
                                  <a
                                    href={`tel:${room.contactPhone.trim().replace(/[\s\-().]/g, "")}`}
                                    className="inline-flex items-center gap-1.5 text-accent-primary font-mono font-semibold hover:underline"
                                  >
                                    <PhoneIcon size={13} />
                                    {room.contactPhone.trim()}
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── MOBILE VIEW (< sm) — Compact "Thick" List Rows ── */}
                <div className="sm:hidden space-y-3">
                  {/* Floor Heading as section divider */}
                  <div className="flex items-center justify-between pb-2 border-b border-ink/5">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold font-mono text-accent-primary bg-accent-primary-50 border border-accent-primary-100 px-2 py-0.5 rounded-full">
                        Level {floor}
                      </span>
                      <h2 className="font-display text-lg font-bold text-ink">
                        Floor {floor}
                      </h2>
                    </div>
                    <span className="text-xs text-ink-500 font-mono">
                      {floorWings.length} {floorWings.length === 1 ? "Wing" : "Wings"}
                    </span>
                  </div>

                  {/* Three thick list rows stacked vertically */}
                  <div className="space-y-2">
                    {floorWings.map((wing) => {
                      const room = roomMap.get(`${floor}-${wing}`);
                      const hasLabel = Boolean(room?.label && room.label.trim().length > 0);
                      const label = hasLabel ? room!.label.trim() : "Not yet allotted";
                      const imageUrl = (room?.image?.asset?._ref || room?.image?.asset)
                        ? urlFor(room.image).width(80).auto("format").url()
                        : null;
                      const iconEmoji = room?.icon?.trim() || null;

                      return (
                        <div
                          key={wing}
                          className={`flex items-center gap-3 py-3 px-3.5 rounded-xl border transition-all ${
                            hasLabel
                              ? "border-slate-200/90 bg-white shadow-2xs"
                              : "border-dashed border-slate-200 bg-slate-50/70"
                          }`}
                        >
                          {/* 1. Small cropped square thumbnail (or icon emoji fallback) */}
                          <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-slate-100 border border-slate-200/80 flex items-center justify-center">
                            {imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={imageUrl}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : iconEmoji ? (
                              <span className="text-2xl select-none" role="img" aria-label="Room icon">
                                {iconEmoji}
                              </span>
                            ) : (
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  hasLabel ? "bg-accent-primary/10 text-accent-primary" : "bg-slate-200/60 text-slate-400"
                                }`}
                              >
                                <BuildingIcon size={16} />
                              </div>
                            )}
                          </div>

                          {/* 2. Room's title/label */}
                          <div className="flex-1 min-w-0 pr-2">
                            <span
                              className={`text-sm font-semibold truncate block ${
                                hasLabel ? "text-ink" : "text-slate-400 italic font-medium"
                              }`}
                            >
                              {label}
                            </span>
                            {room?.contactPhone && (
                              <a
                                href={`tel:${room.contactPhone.trim().replace(/[\s\-().]/g, "")}`}
                                className="text-[11px] text-accent-primary font-mono inline-flex items-center gap-1 mt-0.5 hover:underline"
                              >
                                <PhoneIcon size={11} />
                                {room.contactPhone.trim()}
                              </a>
                            )}
                          </div>

                          {/* 3. Wing letter */}
                          <span
                            className={`shrink-0 text-xs font-bold font-mono px-2.5 py-1 rounded-md border ${
                              hasLabel
                                ? "bg-slate-900 text-white border-slate-900"
                                : "bg-slate-100 text-slate-500 border-slate-200"
                            }`}
                          >
                            Wing {wing}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Maintenance / Complaint Callout */}
      <div className="rounded-2xl border border-blue-200/90 bg-gradient-to-r from-blue-50/70 via-blue-50/30 to-white p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3.5">
          <span className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
            <WrenchIcon size={20} />
          </span>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-ink">
              Common Room Maintenance &amp; Equipment
            </h2>
            <p className="text-xs text-ink-600 mt-0.5">
              Notice any damaged furniture, lighting issues, or sports gear requirements in common spaces?
            </p>
          </div>
        </div>
        <Link
          href="/raise-ticket"
          className="shrink-0 px-4 py-2.5 rounded-full bg-ink text-gold font-bold text-xs sm:text-sm hover:brightness-110 transition-all shadow-sm"
        >
          Raise a Ticket
        </Link>
      </div>
    </div>
  );
}
