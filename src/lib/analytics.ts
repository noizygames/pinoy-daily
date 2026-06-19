import posthog from "posthog-js";

let initialized = false;

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function initAnalytics(): void {
  if (typeof window === "undefined" || initialized || !posthogKey) {
    return;
  }

  posthog.init(posthogKey, {
    api_host: posthogHost,
  });

  initialized = true;
}

export function trackViewed(dayIndex: number): void {
  if (typeof window === "undefined" || !initialized) {
    return;
  }

  posthog.capture("prediction_viewed", {
    date: getTodayDateString(),
    day_index: dayIndex,
  });
}

export function trackShared(): void {
  if (typeof window === "undefined" || !initialized) {
    return;
  }

  posthog.capture("prediction_shared", {
    date: getTodayDateString(),
  });
}
