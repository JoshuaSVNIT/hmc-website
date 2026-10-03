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

const HMC_MEMBERS_QUERY = `
  *[_type == "contact" && (category == "HMC Member" || lower(category) in ["hmc member", "hmc", "hmc members"] || lower(category) match "*hmc*")] | order(order asc) {
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

export async function getHMCMembers(): Promise<SanityContact[]> {
  try {
    return await client.fetch<SanityContact[]>(HMC_MEMBERS_QUERY, {}, { next: { revalidate: 60 } });
  } catch (err) {
    console.error("Error fetching HMC members:", err);
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
  try {
    return await client.fetch<SanityNotice[]>(ALL_NOTICES_QUERY, {}, REVALIDATE_5MIN);
  } catch (err) {
    console.error("Error fetching notices:", err);
    return [];
  }
}

const LATEST_NOTICES_QUERY = `
  *[_type == "notice"] | order(pinned desc, date desc) [0...4] {
    _id, title, body, date, pinned
  }
`;

export async function getLatestNotices(): Promise<SanityNotice[]> {
  try {
    return await client.fetch<SanityNotice[]>(LATEST_NOTICES_QUERY, {}, REVALIDATE_5MIN);
  } catch (err) {
    console.error("Error fetching latest notices:", err);
    return [];
  }
}

// ─── GalleryItem (§5) ─────────────────────────────────────────────────────────

export interface SanityGalleryVideo {
  _key?: string;
  _type?: string;
  videoUrl: string;
}

export interface SanityGalleryItem {
  _id: string;
  title: string | null;
  // Sanity image references array — passed to urlFor() from @/sanity/lib/image
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  images: any[] | null;
  videos?: SanityGalleryVideo[] | null;
  eventName: string | null;
  date: string | null; // ISO date string (date type in schema)
}

const ALL_GALLERY_QUERY = `
  *[_type == "galleryItem"] | order(date desc) {
    _id, title, images, videos, eventName, date
  }
`;

export async function getAllGalleryItems(): Promise<SanityGalleryItem[]> {
  try {
    return await client.fetch<SanityGalleryItem[]>(ALL_GALLERY_QUERY, {}, REVALIDATE_5MIN);
  } catch (err) {
    console.error("Error fetching gallery items:", err);
    return [];
  }
}

// ─── Event (§5) ───────────────────────────────────────────────────────────────

export interface SanityEvent {
  _id: string;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  description: any[] | string | null;
  date: string | null; // ISO datetime string
  googleFormUrl: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image?: any | null;
  icon?: string | null;
}

const ALL_EVENTS_QUERY = `
  *[_type == "event"] | order(date asc) {
    _id, title, description, date, googleFormUrl, image, icon
  }
`;

export async function getAllEvents(): Promise<SanityEvent[]> {
  try {
    return await client.fetch<SanityEvent[]>(ALL_EVENTS_QUERY, {}, REVALIDATE_5MIN);
  } catch (err) {
    console.error("Error fetching events:", err);
    return [];
  }
}

// ─── TeamMember ──────────────────────────────────────────────────────────────

export interface SanityTeamMember {
  _id: string;
  name: string;
  position: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bio: any[] | null;
  // Sanity image reference or null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  photo?: any | null;
}

const ALL_TEAM_MEMBERS_QUERY = `
  *[_type == "teamMember"] | order(position asc, name asc) {
    _id, name, position, bio,
    photo { asset, hotspot, crop }
  }
`;

export async function getAllTeamMembers(): Promise<SanityTeamMember[]> {
  try {
    return await client.fetch<SanityTeamMember[]>(
      ALL_TEAM_MEMBERS_QUERY,
      {},
      REVALIDATE_5MIN
    );
  } catch (err) {
    console.error("Error fetching team members:", err);
    return [];
  }
}

// ─── MessMenu ────────────────────────────────────────────────────────────────

export interface SanityMessMenu {
  _id: string;
  day: string;
  breakfast?: string | null;
  lunch?: string | null;
  dinner?: string | null;
}

const ALL_MESS_MENUS_QUERY = `
  *[_type == "messMenu"] {
    _id, day, breakfast, lunch, dinner
  }
`;

export async function getAllMessMenus(): Promise<SanityMessMenu[]> {
  try {
    return await client.fetch<SanityMessMenu[]>(
      ALL_MESS_MENUS_QUERY,
      {},
      REVALIDATE_5MIN
    );
  } catch (err) {
    console.error("Error fetching all mess menus:", err);
    return [];
  }
}

const TODAY_MESS_MENU_QUERY = `
  *[_type == "messMenu" && lower(day) == lower($day)][0] {
    _id, day, breakfast, lunch, dinner
  }
`;

export async function getTodayMessMenu(dayName: string): Promise<SanityMessMenu | null> {
  try {
    return await client.fetch<SanityMessMenu | null>(
      TODAY_MESS_MENU_QUERY,
      { day: dayName },
      { next: { revalidate: 300 } }
    );
  } catch (err) {
    console.error("Error fetching today's mess menu:", err);
    return null;
  }
}

// ─── CommonRoom (§7) ─────────────────────────────────────────────────────────

export interface SanityCommonRoom {
  _id: string;
  wing: string;
  floor: number;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image?: any | null;
  icon?: string | null;
  contactName?: string | null;
  contactPhone?: string | null;
}

const ALL_COMMON_ROOMS_QUERY = `
  *[_type == "commonRoom"] | order(floor asc, wing asc) {
    _id, wing, floor, label, image, icon, contactName, contactPhone
  }
`;

export async function getAllCommonRooms(): Promise<SanityCommonRoom[]> {
  try {
    return await client.fetch<SanityCommonRoom[]>(
      ALL_COMMON_ROOMS_QUERY,
      {},
      { next: { revalidate: 0 } }
    );
  } catch (err) {
    console.error("Error fetching common rooms:", err);
    return [];
  }
}

// ─── Reform ──────────────────────────────────────────────────────────────────

export interface SanityReformGalleryRef {
  _id: string;
  title: string | null;
  eventName: string | null;
}

export interface SanityReform {
  _id: string;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any[] | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  coverPhoto?: any | null;
  icon?: string | null;
  galleryLink?: SanityReformGalleryRef | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  photos?: any[] | null;
  date: string;
  sortOrder: number;
}

const ALL_REFORMS_QUERY = `
  *[_type == "reform"] | order(sortOrder asc, date desc) {
    _id,
    title,
    body,
    coverPhoto,
    icon,
    galleryLink->{
      _id,
      title,
      eventName
    },
    photos,
    date,
    sortOrder
  }
`;

export async function getAllReforms(): Promise<SanityReform[]> {
  try {
    return await client.fetch<SanityReform[]>(
      ALL_REFORMS_QUERY,
      {},
      { next: { revalidate: 60 } }
    );
  } catch (err) {
    console.error("Error fetching reforms:", err);
    return [];
  }
}



