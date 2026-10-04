"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { uploadTicketPhoto, getTicketPhotoSignedUrl } from "@/lib/supabase/photos";
import type { Ticket, TicketTag } from "@/types";

/** Allowed file types for ticket photo uploads (§4 storage constraints) */
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

/** Generate a human-readable ticket code like HMC-4217 */
function generateTicketCode(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `HMC-${num}`;
}

export type SubmitTicketResult =
  | { success: true; ticket_code: string; ticket: Ticket | null }
  | { success: false; error: string };

/**
 * Server Action: validate, optionally upload photo, then insert ticket row.
 * Uses createAdminClient (service role) to upload to private "ticket-photos" bucket
 * and insert ticket rows reliably without RLS blocking.
 */
export async function submitTicket(
  formData: FormData
): Promise<SubmitTicketResult> {
  const supabase = await createAdminClient();

  // --- Extract fields ---
  const isAnonymous = formData.get("is_anonymous") === "true";
  const raiserName = (formData.get("raiser_name") as string | null)?.trim() ?? "";
  const roomNo = (formData.get("room_no") as string | null)?.trim() ?? "";
  const phoneNo = (formData.get("phone_no") as string | null)?.trim() ?? "";
  const tag = (formData.get("tag") as string | null) as TicketTag | null;
  const description = (formData.get("description") as string | null)?.trim() ?? "";
  const photoFile = formData.get("photo") as File | null;

  // --- Basic validation ---
  // raiser_name, room_no, and phone_no are required only when NOT submitting anonymously (§7)
  if (!isAnonymous && !raiserName)
    return { success: false, error: "Please enter your name." };
  if (!roomNo && !isAnonymous) return { success: false, error: "Room number is required." };
  if (!phoneNo && !isAnonymous) return { success: false, error: "Phone number is required." };
  if (!tag || !(["Mess","Electrical","Plumbing/Water","Elevator","Cleanliness","Pests","Others"] as string[]).includes(tag))
    return { success: false, error: "Please select a valid complaint category." };
  if (!description)
    return { success: false, error: "Please describe your complaint." };

  // --- Photo validation (§4 storage constraints) ---
  let photoUrl: string | null = null;
  if (photoFile && photoFile.size > 0) {
    if (!ALLOWED_MIME_TYPES.includes(photoFile.type)) {
      return {
        success: false,
        error: "Photo must be a .jpg, .png, or .webp file.",
      };
    }
    if (photoFile.size > MAX_FILE_SIZE_BYTES) {
      return {
        success: false,
        error: `Photo must be under 10 MB. Your file is ${(photoFile.size / 1024 / 1024).toFixed(1)} MB.`,
      };
    }

    // Upload to Supabase Storage private "ticket-photos" bucket using shared helper
    const uploadResult = await uploadTicketPhoto(photoFile);
    if ("error" in uploadResult) {
      console.error("[raise-ticket] Photo upload error:", uploadResult.error);
      return {
        success: false,
        error: `Photo upload failed: ${uploadResult.error}. Please try again or submit without a photo.`,
      };
    }

    // Standardized relative storage key (e.g. "1791...-xyz.png")
    photoUrl = uploadResult.path;
  }

  // --- Generate unique ticket code (retry on collision) ---
  let ticketCode = generateTicketCode();
  let attempts = 0;
  while (attempts < 5) {
    const { data: existing, error: selectError } = await supabase
      .from("tickets")
      .select("ticket_code")
      .eq("ticket_code", ticketCode)
      .maybeSingle();
    if (selectError) {
      // Under current RLS the anon_select_by_code policy blocks direct SELECT
      // for anon — log it so it's visible, but don't abort (the insert will
      // still work; collision risk at 1-in-9000 is acceptable for now).
      console.error("[raise-ticket] Collision-check SELECT error:", selectError);
      break;
    }
    if (!existing) break;
    ticketCode = generateTicketCode();
    attempts++;
  }

  // --- Insert ticket row ---
  const payload: Record<string, unknown> = {
    ticket_code: ticketCode,
    raiser_name: isAnonymous ? null : raiserName,
    room_no: isAnonymous ? "" : roomNo,
    phone_no: isAnonymous || !phoneNo ? null : phoneNo,
    tag,
    description,
    photo_url: photoUrl,
    is_anonymous: isAnonymous,
    status: "Open",
  };
  console.log("[raise-ticket] Inserting payload:", JSON.stringify(payload));

  let { data: inserted, error: insertError } = await supabase
    .from("tickets")
    .insert(payload)
    .select("*")
    .single();

  // Resilient fallback: if the Supabase database does not have the `phone_no` column yet,
  // retry without `phone_no` and append phone to the description so tickets never fail to submit.
  if (
    insertError &&
    (insertError.message?.includes("phone_no") ||
      insertError.code === "PGRST204" ||
      insertError.code === "42703")
  ) {
    console.warn(
      "[raise-ticket] `phone_no` column not found in tickets table. Retrying insert without phone_no column..."
    );
    const fallbackPayload: Record<string, unknown> = {
      ticket_code: ticketCode,
      raiser_name: isAnonymous ? null : raiserName,
      room_no: isAnonymous ? "" : roomNo,
      tag,
      description:
        !isAnonymous && phoneNo
          ? `${description}\n\n[Contact Phone: ${phoneNo}]`
          : description,
      photo_url: photoUrl,
      is_anonymous: isAnonymous,
      status: "Open",
    };
    const { data: fallbackData, error: fallbackError } = await supabase
      .from("tickets")
      .insert(fallbackPayload)
      .select("*")
      .single();
    inserted = fallbackData;
    insertError = fallbackError;
  }

  if (insertError) {
    // Log full error object — .message alone often omits the Postgres error
    // code, detail, and hint which are essential for debugging.
    console.error("[raise-ticket] Insert error (full):", insertError);
    console.error("[raise-ticket] Insert error message:", insertError.message);
    return {
      success: false,
      error: "Failed to save your ticket. Please try again.",
    };
  }

  // Build the printable ticket: swap the stored storage key for a signed URL
  let ticket: Ticket | null = null;
  if (inserted) {
    const signed = photoUrl ? await getTicketPhotoSignedUrl(photoUrl, 3600) : null;
    ticket = { ...(inserted as Ticket), photo_url: signed ?? null };
  }

  return { success: true, ticket_code: ticketCode, ticket };
}
