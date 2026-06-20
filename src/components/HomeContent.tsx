"use client";

import { useEffect, useState } from "react";
import ShareCard from "@/components/ShareCard";
import AdSenseUnit from "@/components/AdSenseUnit";
import { initAnalytics, trackShared, trackViewed } from "@/lib/analytics";
import { getTodayContent } from "@/lib/daily";

function formatFilipinoDate(date: Date): string {
  return new Intl.DateTimeFormat("fil-PH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function getDateFilename(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.65;
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function HomeContent() {
  const today = new Date();
  const { prediction, luckyColor, luckyNumber, dayIndex } = getTodayContent(today);
  const dateString = formatFilipinoDate(today);
  const dateFilename = getDateFilename(today);

  const [showAbout, setShowAbout] = useState(false);
  const [shareLabel, setShareLabel] = useState("📤 I-share ang Hula Mo");
  const [isSharing, setIsSharing] = useState(false);
  const [shareCooldown, setShareCooldown] = useState(false);
  const [shareError, setShareError] = useState(false);

  const accentColor = luckyColor.hex;
  const shareTextColor = isLightColor(accentColor) ? "#171717" : "#ffffff";
  const shareDisabled = isSharing || shareCooldown;

  useEffect(() => {
    initAnalytics();
    trackViewed(dayIndex);
  }, [dayIndex]);

  useEffect(() => {
    if (!shareError) return;

    const timer = window.setTimeout(() => setShareError(false), 4000);
    return () => window.clearTimeout(timer);
  }, [shareError]);

  function startShareCooldown() {
    setShareCooldown(true);
    window.setTimeout(() => setShareCooldown(false), 3000);
  }

  async function handleShare() {
    if (shareDisabled) return;

    startShareCooldown();
    setIsSharing(true);
    setShareLabel("⏳ Ginagawa...");

    try {
      const html2canvas = (await import("html2canvas")).default;
      const element = document.getElementById("share-card");

      if (!element) {
        throw new Error("Share card not found");
      }

      const canvas = await html2canvas(element);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      );

      if (!blob) {
        throw new Error("Failed to create image blob");
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `pinoy-daily-${dateFilename}.png`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      trackShared();
      setShareLabel("✅ Na-download na!");
    } catch {
      setShareLabel("📤 I-share ang Hula Mo");
      setShareError(true);
    } finally {
      setIsSharing(false);
    }
  }

  return (
    <div className="bg-dot-pattern relative min-h-full overflow-x-hidden px-4 py-6 font-sans">
      <div
        className="fixed top-0 right-0 left-0 z-10 h-1 bg-neutral-200/60"
        aria-hidden="true"
      >
        <div
          className="h-full transition-all duration-700 ease-out"
          style={{
            width: `${Math.min((dayIndex / 365) * 100, 100)}%`,
            backgroundColor: accentColor,
          }}
        />
      </div>

      {shareError && (
        <div
          role="alert"
          className="fixed right-4 bottom-6 left-4 z-20 mx-auto max-w-[420px] rounded-2xl border border-red-200 bg-white px-4 py-3 text-center text-sm font-medium text-neutral-800 shadow-lg"
        >
          Oops! Hindi ma-download ngayon. I-screenshot na lang! 😅
        </div>
      )}

      <main className="mx-auto box-border w-full max-w-[420px]">
        <header className="mb-5 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              🌟 Pinoy Daily
            </h1>
            <p className="mt-1 break-words text-sm text-neutral-600">{dateString}</p>
          </div>
          <button
            type="button"
            onClick={() => setShowAbout((prev) => !prev)}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-lg text-neutral-600 shadow-sm transition hover:bg-neutral-50"
            aria-label="About Pinoy Daily"
            aria-expanded={showAbout}
          >
            ⓘ
          </button>
        </header>

        <div
          className={`grid transition-[grid-template-rows,opacity,margin-bottom] duration-300 ease-out ${
            showAbout
              ? "mb-5 grid-rows-[1fr] opacity-100"
              : "mb-0 grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <section className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-neutral-500">
                Tungkol sa Pinoy Daily
              </h2>
              <p className="mb-3 text-sm leading-relaxed text-neutral-700">
                Ang Pinoy Daily ay nagbibigay ng nakakatawang araw-araw na hula,
                swerteng numero, at swerteng kulay para sa lahat ng Pinoy.
                Parehong hula ang makikita ng lahat bawat araw — kasi iisa lang
                ang universe (charot).
              </p>
              <p className="mb-3 text-sm text-neutral-700">
                Bersyon: <span className="font-semibold">1.0.0</span>
              </p>
              <p className="mb-3 text-sm text-neutral-700">
                Email:{" "}
                <a
                  href="mailto:noizygamesstudio@gmail.com"
                  className="font-medium text-neutral-900 underline"
                >
                  noizygamesstudio@gmail.com
                </a>
              </p>
              <p className="text-sm leading-relaxed text-neutral-500">
                Privacy: Gumagamit kami ng PostHog para sa basic analytics (page
                views at shares lang). Walang personal na impormasyon na
                kinokolekta.
              </p>
            </section>
          </div>
        </div>

        <section
          className="mb-4 overflow-hidden rounded-2xl p-5 shadow-sm"
          style={{
            borderLeft: `5px solid ${accentColor}`,
            backgroundColor: hexToRgba(accentColor, 0.1),
          }}
        >
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-400">
            Ang Hula Mo Ngayon
          </p>
          <p className="break-words text-xl font-bold leading-snug text-neutral-900">
            &ldquo;{prediction}&rdquo;
          </p>
        </section>

        <div className="mb-5 grid grid-cols-2 items-stretch gap-3">
          <section className="flex h-full min-w-0 flex-col rounded-2xl bg-white p-4 shadow-sm">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-400">
              Swerteng Numero
            </p>
            <p
              className="animate-lucky-number mt-auto text-4xl font-bold leading-none"
              style={{ color: accentColor }}
            >
              {luckyNumber}
            </p>
          </section>

          <section className="flex h-full min-w-0 flex-col rounded-2xl bg-white p-4 shadow-sm">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-400">
              Swerteng Kulay
            </p>
            <div className="mt-auto flex min-w-0 items-center gap-2">
              <span
                className="h-8 w-8 shrink-0 rounded-full border border-black/10"
                style={{ backgroundColor: accentColor }}
              />
              <div className="min-w-0">
                <p className="break-words text-sm font-bold text-neutral-900">
                  {luckyColor.name}
                </p>
                <p className="break-words text-sm text-neutral-500">
                  {luckyColor.english}
                </p>
              </div>
            </div>
          </section>
        </div>

        <button
          type="button"
          onClick={handleShare}
          disabled={shareDisabled}
          className="mb-2 min-h-[48px] w-full rounded-2xl px-4 py-3 text-base font-bold transition hover:translate-y-[-1px] hover:opacity-95 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-80"
          style={{
            backgroundColor: accentColor,
            color: shareTextColor,
            boxShadow: `0 4px 0 ${hexToRgba(accentColor, 0.55)}, 0 8px 20px ${hexToRgba(accentColor, 0.28)}`,
          }}
        >
          {shareLabel}
        </button>

        <p className="mb-6 text-center text-sm text-neutral-500">
          I-share sa Facebook, Messenger, Instagram, TikTok, o Viber
        </p>

        <AdSenseUnit />

        <p className="mt-5 pb-2 text-center text-sm text-neutral-400">
          ✨ Bagong hula bukas!
        </p>
      </main>

      <div
        style={{ position: "absolute", left: "-9999px", top: 0 }}
        aria-hidden="true"
      >
        <ShareCard
          prediction={prediction}
          luckyNumber={luckyNumber}
          colorName={luckyColor.name}
          colorHex={luckyColor.hex}
          categoryColor="#E91E63"
          dateString={dateString}
          categoryEmoji="🌟"
          categoryLabel="Hula"
        />
      </div>
    </div>
  );
}
