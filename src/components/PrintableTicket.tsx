import type { Ticket } from "@/types";

const TAG_LABELS: Record<string, string> = {
  "Plumbing/Water": "Plumbing / Water",
};

function fmt(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

/**
 * Self-contained print-only view of a single resident ticket.
 * Has its own header + logo (the site Sidebar/TopBar are hidden in print) and
 * shows every field. Hidden on screen, visible only when printing.
 */
export default function PrintableTicket({ ticket }: { ticket: Ticket }) {
  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Ticket Code", value: <strong style={{ fontFamily: "monospace", fontSize: 18 }}>{ticket.ticket_code}</strong> },
    { label: "Status", value: ticket.status },
    { label: "Category", value: TAG_LABELS[ticket.tag] ?? ticket.tag },
    { label: "Room Number", value: ticket.room_no || "—" },
    {
      label: "Reported By",
      value: ticket.is_anonymous ? "Anonymous resident" : ticket.raiser_name || "—",
    },
  ];
  if (!ticket.is_anonymous && ticket.phone_no) rows.push({ label: "Contact Phone", value: ticket.phone_no });
  rows.push({ label: "Description", value: <span style={{ whiteSpace: "pre-wrap" }}>{ticket.description}</span> });
  if (ticket.admin_notes)
    rows.push({ label: "HMC Committee Note", value: <span style={{ whiteSpace: "pre-wrap" }}>{ticket.admin_notes}</span> });
  rows.push({ label: "Logged At", value: ticket.created_at ? fmt(ticket.created_at) : "—" });
  if (ticket.updated_at) rows.push({ label: "Last Update", value: fmt(ticket.updated_at) });

  return (
    <div className="hidden print:block text-black bg-white" style={{ fontFamily: "system-ui, sans-serif" }}>
      <header style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/HMC_logo.svg"
          alt="HMC Logo"
          width={64}
          height={64}
          style={{ width: 64, height: 64, objectFit: "contain" }}
        />
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Swami Vivekanand Bhavan HMC</h1>
          <p style={{ fontSize: 12, color: "#444", margin: "2px 0 0" }}>
            Hostel Management Committee — Complaint Ticket
          </p>
        </div>
      </header>
      <hr style={{ border: 0, borderTop: "2px solid #000", margin: "10px 0 14px" }} />

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} style={{ borderBottom: "1px solid #ccc", pageBreakInside: "avoid" }}>
              <th style={{ textAlign: "left", verticalAlign: "top", width: 150, padding: "7px 8px 7px 0", fontSize: 12 }}>
                {r.label}
              </th>
              <td style={{ padding: "7px 0" }}>{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {ticket.photo_url && (
        <div style={{ marginTop: 16, pageBreakInside: "avoid" }}>
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Attached Photo</div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ticket.photo_url}
            alt="Ticket attachment"
            style={{ maxWidth: "100%", maxHeight: 420, objectFit: "contain", border: "1px solid #999" }}
          />
        </div>
      )}

      <footer style={{ marginTop: 22, fontSize: 11, color: "#555" }}>
        <p style={{ margin: 0 }}>
          Track this ticket on the HMC website (Track Ticket page) with code <strong>{ticket.ticket_code}</strong>.
        </p>
        <p style={{ margin: "3px 0 0" }}>Printed: {new Date().toLocaleString("en-IN")}</p>
      </footer>
    </div>
  );
}
