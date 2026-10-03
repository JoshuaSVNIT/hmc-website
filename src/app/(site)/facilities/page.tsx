import type { Metadata } from "next";
import Link from "next/link";
import { getAllCommonRooms, type SanityCommonRoom } from "@/lib/sanity/queries";
import { urlFor } from "@/sanity/lib/image";
import { BuildingIcon, WrenchIcon, PhoneIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Facilities & Common Rooms — SV Bhavan HMC",
  description:
    "Student common rooms, TV lounges, study areas, and facilities across wings A, B, and C on floors 2 through 8 at Swami Vivekanand Bhavan.",
};

export const dynamic = "force-dynamic";

const FLOORS = [2, 3, 4, 5, 6, 7, 8];
const WINGS = ["A", "B", "C"];

export default async function FacilitiesPage() {
  const commonRooms = await getAllCommonRooms();

  // Create a fast lookup map: `${floor}-${wing}` -> SanityCommonRoom
  const roomMap = new Map<string, SanityCommonRoom>();
  for (const room of commonRooms) {
    if (room.floor != null && room.wing) {
      roomMap.set(`${Number(room.floor)}-${room.wing.trim().toUpperCase()}`, room);
    }
  }

  return (
    <main
      className="min-h-screen py-10 sm:py-14 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--color-paper)" }}
    >
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-blue-500/10 text-blue-800 border border-blue-500/20 mb-3 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            Hostel Infrastructure
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-ink">
            Common Rooms &amp; Facilities
          </h1>
          <p className="mt-3 text-sm sm:text-base text-ink-600 leading-relaxed">
            Swami Vivekanand Bhavan features dedicated common spaces on every floor (2nd through 8th)
            across Wings A, B, and C for recreation, peer study, and group meetings.
          </p>
        </div>

        {/* Floor-by-Floor Matrix */}
        <div className="space-y-8">
          {/* Wing Legend Bar */}
          <div className="hidden sm:grid grid-cols-12 gap-4 pb-2 border-b border-ink/10 text-xs font-bold uppercase tracking-wider text-ink-500">
            <div className="col-span-3 lg:col-span-2">Floor</div>
            <div className="col-span-3 lg:col-span-3">Wing A</div>
            <div className="col-span-3 lg:col-span-3">Wing B</div>
            <div className="col-span-3 lg:col-span-4">Wing C</div>
          </div>

          {/* Floors */}
          {FLOORS.map((floor) => {
            return (
              <section
                key={floor}
                className="card-surface p-4 sm:p-6 border border-ink/5 shadow-xs"
                aria-label={`Floor ${floor} Common Rooms`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-5">
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
                    <span className="text-xs text-ink-500 font-medium">3 Wings</span>
                  </div>

                  {/* Wings Grid */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {WINGS.map((wing) => {
                      const room = roomMap.get(`${floor}-${wing}`);
                      const hasLabel = Boolean(room?.label && room.label.trim().length > 0);
                      const label = hasLabel ? room!.label.trim() : "Not yet configured";
                      const imageUrl = room?.image?.asset?._ref
                        ? urlFor(room.image).width(480).height(320).fit("crop").auto("format").url()
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
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${hasLabel ? "bg-accent-primary/10 text-accent-primary" : "bg-slate-200/60 text-slate-400"}`}>
                                  <BuildingIcon size={20} />
                                </div>
                                <span className={`text-xs mt-1.5 uppercase tracking-wider font-mono font-medium ${hasLabel ? "text-ink-500" : "text-slate-400"}`}>
                                  Wing {wing}
                                </span>
                              </div>
                            )}

                            {/* Wing Badge Overlay */}
                            <span className={`absolute top-2 left-2 backdrop-blur-xs text-xs font-bold px-2.5 py-0.5 rounded font-mono ${hasLabel ? "bg-slate-900/80 text-white" : "bg-slate-800/60 text-slate-200"}`}>
                              Wing {wing}
                            </span>
                          </div>

                          {/* Body */}
                          <div className="p-4 flex-1 flex flex-col justify-between gap-2.5">
                            <div>
                              <h3 className={`text-base font-bold leading-snug ${hasLabel ? "text-ink" : "text-slate-400 italic font-medium"}`}>
                                {label}
                              </h3>
                              <p className={`text-xs mt-1 font-medium ${hasLabel ? "text-ink-500" : "text-slate-400 font-mono"}`}>
                                Floor {floor} · Wing {wing}
                              </p>
                            </div>

                            {/* Contact info if present */}
                            {hasContact && (
                              <div className="pt-2.5 border-t border-ink/5 text-xs space-y-1 text-ink-600">
                                {room?.contactName?.trim() && (
                                  <div className="font-medium text-ink truncate">
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
              </section>
            );
          })}
        </div>

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
    </main>
  );
}
