import { CATEGORIES, getCategoryById, type Category } from "@/data/categories";
import { getUnseenAIPrediction } from "@/lib/seenPredictions";
import { getTodayKey, getUserId } from "@/lib/userIdentity";

function getSeedNumber(
  userId: string,
  categoryId: string,
  todayDate: string,
): number {
  const seed = `${userId}${categoryId}${todayDate}`;
  return [...seed].reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function getDailyPredictionStorageKey(
  userId: string,
  categoryId: string,
  todayDate: string,
): string {
  return `pinoy_daily_static_${userId}_${categoryId}_${todayDate}`;
}

function pickDeterministicPrediction(
  userId: string,
  categoryId: string,
  date: Date,
  predictions: string[],
): string {
  const todayDate = getTodayKey(date);
  const seedNumber = getSeedNumber(userId, categoryId, todayDate);
  return predictions[seedNumber % predictions.length] ?? predictions[0]!;
}

export function getStaticPrediction(categoryId: string, date: Date = new Date()): string {
  const category = getCategoryById(categoryId);

  if (!category || category.predictions.length === 0) {
    return "Magiging maayos ang lahat. Sana.";
  }

  const userId = getUserId();
  const todayDate = getTodayKey(date);

  if (typeof window === "undefined") {
    return pickDeterministicPrediction(userId, categoryId, date, category.predictions);
  }

  const storageKey = getDailyPredictionStorageKey(userId, categoryId, todayDate);

  try {
    const cached = localStorage.getItem(storageKey);

    if (cached && category.predictions.includes(cached)) {
      return cached;
    }

    const chosen = pickDeterministicPrediction(
      userId,
      categoryId,
      date,
      category.predictions,
    );
    localStorage.setItem(storageKey, chosen);
    return chosen;
  } catch {
    return pickDeterministicPrediction(userId, categoryId, date, category.predictions);
  }
}

export function pickUnseenAIPrediction(
  categoryId: string,
  aiPredictions: string[],
): string {
  const userId = getUserId();
  return getUnseenAIPrediction(userId, categoryId, aiPredictions);
}

export function getDailyContentForCategory(
  categoryId: string,
  date: Date = new Date(),
): {
  prediction: string;
  luckyNumber: number;
  category: Category;
} {
  const category = getCategoryById(categoryId);

  if (!category) {
    throw new Error(
      `Unknown category: ${categoryId}. Valid ids: ${CATEGORIES.map((item) => item.id).join(", ")}`,
    );
  }

  const userId = getUserId();
  const todayDate = getTodayKey(date);
  const seedNumber = getSeedNumber(userId, categoryId, todayDate);
  const prediction = getStaticPrediction(categoryId, date);
  const luckyNumber = ((seedNumber * 3 + 7) % 99) + 1;

  return {
    prediction,
    luckyNumber,
    category,
  };
}
