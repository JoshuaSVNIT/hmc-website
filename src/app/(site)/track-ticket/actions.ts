"use server";

import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";
import type { Ticket } from "@/types";

export type LookupResult =
  | { found: true; ticket: Ticket }
  | { found: false; error: string };

// In-memory rate limiting map: IP -> array of attempt timestamps (ms)
const lookupAttemptsByIp = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_ATTEMPTS_PER_WINDOW = 5;

async function getClientIp(): Promise<string> {
  try {
    const headerStore = await headers();
    const forwardedFor = headerStore.get("x-forwarded-for");
    if (forwardedFor) {
      return forwardedFor.split(",")[0].trim();
    }
    const realIp = headerStore.get("x-real-ip");
    if (realIp) {
      return realIp.trim();
    }
  } catch {
    // Invoked outside request scope (e.g. tests or direct invocation)
  }
  return "127.0.0.1";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const attempts = (lookupAttemptsByIp.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  );

  if (attempts.length >= MAX_ATTEMPTS_PER_WINDOW) {
    lookupAttemptsByIp.set(ip, attempts);
    return true;
  }

  attempts.push(now);
  lookupAttemptsByIp.set(ip, attempts);
  return false;
}

/** Reset rate limit records (used in tests) */
export async function _resetRateLimits(): Promise<void> {
  lookupAttemptsByIp.clear();
}

/**
 * Server Action: look up a single ticket by exact ticket_code.
 * Uses createAdminClient to safely query the ticket by code and sign photo attachments.
 */
export async function lookupTicket(code: string): Promise<LookupResult> {
  const ip = await getClientIp();

  if (isRateLimited(ip)) {
    return {
      found: false,
      error: "Too many attempts, please try again in a minute.",
    };
  }

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

  const supabase = await createAdminClient();

  // Direct table select — works while RLS is disabled.
  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("ticket_code", sanitizedCode)
    .maybeSingle();

  if (error) {
    console.error("[track-ticket] Lookup error:", error.message);
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

  // Generate short-lived signed URL for private bucket photo attachment
  let photoSignedUrl: string | null = null;
  if (data.photo_url) {
    const { getTicketPhotoSignedUrl } = await import("@/lib/supabase/photos");
    photoSignedUrl = await getTicketPhotoSignedUrl(data.photo_url, 3600);
  }

  const ticketWithPhoto: Ticket = {
    ...(data as Ticket),
    photo_url: photoSignedUrl ?? data.photo_url,
  };

  return { found: true, ticket: ticketWithPhoto };
}
