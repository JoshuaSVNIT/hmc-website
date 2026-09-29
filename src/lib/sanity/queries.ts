import { client } from "@/sanity/lib/client";

// ─── Shared fetch options ──────────────────────────────────────────────────────

const REVALIDATE_5MIN = { next: { revalidate: 300 } };

// ─── Contact (§5) ─────────────────────────────────────────────────────────────

export type ContactCategory = "Emergency" | "Supervisor" | "HMC Member";

// Minimal shape of the Sanity image reference returned by the GROQ projection below.
export interface SanityContactPhoto {
  asset: { _ref: string; _type: string } | null;
  hotspot?: { x: number; y: number; height: number; width: number } | null;
  crop?: unknown;
}

export interface SanityContact {
  _id: string;
  category: ContactCategory;
  label: string;
  title: string | null;
  phone: string;
  order: number;
  icon: string | null;
  photo: SanityContactPhoto | null;
}

const ALL_CONTACTS_QUERY = `
  *[_type == "contact"] | order(order asc) {
    _id, category, label, title, phone, order, icon,
    photo { asset, hotspot, crop }
  }
`;

const HOMEPAGE_CONTACTS_QUERY = `
  *[_type == "contact" && (category in ["Emergency", "Supervisor", "Supervisors"] || lower(category) in ["emergency", "supervisor", "supervisors"]) && !(lower(category) match "*hmc*")] | order(order asc) {
    _id, category, label, title, phone, order, icon,
    photo { asset, hotspot, crop }
  }
`;

export async function getAllContacts(): Promise<SanityContact[]> {
  try {
    return await client.fetch<SanityContact[]>(ALL_CONTACTS_QUERY, {}, { next: { revalidate: 60 } });
  } catch (err) {
    console.error("Error fetching all contacts:", err);
    return [];
  }
}

export async function getHomepageContacts(): Promise<SanityContact[]> {
  try {
    return await client.fetch<SanityContact[]>(HOMEPAGE_CONTACTS_QUERY, {}, { next: { revalidate: 60 } });
  } catch (err) {
    console.error("Error fetching homepage contacts:", err);
    return [];
  }
}

// ─── Notice (§5) ──────────────────────────────────────────────────────────────

// The `body` field is Portable Text — an array of block objects.
// We type it as unknown[] here; @portabletext/react handles the rendering.
export interface SanityNotice {
  _id: string;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any[] | null;
  date: string;
  pinned: boolean;
}

const ALL_NOTICES_QUERY = `
  *[_type == "notice"] | order(pinned desc, date desc) {
    _id, title, body, date, pinned
  }
`;

export async function getAllNotices(): Promise<SanityNotice[]> {
  return client.fetch<SanityNotice[]>(ALL_NOTICES_QUERY, {}, REVALIDATE_5MIN);
}

// ─── GalleryItem (§5) ─────────────────────────────────────────────────────────

export interface SanityGalleryItem {
  _id: string;
  title: string | null;
  // Sanity image references array — passed to urlFor() from @/sanity/lib/image
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  images: any[] | null;
  eventName: string | null;
  date: string | null; // ISO date string (date type in schema)
}

const ALL_GALLERY_QUERY = `
  *[_type == "galleryItem"] | order(date desc) {
    _id, title, images, eventName, date
  }
`;

export async function getAllGalleryItems(): Promise<SanityGalleryItem[]> {
  return client.fetch<SanityGalleryItem[]>(ALL_GALLERY_QUERY, {}, REVALIDATE_5MIN);
}

// ─── Event (§5) ───────────────────────────────────────────────────────────────

export interface SanityEvent {
  _id: string;
  title: string;
  description: string | null;
  date: string | null; // ISO datetime string
  googleFormUrl: string | null;
}

const ALL_EVENTS_QUERY = `
  *[_type == "event"] | order(date asc) {
    _id, title, description, date, googleFormUrl
  }
`;

export async function getAllEvents(): Promise<SanityEvent[]> {
  return client.fetch<SanityEvent[]>(ALL_EVENTS_QUERY, {}, REVALIDATE_5MIN);
}

