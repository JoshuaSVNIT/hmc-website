/**
 * Site brand lockup: "SV" monogram + "HMC" title + "Swami Vivekanand Bhavan" subtext.
 * HMC = Hostel Management Committee. The hostel itself is Swami Vivekanand Bhavan.
 */
export default function BrandMark({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-11 h-11 shrink-0 rounded-xl overflow-hidden bg-white/95 border border-gold/40 p-1 flex items-center justify-center shadow-sm">
        <img
          src="/HMC_logo.svg"
          alt="HMC Logo"
          className="w-full h-full object-contain"
        />
      </div>
      <span className="leading-tight">
        <span className="block text-base font-bold tracking-wide text-white">HMC</span>
        <span className="block text-[11px] text-white/55 mt-0.5">Swami Vivekanand Bhavan</span>
      </span>
    </div>
  );
}
