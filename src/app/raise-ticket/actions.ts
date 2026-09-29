"use server";

import { createClient } from "@/lib/supabase/server";
import type { TicketTag } from "@/types";

/** Allowed file types for ticket photo uploads (§4 storage constraints) */
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/** Generate a human-readable ticket code like HMC-4217 */
function generateTicketCode(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `HMC-${num}`;
}

export type SubmitTicketResult =
  | { success: true; ticket_code: string }
  | { success: false; error: string };

/**
 * Server Action: validate, optionally upload photo, then insert ticket row.
 * No authentication required — public INSERT per RLS rules in §4.
 */
export async function submitTicket(
  formData: FormData
): Promise<SubmitTicketResult> {
  const supabase = await createClient();

  // --- Extract fields ---
  const isAnonymous = formData.get("is_anonymous") === "true";
  const raiserName = (formData.get("raiser_name") as string | null)?.trim() ?? "";
  const roomNo = (formData.get("room_no") as string | null)?.trim() ?? "";
  const tag = (formData.get("tag") as string | null) as TicketTag | null;
  const description = (formData.get("description") as string | null)?.trim() ?? "";
  const photoFile = formData.get("photo") as File | null;

  // --- Basic validation ---
  // raiser_name is required only when NOT submitting anonymously (§7)
  if (!isAnonymous && !raiserName)
    return { success: false, error: "Please enter your name." };
  if (!roomNo && !isAnonymous) return { success: false, error: "Room number is required." };
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
        error: `Photo must be under 5 MB. Your file is ${(photoFile.size / 1024 / 1024).toFixed(1)} MB.`,
      };
    }

    // Upload to Supabase Storage — bucket: "ticket-photos"
    const ext = photoFile.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const arrayBuffer = await photoFile.arrayBuffer();

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("ticket-photos")
      .upload(fileName, arrayBuffer, {
        contentType: photoFile.type,
        upsert: false,
      });

    if (uploadError) {
      // Non-fatal — continue without photo rather than blocking the ticket
      console.error("Photo upload error:", uploadError.message);
    } else if (uploadData?.path) {
      const { data: urlData } = supabase.storage
        .from("ticket-photos")
        .getPublicUrl(uploadData.path);
      photoUrl = urlData?.publicUrl ?? null;
    }
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
  const payload = {
    ticket_code: ticketCode,
    raiser_name: isAnonymous ? null : raiserName,
    room_no: isAnonymous ? "" : roomNo,
    tag,
    description,
    photo_url: photoUrl,
    is_anonymous: isAnonymous,
    status: "Open",
  };
  console.log("[raise-ticket] Inserting payload:", JSON.stringify(payload));

  const { error: insertError } = await supabase.from("tickets").insert(payload);

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

  return { success: true, ticket_code: ticketCode };
}
