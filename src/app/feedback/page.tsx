"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserId, getTodayKey } from "@/lib/userIdentity";
import { hasSubmittedToday, markSubmittedToday } from "@/lib/feedback";
import { initAnalytics } from "@/lib/analytics";
import BottomNav from "@/components/BottomNav";

const GRADIENT = "linear-gradient(135deg, #2C3E50, #9B59B6)";
const PURPLE = "#9B59B6";

const FEATURES = [
  { id: "predictions", label: "Hula", emoji: "🌟" },
  { id: "excuse", label: "Excuse Generator", emoji: "🙈" },
  { id: "superpower", label: "Superpower Generator", emoji: "⚡" },
  { id: "pickup", label: "Pick Up Line Generator", emoji: "💘" },
  { id: "ulam", label: "Ulam Generator", emoji: "🍚" },
];

const OPINIONS = [
  { id: "great", label: "Nakakatawa at magaling!", emoji: "😂" },
  { id: "good", label: "Okay naman", emoji: "😊" },
  { id: "improve", label: "Pwede pa mapabuti", emoji: "😐" },
  { id: "boring", label: "Boring, kailangan ng dagdag", emoji: "😴" },
  { id: "bug", label: "May bug ako nakita", emoji: "🐛" },
];

function getRatingLabel(value: number): string {
  switch (value) {
    case 1:
      return "😞 Hindi maganda";
    case 2:
      return "😕 Pwede pa";
    case 3:
      return "😊 Okay naman";
    case 4:
      return "😄 Magaling!";
    case 5:
      return "🤩 Sobrang galing!";
    default:
      return "I-tap ang bituin para mag-rate";
  }
}

function getSuccessRatingMessage(value: number): string {
  switch (value) {
    case 5:
      return "Grabe, ang galing!";
    case 4:
      return "Masaya kaming marinig iyan!";
    case 3:
      return "Salamat sa honest na feedback!";
    case 2:
      return "Magpapabuti kami, pangako!";
    case 1:
      return "Pasensya na. Magpapabuti talaga kami.";
    default:
      return "Salamat sa rating mo!";
  }
}

export default function FeedbackPage() {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [favoriteFeature, setFavoriteFeature] = useState<string>("");
  const [opinion, setOpinion] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [error, setError] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    initAnalytics();
    if (hasSubmittedToday()) {
      setAlreadySubmitted(true);
    }
  }, []);

  function isFormValid(): boolean {
    return rating > 0 && favoriteFeature !== "" && opinion !== "";
  }

  async function handleSubmit() {
    if (!isFormValid()) {
      setError("Pakitiyak na nasagutan ang lahat ng required na tanong.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const userId = getUserId();

      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          rating,
          favorite_feature: favoriteFeature,
          opinion,
          comment: comment.trim() || null,
          email: email.trim() || null,
          page_from: "feedback-page",
          client_date: getTodayKey(),
        }),
      });

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        if (data.error === "already_submitted") {
          setAlreadySubmitted(true);
          markSubmittedToday();
          return;
        }
        throw new Error(data.error || "Submission failed");
      }

      markSubmittedToday();
      setIsSubmitted(true);
    } catch {
      setError("May error. Subukan ulit mamaya.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <header className="px-5 pt-8 pb-14" style={{ background: GRADIENT }}>
        <h1 className="text-3xl font-black text-white">💬 Feedback</h1>
        <p className="mt-1 text-sm text-purple-200">
          Sabihin mo sa amin ang iyong nararamdaman.
        </p>
      </header>

      <div className="-mt-8 rounded-t-3xl bg-white px-5 pt-6">
        {alreadySubmitted && (
          <div className="px-4 py-16 text-center">
            <div className="mb-4 text-6xl">✅</div>
            <h2 className="mb-2 text-xl font-bold text-gray-900">
              Salamat sa feedback mo!
            </h2>
            <p className="mb-6 text-sm text-gray-500">
              Nagpadala ka na ng feedback ngayon. Bumalik bukas!
            </p>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="rounded-2xl bg-purple-600 px-8 py-3 font-semibold text-white"
            >
              Bumalik sa App
            </button>
          </div>
        )}

        {!alreadySubmitted && isSubmitted && (
          <div className="px-4 py-16 text-center">
            <div className="mb-6 animate-bounce text-7xl">🎉</div>
            <h2 className="mb-3 text-2xl font-black text-gray-900">Salamat!</h2>
            <p className="mb-2 text-sm leading-relaxed text-gray-600">
              Natanggap namin ang iyong feedback.
            </p>
            <p className="mb-8 text-sm leading-relaxed text-gray-500">
              Gagamitin namin ito para mapabuti ang SwertengPinoy para sa lahat.
            </p>

            <div
              className="mx-auto mb-8 max-w-xs rounded-2xl p-4"
              style={{
                backgroundColor: "#F8F4FF",
                border: `2px solid ${PURPLE}`,
              }}
            >
              <div className="mb-1 text-2xl">
                {"⭐".repeat(rating)}
                {"☆".repeat(5 - rating)}
              </div>
              <div className="text-sm font-semibold text-purple-700">
                {getSuccessRatingMessage(rating)}
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push("/")}
              style={{ background: GRADIENT }}
              className="rounded-2xl px-10 py-4 text-base font-bold text-white"
            >
              Bumalik sa App
            </button>
          </div>
        )}

        {!alreadySubmitted && !isSubmitted && (
          <>
            <section className="mb-8">
              <p className="mb-1 font-bold text-gray-900">
                Paano mo i-rate ang SwertengPinoy?
              </p>
              <p className="mb-4 text-xs text-red-400">Required</p>

              <div className="mb-2 flex justify-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="text-4xl transition-transform hover:scale-110 active:scale-95"
                  >
                    {star <= (hoveredRating || rating) ? "⭐" : "☆"}
                  </button>
                ))}
              </div>

              <p className="text-center text-sm text-gray-500">
                {getRatingLabel(rating)}
              </p>
            </section>

            <div className="mb-8 border-t border-gray-100" />

            <section className="mb-8">
              <p className="mb-1 font-bold text-gray-900">
                Ano ang pinaka-gusto mong feature?
              </p>
              <p className="mb-4 text-xs text-red-400">Required</p>

              {FEATURES.map((feature) => {
                const isSelected = favoriteFeature === feature.id;

                return (
                  <button
                    key={feature.id}
                    type="button"
                    onClick={() => setFavoriteFeature(feature.id)}
                    className="mb-2 flex w-full items-center gap-3 rounded-xl bg-white p-4 text-left shadow-sm transition"
                    style={{
                      border: isSelected
                        ? "2px solid #a855f7"
                        : "1px solid #f3f4f6",
                      backgroundColor: isSelected ? "#faf5ff" : "#ffffff",
                    }}
                  >
                    <span className="text-2xl">{feature.emoji}</span>
                    <span className="flex-1 font-medium text-gray-800">
                      {feature.label}
                    </span>
                    <span
                      className="flex h-5 w-5 items-center justify-center rounded-full border-2"
                      style={{
                        borderColor: isSelected ? PURPLE : "#d1d5db",
                        backgroundColor: isSelected ? PURPLE : "transparent",
                      }}
                    >
                      {isSelected && (
                        <span className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </span>
                  </button>
                );
              })}
            </section>

            <div className="mb-8 border-t border-gray-100" />

            <section className="mb-8">
              <p className="mb-1 font-bold text-gray-900">
                Ano ang naiisip mo sa app?
              </p>
              <p className="mb-4 text-xs text-red-400">Required</p>

              {OPINIONS.map((op) => {
                const isSelected = opinion === op.id;

                return (
                  <button
                    key={op.id}
                    type="button"
                    onClick={() => setOpinion(op.id)}
                    className="mb-2 flex w-full items-center gap-3 rounded-xl bg-white p-4 text-left shadow-sm transition"
                    style={{
                      border: isSelected
                        ? "2px solid #a855f7"
                        : "1px solid #f3f4f6",
                      backgroundColor: isSelected ? "#faf5ff" : "#ffffff",
                    }}
                  >
                    <span className="text-2xl">{op.emoji}</span>
                    <span className="flex-1 font-medium text-gray-800">
                      {op.label}
                    </span>
                    <span
                      className="flex h-5 w-5 items-center justify-center rounded-full border-2"
                      style={{
                        borderColor: isSelected ? PURPLE : "#d1d5db",
                        backgroundColor: isSelected ? PURPLE : "transparent",
                      }}
                    >
                      {isSelected && (
                        <span className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </span>
                  </button>
                );
              })}
            </section>

            <div className="mb-8 border-t border-gray-100" />

            <section className="mb-6">
              <p className="mb-1 font-bold text-gray-900">
                May gusto kang sabihin? (Optional)
              </p>
              <p className="mb-3 text-xs text-gray-400">
                Pwedeng suggestion, bug report, o kahit anong feedback
              </p>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                maxLength={500}
                placeholder="hal. Gusto ko sana ng dark mode... o mas maraming hula tungkol sa pera..."
                className="w-full resize-none rounded-2xl border border-gray-200 p-4 text-sm text-gray-800 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30"
              />
              <p className="mt-1 text-right text-xs text-gray-300">
                {comment.length}/500
              </p>
            </section>

            <section className="mb-8">
              <p className="mb-1 font-bold text-gray-900">
                Pwede kaming makipag-ugnayan sayo? (Optional)
              </p>
              <p className="mb-3 text-xs text-gray-400">
                Para ma-follow up namin kung may bug ka na nireport
              </p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full rounded-xl border border-gray-200 p-4 text-sm text-gray-800 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30"
              />
            </section>

            {error && (
              <p className="mb-4 text-center text-sm text-red-500">{error}</p>
            )}

            <section className="mb-6">
              <button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={isSubmitting || !isFormValid()}
                style={{ background: GRADIENT }}
                className="w-full rounded-2xl py-5 text-base font-bold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "⏳ Isinisend..." : "📨 Ipadala ang Feedback"}
              </button>
              {!isFormValid() && (
                <p className="mt-2 text-center text-xs text-gray-400">
                  Sagutin muna ang lahat ng required
                </p>
              )}
            </section>

            <p className="mb-6 text-center text-xs text-gray-300">
              🔒 Ang iyong feedback ay pribado at gagamitin lamang para mapabuti
              ang app.
            </p>
          </>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
