"use client";

import { useEffect, useState } from "react";
import { getTodayContent } from "@/lib/daily";
import {
  getDailyContentForCategory,
  pickUnseenAIPrediction,
} from "@/lib/categoryPredictions";
import { CATEGORIES, type Category } from "@/data/categories";
import { initAnalytics, trackShared, trackViewed } from "@/lib/analytics";
import {
  consumeLimit,
  getLimitMessage,
  getLimitStatus,
  releaseLimit,
  type LimitStatus,
} from "@/lib/dailyLimits";
import ShareCard from "@/components/ShareCard";
import BottomNav from "@/components/BottomNav";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category>(CATEGORIES[0]);
  const [currentPrediction, setCurrentPrediction] = useState("");
  const [isAiMode, setIsAiMode] = useState(false);
  const [aiPrediction, setAiPrediction] = useState<string | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiLimitStatus, setAiLimitStatus] = useState<LimitStatus | null>(null);
  const [hasShared, setHasShared] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [isUsingBackup, setIsUsingBackup] = useState(false);
  const [backupSource, setBackupSource] = useState("");
  const [luckyNumber, setLuckyNumber] = useState(0);
  const [luckyColor, setLuckyColor] = useState({
    name: "",
    hex: "#E91E63",
    english: "",
  });

  useEffect(() => {
    initAnalytics();
    const todayContent = getTodayContent();
    setLuckyNumber(todayContent.luckyNumber);
    setLuckyColor(todayContent.luckyColor);

    const categoryContent = getDailyContentForCategory(CATEGORIES[0].id);
    setCurrentPrediction(categoryContent.prediction);

    setAiLimitStatus(getLimitStatus("aiPrediction"));
    trackViewed(todayContent.dayIndex);
  }, []);

  function handleCategoryChange(category: Category) {
    setSelectedCategory(category);
    const content = getDailyContentForCategory(category.id);
    setCurrentPrediction(content.prediction);
    setIsAiMode(false);
    setAiPrediction(null);
    setIsUsingBackup(false);
    setBackupSource("");
  }

  async function handleAIGenerate() {
    if (!aiLimitStatus || aiLimitStatus.isExhausted) return;

    const consumed = consumeLimit("aiPrediction");
    if (!consumed) return;

    setIsLoadingAI(true);

    try {
      const res = await fetch(
        `/api/ai-prediction?categoryId=${selectedCategory.id}`,
      );
      const data = (await res.json()) as {
        predictions?: string[];
        usingBackup?: boolean;
        source?: string;
      };

      const predictions = (data.predictions ?? []).filter(
        (item): item is string => typeof item === "string",
      );

      if (predictions.length === 0) {
        throw new Error("No predictions");
      }

      const chosenPrediction = pickUnseenAIPrediction(
        selectedCategory.id,
        predictions,
      );

      setAiPrediction(chosenPrediction);
      setIsAiMode(true);
      setIsUsingBackup(data.usingBackup ?? false);
      setBackupSource(data.source ?? "");
      setAiLimitStatus(getLimitStatus("aiPrediction"));
    } catch {
      releaseLimit("aiPrediction");
      setAiLimitStatus(getLimitStatus("aiPrediction"));
      alert("Hindi ma-generate ngayon. Subukan ulit!");
    } finally {
      setIsLoadingAI(false);
    }
  }

  async function handleShare() {
    setIsCapturing(true);

    try {
      const html2canvas = (await import("html2canvas")).default;
      const element = document.getElementById("share-card");

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
          a.download = `swertengpinoy-${new Date().toISOString().split("T")[0]}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          resolve();
        }, "image/png");
      });

      trackShared();
      setHasShared(true);
    } catch {
      alert("Hindi ma-share ngayon. Subukan ulit!");
    } finally {
      setIsCapturing(false);
    }
  }

  const displayPrediction =
    isAiMode && aiPrediction ? aiPrediction : currentPrediction;

  const today = new Date().toLocaleDateString("fil-PH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const todayShort = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const backupLabel =
    backupSource === "community" || backupSource === "mixed"
      ? "🌐 Komunidad"
      : "📦 Backup";

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <header className="px-5 pt-6 pb-3">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-black text-gray-900">🌟 SwertengPinoy</h1>
          <button
            type="button"
            onClick={() => setShowAbout((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg text-gray-500 shadow-sm"
            aria-label="About"
            aria-expanded={showAbout}
          >
            ⓘ
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500">{today}</p>
      </header>

      <div className="px-4 py-3">
        <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-2">
            {CATEGORIES.map((category) => {
              const isSelected = category.id === selectedCategory.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategoryChange(category)}
                  className={`rounded-full px-4 py-2 text-sm transition-all ${
                    isSelected
                      ? "font-semibold text-white"
                      : "bg-gray-100 font-medium text-gray-500"
                  }`}
                  style={
                    isSelected ? { backgroundColor: category.color } : undefined
                  }
                >
                  {category.emoji} {category.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <section
        className="mx-4 mb-4 rounded-3xl bg-white p-6 shadow-sm"
        style={{ borderLeft: `4px solid ${selectedCategory.color}` }}
      >
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
            Ang Hula Mo Ngayon • {selectedCategory.emoji}
          </p>
          {isAiMode && (
            <span
              className="rounded-full px-2 py-1 text-[10px] font-semibold text-white"
              style={{ backgroundColor: selectedCategory.color }}
            >
              ✨ AI
            </span>
          )}
        </div>

        <p className="mt-3 text-xl leading-relaxed font-bold text-gray-900">
          &ldquo;{displayPrediction || "Naglo-load ang hula mo..."}&rdquo;
        </p>

        {isUsingBackup && (
          <p className="mt-2 text-xs text-gray-400">{backupLabel}</p>
        )}
      </section>

      <div className="mx-4 mb-4">
        {aiLimitStatus?.isExhausted ? (
          <p className="text-center text-sm text-gray-500">
            {getLimitMessage(aiLimitStatus)}
          </p>
        ) : (
          <>
            <button
              type="button"
              onClick={handleAIGenerate}
              disabled={isLoadingAI || !aiLimitStatus}
              className="w-full rounded-2xl py-4 text-sm font-bold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
              style={{ backgroundColor: selectedCategory.color }}
            >
              {isLoadingAI
                ? "🤖 Ginagawa ng AI..."
                : `✨ Humingi ng AI Hula (${aiLimitStatus?.remaining ?? 0} natitira)`}
            </button>
            {aiLimitStatus && (
              <p className="mt-2 text-center text-xs text-gray-400">
                {getLimitMessage(aiLimitStatus)}
              </p>
            )}
          </>
        )}
      </div>

      <div className="mx-4 mb-4 flex gap-3">
        <section className="flex-1 rounded-2xl bg-white p-4 text-center shadow-sm">
          <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
            Lucky Number
          </p>
          <p
            className="text-5xl font-black"
            style={{ color: selectedCategory.color }}
          >
            {luckyNumber}
          </p>
        </section>

        <section className="flex-1 rounded-2xl bg-white p-4 text-center shadow-sm">
          <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
            Lucky Color
          </p>
          <span
            className="mx-auto mb-1 block h-10 w-10 rounded-full border border-black/10"
            style={{ backgroundColor: luckyColor.hex }}
          />
          <p className="text-sm font-bold text-gray-900">{luckyColor.name}</p>
          <p className="text-xs text-gray-400">{luckyColor.english}</p>
        </section>
      </div>

      <button
        type="button"
        onClick={handleShare}
        disabled={isCapturing}
        className="mx-4 mb-2 w-[calc(100%-2rem)] rounded-2xl py-5 text-base font-black text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
        style={{ backgroundColor: selectedCategory.color }}
      >
        {isCapturing
          ? "⏳ Ginagawa..."
          : hasShared
            ? "✅ Na-download na!"
            : "📤 I-share ang Hula Ko"}
      </button>

      <p className="mb-6 text-center text-xs text-gray-300">
        I-share sa Facebook, Messenger, Instagram, TikTok, o Viber
      </p>

      {showAbout && (
        <section className="mx-4 mb-6 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-2 font-bold text-gray-900">Tungkol sa App</h2>
          <p className="mb-2 text-sm text-gray-600">
            Bersyon: <span className="font-semibold">1.0.0</span>
          </p>
          <p className="mb-3 text-sm leading-relaxed text-gray-600">
            Ang SwertengPinoy ay nagbibigay ng nakakatawang araw-araw na hula,
            swerteng numero, at swerteng kulay para sa lahat ng Pinoy. Pumili ng
            kategorya, humingi ng AI hula, at i-share ang swerte mo!
          </p>
          <p className="mb-3 text-sm text-gray-600">
            Email:{" "}
            <a
              href="mailto:noizygamesstudio@gmail.com"
              className="font-medium text-gray-900 underline"
            >
              noizygamesstudio@gmail.com
            </a>
          </p>
          <p className="text-sm text-gray-500">
            Privacy: Gumagamit kami ng basic analytics lang (page views at
            shares). Walang personal na impormasyon na kinokolekta.
          </p>
          <div
            style={{
              borderTop: "1px solid #f0f0f0",
              marginTop: "16px",
              paddingTop: "16px",
            }}
          >
            <a
              href="/feedback"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#F8F4FF",
                borderRadius: "12px",
                padding: "12px 16px",
                textDecoration: "none",
                border: "1px solid #E8D5FF",
              }}
            >
              <span style={{ fontSize: "20px" }}>💬</span>
              <div>
                <div
                  style={{ fontSize: "14px", fontWeight: 700, color: "#9B59B6" }}
                >
                  Magpadala ng Feedback
                </div>
                <div style={{ fontSize: "12px", color: "#aaa" }}>
                  Sabihin mo sa amin kung paano mapapabuti ang app
                </div>
              </div>
              <span
                style={{
                  marginLeft: "auto",
                  color: "#9B59B6",
                  fontSize: "16px",
                }}
              >
                →
              </span>
            </a>
          </div>
        </section>
      )}

      <div className="mx-4 mb-6 rounded-2xl border border-dashed border-gray-200 p-4 text-center text-sm text-gray-300">
        Advertisement
      </div>

      <div className="absolute top-0 left-[-9999px]" aria-hidden="true">
        <ShareCard
          prediction={displayPrediction}
          luckyNumber={luckyNumber}
          colorName={luckyColor.name}
          colorHex={luckyColor.hex}
          categoryColor={selectedCategory.color}
          dateString={todayShort}
          categoryEmoji={selectedCategory.emoji}
          categoryLabel={selectedCategory.label}
          isAiGenerated={isAiMode}
        />
      </div>

      <BottomNav />
    </main>
  );
}
