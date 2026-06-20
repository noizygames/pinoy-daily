import { getDayOfYear } from "@/lib/daily";

const STATIC_FALLBACK = "Walang hula ngayon. Subukan bukas!";
const AI_FALLBACK = "Walang AI hula ngayon. Subukan ulit mamaya!";

function buildSeed(userId: string): number {
  const userSeed = userId
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return userSeed + getDayOfYear();
}

export function getSeenKey(
  userId: string,
  categoryId: string,
  type: string = "static",
): string {
  return `pinoy_seen_${type}_${userId}_${categoryId}`;
}

export function getSeenSet(
  userId: string,
  categoryId: string,
  type: string = "static",
): Set<string> {
  if (typeof window === "undefined") {
    return new Set();
  }

  try {
    const raw = localStorage.getItem(getSeenKey(userId, categoryId, type));

    if (!raw) {
      return new Set();
    }

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return new Set();
    }

    return new Set(parsed.filter((item): item is string => typeof item === "string"));
  } catch {
    return new Set();
  }
}

export function markAsSeen(
  userId: string,
  categoryId: string,
  prediction: string,
  type: string = "static",
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const seen = getSeenSet(userId, categoryId, type);
    seen.add(prediction);
    localStorage.setItem(
      getSeenKey(userId, categoryId, type),
      JSON.stringify([...seen]),
    );
  } catch {
    // fail silently
  }
}

export function resetSeen(
  userId: string,
  categoryId: string,
  type: string = "static",
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(getSeenKey(userId, categoryId, type));
  } catch {
    // fail silently
  }
}

export function getUnseenPrediction(
  userId: string,
  categoryId: string,
  predictions: string[],
): string {
  if (predictions.length === 0) {
    return STATIC_FALLBACK;
  }

  if (typeof window === "undefined") {
    const seed = buildSeed(userId);
    return predictions[seed % predictions.length] ?? STATIC_FALLBACK;
  }

  const seen = getSeenSet(userId, categoryId, "static");
  let unseenPool = predictions.filter((prediction) => !seen.has(prediction));

  if (unseenPool.length === 0) {
    resetSeen(userId, categoryId, "static");
    unseenPool = [...predictions];
  }

  const seed = buildSeed(userId) + seen.size;
  const chosen = unseenPool[seed % unseenPool.length] ?? STATIC_FALLBACK;

  markAsSeen(userId, categoryId, chosen, "static");
  return chosen;
}

export function getUnseenAIPrediction(
  userId: string,
  categoryId: string,
  aiPredictions: string[],
): string {
  if (aiPredictions.length === 0) {
    return aiPredictions[0] ?? AI_FALLBACK;
  }

  if (typeof window === "undefined") {
    const seed = buildSeed(userId);
    return aiPredictions[seed % aiPredictions.length] ?? AI_FALLBACK;
  }

  const seen = getSeenSet(userId, categoryId, "ai");
  let unseenPool = aiPredictions.filter((prediction) => !seen.has(prediction));

  if (unseenPool.length === 0) {
    resetSeen(userId, categoryId, "ai");
    unseenPool = [...aiPredictions];
  }

  const seed = buildSeed(userId) + seen.size;
  const chosen = unseenPool[seed % unseenPool.length] ?? AI_FALLBACK;

  markAsSeen(userId, categoryId, chosen, "ai");
  return chosen;
}

export function getSeenCount(
  userId: string,
  categoryId: string,
  type: string = "static",
): number {
  if (typeof window === "undefined") {
    return 0;
  }

  return getSeenSet(userId, categoryId, type).size;
}
