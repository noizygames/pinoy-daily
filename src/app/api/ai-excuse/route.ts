import { NextRequest, NextResponse } from "next/server";
import { BACKUP_EXCUSES, getRandomBackups } from "@/data/backupContent";
import { getExcusesFromPool, saveExcusesToPool } from "@/lib/communityPool";
import { generateWithGPT, parseJsonFromAI } from "@/lib/openai";

function buildPrompt(situation: string | null): string {
  if (situation) {
    return `Generate exactly 5 funny Filipino excuses for this situation: ${situation}. Rules: write in casual Filipino or Tagalog mix (Taglish is okay), each excuse is 1 to 3 sentences, make them sound almost believable but obviously funny, very relatable to Filipino daily life, return ONLY a valid JSON array of exactly 5 strings with no other text.`;
  }

  return "Generate exactly 5 funny all-purpose Filipino excuses that work for any situation. Same rules. JSON array only.";
}

export async function GET(request: NextRequest) {
  const situation = request.nextUrl.searchParams.get("situation")?.trim() || null;
  const prompt = buildPrompt(situation);

  try {
    const result = await generateWithGPT(prompt);
    const parsedArray = parseJsonFromAI(result);
    const excuses = parsedArray.filter(
      (item): item is string => typeof item === "string",
    );

    void saveExcusesToPool(excuses);

    return NextResponse.json({
      excuses,
      usingBackup: false,
    });
  } catch {
    const communityExcuses = await getExcusesFromPool(5);

    if (communityExcuses.length >= 5) {
      return NextResponse.json(
        { excuses: communityExcuses, usingBackup: true, source: "community" },
        { status: 200 },
      );
    }

    const staticExcuses = getRandomBackups(BACKUP_EXCUSES, 5);
    const mixed = [...communityExcuses, ...staticExcuses].slice(0, 5);

    return NextResponse.json(
      { excuses: mixed, usingBackup: true, source: "static" },
      { status: 200 },
    );
  }
}
