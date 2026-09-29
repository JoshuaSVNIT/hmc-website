"use client";

/**
 * ContactAvatar
 *
 * Renders a circular photo when the `photoUrl` prop is provided AND the image
 * loads successfully.  Falls back to a circular emoji placeholder in two cases:
 *   1. `photoUrl` is null/undefined (photo field empty in Sanity).
 *   2. The image element fires an `onError` event at runtime (broken URL, CDN
 *      timeout, etc.) — we swap the img out for the emoji circle via state.
 *
 * The outer wrapper always has the same fixed size so the surrounding layout
 * never shifts regardless of which state is active.
 */

import { useState } from "react";

interface ContactAvatarProps {
  /** Pre-built Sanity CDN URL, or null if the photo field is empty. */
  photoUrl: string | null;
  /** Emoji fallback displayed when photo is absent or fails to load. */
  icon: string | null;
  /** Default emoji shown when both photo and icon are absent. */
  defaultEmoji?: string;
  /** Tailwind size class applied to the circle, e.g. "w-10 h-10". */
  sizeClass?: string;
  /** Extra Tailwind classes for the circle background (fallback state). */
  fallbackBgClass?: string;
  /** Alt text for the photo image. */
  alt?: string;
}

export default function ContactAvatar({
  photoUrl,
  icon,
  defaultEmoji = "📞",
  sizeClass = "w-10 h-10",
  fallbackBgClass = "bg-slate-100",
  alt = "",
}: ContactAvatarProps) {
  // Start in "photo" mode if a URL is provided; switch to "fallback" on error.
  const [useFallback, setUseFallback] = useState(!photoUrl);

  const emoji = icon ?? defaultEmoji;

  if (!useFallback && photoUrl) {
    return (
      <span
        className={`${sizeClass} rounded-full overflow-hidden shrink-0 block`}
        aria-hidden="true"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoUrl}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setUseFallback(true)}
        />
      </span>
    );
  }

  // Emoji fallback — same outer shape as the photo so layout is stable.
  return (
    <span
      className={`${sizeClass} ${fallbackBgClass} rounded-full flex items-center justify-center shrink-0 text-xl leading-none`}
      aria-hidden="true"
    >
      {emoji}
    </span>
  );
}
