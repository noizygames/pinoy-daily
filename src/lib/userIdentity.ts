const USER_ID_KEY = "pinoy_daily_user_id";

function isStorageAvailable(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function generateUserId(): string {
  const base = `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
  const randomPart = base.replace(/[^a-z0-9]/gi, "").slice(0, 16).padEnd(16, "0");
  return `user_${randomPart}`;
}

function getUsageStorageKey(featureKey: string, todayKey: string): string {
  return `pinoy_daily_usage_${featureKey}_${todayKey}`;
}

export function getUserId(): string {
  if (!isStorageAvailable()) {
    return `temp_${Date.now()}`;
  }

  const existingId = localStorage.getItem(USER_ID_KEY);
  if (existingId) {
    return existingId;
  }

  const newId = generateUserId();
  localStorage.setItem(USER_ID_KEY, newId);
  return newId;
}

export function getTodayKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getDailyUsage(featureKey: string, date: Date = new Date()): number {
  if (!isStorageAvailable()) {
    return 0;
  }

  const storageKey = getUsageStorageKey(featureKey, getTodayKey(date));
  const rawValue = localStorage.getItem(storageKey);
  const usage = rawValue ? Number.parseInt(rawValue, 10) : 0;

  return Number.isNaN(usage) ? 0 : usage;
}

export function incrementDailyUsage(featureKey: string, date: Date = new Date()): number {
  if (!isStorageAvailable()) {
    return 0;
  }

  const nextUsage = getDailyUsage(featureKey, date) + 1;
  const storageKey = getUsageStorageKey(featureKey, getTodayKey(date));
  localStorage.setItem(storageKey, String(nextUsage));
  return nextUsage;
}

export function decrementDailyUsage(featureKey: string, date: Date = new Date()): number {
  if (!isStorageAvailable()) {
    return 0;
  }

  const nextUsage = Math.max(getDailyUsage(featureKey, date) - 1, 0);
  const storageKey = getUsageStorageKey(featureKey, getTodayKey(date));
  localStorage.setItem(storageKey, String(nextUsage));
  return nextUsage;
}

export function getRemainingUsage(
  featureKey: string,
  dailyLimit: number,
  date: Date = new Date(),
): number {
  const remaining = dailyLimit - getDailyUsage(featureKey, date);
  return Math.max(remaining, 0);
}
