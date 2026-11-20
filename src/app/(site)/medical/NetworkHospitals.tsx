"use client";

import { useMemo, useState } from "react";
import { PhoneLink } from "@/components/PhoneLink";

export interface NetworkHospital {
  name: string;
  address: string;
  phones: string[];
}

export interface NetworkHospitalsData {
  updated: string;
  source: string;
  hospitals: NetworkHospital[];
}

function formatUpdatedDate(isoDate: string): string {
  if (!isoDate) return "";
  const parts = isoDate.split("-");
  if (parts.length === 3) {
    const year = parts[0];
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    if (month >= 1 && month <= 12 && !isNaN(day)) {
      return `${day} ${monthNames[month - 1]} ${year}`;
    }
  }
  return isoDate;
}

export default function NetworkHospitals({
  data,
}: {
  data: NetworkHospitalsData;
}) {
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(30);

  const hospitals = data?.hospitals || [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/\s+/g, " ");
    if (!q) return hospitals;
    const tokens = q.split(" ").filter(Boolean);
    return hospitals.filter((h) => {
      const name = (h.name || "").toLowerCase().replace(/\s+/g, " ");
      const address = (h.address || "").toLowerCase().replace(/\s+/g, " ");
      return tokens.every((t) => name.includes(t) || address.includes(t));
    });
  }, [hospitals, query]);

  if (hospitals.length === 0) {
    return (
      <p className="text-sm text-slate-500 py-6">
        Hospital list not added yet
      </p>
    );
  }

  const visibleHospitals = filtered.slice(0, visibleCount);
  const formattedDate = formatUpdatedDate(data.updated);

  return (
    <div>
      {/* Above the table metadata */}
      <div className="space-y-1 text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
        <p>
          Source: {data.source}. Last updated: {formattedDate}.
        </p>
        <p>
          This list can change at any time. Confirm with the hospital before admission.
        </p>
        <p>
          <a
            href="https://fhpl.net/WhatsappNetworkhospitals/?id=5"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:text-blue-800 underline font-medium"
          >
            Check the latest list on the FHPL website
          </a>
        </p>
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <label
          htmlFor="hospital-search"
          className="block text-sm font-semibold text-slate-900 mb-1.5"
        >
          Search hospitals by name or area
        </label>
        <input
          id="hospital-search"
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setVisibleCount(30);
          }}
          placeholder="Search hospitals by name or area"
          className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-400 text-slate-900 placeholder:text-slate-500 text-sm focus:outline-hidden focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors"
        />
        {filtered.length > 0 && (
          <div className="text-xs sm:text-sm text-slate-600 mt-2">
            Showing {Math.min(visibleCount, filtered.length)} of {filtered.length} hospitals
          </div>
        )}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="py-8 text-center text-sm sm:text-base text-slate-600">
          No hospital matches &ldquo;{query}&rdquo;
        </div>
      ) : (
        <>
          {/* Table from md up */}
          <div className="hidden md:block overflow-x-auto border border-slate-200 mt-4">
            <table className="w-full text-left text-sm divide-y divide-slate-200">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    Hospital
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Address
                  </th>
                  <th scope="col" className="px-4 py-3 whitespace-nowrap">
                    Contact
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {visibleHospitals.map((hospital, idx) => (
                  <tr key={`${hospital.name}-${idx}`} className="align-top">
                    <td className="px-4 py-3 font-medium text-slate-900 w-1/3">
                      {hospital.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600 leading-relaxed">
                      {hospital.address}
                    </td>
                    <td className="px-4 py-3 shrink-0 whitespace-nowrap">
                      <div className="flex flex-col">
                        {hospital.phones.map((phone, pIdx) => (
                          <PhoneLink key={pIdx} phone={phone} showIcon={true} />
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Stacked rows below md */}
          <div className="md:hidden divide-y divide-slate-200 border-t border-b border-slate-200 mt-4">
            {visibleHospitals.map((hospital, idx) => (
              <div key={`${hospital.name}-${idx}`} className="py-4">
                <div className="font-bold text-slate-900 text-sm sm:text-base">
                  {hospital.name}
                </div>
                <div className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  {hospital.address}
                </div>
                <div className="mt-2 flex flex-col">
                  {hospital.phones.map((phone, pIdx) => (
                    <PhoneLink key={pIdx} phone={phone} showIcon={true} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Show more button */}
          {visibleCount < filtered.length && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 30)}
                className="px-5 py-2.5 text-sm font-semibold text-slate-800 bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-colors focus:outline-hidden focus:ring-2 focus:ring-slate-900 cursor-pointer"
              >
                Show more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

