"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import BrandMark from "@/components/BrandMark";

// Web API typing for beforeinstallprompt
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface InstallContextType {
  isInstallable: boolean;
  isStandalone: boolean;
  isIOS: boolean;
  triggerInstall: () => void;
}

const InstallContext = createContext<InstallContextType>({
  isInstallable: false,
  isStandalone: false,
  isIOS: false,
  triggerInstall: () => {},
});

export function useInstallPrompt() {
  return useContext(InstallContext);
}

const STORAGE_KEY_SHOWN = "hmc_install_prompt_shown";
const STORAGE_KEY_DISMISSED_AT = "hmc_install_prompt_dismissed_at";
const DISMISSAL_COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

export function InstallPromptProvider({ children }: { children: ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showAutoBanner, setShowAutoBanner] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showGenericModal, setShowGenericModal] = useState(false);

  // Check if device is in standalone mode or iOS Safari
  useEffect(() => {
    if (typeof window === "undefined") return;

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone ===
        true;
    setIsStandalone(standalone);

    const ua = window.navigator.userAgent;
    const isAppleDevice =
      /iPad|iPhone|iPod/.test(ua) ||
      (window.navigator.platform === "MacIntel" &&
        window.navigator.maxTouchPoints > 1);
    const isSafari =
      /WebKit/.test(ua) &&
      !/CriOS|FxiOS|OPiOS|mercury|EdgiOS/.test(ua) &&
      !/Chrome/.test(ua);
    setIsIOS(isAppleDevice && isSafari);

    // Track when app is installed
    const handleAppInstalled = () => {
      setIsStandalone(true);
      setDeferredPrompt(null);
      setShowAutoBanner(false);
      try {
        localStorage.setItem(STORAGE_KEY_SHOWN, "true");
      } catch {
        // Ignore localStorage errors
      }
    };
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // Listen for beforeinstallprompt (Android / Chrome / Edge)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);

      // Evaluate auto-prompt eligibility
      try {
        const isPermanentlyShown =
          localStorage.getItem(STORAGE_KEY_SHOWN) === "true";
        if (isPermanentlyShown) return;

        const dismissedAt = localStorage.getItem(STORAGE_KEY_DISMISSED_AT);
        if (dismissedAt) {
          const elapsed = Date.now() - parseInt(dismissedAt, 10);
          if (!isNaN(elapsed) && elapsed < DISMISSAL_COOLDOWN_MS) {
            return;
          }
        }

        // Check if already in standalone
        const standalone =
          window.matchMedia("(display-mode: standalone)").matches ||
          (window.navigator as unknown as { standalone?: boolean })
            .standalone === true;
        if (standalone) return;

        // Auto-show after a short non-intrusive delay (3.5s)
        const timer = setTimeout(() => {
          setShowAutoBanner(true);
        }, 3500);

        return () => clearTimeout(timer);
      } catch {
        // Fallback if localStorage is restricted
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  // Dismiss auto banner and record timestamp (14-day cooldown)
  const dismissAutoBanner = useCallback(() => {
    setShowAutoBanner(false);
    try {
      localStorage.setItem(STORAGE_KEY_DISMISSED_AT, Date.now().toString());
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Trigger install prompt manually (independent of auto-show throttling)
  const triggerInstall = useCallback(async () => {
    if (isStandalone) {
      alert("SV Bhavan HMC app is already installed on your home screen.");
      return;
    }

    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === "accepted") {
          try {
            localStorage.setItem(STORAGE_KEY_SHOWN, "true");
          } catch {
            // Ignore localStorage errors
          }
          setDeferredPrompt(null);
          setShowAutoBanner(false);
        } else {
          try {
            localStorage.setItem(
              STORAGE_KEY_DISMISSED_AT,
              Date.now().toString()
            );
          } catch {
            // Ignore localStorage errors
          }
        }
      } catch (err) {
        console.error("Install prompt error:", err);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      setShowGenericModal(true);
    }
  }, [deferredPrompt, isIOS, isStandalone]);

  // Handle auto banner install button click
  const handleAutoInstallClick = useCallback(async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === "accepted") {
          try {
            localStorage.setItem(STORAGE_KEY_SHOWN, "true");
          } catch {
            // Ignore localStorage errors
          }
          setDeferredPrompt(null);
        } else {
          try {
            localStorage.setItem(
              STORAGE_KEY_DISMISSED_AT,
              Date.now().toString()
            );
          } catch {
            // Ignore localStorage errors
          }
        }
      } catch (err) {
        console.error("Install prompt error:", err);
      }
    }
    setShowAutoBanner(false);
  }, [deferredPrompt]);

  const isInstallable = !isStandalone && (!!deferredPrompt || isIOS);

  return (
    <InstallContext.Provider
      value={{
        isInstallable,
        isStandalone,
        isIOS,
        triggerInstall,
      }}
    >
      {children}

      {/* ── Auto-prompt Bottom Banner (Throttled, dismissible) ── */}
      {showAutoBanner && !isStandalone && (
        <aside
          aria-label="Install App"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-[#0B1424] text-white border border-slate-700/80 rounded-2xl shadow-2xl p-4 sm:p-5 animate-in fade-in slide-in-from-bottom-5 duration-300 backdrop-blur-md"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/95 border border-blue-500/30 p-1 flex items-center justify-center shrink-0">
              <img src="/HMC_logo.svg" alt="HMC Logo" className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Install SV Bhavan App
                </h3>
                <button
                  type="button"
                  onClick={dismissAutoBanner}
                  className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
                  aria-label="Close install prompt"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                Add to your home screen for quick, offline-capable access to
                mess menus, ticket tracking, and helplines.
              </p>
              <div className="mt-3 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleAutoInstallClick}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md shadow-blue-600/30"
                >
                  Install App
                </button>
                <button
                  type="button"
                  onClick={dismissAutoBanner}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Not Now
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* ── iOS Safari Instructions Modal ── */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#0B1424] text-white border border-slate-700/80 rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                  iOS
                </span>
                <h3 className="text-base font-bold text-white">
                  Add to Home Screen
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
                aria-label="Close"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-200">
              <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                  1
                </div>
                <div>
                  Tap the <strong className="text-white">Share</strong> button in
                  Safari&apos;s bottom toolbar (the square with an arrow pointing
                  up).
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                  2
                </div>
                <div>
                  Scroll down the share options and tap{" "}
                  <strong className="text-white">Add to Home Screen</strong>.
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                  3
                </div>
                <div>
                  Tap <strong className="text-white">Add</strong> in the top-right
                  corner to complete installation.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* ── Generic Browser Modal ── */}
      {showGenericModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#0B1424] text-white border border-slate-700/80 rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Install App</h3>
              <button
                type="button"
                onClick={() => setShowGenericModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
                aria-label="Close"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              To install this portal as an app on your device: open your
              browser&apos;s menu (the three dots ⋮ in Chrome or ≡ in your
              browser) and select{" "}
              <strong className="text-white">&ldquo;Install App&rdquo;</strong>{" "}
              or{" "}
              <strong className="text-white">
                &ldquo;Add to Home Screen&rdquo;
              </strong>
              .
            </p>

            <button
              type="button"
              onClick={() => setShowGenericModal(false)}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </InstallContext.Provider>
  );
}

/**
 * Persistent "Install App" button
 * Renders cleanly in footer, navigation, or sidebar.
 */
export function InstallAppButton({
  className = "",
  showIcon = true,
}: {
  className?: string;
  showIcon?: boolean;
}) {
  const { triggerInstall, isStandalone } = useInstallPrompt();

  if (isStandalone) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400/80">
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        <span>Installed</span>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={triggerInstall}
      className={`inline-flex items-center gap-1.5 transition-colors cursor-pointer ${className}`}
      title="Install Swami Vivekanand Bhavan app on your home screen"
    >
      {showIcon && (
        <svg
          className="w-3.5 h-3.5 shrink-0 opacity-80"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
      )}
      <span>Install App</span>
    </button>
  );
}
