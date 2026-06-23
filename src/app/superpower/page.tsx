"use client";

import { useEffect, useState } from "react";
import {
  consumeLimit,
  getLimitMessage,
  getLimitStatus,
  releaseLimit,
  type LimitStatus,
} from "@/lib/dailyLimits";
import { initAnalytics } from "@/lib/analytics";
import BottomNav from "@/components/BottomNav";

const PURPLE = "#9B59B6";
const PURPLE_DARK = "#4A0080";

export default function SuperpowerPage() {
  const [superpowers, setSuperpowers] = useState<string[]>([]);
  const [selectedSuperpower, setSelectedSuperpower] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [limitStatus, setLimitStatus] = useState<LimitStatus | null>(null);
  const [hasCopied, setHasCopied] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isUsingBackup, setIsUsingBackup] = useState(false);

  useEffect(() => {
    initAnalytics();
    setLimitStatus(getLimitStatus("aiSuperpower"));
  }, []);

  async function handleGenerate() {
    const consumed = consumeLimit("aiSuperpower");
    if (!consumed) return;

    setIsLoading(true);

    try {
      const res = await fetch("/api/ai-superpower");
      const data = (await res.json()) as {
        superpowers?: unknown[];
        usingBackup?: boolean;
      };

      const parsedSuperpowers = (data.superpowers ?? []).filter(
        (item): item is string => typeof item === "string",
      );

      if (parsedSuperpowers.length === 0) {
        throw new Error("No superpowers returned");
      }

      setSuperpowers(parsedSuperpowers);
      setIsUsingBackup(data.usingBackup ?? false);
      setSelectedSuperpower(parsedSuperpowers[0] ?? null);
      setLimitStatus(getLimitStatus("aiSuperpower"));
    } catch {
      releaseLimit("aiSuperpower");
      setLimitStatus(getLimitStatus("aiSuperpower"));
      alert("Hindi ma-generate ngayon. Subukan ulit!");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCopy() {
    if (!selectedSuperpower) return;

    await navigator.clipboard.writeText(selectedSuperpower);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  }

  async function handleShareImage() {
    setIsCapturing(true);

    try {
      const html2canvas = (await import("html2canvas")).default;
      const element = document.getElementById("superpower-card");

      if (!element) return;

      const canvas = await html2canvas(element, { scale: 2, useCORS: true });

      await new Promise<void>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("Failed to create image"));
            return;
          }

          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "my-superpower.png";
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
      <header
        className="px-5 pt-8 pb-12"
        style={{
          background: `linear-gradient(135deg, ${PURPLE_DARK}, ${PURPLE})`,
        }}
      >
        <h1 className="text-3xl font-black text-white">
          ⚡ Superpower Generator
        </h1>
        <p className="mt-1 text-purple-200">
          Anong kapangyarihan ang para sayo ngayon?
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

      <div className="-mt-6 rounded-t-3xl bg-white px-5 pt-6">
        <section className="py-6 text-center">
          {isExhausted ? (
            <p className="text-sm text-gray-500">
              {limitStatus ? getLimitMessage(limitStatus) : ""}
            </p>
          ) : (
            <>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isLoading || !limitStatus}
                className="rounded-2xl px-8 py-4 text-lg font-bold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                style={{ backgroundColor: PURPLE }}
              >
                {isLoading
                  ? "🦸 Naghahanap ng kapangyarihan..."
                  : "⚡ Kumuha ng Superpower"}
              </button>
              {limitStatus && (
                <p className="mt-2 text-xs text-gray-400">
                  {getLimitMessage(limitStatus)}
                </p>
              )}
            </>
          )}
        </section>

        {superpowers.length > 0 && (
          <section className="mt-4">
            <h2 className="mb-3 font-bold text-gray-900">
              Ang iyong mga kapangyarihan:
            </h2>

            {superpowers.map((superpower) => {
              const isSelected = selectedSuperpower === superpower;

              return (
                <button
                  key={superpower}
                  type="button"
                  onClick={() => setSelectedSuperpower(superpower)}
                  className="mb-3 flex w-full items-center justify-between gap-3 rounded-2xl p-4 text-left shadow-sm transition"
                  style={{
                    borderLeft: `3px solid ${isSelected ? PURPLE : "transparent"}`,
                    backgroundColor: isSelected ? "#F3E8FF" : "#ffffff",
                  }}
                >
                  <span className="flex items-start gap-2 font-medium text-gray-800">
                    <span>⚡</span>
                    <span>{superpower}</span>
                  </span>
                  {isSelected && (
                    <span
                      className="shrink-0 text-lg font-bold"
                      style={{ color: PURPLE }}
                    >
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </section>
        )}

        {selectedSuperpower && (
          <section
            className="mt-4 rounded-2xl p-5"
            style={{
              background: `linear-gradient(135deg, ${PURPLE_DARK}, ${PURPLE})`,
            }}
          >
            <p className="mb-2 text-xs text-purple-200">Ang iyong superpower:</p>
            <p className="text-lg leading-relaxed font-bold text-white">
              {selectedSuperpower}
            </p>
            <p className="mt-2 mb-4 text-xs text-purple-300 italic">
              Gamitin nang may responsibilidad. O huwag.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCopy}
                className="flex-1 rounded-2xl bg-white py-3 text-sm font-bold transition hover:bg-purple-50"
                style={{ color: PURPLE }}
              >
                {hasCopied ? "✅ Nakopya!" : "📋 Kopyahin"}
              </button>
              <button
                type="button"
                onClick={handleShareImage}
                disabled={isCapturing}
                className="flex-1 rounded-2xl border border-white py-3 text-sm font-bold text-white transition hover:bg-white/10 disabled:opacity-60"
              >
                {isCapturing ? "⏳ Ginagawa..." : "📸 I-save bilang Larawan"}
              </button>
            </div>
          </section>
        )}

        {isUsingBackup && (
          <p className="mt-2 text-center text-xs text-gray-400">
            📦 Classic superpowers (offline mode)
          </p>
        )}

        <div
          id="superpower-card"
          style={{
            position: "absolute",
            left: "-9999px",
            top: 0,
            width: "400px",
            height: "400px",
            background: `linear-gradient(135deg, ${PURPLE_DARK}, ${PURPLE})`,
            borderRadius: "24px",
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            fontFamily: "system-ui, sans-serif",
            boxSizing: "border-box",
          }}
        >
          <div style={{ fontSize: "20px", fontWeight: 800, color: "white" }}>
            ⚡ Pinoy Daily
          </div>
          <div
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "white",
              lineHeight: 1.4,
              textAlign: "center",
            }}
          >
            {selectedSuperpower || ""}
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "#C084FC",
              textAlign: "center",
            }}
          >
            pinoy-daily.vercel.app
          </div>
        </div>

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

      <BottomNav />
    </main>
  );
}
