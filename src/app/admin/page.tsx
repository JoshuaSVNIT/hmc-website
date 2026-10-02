import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Ticket } from "@/types";
import AdminDashboard from "./AdminDashboard";
import { logout } from "./actions";

export const metadata: Metadata = {
  title: "Admin Dashboard — SV Bhavan HMC",
};

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: tickets, error } = await supabase
    .from("tickets")
    .select(
      "id, ticket_code, raiser_name, room_no, phone_no, tag, description, photo_url, status, admin_notes, is_anonymous, created_at, updated_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Admin tickets fetch error:", error.message);
  }

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-paper)" }}
    >
      {/* Top bar */}
      <header
        className="px-6 py-4 flex items-center justify-between border-b print:hidden"
        style={{
          backgroundColor: "var(--color-ink)",
          borderColor: "rgba(255,255,255,0.08)",
          color: "var(--color-paper)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded flex items-center justify-center font-bold text-xs shrink-0"
            style={{
              backgroundColor: "var(--color-accent-secondary)",
              color: "#fff",
              fontFamily: "var(--font-ibm-plex-mono), monospace",
            }}
          >
            HMC
          </div>
          <div>
            <h1
              className="text-base font-bold leading-tight"
              style={{ fontFamily: "var(--font-space-grotesk), system-ui" }}
            >
              HMC Administrative Portal
            </h1>
            <p className="text-xs" style={{ color: "rgba(243,241,235,0.5)" }}>
              Swami Vivekanand Bhavan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span
            className="text-xs hidden sm:block"
            style={{
              color: "rgba(243,241,235,0.5)",
              fontFamily: "var(--font-ibm-plex-mono), monospace",
            }}
          >
            {user.email}
          </span>
          <form action={logout}>
            <button
              id="admin-logout-btn"
              type="submit"
              className="text-xs font-semibold px-3 py-1.5 rounded border transition-colors cursor-pointer"
              style={{
                borderColor: "rgba(255,255,255,0.15)",
                backgroundColor: "rgba(255,255,255,0.06)",
                color: "var(--color-paper)",
              }}
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-screen-2xl mx-auto">
        <div className="mb-6">
          <h2
            className="text-2xl sm:text-3xl font-bold tracking-tight"
            style={{
              color: "var(--color-ink)",
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
            }}
          >
            Complaint Tickets
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--color-ink-500)" }}>
            <span
              className="font-semibold"
              style={{ fontFamily: "var(--font-ibm-plex-mono), monospace" }}
            >
              {tickets?.length ?? 0}
            </span>{" "}
            total tickets logged in system. Filter by category, status, or search keywords below.
          </p>
        </div>

        {error ? (
          <div
            role="alert"
            className="rounded border p-4 text-sm"
            style={{
              backgroundColor: "rgba(179,63,46,0.08)",
              borderColor: "rgba(179,63,46,0.3)",
              color: "var(--color-accent-urgent)",
            }}
          >
            <strong>Failed to load tickets:</strong> {error.message}
          </div>
        ) : (
          <AdminDashboard tickets={(tickets as Ticket[]) ?? []} />
        )}
      </div>
    </main>
  );
}
