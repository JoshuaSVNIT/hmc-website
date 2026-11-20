import type { AnchorHTMLAttributes } from "react";
import { PhoneIcon } from "@/components/icons";

/**
 * Strips dashes and collapses whitespace so no displayed phone number shows a dash.
 */
export function formatPhoneDisplay(phone: string): string {
  if (!phone) return "";
  return phone.replace(/-/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * Returns a valid tel: URL scheme based on phone formatting rules:
 * - A 10-digit mobile number gives href +91XXXXXXXXXX
 * - 3-digit emergency numbers (108, 112) or landlines with STD code give digits only
 * - Only empty values or values containing letters return null (plain text, not a link)
 */
export function formatTelHref(phone: string): string | null {
  if (!phone) return null;

  // Values containing letters are not links
  if (/[a-zA-Z]/.test(phone)) return null;

  const digits = phone.replace(/\D/g, "");

  // Empty digits cannot be a link
  if (digits.length === 0) return null;

  // 10-digit mobile number gives href +91XXXXXXXXXX
  if (digits.length === 10) {
    return `tel:+91${digits}`;
  }

  // 12-digit number already prefixed with 91 country code
  if (digits.length === 12 && digits.startsWith("91")) {
    return `tel:+${digits}`;
  }

  // Emergency numbers (108, 112), landline with STD code, etc. give digits only
  return `tel:${digits}`;
}

export interface PhoneLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  phone: string;
  isUrgent?: boolean;
  showIcon?: boolean;
}

/**
 * Tap-to-call link with accessible 44px min tap height and monospace styling.
 * Displays plain text only if empty or containing letters.
 * Optional showIcon renders a 16px aria-hidden PhoneIcon inside the tap area.
 */
export function PhoneLink({
  phone,
  isUrgent = false,
  showIcon = false,
  className = "",
  style,
  ...props
}: PhoneLinkProps) {
  const telHref = formatTelHref(phone);
  const displayPhone = formatPhoneDisplay(phone);
  const colorClass = isUrgent
    ? "text-rose-700 hover:text-rose-800"
    : "text-blue-700 hover:text-blue-800";

  if (!telHref) {
    return (
      <span
        className={`min-h-[44px] inline-flex items-center gap-1.5 text-sm sm:text-base text-slate-700 ${className}`}
        style={{
          fontFamily: "var(--font-ibm-plex-mono), monospace",
          ...style,
        }}
      >
        {showIcon && (
          <PhoneIcon size={16} className="shrink-0" aria-hidden="true" />
        )}
        <span>{displayPhone}</span>
      </span>
    );
  }

  return (
    <a
      href={telHref}
      className={`min-h-[44px] inline-flex items-center gap-1.5 font-bold text-sm sm:text-base tracking-wide hover:underline ${colorClass} ${className}`}
      style={{
        fontFamily: "var(--font-ibm-plex-mono), monospace",
        ...style,
      }}
      {...props}
    >
      {showIcon && (
        <PhoneIcon size={16} className="shrink-0" aria-hidden="true" />
      )}
      <span>{displayPhone}</span>
    </a>
  );
}
