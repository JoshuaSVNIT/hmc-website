import { createAdminClient } from "@/lib/supabase/server";

/**
 * Extract clean storage path from a photoUrl.
 * Handles both legacy full URLs:
 *   "https://.../storage/v1/object/public/ticket-photos/1791014656139-xpi8uduv9e.png"
 * and modern clean storage paths:
 *   "1791014656139-xpi8uduv9e.png"
 */
export function extractPhotoStoragePath(
  photoUrl: string | null | undefined
): string | null {
  if (!photoUrl) return null;
  let clean = photoUrl.trim();
  if (clean.includes("/ticket-photos/")) {
    clean = clean.split("/ticket-photos/")[1];
  }
  clean = clean.split("?")[0];
  return clean || null;
}

/**
 * Generate a short-lived signed URL for a ticket photo stored in the private "ticket-photos" bucket.
 * Uses the server-only admin client (SUPABASE_SECRET_KEY).
 *
 * @param photoUrl - Path or legacy URL stored in tickets table
 * @param expiresIn - Time in seconds before URL expires (default: 3600 = 1 hour)
 */
export async function getTicketPhotoSignedUrl(
  photoUrl: string | null | undefined,
  expiresIn: number = 3600
): Promise<string | null> {
  const path = extractPhotoStoragePath(photoUrl);
  if (!path) return null;

  try {
    const adminSupabase = await createAdminClient();
    const { data, error } = await adminSupabase.storage
      .from("ticket-photos")
      .createSignedUrl(path, expiresIn);

    if (error) {
      console.error("[photos] Error creating signed URL for:", path, error.message);
      return null;
    }

    return data?.signedUrl ?? null;
  } catch (err) {
    console.error("[photos] Exception generating signed URL:", err);
    return null;
  }
}
