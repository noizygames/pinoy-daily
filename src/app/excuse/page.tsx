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

type ExcuseResult = {
  situation: string;
  excuse: string;
};

type ExcuseCategory = {
  id: string;
  label: string;
  emoji: string;
  tagalog: string;
};

const ORANGE = "#E67E22";
const GOLD = "#F39C12";
const GRADIENT = `linear-gradient(135deg, ${ORANGE}, ${GOLD})`;

const CATEGORIES: ExcuseCategory[] = [
  {
    id: "late-work",
    label: "Late sa Trabaho",
    emoji: "🏢",
    tagalog: "Nalate sa trabaho",
  },
  {
    id: "late-school",
    label: "Late sa School",
    emoji: "🏫",
    tagalog: "Nalate sa school",
  },
  {
    id: "no-reply",
    label: "Hindi Nagreply",
    emoji: "📵",
    tagalog: "Hindi nagreply",
  },
  {
    id: "no-money",
    label: "Walang Pera",
    emoji: "💸",
    tagalog: "Walang pera",
  },
  {
    id: "absent",
    label: "Absent",
    emoji: "🙈",
    tagalog: "Nag-absent",
  },
  {
    id: "missed-deadline",
    label: "Late ang Submit",
    emoji: "📋",
    tagalog: "Hindi natapos ang task",
  },
  {
    id: "breakup",
    label: "Iniiwasan",
    emoji: "🏃",
    tagalog: "Iniiwan ang tao",
  },
  {
    id: "forgot",
    label: "Nakalimutan",
    emoji: "🤔",
    tagalog: "Nakalimutan",
  },
];

export default function ExcusePage() {
  const [selectedCategory, setSelectedCategory] = useState<ExcuseCategory>(
    CATEGORIES[0]!,
  );
  const [excuses, setExcuses] = useState<ExcuseResult[]>([]);
  const [selectedExcuse, setSelectedExcuse] = useState<ExcuseResult | null>(
    null,
  );
  const [customSituation, setCustomSituation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [limitStatus, setLimitStatus] = useState<LimitStatus | null>(null);
  const [hasCopied, setHasCopied] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isUsingBackup, setIsUsingBackup] = useState(false);

  useEffect(() => {
    initAnalytics();
    setLimitStatus(getLimitStatus("aiExcuse"));
  }, []);

  async function handleGenerate() {
    const consumed = consumeLimit("aiExcuse");
    if (!consumed) return;

    setIsLoading(true);
    setExcuses([]);
    setSelectedExcuse(null);
    setIsUsingBackup(false);

    try {
      const params = new URLSearchParams({
        category: selectedCategory.id,
        situation: customSituation || selectedCategory.tagalog,
      });
      const res = await fetch(`/api/ai-excuse?${params}`);
      const data = (await res.json()) as {
        excuses?: ExcuseResult[];
        usingBackup?: boolean;
      };

      const validExcuses = (data.excuses ?? []).filter(
        (item) =>
          item &&
          typeof item.situation === "string" &&
          typeof item.excuse === "string" &&
          item.situation.trim().length > 0 &&
          item.excuse.trim().length > 0,
      );

      if (validExcuses.length === 0) {
        throw new Error("No excuses returned");
      }

      setExcuses(validExcuses);
      setSelectedExcuse(validExcuses[0] ?? null);
      setIsUsingBackup(data.usingBackup ?? false);
      setLimitStatus(getLimitStatus("aiExcuse"));
    } catch {
      releaseLimit("aiExcuse");
      setLimitStatus(getLimitStatus("aiExcuse"));
      alert("Hindi ma-generate ngayon. Subukan ulit!");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCopy() {
    if (!selectedExcuse) return;

    const text = `${selectedExcuse.situation}\n\n${selectedExcuse.excuse}\n\n— SwertengPinoy Excuse Generator`;
    await navigator.clipboard.writeText(text);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  }

  async function handleShareText() {
    if (!selectedExcuse) return;

    const shareText = `${selectedExcuse.situation}\n\n${selectedExcuse.excuse}\n\nKumuha ng sariling excuse sa swertengpinoy.app`;

    if (navigator.share) {
      await navigator.share({
        title: "SwertengPinoy Excuse",
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
      const element = document.getElementById("excuse-card");

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
          a.download = "pinoy-excuse.png";
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

  function handleCategorySelect(category: ExcuseCategory) {
    setSelectedCategory(category);
    setExcuses([]);
    setSelectedExcuse(null);
    setIsUsingBackup(false);
  }

  const isExhausted = limitStatus?.isExhausted ?? false;

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <header className="px-5 pt-8 pb-14" style={{ background: GRADIENT }}>
        <h1 className="text-3xl font-black text-white">🎭 Excuse Generator</h1>
        <p className="mt-1 text-sm text-orange-100">
          Ang sining ng pagdadahilan.
        </p>
      </header>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "12px 20px 0",
          backgroundColor: "white",
        }}
      >
        <a
          href="/generators"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "13px",
            color: "#9CA3AF",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          <span>←</span>
          <span>Mga Generator</span>
        </a>
      </div>

      <div className="-mt-8 rounded-t-3xl bg-white px-5 pt-6">
        <section className="mb-5">
          <p className="mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase">
            Anong situation?
          </p>
          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory.id === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategorySelect(category)}
                  className="rounded-xl bg-white p-3 text-left shadow-sm transition"
                  style={{
                    border: isSelected
                      ? "2px solid #fb923c"
                      : "1px solid #f3f4f6",
                    backgroundColor: isSelected ? "#fff7ed" : "#ffffff",
                  }}
                >
                  <span className="text-2xl">{category.emoji}</span>
                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {category.label}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mb-5">
          <label
            htmlFor="custom-situation"
            className="mb-2 block text-xs text-gray-400"
          >
            O ilagay ang specific na situation mo: (optional)
          </label>
          <input
            id="custom-situation"
            type="text"
            value={customSituation}
            onChange={(e) => setCustomSituation(e.target.value)}
            placeholder={`hal. "${selectedCategory.tagalog} kasi..."`}
            className="w-full rounded-xl border border-gray-200 p-3 text-sm text-gray-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/30"
          />
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
                  ? "🎭 Naghahanap ng dahilan..."
                  : "🎭 Gumawa ng Excuse"}
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
            <p className="animate-pulse text-5xl">🎭</p>
            <p className="mt-3 text-center text-sm text-gray-400">
              Nag-iisip ng magandang dahilan...
            </p>
          </section>
        )}

        {excuses.length > 0 && !isLoading && (
          <section>
            <h2 className="mb-4 font-bold text-gray-900">
              Piliin ang iyong excuse:
            </h2>

            {excuses.map((item, index) => {
              const isSelected = selectedExcuse === item;

              return (
                <button
                  key={`${index}-${item.situation}`}
                  type="button"
                  onClick={() => setSelectedExcuse(item)}
                  className="relative mb-3 w-full cursor-pointer rounded-2xl p-5 text-left shadow-sm transition"
                  style={{
                    border: isSelected
                      ? "2px solid #fb923c"
                      : "1px solid #f3f4f6",
                    backgroundColor: isSelected ? "#fff7ed" : "#ffffff",
                  }}
                >
                  <p className="mb-1 text-xs font-bold text-orange-500">
                    📍 Reason:
                  </p>
                  <p className="mb-3 text-sm font-semibold text-gray-900">
                    {item.situation}
                  </p>
                  <p className="mb-1 text-xs font-bold text-gray-400">
                    💬 Excuse:
                  </p>
                  <p className="pr-8 text-sm leading-relaxed text-gray-700">
                    {item.excuse}
                  </p>
                  {isSelected && (
                    <span className="absolute right-4 bottom-4 text-lg font-bold text-orange-400">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </section>
        )}

        {selectedExcuse && excuses.length > 0 && !isLoading && (
          <section className="mt-2 mb-6">
            <div
              style={{
                background: GRADIENT,
                borderRadius: "16px",
                padding: "24px",
              }}
            >
              <div
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "11px",
                  marginBottom: "16px",
                }}
              >
                🎭 ANG IYONG EXCUSE
              </div>

              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "11px",
                    marginBottom: "4px",
                  }}
                >
                  📍 REASON:
                </div>
                <div
                  style={{
                    color: "white",
                    fontWeight: 700,
                    fontSize: "16px",
                  }}
                >
                  {selectedExcuse.situation}
                </div>
              </div>

              <div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "11px",
                    marginBottom: "4px",
                  }}
                >
                  💬 EXCUSE:
                </div>
                <div
                  style={{
                    color: "white",
                    fontSize: "15px",
                    lineHeight: 1.6,
                  }}
                >
                  {selectedExcuse.excuse}
                </div>
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => void handleCopy()}
                className="flex-1 rounded-xl border bg-white py-3 text-xs font-bold"
                style={{ borderColor: ORANGE, color: ORANGE }}
              >
                {hasCopied ? "✅ Nakopya!" : "📋 Kopyahin"}
              </button>
              <button
                type="button"
                onClick={() => void handleShareImage()}
                disabled={isCapturing}
                className="flex-1 rounded-xl py-3 text-xs font-bold text-white disabled:opacity-60"
                style={{ backgroundColor: ORANGE }}
              >
                {isCapturing ? "⏳..." : "📸 I-save"}
              </button>
              <button
                type="button"
                onClick={() => void handleShareText()}
                className="flex-1 rounded-xl border bg-white py-3 text-xs font-bold"
                style={{ borderColor: ORANGE, color: ORANGE }}
              >
                📤 I-share
              </button>
            </div>
          </section>
        )}

        {isUsingBackup && (
          <p className="mt-2 text-center text-xs text-gray-400">
            📦 Classic excuses (offline mode)
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
        id="excuse-card"
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          width: "400px",
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          overflow: "hidden",
          fontFamily: "system-ui, -apple-system, sans-serif",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            background: GRADIENT,
            padding: "24px",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.8)",
              marginBottom: "4px",
            }}
          >
            🎭 Pinoy Daily
          </div>
          <div style={{ fontSize: "20px", fontWeight: 800, color: "white" }}>
            Ang Aking Excuse
          </div>
        </div>

        <div style={{ padding: "24px" }}>
          <div
            style={{
              backgroundColor: "#FFF8F0",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "16px",
              borderLeft: "4px solid #E67E22",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "#E67E22",
                marginBottom: "6px",
                letterSpacing: "1px",
              }}
            >
              📍 REASON
            </div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#1a1a1a" }}>
              {selectedExcuse?.situation || ""}
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#F9F9F9",
              borderRadius: "12px",
              padding: "16px",
              borderLeft: "4px solid #F39C12",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "#F39C12",
                marginBottom: "6px",
                letterSpacing: "1px",
              }}
            >
              💬 EXCUSE
            </div>
            <div style={{ fontSize: "15px", color: "#333", lineHeight: 1.6 }}>
              {selectedExcuse?.excuse || ""}
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "12px 24px",
            textAlign: "center",
            fontSize: "11px",
            color: "#aaa",
            borderTop: "1px solid #f0f0f0",
          }}
        >
          pinoy-daily.vercel.app
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
