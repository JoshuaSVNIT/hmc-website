"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { TicketStatus } from "@/types";

// ─── Auth Actions ──────────────────────────────────────────────────────────────

export type LoginResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Sign in an HMC member with email + password.
 * Uses the publishable-key client — Supabase Auth sets an HttpOnly session
 * cookie that subsequent server requests read via @supabase/ssr.
 * No public sign-up path exists; accounts are created manually in the
 * Supabase dashboard (§3 of PROJECT_SPEC).
 */
export async function loginWithEmail(
  formData: FormData
): Promise<LoginResult> {
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const password = (formData.get("password") as string | null) ?? "";

  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Don't leak whether the account exists — generic message
    return {
      success: false,
      error: "Invalid credentials. Please check your email and password.",
    };
  }

  // Session cookie is now written; redirect to dashboard
  redirect("/admin");
}

/**
 * Sign out the current HMC member and redirect to the login page.
 */
export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ─── Ticket Update Actions ─────────────────────────────────────────────────────

export type UpdateResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Update the status of a ticket row.
 * Authenticated user's session is used — RLS "authenticated can update tickets"
 * policy (§4) grants the write; no secret key bypass needed or wanted.
 */
export async function updateTicketStatus(
  ticketId: string,
  status: TicketStatus
): Promise<UpdateResult> {
  if (!["Open", "In Progress", "Resolved"].includes(status)) {
    return { success: false, error: "Invalid status value." };
  }

  const supabase = await createClient();

  // Verify session server-side before attempting the write (defence-in-depth)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const { error } = await supabase
    .from("tickets")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", ticketId);

  if (error) {
    console.error("Status update error:", error.message);
    return { success: false, error: "Failed to update status. Try again." };
  }

  return { success: true };
}

/**
 * Save admin_notes for a ticket row.
 * Same RLS path as updateTicketStatus — authenticated session only.
 */
export async function updateAdminNotes(
  ticketId: string,
  adminNotes: string
): Promise<UpdateResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const { error } = await supabase
    .from("tickets")
    .update({
      admin_notes: adminNotes.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", ticketId);

  if (error) {
    console.error("Admin notes update error:", error.message);
    return { success: false, error: "Failed to save notes. Try again." };
  }

  return { success: true };
}
