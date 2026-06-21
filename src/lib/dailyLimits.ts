import {
  getDailyUsage,
  getTodayKey,
  incrementDailyUsage,
  decrementDailyUsage,
} from "@/lib/userIdentity";

export const DAILY_LIMITS = {
  aiPrediction: 10,
  aiExcuse: 5,
  aiSuperpower: 5,
  aiPickupLine: 3,
  aiUlam: 1,
};

export type FeatureKey =
  | "aiPrediction"
  | "aiExcuse"
  | "aiSuperpower"
  | "aiPickupLine"
  | "aiUlam";

export type LimitStatus = {
  used: number;
  limit: number;
  remaining: number;
  isExhausted: boolean;
  resetsAt: string;
};

function getServerSafeLimitStatus(featureKey: FeatureKey): LimitStatus {
  const limit = DAILY_LIMITS[featureKey];
  return {
    used: 0,
    limit,
    remaining: limit,
    isExhausted: false,
    resetsAt: "12:00 AM",
  };
}

export function getLimitStatus(featureKey: FeatureKey): LimitStatus {
  if (typeof window === "undefined") {
    return getServerSafeLimitStatus(featureKey);
  }

  const [year, month, day] = getTodayKey().split("-").map(Number);
  const used = getDailyUsage(featureKey, new Date(year, month - 1, day));
  const limit = DAILY_LIMITS[featureKey];
  const remaining = Math.max(0, limit - used);

  return {
    used,
    limit,
    remaining,
    isExhausted: remaining <= 0,
    resetsAt: "12:00 AM",
  };
}

export function consumeLimit(featureKey: FeatureKey): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const [year, month, day] = getTodayKey().split("-").map(Number);
  const used = getDailyUsage(featureKey, new Date(year, month - 1, day));
  const limit = DAILY_LIMITS[featureKey];
  const remaining = Math.max(0, limit - used);

  if (remaining <= 0) {
    return false;
  }

  incrementDailyUsage(featureKey);
  return true;
}

export function releaseLimit(featureKey: FeatureKey): void {
  if (typeof window === "undefined") {
    return;
  }

  decrementDailyUsage(featureKey);
}

export function getLimitMessage(status: LimitStatus): string {
  if (status.isExhausted) {
    return "Ubos na ang libreng AI ngayon! Bumalik bukas ng 12:00 AM. 😅";
  }

  if (status.remaining <= 3) {
    return `⚠️ ${status.remaining} na lang natitira ngayon!`;
  }

  return `🤖 ${status.remaining} natitira ngayon`;
}
