"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getLimitStatus,
  DAILY_LIMITS,
  type FeatureKey,
} from "@/lib/dailyLimits";
import { initAnalytics } from "@/lib/analytics";
import BottomNav from "@/components/BottomNav";

type GeneratorItem = {
  href: string;
  emoji: string;
  label: string;
  description: string;
  featureKey: FeatureKey;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  bgLight: string;
  borderColor: string;
};

type LimitSummary = {
  remaining: number;
  limit: number;
  isExhausted: boolean;
};

const GENERATORS: GeneratorItem[] = [
    {
      href: "/excuse",
      emoji: "🙈",
      label: "Excuse Generator",
      description: "Gumawa ng nakakatawang dahilan para sa lahat ng sitwasyon.",
      featureKey: "aiExcuse",
      color: "#E67E22",
      gradientFrom: "#E67E22",
      gradientTo: "#F39C12",
      bgLight: "#FFF8F0",
      borderColor: "#FFE0D0",
    },
    {
      href: "/superpower",
      emoji: "⚡",
      label: "Superpower Generator",
      description: "Alamin ang iyong nakakatawang superpowers ngayon.",
      featureKey: "aiSuperpower",
      color: "#9B59B6",
      gradientFrom: "#9B59B6",
      gradientTo: "#6C3483",
      bgLight: "#F8F0FF",
      borderColor: "#E8D5FF",
    },
    {
      href: "/pickup",
      emoji: "💘",
      label: "Pick Up Line Generator",
      description: "Mga nakakatawang pick up lines para sa lahat ng okasyon.",
      featureKey: "aiPickupLine",
      color: "#E91E63",
      gradientFrom: "#E91E63",
      gradientTo: "#FF5722",
      bgLight: "#FFF0F5",
      borderColor: "#FFD5E5",
    },
    {
      href: "/ulam",
      emoji: "🍚",
      label: "Ulam Generator",
      description:
        "Isang masustansyang recipe araw-araw. Isang beses lang bawat araw.",
      featureKey: "aiUlam",
      color: "#FF6B35",
      gradientFrom: "#FF6B35",
      gradientTo: "#F7C59F",
      bgLight: "#FFF5F0",
      borderColor: "#FFE0D0",
    },
    {
      href: "/compatibility",
      emoji: "❤️",
      label: "Love Calculator",
      description: "Gaano kayo ka-compatible ng iyong crush? Alamin ngayon!",
      featureKey: "aiCompatibility",
      color: "#E91E63",
      gradientFrom: "#E91E63",
      gradientTo: "#9B59B6",
      bgLight: "#FFF0F5",
      borderColor: "#FFD5E5",
    },
];

function buildLimitStatuses(): Record<string, LimitSummary> {
  const statuses: Record<string, LimitSummary> = {};

  GENERATORS.forEach((gen) => {
    const status = getLimitStatus(gen.featureKey);
    statuses[gen.featureKey] = {
      remaining: status.remaining,
      limit: status.limit,
      isExhausted: status.isExhausted,
    };
  });

  return statuses;
}

const DEFAULT_TOTAL_REMAINING = GENERATORS.reduce(
  (sum, gen) => sum + DAILY_LIMITS[gen.featureKey],
  0,
);

export default function GeneratorsPage() {
  const [limitStatuses, setLimitStatuses] = useState<
    Record<string, LimitSummary>
  >({});
  const [limitsLoaded, setLimitsLoaded] = useState(false);

  const router = useRouter();

  useEffect(() => {
    initAnalytics();

    function refreshStatuses() {
      setLimitStatuses(buildLimitStatuses());
      setLimitsLoaded(true);
    }

    refreshStatuses();

    function onVisibilityChange() {
      if (document.visibilityState === "visible") {
        refreshStatuses();
      }
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  const totalRemaining = limitsLoaded
    ? Object.values(limitStatuses).reduce(
        (sum, status) => sum + status.remaining,
        0,
      )
    : DEFAULT_TOTAL_REMAINING;

  const usagePillColor =
    totalRemaining > 10
      ? "#27AE60"
      : totalRemaining >= 5
        ? "#E67E22"
        : "#E74C3C";

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div
        style={{
          background: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)",
          padding: "32px 20px 56px",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            color: "rgba(255,255,255,0.5)",
            marginBottom: "6px",
            letterSpacing: "2px",
          }}
        >
          PINOY DAILY
        </div>
        <div
          style={{
            fontSize: "30px",
            fontWeight: 900,
            color: "white",
            lineHeight: 1.2,
          }}
        >
          🎮 Mga Generator
        </div>
        <div
          style={{
            fontSize: "14px",
            color: "rgba(255,255,255,0.6)",
            marginTop: "6px",
          }}
        >
          Piliin ang gusto mong gamitin ngayon.
        </div>
      </div>

      <div className="-mt-8 rounded-t-3xl bg-white px-4 pt-6">
        <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-lg">📅</span>
            <span className="flex-1 text-sm font-semibold text-gray-700">
              Ang iyong paggamit ngayon
            </span>
            <span
              style={{
                backgroundColor: usagePillColor,
                color: "white",
                borderRadius: "20px",
                padding: "4px 12px",
                fontSize: "11px",
                fontWeight: 700,
              }}
            >
              {totalRemaining} uses pa
            </span>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3">
          {GENERATORS.map((gen) => {
            const status = limitStatuses[gen.featureKey];
            const hasStatus = status != null;
            const isExhausted = status?.isExhausted ?? false;
            const limit = status?.limit ?? DAILY_LIMITS[gen.featureKey];
            const remaining = hasStatus ? status.remaining : 0;
            const progressPercent = hasStatus
              ? Math.round((remaining / limit) * 100)
              : 0;

            return (
              <button
                key={gen.href}
                type="button"
                onClick={() => router.push(gen.href)}
                style={{
                  backgroundColor: "white",
                  borderRadius: "20px",
                  padding: "20px 16px",
                  border: `1.5px solid ${isExhausted ? "#f0f0f0" : gen.borderColor}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  textAlign: "left",
                  cursor: "pointer",
                  opacity: isExhausted ? 0.7 : 1,
                  width: "100%",
                  transition: "transform 0.1s, box-shadow 0.1s",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  minHeight: "160px",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      fontSize: "36px",
                      lineHeight: 1,
                      filter: isExhausted ? "grayscale(60%)" : "none",
                    }}
                  >
                    {gen.emoji}
                  </div>
                  {isExhausted && (
                    <div
                      style={{
                        backgroundColor: "#f5f5f5",
                        borderRadius: "20px",
                        padding: "2px 8px",
                        fontSize: "10px",
                        color: "#aaa",
                        fontWeight: 600,
                      }}
                    >
                      Bukas na
                    </div>
                  )}
                </div>

                <div>
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: 800,
                      color: isExhausted ? "#aaa" : "#1a1a1a",
                      marginBottom: "4px",
                      lineHeight: 1.2,
                    }}
                  >
                    {gen.label}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#999",
                      lineHeight: 1.4,
                    }}
                  >
                    {gen.description}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      backgroundColor: "#f5f5f5",
                      borderRadius: "4px",
                      height: "4px",
                      marginBottom: "6px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        borderRadius: "4px",
                        backgroundColor: isExhausted ? "#ddd" : gen.color,
                        width: `${progressPercent}%`,
                        transition: "width 0.5s ease",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: isExhausted ? "#bbb" : gen.color,
                    }}
                  >
                    {isExhausted
                      ? gen.featureKey === "aiUlam"
                        ? "Nakita na ngayon"
                        : "Ubos na ngayon"
                      : gen.featureKey === "aiUlam"
                        ? "I-generate ngayon"
                        : hasStatus
                          ? `${remaining} natitira`
                          : "— natitira"}
                  </div>
                </div>
              </button>
            );
          })}

          <div
            style={{
              backgroundColor: "#fafafa",
              borderRadius: "20px",
              padding: "20px 16px",
              border: "1.5px dashed #e0e0e0",
              textAlign: "center",
              minHeight: "160px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                fontSize: "32px",
                filter: "grayscale(100%)",
                opacity: 0.4,
              }}
            >
              🔮
            </div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#ccc" }}>
              Parating Na...
            </div>
            <div style={{ fontSize: "11px", color: "#ddd" }}>Bagong generator</div>
          </div>
        </div>

        <div className="mb-6 rounded-2xl bg-indigo-50 p-4">
          <p className="mb-2 text-sm font-bold text-indigo-700">
            💡 Alam mo ba?
          </p>
          <p className="text-sm leading-relaxed text-indigo-600">
            Ang mga AI limits ay nare-reset araw-araw ng 12:00 AM. Bumalik bukas
            para sa bagong batch ng mga generator!
          </p>
        </div>

        <div className="mb-4 mt-2 rounded-2xl border border-dashed border-gray-200 p-4 text-center text-sm text-gray-300">
          Advertisement
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
