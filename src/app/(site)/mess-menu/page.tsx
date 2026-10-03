import type { Metadata } from "next";
import Link from "next/link";
import { getAllMessMenus, type SanityMessMenu } from "@/lib/sanity/queries";
import { UtensilsIcon, WrenchIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Weekly Mess Menu — Swami Vivekanand Bhavan HMC",
  description:
    "Complete weekly dining menu and schedule for SV Bhavan Central Dining Hall at SVNIT Surat. Breakfast, lunch, and dinner menus from Monday through Sunday.",
};

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export default async function MessMenuPage() {
  const menus: SanityMessMenu[] = await getAllMessMenus();

  // Create a lookup map by day name (lowercase)
  const menuMap = new Map<string, SanityMessMenu>();
  for (const m of menus) {
    if (m.day) {
      menuMap.set(m.day.trim().toLowerCase(), m);
    }
  }

  // Current day in Indian Standard Time (IST)
  const currentDay = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: "Asia/Kolkata",
  }).format(new Date());

  return (
    <main
      className="min-h-screen py-10 sm:py-14 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--color-paper)" }}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-amber-500/10 text-amber-900 border border-amber-500/20 mb-3 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
              Central Dining Hall
            </div>
            <h1
              className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900"
              style={{
                fontFamily: "var(--font-cormorant), system-ui, sans-serif",
              }}
            >
              Weekly Mess Menu
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              Complete 7-day dining schedule for Swami Vivekanand Bhavan residents.
              Menu items and special preparations rotated weekly under HMC Mess Committee supervision.
            </p>
          </div>

          {/* Timings Summary Card */}
          <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs shrink-0 self-start md:self-auto">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Daily Serving Hours
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <div className="font-bold text-slate-900">Breakfast</div>
                <div className="font-mono text-slate-500 text-xs mt-0.5">7:30 – 9:30 AM</div>
              </div>
              <div>
                <div className="font-bold text-slate-900">Lunch</div>
                <div className="font-mono text-slate-500 text-xs mt-0.5">12:30 – 2:30 PM</div>
              </div>
              <div>
                <div className="font-bold text-slate-900">Dinner</div>
                <div className="font-mono text-slate-500 text-xs mt-0.5">7:30 – 9:30 PM</div>
              </div>
            </div>
          </div>
        </div>

        {/* 7-Day Table View (Desktop & Tablet) */}
        <div className="rounded-xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200/80 text-xs sm:text-sm font-bold text-slate-700">
                  <th className="py-3.5 px-4 w-36 uppercase tracking-wider sticky left-0 bg-slate-50/95 z-10 backdrop-blur-xs border-r border-slate-200/60">
                    Day
                  </th>
                  <th className="py-3.5 px-5 w-1/3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="uppercase tracking-wider">Breakfast</span>
                      <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/70">
                        7:30 – 9:30 AM
                      </span>
                    </div>
                  </th>
                  <th className="py-3.5 px-5 w-1/3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="uppercase tracking-wider">Lunch</span>
                      <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-800 border border-orange-200/70">
                        12:30 – 2:30 PM
                      </span>
                    </div>
                  </th>
                  <th className="py-3.5 px-5 w-1/3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="uppercase tracking-wider">Dinner</span>
                      <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200/70">
                        7:30 – 9:30 PM
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {DAYS_OF_WEEK.map((day) => {
                  const item = menuMap.get(day.toLowerCase());
                  const isToday = currentDay.toLowerCase() === day.toLowerCase();

                  return (
                    <tr
                      key={day}
                      className={`transition-colors ${
                        isToday
                          ? "bg-amber-50/40 hover:bg-amber-50/60"
                          : "hover:bg-slate-50/60"
                      }`}
                    >
                      {/* Day Column (Sticky) */}
                      <td
                        className={`py-4 px-4 align-top font-semibold sticky left-0 z-10 border-r border-slate-200/60 ${
                          isToday ? "bg-amber-50/95" : "bg-white"
                        }`}
                      >
                        <div className="flex flex-col items-start gap-1">
                          <span
                            className={`text-lg font-bold tracking-tight ${
                              isToday ? "text-amber-950 font-bold" : "text-slate-900"
                            }`}
                            style={{
                              fontFamily: "var(--font-cormorant), system-ui, sans-serif",
                            }}
                          >
                            {day}
                          </span>
                          {isToday && (
                            <span className="inline-flex items-center gap-1 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                              Today
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Breakfast */}
                      <td className="py-4 px-5 align-top">
                        {item?.breakfast ? (
                          <div className="text-slate-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                            {item.breakfast}
                          </div>
                        ) : (
                          <span className="text-sm italic text-slate-400">
                            Menu as per dining roster.
                          </span>
                        )}
                      </td>

                      {/* Lunch */}
                      <td className="py-4 px-5 align-top">
                        {item?.lunch ? (
                          <div className="text-slate-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                            {item.lunch}
                          </div>
                        ) : (
                          <span className="text-sm italic text-slate-400">
                            Menu as per dining roster.
                          </span>
                        )}
                      </td>

                      {/* Dinner */}
                      <td className="py-4 px-5 align-top">
                        {item?.dinner ? (
                          <div className="text-slate-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                            {item.dinner}
                          </div>
                        ) : (
                          <span className="text-sm italic text-slate-400">
                            Menu as per dining roster.
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Issue Reporting Callout */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/80 flex items-center justify-center shrink-0">
                <UtensilsIcon size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Having a mess-related issue? Raise a ticket under the Mess tag.
                </h2>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  Submit feedback regarding food quality, catering hygiene, timing, or mess facilities directly to the HMC Mess Committee for prompt resolution.
                </p>
              </div>
            </div>
            <Link
              href="/raise-ticket"
              className="shrink-0 px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-md shadow-blue-600/20 hover:shadow-blue-600/30 hover:brightness-105 inline-flex items-center gap-1.5"
              style={{
                backgroundColor: "var(--color-accent-primary)",
                color: "#ffffff",
                fontFamily: "var(--font-cormorant), system-ui, sans-serif",
              }}
            >
              <WrenchIcon size={14} />
              Raise a Ticket →
            </Link>
          </div>
        </div>

        {/* Back Link */}
        <div className="pt-2">
          <Link
            href="/"
            className="text-sm font-semibold text-slate-600 hover:text-slate-900 hover:underline inline-flex items-center gap-1.5"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
