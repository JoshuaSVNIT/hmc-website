"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import Link from "next/link";
import { submitTicket, type SubmitTicketResult } from "./actions";
import type { Ticket, TicketTag } from "@/types";
import PrintableTicket from "@/components/PrintableTicket";

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_BYTES = 10 * 1024 * 1024;

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
  ticket,
  onReset,
}: {
  ticketCode: string;
  ticket: Ticket | null;
  onReset: () => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("hmc_recent_tickets");
      const existing: string[] = raw ? JSON.parse(raw) : [];
      if (!existing.includes(ticketCode)) {
        const updated = [ticketCode, ...existing].slice(0, 20);
        localStorage.setItem("hmc_recent_tickets", JSON.stringify(updated));
      }
    } catch {
      // localStorage unavailable (e.g. private mode)
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
    <>
    {/* Full self-contained printable ticket (own header + logo, all fields, photo) */}
    {ticket && <PrintableTicket ticket={ticket} />}
    <div className={`flex flex-col items-center text-center py-6 px-2 ${ticket ? "print:hidden" : ""}`}>
      {/* Fallback print-only header (only used if the saved ticket couldn't be loaded) */}
      <div className="hidden print:block mb-6 text-left w-full max-w-lg">
        <h1 className="text-xl font-bold text-black font-heading">Swami Vivekanand Bhavan HMC</h1>
        <p className="text-xs text-gray-600 mt-1">Hostel Management Committee — Complaint Ticket</p>
        <hr className="my-3 border-black" />
      </div>

      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 shrink-0 shadow-xs"
        style={{
          backgroundColor: "rgba(16,185,129,0.15)",
          color: "var(--color-accent-secondary)",
        }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2
        className="text-2xl font-bold tracking-tight text-slate-900 print:text-black"
        style={{
          fontFamily: "var(--font-cormorant), system-ui, sans-serif",
        }}
      >
        Ticket Submitted Successfully
      </h2>
      <p className="mt-2 text-sm max-w-md text-slate-600 print:text-black">
        Your complaint has been logged in the HMC system. Record your ticket code to track progress and supervisor notes.
      </p>

      {/* Ticket Code display */}
      <div className="mt-6 w-full max-w-md">
        <div className="text-xs font-semibold mb-1.5 text-left text-slate-500 uppercase tracking-wider print:text-black">
          Your unique ticket code
        </div>
        <div
          className="flex items-center justify-between px-5 py-4 rounded-xl border print:border-black print:bg-white shadow-sm"
          style={{
            backgroundColor: "var(--color-ink)",
            borderColor: "rgba(37,99,235,0.4)",
            color: "#ffffff",
          }}
        >
          <span
            className="text-2xl font-bold tracking-widest text-blue-400"
            style={{ fontFamily: "var(--font-ibm-plex-mono), monospace" }}
          >
            {ticketCode}
          </span>
          <button
            id="copy-ticket-code-btn"
            type="button"
            onClick={handleCopy}
            className="print:hidden px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border border-blue-400/40 text-blue-300 hover:bg-blue-400/15 cursor-pointer"
            aria-label="Copy ticket code"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <p className="mt-2 text-xs text-left text-slate-500 print:hidden">
          Check resolution updates anytime on the{" "}
          <Link href="/track-ticket" className="underline font-bold text-blue-700 hover:text-blue-800">
            Track Ticket
          </Link>{" "}
          page.
        </p>
      </div>

      {/* Action buttons */}
      <div className="print:hidden mt-6 flex flex-col sm:flex-row gap-2.5 w-full max-w-md">
        <button
          id="print-ticket-btn"
          type="button"
          onClick={handlePrint}
          className="flex-1 py-2.5 px-4 rounded-lg text-xs font-bold border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
        >
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print receipt
        </button>
        <Link
          href="/track-ticket"
          className="flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 hover:shadow-blue-600/30 hover:brightness-105"
          style={{
            backgroundColor: "var(--color-accent-primary)",
            color: "#ffffff",
            fontFamily: "var(--font-cormorant), system-ui, sans-serif",
          }}
        >
          Track status →
        </Link>
      </div>

      <button
        id="raise-another-ticket-btn"
        type="button"
        onClick={onReset}
        className="print:hidden mt-5 text-xs text-slate-500 hover:text-slate-800 underline transition-colors cursor-pointer"
      >
        Submit another complaint
      </button>
    </div>
    </>
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

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      const err = "Only .jpg, .png, or .webp images are accepted.";
      setFileError(err);
      setPreview(null);
      onChange(err);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    if (file.size > MAX_FILE_BYTES) {
      const err = `File size is ${(file.size / 1024 / 1024).toFixed(1)} MB. Maximum allowed is 10 MB.`;
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
      <label className="block text-sm font-semibold mb-1.5 text-slate-900">
        Photo attachment{" "}
        <span className="font-normal text-xs text-slate-500">
          (optional — max 10 MB, jpg / png / webp)
        </span>
      </label>

      {preview ? (
        <div className="relative inline-block mt-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Preview"
            className="h-28 rounded-lg border border-slate-200 object-cover shadow-xs"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white shadow bg-rose-600 hover:bg-rose-700 cursor-pointer"
            aria-label="Remove photo"
          >
            ✕
          </button>
        </div>
      ) : (
        <label
          htmlFor="photo-input"
          className="flex flex-col items-center justify-center w-full h-24 border border-dashed border-slate-300 hover:border-blue-500 rounded-xl cursor-pointer transition-colors bg-slate-50 hover:bg-blue-50/20"
        >
          <svg className="w-6 h-6 mb-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs font-semibold text-slate-700">
            Attach a photo
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5">
            JPG, PNG, or WEBP up to 10 MB
          </span>
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
        <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
          {fileError}
        </p>
      )}
    </div>
  );
}

// ─── Main Form Component ───────────────────────────────────────────────────────

const ALLOW_ANONYMOUS =
  process.env.NEXT_PUBLIC_ALLOW_ANONYMOUS_TICKETS !== "false";

export default function RaiseTicketForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<SubmitTicketResult | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (photoError) return;

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
    return <SuccessView ticketCode={result.ticket_code} ticket={result.ticket} onReset={handleReset} />;
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Error alert */}
      {serverError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border border-rose-300 bg-rose-50 p-3 text-xs sm:text-sm text-rose-800"
        >
          <svg className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">{serverError}</span>
        </div>
      )}

      {/* Anonymous toggle */}
      {ALLOW_ANONYMOUS && (
        <label
          htmlFor="anonymous-checkbox"
          className="flex items-center gap-2.5 cursor-pointer select-none py-1"
        >
          <input
            id="anonymous-checkbox"
            name="is_anonymous"
            type="checkbox"
            value="true"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 cursor-pointer accent-blue-600"
          />
          <span className="text-sm font-semibold text-slate-800">
            Submit anonymously
            <span className="ml-1 text-xs font-normal text-slate-500">
              (your name, room number, and phone number won&apos;t be recorded)
            </span>
          </span>
        </label>
      )}

      {/* Raiser name — hidden when anonymous */}
      <div className={isAnonymous ? "hidden" : undefined} aria-hidden={isAnonymous}>
        <label htmlFor="raiser_name" className="block text-sm font-semibold mb-1.5 text-slate-900">
          Your Name {!isAnonymous && <span className="text-rose-600">*</span>}
        </label>
        <input
          id="raiser_name"
          name="raiser_name"
          type="text"
          placeholder="e.g. Rahul Sharma"
          required={!isAnonymous}
          disabled={isAnonymous}
          maxLength={120}
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
        />
      </div>

      {/* Room Number — hidden when anonymous */}
      <div className={isAnonymous ? "hidden" : undefined} aria-hidden={isAnonymous}>
        <label htmlFor="room_no" className="block text-sm font-semibold mb-1.5 text-slate-900">
          Room Number {!isAnonymous && <span className="text-rose-600">*</span>}
        </label>
        <input
          id="room_no"
          name="room_no"
          type="text"
          placeholder="e.g. A-204"
          required={!isAnonymous}
          disabled={isAnonymous}
          maxLength={20}
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
          style={{ fontFamily: "var(--font-ibm-plex-mono), monospace" }}
        />
      </div>

      {/* Phone Number — hidden when anonymous */}
      <div className={isAnonymous ? "hidden" : undefined} aria-hidden={isAnonymous}>
        <label htmlFor="phone_no" className="block text-sm font-semibold mb-1.5 text-slate-900">
          Phone Number {!isAnonymous && <span className="text-rose-600">*</span>}
        </label>
        <input
          id="phone_no"
          name="phone_no"
          type="tel"
          placeholder="e.g. 9876543210"
          required={!isAnonymous}
          disabled={isAnonymous}
          maxLength={20}
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
          style={{ fontFamily: "var(--font-ibm-plex-mono), monospace" }}
        />
      </div>

      {/* Category */}
      <div>
        <label htmlFor="tag" className="block text-sm font-semibold mb-1.5 text-slate-900">
          Complaint Category <span className="text-rose-600">*</span>
        </label>
        <select
          id="tag"
          name="tag"
          required
          defaultValue=""
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
        >
          <option value="" disabled>
            Select category…
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
        <label htmlFor="description" className="block text-sm font-semibold mb-1.5 text-slate-900">
          Describe the problem <span className="text-rose-600">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          required
          placeholder="Specify exact location, symptoms, when the issue began, and any relevant details."
          maxLength={2000}
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 resize-none transition focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
        />
      </div>

      {/* Photo upload */}
      <PhotoField onChange={(err) => setPhotoError(err)} />

      {/* Submit button */}
      <button
        id="submit-ticket-btn"
        type="submit"
        disabled={isPending || !!photoError}
        className="w-full py-3.5 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 hover:brightness-105 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: "var(--color-accent-primary)",
          color: "#ffffff",
          fontFamily: "var(--font-cormorant), system-ui, sans-serif",
        }}
      >
        {isPending ? (
          <>
            <svg className="animate-spin w-4 h-4 text-slate-950" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Submitting complaint…
          </>
        ) : (
          "Submit Complaint Ticket"
        )}
      </button>

      <p className="text-xs text-center text-slate-500">
        No account required. An instant ticket code will be generated for tracking.
      </p>
    </form>
  );
}
