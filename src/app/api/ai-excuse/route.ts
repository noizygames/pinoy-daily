import { NextRequest, NextResponse } from "next/server";
import { BACKUP_EXCUSES, getRandomBackups } from "@/data/backupContent";
import { getExcusesFromPool, saveExcusesToPool } from "@/lib/communityPool";
import { generateWithGPT, parseJsonFromAI } from "@/lib/openai";

function buildPrompt(situation: string | null): string {
  if (situation) {
    return `You are a Filipino excuse writer. Your job is to write excuses that sound almost believable but are obviously funny. 

THE FORMAT:
- 1 to 2 sentences maximum.
- It should sound like a real excuse someone would actually try to use.
- The humor comes from it being slightly too specific, too dramatic, or too absurd to be true — but still very Filipino.

WHAT WORKS:
- "Nag-alarm po ako pero nag-snooze yung puso ko." ← emotional but absurd
- "May na-stroke ang wifi namin kanina tapos kasabay pa ng brownout." ← very Filipino, layered excuses
- "Naghintay ako ng jeep pero parang ang jeep ay hindi naghihintay sa akin." ← philosophical and relatable
- "Nakalimutan ko ang oras dahil ang oras ay isang social construct." ← too smart, obviously fake

WHAT TO AVOID:
- Do not just say "Natulog ako" — too simple, not funny.
- Do not use formal Filipino — keep it casual Taglish.
- Do not be offensive.
- The excuse should fit the situation given.

SITUATION: ${situation}

Generate exactly 5 different excuses for this situation. Return ONLY a valid JSON array of 5 strings.`;
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
