import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep warm charcoal-teal — replaces the old generic blue palette.
        // Red and yellow roles are unchanged.
        primary: {
          50:  "#f0f4f8",
          100: "#d9e4ee",
          200: "#b0c8da",
          300: "#7da8be",
          400: "#4e869e",
          500: "#326780",
          600: "#255168",
          700: "#1d3f54",
          800: "#152e3e",
          900: "#0f2030",
          950: "#09151f",
          DEFAULT: "#255168",
        },
        urgent: {
          50:  "#fef2f2",
          100: "#fee2e2",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          DEFAULT: "#ef4444",
        },
        cta: {
          50:  "#fefce8",
          100: "#fef9c3",
          400: "#facc15",
          500: "#eab308",
          600: "#ca8a04",
          DEFAULT: "#eab308",
        },
      },
    },
  },
  plugins: [],
};

export default config;
