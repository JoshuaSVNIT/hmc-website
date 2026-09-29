"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import { submitTicket, type SubmitTicketResult } from "./actions";
import type { TicketTag } from "@/types";

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_BYTES = 5 * 1024 * 1024;

const TAG_OPTIONS: { value: TicketTag; label: string; emoji: string }[] = [
  { value: "Mess",           label: "Mess",             emoji: "🍽️" },
  { value: "Electrical",     label: "Electrical",        emoji: "⚡" },
  { value: "Plumbing/Water", label: "Plumbing / Water",  emoji: "🚿" },
  { value: "Elevator",       label: "Elevator",          emoji: "🛗" },
  { value: "Cleanliness",    label: "Cleanliness",       emoji: "🧹" },
  { value: "Pests",          label: "Pests",             emoji: "🐜" },
  { value: "Others",         label: "Others",            emoji: "📋" },
];

// ─── Success View ────────────────────────────────────────────────────────────

function SuccessView({
  ticketCode,
  onReset,
}: {
  ticketCode: string;
  onReset: () => void;
}) {
  const [copied, setCopied] = useState(false);

  // §7: Append to localStorage ONLY inside useEffect — never during initial render
  useEffect(() => {
    try {
      const raw = localStorage.getItem("hmc_recent_tickets");
      const existing: string[] = raw ? JSON.parse(raw) : [];
      if (!existing.includes(ticketCode)) {
        const updated = [ticketCode, ...existing].slice(0, 20); // keep last 20
        localStorage.setItem("hmc_recent_tickets", JSON.stringify(updated));
      }
    } catch {
      // localStorage unavailable (private mode etc.) — silently ignore
    }
  }, [ticketCode]);

  function handleCopy() {
    navigator.clipboard.writeText(ticketCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="flex flex-col items-center text-center py-10 px-4">
      {/* Print-only header — hidden on screen */}
      <div className="hidden print:block mb-6 text-left w-full max-w-lg">
        <h1 className="text-2xl font-bold text-black">Swami Vivekanand Bhavan HMC</h1>
        <p className="text-sm text-gray-600 mt-1">Hostel Management Committee — Complaint Ticket</p>
        <hr className="my-3 border-black" />
      </div>

      {/* Screen success animation */}
      <div className="print:hidden w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5 shadow-sm">
        <svg
          className="w-10 h-10 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h2 className="text-2xl font-extrabold text-slate-900 print:text-black">
        Ticket Submitted!
      </h2>
      <p className="text-slate-600 mt-2 max-w-sm print:text-black">
        Your complaint has been registered with the HMC. Keep your ticket code
        safe — you can use it to track the resolution status.
      </p>

      {/* Ticket Code block */}
      <div className="mt-8 w-full max-w-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 print:text-black">
          Your Ticket Code
        </p>
        <div className="flex items-center justify-between bg-slate-900 text-white rounded-xl px-5 py-4 shadow-lg print:bg-white print:text-black print:border-2 print:border-black print:rounded-none">
          <span className="text-3xl font-mono font-bold tracking-widest">
            {ticketCode}
          </span>
          {/* Copy button — hidden when printing */}
          <button
            id="copy-ticket-code-btn"
            onClick={handleCopy}
            className="print:hidden ml-4 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium flex items-center gap-1.5"
            aria-label="Copy ticket code"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500 print:hidden">
          Save this code — you&apos;ll need it to track your ticket on{" "}
          <a href="/track-ticket" className="text-blue-700 underline">
            Track Ticket
          </a>
          .
        </p>
      </div>

      {/* Print-only details */}
      <div className="hidden print:block mt-6 text-left w-full max-w-sm text-sm text-black">
        <p>Visit <strong>svbhavan.in/track-ticket</strong> to track your complaint status.</p>
        <p className="mt-1 text-gray-500 text-xs">Printed: {new Date().toLocaleString("en-IN")}</p>
      </div>

      {/* Action buttons — hidden when printing */}
      <div className="print:hidden mt-6 flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <button
          id="print-ticket-btn"
          onClick={handlePrint}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Ticket
        </button>
        <a
          href="/track-ticket"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-semibold transition-colors text-sm"
        >
          Track Status
        </a>
      </div>

      <button
        id="raise-another-ticket-btn"
        onClick={onReset}
        className="print:hidden mt-4 text-sm text-slate-500 hover:text-slate-700 underline"
      >
        Raise another ticket
      </button>
    </div>
  );
}

// ─── Photo Field ──────────────────────────────────────────────────────────────

function PhotoField({
  onChange,
}: {
  onChange: (error: string | null) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(null);
      setFileError(null);
      onChange(null);
      return;
    }

    // Client-side file type validation (§4 storage constraints)
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      const err = "Only .jpg, .png, or .webp images are accepted.";
      setFileError(err);
      setPreview(null);
      onChange(err);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    // Client-side 5 MB cap (§4 storage constraints)
    if (file.size > MAX_FILE_BYTES) {
      const err = `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum size is 5 MB.`;
      setFileError(err);
      setPreview(null);
      onChange(err);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setFileError(null);
    onChange(null);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleRemove() {
    setPreview(null);
    setFileError(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        Photo{" "}
        <span className="font-normal text-slate-400">(optional — max 5 MB, jpg/png/webp)</span>
      </label>

      {preview ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Preview"
            className="h-32 rounded-xl border border-slate-200 object-cover shadow-sm"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow"
            aria-label="Remove photo"
          >
            ✕
          </button>
        </div>
      ) : (
        <label
          htmlFor="photo-input"
          className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
        >
          <svg className="w-8 h-8 text-slate-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm text-slate-500">Tap to attach a photo</span>
          <span className="text-xs text-slate-400 mt-0.5">JPG, PNG, WEBP — up to 5 MB</span>
        </label>
      )}

      <input
        ref={inputRef}
        id="photo-input"
        name="photo"
        type="file"
        accept={ALLOWED_EXTENSIONS.join(",")}
        onChange={handleFile}
        className="sr-only"
      />

      {fileError && (
        <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {fileError}
        </p>
      )}
    </div>
  );
}

// ─── Main Form Component ───────────────────────────────────────────────────────

const ALLOW_ANONYMOUS =
  process.env.NEXT_PUBLIC_ALLOW_ANONYMOUS_TICKETS === "true";

export default function RaiseTicketForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<SubmitTicketResult | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (photoError) return; // block if photo validation failed

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      setServerError(null);
      try {
        const res = await submitTicket(formData);
        setResult(res);
        if (!res.success) setServerError(res.error);
      } catch {
        setServerError("An unexpected error occurred. Please try again.");
      }
    });
  }

  function handleReset() {
    setResult(null);
    setServerError(null);
    setPhotoError(null);
    setIsAnonymous(false);
    formRef.current?.reset();
  }

  if (result?.success) {
    return <SuccessView ticketCode={result.ticket_code} onReset={handleReset} />;
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Server/action error banner */}
      {serverError && (
        <div
          role="alert"
          className="flex items-start gap-3 bg-red-50 border border-red-300 rounded-xl px-4 py-3 text-sm text-red-800"
        >
          <svg className="w-5 h-5 shrink-0 mt-0.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{serverError}</span>
        </div>
      )}

      {/* Anonymous toggle — shown only when feature flag is on */}
      {ALLOW_ANONYMOUS && (
        <label
          htmlFor="anonymous-checkbox"
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <input
            id="anonymous-checkbox"
            name="is_anonymous"
            type="checkbox"
            value="true"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 accent-blue-700 cursor-pointer"
          />
          <span className="text-sm font-medium text-slate-700">
            Submit anonymously
            <span className="ml-1.5 text-xs font-normal text-slate-400">
              (your name and room number won&apos;t be recorded)
            </span>
          </span>
        </label>
      )}

      {/* Raiser name — hidden when submitting anonymously */}
      <div
        className={isAnonymous ? "hidden" : undefined}
        aria-hidden={isAnonymous}
      >
        <label htmlFor="raiser_name" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Your Name{" "}
          {!isAnonymous && <span className="text-red-500">*</span>}
        </label>
        <input
          id="raiser_name"
          name="raiser_name"
          type="text"
          placeholder="e.g. Arjun Sharma"
          required={!isAnonymous}
          disabled={isAnonymous}
          maxLength={120}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50"
        />
      </div>

      {/* Room Number — hidden when submitting anonymously */}
      <div
        className={isAnonymous ? "hidden" : undefined}
        aria-hidden={isAnonymous}
      >
        <label htmlFor="room_no" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Room Number{" "}
          {!isAnonymous && <span className="text-red-500">*</span>}
        </label>
        <input
          id="room_no"
          name="room_no"
          type="text"
          placeholder="e.g. A-204 or B-101"
          required={!isAnonymous}
          disabled={isAnonymous}
          maxLength={20}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50"
        />
      </div>

      {/* Tag / Category */}
      <div>
        <label htmlFor="tag" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Complaint Category <span className="text-red-500">*</span>
        </label>
        <select
          id="tag"
          name="tag"
          required
          defaultValue=""
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        >
          <option value="" disabled>
            Select a category…
          </option>
          {TAG_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.emoji} {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Describe the Problem <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          required
          placeholder="Describe the issue in detail — which part of the room, when it started, how severe it is, etc."
          maxLength={2000}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
      </div>

      {/* Photo Upload */}
      <PhotoField onChange={(err) => setPhotoError(err)} />

      {/* Submit */}
      <button
        id="submit-ticket-btn"
        type="submit"
        disabled={isPending || !!photoError}
        className="w-full py-3.5 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white rounded-xl font-bold text-base transition-colors flex items-center justify-center gap-2 shadow-sm"
      >
        {isPending ? (
          <>
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Submitting…
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Submit Ticket
          </>
        )}
      </button>

      <p className="text-xs text-center text-slate-400">
        No account needed. You&apos;ll receive a unique ticket code immediately after submission.
      </p>
    </form>
  );
}
