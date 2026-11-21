import type { Metadata } from "next";
import { getAllContacts, type SanityContact } from "@/lib/sanity/queries";
import { PhoneLink, formatTelHref } from "@/components/PhoneLink";
import { MedicalKitIcon, PhoneIcon, UserIcon } from "@/components/icons";
import MediclaimDialog from "./MediclaimDialog";
import NetworkHospitals, { type NetworkHospitalsData } from "./NetworkHospitals";
import hospitalsData from "@/data/network-hospitals.json";

export const metadata: Metadata = {
  title: "Medical & Emergency Care — SV Bhavan HMC",
  description:
    "Medical assistance contacts, emergency helplines, supervisors, and student representatives for Swami Vivekanand Bhavan.",
};

function ContactRow({ contact }: { contact: SanityContact }) {
  const initials = contact.label
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const telHref = formatTelHref(contact.phone) || `tel:${contact.phone}`;

  return (
    <div className="py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 font-bold text-sm flex items-center justify-center shrink-0 border border-slate-200"
          aria-hidden="true"
        >
          {initials}
        </div>
        <div className="min-w-0">
          <div className="text-sm sm:text-base font-bold text-slate-900 leading-snug truncate">
            {contact.label}
          </div>
          {contact.title && (
            <div className="text-xs text-slate-500 mt-0.5 truncate">
              {contact.title}
            </div>
          )}
          <div className="mt-0.5">
            <PhoneLink
              phone={contact.phone}
              isUrgent={false}
              showIcon={true}
              className="min-h-[auto] py-0 text-xs sm:text-sm font-semibold"
            />
          </div>
        </div>
      </div>

      <a
        href={telHref}
        className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#3B6FD9] hover:bg-blue-700 transition-colors inline-flex items-center gap-1 shrink-0 min-h-[44px]"
      >
        <PhoneIcon size={14} className="shrink-0" aria-hidden="true" />
        <span>Call</span>
      </a>
    </div>
  );
}

export default async function MedicalPage() {
  const allContacts = await getAllContacts();

  // Sort helper by order field (ascending)
  const sortByOrder = (a: SanityContact, b: SanityContact) =>
    (a.order ?? 0) - (b.order ?? 0);

  // Filter supervisor contacts from Sanity (unchanged query)
  const supervisorContacts = allContacts
    .filter(
      (c) =>
        c.category === "Supervisor" ||
        c.category?.toLowerCase() === "supervisor" ||
        c.category?.toLowerCase() === "supervisors"
    )
    .sort(sortByOrder);

  // Query contacts with category == "HMC Member" && showOnMedicalPage == true, sorted by order
  const studentRepContacts = allContacts
    .filter(
      (c) =>
        (c.category === "HMC Member" ||
          c.category?.toLowerCase() === "hmc member" ||
          c.category?.toLowerCase() === "hmc") &&
        Boolean(c.showOnMedicalPage)
    )
    .sort(sortByOrder);

  return (
    <main
      className="min-h-screen py-10 sm:py-14 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--color-paper)" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Page Header: medical-kit icon in red + heading */}
        <div className="flex items-center gap-3 sm:gap-3.5 mb-8">
          <MedicalKitIcon
            size={36}
            className="text-[#dc2626] shrink-0"
            aria-hidden="true"
          />
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900"
            style={{
              fontFamily: "var(--font-cormorant), system-ui, sans-serif",
            }}
          >
            Medical &amp; Emergency Care
          </h1>
        </div>

        {/* ── TOP ROW: Step 1 (55%) & Supervisors (45%) ── */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          {/* Top Left (wider, ~55%): Step 1 Card */}
          <div className="w-full lg:w-[55%] flex flex-col">
            <div className="bg-[#dc2626] text-white rounded-[16px] p-6 sm:p-8 flex flex-col justify-between h-full shadow-none">
              <div>
                <span className="block text-[13px] font-bold text-white tracking-wider">
                  STEP 1
                </span>
                <h2 className="text-[22px] sm:text-[26px] font-bold text-white leading-snug mt-1.5">
                  Contact a supervisor or student representative to accompany you
                </h2>
              </div>

              {/* Two emergency tiles side by side (stacked below md) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {/* Tile 1: Ambulance 108 */}
                <a
                  href="tel:108"
                  className="bg-[#b91c1c] border border-white/20 rounded-xl p-4 sm:p-5 flex flex-col justify-between relative transition-opacity hover:opacity-95 focus:outline-hidden focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#dc2626] min-h-[140px]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-semibold text-white/90">
                      Ambulance
                    </span>
                    <PhoneIcon
                      size={18}
                      className="text-white shrink-0"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3">
                    <div
                      className="text-[28px] sm:text-[32px] font-bold text-white tracking-wide"
                      style={{
                        fontFamily: "var(--font-ibm-plex-mono), monospace",
                      }}
                    >
                      108
                    </div>
                    <div className="mt-2">
                      <span className="inline-block px-2.5 py-0.5 rounded-full border border-white/60 text-[11px] font-semibold text-white">
                        Emergency
                      </span>
                    </div>
                  </div>
                </a>

                {/* Tile 2: Campus Dispensary (0261) 2201700 */}
                <a
                  href="tel:02612201700"
                  className="bg-[#b91c1c] border border-white/20 rounded-xl p-4 sm:p-5 flex flex-col justify-between relative transition-opacity hover:opacity-95 focus:outline-hidden focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#dc2626] min-h-[140px]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-semibold text-white/90">
                      Campus Dispensary
                    </span>
                    <PhoneIcon
                      size={18}
                      className="text-white shrink-0"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3">
                    <div
                      className="text-[20px] sm:text-[24px] font-bold text-white tracking-wide"
                      style={{
                        fontFamily: "var(--font-ibm-plex-mono), monospace",
                      }}
                    >
                      (0261) 2201700
                    </div>
                    <div className="mt-2">
                      <span className="inline-block px-2.5 py-0.5 rounded-full border border-white/60 text-[11px] font-semibold text-white">
                        Dispensary
                      </span>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Top Right (~45%): Supervisors on Duty Card */}
          <div className="w-full lg:w-[45%] flex flex-col">
            <div className="bg-white border border-slate-200 rounded-[16px] p-5 sm:p-6 flex flex-col justify-between h-full shadow-none">
              <div>
                <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
                  <UserIcon
                    size={20}
                    className="text-slate-700 shrink-0"
                    aria-hidden="true"
                  />
                  <h2
                    className="text-lg sm:text-xl font-bold text-slate-900"
                    style={{
                      fontFamily: "var(--font-cormorant), system-ui, sans-serif",
                    }}
                  >
                    Supervisors on Duty
                  </h2>
                </div>

                {/* Supervisor Group */}
                <div className="divide-y divide-slate-100">
                  {supervisorContacts.map((contact) => (
                    <ContactRow key={contact._id} contact={contact} />
                  ))}
                </div>

                {/* Second Group: Student Representatives (hidden if empty) */}
                {studentRepContacts.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <h3 className="text-sm font-semibold text-slate-800 mb-2">
                      Student representatives
                    </h3>
                    <div className="divide-y divide-slate-100">
                      {studentRepContacts.map((contact) => (
                        <ContactRow key={contact._id} contact={contact} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM ROW: E-card & Hospital card ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch mt-6">
          {/* Bottom Left: E-Card Card */}
          <div className="flex flex-col h-full">
            <MediclaimDialog />
          </div>

          {/* Bottom Right: Hospital Card */}
          <div className="flex flex-col h-full">
            <div className="bg-[#3B6FD9] text-white rounded-[16px] p-6 sm:p-8 flex flex-col justify-between h-full shadow-none">
              <div className="max-w-md">
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Network hospitals (cashless)
                </h3>
                <p className="text-sm text-white/90 mt-2 leading-relaxed">
                  Explore all tie-up and empanelled healthcare facilities with
                  cashless admission support.
                </p>
              </div>
              <div>
                <a
                  href="#hospital-directory"
                  className="mt-6 px-4 py-2 bg-white text-[#3B6FD9] font-semibold text-sm rounded-lg hover:bg-slate-100 transition-colors inline-flex items-center gap-1.5 shadow-xs min-h-[44px] cursor-pointer"
                >
                  <span>Browse Hospitals</span>
                  <span aria-hidden="true">&darr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── HOSPITAL TABLE: Full-width white panel below the grid ── */}
        <section
          id="hospital-directory"
          className="bg-white border border-slate-200 rounded-[16px] p-6 sm:p-8 mt-6 shadow-none"
        >
          <h2
            className="text-xl sm:text-2xl font-bold text-slate-900 pb-3 border-b border-slate-200 mb-6"
            style={{
              fontFamily: "var(--font-cormorant), system-ui, sans-serif",
            }}
          >
            Network hospitals (cashless)
          </h2>

          <NetworkHospitals data={hospitalsData as NetworkHospitalsData} />
        </section>
      </div>
    </main>
  );
}
