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
      className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ backgroundColor: "var(--color-ink)" }}
    >
      {/* Ambient sapphire blue glow behind login card */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(37, 99, 235, 0.12) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 w-full max-w-sm">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 bg-white/95 border border-white/20 p-1 shadow-md shadow-blue-600/20">
            <img src="/HMC_logo.svg" alt="HMC Logo" className="w-full h-full object-contain" />
          </div>
          <h1
            className="text-2xl font-bold tracking-tight text-white"
            style={{
              fontFamily: "var(--font-cormorant), system-ui, sans-serif",
            }}
          >
            HMC Committee Login
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Swami Vivekanand Bhavan administrative access
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl border p-6 sm:p-7 shadow-xl backdrop-blur-sm"
          style={{
            backgroundColor: "rgba(255,255,255,0.04)",
            borderColor: "rgba(255,255,255,0.1)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {error && (
              <div
                role="alert"
                className="rounded-lg border p-3 text-xs bg-rose-950/50 border-rose-800 text-rose-300"
              >
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold mb-1.5 text-slate-200"
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
                className="w-full rounded-lg border px-3 py-2 text-sm transition focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                style={{
                  borderColor: "rgba(255,255,255,0.18)",
                  backgroundColor: "rgba(0,0,0,0.4)",
                  color: "#ffffff",
                  fontFamily: "var(--font-ibm-plex-mono), monospace",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold mb-1.5 text-slate-200"
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
                className="w-full rounded-lg border px-3 py-2 text-sm transition focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                style={{
                  borderColor: "rgba(255,255,255,0.18)",
                  backgroundColor: "rgba(0,0,0,0.4)",
                  color: "#ffffff",
                }}
              />
            </div>

            <button
              id="admin-login-btn"
              type="submit"
              disabled={isPending}
              className="w-full py-2.5 px-4 rounded-lg text-xs font-bold transition-all mt-2 cursor-pointer disabled:opacity-50 shadow-md shadow-blue-600/20 hover:shadow-blue-600/30 hover:brightness-105 active:scale-[0.99]"
              style={{
                backgroundColor: "var(--color-accent-primary)",
                color: "#ffffff",
                fontFamily: "var(--font-cormorant), system-ui, sans-serif",
              }}
            >
              {isPending ? "Authenticating…" : "Sign In"}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center space-y-2">
          <p className="text-xs text-slate-500">
            Access restricted to authorized committee members and wardens.
          </p>
          <Link
            href="/"
            className="text-xs underline block text-slate-400 hover:text-blue-400 transition-colors"
          >
            ← Back to Public Portal
          </Link>
        </div>
      </div>
    </main>
  );
}
