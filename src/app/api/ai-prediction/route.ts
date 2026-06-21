import { NextRequest, NextResponse } from "next/server";
import { getAIPredictionPrompt, getCategoryById } from "@/data/categories";
import { getBackupPredictions } from "@/data/backupContent";
import {
  getPredictionsFromPool,
  savePredictionsToPool,
} from "@/lib/communityPool";
import { generateWithGPT, parseJsonFromAI } from "@/lib/openai";

const VALID_CATEGORY_IDS = ["love", "money", "savage", "food", "family"] as const;

const categoryInstructions: Record<string, string> = {
  love: "Focus on romance, crushes, exes, and relationships. The punchline should involve typical Filipino romantic disappointments — being friend-zoned, exes moving on, one-sided feelings.",
  money: "Focus on finances, salary, utang, and saving money. The punchline should involve Filipino money struggles — spending before saving, unexpected expenses, borrowing from others.",
  savage: "Be more brutal and direct. Roast the reader gently about laziness, procrastination, and self-delusion. The punchline should be a reality check about the reader themselves.",
  food: "Focus on eating, craving, cooking, and Filipino food culture. The punchline should involve food being expensive, unavailable, or eaten by someone else.",
  family: "Focus on Filipino family dynamics — being asked for money, family reunions, relatives borrowing things, parent pressure. The punchline involves typical kamag-anak behavior.",
};

function buildAIInstructions(categoryId: string): string {
  const categoryContext =
    categoryInstructions[categoryId] ?? categoryInstructions.love;

  return `You are a Filipino humor writer specializing in short horoscope jokes. Your style is sharp, self-aware, and very relatable to everyday Filipino life.

THE FORMAT (strict):
- Two short sentences separated by a period.
- Sentence 1: Sounds like a genuine, hopeful horoscope prediction.
- Sentence 2: The punchline — a short, brutal, funny twist that subverts Sentence 1.
- Total length: under 15 words combined.
- End with a period.

THE STYLE:
- Humor comes from Filipino resignation, irony, and self-deprecation.
- References to everyday Filipino struggles: utang, traffic, food, load, family pressure, work.
- Never explain the joke. Never use exclamation marks. Never be dramatic.
- The shorter the punchline, the harder it lands.

WHAT MAKES IT WORK (study these):
- "Makakahanap ka ng pera. Sukli pala." ← 5 words then 2 words. Perfect ratio.
- "May good news na darating. Hindi para sayo." ← hope then immediate denial.
- "Yayaman ka raw. Sa panaginip." ← affirmation then Filipino reality check.
- "Darating ang taong para sayo. Delivery rider." ← romantic setup, mundane punchline.
- "Magiging sikat ka ngayon. Sa grupo chat." ← ambition then tiny scale.

WHAT TO AVOID:
- Do not write more than 2 sentences.
- Do not use the word "ngunit", "subalit", or "gayunpaman".
- Do not end with "Handa ka na ba?" or any question.
- Do not be poetic or flowery.
- Do not repeat any example above.

CATEGORY CONTEXT: ${categoryContext}

Generate exactly 5 predictions following this format. Return ONLY a valid JSON array of 5 strings. No markdown, no explanation, no extra text.
["prediction 1", "prediction 2", "prediction 3", "prediction 4", "prediction 5"]`;
}

export async function GET(request: NextRequest) {
  const categoryId = request.nextUrl.searchParams.get("categoryId");

  if (
    !categoryId ||
    !VALID_CATEGORY_IDS.includes(
      categoryId as (typeof VALID_CATEGORY_IDS)[number],
    )
  ) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  const category = getCategoryById(categoryId);

  if (!category) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  const prompt = `${getAIPredictionPrompt(category)}\n\n${buildAIInstructions(categoryId)}`;

  try {
    const result = await generateWithGPT(prompt);
    const parsedArray = parseJsonFromAI(result);
    const predictions = parsedArray.filter(
      (item): item is string => typeof item === "string",
    );

    void savePredictionsToPool(categoryId, predictions);

    return NextResponse.json({
      predictions,
      usingBackup: false,
      source: "ai",
    });
  } catch {
    const communityPredictions = await getPredictionsFromPool(categoryId, 5);

    if (communityPredictions.length >= 5) {
      return NextResponse.json(
        {
          predictions: communityPredictions,
          usingBackup: true,
          source: "community",
          message: "Hula mula sa komunidad!",
        },
        { status: 200 },
      );
    }

    const staticBackups = getBackupPredictions(categoryId, 5);
    const mixed = [...communityPredictions, ...staticBackups].slice(0, 5);

    return NextResponse.json(
      {
        predictions: mixed,
        usingBackup: true,
        source:
          mixed.length > 0 && communityPredictions.length > 0 ? "mixed" : "static",
        message: "Backup hula muna!",
      },
      { status: 200 },
    );
  }
}
