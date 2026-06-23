"use client";

import { useEffect, useState } from "react";
import { initAnalytics } from "@/lib/analytics";
import {
  consumeLimit,
  getLimitMessage,
  getLimitStatus,
  releaseLimit,
  type LimitStatus,
} from "@/lib/dailyLimits";
import BottomNav from "@/components/BottomNav";
import { getTodaysUlamName } from "@/data/ulamList";
import { normalizeUlam, type UlamRecipe } from "@/lib/ulamNormalize";

type Ulam = UlamRecipe;

const ORANGE = "#FF6B35";
const CREAM = "#F7C59F";
const GRADIENT = `linear-gradient(135deg, ${ORANGE}, ${CREAM})`;

function getDifficultyStyle(difficulty: string): {
  backgroundColor: string;
  color: string;
} {
  const level = difficulty.toLowerCase();

  if (level === "easy") {
    return { backgroundColor: "#DCFCE7", color: "#166534" };
  }

  if (level === "hard") {
    return { backgroundColor: "#FEE2E2", color: "#991B1B" };
  }

  return { backgroundColor: "#FFEDD5", color: "#C2410C" };
}

export default function UlamPage() {
  const [ulam, setUlam] = useState<Ulam | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [limitStatus, setLimitStatus] = useState<LimitStatus | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [activeTab, setActiveTab] = useState<"ingredients" | "steps">(
    "ingredients",
  );
  const [hasCopied, setHasCopied] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [alreadyGenerated, setAlreadyGenerated] = useState(false);

  const todaysDishName = getTodaysUlamName();

  async function fetchUlam(cacheOnly: boolean) {
    const url = cacheOnly
      ? "/api/ai-ulam?cacheOnly=true"
      : "/api/ai-ulam";

    const res = await fetch(url, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
    });

    if (!res.ok) throw new Error(`API error: ${res.status}`);

    return (await res.json()) as { ulam?: Ulam | null };
  }

  async function loadTodaysUlam() {
    setIsLoading(true);
    setLoadFailed(false);

    try {
      const data = await fetchUlam(true);
      const normalized = normalizeUlam(data.ulam);

      if (normalized) {
        setUlam(normalized);
      }
    } catch (err) {
      console.error("Failed to load ulam:", err);
      setLoadFailed(true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    initAnalytics();
    const status = getLimitStatus("aiUlam");
    setLimitStatus(status);

    void loadTodaysUlam();
  }, []);

  async function handleGenerate() {
    const consumed = consumeLimit("aiUlam");
    if (!consumed) return;

    setIsLoading(true);
    setUlam(null);

    try {
      const data = await fetchUlam(false);
      const normalized = normalizeUlam(data.ulam);

      if (normalized) {
        setUlam(normalized);
        setAlreadyGenerated(true);
        setLimitStatus(getLimitStatus("aiUlam"));
      } else {
        throw new Error("No ulam in response");
      }
    } catch (err) {
      console.error("Generate ulam error:", err);
      alert("Hindi ma-generate ang ulam ngayon. Subukan ulit!");
      releaseLimit("aiUlam");
      setLimitStatus(getLimitStatus("aiUlam"));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleShareImage() {
    setIsCapturing(true);

    try {
      const html2canvas = (await import("html2canvas")).default;
      const element = document.getElementById("ulam-card");

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
          a.download = `ulam-ngayon-${ulam?.dish_name.replace(/\s+/g, "-").toLowerCase() ?? "recipe"}.png`;
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

  async function handleShareText() {
    if (!ulam) return;

    const ingredientNames = ulam.ingredients.map((ing) => ing.name).join(", ");
    const shareText = `${ulam.dish_name}\n\nMga Sangkap: ${ingredientNames}\n\n${ulam.calories_per_serving} calories per serving\n\nI-discover ang ulam mo ngayon sa swertengpinoy.app`;

    if (navigator.share) {
      await navigator.share({
        title: ulam.dish_name,
        text: shareText,
      });
    } else {
      await navigator.clipboard.writeText(shareText);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    }
  }

  const isExhausted = limitStatus?.isExhausted ?? false;

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <header
        style={{
          background: GRADIENT,
          padding: "32px 20px 56px",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            color: "rgba(255,255,255,0.8)",
            marginBottom: "4px",
          }}
        >
          🍚 ULAM NGAYON
        </div>
        <div
          style={{
            fontSize: "28px",
            fontWeight: 800,
            color: "white",
            lineHeight: 1.2,
          }}
        >
          {ulam ? ulam.dish_name : todaysDishName}
        </div>
        <div
          style={{
            fontSize: "13px",
            color: "rgba(255,255,255,0.8)",
            marginTop: "6px",
          }}
        >
          {new Date().toLocaleDateString("fil-PH", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </div>
      </header>

      <div className="-mt-6 rounded-t-3xl bg-white px-5 pt-6">
        {!ulam && !isLoading && (
          <section className="py-8 text-center">
            <p className="mb-4 text-6xl">{loadFailed ? "😅" : "🍳"}</p>
            <p className="mb-6 text-center text-gray-600">
              {loadFailed
                ? "Hindi ma-load ang ulam mo ngayon."
                : isExhausted
                  ? "Nagamit mo na ang ulam mo ngayon. Balik ka bukas!"
                  : "Handa ka na bang malaman ang ulam mo ngayon?"}
            </p>
            {loadFailed ? (
              <button
                type="button"
                onClick={() => void loadTodaysUlam()}
                className="w-full rounded-2xl py-4 text-sm font-bold text-white transition hover:opacity-95"
                style={{ background: GRADIENT }}
              >
                🔄 Subukan Ulit
              </button>
            ) : isExhausted ? (
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
                  🍚 Ipakita ang Ulam Ngayon
                </button>
                {limitStatus && (
                  <p className="mt-2 text-center text-xs text-gray-400">
                    {getLimitMessage(limitStatus)}
                  </p>
                )}
              </>
            )}
          </section>
        )}

        {isLoading && (
          <section className="py-12 text-center">
            <p className="text-gray-500">🍳 Nagluluto ang AI...</p>
            <p className="mt-2 text-sm text-gray-400">
              Sandali lang, inihahanda ang recipe...
            </p>
          </section>
        )}

        {ulam && !isLoading && (
          <>
            <section className="mb-4 rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <h2 className="flex-1 text-2xl font-black text-gray-900">
                  {ulam.dish_name}
                </h2>
                <span
                  className="shrink-0 rounded-full px-3 py-1 text-xs font-bold"
                  style={getDifficultyStyle(ulam.difficulty)}
                >
                  {ulam.difficulty}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {ulam.description}
              </p>
              <div className="mt-3 flex border-t border-gray-100 pt-3">
                <div className="flex-1 text-center text-sm text-gray-700">
                  🕐 {ulam.cooking_time_minutes} minuto
                </div>
                <div className="flex-1 text-center text-sm text-gray-700">
                  🍽️ {ulam.servings} servings
                </div>
                <div className="flex-1 text-center text-sm font-bold text-orange-500">
                  🔥 {ulam.calories_per_serving} cal/serving
                </div>
              </div>
            </section>

            <div className="mt-4 mb-3 flex border-b border-gray-100">
              <button
                type="button"
                onClick={() => setActiveTab("ingredients")}
                className={`flex-1 pb-3 text-sm font-bold ${
                  activeTab === "ingredients"
                    ? "border-b-2 border-orange-500 text-orange-500"
                    : "text-gray-400"
                }`}
              >
                📋 Mga Sangkap
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("steps")}
                className={`flex-1 pb-3 text-sm font-bold ${
                  activeTab === "steps"
                    ? "border-b-2 border-orange-500 text-orange-500"
                    : "text-gray-400"
                }`}
              >
                👨‍🍳 Paraan ng Pagluluto
              </button>
            </div>

            {activeTab === "ingredients" && (
              <section>
                {ulam.ingredients.length > 0 ? (
                  ulam.ingredients.map((ingredient, index) => (
                    <div key={`${ingredient.name}-${index}`}>
                      <div className="flex items-center justify-between gap-3 py-3">
                        <span className="flex-1 font-medium text-gray-800">
                          {ingredient.name}
                        </span>
                        <span className="font-semibold text-orange-500">
                          {ingredient.amount} {ingredient.unit}
                        </span>
                      </div>
                      {index < ulam.ingredients.length - 1 && (
                        <div className="border-b border-gray-100" />
                      )}
                    </div>
                  ))
                ) : (
                  <p className="py-4 text-center text-sm text-gray-400">
                    Walang nakuhang sangkap. I-tap ang generate button ulit.
                  </p>
                )}
                <p className="mt-3 text-xs text-gray-400">
                  Kabuuang calories:{" "}
                  {ulam.calories_per_serving * ulam.servings} kcal para sa{" "}
                  {ulam.servings} servings
                </p>
              </section>
            )}

            {activeTab === "steps" && (
              <section className="space-y-4">
                {ulam.steps.length > 0 ? (
                  ulam.steps.map((step, index) => (
                    <div key={`${index}-${step.slice(0, 20)}`} className="flex">
                      <span
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: ORANGE }}
                      >
                        {index + 1}
                      </span>
                      <p className="ml-3 flex-1 text-sm leading-relaxed text-gray-700">
                        {step}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="py-4 text-center text-sm text-gray-400">
                    Walang nakuhang steps. I-tap ang generate button ulit.
                  </p>
                )}
              </section>
            )}

            <section className="mt-4 mb-6 flex gap-3">
              <button
                type="button"
                onClick={handleShareImage}
                disabled={isCapturing}
                className="flex-1 rounded-2xl py-3 text-sm font-bold text-white disabled:opacity-60"
                style={{ backgroundColor: ORANGE }}
              >
                {isCapturing ? "⏳ Ginagawa..." : "📸 I-save ang Recipe Card"}
              </button>
              <button
                type="button"
                onClick={handleShareText}
                className="flex-1 rounded-2xl border py-3 text-sm font-bold"
                style={{ borderColor: ORANGE, color: ORANGE }}
              >
                {hasCopied ? "✅ Nakopya!" : "📤 I-share"}
              </button>
            </section>

            {isExhausted && limitStatus && (
              <p className="mb-4 text-center text-xs text-gray-400">
                {getLimitMessage(limitStatus)}
              </p>
            )}
          </>
        )}

        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <a
            href="/feedback"
            style={{ fontSize: "13px", color: "#9B59B6", textDecoration: "none" }}
          >
            💬 May feedback? I-tap dito
          </a>
        </div>

        <div className="mt-4 mb-6 rounded-2xl border border-dashed border-gray-200 p-4 text-center text-sm text-gray-300">
          Advertisement
        </div>
      </div>

      <div
        id="ulam-card"
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          width: "400px",
          height: "560px",
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          overflow: "hidden",
          fontFamily: "system-ui, -apple-system, sans-serif",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
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
              fontSize: "14px",
              color: "rgba(255,255,255,0.8)",
              marginBottom: "4px",
            }}
          >
            🍚 Pinoy Daily
          </div>
          <div style={{ fontSize: "26px", fontWeight: 800, color: "white" }}>
            {ulam?.dish_name}
          </div>
          <div
            style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.9)",
              marginTop: "6px",
            }}
          >
            {ulam?.description}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            backgroundColor: "#FFF8F5",
            padding: "12px 24px",
            justifyContent: "space-around",
            borderBottom: "1px solid #FFE0D0",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "18px", fontWeight: 700, color: ORANGE }}>
              {ulam?.cooking_time_minutes}m
            </div>
            <div style={{ fontSize: "10px", color: "#999" }}>Oras</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "18px", fontWeight: 700, color: ORANGE }}>
              {ulam?.calories_per_serving}
            </div>
            <div style={{ fontSize: "10px", color: "#999" }}>Cal/serving</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "18px", fontWeight: 700, color: ORANGE }}>
              {ulam?.servings}
            </div>
            <div style={{ fontSize: "10px", color: "#999" }}>Servings</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "18px", fontWeight: 700, color: ORANGE }}>
              {ulam?.difficulty}
            </div>
            <div style={{ fontSize: "10px", color: "#999" }}>Hirap</div>
          </div>
        </div>

        <div style={{ padding: "16px 24px", flex: 1 }}>
          <div
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#333",
              marginBottom: "8px",
            }}
          >
            📋 MGA SANGKAP
          </div>
          {ulam?.ingredients.slice(0, 8).map((ing, index) => (
            <div
              key={`${ing.name}-${index}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                color: "#555",
                paddingBottom: "4px",
                borderBottom: "1px solid #f5f5f5",
                marginBottom: "4px",
              }}
            >
              <span>{ing.name}</span>
              <span style={{ color: ORANGE, fontWeight: 600 }}>
                {ing.amount} {ing.unit}
              </span>
            </div>
          ))}
          {ulam && ulam.ingredients.length > 8 && (
            <div style={{ fontSize: "11px", color: "#999", marginTop: "4px" }}>
              + {ulam.ingredients.length - 8} pang sangkap...
            </div>
          )}
        </div>

        <div
          style={{
            padding: "12px 24px",
            backgroundColor: "#FFF8F5",
            textAlign: "center",
            fontSize: "11px",
            color: ORANGE,
          }}
        >
          pinoy-daily.vercel.app
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
