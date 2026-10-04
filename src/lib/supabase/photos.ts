import { createAdminClient } from "@/lib/supabase/server";

export const TICKET_PHOTOS_BUCKET = "ticket-photos";

/**
 * Generate the standardized storage path (filename) for a ticket photo in the bucket.
 * Stored as a bare relative filename at the bucket root, avoiding bucket-name duplication
 * or leading slashes which cause Supabase Storage "Object not found" (404 / NoSuchKey) errors.
 */
export function buildTicketPhotoPath(originalFilename: string): string {
  const ext = originalFilename.split(".").pop()?.toLowerCase() ?? "jpg";
  const sanitizedExt = ext.replace(/[^a-z0-9]/g, "");
  const randomSuffix = Math.random().toString(36).slice(2);
  return `${Date.now()}-${randomSuffix}.${sanitizedExt || "jpg"}`;
}

/**
 * Extract and normalize a clean storage path from whatever is stored in the database.
 * Handles:
 * - Legacy public URLs:
 *   "https://.../storage/v1/object/public/ticket-photos/1791014656139-xpi8uduv9e.png"
 * - Legacy signed URLs:
 *   "https://.../storage/v1/object/sign/ticket-photos/1791014656139-xpi8uduv9e.png?token=..."
 * - Bucket-prefixed paths:
 *   "ticket-photos/1791014656139-xpi8uduv9e.png"
 * - Leading-slash paths:
 *   "/ticket-photos/..." or "/1791014656139-xpi8uduv9e.png"
 * - Query strings and hashes:
 *   "1791014656139-xpi8uduv9e.png?token=..."
 * - Standard modern storage paths:
 *   "1791014656139-xpi8uduv9e.png"
 */
export function extractPhotoStoragePath(
  photoUrl: string | null | undefined
): string | null {
  if (!photoUrl) return null;
  let clean = photoUrl.trim();
  if (!clean) return null;

  // If it's a URL or contains bucket name segment
  const bucketSegment = `${TICKET_PHOTOS_BUCKET}/`;
  const idx = clean.indexOf(bucketSegment);
  if (idx !== -1) {
    clean = clean.slice(idx + bucketSegment.length);
  }

  // Strip query parameters and hash fragments (e.g. tokens in signed URLs)
  clean = clean.split("?")[0].split("#")[0];

  // Strip leading and trailing slashes
  clean = clean.replace(/^\/+|\/+$/g, "").trim();

  // URL-decode if needed
  try {
    clean = decodeURIComponent(clean);
  } catch {
    // Keep as is if decode fails
  }

  return clean || null;
}

/**
 * Upload a ticket photo to the "ticket-photos" bucket using the standardized path builder.
 * Returns the relative storage path to be stored in the tickets table (e.g. "1791...-xyz.png").
 */
export async function uploadTicketPhoto(
  file: File | Blob,
  fileName?: string
): Promise<{ path: string; error?: never } | { path?: never; error: string }> {
  try {
    const adminSupabase = await createAdminClient();
    const resolvedName = buildTicketPhotoPath(
      fileName || (file instanceof File ? file.name : "photo.jpg")
    );
    const arrayBuffer = await file.arrayBuffer();

    const { data: uploadData, error: uploadError } = await adminSupabase.storage
      .from(TICKET_PHOTOS_BUCKET)
      .upload(resolvedName, arrayBuffer, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      console.error("[photos] Photo upload error:", uploadError);
      return { error: uploadError.message };
    }

    if (!uploadData?.path) {
      return { error: "Missing storage path in upload response." };
    }

    const cleanPath = extractPhotoStoragePath(uploadData.path) || uploadData.path;
    return { path: cleanPath };
  } catch (err: any) {
    console.error("[photos] Exception during photo upload:", err);
    return { error: err?.message || "Failed to upload photo." };
  }
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
      .from(TICKET_PHOTOS_BUCKET)
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
