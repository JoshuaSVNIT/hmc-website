import { NextResponse } from "next/server";
import { getAllNotices, getAllContacts } from "@/lib/sanity/queries";

export const revalidate = 60; // Cache for 60 seconds

export type SearchItem = {
  id: string;
  title: string;
  subtitle: string;
  category: "Notice" | "Contact" | "Service" | "Guide" | "Dining" | "Emergency" | "Page";
  href: string;
  keywords: string[];
};

export async function GET() {
  try {
    const [notices, contacts] = await Promise.all([
      getAllNotices(),
      getAllContacts(),
    ]);

    const staticItems: SearchItem[] = [
      {
        id: "srv-raise",
        title: "Raise a Ticket",
        subtitle: "Submit LAN, electrical, mess, or plumbing request",
        category: "Service",
        href: "/raise-ticket",
        keywords: ["complaint", "ticket", "issue", "repair", "wifi", "lan", "electricity", "plumbing", "fan"],
      },
      {
        id: "srv-track",
        title: "Track Ticket Status",
        subtitle: "Check progress and resolution of your submitted ticket",
        category: "Service",
        href: "/track-ticket",
        keywords: ["status", "resolved", "tracking", "in progress", "ticket id"],
      },
      {
        id: "srv-mess",
        title: "Weekly Mess Menu",
        subtitle: "7-day Breakfast, Lunch, and Dinner central dining schedule",
        category: "Dining",
        href: "/mess-menu",
        keywords: ["mess", "menu", "food", "dining", "breakfast", "lunch", "dinner", "meal", "dues", "caterer"],
      },
      {
        id: "srv-facilities",
        title: "Facilities & Common Rooms",
        subtitle: "Study spaces, TV lounges, and amenities on floors 2 to 8",
        category: "Service",
        href: "/facilities",
        keywords: ["common room", "study room", "tv room", "amenities", "floor", "wing", "facilities"],
      },
      {
        id: "srv-reforms",
        title: "Our Reforms & Completed Works",
        subtitle: "Documented timeline of hostel upgrades, renovations, and welfare policies",
        category: "Page",
        href: "/reforms",
        keywords: ["reforms", "reform", "initiatives", "works", "timeline", "completed", "projects", "upgrades", "renovations", "progress"],
      },
      {
        id: "srv-room-cleaning",
        title: "Room Cleaning Duty List",
        subtitle: "Hostel boys floor-wise duty roster and staff contact numbers (2025–26)",
        category: "Service",
        href: "/room-cleaning",
        keywords: ["cleaning", "room cleaning", "sweeper", "maid", "floor", "housekeeping", "duty", "staff", "roster"],
      },
      {
        id: "srv-lan",
        title: "LAN & Internet Setup Guide",
        subtitle: "Wi-Fi router configuration, proxy settings, and troubleshooting",
        category: "Guide",
        href: "/guides/lan",
        keywords: ["wifi", "proxy", "network", "ethernet", "router", "internet", "lan guide"],
      },
      {
        id: "srv-electrical",
        title: "Electrical Appliances & Safety Guide",
        subtitle: "Permitted appliances, wattage restrictions, room safety rules",
        category: "Guide",
        href: "/guides/electrical",
        keywords: ["power", "kettle", "iron", "heater", "wattage", "appliance", "electrical guide"],
      },
      {
        id: "srv-gallery",
        title: "Photo Gallery",
        subtitle: "Hostel life, events, and campus moments at SV Bhavan",
        category: "Page",
        href: "/gallery",
        keywords: ["gallery", "photos", "pictures", "album", "campus", "hostel life"],
      },
      {
        id: "srv-about",
        title: "About HMC Committee",
        subtitle: "Elected student representatives, secretaries, and wardens",
        category: "Page",
        href: "/about",
        keywords: ["about", "hmc", "team", "warden", "council", "secretaries", "representatives"],
      },
      {
        id: "srv-contacts-all",
        title: "Directory & Helplines",
        subtitle: "Complete hostel contact directory for supervisors and members",
        category: "Contact",
        href: "/contacts",
        keywords: ["contact", "phone", "helpline", "numbers", "directory"],
      },
      {
        id: "srv-emergency-all",
        title: "Emergency Contacts",
        subtitle: "Immediate medical, security, and dispensary assistance",
        category: "Emergency",
        href: "/contacts",
        keywords: ["emergency", "ambulance", "hospital", "dispensary", "urgent", "security"],
      },
    ];

    // Real notices from Sanity
    const noticeItems: SearchItem[] = notices.map((n) => ({
      id: `notice-${n._id}`,
      title: n.title,
      subtitle: n.date
        ? `Notice · ${new Date(n.date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}`
        : "Official Notice",
      category: "Notice",
      href: "/notices",
      keywords: [
        "notice",
        "circular",
        "announcement",
        "order",
        ...n.title.toLowerCase().split(/\s+/),
      ],
    }));

    // Real contacts from Sanity
    const contactItems: SearchItem[] = contacts.map((c) => ({
      id: `contact-${c._id}`,
      title: c.label,
      subtitle: `${c.category}${c.title ? ` · ${c.title}` : ""} · ${c.phone}`,
      category:
        c.category === "Emergency"
          ? "Emergency"
          : c.category === "Supervisor"
          ? "Contact"
          : "Contact",
      href: "/contacts",
      keywords: [
        "phone",
        "call",
        c.phone,
        c.category.toLowerCase(),
        ...(c.title ? c.title.toLowerCase().split(/\s+/) : []),
        ...c.label.toLowerCase().split(/\s+/),
      ],
    }));

    return NextResponse.json({
      items: [...staticItems, ...noticeItems, ...contactItems],
    });
  } catch (err) {
    console.error("Search API error:", err);
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}

