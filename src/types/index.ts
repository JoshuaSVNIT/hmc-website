/** Supabase `tickets` table row, matching schema in PROJECT_SPEC.md §4 */
export type TicketTag =
  | "Mess"
  | "Electrical"
  | "Plumbing/Water"
  | "Elevator"
  | "Cleanliness"
  | "Pests"
  | "Others";
export type TicketStatus = "Open" | "In Progress" | "Resolved";

export interface Ticket {
  id: string;
  ticket_code: string;
  raiser_name: string | null;
  room_no: string;
  phone_no?: string | null;
  tag: TicketTag;
  description: string;
  photo_url: string | null;
  status: TicketStatus;
  admin_notes: string | null;
  is_anonymous: boolean;
  created_at: string;
  updated_at: string;
}

/** Supabase `contacts` table row */
export type ContactCategory =
  | "Ambulance"
  | "Dispensary"
  | "Night Supervisor"
  | "HMC Member";

export interface Contact {
  id: string;
  category: ContactCategory;
  name: string | null;
  phone: string;
  notes: string | null;
}

/** Supabase `leaderboard_entries` table row */
export type Game = "BGMI" | "Free Fire";

export interface LeaderboardEntry {
  id: string;
  player_name: string;
  room_no: string | null;
  game: Game;
  score: number;
  updated_at: string;
}
