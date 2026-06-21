import { supabase, type FeedbackSubmission } from "@/lib/supabase";
import { getUserId, getTodayKey } from "@/lib/userIdentity";

function getFeedbackStorageKey(): string {
  return `pinoy_feedback_${getTodayKey()}`;
}

export function hasSubmittedToday(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return localStorage.getItem(getFeedbackStorageKey()) !== null;
  } catch {
    return false;
  }
}

export function markSubmittedToday(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(getFeedbackStorageKey(), "1");
  } catch {
    // fail silently
  }
}

export async function submitFeedback(
  data: Omit<FeedbackSubmission, "user_id">,
): Promise<{ success: boolean; error?: string }> {
  try {
    if (hasSubmittedToday()) {
      return { success: false, error: "already_submitted" };
    }

    const userId = getUserId();

    const { error } = await supabase.from("feedback").insert({
      user_id: userId,
      rating: data.rating,
      favorite_feature: data.favorite_feature,
      opinion: data.opinion,
      comment: data.comment || null,
      email: data.email || null,
      page_from: data.page_from || "feedback-page",
    });

    if (error) {
      return { success: false, error: error.message };
    }

    markSubmittedToday();
    return { success: true };
  } catch {
    return { success: false, error: "Unknown error" };
  }
}
