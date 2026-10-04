import type { Metadata } from "next";
import Link from "next/link";
import { SparkIcon, PhoneIcon, ShieldIcon, WrenchIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Hostel Boys Duty List — Room Cleaning — SV Bhavan HMC",
  description:
    "Annual room cleaning duty roster, floor allocations, and direct contact numbers for housekeeping staff at Swami Vivekanand Bhavan.",
};

interface DutyEntry {
  srNo: number;
  name: string;
  floor: string;
  phone: string;
}

const dutyList: DutyEntry[] = [
  { srNo: 1, name: "Satish Mavi", floor: "4th Floor", phone: "+919726985877" },
  { srNo: 2, name: "Alpesh Don", floor: "3rd Floor", phone: "+919409635791" },
  { srNo: 3, name: "Prakash Naik", floor: "2nd Floor", phone: "+918260370133" },
  { srNo: 4, name: "Manish Lodhi", floor: "5th Floor", phone: "+919265875534" },
  { srNo: 5, name: "Akshit Gamit", floor: "6th Floor", phone: "+917016670240" },
  { srNo: 6, name: "Prasan Naik", floor: "7th & 8th Floor", phone: "+919664792989" },
];

function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\s+/g, "");
  if (cleaned.startsWith("+91") && cleaned.length === 13) {
    return `+91 ${cleaned.slice(3, 8)} ${cleaned.slice(8)}`;
  }
  return phone;
}

export default function RoomCleaningPage() {
  return (
    <main
      className="min-h-screen py-10 sm:py-14 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--color-paper)" }}
    >
      <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10">
        {/* Page Header */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-blue-500/10 text-blue-800 border border-blue-500/20 mb-3 shadow-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            Housekeeping &amp; Sanitation
          </div>
          <h1
            className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900"
            style={{
              fontFamily: "var(--font-cormorant), system-ui, sans-serif",
            }}
          >
            Hostel Boys Duty List — 2025-26
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            Floor-wise allocation of hostel housekeeping staff for daily room cleaning.
            Residents can directly call their assigned floor staff during scheduled duty hours.
          </p>
        </div>

        {/* Desktop & Tablet Table View (sm+) */}
        <div className="hidden sm:block rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <SparkIcon size={16} className="text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                Floor Roster ({dutyList.length} Staff Assigned)
              </span>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Session 2025–2026
            </span>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                <th scope="col" className="py-3.5 px-6 w-20 text-center">
                  Sr. No.
                </th>
                <th scope="col" className="py-3.5 px-6">
                  Name
                </th>
                <th scope="col" className="py-3.5 px-6">
                  Floor
                </th>
                <th scope="col" className="py-3.5 px-6 text-right">
                  Contact
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {dutyList.map((entry) => (
                <tr
                  key={entry.srNo}
                  className="hover:bg-blue-50/30 transition-colors group"
                >
                  <td className="py-4 px-6 text-center font-mono font-bold text-slate-500 text-xs">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                      {entry.srNo}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-900">
                    {entry.name}
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 font-mono">
                      {entry.floor}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <a
                      href={`tel:${entry.phone.replace(/\s+/g, "")}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-mono bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200/80 hover:border-blue-600 transition-all shadow-2xs"
                      title={`Call ${entry.name} at ${entry.phone}`}
                    >
                      <PhoneIcon size={13} className="shrink-0" />
                      <span>{formatPhoneNumber(entry.phone)}</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Card View (< sm) */}
        <div className="sm:hidden space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
              Staff Assignments
            </span>
            <span className="text-xs font-mono text-slate-400">
              2025–26 Roster
            </span>
          </div>

          {dutyList.map((entry) => (
            <div
              key={entry.srNo}
              className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-100 text-slate-700 font-mono font-bold text-xs">
                    #{entry.srNo}
                  </span>
                  <h2 className="font-bold text-slate-900 text-base">
                    {entry.name}
                  </h2>
                </div>
                <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 font-mono">
                  {entry.floor}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">
                  Direct Phone:
                </span>
                <a
                  href={`tel:${entry.phone.replace(/\s+/g, "")}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-mono bg-blue-600 text-white active:bg-blue-700 shadow-2xs"
                >
                  <PhoneIcon size={13} className="shrink-0" />
                  <span>{formatPhoneNumber(entry.phone)}</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Resident Guidance / Notice Banner */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 shrink-0">
              <ShieldIcon size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Cleaning Timings &amp; Guidelines
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
                Room sweeping and mopping are conducted in morning slots. Please keep personal
                belongings and laptops secured in locked cupboards during cleaning.
              </p>
            </div>
          </div>

          <Link
            href="/raise-ticket"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors shrink-0 shadow-xs"
          >
            <WrenchIcon size={14} />
            <span>Raise Cleaning Grievance</span>
          </Link>
        </div>

        {/* Back Link */}
        <div className="pt-4 border-t border-slate-200">
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
