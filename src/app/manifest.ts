import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Swami Vivekanand Bhavan — HMC",
    short_name: "SV Bhavan HMC",
    description:
      "Hostel Management Committee portal for Swami Vivekanand Bhavan at SVNIT Surat. Raise complaints, track tickets, view mess menu and contacts.",
    start_url: "/",
    display: "standalone",
    background_color: "#FBF8F3",
    theme_color: "#0B1424",
    icons: [
      {
        src: "/HMC_logo.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
