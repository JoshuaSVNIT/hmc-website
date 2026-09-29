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

  // Defence-in-depth: verify session even though proxy already redirected
  // unauthenticated requests.  getUser() validates the JWT with Supabase's
  // server rather than trusting the local cookie value alone.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Authenticated user's RLS context → "authenticated full select on tickets"
  // policy (§4) allows this read.  No secret key bypass used or needed.
  const { data: tickets, error } = await supabase
    .from("tickets")
    .select(
      "id, ticket_code, raiser_name, room_no, tag, description, photo_url, status, admin_notes, is_anonymous, created_at, updated_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Admin tickets fetch error:", error.message);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shadow-md print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight">HMC Admin</h1>
            <p className="text-xs text-slate-400 leading-tight">
              Swami Vivekanand Bhavan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400 hidden sm:block">
            {user.email}
          </span>
          {/* Logout — Server Action via form so it works without JS */}
          <form action={logout}>
            <button
              id="admin-logout-btn"
              type="submit"
              className="text-xs font-semibold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-screen-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            All Tickets
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {tickets?.length ?? 0} ticket{tickets?.length !== 1 ? "s" : ""}{" "}
            total · filterable by tag and status below
          </p>
        </div>

        {error ? (
          <div
            role="alert"
            className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-sm text-red-800"
          >
            <strong>Failed to load tickets.</strong> Check the server logs and
            try refreshing. ({error.message})
          </div>
        ) : (
          <AdminDashboard tickets={(tickets as Ticket[]) ?? []} />
        )}
      </div>
    </main>
  );
}
