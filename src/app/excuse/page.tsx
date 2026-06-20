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

const ACCENT = "#E67E22";

const PRESETS = [
  { emoji: "😴", label: "Late sa trabaho" },
  { emoji: "📵", label: "Hindi nakita ang text" },
  { emoji: "🏫", label: "Walang homework" },
  { emoji: "🎉", label: "Absent sa event" },
  { emoji: "💸", label: "Walang pera" },
  { emoji: "😷", label: "Ayaw lumabas" },
  { emoji: "📞", label: "Hindi sumasagot ng tawag" },
  { emoji: "🍽️", label: "Hindi nakapag-ulam" },
];

export default function ExcusePage() {
  const [situation, setSituation] = useState("");
  const [excuses, setExcuses] = useState<string[]>([]);
  const [selectedExcuse, setSelectedExcuse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [limitStatus, setLimitStatus] = useState<LimitStatus | null>(null);
  const [hasCopied, setHasCopied] = useState(false);
  const [isUsingBackup, setIsUsingBackup] = useState(false);

  useEffect(() => {
    initAnalytics();
    setLimitStatus(getLimitStatus("aiExcuse"));
  }, []);

  async function handleGenerate() {
    if (!situation.trim()) {
      alert("Anong situation mo? Ilagay mo muna!");
      return;
    }

    const consumed = consumeLimit("aiExcuse");
    if (!consumed) return;

    setIsLoading(true);

    try {
      const res = await fetch(
        `/api/ai-excuse?situation=${encodeURIComponent(situation)}`,
      );
      const data = (await res.json()) as {
        excuses?: unknown[];
        usingBackup?: boolean;
      };

      const parsedExcuses = (data.excuses ?? []).filter(
        (item): item is string => typeof item === "string",
      );

      if (parsedExcuses.length === 0) {
        throw new Error("No excuses returned");
      }

      setExcuses(parsedExcuses);
      setIsUsingBackup(data.usingBackup ?? false);
      setSelectedExcuse(null);
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

    await navigator.clipboard.writeText(selectedExcuse);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  }

  async function handleShare() {
    if (!selectedExcuse) return;

    if (navigator.share) {
      await navigator.share({
        title: "Pinoy Daily Excuse",
        text: `${selectedExcuse}\n\nKumuha ng sariling excuse sa swertengpinoy.app`,
      });
    } else {
      await handleCopy();
    }
  }

  const isExhausted = limitStatus?.isExhausted ?? false;

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <header className="px-5 pt-8 pb-12" style={{ backgroundColor: ACCENT }}>
        <h1 className="text-3xl font-black text-white">🙈 Excuse Generator</h1>
        <p className="mt-1 text-orange-100">
          Handa ka na bang mag-excuse? Tulungan kita.
        </p>
      </header>

      <div className="-mt-6 rounded-t-3xl bg-white px-5 pt-6">
        <section>
          <label
            htmlFor="situation"
            className="mb-2 block text-sm font-bold text-gray-500"
          >
            Anong nangyari?
          </label>
          <textarea
            id="situation"
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            placeholder="hal: late sa trabaho, walang load, natulog sa jeep..."
            rows={3}
            className="w-full rounded-2xl border border-gray-200 p-4 text-gray-900 outline-none focus:border-[#E67E22] focus:ring-2 focus:ring-[#E67E22]/30"
          />
        </section>

        <section className="mt-3">
          <p className="mb-2 text-xs text-gray-400">O piliin ang situation:</p>
          <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex w-max gap-2 pb-1">
              {PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() =>
                    setSituation(`${preset.emoji} ${preset.label}`)
                  }
                  className="shrink-0 rounded-full border px-3 py-2 text-sm font-medium whitespace-nowrap transition hover:bg-orange-50"
                  style={{ borderColor: ACCENT, color: ACCENT }}
                >
                  {preset.emoji} {preset.label}
                </button>
              ))}
            </div>
          </div>
        </section>

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
                disabled={
                  !situation.trim() || isLoading || isExhausted || !limitStatus
                }
                className="w-full rounded-2xl py-4 text-sm font-bold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                style={{ backgroundColor: ACCENT }}
              >
                {isLoading
                  ? "🤖 Nag-iisip ng dahilan..."
                  : "🤖 Gumawa ng Excuse"}
              </button>
              {limitStatus && (
                <p className="mt-2 text-center text-xs text-gray-400">
                  {getLimitMessage(limitStatus)}
                </p>
              )}
            </>
          )}
        </section>

        {excuses.length > 0 && (
          <section className="mt-6">
            <h2 className="mb-3 font-bold text-gray-900">
              Piliin ang iyong excuse:
            </h2>

            {excuses.map((excuse) => {
              const isSelected = selectedExcuse === excuse;

              return (
                <button
                  key={excuse}
                  type="button"
                  onClick={() => setSelectedExcuse(excuse)}
                  className="mb-3 flex w-full items-start justify-between gap-3 rounded-2xl p-4 text-left shadow-sm transition"
                  style={{
                    borderLeft: `3px solid ${isSelected ? ACCENT : "#f0f0f0"}`,
                    backgroundColor: isSelected ? "#FEF3E7" : "#ffffff",
                  }}
                >
                  <span className="font-medium text-gray-800">{excuse}</span>
                  {isSelected && (
                    <span
                      className="shrink-0 text-lg font-bold"
                      style={{ color: ACCENT }}
                    >
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </section>
        )}

        {selectedExcuse && (
          <section
            className="mt-4 rounded-2xl p-4"
            style={{ backgroundColor: "#FEF3E7" }}
          >
            <p className="text-xs font-semibold" style={{ color: ACCENT }}>
              Ang piniling excuse mo:
            </p>
            <p className="mt-1 mb-4 font-semibold text-gray-900">
              {selectedExcuse}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCopy}
                className="flex-1 rounded-2xl border bg-white py-3 text-sm font-bold transition hover:bg-orange-50"
                style={{ borderColor: ACCENT, color: ACCENT }}
              >
                {hasCopied ? "✅ Nakopya!" : "📋 Kopyahin"}
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="flex-1 rounded-2xl py-3 text-sm font-bold text-white transition hover:opacity-95"
                style={{ backgroundColor: ACCENT }}
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

        <div className="mt-6 mb-6 rounded-2xl border border-dashed border-gray-200 p-4 text-center text-sm text-gray-300">
          Advertisement
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
