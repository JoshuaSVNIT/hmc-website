import type { Metadata } from "next";
import { getAllWingReps, type SanityWingRep } from "@/lib/sanity/queries";
import { PhoneLink, formatTelHref } from "@/components/PhoneLink";
import { PhoneIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Wing Representatives (2026-27) — SV Bhavan HMC",
  description:
    "Floor and wing student representatives for session 2026-27 at Swami Vivekanand Bhavan, SVNIT Surat.",
};

function getFloorHeading(floor: string): string {
  const normalized = floor.trim();
  const lower = normalized.toLowerCase();
  if (lower === "ground" || lower === "0") return "Ground Floor";
  if (lower === "1") return "1st Floor";
  if (lower === "2") return "2nd Floor";
  if (lower === "3") return "3rd Floor";
  if (/^\d+$/.test(normalized)) {
    return `${normalized}th Floor`;
  }
  return `${normalized} Floor`;
}

function WingRepRow({ rep }: { rep: SanityWingRep }) {
  const telHref = formatTelHref(rep.phone) || `tel:${rep.phone}`;

  return (
    <div className="py-3.5 flex items-center justify-between gap-3 sm:gap-4">
      <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
        {/* Wing label on the left in small text */}
        <div className="w-14 sm:w-16 shrink-0 text-xs sm:text-sm font-semibold text-slate-500 pt-0.5 sm:pt-0">
          {rep.wing}
        </div>

        <div className="min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2">
            <span className="text-sm sm:text-base font-bold text-slate-900 leading-snug truncate">
              {rep.name}
            </span>
            <span className="text-xs text-slate-500 font-mono shrink-0">
              {rep.roomNo}
            </span>
          </div>
          <div className="mt-1 sm:mt-0.5">
            <PhoneLink
              phone={rep.phone}
              isUrgent={false}
              showIcon={true}
              className="min-h-[auto] py-0 text-xs sm:text-sm font-semibold"
            />
          </div>
        </div>
      </div>

      {/* Blue Call Button on the right (min-h-[44px] tap target) */}
      <a
        href={telHref}
        className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#3B6FD9] hover:bg-blue-700 transition-colors inline-flex items-center gap-1 shrink-0 min-h-[44px]"
        aria-label={`Call ${rep.name}`}
      >
        <PhoneIcon size={14} className="shrink-0" aria-hidden="true" />
        <span>Call</span>
      </a>
    </div>
  );
}

export default async function WingRepresentativesPage() {
  const allWingReps = await getAllWingReps();

  // Group by floor (preserving the sorted floor order)
  const floorMap = new Map<string, SanityWingRep[]>();
  for (const rep of allWingReps) {
    const key = rep.floor?.trim() || "Other";
    if (!floorMap.has(key)) {
      floorMap.set(key, []);
    }
    floorMap.get(key)!.push(rep);
  }

  const floorGroups = Array.from(floorMap.entries());

  return (
    <main
      className="min-h-screen py-10 sm:py-14 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--color-paper)" }}
    >
      <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10">
        {/* Page Header */}
        <div className="space-y-1">
          <h1
            className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900"
            style={{
              fontFamily: "var(--font-cormorant), system-ui, sans-serif",
            }}
          >
            Wing Representatives
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            Session 2026-27
          </p>
        </div>

        {/* Content: Floor sections or empty state */}
        {floorGroups.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 text-sm sm:text-base">
            Representatives for this session are not added yet.
          </div>
        ) : (
          <div className="space-y-8">
            {floorGroups.map(([floor, reps]) => {
              if (!reps || reps.length === 0) return null;

              return (
                <section key={floor} className="space-y-3">
                  <h2
                    className="text-xl sm:text-2xl font-bold text-slate-900"
                    style={{
                      fontFamily:
                        "var(--font-cormorant), system-ui, sans-serif",
                    }}
                  >
                    {getFloorHeading(floor)}
                  </h2>

                  <div className="rounded-2xl border border-slate-200 bg-white px-4 sm:px-6 divide-y divide-slate-100">
                    {reps.map((rep) => (
                      <WingRepRow key={rep._id} rep={rep} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

