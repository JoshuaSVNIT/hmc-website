"use client";

import { useEffect, useState, type ReactNode } from "react";

export default function EmergencySectionWrapper({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const trigger = () => {
      setIsHighlighted(false);
      requestAnimationFrame(() => {
        setIsHighlighted(true);
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          setIsHighlighted(false);
        }, 1900);
      });
    };

    // Check on initial page load / mount
    if (typeof window !== "undefined" && window.location.hash === "#emergency-banner") {
      trigger();
    }

    const onHashChange = () => {
      if (window.location.hash === "#emergency-banner") {
        trigger();
      }
    };

    const onCustomHighlight = () => {
      trigger();
    };

    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("trigger-emergency-highlight", onCustomHighlight);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("trigger-emergency-highlight", onCustomHighlight);
    };
  }, []);

  return (
    <div
      className={`card-surface p-5 sm:p-6 border border-rose-100 shadow-md emergency-card-target transition-all duration-300 ${
        isHighlighted ? "emergency-boundary-highlight" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
