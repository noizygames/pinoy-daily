"use client";

import { useEffect, useState } from "react";
import { BACKUP_PICKUP_LINES } from "@/data/backupContent";
import { initAnalytics } from "@/lib/analytics";
import {
  consumeLimit,
  getLimitMessage,
  getLimitStatus,
  releaseLimit,
  type LimitStatus,
} from "@/lib/dailyLimits";
import { getUnseenPickupLine } from "@/lib/seenPredictions";
import { getUserId } from "@/lib/userIdentity";
import BottomNav from "@/components/BottomNav";

const PINK = "#E91E63";
const ORANGE = "#FF5722";
const GRADIENT = `linear-gradient(135deg, ${PINK}, ${ORANGE})`;

export default function PickupPage() {
  const [lines, setLines] = useState<string[]>([]);
  const [selectedLine, setSelectedLine] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [limitStatus, setLimitStatus] = useState<LimitStatus | null>(null);
  const [hasCopied, setHasCopied] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isUsingBackup, setIsUsingBackup] = useState(false);
  const [hasLoadedStatic, setHasLoadedStatic] = useState(false);

  useEffect(() => {
    initAnalytics();
    setLimitStatus(getLimitStatus("aiPickupLine"));

    const userId = getUserId();
    const staticLine = getUnseenPickupLine(userId, BACKUP_PICKUP_LINES);
    setSelectedLine(staticLine);
    setHasLoadedStatic(true);
  }, []);

  async function handleGenerate() {
    const consumed = consumeLimit("aiPickupLine");
    if (!consumed) return;

    setIsLoading(true);

    try {
      const res = await fetch("/api/ai-pickup");
      const data = (await res.json()) as {
        lines?: unknown[];
        usingBackup?: boolean;
      };

      const unseenLines = (data.lines ?? []).filter(
        (line): line is string => typeof line === "string",
      );

      if (unseenLines.length === 0) {
        throw new Error("No pickup lines returned");
      }

      setLines(unseenLines);
      setSelectedLine(unseenLines[0] ?? null);
      setIsUsingBackup(data.usingBackup ?? false);
      setLimitStatus(getLimitStatus("aiPickupLine"));
    } catch {
      releaseLimit("aiPickupLine");
      setLimitStatus(getLimitStatus("aiPickupLine"));
      alert("Hindi ma-generate ngayon. Subukan ulit!");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCopy() {
    if (!selectedLine) return;

    await navigator.clipboard.writeText(selectedLine);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  }

  async function handleShareText() {
    if (!selectedLine) return;

    const shareText = `${selectedLine}\n\nKumuha ng sariling pick up line sa swertengpinoy.app`;

    if (navigator.share) {
      await navigator.share({
        title: "SwertengPinoy Pick Up Line",
        text: shareText,
      });
    } else {
      await handleCopy();
    }
  }

  async function handleShareImage() {
    setIsCapturing(true);

    try {
      const html2canvas = (await import("html2canvas")).default;
      const element = document.getElementById("pickup-card");

      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });

      await new Promise<void>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("Failed to create image"));
            return;
          }

          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "pinoy-pickup-line.png";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          resolve();
        }, "image/png");
      });
    } catch {
      await handleCopy();
    } finally {
      setIsCapturing(false);
    }
  }

  const isExhausted = limitStatus?.isExhausted ?? false;

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <header className="px-5 pt-8 pb-12" style={{ background: GRADIENT }}>
        <h1 className="text-3xl font-black text-white">
          💘 Pick Up Line Generator
        </h1>
        <p className="mt-1 text-sm text-pink-100">
          Para sa lahat ng nangangahas mag-ligaw.
        </p>
      </header>

      <div className="-mt-6 rounded-t-3xl bg-white px-5 pt-6">
        {hasLoadedStatic && lines.length === 0 && selectedLine && (
          <section>
            <p className="mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase">
              Ang pick up line mo ngayon:
            </p>
            <div className="rounded-2xl border-l-4 border-pink-500 bg-white p-5 shadow-sm">
              <p className="text-lg font-semibold text-gray-900 italic">
                &ldquo;{selectedLine}&rdquo;
              </p>
            </div>
            <p className="mt-2 text-xs text-gray-400">
              💡 I-generate para sa AI pick up lines
            </p>
          </section>
        )}

        <section className="mt-4">
          {isExhausted ? (
            <p className="text-center text-sm text-gray-500">
              {limitStatus ? getLimitMessage(limitStatus) : ""}
            </p>
          ) : (
            <>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isLoading || !limitStatus}
                className="w-full rounded-2xl py-4 text-sm font-bold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                style={{ background: GRADIENT }}
              >
                {isLoading
                  ? "💘 Naghahanap ng tamang salita..."
                  : `💘 Mag-generate ng Pick Up Line (${limitStatus?.remaining ?? 3} natitira)`}
              </button>
              {limitStatus && (
                <p className="mt-2 text-center text-xs text-gray-400">
                  {getLimitMessage(limitStatus)}
                </p>
              )}
            </>
          )}
        </section>

        {lines.length > 0 && (
          <section className="mt-6">
            <h2 className="mb-3 font-bold text-gray-900">
              Piliin ang iyong linya:
            </h2>

            {lines.map((line, index) => {
              const isSelected = selectedLine === line;

              return (
                <button
                  key={`${index}-${line.slice(0, 24)}`}
                  type="button"
                  onClick={() => setSelectedLine(line)}
                  className="mb-3 flex w-full items-start justify-between gap-3 rounded-2xl p-4 text-left shadow-sm transition"
                  style={{
                    borderLeft: `3px solid ${isSelected ? PINK : "transparent"}`,
                    backgroundColor: isSelected ? "#FFF0F5" : "#ffffff",
                  }}
                >
                  <span className="font-medium text-gray-800 italic">
                    &ldquo;{line}&rdquo;
                  </span>
                  {isSelected && (
                    <span
                      className="shrink-0 text-lg font-bold"
                      style={{ color: PINK }}
                    >
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </section>
        )}

        {selectedLine && (
          <section
            className="mt-4 rounded-2xl p-5"
            style={{ background: GRADIENT }}
          >
            <p className="mb-2 text-xs text-pink-200">
              💘 Ang iyong pick up line:
            </p>
            <p className="text-lg leading-relaxed font-bold text-white italic">
              &ldquo;{selectedLine}&rdquo;
            </p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="flex-1 rounded-2xl border border-white bg-white py-3 text-xs font-bold"
                style={{ color: PINK }}
              >
                {hasCopied ? "✅ Nakopya!" : "📋 Kopyahin"}
              </button>
              <button
                type="button"
                onClick={handleShareImage}
                disabled={isCapturing}
                className="flex-1 rounded-2xl bg-white py-3 text-xs font-bold disabled:opacity-60"
                style={{ color: PINK }}
              >
                {isCapturing ? "⏳..." : "📸 I-save"}
              </button>
              <button
                type="button"
                onClick={handleShareText}
                className="flex-1 rounded-2xl border border-white py-3 text-xs font-bold text-white"
              >
                📤 I-share
              </button>
            </div>
          </section>
        )}

        {isUsingBackup && (
          <p className="mt-2 text-center text-xs text-gray-400">
            📦 Classic lines (offline mode)
          </p>
        )}

        <div className="mt-6 mb-6 rounded-2xl border border-dashed border-gray-200 p-4 text-center text-sm text-gray-300">
          Advertisement
        </div>
      </div>

      <div
        id="pickup-card"
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          width: "400px",
          height: "400px",
          background: GRADIENT,
          borderRadius: "24px",
          padding: "40px 32px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "system-ui, -apple-system, sans-serif",
          boxSizing: "border-box",
        }}
      >
        <div style={{ fontSize: "18px", fontWeight: 800, color: "white" }}>
          💘 SwertengPinoy
        </div>
        <div
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "white",
            lineHeight: 1.5,
            textAlign: "center",
            fontStyle: "italic",
          }}
        >
          &ldquo;{selectedLine || ""}&rdquo;
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.6)",
            textAlign: "center",
          }}
        >
          swertengpinoy.app
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
