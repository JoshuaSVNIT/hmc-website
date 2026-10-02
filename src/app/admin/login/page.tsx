"use client";

import { useTransition, useState } from "react";
import Link from "next/link";
import { loginWithEmail } from "../actions";

export default function AdminLoginPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await loginWithEmail(formData);
      if (!result.success) setError(result.error);
    });
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: "var(--color-ink)" }}
    >
      <div className="w-full max-w-sm">
        {/* Branding */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded mb-3 font-bold text-base"
            style={{
              backgroundColor: "var(--color-accent-secondary)",
              color: "#fff",
              fontFamily: "var(--font-ibm-plex-mono), monospace",
            }}
          >
            SV
          </div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{
              color: "var(--color-paper)",
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
            }}
          >
            HMC Committee Login
          </h1>
          <p className="mt-1 text-xs" style={{ color: "rgba(243,241,235,0.5)" }}>
            Swami Vivekanand Bhavan administrative access
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded border p-6 sm:p-7"
          style={{
            backgroundColor: "rgba(255,255,255,0.03)",
            borderColor: "rgba(255,255,255,0.1)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {error && (
              <div
                role="alert"
                className="rounded border p-3 text-xs"
                style={{
                  backgroundColor: "rgba(179,63,46,0.15)",
                  borderColor: "rgba(179,63,46,0.35)",
                  color: "var(--color-accent-urgent-200)",
                }}
              >
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium mb-1.5"
                style={{ color: "var(--color-paper)" }}
              >
                Account Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="member@svbhavan.in"
                className="w-full rounded border px-3 py-2 text-sm transition focus:outline-none focus:ring-1"
                style={{
                  borderColor: "rgba(255,255,255,0.18)",
                  backgroundColor: "rgba(0,0,0,0.25)",
                  color: "var(--color-paper)",
                  fontFamily: "var(--font-ibm-plex-mono), monospace",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium mb-1.5"
                style={{ color: "var(--color-paper)" }}
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="w-full rounded border px-3 py-2 text-sm transition focus:outline-none focus:ring-1"
                style={{
                  borderColor: "rgba(255,255,255,0.18)",
                  backgroundColor: "rgba(0,0,0,0.25)",
                  color: "var(--color-paper)",
                }}
              />
            </div>

            <button
              id="admin-login-btn"
              type="submit"
              disabled={isPending}
              className="w-full py-2.5 px-4 rounded text-xs font-semibold transition-colors mt-2 cursor-pointer disabled:opacity-50"
              style={{
                backgroundColor: "var(--color-accent-primary)",
                color: "var(--color-ink)",
                fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
              }}
            >
              {isPending ? "Authenticating…" : "Sign In"}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center space-y-2">
          <p className="text-xs" style={{ color: "rgba(243,241,235,0.4)" }}>
            Access restricted to authorized committee members and wardens.
          </p>
          <Link
            href="/"
            className="text-xs underline block transition-colors"
            style={{ color: "rgba(243,241,235,0.6)" }}
          >
            ← Back to Public Portal
          </Link>
        </div>
      </div>
    </main>
  );
}
