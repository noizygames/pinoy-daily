"use client";

import { useState, useEffect } from "react";
import {
  getLimitStatus,
  consumeLimit,
  getLimitMessage,
  releaseLimit,
  type LimitStatus,
} from "@/lib/dailyLimits";
import { initAnalytics } from "@/lib/analytics";
import BottomNav from "@/components/BottomNav";

type PickupLineResult = {
  line: string;
  punchline: string;
};

type LineCategory = {
  id: string;
  label: string;
  emoji: string;
  description: string;
};

const PINK = "#E91E63";
const RED = "#FF5722";
const GRADIENT = `linear-gradient(135deg, ${PINK}, ${RED})`;

const LINE_CATEGORIES: LineCategory[] = [
  {
    id: "classic",
    label: "Classic Pinoy",
    emoji: "🇵🇭",
    description: "Jeep, trike, load...",
  },
  {
    id: "food",
    label: "Food Edition",
    emoji: "🍚",
    description: "Adobo, kanin, siomai...",
  },
  {
    id: "tech",
    label: "Tech Edition",
    emoji: "📱",
    description: "WiFi, signal, battery...",
  },
  {
    id: "work",
    label: "Work Edition",
    emoji: "💼",
    description: "Sweldo, meeting, OT...",
  },
  {
    id: "cringe",
    label: "Cringe Edition",
    emoji: "😬",
    description: "Absurd pero nakakatawa",
  },
  {
    id: "plot-twist",
    label: "Plot Twist",
    emoji: "😂",
    description: "Masakit pero totoo",
  },
];

export default function PickupPage() {
  const [selectedCategory, setSelectedCategory] = useState<LineCategory>(
    LINE_CATEGORIES[0]!,
  );
  const [lines, setLines] = useState<PickupLineResult[]>([]);
  const [selectedLine, setSelectedLine] = useState<PickupLineResult | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [limitStatus, setLimitStatus] = useState<LimitStatus | null>(null);
  const [hasCopied, setHasCopied] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isUsingBackup, setIsUsingBackup] = useState(false);

  useEffect(() => {
    initAnalytics();
    setLimitStatus(getLimitStatus("aiPickupLine"));
  }, []);

  async function handleGenerate() {
    const consumed = consumeLimit("aiPickupLine");
    if (!consumed) return;

    setIsLoading(true);
    setLines([]);
    setSelectedLine(null);
    setIsUsingBackup(false);

    try {
      const res = await fetch(
        `/api/ai-pickup?category=${selectedCategory.id}`,
      );
      const data = (await res.json()) as {
        lines?: PickupLineResult[];
        usingBackup?: boolean;
      };

      const validLines = (data.lines ?? []).filter(
        (item) =>
          item &&
          typeof item.line === "string" &&
          typeof item.punchline === "string" &&
          item.line.trim().length > 0 &&
          item.punchline.trim().length > 0,
      );

      if (validLines.length === 0) {
        throw new Error("No pickup lines returned");
      }

      setLines(validLines);
      setSelectedLine(validLines[0] ?? null);
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

    const text = `${selectedLine.line}\n${selectedLine.punchline}\n\n— SwertengPinoy Pick Up Line Generator`;
    await navigator.clipboard.writeText(text);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  }

  async function handleShareText() {
    if (!selectedLine) return;

    const shareText = `${selectedLine.line}\n${selectedLine.punchline}\n\nKumuha ng sariling pick up line sa swertengpinoy.app`;

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

  function handleCategorySelect(category: LineCategory) {
    setSelectedCategory(category);
    setLines([]);
    setSelectedLine(null);
    setIsUsingBackup(false);
  }

  const isExhausted = limitStatus?.isExhausted ?? false;

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <header className="px-5 pt-8 pb-14" style={{ background: GRADIENT }}>
        <h1 className="text-3xl font-black text-white">
          💘 Pick Up Line Generator
        </h1>
        <p className="mt-1 text-sm text-pink-100">
          Para sa lahat ng nangangahas mag-ligaw.
        </p>
      </header>

      <div className="-mt-8 rounded-t-3xl bg-white px-5 pt-6">
        <section className="mb-5">
          <p className="mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase">
            Piliin ang theme:
          </p>
          <div className="grid grid-cols-2 gap-3">
            {LINE_CATEGORIES.map((category) => {
              const isSelected = selectedCategory.id === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategorySelect(category)}
                  className="rounded-xl bg-white p-3 text-left shadow-sm transition"
                  style={{
                    border: isSelected
                      ? "2px solid #f472b6"
                      : "1px solid #f3f4f6",
                    backgroundColor: isSelected ? "#fdf2f8" : "#ffffff",
                  }}
                >
                  <span className="text-2xl">{category.emoji}</span>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {category.label}
                  </p>
                  <p className="text-xs text-gray-400">{category.description}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mb-6">
          {isExhausted ? (
            <p className="text-center text-sm text-gray-500">
              {limitStatus ? getLimitMessage(limitStatus) : ""}
            </p>
          ) : (
            <>
              <button
                type="button"
                onClick={() => void handleGenerate()}
                disabled={isLoading || !limitStatus}
                className="w-full rounded-2xl py-4 text-base font-bold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                style={{ background: GRADIENT }}
              >
                {isLoading
                  ? "💘 Naghahanap ng tamang salita..."
                  : `💘 Mag-generate ng ${selectedCategory.label} Line`}
              </button>
              {limitStatus && (
                <p className="mt-2 text-center text-xs text-gray-400">
                  {getLimitMessage(limitStatus)}
                </p>
              )}
            </>
          )}
        </section>

        {isLoading && (
          <section className="py-8 text-center">
            <p className="animate-pulse text-5xl">💘</p>
            <p className="mt-3 text-center text-sm text-gray-400">
              Naghahanap ng tamang salita...
            </p>
          </section>
        )}

        {lines.length > 0 && !isLoading && (
          <section>
            <h2 className="mb-4 font-bold text-gray-900">
              Piliin ang iyong linya:
            </h2>

            {lines.map((item, index) => {
              const isSelected = selectedLine === item;

              return (
                <button
                  key={`${index}-${item.line}`}
                  type="button"
                  onClick={() => setSelectedLine(item)}
                  className="relative mb-3 w-full rounded-2xl p-5 text-left shadow-sm transition"
                  style={{
                    border: isSelected
                      ? "2px solid #f472b6"
                      : "1px solid #f3f4f6",
                    backgroundColor: isSelected ? "#fdf2f8" : "#ffffff",
                  }}
                >
                  <p className="mb-2 text-base font-bold text-gray-900">
                    💘 {item.line}
                  </p>
                  <p className="pr-8 text-sm leading-relaxed text-gray-500 italic">
                    {item.punchline}
                  </p>
                  {isSelected && (
                    <span className="absolute right-4 bottom-4 text-lg font-bold text-pink-400">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </section>
        )}

        {selectedLine && lines.length > 0 && !isLoading && (
          <section className="mt-2 mb-4">
            <div
              style={{
                background: GRADIENT,
                borderRadius: "20px",
                padding: "28px",
              }}
            >
              <div
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "11px",
                  marginBottom: "20px",
                }}
              >
                💘 ANG IYONG PICK UP LINE
              </div>

              <div
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  color: "white",
                  marginBottom: "12px",
                  lineHeight: 1.3,
                }}
              >
                {selectedLine.line}
              </div>

              <div
                style={{
                  fontSize: "17px",
                  color: "rgba(255,255,255,0.9)",
                  fontStyle: "italic",
                  lineHeight: 1.5,
                  paddingTop: "12px",
                  borderTop: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                {selectedLine.punchline}
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => void handleCopy()}
                className="flex-1 rounded-xl border bg-white py-3 text-xs font-bold"
                style={{ borderColor: PINK, color: PINK }}
              >
                {hasCopied ? "✅ Nakopya!" : "📋 Kopyahin"}
              </button>
              <button
                type="button"
                onClick={() => void handleShareImage()}
                disabled={isCapturing}
                className="flex-1 rounded-xl py-3 text-xs font-bold text-white disabled:opacity-60"
                style={{ background: GRADIENT }}
              >
                {isCapturing ? "⏳..." : "📸 I-save"}
              </button>
              <button
                type="button"
                onClick={() => void handleShareText()}
                className="flex-1 rounded-xl border bg-white py-3 text-xs font-bold"
                style={{ borderColor: PINK, color: PINK }}
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

        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <a
            href="/feedback"
            style={{ fontSize: "13px", color: "#9B59B6", textDecoration: "none" }}
          >
            💬 May feedback? I-tap dito
          </a>
        </div>

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
          height: "420px",
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
        <div
          style={{
            fontSize: "16px",
            fontWeight: 800,
            color: "rgba(255,255,255,0.9)",
          }}
        >
          💘 SwertengPinoy
        </div>

        <div>
          <div
            style={{
              fontSize: "26px",
              fontWeight: 800,
              color: "white",
              lineHeight: 1.3,
              marginBottom: "16px",
            }}
          >
            {selectedLine?.line || ""}
          </div>
          <div
            style={{
              fontSize: "18px",
              color: "rgba(255,255,255,0.85)",
              fontStyle: "italic",
              lineHeight: 1.5,
              paddingTop: "16px",
              borderTop: "1px solid rgba(255,255,255,0.25)",
            }}
          >
            {selectedLine?.punchline || ""}
          </div>
        </div>

        <div
          style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.5)",
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
