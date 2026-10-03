"use server";

import { createClient } from "@/lib/supabase/server";
import type { Ticket } from "@/types";

export type LookupResult =
  | { found: true; ticket: Ticket }
  | { found: false; error: string };

/**
 * Server Action: look up a single ticket by exact ticket_code.
 * RLS is currently disabled — using a direct table select.
 * NOTE: console.log / console.error here print to the Next.js SERVER
 * terminal (the terminal running `next dev`), not the browser console.
 */
export async function lookupTicket(code: string): Promise<LookupResult> {
  // Strip ALL whitespace (including internal spaces like "HMC- 1234")
  // then uppercase, matching the spec's sanitisation requirement.
  const sanitizedCode = code.replace(/\s+/g, "").toUpperCase();

  if (!sanitizedCode) {
    return { found: false, error: "Please enter a ticket code." };
  }

  // Basic format guard — HMC- followed by 4+ digits, e.g. HMC-1042
  if (!/^HMC-\d{4,}$/.test(sanitizedCode)) {
    return {
      found: false,
      error: "Ticket codes look like HMC-1234. Please check and try again.",
    };
  }

  const supabase = await createClient();

  // Direct table select — works while RLS is disabled.
  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("ticket_code", sanitizedCode)
    .maybeSingle();

  // Log raw Supabase response to the SERVER terminal for debugging.
  console.error("Supabase Track Error:", error);
  console.log("Supabase Track Data:", data);

  if (error) {
    return {
      found: false,
      error: "Something went wrong while looking up the ticket. Please try again.",
    };
  }

  if (!data) {
    return {
      found: false,
      error: `No ticket found with code "${sanitizedCode}". Double-check the code and try again.`,
    };
  }

  return { found: true, ticket: data as Ticket };
}
