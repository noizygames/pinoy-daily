import { NextRequest, NextResponse } from "next/server";
import { getAIPredictionPrompt, getCategoryById } from "@/data/categories";
import { getBackupPredictions } from "@/data/backupContent";
import {
  getPredictionsFromPool,
  savePredictionsToPool,
} from "@/lib/communityPool";
import { generateWithGPT, parseJsonFromAI } from "@/lib/openai";

const VALID_CATEGORY_IDS = ["love", "money", "savage", "food", "family"] as const;

const AI_INSTRUCTIONS =
  'Generate exactly 5 funny Filipino horoscope predictions for this category. Rules: write in casual Filipino or Tagalog, each prediction is 1 to 2 sentences max, start with something that sounds like a real horoscope then end with a funny Filipino twist, make them very relatable to Filipino daily life, return ONLY a valid JSON array of exactly 5 strings with no other text no markdown no explanation. Example format: ["prediction 1", "prediction 2", "prediction 3", "prediction 4", "prediction 5"]';

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

  const prompt = `${getAIPredictionPrompt(category)}\n\n${AI_INSTRUCTIONS}`;

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
