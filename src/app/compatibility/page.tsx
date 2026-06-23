"use client";

import { useState, useEffect } from "react";
import {
  calculateCompatibility,
  getRandomFallbackLines,
  COMPATIBILITY_CATEGORIES,
  type CompatibilityResult,
} from "@/lib/compatibility";
import {
  getLimitStatus,
  consumeLimit,
  getLimitMessage,
  releaseLimit,
  type LimitStatus,
} from "@/lib/dailyLimits";
import { initAnalytics } from "@/lib/analytics";
import BottomNav from "@/components/BottomNav";

type FunnyLines = {
  line1: string;
  line2: string;
  line3: string;
};

const PINK = "#E91E63";
const PURPLE = "#9B59B6";
const GRADIENT = `linear-gradient(135deg, ${PINK}, ${PURPLE})`;

const PREVIEW_CATEGORIES = ["disaster", "mixed", "soulmates"] as const;

export default function CompatibilityPage() {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [funnyLines, setFunnyLines] = useState<FunnyLines | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [limitStatus, setLimitStatus] = useState<LimitStatus | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    initAnalytics();
    setLimitStatus(getLimitStatus("aiCompatibility"));
  }, []);

  useEffect(() => {
    if (!result || !showResult) return;

    setAnimatedPercentage(0);
    const target = result.percentage;
    const duration = 1500;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setAnimatedPercentage(target);
        clearInterval(timer);
      } else {
        setAnimatedPercentage(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [result, showResult]);

  async function handleCalculate() {
    const trimmedName1 = name1.trim();
    const trimmedName2 = name2.trim();

    if (!trimmedName1 || !trimmedName2) {
      if (!trimmedName1 && !trimmedName2) {
        setNameError("Ilagay ang dalawang pangalan bago i-calculate!");
      } else if (!trimmedName1) {
        setNameError("Ilagay muna ang iyong pangalan.");
      } else {
        setNameError("Ilagay muna ang pangalan ng crush mo.");
      }
      return;
    }

    setNameError(null);
    setIsCalculating(true);
    setShowResult(false);
    setFunnyLines(null);
    setUsingFallback(false);

    try {
      const compatResult = calculateCompatibility(trimmedName1, trimmedName2);
      setResult(compatResult);
      setShowResult(true);

      const consumed = consumeLimit("aiCompatibility");

      if (consumed) {
        setIsLoadingAI(true);
        try {
          const params = new URLSearchParams({
            name1: trimmedName1,
            name2: trimmedName2,
            percentage: compatResult.percentage.toString(),
            category: compatResult.category.id,
          });
          const res = await fetch(`/api/ai-compatibility?${params}`, {
            cache: "no-store",
          });

          if (!res.ok) throw new Error(`API error: ${res.status}`);

          const data = (await res.json()) as {
            lines?: FunnyLines;
            usingFallback?: boolean;
          };

          if (data.lines?.line1 && data.lines?.line2 && data.lines?.line3) {
            setFunnyLines(data.lines);
            setUsingFallback(data.usingFallback ?? false);
          } else {
            throw new Error("Invalid lines in response");
          }
        } catch {
          releaseLimit("aiCompatibility");
          setFunnyLines(getRandomFallbackLines(compatResult.category.id));
          setUsingFallback(true);
        } finally {
          setIsLoadingAI(false);
          setLimitStatus(getLimitStatus("aiCompatibility"));
        }
      } else {
        setFunnyLines(getRandomFallbackLines(compatResult.category.id));
        setUsingFallback(true);
        setLimitStatus(getLimitStatus("aiCompatibility"));
      }
    } finally {
      setIsCalculating(false);
    }
  }

  function handleReset() {
    setShowResult(false);
    setResult(null);
    setFunnyLines(null);
    setAnimatedPercentage(0);
    setUsingFallback(false);
    setIsCalculating(false);
    setIsLoadingAI(false);
    setNameError(null);
  }

  async function handleShareImage() {
    setIsCapturing(true);

    try {
      const html2canvas = (await import("html2canvas")).default;
      const element = document.getElementById("compatibility-card");

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
          a.download = `compatibility-${name1}-${name2}.png`
            .toLowerCase()
            .replace(/\s+/g, "-");
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          resolve();
        }, "image/png");
      });
    } catch {
      alert("Hindi ma-save. Subukan ulit!");
    } finally {
      setIsCapturing(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <header
        className="px-5 pt-8 pb-16"
        style={{ background: GRADIENT }}
      >
        <h1 className="text-3xl font-black text-white">❤️ Love Calculator</h1>
        <p className="mt-1 text-sm text-pink-100">
          Gaano kayo ka-compatible?
        </p>
      </header>

      <div className="-mt-8 rounded-t-3xl bg-white px-5 pt-6">
        {!showResult && (
          <>
            <section className="mb-6">
              <label
                htmlFor="name1"
                className="mb-2 block text-sm font-bold text-gray-500"
              >
                Ang iyong pangalan
              </label>
              <input
                id="name1"
                type="text"
                value={name1}
                onChange={(e) => {
                  setName1(e.target.value);
                  setNameError(null);
                }}
                onInput={(e) => {
                  setName1(e.currentTarget.value);
                  setNameError(null);
                }}
                placeholder="Ilagay ang pangalan mo"
                autoComplete="given-name"
                className="w-full rounded-2xl border-2 border-gray-100 p-4 text-lg font-semibold text-gray-900 outline-none focus:border-pink-400"
              />

              <p className="my-3 text-center text-3xl">❤️</p>

              <label
                htmlFor="name2"
                className="mb-2 block text-sm font-bold text-gray-500"
              >
                Pangalan ng crush
              </label>
              <input
                id="name2"
                type="text"
                value={name2}
                onChange={(e) => {
                  setName2(e.target.value);
                  setNameError(null);
                }}
                onInput={(e) => {
                  setName2(e.currentTarget.value);
                  setNameError(null);
                }}
                placeholder="Ilagay ang pangalan ng crush mo"
                autoComplete="name"
                className="w-full rounded-2xl border-2 border-gray-100 p-4 text-lg font-semibold text-gray-900 outline-none focus:border-pink-400"
              />
            </section>

            <p className="mb-6 text-center text-xs text-gray-300">
              💡 Ang result ay base sa pangalan — hindi sa horoscope. Para sa
              entertainment lang!
            </p>

            <button
              type="button"
              onClick={() => void handleCalculate()}
              disabled={isCalculating}
              className="w-full rounded-2xl py-5 text-lg font-black text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ background: GRADIENT }}
            >
              {isCalculating
                ? "💫 Kinakalkula..."
                : "❤️ I-calculate ang Compatibility"}
            </button>

            {nameError && (
              <p
                className="mt-3 rounded-xl bg-pink-50 px-4 py-3 text-center text-sm font-semibold text-pink-600"
                role="alert"
              >
                ⚠️ {nameError}
              </p>
            )}

            {limitStatus && (
              <div className="mt-3 text-center">
                <p className="text-xs text-gray-300">
                  {getLimitMessage(limitStatus)}
                </p>
                <p className="mt-1 text-xs text-gray-300">
                  AI-powered funny reading
                </p>
              </div>
            )}

            <section className="mb-6 mt-8">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-300">
                Mga halimbawa ng result:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {PREVIEW_CATEGORIES.map((id) => {
                  const cat = COMPATIBILITY_CATEGORIES.find((c) => c.id === id);
                  if (!cat) return null;

                  return (
                    <span
                      key={cat.id}
                      className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1.5 text-xs text-gray-400"
                    >
                      {cat.emoji} {cat.label}
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                    </span>
                  );
                })}
              </div>
            </section>
          </>
        )}

        {showResult && result && (
          <section className="mb-4 overflow-hidden rounded-3xl bg-white shadow-lg">
            <div
              className="px-6 pb-10 pt-8"
              style={{
                background: `linear-gradient(135deg, ${result.category.gradientFrom}, ${result.category.gradientTo})`,
              }}
            >
              <p className="text-center text-xl font-bold text-white">
                {result.name1} ❤️ {result.name2}
              </p>
              <div className="mt-3 flex justify-center">
                <span
                  className="rounded-full bg-white px-4 py-1 text-sm font-bold"
                  style={{ color: result.category.color }}
                >
                  {result.category.emoji} {result.category.label}
                </span>
              </div>
            </div>

            <div className="-mt-8 px-6 pb-4 text-center">
              <div className="mx-auto inline-flex flex-col items-center justify-center rounded-full bg-white px-8 py-4 shadow-lg">
                <div className="flex items-baseline justify-center">
                  <span
                    className="text-7xl font-black leading-none"
                    style={{ color: result.category.color }}
                  >
                    {animatedPercentage}
                  </span>
                  <span
                    className="text-3xl font-bold"
                    style={{ color: result.category.color }}
                  >
                    %
                  </span>
                </div>
                <span className="mt-1 text-xs text-gray-400">Compatible</span>
              </div>
            </div>

            <div className="px-6 pb-4">
              <p className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                Ang breakdown ng compatibility:
              </p>
              {result.aspects.map((aspect) => (
                <div
                  key={aspect.label}
                  className="mb-3 flex items-center gap-3"
                >
                  <span className="w-28 shrink-0 text-sm text-gray-700">
                    {aspect.emoji} {aspect.label}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${aspect.score}%`,
                        backgroundColor: result.category.color,
                      }}
                    />
                  </div>
                  <span className="w-10 shrink-0 text-right text-sm font-bold text-gray-600">
                    {aspect.score}%
                  </span>
                </div>
              ))}
            </div>

            <div className="px-6 pb-6">
              {isLoadingAI && (
                <p className="animate-pulse py-4 text-center text-sm text-gray-400">
                  🤖 Binabasa ang inyong kapalaran...
                </p>
              )}

              {!isLoadingAI && funnyLines && (
                <div className="rounded-2xl bg-pink-50 p-4">
                  <p className="mb-3 text-xs font-bold text-pink-400">
                    💬 Ang sabi ng mga bituin:
                  </p>
                  <p className="mb-2 font-semibold text-gray-900">
                    {funnyLines.line1}
                  </p>
                  <p className="mb-2 text-gray-600">{funnyLines.line2}</p>
                  <p className="italic text-gray-500">{funnyLines.line3}</p>
                  {usingFallback && (
                    <p className="mt-2 text-xs text-gray-400">
                      📦 Classic reading
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-3 px-6 pb-6">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 rounded-2xl border-2 py-4 text-sm font-bold"
                style={{ borderColor: PINK, color: PINK }}
              >
                🔄 Subukan Ulit
              </button>
              <button
                type="button"
                onClick={() => void handleShareImage()}
                disabled={isCapturing || !funnyLines}
                className="flex-1 rounded-2xl py-4 text-sm font-bold text-white disabled:opacity-60"
                style={{ background: GRADIENT }}
              >
                {isCapturing ? "⏳ Ginagawa..." : "📸 I-share"}
              </button>
            </div>

            {limitStatus && (
              <p className="pb-4 text-center text-xs text-gray-300">
                {limitStatus.isExhausted
                  ? "Ubos na ang AI readings ngayon. Bumalik bukas!"
                  : `✨ ${limitStatus.remaining} AI readings pa ang natitira ngayon`}
              </p>
            )}
          </section>
        )}

        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <a
            href="/feedback"
            style={{
              fontSize: "13px",
              color: "#9B59B6",
              textDecoration: "none",
            }}
          >
            💬 May feedback? I-tap dito
          </a>
        </div>

        <div className="mb-4 mt-4 rounded-2xl border border-dashed border-gray-200 p-4 text-center text-sm text-gray-300">
          Advertisement
        </div>
      </div>

      {result && funnyLines && (
        <div
          id="compatibility-card"
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
              background: `linear-gradient(135deg, ${result.category.gradientFrom}, ${result.category.gradientTo})`,
              padding: "32px 28px 48px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.8)",
                marginBottom: "8px",
              }}
            >
              ❤️ Pinoy Daily — Love Calculator
            </div>
            <div style={{ fontSize: "22px", fontWeight: 800, color: "white" }}>
              {result.name1} ❤️ {result.name2}
            </div>
          </div>

          <div style={{ textAlign: "center", margin: "-28px 0 16px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                backgroundColor: "white",
                borderRadius: "50%",
                width: "100px",
                height: "100px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
              }}
            >
              <div
                style={{
                  fontSize: "36px",
                  fontWeight: 900,
                  color: result.category.color,
                  lineHeight: 1,
                }}
              >
                {result.percentage}
              </div>
              <div style={{ fontSize: "11px", color: "#aaa" }}>%</div>
            </div>
          </div>

          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <span
              style={{
                display: "inline-block",
                backgroundColor: `${result.category.color}20`,
                color: result.category.color,
                borderRadius: "20px",
                padding: "4px 16px",
                fontSize: "14px",
                fontWeight: 700,
              }}
            >
              {result.category.emoji} {result.category.label}
            </span>
          </div>

          <div
            style={{
              margin: "0 24px 20px",
              backgroundColor: "#FFF5F8",
              borderRadius: "16px",
              padding: "16px",
              borderLeft: `4px solid ${result.category.color}`,
            }}
          >
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: result.category.color,
                marginBottom: "8px",
              }}
            >
              💬 Ang sabi ng mga bituin:
            </div>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#1a1a1a",
                marginBottom: "6px",
              }}
            >
              {funnyLines.line1}
            </div>
            <div
              style={{
                fontSize: "13px",
                color: "#555",
                marginBottom: "6px",
              }}
            >
              {funnyLines.line2}
            </div>
            <div
              style={{
                fontSize: "13px",
                color: "#888",
                fontStyle: "italic",
              }}
            >
              {funnyLines.line3}
            </div>
          </div>

          <div
            style={{
              textAlign: "center",
              padding: "12px 24px 20px",
              fontSize: "11px",
              color: "#bbb",
            }}
          >
            pinoy-daily.vercel.app
          </div>
        </div>
      )}

      <BottomNav />
    </main>
  );
}
