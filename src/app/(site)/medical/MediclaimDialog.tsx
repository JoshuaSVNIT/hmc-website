"use client";

import { useEffect, useRef } from "react";
import { DownloadIcon, CloseIcon } from "@/components/icons";

export default function MediclaimDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const openDialog = () => {
    dialogRef.current?.showModal();
    document.body.style.overflow = "hidden";
    // Move focus into the dialog
    closeButtonRef.current?.focus();
  };

  const closeDialog = () => {
    dialogRef.current?.close();
    document.body.style.overflow = "";
    // Return focus to the trigger box
    triggerButtonRef.current?.focus();
  };

  // Ensure body scroll is restored if unmounted while open
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Close when clicking outside the dialog content area (on the backdrop)
  const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const rect = dialogRef.current?.getBoundingClientRect();
    if (!rect) return;
    const isClickInside =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;
    if (!isClickInside) {
      closeDialog();
    }
  };

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={openDialog}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openDialog();
          }
        }}
        className="bg-[#0B1424] text-white border border-slate-800 rounded-[16px] p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between h-full cursor-pointer group hover:border-slate-700 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1424]"
        aria-haspopup="dialog"
      >
        <div className="relative z-10 max-w-sm sm:max-w-md">
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Download Your SVNIT Mediclaim E-Card
          </h3>
          <p className="text-sm text-white/75 mt-2 leading-relaxed">
            Access your digital medical ID card for cashless treatments at empanelled network hospitals.
          </p>
          <div>
            <button
              ref={triggerButtonRef}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openDialog();
              }}
              className="mt-6 px-4 py-2 bg-white text-[#0B1424] font-semibold text-sm rounded-lg hover:bg-slate-100 transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs min-h-[44px]"
            >
              <DownloadIcon size={16} />
              <span>Download E-Card</span>
            </button>
          </div>
        </div>

        {/* Subtle credit card outline graphic on the right (ratio 85.6 / 54 ≈ 1.586:1, light grey, low opacity, no chip) */}
        <div
          className="hidden sm:block absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-44 md:w-52 aspect-[85.6/54] rounded-xl border border-white/20 bg-white/[0.02] pointer-events-none opacity-30 select-none"
          aria-hidden="true"
        >
          <div className="w-full h-full p-3.5 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <div className="w-10 h-2 bg-white/30 rounded-xs" />
              <div className="w-5 h-5 rounded-full border border-white/30" />
            </div>
            <div className="space-y-1.5">
              <div className="w-24 h-2 bg-white/30 rounded-xs" />
              <div className="w-14 h-1.5 bg-white/20 rounded-xs" />
            </div>
          </div>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        onClick={handleDialogClick}
        onCancel={(e) => {
          e.preventDefault();
          closeDialog();
        }}
        aria-labelledby="mediclaim-dialog-title"
        className="m-auto max-w-lg w-[calc(100%-2rem)] p-0 bg-transparent border-0 rounded-none backdrop:bg-black/50 z-50 outline-hidden"
      >
        <div className="bg-white border border-slate-300 p-6 sm:p-8 text-slate-900">
          <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-200">
            <h3
              id="mediclaim-dialog-title"
              className="text-lg sm:text-xl font-bold text-slate-900"
              style={{
                fontFamily: "var(--font-cormorant), system-ui, sans-serif",
              }}
            >
              Where to find your Mediclaim E-Card
            </h3>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeDialog}
              className="p-1 text-slate-500 hover:text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900 cursor-pointer"
              aria-label="Close dialog"
            >
              <CloseIcon size={20} />
            </button>
          </div>

          <ol className="mt-5 list-decimal pl-5 space-y-3 text-sm sm:text-base text-slate-800 leading-relaxed">
            <li>Open the inbox of your SVNIT email ID.</li>
            <li>Search for &ldquo;SVNIT Mediclaim E CARD&rdquo;.</li>
            <li>Open the mail sent on 24 September. Your e-card is attached to it.</li>
          </ol>

          <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="button"
              onClick={closeDialog}
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 border border-slate-300 hover:border-slate-400 bg-white transition-colors focus:outline-hidden focus:ring-2 focus:ring-slate-900 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
